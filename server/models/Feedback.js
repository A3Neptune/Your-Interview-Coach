import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema(
  {
    type:    { type: String, enum: ['bug', 'suggestion', 'general'], required: true },
    rating:  { type: Number, min: 1, max: 5 },
    message: { type: String, required: true, maxlength: 2000 },
    page:    { type: String },
    userId:  { type: String },
    email:   { type: String },
    status:  { type: String, enum: ['new', 'reviewed', 'resolved'], default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', FeedbackSchema);