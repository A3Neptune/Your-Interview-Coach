import mongoose from 'mongoose';

const gdRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'paid'],
      default: 'pending',
    },
    reason: {
      type: String,
      required: true, // Why they want a new GD slot
    },
    preferredDate: {
      type: Date,
      default: null,
    },
    preferredTopic: {
      type: String,
      default: null,
    },
    requestAmount: {
      type: Number,
      default: 299, // Amount charged for requesting new GD
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    orderId: {
      type: String,
      default: null,
    },
    paymentId: {
      type: String,
      default: null,
    },
    gdCreated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GroupDiscussion',
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    adminNote: {
      type: String,
      default: '',
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

export default mongoose.model('GDRequest', gdRequestSchema);
