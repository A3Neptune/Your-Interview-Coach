/**
 * Refund Service
 * Handles Razorpay refund processing
 */

import Razorpay from 'razorpay';
import Payment from '../../models/Payment.js';
import Booking from '../../models/Booking.js';
import { PaymentError, NotFoundError } from '../../utils/errors.js';
import AuditLogService from '../AuditLogService.js';

// Lazy initialization - Razorpay instance created on first use
let razorpayInstance = null;

/**
 * Get or create Razorpay instance with lazy initialization
 * This ensures environment variables are loaded before accessing them
 */
const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    // Load credentials from environment
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID?.trim();
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    console.log('RefundService Razorpay Config:', {
      keyIdPresent: !!razorpayKeyId,
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

    console.log('✅ Razorpay initialized for refunds');
  }

  return razorpayInstance;
};

/**
 * Process refund for a booking
 * @param {string} bookingId - Booking ID to refund
 * @param {string} reason - Reason for refund
 * @param {object} req - Request object for audit logging
 * @returns {object} Refund details
 */
const processRefund = async (bookingId, reason, req) => {
  const razorpay = getRazorpayInstance();

  // Get booking with payment info
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Check if booking has payment
  if (booking.paymentStatus !== 'completed') {
    throw new PaymentError('Cannot refund - payment not completed');
  }

  if (!booking.razorpayPaymentId) {
    throw new PaymentError('Cannot refund - no payment ID found');
  }

  // Check if already refunded
  if (booking.paymentStatus === 'refunded') {
    throw new PaymentError('Booking already refunded');
  }

  try {
    console.log(`Processing refund for booking ${bookingId}...`);
    console.log(`Payment ID: ${booking.razorpayPaymentId}, Amount: ${booking.amount}`);

    // Create refund in Razorpay
    const refund = await razorpay.payments.refund(booking.razorpayPaymentId, {
      amount: Math.round(booking.amount * 100), // Convert to paise
      notes: {
        bookingId: bookingId.toString(),
        reason: reason,
      },
    });

    console.log('✅ Razorpay refund created:', refund.id);

    // Update booking payment status
    booking.paymentStatus = 'refunded';
    booking.refundId = refund.id;
    booking.refundedAt = new Date();
    booking.refundAmount = booking.amount;
    booking.refundReason = reason;
    await booking.save();

    // Update payment record
    await Payment.updateOne(
      { razorpayPaymentId: booking.razorpayPaymentId },
      {
        $set: {
          status: 'refunded',
          refundId: refund.id,
          refundAmount: booking.amount,
          refundedAt: new Date(),
        },
      }
    );

    // Log audit trail
    await AuditLogService.logBookingAction(
      req,
      'BOOKING_CANCELLED',
      booking._id,
      {
        refundId: refund.id,
        refundAmount: booking.amount,
        reason: reason,
      },
      'SUCCESS',
      null
    );

    console.log(`✅ Refund processed successfully for booking ${bookingId}`);

    return {
      success: true,
      refundId: refund.id,
      amount: booking.amount,
      status: refund.status,
      message: 'Refund processed successfully',
    };
  } catch (error) {
    console.error('❌ Refund processing failed:', error);

    // Log failed refund attempt
    await AuditLogService.logBookingAction(
      req,
      'BOOKING_CANCELLED',
      booking._id,
      { refundAttempt: true, error: error.message },
      'FAILURE',
      error.message
    );

    throw new PaymentError(`Refund failed: ${error.message}`);
  }
};

/**
 * Check refund status
 */
const getRefundStatus = async (refundId) => {
  if (!razorpay) {
    throw new PaymentError('Razorpay not configured');
  }

  try {
    const refund = await razorpay.refunds.fetch(refundId);
    return refund;
  } catch (error) {
    console.error('Error fetching refund status:', error);
    throw new PaymentError(`Failed to fetch refund status: ${error.message}`);
  }
};

export default {
  processRefund,
  getRefundStatus,
};
