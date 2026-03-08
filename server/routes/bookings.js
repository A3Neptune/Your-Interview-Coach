import express from 'express';
import { verifyToken, verifyUser, verifyMentor } from '../middleware/auth.js';
import { validateBookingInput, createRateLimiter } from '../middleware/validation.js';
import bookingController from '../controllers/bookingController.js';

const router = express.Router();

// Rate limiter: Max 10 booking requests per minute
const bookingRateLimiter = createRateLimiter(10, 60 * 1000);

// Public routes
router.get('/public/availability', bookingController.getPublicAvailability);

// Student routes
router.get('/mentors', verifyToken, verifyUser, bookingController.getAvailableMentors);
router.get('/mentors/:mentorId/availability', verifyToken, verifyUser, bookingController.getMentorAvailability);
router.post('/', verifyToken, verifyUser, bookingRateLimiter, validateBookingInput, bookingController.createBooking);
router.get('/student', verifyToken, verifyUser, bookingController.getStudentBookings);

// Mentor routes
router.get('/mentor', verifyToken, verifyMentor, bookingController.getMentorBookings);
router.get('/mentor/students/list', verifyToken, verifyMentor, bookingController.getMentorStudentsList);

// Shared routes (student & mentor)
router.get('/:bookingId', verifyToken, verifyUser, bookingController.getBookingById);
router.put('/:bookingId/cancel', verifyToken, verifyUser, bookingController.cancelBooking);
router.put('/:bookingId/confirm', verifyToken, bookingController.confirmBooking);
router.put('/:bookingId/status', verifyToken, bookingController.updateBookingStatus);
router.put('/:bookingId/feedback', verifyToken, bookingController.addBookingFeedback);

// Payment routes
router.post('/:bookingId/create-payment', verifyToken, verifyUser, bookingController.createPaymentOrder);
router.post('/:bookingId/verify-payment', verifyToken, verifyUser, bookingController.verifyPayment);

export default router;
