import mongoose from 'mongoose';

/**
 * CourseReview Model
 * Handles student reviews and ratings for courses
 */
const courseReviewSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourseAdvanced',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    // Verification
    verifiedEnrollment: {
      type: Boolean,
      default: false,
    },
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      default: null,
    },
    // Engagement metrics
    helpfulCount: {
      type: Number,
      default: 0,
    },
    helpfulBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    // Moderation
    isReported: {
      type: Boolean,
      default: false,
    },
    reportedBy: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reason: String,
      reportedAt: Date,
    }],
    isApproved: {
      type: Boolean,
      default: true, // Auto-approve by default
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: Date,
    // Response from mentor
    mentorResponse: {
      comment: String,
      respondedAt: Date,
    },
    // Metadata
    courseVersion: {
      type: Number,
      default: 1,
    },
    editedAt: Date,
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
courseReviewSchema.index({ courseId: 1, createdAt: -1 }); // List reviews by course
courseReviewSchema.index({ userId: 1, courseId: 1 }, { unique: true }); // One review per user per course
courseReviewSchema.index({ courseId: 1, rating: -1 }); // Sort by rating
courseReviewSchema.index({ courseId: 1, helpfulCount: -1 }); // Sort by helpful
courseReviewSchema.index({ isApproved: 1, isReported: 1 }); // Moderation queries

// Virtual for formatted date
courseReviewSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Populate user details when querying
courseReviewSchema.pre(/^find/, function() {
  this.populate({
    path: 'userId',
    select: 'name profileImage email',
  });
});

export default mongoose.model('CourseReview', courseReviewSchema);
