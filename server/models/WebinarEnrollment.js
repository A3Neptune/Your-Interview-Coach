import mongoose from 'mongoose';

const webinarEnrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    webinarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Webinar',
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null, // null if free webinar
    },
    enrollmentType: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered',
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    attendedAt: {
      type: Date,
      default: null,
    },
    attendanceDuration: {
      type: Number,
      default: 0, // in minutes
    },
    feedbackRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    feedbackComment: {
      type: String,
      default: '',
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Unique constraint: one enrollment per user per webinar
webinarEnrollmentSchema.index({ userId: 1, webinarId: 1 }, { unique: true });

export default mongoose.model('WebinarEnrollment', webinarEnrollmentSchema);