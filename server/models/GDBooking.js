import mongoose from 'mongoose';

const gdMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  whatsapp: { type: String, required: true },
});

const gdBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planType: {
      type: String,
      enum: ['gd-starter', 'gd-popular', 'gd-value', '4-members', '6-members', '10-members'],
      required: true,
    },
    memberCount: {
      type: Number,
      required: true,
      enum: [4, 6, 10],
    },
    pricePerMember: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    members: {
      type: [gdMemberSchema],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length === this.memberCount;
        },
        message: 'Number of members must match the selected plan',
      },
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    meetingLink: {
      type: String,
      default: null,
    },
    adminNote: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

gdBookingSchema.index({ userId: 1, createdAt: -1 });
gdBookingSchema.index({ status: 1 });
gdBookingSchema.index({ paymentStatus: 1 });
gdBookingSchema.index({ scheduledDate: 1 });

export default mongoose.model('GDBooking', gdBookingSchema);
