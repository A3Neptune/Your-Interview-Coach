import mongoose from 'mongoose';

const pageViewSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      default: '/',
      index: true,
    },
    visitorHash: {
      type: String,
      required: true,
      index: true,
    },
    userAgent: {
      type: String,
      maxlength: 500,
    },
    referrer: {
      type: String,
      maxlength: 500,
    },
    country: {
      type: String,
      maxlength: 64,
    },
  },
  { timestamps: true }
);

pageViewSchema.index({ path: 1, createdAt: -1 });
pageViewSchema.index({ path: 1, visitorHash: 1, createdAt: -1 });

const PageView = mongoose.models.PageView || mongoose.model('PageView', pageViewSchema);

export default PageView;
