/**
 * Booking Service
 * Handles booking business logic
 */

import Booking from '../../models/Booking.js';
import User from '../../models/User.js';
import Payment from '../../models/Payment.js';
import PricingSection from '../../models/PricingSection.js';
import {  ValidationError, NotFoundError, ConflictError  } from '../../utils/errors.js';
import AuditLogService from '../AuditLogService.js';

/**
 * Get public availability for admin mentor
 */
const getPublicAvailability = async () => {
  const adminMentor = await User.findOne({ userType: 'admin', isActive: true });
  if (!adminMentor) {
    throw new NotFoundError('Mentor not found');
  }

  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const bookings = await Booking.find({
    mentorId: adminMentor._id,
    status: { $in: ['pending', 'confirmed'] },
    scheduledDate: {
      $gte: new Date(),
      $lte: thirtyDaysFromNow,
    },
  }).select('scheduledDate duration');

  const bookedSlots = bookings.map(b => ({
    start: b.scheduledDate,
    end: new Date(b.scheduledDate.getTime() + b.duration * 60 * 1000),
  }));

  return {
    mentorId: adminMentor._id,
    bookedSlots,
  };
};

/**
 * Get available mentors
 */
const getAvailableMentors = async () => {
  // Find mentors: only admin (Neel is the only mentor)
  // Note: "professional" is NOT a mentor type - it's for working professionals who are users/students
  const mentors = await User.find({
    userType: 'admin',
    isActive: true,
  }).select('name email designation company yearsOfExperience skills profileImage bio');

  return mentors;
};

/**
 * Get mentor availability
 */
const getMentorAvailability = async (mentorId) => {
  const mentor = await User.findById(mentorId);
  if (!mentor) {
    throw new NotFoundError('Mentor not found');
  }

  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const bookings = await Booking.find({
    mentorId,
    status: { $in: ['pending', 'confirmed'] },
    scheduledDate: {
      $gte: new Date(),
      $lte: thirtyDaysFromNow,
    },
  }).select('scheduledDate duration');

  const bookedSlots = bookings.map(b => ({
    start: b.scheduledDate,
    end: new Date(b.scheduledDate.getTime() + b.duration * 60 * 1000),
  }));

  return {
    mentor,
    bookedSlots,
  };
};

/**
 * Calculate booking amount from pricing database (server-side)
 */
const calculateBookingAmount = async (sessionType) => {
  const pricingSection = await PricingSection.findOne({ isGlobal: true });
  if (!pricingSection) {
    throw new Error('Pricing not configured');
  }

  const service = pricingSection.services.find(s => s.id === sessionType);
  if (!service) {
    throw new ValidationError('Invalid session type');
  }

  let serverCalculatedAmount = service.price;
  if (service.discount?.isActive && service.discount.type !== 'none') {
    const discountValue = service.discount.type === 'percentage'
      ? (service.price * service.discount.value) / 100
      : service.discount.value;
    serverCalculatedAmount = Math.max(0, service.price - discountValue);
  }

  return serverCalculatedAmount;
};

/**
 * Check for booking conflicts
 */
const checkBookingConflict = async (mentorId, scheduledDate, duration) => {
  const newStart = new Date(scheduledDate);
  const newEnd = new Date(newStart.getTime() + duration * 60 * 1000);

  // Find all bookings for this mentor in pending/confirmed status
  // that could potentially overlap with the requested time slot
  const existingBookings = await Booking.find({
    mentorId,
    status: { $in: ['pending', 'confirmed'] },
    scheduledDate: {
      // Only check bookings that start before our slot ends
      $lt: newEnd,
    },
  });

  // Check each booking for actual overlap
  for (const booking of existingBookings) {
    const existingStart = new Date(booking.scheduledDate);
    const existingEnd = new Date(existingStart.getTime() + booking.duration * 60 * 1000);

    // Two slots overlap if:
    // - New slot starts before existing slot ends AND
    // - New slot ends after existing slot starts
    if (newStart < existingEnd && newEnd > existingStart) {
      return true; // Conflict found
    }
  }

  return false; // No conflicts
};

/**
 * Create booking
 */
const createBooking = async (bookingData, req) => {
  const { userId, mentorId, sessionType, title, description, scheduledDate, duration } = bookingData;

  // Check mentor exists
  const mentor = await User.findById(mentorId);
  if (!mentor || mentor.userType !== 'admin' || !mentor.isActive) {
    await AuditLogService.logBookingAction(
      req,
      'BOOKING_CREATED',
      userId, // Use userId as resourceId for failed bookings
      { sessionType, mentorId },
      'FAILURE',
      'Mentor not found or inactive'
    );
    throw new NotFoundError('Mentor not found or inactive');
  }

  // Calculate server-side amount
  const serverCalculatedAmount = await calculateBookingAmount(sessionType);

  // Check conflicts
  const hasConflict = await checkBookingConflict(mentorId, scheduledDate, duration);
  if (hasConflict) {
    await AuditLogService.logBookingAction(
      req,
      'BOOKING_CREATED',
      userId, // Use userId as resourceId for failed bookings
      { sessionType, mentorId, serverCalculatedAmount },
      'FAILURE',
      'Time slot not available'
    );
    throw new ConflictError('Time slot not available');
  }

  // Calculate amount with GST (18%)
  const baseAmount = serverCalculatedAmount;
  const gstAmount = baseAmount * 0.18;
  const totalAmount = baseAmount + gstAmount;

  // Create booking
  const booking = new Booking({
    studentId: userId,
    mentorId,
    sessionType,
    title: title || `${sessionType} with ${mentor.name}`,
    description,
    scheduledDate: new Date(scheduledDate),
    duration,
    amount: totalAmount, // Store total with GST
    status: 'pending',
    paymentStatus: 'pending',
    paymentRequired: true,
    metadata: {
      baseAmount: baseAmount,
      gstAmount: gstAmount,
      gstPercentage: 18,
    },
  });

  await booking.save();

  await AuditLogService.logBookingAction(
    req,
    'BOOKING_CREATED',
    booking._id,
    { sessionType, mentorId, amount: totalAmount, baseAmount, gstAmount },
    'SUCCESS',
    null
  );

  await booking.populate('mentorId', 'name email designation company profileImage');
  await booking.populate('studentId', 'name email');

  return booking;
};

/**
 * Get bookings for mentor
 */
const getMentorBookings = async (mentorId, filters = {}) => {
  const query = { mentorId, ...filters };
  const bookings = await Booking.find(query)
    .populate('studentId', 'name email profileImage mobile')
    .populate('mentorId', 'name email designation profileImage')
    .sort({ createdAt: -1 });

  return bookings;
};

/**
 * Get students list for mentor
 */
const getMentorStudentsList = async (mentorId) => {
  const students = await Booking.find({
    mentorId,
    status: { $in: ['confirmed', 'completed'] },
  })
    .distinct('studentId')
    .populate('name email profileImage mobile');

  return students;
};

/**
 * Get bookings for student
 */
const getStudentBookings = async (studentId, filters = {}) => {
  const query = { studentId, ...filters };
  const bookings = await Booking.find(query)
    .populate('mentorId', 'name email designation company profileImage')
    .populate('studentId', 'name email')
    .sort({ createdAt: -1 });

  return bookings;
};

/**
 * Get booking by ID
 */
const getBookingById = async (bookingId, userId, userType) => {
  const booking = await Booking.findById(bookingId)
    .populate('mentorId', 'name email designation company profileImage')
    .populate('studentId', 'name email profileImage');

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Authorization check
  // Only admin (Neel) is a mentor, everyone else is a student
  if (userType === 'admin') {
    if (booking.mentorId._id.toString() !== userId) {
      throw new Error('Unauthorized');
    }
  } else {
    if (booking.studentId._id.toString() !== userId) {
      throw new Error('Unauthorized');
    }
  }

  return booking;
};

/**
 * Cancel booking (with automatic refund if payment was completed)
 */
const cancelBooking = async (bookingId, cancelledBy, reason, req) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Check if already in a final state
  if (['completed', 'cancelled'].includes(booking.status)) {
    throw new ValidationError(`Cannot cancel a ${booking.status} booking`);
  }

  // FIX 4: Prevent cancellation during payment processing
  if (booking.paymentLocked) {
    throw new ValidationError('Cannot cancel booking during payment processing');
  }

  const oldStatus = booking.status;
  booking.status = 'cancelled';
  booking.cancelledBy = cancelledBy;
  booking.cancellationReason = reason;
  booking.cancelledAt = new Date();

  await booking.save();

  // Process refund if payment was completed
  let refundInfo = null;
  if (booking.paymentStatus === 'completed' && booking.razorpayPaymentId) {
    try {
      const { default: refundService } = await import('./refundService.js');
      refundInfo = await refundService.processRefund(bookingId, reason, req);
      console.log('✅ Refund processed during cancellation:', refundInfo);
    } catch (error) {
      console.error('⚠️ Refund failed during cancellation:', error.message);
      // Don't block cancellation if refund fails - log it for manual processing
    }
  }

  await AuditLogService.logBookingAction(
    req,
    'BOOKING_CANCELLED',
    booking._id,
    { oldStatus, newStatus: 'cancelled', reason, refundProcessed: !!refundInfo },
    'SUCCESS',
    null
  );

  await booking.populate('mentorId', 'name email');
  await booking.populate('studentId', 'name email');

  return { booking, refundInfo };
};

/**
 * Confirm booking
 */
const confirmBooking = async (bookingId, req) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.status === 'confirmed') {
    throw new ValidationError('Booking is already confirmed');
  }

  const oldStatus = booking.status;
  booking.status = 'confirmed';
  booking.confirmedAt = new Date();

  // Create Zoom meeting if not exists
  if (!booking.meetingLink) {
    try {
      const { default: zoomService } = await import('../../utils/zoomService.js');
      const meeting = await zoomService.create1on1Meeting({
        title: booking.title,
        duration: booking.duration,
      });
      booking.meetingLink = meeting.joinUrl;
      booking.meetingId = meeting.meetingId;
      console.log('✅ Zoom meeting created for booking:', meeting.joinUrl);
    } catch (error) {
      console.error('Failed to create Zoom meeting:', error);
      // Continue without Zoom link - don't block confirmation
    }
  }

  await booking.save();

  await AuditLogService.logBookingAction(
    req,
    'BOOKING_CONFIRMED',
    booking._id,
    { oldStatus, newStatus: 'confirmed' },
    'SUCCESS',
    null
  );

  await booking.populate('mentorId', 'name email');
  await booking.populate('studentId', 'name email');

  return booking;
};

/**
 * Update booking status
 */
const updateBookingStatus = async (bookingId, newStatus, req) => {
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!validStatuses.includes(newStatus)) {
    throw new ValidationError('Invalid status');
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  const oldStatus = booking.status;
  booking.status = newStatus;

  if (newStatus === 'completed') {
    booking.completedAt = new Date();
  }

  await booking.save();

  await AuditLogService.logBookingAction(
    req,
    'BOOKING_STATUS_UPDATED',
    booking._id,
    { oldStatus, newStatus },
    'SUCCESS',
    null
  );

  await booking.populate('mentorId', 'name email');
  await booking.populate('studentId', 'name email');

  return booking;
};

/**
 * Add feedback to booking
 */
const addBookingFeedback = async (bookingId, feedbackData, req) => {
  const { rating, comment } = feedbackData;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.status !== 'completed') {
    throw new ValidationError('Can only add feedback to completed bookings');
  }

  booking.feedback = { rating, comment };
  await booking.save();

  await AuditLogService.logBookingAction(
    req,
    'FEEDBACK_ADDED',
    booking._id,
    { rating },
    'SUCCESS',
    null
  );

  await booking.populate('mentorId', 'name email');
  await booking.populate('studentId', 'name email');

  return booking;
};

export {
  getPublicAvailability,
  getAvailableMentors,
  getMentorAvailability,
  calculateBookingAmount,
  checkBookingConflict,
  createBooking,
  getMentorBookings,
  getMentorStudentsList,
  getStudentBookings,
  getBookingById,
  cancelBooking,
  confirmBooking,
  updateBookingStatus,
  addBookingFeedback,
};
export default {
  getPublicAvailability,
  getAvailableMentors,
  getMentorAvailability,
  calculateBookingAmount,
  checkBookingConflict,
  createBooking,
  getMentorBookings,
  getMentorStudentsList,
  getStudentBookings,
  getBookingById,
  cancelBooking,
  confirmBooking,
  updateBookingStatus,
  addBookingFeedback,
};
