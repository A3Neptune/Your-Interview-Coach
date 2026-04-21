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
 * Get available slots for a specific date
 * Returns only future slots that don't conflict with existing bookings
 */
const getAvailableSlots = async (dateStr) => {
  const mentor = await User.findOne({ userType: 'admin', isActive: true });
  if (!mentor) throw new NotFoundError('Mentor not found');

  const settings      = mentor.availabilitySettings || {};
  let   startHour     = settings.startHour    ?? 9;
  let   endHour       = settings.endHour      ?? 18;
  const slotDuration  = Math.max(1, settings.slotDuration  ?? 60);
  const bufferMinutes = Math.max(0, settings.bufferMinutes ?? 0);
  const daysOff       = settings.daysOff       ?? [];
  const blockedDates  = settings.blockedDates  ?? [];
  const dateOverrides = settings.dateOverrides ?? [];

  // Parse the requested date (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return { mentorId: mentor._id, slotDuration, slots: [] };
  const [year, month, day] = dateStr.split('-').map(Number);

  // Guard: date in the past — compare using IST midnight
  const todayIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  todayIST.setHours(0, 0, 0, 0);
  const requested = new Date(year, month - 1, day);
  if (requested < todayIST) return { mentorId: mentor._id, slotDuration, slots: [] };

  // Guard: more than 30 days away
  const maxDate = new Date(todayIST); maxDate.setDate(maxDate.getDate() + 30);
  if (requested > maxDate) return { mentorId: mentor._id, slotDuration, slots: [] };

  // Guard: explicitly blocked date (takes priority over everything)
  if (blockedDates.includes(dateStr)) return { mentorId: mentor._id, slotDuration, slots: [] };

  // Guard: day of week off
  const dayOfWeek = requested.getDay();
  if (daysOff.includes(dayOfWeek)) return { mentorId: mentor._id, slotDuration, slots: [] };

  // Apply date override for custom hours on this specific date
  const override = dateOverrides.find(o => o.date === dateStr);
  if (override) {
    startHour = override.startHour;
    endHour   = override.endHour;
  }

  // Guard: invalid hour range
  if (startHour >= endHour) return { mentorId: mentor._id, slotDuration, slots: [] };

  // All slot times are in IST (UTC+05:30). Build Date objects using explicit IST offset
  // so they're stored/compared in UTC correctly (IST 9:00 = UTC 03:30).
  const pad = (n) => String(n).padStart(2, '0');
  const makeIST = (y, mo, d, h, m) =>
    new Date(`${y}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(m)}:00+05:30`);

  // Fetch existing bookings for that day (use IST midnight boundaries)
  // Only confirmed OR recently-created pending bookings (within 30 min) block a slot.
  // Stale pending/unpaid bookings do not hold the slot.
  const dayStart        = makeIST(year, month, day, 0, 0);
  const dayEnd          = makeIST(year, month, day, 23, 59);
  const pendingCutoff   = new Date(Date.now() - 30 * 60 * 1000);
  const existingBookings = await Booking.find({
    mentorId: mentor._id,
    scheduledDate: { $gte: dayStart, $lte: dayEnd },
    $or: [
      { status: 'confirmed' },
      { status: 'pending', paymentStatus: 'pending', createdAt: { $gte: pendingCutoff } },
    ],
  }).select('scheduledDate duration').lean();

  const now          = new Date();
  const endBoundary  = makeIST(year, month, day, endHour, 0);
  const increment    = (slotDuration + bufferMinutes) / 60;
  const slots        = [];

  for (let hour = startHour; hour < endHour; hour += increment) {
    // Safety: break if increment is somehow 0 to prevent infinite loop
    if (increment <= 0) break;

    const hh = Math.floor(hour);
    const mm = Math.round((hour % 1) * 60);
    const slotStart = makeIST(year, month, day, hh, mm);
    const slotEnd   = new Date(slotStart.getTime() + slotDuration * 60 * 1000);

    if (slotEnd > endBoundary) break;

    // Skip past slots (for today)
    if (slotEnd <= now) continue;

    // Skip conflicting slots
    const hasConflict = existingBookings.some(b => {
      const bStart = new Date(b.scheduledDate);
      const bEnd   = new Date(bStart.getTime() + b.duration * 60 * 1000);
      return slotStart < bEnd && slotEnd > bStart;
    });

    if (!hasConflict) {
      // Compute end time in IST by offsetting from start IST values
      const endTotalMins = hh * 60 + mm + slotDuration;
      const endHH = Math.floor(endTotalMins / 60) % 24;
      const endMM = endTotalMins % 60;
      slots.push({
        start: `${pad(hh)}:${pad(mm)}`,
        end:   `${pad(endHH)}:${pad(endMM)}`,
      });
    }
  }

  return { mentorId: mentor._id, slotDuration, slots };
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

  const pendingCutoff = new Date(Date.now() - 30 * 60 * 1000);
  const existingBookings = await Booking.find({
    mentorId,
    scheduledDate: { $gte: new Date(newStart.getTime() - 4 * 60 * 60 * 1000), $lt: newEnd },
    $or: [
      { status: 'confirmed' },
      { status: 'pending', paymentStatus: 'pending', createdAt: { $gte: pendingCutoff } },
    ],
  }).select('scheduledDate duration').lean();

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
 * Validate that the requested slot is legitimate.
 * Checks: not past, within 30-day window, working day, duration match,
 * start-time boundary alignment, and session doesn't overrun end hour.
 */
const validateSlotBooking = (mentor, scheduledDate, duration) => {
  const settings      = mentor.availabilitySettings || {};
  let   startHour     = settings.startHour    ?? 9;
  let   endHour       = settings.endHour      ?? 18;
  const slotDuration  = Math.max(1, settings.slotDuration  ?? 60);
  const bufferMinutes = Math.max(0, settings.bufferMinutes ?? 0);
  const daysOff       = settings.daysOff      ?? [];
  const blockedDates  = settings.blockedDates  ?? [];
  const dateOverrides = settings.dateOverrides ?? [];

  const schedDate = new Date(scheduledDate);

  // 1. Reject past time slots
  if (schedDate <= new Date()) {
    throw new ValidationError('Cannot book a past time slot');
  }

  // 2. Extract IST date/time components.
  //    toLocaleString returns the IST wall-clock values; re-parsing as a local Date
  //    lets us read them via getHours()/getMinutes() regardless of server TZ.
  const schedIST    = new Date(schedDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const yearIST     = schedIST.getFullYear();
  const monthIST    = schedIST.getMonth() + 1;
  const dayIST      = schedIST.getDate();
  const hourIST     = schedIST.getHours();
  const minIST      = schedIST.getMinutes();
  const padZ        = (n) => String(n).padStart(2, '0');
  const dateStr     = `${yearIST}-${padZ(monthIST)}-${padZ(dayIST)}`;

  // 3. Within 30-day booking window
  const todayIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  todayIST.setHours(0, 0, 0, 0);
  const maxDate = new Date(todayIST);
  maxDate.setDate(maxDate.getDate() + 30);
  const requestedDay = new Date(yearIST, monthIST - 1, dayIST);
  if (requestedDay > maxDate) {
    throw new ValidationError('Booking too far in advance (30-day maximum)');
  }

  // 4. Not a blocked date or mentor day-off
  const dayOfWeek = new Date(yearIST, monthIST - 1, dayIST).getDay();
  if (daysOff.includes(dayOfWeek)) {
    throw new ValidationError('Mentor is not available on this day of the week');
  }
  if (blockedDates.includes(dateStr)) {
    throw new ValidationError('Mentor is not available on this date');
  }

  // 5. Apply date override (custom hours for specific dates)
  const override = dateOverrides.find(o => o.date === dateStr);
  if (override) {
    startHour = override.startHour;
    endHour   = override.endHour;
  }

  // 6. Duration must match configured slot duration
  if (duration !== slotDuration) {
    throw new ValidationError(`Invalid session duration. Sessions are ${slotDuration} minutes`);
  }

  const slotStartMins  = hourIST * 60 + minIST;
  const incrementMins  = slotDuration + bufferMinutes;

  // 7. Start time must be within working hours
  if (slotStartMins < startHour * 60) {
    throw new ValidationError("Slot starts before mentor's working hours");
  }

  // 8. Start time must align to a valid slot boundary (startHour + n × increment)
  const offsetFromStart = slotStartMins - (startHour * 60);
  if (offsetFromStart % incrementMins !== 0) {
    throw new ValidationError('Slot start time is not on a valid booking boundary');
  }

  // 9. Session end must not exceed endHour — the same rule as getAvailableSlots
  //    (slotEnd > endBoundary uses >, so ending exactly at endHour is allowed)
  const sessionEndMins = slotStartMins + slotDuration;
  if (sessionEndMins > endHour * 60) {
    throw new ValidationError(
      `Session ends at ${Math.floor(sessionEndMins / 60)}:${padZ(sessionEndMins % 60)} which exceeds mentor's working hours (until ${endHour}:00)`
    );
  }
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
      userId,
      { sessionType, mentorId },
      'FAILURE',
      'Mentor not found or inactive'
    );
    throw new NotFoundError('Mentor not found or inactive');
  }

  // Validate slot legitimacy (boundary, working hours, alignment, 30-day window)
  validateSlotBooking(mentor, scheduledDate, duration);

  // Calculate server-side amount
  const serverCalculatedAmount = await calculateBookingAmount(sessionType);

  // Check conflicts with existing bookings
  const hasConflict = await checkBookingConflict(mentorId, scheduledDate, duration);
  if (hasConflict) {
    await AuditLogService.logBookingAction(
      req,
      'BOOKING_CREATED',
      userId,
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
    amount: totalAmount,
    status: 'pending',
    paymentStatus: 'pending',
    paymentRequired: true,
    metadata: {
      baseAmount: baseAmount,
      gstAmount: gstAmount,
      gstPercentage: 18,
    },
  });

  try {
    await booking.save();
  } catch (err) {
    // DB-level race condition: another booking for the exact same slot was saved first
    if (err.code === 11000) {
      throw new ConflictError('This slot was just taken. Please select a different time.');
    }
    throw err;
  }

  await AuditLogService.logBookingAction(
    req,
    'BOOKING_CREATED',
    booking._id,
    { sessionType, mentorId, amount: totalAmount, baseAmount, gstAmount },
    'SUCCESS',
    null
  );

  await booking.populate([{ path: 'mentorId', select: 'name email designation company profileImage' }, { path: 'studentId', select: 'name email' }]);

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
        bookingId: booking._id.toString(),
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
  getAvailableSlots,
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
  getAvailableSlots,
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
