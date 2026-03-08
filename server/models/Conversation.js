import mongoose from 'mongoose';

/**
 * Conversation model - Represents a persistent conversation between a mentor and student
 * Each mentor-student pair has ONE conversation that persists across all bookings
 */
const conversationSchema = new mongoose.Schema({
  // Participants in the conversation
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Last message info for quick access
  lastMessage: {
    type: String,
    default: null,
  },
  lastMessageTime: {
    type: Date,
    default: null,
  },
  lastMessageSenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  // Unread counts for both participants
  unreadCount: {
    mentor: {
      type: Number,
      default: 0,
    },
    student: {
      type: Number,
      default: 0,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure one conversation per mentor-student pair
conversationSchema.index({ mentorId: 1, studentId: 1 }, { unique: true });

// Index for querying user's conversations
conversationSchema.index({ mentorId: 1, lastMessageTime: -1 });
conversationSchema.index({ studentId: 1, lastMessageTime: -1 });

// Update the updatedAt timestamp before saving
conversationSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export default mongoose.model('Conversation', conversationSchema);
