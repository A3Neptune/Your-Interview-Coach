import mongoose from 'mongoose';

const launchBannerSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    message: {
      type: String,
      required: true,
      default: 'Grand Launch: All sessions',
    },
    originalPrice: {
      type: Number,
      required: true,
      default: 999,
    },
    discountedPrice: {
      type: Number,
      required: true,
      default: 9,
    },
    ctaText: {
      type: String,
      default: 'Claim Now',
    },
    ctaLink: {
      type: String,
      default: '/signup',
    },
    countdownHours: {
      type: Number,
      default: 48,
      min: 1,
      max: 168, // Max 7 days
    },
    showCountdown: {
      type: Boolean,
      default: true,
    },
    badgeText: {
      type: String,
      default: 'Launch Offer',
    },
    savePercentage: {
      type: Number,
      default: 99,
    },
    backgroundColor: {
      type: String,
      default: 'zinc-950',
    },
    textColor: {
      type: String,
      default: 'zinc-300',
    },
    accentColor: {
      type: String,
      default: 'blue-purple', // gradient
    },
  },
  {
    timestamps: true,
  }
);

// Only allow one banner configuration
launchBannerSchema.index({ isActive: 1 }, { unique: false });

export default mongoose.model('LaunchBanner', launchBannerSchema);
