import GDBooking from '../models/GDBooking.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import PricingSection from '../models/PricingSection.js';
import { getPricingSection } from '../services/domain/pricingService.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { handleControllerError } from '../utils/errorHandler.js';

/**
 * Get GD plans from PricingSection DB (dynamic pricing)
 * Falls back to hardcoded defaults if none exist in DB.
 */
async function getGDPlansFromDB() {
  const pricingSection = await getPricingSection();
  if (!pricingSection) return {};

  const gdServices = pricingSection.services.filter(s => s.id && s.id.startsWith('gd-'));
  const plans = {};
  for (const svc of gdServices) {
    const memberCount = svc.memberCount || 4;
    const pricePerMember = svc.pricePerMember || Math.round(svc.price / memberCount);

    // Compute discounted total if discount is active
    let totalAmount = svc.price;
    if (svc.discount?.isActive && svc.discount?.type !== 'none') {
      const discountAmt = svc.discount.type === 'percentage'
        ? (svc.price * svc.discount.value) / 100
        : svc.discount.value;
      totalAmount = Math.max(0, Math.round(svc.price - discountAmt));
    }

    plans[svc.id] = {
      memberCount,
      pricePerMember,
      totalAmount,
      basePrice: svc.price,
      name: svc.name,
      title: svc.title,
      value: svc.value || '',
      duration: svc.duration || '60 min',
      points: svc.points || [],
      discount: svc.discount || null,
    };
  }
  return plans;
}

/**
 * Get GD plans (public)
 */
export const getPlans = async (req, res) => {
  try {
    const plansMap = await getGDPlansFromDB();
    const plans = Object.entries(plansMap).map(([key, value]) => ({
      id: key,
      ...value,
    }));
    res.json({ success: true, plans });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Create GD booking + Razorpay order
 */
export const createGDBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planType, members, scheduledDate } = req.body;
    console.log(`GD Booking Request: planType=${planType}, membersCount=${members?.length}`);

    // Validate plan from DB
    const plans = await getGDPlansFromDB();
    const plan = plans[planType];
    if (!plan) {
      console.log(`Plan not found: ${planType}`);
      return res.status(400).json({ error: 'Invalid plan type' });
    }

    // Validate members count
    if (!Array.isArray(members) || members.length !== plan.memberCount) {
      return res.status(400).json({
        error: `This plan requires exactly ${plan.memberCount} members`,
      });
    }

    // Validate each member has name and whatsapp
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name || !m.name.trim()) {
        return res
          .status(400)
          .json({ error: `Member ${i + 1}: Name is required` });
      }
      if (!m.whatsapp || !m.whatsapp.trim()) {
        return res
          .status(400)
          .json({ error: `Member ${i + 1}: WhatsApp number is required` });
      }
      // Basic phone validation (10 digits)
      const cleaned = m.whatsapp.replace(/[\s\-\+]/g, '');
      if (!/^[6-9]\d{9}$/.test(cleaned)) {
        return res
          .status(400)
          .json({ error: `Member ${i + 1}: Invalid 10-digit phone number starting with 6-9` });
      }
    }

    // Validate scheduled date
    if (!scheduledDate) {
      return res.status(400).json({ error: 'Scheduled date is required' });
    }
    const schedDate = new Date(scheduledDate);
    if (schedDate <= new Date()) {
      return res
        .status(400)
        .json({ error: 'Scheduled date must be in the future' });
    }

    // Create Razorpay order
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: plan.totalAmount * 100, // amount in paise
      currency: 'INR',
      receipt: `gd_${Date.now()}`,
      notes: {
        planType,
        memberCount: plan.memberCount,
        userId,
      },
    });

    // Create GD booking record
    const gdBooking = new GDBooking({
      userId,
      planType,
      memberCount: plan.memberCount,
      pricePerMember: plan.pricePerMember,
      totalAmount: plan.totalAmount,
      members: members.map((m) => ({
        name: m.name.trim(),
        whatsapp: m.whatsapp.trim(),
      })),
      scheduledDate: schedDate,
      razorpayOrderId: order.id,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await gdBooking.save();

    res.json({
      success: true,
      booking: gdBooking,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Verify GD payment
 */
export const verifyGDPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } =
      req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Update booking to failed
      await GDBooking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'failed',
      });
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Generate meeting link
    const meetingLink = `https://meet.jit.si/yic-gd-session-${bookingId}`;

    // Update booking
    const gdBooking = await GDBooking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: 'completed',
        razorpayPaymentId: razorpay_payment_id,
        status: 'confirmed',
        meetingLink: meetingLink,
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!gdBooking) {
      return res.status(404).json({ error: 'GD Booking not found' });
    }

    // Find the active admin mentor (Neel)
    const adminMentor = await User.findOne({ userType: 'admin', isActive: true });
    const mentorId = adminMentor?._id || (await User.findOne({ userType: 'admin' }))?._id;

    if (!mentorId) {
      console.error('❌ Active admin mentor not found during GD payment verification!');
    } else {
      // Find plans to get the plan title
      const plans = await getGDPlansFromDB();
      const plan = plans[gdBooking.planType];
      const planTitle = plan ? plan.title : 'Group Discussion Session';

      // Create a corresponding entry in the standard Booking collection
      const standardBooking = new Booking({
        studentId: gdBooking.userId._id || gdBooking.userId,
        mentorId: mentorId,
        sessionType: 'gdGroupDiscussions',
        title: `GD Practice - ${planTitle}`,
        description: `Group Discussion practice slot for ${gdBooking.memberCount} members.`,
        scheduledDate: gdBooking.scheduledDate,
        duration: 60,
        meetingLink: meetingLink,
        status: 'confirmed',
        paymentRequired: true,
        amount: gdBooking.totalAmount,
        paymentStatus: 'completed',
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        confirmedAt: new Date(),
      });
      await standardBooking.save();
      console.log(`✅ Standard Booking created for GD Session (${standardBooking._id}) with meeting link ${meetingLink}`);
    }

    res.json({
      success: true,
      message: 'Payment verified and GD session booked successfully',
      booking: gdBooking,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Get user's GD bookings
 */
export const getUserGDBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await GDBooking.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, bookings });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Get all GD bookings (admin)
 */
export const getAllGDBookings = async (req, res) => {
  try {
    const bookings = await GDBooking.find()
      .populate('userId', 'name email mobile')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, bookings });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Update GD booking status (admin)
 */
export const updateGDBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, meetingLink, adminNote } = req.body;

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (meetingLink !== undefined) updates.meetingLink = meetingLink;
    if (adminNote !== undefined) updates.adminNote = adminNote;

    const booking = await GDBooking.findByIdAndUpdate(bookingId, updates, {
      new: true,
    }).populate('userId', 'name email mobile');

    if (!booking) {
      return res.status(404).json({ error: 'GD Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export default {
  getPlans,
  createGDBooking,
  verifyGDPayment,
  getUserGDBookings,
  getAllGDBookings,
  updateGDBookingStatus,
};
