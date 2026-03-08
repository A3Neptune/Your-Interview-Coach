import mongoose from 'mongoose';

// Module/Chapter Schema with nested content
const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  order: {
    type: Number,
    default: 0,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 0,
  },
  resources: [{
    type: {
      type: String,
      enum: ['video', 'google-drive', 'youtube', 'vimeo', 'pdf', 'document', 'quiz', 'assignment', 'live-session', 'link'],
      required: true,
    },
    title: String,
    url: String,
    embedUrl: String,
    thumbnailUrl: String,
    duration: Number, // in minutes
    description: String,
    metadata: mongoose.Schema.Types.Mixed, // flexible for any additional data
    order: {
      type: Number,
      default: 0,
    },
  }],
  quiz: {
    enabled: Boolean,
    passingScore: Number,
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
    }],
  },
});

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  views: {
    type: Number,
    default: 0,
  },
  enrollments: {
    type: Number,
    default: 0,
  },
  completions: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  revenue: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    shortDescription: {
      type: String,
      maxlength: 200,
    },
    fullDescription: {
      type: String,
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['mock-interview', 'resume-building', 'gd-practice', 'placement-prep', 'skills', 'career-growth', 'coding', 'system-design', 'behavioral', 'other'],
      index: true,
    },
    tags: [{
      type: String,
      lowercase: true,
      trim: true,
    }],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner',
    },
    contentType: {
      type: String,
      required: true,
      enum: ['free', 'paid', 'exclusive'],
      default: 'free',
      index: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    currency: {
      type: String,
      default: 'INR',
    },

    // Media
    thumbnail: {
      type: String,
      default: null,
    },
    previewVideo: {
      type: String,
      default: null,
    },
    images: [String],

    // Course Structure
    modules: [moduleSchema],
    totalDuration: {
      type: Number, // in minutes
      default: 0,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },

    // Requirements & Outcomes
    prerequisites: [String],
    learningOutcomes: [String],
    targetAudience: [String],

    // Certificate
    certificateEnabled: {
      type: Boolean,
      default: false,
    },
    certificateTemplate: String,

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,

    // Analytics
    analytics: {
      type: analyticsSchema,
      default: () => ({}),
    },

    // SEO
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],

    // Cache control
    cacheVersion: {
      type: Number,
      default: 1,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
courseSchema.index({ mentorId: 1, isActive: 1 });
courseSchema.index({ category: 1, contentType: 1, isPublished: 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ 'analytics.enrollments': -1 });
courseSchema.index({ 'analytics.averageRating': -1 });
courseSchema.index({ createdAt: -1 });

// Virtual for completion rate
courseSchema.virtual('completionRate').get(function() {
  if (!this.analytics || this.analytics.enrollments === 0) return 0;
  return (this.analytics.completions / this.analytics.enrollments) * 100;
});

// Generate slug from title
courseSchema.pre('save', function() {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }

  // Update total duration and lectures
  if (this.modules && this.modules.length > 0) {
    this.totalDuration = this.modules.reduce((sum, module) => sum + (module.estimatedDuration || 0), 0);
    this.totalLectures = this.modules.reduce((sum, module) => sum + (module.resources?.length || 0), 0);
  }

  this.lastModified = new Date();
});

// Increment cache version on update
courseSchema.pre('findOneAndUpdate', function() {
  this._update.cacheVersion = Date.now();
  this._update.lastModified = new Date();
});

export default mongoose.model('CourseAdvanced', courseSchema);
