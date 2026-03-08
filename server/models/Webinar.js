import mongoose from 'mongoose';

const webinarSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    category: {
      type: String,
      required: true,
      enum: ['mock-interview', 'resume-building', 'gd-practice', 'placement-prep', 'skills', 'career-growth'],
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 60, // in minutes
    },
    maxParticipants: {
      type: Number,
      default: 100,
      min: 100,
    },
    price: {
      type: Number,
      default: 0, // 0 = free, >0 = paid
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'live', 'completed', 'cancelled'],
      default: 'draft',
    },
    // Zoom Integration
    zoomMeetingId: {
      type: String,
      default: null,
    },
    zoomJoinUrl: {
      type: String,
      default: null,
    },
    zoomStartUrl: {
      type: String,
      default: null,
    },
    zoomPassword: {
      type: String,
      default: null,
    },
    zoomRecordingUrl: {
      type: String,
      default: null,
    },
    // Webinar details
    registeredCount: {
      type: Number,
      default: 0,
    },
    actualParticipants: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    recordingAvailable: {
      type: Boolean,
      default: false,
    },
    // Metadata
    tags: [String],
    resources: [
      {
        title: String,
        url: String,
        type: { type: String, enum: ['pdf', 'doc', 'link', 'video'] },
      },
    ],
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

// Index for finding upcoming webinars
webinarSchema.index({ scheduledDate: 1, status: 1 });
webinarSchema.index({ mentorId: 1, scheduledDate: -1 });

export default mongoose.model('Webinar', webinarSchema);