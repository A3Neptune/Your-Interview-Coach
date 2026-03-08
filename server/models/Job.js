import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyLogo: {
    type: String,
    default: null,
  },
  position: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requiredSkills: [{
    type: String,
    required: true,
  }],
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Lead'],
    default: 'Mid',
  },
  salary: {
    min: {
      type: Number,
      default: null,
    },
    max: {
      type: Number,
      default: null,
    },
    currency: {
      type: String,
      default: 'INR',
    },
  },
  location: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Remote'],
    default: 'Full-time',
  },
  applicants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Rejected', 'Accepted'],
      default: 'Applied',
    },
  }],
  matchedUsers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    matchPercentage: Number,
    matchedSkills: [String],
    emailSentAt: {
      type: Date,
      default: null,
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// Index for job matching
jobSchema.index({ requiredSkills: 1, isActive: 1 });
jobSchema.index({ companyName: 1 });

export default mongoose.model('Job', jobSchema);
