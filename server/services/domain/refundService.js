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

  console.log(`Processing refund for booking ${bookingId}...`);
  console.log(`Payment ID: ${booking.razorpayPaymentId}, Amount: ${booking.amount}`);

  // ── Step 1: Call Razorpay API (isolated try/catch) ──────────────────────
  let refund;
  try {
    refund = await razorpay.payments.refund(booking.razorpayPaymentId, {
      amount: Math.round(booking.amount * 100), // Convert to paise
      notes: {
        bookingId: bookingId.toString(),
        reason: reason,
      },
    });
    console.log('✅ Razorpay refund created:', refund.id);
  } catch (razorpayError) {
    console.error('❌ Razorpay refund API call failed:', razorpayError);

    const isInvalidPayment = razorpayError.error?.description?.includes('does not exist')
      || razorpayError.message?.includes('does not exist');

    // Payment ID not in Razorpay (test/fixture data) — mark as refunded to avoid stuck state
    if (isInvalidPayment) {
      booking.paymentStatus = 'refunded';
      booking.refundId = 'not_applicable_test_payment';
      booking.refundedAt = new Date();
      booking.refundReason = 'Payment ID not found in Razorpay — likely a test payment';
      await booking.save();
      console.warn('⚠️ Payment ID not in Razorpay — marked as refunded (test data)');
      return { success: false, reason: 'test_payment', message: 'No real Razorpay payment found' };
    }

    await AuditLogService.logBookingAction(
      req,
      'BOOKING_CANCELLED',
      booking._id,
      { refundAttempt: true, error: razorpayError.message },
      'FAILURE',
      razorpayError.message
    ).catch(() => {}); // audit failure must never shadow the real error

    throw new PaymentError(`Refund failed: ${razorpayError.message}`);
  }

  // ── Step 2: Razorpay succeeded — update DB unconditionally ──────────────
  // Any error here is a DB/network issue; the money has already been returned
  // to the customer. Log but never throw so the booking stays consistent.
  try {
    booking.paymentStatus = 'refunded';
    booking.refundId = refund.id;
    booking.refundedAt = new Date();
    booking.refundAmount = booking.amount;
    booking.refundReason = reason;
    await booking.save();

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

    await AuditLogService.logBookingAction(
      req,
      'BOOKING_CANCELLED',
      booking._id,
      { refundId: refund.id, refundAmount: booking.amount, reason },
      'SUCCESS',
      null
    );

    console.log(`✅ Refund processed successfully for booking ${bookingId}`);
  } catch (dbError) {
    console.error('⚠️ Razorpay refund succeeded but DB update failed — refund ID:', refund.id, dbError.message);
    // Don't throw: the refund is real. Caller can re-fetch and check paymentStatus.
  }

  return {
    success: true,
    refundId: refund.id,
    amount: booking.amount,
    status: refund.status,
    message: 'Refund processed successfully',
  };
};

/**
 * Check refund status
 */
const getRefundStatus = async (refundId) => {
  const razorpay = getRazorpayInstance();

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
