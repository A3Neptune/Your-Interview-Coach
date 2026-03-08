import express from 'express';
import { verifyToken, verifyUser } from '../middleware/auth.js';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

// ============ PUBLIC ROUTES ============

router.get('/health', paymentController.healthCheck);

// ============ COURSE PAYMENT ROUTES ============

router.post('/create-order', verifyToken, verifyUser, paymentController.createCourseOrder);
router.post('/verify-payment', verifyToken, verifyUser, paymentController.verifyCoursePayment);

// ============ SERVICE BOOKING PAYMENT ROUTES ============

router.post('/service/create-order', verifyToken, verifyUser, paymentController.createServiceOrder);
router.post('/service/verify-payment', verifyToken, verifyUser, paymentController.verifyServicePayment);

// ============ PAYMENT DETAILS ROUTES ============

router.get('/history', verifyToken, verifyUser, paymentController.getPaymentHistory);
router.get('/invoice/:paymentId', verifyToken, verifyUser, paymentController.generateInvoice);
router.get('/:paymentId', verifyToken, verifyUser, paymentController.getPaymentById);

export default router;
