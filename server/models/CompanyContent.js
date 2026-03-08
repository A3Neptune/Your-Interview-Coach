import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  isFree: {
    type: Boolean,
    default: false,
  },
});

const resourceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['pdf', 'googleDrive', 'codingQuestion', 'video', 'article'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  // For PDFs stored in Cloudinary
  cloudinaryPublicId: {
    type: String,
  },
  // For coding questions
  problemStatement: {
    type: String,
  },
  solution: {
    type: String,
  },
  hints: [String],
  testCases: [{
    input: String,
    output: String,
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  isFree: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  questions: [questionSchema],
  resources: [resourceSchema],
  order: {
    type: Number,
    default: 0,
  },
});

const companyContentSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    logo: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    softSkills: {
      sections: [sectionSchema],
      freePreviewCount: {
        type: Number,
        default: 3,
      },
    },
    technicalQuestions: {
      sections: [sectionSchema],
      freePreviewCount: {
        type: Number,
        default: 3,
      },
    },
    behavioralQuestions: {
      sections: [sectionSchema],
      freePreviewCount: {
        type: Number,
        default: 3,
      },
    },
    price: {
      type: Number,
      required: true,
      default: 499,
    },
    discount: {
      type: {
        type: String,
        enum: ['percentage', 'fixed', 'none'],
        default: 'none',
      },
      value: {
        type: Number,
        default: 0,
      },
      isActive: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate total questions and resources
companyContentSchema.pre('save', function () {
  let total = 0;

  if (this.softSkills && this.softSkills.sections) {
    this.softSkills.sections.forEach(section => {
      total += section.questions.length;
      total += (section.resources || []).length;
    });
  }

  if (this.technicalQuestions && this.technicalQuestions.sections) {
    this.technicalQuestions.sections.forEach(section => {
      total += section.questions.length;
      total += (section.resources || []).length;
    });
  }

  if (this.behavioralQuestions && this.behavioralQuestions.sections) {
    this.behavioralQuestions.sections.forEach(section => {
      total += section.questions.length;
      total += (section.resources || []).length;
    });
  }

  this.totalQuestions = total;
});

const CompanyContent = mongoose.model('CompanyContent', companyContentSchema);

export default CompanyContent;
