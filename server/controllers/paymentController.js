import coursePaymentService from '../services/domain/coursePaymentService.js';
import {  handleControllerError  } from '../utils/errorHandler.js';

/**
 * Health check endpoint
 */
export const healthCheck = (req, res) => {
  res.json({ status: 'payments API working', timestamp: new Date() });
};

/**
 * Create order for course purchase
 */
export const createCourseOrder = async (req, res) => {
  try {
    const { courseId, paymentMethod, gstNumber } = req.body;
    const userId = req.user.id;

    const result = await coursePaymentService.createCourseOrder(userId, courseId, paymentMethod, gstNumber);

    res.json({ success: true, ...result });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Verify payment and create enrollment
 */
export const verifyCoursePayment = async (req, res) => {
  try {
    const { paymentId, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.id;

    const result = await coursePaymentService.verifyCoursePayment(
      userId,
      paymentId,
      razorpay_payment_id,
      razorpay_signature
    );

    res.json({
      success: true,
      message: 'Payment verified and course enrolled',
      ...result,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Create order for service booking
 */
export const createServiceOrder = async (req, res) => {
  try {
    const { amount, currency, serviceId, serviceName } = req.body;
    const userId = req.user.id;

    const result = await coursePaymentService.createServiceOrder(
      userId,
      amount,
      currency,
      serviceId,
      serviceName
    );

    res.json({ success: true, ...result });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Verify service payment and create booking
 */
export const verifyServicePayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      serviceId,
      amount,
      scheduledDate,
    } = req.body;

    const userId = req.user.id;
    const userDetails = req.user;

    const result = await coursePaymentService.verifyServicePayment(
      userId,
      userDetails,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      serviceId,
      amount,
      scheduledDate
    );

    res.json({
      success: true,
      message: 'Payment successful',
      ...result,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Get payment history
 */
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await coursePaymentService.getPaymentHistory(userId);

    res.json({ success: true, payments });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Get payment details by ID
 */
export const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await coursePaymentService.getPaymentById(paymentId, userId);

    res.json({ success: true, payment });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Generate invoice
 */
export const generateInvoice = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const invoice = await coursePaymentService.generateInvoice(paymentId, userId);

    res.json({ success: true, invoice });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export default {
  healthCheck,
  createCourseOrder,
  verifyCoursePayment,
  createServiceOrder,
  verifyServicePayment,
  getPaymentHistory,
  getPaymentById,
  generateInvoice,
};
