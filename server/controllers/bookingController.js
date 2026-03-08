/**
 * Booking Controller
 * Handles HTTP requests for bookings
 */

import bookingService from '../services/domain/bookingService.js';
import paymentService from '../services/domain/paymentService.js';
import {  handleControllerError  } from '../utils/errorHandler.js';

/**
 * Get public availability
 * GET /api/bookings/public/availability
 */
export const getPublicAvailability = async (req, res) => {
  try {
    const availability = await bookingService.getPublicAvailability();
    res.json({ success: true, ...availability });
  } catch (error) {
    console.error('Error fetching availability:', error);
    handleControllerError(res, error);
  }
};

/**
 * Get available mentors
 * GET /api/bookings/mentors
 */
export const getAvailableMentors = async (req, res) => {
  try {
    const mentors = await bookingService.getAvailableMentors();
    res.json({ success: true, mentors });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    handleControllerError(res, error);
  }
};

/**
 * Get mentor availability
 * GET /api/bookings/mentors/:mentorId/availability
 */
export const getMentorAvailability = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const availability = await bookingService.getMentorAvailability(mentorId);
    res.json({ success: true, ...availability });
  } catch (error) {
    console.error('Error fetching availability:', error);
    handleControllerError(res, error);
  }
};

/**
 * Create booking
 * POST /api/bookings/
 */
export const createBooking = async (req, res) => {
  try {
    const { mentorId, sessionType, title, description, scheduledDate } = req.body;
    const { duration } = req.validated;
    const userId = req.user.id || req.user._id;

    const bookingData = {
      userId,
      mentorId,
      sessionType,
      title,
      description,
      scheduledDate,
      duration,
    };

    const booking = await bookingService.createBooking(bookingData, req);
    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    handleControllerError(res, error);
  }
};

/**
 * Get mentor bookings
 * GET /api/bookings/mentor
 */
export const getMentorBookings = async (req, res) => {
  try {
    const mentorId = req.user.id || req.user._id;
    const bookings = await bookingService.getMentorBookings(mentorId);
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching mentor bookings:', error);
    handleControllerError(res, error);
  }
};

/**
 * Get mentor students list
 * GET /api/bookings/mentor/students/list
 */
export const getMentorStudentsList = async (req, res) => {
  try {
    const mentorId = req.user.id || req.user._id;
    const students = await bookingService.getMentorStudentsList(mentorId);
    res.json({ success: true, students });
  } catch (error) {
    console.error('Error fetching students:', error);
    handleControllerError(res, error);
  }
};

/**
 * Get student bookings
 * GET /api/bookings/student
 */
export const getStudentBookings = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const bookings = await bookingService.getStudentBookings(studentId);
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching student bookings:', error);
    handleControllerError(res, error);
  }
};

/**
 * Get booking by ID
 * GET /api/bookings/:bookingId
 */
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id || req.user._id;
    const userType = req.user.userType;

    const booking = await bookingService.getBookingById(bookingId, userId.toString(), userType);
    res.json({ success: true, booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    handleControllerError(res, error);
  }
};

/**
 * Cancel booking
 * PUT /api/bookings/:bookingId/cancel
 */
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id || req.user._id;
    const userType = req.user.userType;

    const cancelledBy = userType === 'admin' ? 'mentor' : 'student';

    const booking = await bookingService.cancelBooking(bookingId, cancelledBy, reason, req);
    res.json({ success: true, booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    handleControllerError(res, error);
  }
};

/**
 * Confirm booking
 * PUT /api/bookings/:bookingId/confirm
 */
export const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await bookingService.confirmBooking(bookingId, req);
    res.json({ success: true, booking });
  } catch (error) {
    console.error('Error confirming booking:', error);
    handleControllerError(res, error);
  }
};

/**
 * Update booking status
 * PUT /api/bookings/:bookingId/status
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(bookingId, status, req);
    res.json({ success: true, booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    handleControllerError(res, error);
  }
};

/**
 * Add feedback to booking
 * PUT /api/bookings/:bookingId/feedback
 */
export const addBookingFeedback = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, comment } = req.body;
    const booking = await bookingService.addBookingFeedback(bookingId, { rating, comment }, req);
    res.json({ success: true, booking });
  } catch (error) {
    console.error('Error adding feedback:', error);
    handleControllerError(res, error);
  }
};

/**
 * Create payment order
 * POST /api/bookings/:bookingId/create-payment
 */
export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const paymentData = await paymentService.createPaymentOrder(bookingId, req);
    res.json({ success: true, ...paymentData });
  } catch (error) {
    console.error('Error creating payment order:', error);
    handleControllerError(res, error);
  }
};

/**
 * Verify payment
 * POST /api/bookings/:bookingId/verify-payment
 */
export const verifyPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const paymentData = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    };

    const booking = await paymentService.verifyAndCompletePayment(paymentData, req);
    res.json({ success: true, message: 'Payment verified successfully', booking });
  } catch (error) {
    console.error('Error verifying payment:', error);
    handleControllerError(res, error);
  }
};

export default {
  getPublicAvailability,
  getAvailableMentors,
  getMentorAvailability,
  createBooking,
  getMentorBookings,
  getMentorStudentsList,
  getStudentBookings,
  getBookingById,
  cancelBooking,
  confirmBooking,
  updateBookingStatus,
  addBookingFeedback,
  createPaymentOrder,
  verifyPayment,
};
