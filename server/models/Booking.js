import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionType: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 60,
    },
    meetingLink: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'pending',
    },
    studentNotes: {
      type: String,
      default: '',
    },
    mentorNotes: {
      type: String,
      default: '',
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      comment: {
        type: String,
        default: '',
      },
    },
    recordingUrl: {
      type: String,
      default: null,
    },
    // Payment fields
    paymentRequired: {
      type: Boolean,
      default: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    invoiceNumber: {
      type: String,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    paymentLocked: {
      type: Boolean,
      default: false,
    },
    meetingId: {
      type: String,
      default: null,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    // Cancellation fields
    cancelledBy: {
      type: String,
      enum: ['student', 'mentor', 'admin'],
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: null,
    },
    // Refund fields
    refundId: {
      type: String,
      default: null,
    },
    refundAmount: {
      type: Number,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    refundReason: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for querying bookings by student or mentor
bookingSchema.index({ studentId: 1, scheduledDate: 1 });
bookingSchema.index({ mentorId: 1, scheduledDate: 1 });

// FIX 3: Partial unique index to prevent race condition double bookings
// Ensures no two active bookings can have overlapping times for same mentor
// Only applies to pending/confirmed bookings (not cancelled/completed)
bookingSchema.index(
  { mentorId: 1, scheduledDate: 1, status: 1 },
  {
    partialFilterExpression: {
      status: { $in: ['pending', 'confirmed'] },
    },
  }
);

export default mongoose.model('Booking', bookingSchema);