import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    contentType: {
      type: String,
      required: true,
      enum: ['google-doc', 'google-sheet', 'video-link', 'pdf', 'other'],
    },
    // For Google Docs/Sheets - embed URL or shared link
    embedUrl: {
      type: String,
      default: null,
    },
    // For YouTube or other video platforms
    videoUrl: {
      type: String,
      default: null,
    },
    // Duration in minutes
    duration: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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

export default mongoose.model('Content', contentSchema);