import Payment from '../../models/Payment.js';
import CourseAdvanced from '../../models/CourseAdvanced.js';
import Enrollment from '../../models/Enrollment.js';
import User from '../../models/User.js';
import Booking from '../../models/Booking.js';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import {  ValidationError, NotFoundError, ForbiddenError, PaymentError  } from '../../utils/errors.js';
import redisCacheService from '../redisCacheService.js';

// Lazy initialization - Razorpay instance created on first use
let razorpayInstance = null;
let razorpayKeyId = null;
let razorpayKeySecret = null;

/**
 * Get or create Razorpay instance with lazy initialization
 * This ensures environment variables are loaded before accessing them
 */
const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    // Load credentials from environment
    razorpayKeyId = process.env.RAZORPAY_KEY_ID?.trim();
    razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    console.log('CoursePaymentService Razorpay Config:', {
      keyIdPresent: !!razorpayKeyId,
      keyIdLength: razorpayKeyId?.length,
      keyIdPrefix: razorpayKeyId?.substring(0, 8),
      keySecretPresent: !!razorpayKeySecret,
      keySecretLength: razorpayKeySecret?.length,
    });

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('⚠️ Razorpay credentials missing! Check your .env file');
      throw new PaymentError('Payment gateway not configured. Please check Razorpay credentials.');
    }

    razorpayInstance = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    console.log('✅ Razorpay initialized for course payments');
  }

  return razorpayInstance;
};

/**
 * Get Razorpay key ID
 */
const getRazorpayKeyId = () => {
  if (!razorpayKeyId) {
    getRazorpayInstance(); // This will initialize and load the key
  }
  return razorpayKeyId;
};

/**
 * Create payment order for course purchase
 */
const createCourseOrder = async (userId, courseId, paymentMethod, gstNumber) => {
  if (!courseId || !paymentMethod) {
    throw new ValidationError('Course ID and payment method required');
  }

  // Check if course exists
  const course = await CourseAdvanced.findById(courseId);
  if (!course) {
    throw new NotFoundError('Course not found');
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    userId,
    courseId,
    status: 'active',
  });

  if (existingEnrollment) {
    throw new ValidationError('Already enrolled in this course');
  }

  const user = await User.findById(userId);

  // Calculate amount with GST (18%)
  const baseAmount = course.price;
  const gstAmount = baseAmount * 0.18;
  const totalAmount = baseAmount + gstAmount;
  const amountInPaise = Math.round(totalAmount * 100); // Razorpay expects amount in paise

  if (paymentMethod === 'razorpay') {
    // Get Razorpay instance (lazy initialization)
    const razorpay = getRazorpayInstance();

    // Create Razorpay order
    // Receipt must be <= 40 chars, so use timestamp + short hash
    const receiptId = `rcpt_${Date.now()}_${courseId.toString().substring(0, 10)}`;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId, // Max 40 characters
      payment_capture: 1,
      notes: {
        courseId,
        userId: userId,
        userName: user.name,
        gstNumber: gstNumber || 'N/A',
        baseAmount: baseAmount,
        gstAmount: gstAmount,
        totalAmount: totalAmount,
      },
    };

    console.log('Creating Razorpay order with:', {
      amount: amountInPaise,
      currency: 'INR',
      receipt: options.receipt,
    });

    let order;
    try {
      order = await razorpay.orders.create(options);
      console.log('✅ Razorpay order created:', order.id);
    } catch (razorpayError) {
      console.error('❌ Razorpay order creation failed:', {
        error: razorpayError.error,
        statusCode: razorpayError.statusCode,
        message: razorpayError.error?.description || razorpayError.message,
      });
      throw new PaymentError(
        `Razorpay error: ${razorpayError.error?.description || 'Failed to create order'}. Please check your Razorpay credentials.`
      );
    }

    // Save payment record
    const payment = new Payment({
      userId: userId,
      courseId,
      amount: totalAmount, // Store total amount including GST
      currency: 'INR',
      paymentMethod: 'razorpay',
      razorpay_order_id: order.id,
      status: 'pending',
      gstNumber: gstNumber || null,
      billingName: user.name,
      billingEmail: user.email,
      billingPhone: user.mobile,
      description: `Payment for course: ${course.title}`,
      metadata: {
        baseAmount: baseAmount,
        gstAmount: gstAmount,
        gstPercentage: 18,
      },
    });

    await payment.save();

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id,
      keyId: getRazorpayKeyId(),
      breakdown: {
        baseAmount: baseAmount,
        gstAmount: gstAmount,
        totalAmount: totalAmount,
        gstPercentage: 18,
      },
    };
  } else if (paymentMethod === 'casekaro') {
    // Casekaro payment (for users without GST)
    const payment = new Payment({
      userId: userId,
      courseId,
      amount: totalAmount, // Store total amount including GST
      currency: 'INR',
      paymentMethod: 'casekaro',
      status: 'pending',
      billingName: user.name,
      billingEmail: user.email,
      billingPhone: user.mobile,
      description: `Payment for course: ${course.title}`,
      metadata: {
        baseAmount: baseAmount,
        gstAmount: gstAmount,
        gstPercentage: 18,
      },
    });

    await payment.save();

    return {
      message: 'Casekaro payment integration coming soon',
      paymentId: payment._id,
      breakdown: {
        baseAmount: baseAmount,
        gstAmount: gstAmount,
        totalAmount: totalAmount,
        gstPercentage: 18,
      },
    };
  } else {
    throw new ValidationError('Invalid payment method');
  }
};

/**
 * Verify payment signature
 */
const verifyPaymentSignature = (orderId, paymentId, signature) => {
  // Ensure Razorpay is initialized (this loads the secret)
  getRazorpayInstance();

  if (!razorpayKeySecret) {
    throw new PaymentError('Payment gateway not configured');
  }

  const hmac = crypto.createHmac('sha256', razorpayKeySecret);
  hmac.update(`${orderId}|${paymentId}`);
  const generated_signature = hmac.digest('hex');

  return generated_signature === signature;
};

/**
 * Verify payment and create enrollment
 */
const verifyCoursePayment = async (userId, paymentId, razorpay_payment_id, razorpay_signature) => {
  if (!paymentId || !razorpay_payment_id || !razorpay_signature) {
    throw new ValidationError('Missing payment details');
  }

  // Verify signature
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  const isValidSignature = verifyPaymentSignature(
    payment.razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!isValidSignature) {
    payment.status = 'failed';
    await payment.save();
    throw new PaymentError('Invalid payment signature');
  }

  // Update payment status
  payment.razorpay_payment_id = razorpay_payment_id;
  payment.razorpay_signature = razorpay_signature;
  payment.status = 'completed';
  payment.completedAt = new Date();
  await payment.save();

  // Create or update enrollment
  let enrollment = await Enrollment.findOne({
    userId,
    courseId: payment.courseId,
  });

  if (enrollment) {
    // Reactivate if expired
    enrollment.status = 'active';
    enrollment.enrolledAt = new Date();
    enrollment.expiresAt = null;
    enrollment.enrollmentType = 'paid';
    enrollment.accessLevel = 'full';
  } else {
    enrollment = new Enrollment({
      userId,
      courseId: payment.courseId,
      enrollmentType: 'paid',
      accessLevel: 'full',
      status: 'active',
    });
  }

  await enrollment.save();

  // Update course analytics - increment enrollments and add to revenue
  await CourseAdvanced.findByIdAndUpdate(payment.courseId, {
    $inc: {
      'analytics.enrollments': 1,
      'analytics.revenue': payment.amount
    }
  });

  // Invalidate caches to ensure course shows in "My Learning"
  await redisCacheService.deletePattern(`enrollments:user:${userId}*`);
  await redisCacheService.deletePattern(`courses:published:detail:${payment.courseId}`);
  await redisCacheService.deletePattern(`courses:published:*`);
  await redisCacheService.deletePattern(`courses:list:*`); // Invalidate mentor's course list cache too

  return {
    enrollment,
    invoiceNumber: payment.invoiceNumber,
  };
};

/**
 * Create order for service booking
 */
const createServiceOrder = async (userId, amount, currency, serviceId, serviceName) => {
  // Get Razorpay instance (lazy initialization)
  const razorpay = getRazorpayInstance();

  const options = {
    amount: amount * 100, // Amount in paise
    currency: currency || 'INR',
    receipt: `receipt_service_${userId}_${Date.now()}`,
    payment_capture: 1,
  };

  const order = await razorpay.orders.create(options);

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  };
};

/**
 * Verify service payment and create booking
 */
const verifyServicePayment = async (
  userId,
  userDetails,
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  serviceId,
  amount,
  scheduledDate
) => {
  // Ensure Razorpay is initialized (this loads the secret)
  getRazorpayInstance();

  if (!razorpayKeySecret) {
    throw new PaymentError('Payment gateway not configured');
  }

  // Verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', razorpayKeySecret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    throw new PaymentError('Invalid payment signature');
  }

  // Get the admin mentor (Neel - there's only one)
  const adminMentor = await User.findOne({ userType: 'admin', isActive: true });
  if (!adminMentor) {
    throw new NotFoundError('Mentor not found');
  }

  // Create payment record
  const payment = new Payment({
    userId,
    courseId: null, // Service booking doesn't use courseId
    amount,
    currency: 'INR',
    paymentMethod: 'razorpay',
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    status: 'completed',
    billingName: userDetails.fullName || userDetails.name,
    billingEmail: userDetails.email,
    billingPhone: userDetails.phone || '',
    description: `Service booking - ${serviceId}`,
    metadata: {
      serviceId,
      mentorId: adminMentor._id.toString(),
    },
  });

  await payment.save();

  // Create booking with scheduled date from student selection
  const booking = new Booking({
    studentId: userId,
    mentorId: adminMentor._id,
    sessionType: serviceId,
    title: `${serviceId} Session`,
    description: `Booked through marketplace`,
    scheduledDate: scheduledDate || new Date(Date.now() + 24 * 60 * 60 * 1000),
    duration: 60,
    status: 'pending',
    paymentRequired: true,
    amount,
    paymentId: payment._id,
    paymentStatus: 'completed',
  });

  await booking.save();

  return {
    paymentId: payment._id,
    bookingId: booking._id,
  };
};

/**
 * Get payment history for a user
 */
const getPaymentHistory = async (userId) => {
  return await Payment.find({ userId })
    .populate({
      path: 'courseId',
      model: 'CourseAdvanced',
      select: 'title price description category'
    })
    .sort({ createdAt: -1 });
};

/**
 * Get payment details by ID
 */
const getPaymentById = async (paymentId, userId) => {
  const payment = await Payment.findById(paymentId)
    .populate({
      path: 'courseId',
      model: 'CourseAdvanced',
      select: 'title price description category'
    })
    .populate('userId', 'name email');

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  // Check access
  if (payment.userId._id.toString() !== userId) {
    throw new ForbiddenError('Access denied');
  }

  return payment;
};

/**
 * Generate invoice for completed payment
 */
const generateInvoice = async (paymentId, userId) => {
  const payment = await Payment.findById(paymentId)
    .populate({
      path: 'courseId',
      model: 'CourseAdvanced',
      select: 'title price description'
    })
    .populate('userId', 'name email');

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  if (payment.userId._id.toString() !== userId) {
    throw new ForbiddenError('Access denied');
  }

  if (payment.status !== 'completed') {
    throw new ValidationError('Only completed payments have invoices');
  }

  // Return invoice data
  return {
    invoiceNumber: payment.invoiceNumber,
    date: payment.completedAt,
    billTo: {
      name: payment.billingName,
      email: payment.billingEmail,
      phone: payment.billingPhone,
    },
    gstNumber: payment.gstNumber || 'N/A',
    courseTitle: payment.courseId?.title || 'Course',
    amount: payment.amount,
    currency: payment.currency,
    paymentMethod: payment.paymentMethod,
    status: payment.status,
  };
};

export {
  createCourseOrder,
  verifyCoursePayment,
  createServiceOrder,
  verifyServicePayment,
  getPaymentHistory,
  getPaymentById,
  generateInvoice,
};
export default {
  createCourseOrder,
  verifyCoursePayment,
  createServiceOrder,
  verifyServicePayment,
  getPaymentHistory,
  getPaymentById,
  generateInvoice,
};
