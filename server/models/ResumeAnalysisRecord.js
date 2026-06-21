import mongoose from 'mongoose';

const resumeAnalysisRecordSchema = new mongoose.Schema(
  {
    publicUrl: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number,
      default: null,
    },
    fileName: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ResumeAnalysisRecord', resumeAnalysisRecordSchema);
