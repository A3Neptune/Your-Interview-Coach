import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import gdBookingController from '../controllers/gdBookingController.js';

const router = express.Router();

// Public
router.get('/plans', gdBookingController.getPlans);

// User routes (authenticated)
router.post('/book', verifyToken, gdBookingController.createGDBooking);
router.post('/verify-payment', verifyToken, gdBookingController.verifyGDPayment);
router.get('/my-bookings', verifyToken, gdBookingController.getUserGDBookings);

// Admin routes
router.get('/admin/all', verifyToken, verifyAdmin, gdBookingController.getAllGDBookings);
router.put('/admin/:bookingId', verifyToken, verifyAdmin, gdBookingController.updateGDBookingStatus);

export default router;
