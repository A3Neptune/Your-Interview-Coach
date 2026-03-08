import mongoose from 'mongoose';

const groupDiscussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    topic: {
      type: String,
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 60, // minutes
    },
    maxParticipants: {
      type: Number,
      default: 6,
    },
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: String,
        email: String,
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    teams: [
      {
        teamNumber: Number,
        members: [
          {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
            name: String,
            email: String,
          },
        ],
      },
    ],
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    meetingLink: {
      type: String,
      default: null,
    },
    recordingLink: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isFull: {
      type: Boolean,
      default: false,
    },
    waitlist: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: String,
        email: String,
        joinedWaitlistAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    price: {
      type: Number,
      default: 0,
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

export default mongoose.model('GroupDiscussion', groupDiscussionSchema);
