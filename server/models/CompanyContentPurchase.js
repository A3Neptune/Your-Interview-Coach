import mongoose from 'mongoose';

const companyContentPurchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyContentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CompanyContent',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: 'razorpay',
    },
    accessGranted: {
      type: Boolean,
      default: false,
    },
    accessExpiresAt: {
      type: Date,
      default: null, // null means lifetime access
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
companyContentPurchaseSchema.index({ userId: 1, companyContentId: 1 });

const CompanyContentPurchase = mongoose.model('CompanyContentPurchase', companyContentPurchaseSchema);

export default CompanyContentPurchase;
