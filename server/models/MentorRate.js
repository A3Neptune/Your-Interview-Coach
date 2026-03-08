import mongoose from 'mongoose';

const mentorRateSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // Session rates by type - 4 core services
    rates: {
      oneMentorship: {
        type: Number,
        default: 2000, // ₹2000 for 1:1 mentorship
      },
      webinars: {
        type: Number,
        default: 1500, // ₹1500 for webinars
      },
      resumeAnalysis: {
        type: Number,
        default: 1000, // ₹1000 for resume analysis
      },
      gdGroupDiscussions: {
        type: Number,
        default: 1200, // ₹1200 for GD group discussions
      },
    },
    // Availability slots (day of week: 0-6)
    availability: [
      {
        day: {
          type: Number, // 0 = Sunday, 1 = Monday, etc.
          min: 0,
          max: 6,
        },
        slots: [
          {
            startTime: String, // "09:00"
            endTime: String, // "10:00"
            isBooked: { type: Boolean, default: false },
          },
        ],
      },
    ],
    // Cancellation policy (hours before session)
    cancellationHours: {
      type: Number,
      default: 24,
    },
    // Rescheduling allowed
    allowReschedule: {
      type: Boolean,
      default: true,
    },
    // Meeting platform preference
    preferredPlatform: {
      type: String,
      enum: ['zoom', 'google-meet', 'both'],
      default: 'zoom',
    },
    // Timezone
    timezone: {
      type: String,
      default: 'UTC',
    },
    // Total sessions completed
    sessionsCompleted: {
      type: Number,
      default: 0,
    },
    // Average rating
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 5,
    },
    // Active status
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

export default mongoose.model('MentorRate', mentorRateSchema);
