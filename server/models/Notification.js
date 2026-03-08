import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['gd-invite', 'gd-user-accepted', 'gd-user-declined', 'gd-cancelled', 'gd-rescheduled', 'gd-started', 'gd-reminder', 'payment', 'booking', 'general'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      gdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupDiscussion',
        default: null,
      },
      bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null,
      },
      relatedId: String,
      isPaid: {
        type: Boolean,
        default: false,
      },
      paymentAmount: {
        type: Number,
        default: 0,
      },
      adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    actionUrl: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: '30d' }, // Auto-delete after 30 days
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
