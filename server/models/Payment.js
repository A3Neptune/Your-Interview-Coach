import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: false, // Optional - only for course payments, not booking payments
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: false, // Optional - only for booking payments, not course payments
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'casekaro'],
      required: false,
      default: 'razorpay',
    },
    // Razorpay specific fields
    razorpay_payment_id: {
      type: String,
      default: null,
    },
    razorpay_order_id: {
      type: String,
      default: null,
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpay_signature: {
      type: String,
      default: null,
    },
    // Casekaro specific fields (for non-GST users)
    casekaro_payment_id: {
      type: String,
      default: null,
    },
    // Payment status
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    // Invoice details
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    gstNumber: {
      type: String,
      default: null,
    },
    billingName: {
      type: String,
      required: false,
    },
    billingEmail: {
      type: String,
      required: false,
    },
    billingPhone: {
      type: String,
      required: false,
    },
    // Additional info
    description: {
      type: String,
      default: '',
    },
    metadata: {
      type: Object,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Generate invoice number before saving — use timestamp+random to avoid race conditions
paymentSchema.pre('save', function () {
  if (!this.invoiceNumber && this.status === 'completed') {
    const year = new Date().getFullYear();
    const suffix = `${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    this.invoiceNumber = `INV-${year}-${suffix}`;
  }
});

paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Payment', paymentSchema);
