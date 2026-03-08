/**
 * Payment Service
 * Handles payment processing and verification
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';
import Booking from '../../models/Booking.js';
import Payment from '../../models/Payment.js';
import {  ValidationError, NotFoundError, PaymentError  } from '../../utils/errors.js';
import AuditLogService from '../AuditLogService.js';

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

    console.log('PaymentService Razorpay Config:', {
      keyIdPresent: !!razorpayKeyId,
      keyIdLength: razorpayKeyId?.length,
      keySecretPresent: !!razorpayKeySecret,
    });

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('⚠️ Razorpay credentials missing! Check your .env file');
      throw new PaymentError('Payment gateway not configured. Please check Razorpay credentials.');
    }

    razorpayInstance = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    console.log('✅ Razorpay initialized for booking payments');
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
 * Create Razorpay order for booking
 */
const createPaymentOrder = async (bookingId, req) => {
  const razorpay = getRazorpayInstance();

  const booking = await Booking.findById(bookingId)
    .populate('studentId', 'name email mobile');
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.paymentStatus === 'completed') {
    throw new ValidationError('Booking already paid');
  }

  // FIX 4: Lock booking during payment to prevent cancellation
  booking.paymentLocked = true;
  await booking.save();

  // Create Razorpay order
  // Receipt must be <= 40 chars, so use timestamp + short ID
  const receiptId = `bkg_${Date.now()}_${booking._id.toString().substring(0, 8)}`;

  const options = {
    amount: Math.round(booking.amount * 100), // Convert to paise
    currency: 'INR',
    receipt: receiptId, // Max 40 characters
    notes: {
      bookingId: booking._id.toString(),
      studentId: booking.studentId.toString(),
      mentorId: booking.mentorId.toString(),
    },
  };

  try {
    console.log('Creating Razorpay order for booking:', {
      bookingId: booking._id,
      amount: options.amount,
      receipt: options.receipt,
    });

    const order = await razorpay.orders.create(options);

    console.log('✅ Razorpay order created:', order.id);

    // Create payment record with all required fields
    const student = booking.studentId;
    const payment = new Payment({
      bookingId: booking._id,
      userId: student._id || student,
      amount: booking.amount,
      currency: 'INR',
      paymentMethod: 'razorpay',
      razorpayOrderId: order.id,
      razorpay_order_id: order.id,
      status: 'pending',
      billingName: student.name || 'Unknown',
      billingEmail: student.email || 'unknown@example.com',
      billingPhone: student.mobile || '0000000000',
      description: `Payment for ${booking.title || 'Booking'}`,
    });

    await payment.save();

    await AuditLogService.logBookingAction(
      req,
      'BOOKING_PAYMENT_ORDER_CREATED',
      booking._id,
      { orderId: order.id, amount: booking.amount },
      'SUCCESS',
      null
    );

    return {
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      orderId: order.id,
      amount: booking.amount,
      currency: 'INR',
      keyId: getRazorpayKeyId(),
      booking,
    };
  } catch (error) {
    console.error('❌ Razorpay order creation failed:', {
      error: error.error,
      statusCode: error.statusCode,
      message: error.message,
    });

    // Cancel booking if payment order creation fails
    // This frees up the time slot for other users
    booking.status = 'cancelled';
    booking.paymentLocked = false;
    booking.paymentStatus = 'failed';
    await booking.save();

    console.log(`⚠️ Booking ${booking._id} cancelled due to payment order creation failure`);

    const errorMessage = error.error?.description || error.message || 'Failed to create payment order';
    throw new PaymentError(`Razorpay error: ${errorMessage}`);
  }
};

/**
 * Verify Razorpay payment signature
 */
const verifyPaymentSignature = (orderId, paymentId, signature) => {
  // Ensure Razorpay is initialized (this loads the secret)
  getRazorpayInstance();

  if (!razorpayKeySecret) {
    throw new PaymentError('Payment gateway not configured');
  }

  const generatedSignature = crypto
    .createHmac('sha256', razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};

/**
 * Verify and complete payment
 */
const verifyAndCompletePayment = async (paymentData, req) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = paymentData;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.paymentStatus === 'completed') {
    throw new ValidationError('Booking already paid');
  }

  // Verify signature
  const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  if (!isValid) {
    await AuditLogService.logBookingAction(
      req,
      'BOOKING_PAYMENT_VERIFIED',
      booking._id,
      { orderId: razorpay_order_id, paymentId: razorpay_payment_id },
      'FAILURE',
      'Invalid payment signature'
    );
    throw new PaymentError('Payment verification failed');
  }

  // Update booking
  booking.paymentStatus = 'completed'; // Use 'completed' instead of 'paid' to match enum
  booking.status = 'confirmed';
  booking.paymentLocked = false;
  booking.razorpayPaymentId = razorpay_payment_id;
  booking.razorpayOrderId = razorpay_order_id;
  booking.confirmedAt = new Date();

  // Auto-generate Zoom meeting link for confirmed booking
  if (!booking.meetingLink) {
    try {
      const { default: zoomService } = await import('../../utils/zoomService.js');
      const meeting = await zoomService.create1on1Meeting({
        title: booking.title,
        duration: booking.duration,
      });
      booking.meetingLink = meeting.joinUrl;
      booking.meetingId = meeting.meetingId;
      console.log('✅ Zoom meeting created:', meeting.joinUrl);
    } catch (error) {
      console.error('Failed to create Zoom meeting:', error);
      // Continue without Zoom link - don't block payment confirmation
    }
  }

  await booking.save();

  // Update payment record
  await Payment.updateOne(
    { razorpayOrderId: razorpay_order_id },
    {
      $set: {
        razorpayPaymentId: razorpay_payment_id,
        status: 'completed',
        completedAt: new Date(),
      },
    }
  );

  await AuditLogService.logBookingAction(
    req,
    'BOOKING_PAYMENT_VERIFIED',
    booking._id,
    { orderId: razorpay_order_id, paymentId: razorpay_payment_id, amount: booking.amount },
    'SUCCESS',
    null
  );

  await booking.populate('mentorId', 'name email');
  await booking.populate('studentId', 'name email');

  return booking;
};

export {
  createPaymentOrder,
  verifyPaymentSignature,
  verifyAndCompletePayment,
};
export default {
  createPaymentOrder,
  verifyPaymentSignature,
  verifyAndCompletePayment,
};
