import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: null,
    },
    mobile: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    userType: {
      type: String,
      enum: ['student', 'professional', 'admin'],
      default: 'student',
    },
    yearOfStudy: {
      type: Number,
      min: 1,
      max: 4,
      required: function () {
        return this.userType === 'student' && !this.googleId;
      },
    },
    skills: [
      {
        type: String,
      },
    ],
    company: {
      type: String,
      required: function () {
        return this.userType === 'professional';
      },
    },
    designation: {
      type: String,
      required: function () {
        return this.userType === 'professional';
      },
    },
    yearsOfExperience: {
      type: Number,
      required: function () {
        return this.userType === 'professional';
      },
    },
    profileImage: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
    },
    // Mentor-specific settings
    businessName: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    timezone: {
      type: String,
      default: 'IST',
    },
    language: {
      type: String,
      default: 'English',
    },
    maxStudentsPerDay: {
      type: Number,
      default: 5,
    },
    sessionBuffer: {
      type: Number,
      default: 15,
    },
    availabilitySettings: {
      startHour:               { type: Number, default: 9 },
      endHour:                 { type: Number, default: 18 },
      slotDuration:            { type: Number, default: 60 },
      bufferMinutes:           { type: Number, default: 0 },
      daysOff:                 { type: [Number], default: [] },  // 0=Sun … 6=Sat
      blockedDates:            { type: [String], default: [] },  // ["YYYY-MM-DD"]
      webinarMaxParticipants:  { type: Number, default: 70, min: 1 },
      webinarSlots: {
        type: [{
          date:            String,
          time:            String,
          topic:           { type: String, default: '' },
          maxParticipants: { type: Number, default: 70 },
        }],
        default: [],
      },
      dateOverrides: {
        type: [{
          date:      String,
          startHour: Number,
          endHour:   Number,
        }],
        default: [],
      },
    },
    autoConfirmBookings: {
      type: Boolean,
      default: false,
    },
    allowDirectMessages: {
      type: Boolean,
      default: true,
    },
    notifyNewBookings: {
      type: Boolean,
      default: true,
    },
    notifyJobMatches: {
      type: Boolean,
      default: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    knownDevices: [
      {
        deviceFingerprint: String, // Hash of user-agent + IP pattern
        location: String,
        ipAddress: String,
        device: String,
        lastUsed: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpiry: {
      type: Date,
      default: null,
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

// Hash password before saving
userSchema.pre('save', async function () {
  if (this.isModified('password') && this.password) {
    this.password = await bcryptjs.hash(this.password, 10);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;
  return await bcryptjs.compare(password, this.password);
};

// Remove sensitive fields from response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.password;
  delete obj.resetToken;
  delete obj.resetTokenExpiry;
  return obj;
};

export default mongoose.model('User', userSchema);
