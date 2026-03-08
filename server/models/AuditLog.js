import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: [
        'BOOKING_CREATED',
        'BOOKING_CANCELLED',
        'BOOKING_CONFIRMED',
        'BOOKING_UPDATED',
        'BOOKING_PAYMENT_ORDER_CREATED',
        'BOOKING_PAYMENT_VERIFIED',
        'USER_LOGIN',
        'USER_LOGOUT',
      ],
      required: true,
      index: true,
    },
    resourceType: {
      type: String,
      enum: ['BOOKING', 'USER', 'PAYMENT'],
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    changes: {
      before: mongoose.Schema.Types.Mixed,
      after: mongoose.Schema.Types.Mixed,
    },
    ipAddress: String,
    userAgent: String,
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILURE'],
      default: 'SUCCESS',
    },
    errorMessage: String,
    metadata: {
      sessionType: String,
      mentorId: mongoose.Schema.Types.ObjectId,
      amount: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      // Auto-delete logs after 90 days
      expires: 90 * 24 * 60 * 60,
    },
  },
  { timestamps: false }
);

// Index for efficient querying
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ resourceId: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
