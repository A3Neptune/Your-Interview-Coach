/**
 * Auth Service
 * Handles authentication and user management business logic
 */

import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {  OAuth2Client  } from 'google-auth-library';
import {  ValidationError, NotFoundError, UnauthorizedError  } from '../../utils/errors.js';
import {  sendEmail  } from '../emailService.js';
import {  welcomeEmailTemplate, loginNotificationTemplate, forgotPasswordTemplate  } from '../../templates/emailTemplates.js';
import {  getLocationFromIP, getDeviceFromUserAgent, getClientIP  } from '../../utils/locationHelper.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Email login
 */
const loginWithEmail = async (email, password, req = null) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Extract location and device info
  let location = 'Unknown';
  let device = 'Unknown device';
  let ipAddress = 'Hidden';
  let isNewDevice = false;

  if (req) {
    try {
      ipAddress = getClientIP(req);
      location = getLocationFromIP(ipAddress);
      device = getDeviceFromUserAgent(req.headers['user-agent']);

      // Create device fingerprint (hash of user-agent + IP pattern)
      const userAgent = req.headers['user-agent'] || '';
      const ipPattern = ipAddress.split('.').slice(0, 3).join('.'); // First 3 octets for IP pattern matching
      const deviceFingerprint = crypto.createHash('md5').update(userAgent + ipPattern).digest('hex');

      // Check if this device/location combination is known
      const knownDevice = user.knownDevices?.find(
        d => d.deviceFingerprint === deviceFingerprint
      );

      if (!knownDevice) {
        // New device detected - add to known devices
        isNewDevice = true;

        if (!user.knownDevices) {
          user.knownDevices = [];
        }

        user.knownDevices.push({
          deviceFingerprint,
          location,
          ipAddress,
          device,
          lastUsed: new Date(),
        });

        // Keep only last 10 devices
        if (user.knownDevices.length > 10) {
          user.knownDevices = user.knownDevices.slice(-10);
        }
      } else {
        // Known device - update last used
        knownDevice.lastUsed = new Date();
        knownDevice.location = location; // Update in case location changed
      }
    } catch (error) {
      console.error('Error extracting login info:', error);
    }
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  const token = jwt.sign(
    { id: user._id, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  // Only send email notification for new devices/locations
  if (isNewDevice) {
    const loginTime = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    console.log(`🔔 New device detected for ${user.email} - sending security alert`);

    sendEmail(
      user.email,
      'Security Alert: New Login to Your Account',
      loginNotificationTemplate(user.name, loginTime, location, ipAddress, device)
    ).catch(err => console.error('Failed to send login notification:', err));
  } else {
    console.log(`✅ Known device login for ${user.email} - no email sent`);
  }

  return { token, user };
};

/**
 * Google OAuth login
 */
const loginWithGoogle = async (googleToken) => {
  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name, picture, sub: googleId } = payload;

  let user = await User.findOne({ $or: [{ email }, { googleId }] });

  if (!user) {
    // Create new user
    user = new User({
      name,
      email,
      profileImage: picture,
      googleId,
      userType: 'student',
      isActive: true,
    });
    await user.save();
  } else {
    // Update existing user
    if (!user.googleId) {
      user.googleId = googleId;
    }
    if (!user.profileImage) {
      user.profileImage = picture;
    }
    user.lastLogin = new Date();
    await user.save();
  }

  const token = jwt.sign(
    { id: user._id, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  return { token, user };
};

/**
 * Signup
 */
const signup = async (userData) => {
  const { name, email, password, mobile, userType, yearOfStudy, company, designation, yearsOfExperience } = userData;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ValidationError('Email already registered');
  }

  // Validate conditional fields
  if (userType === 'student' && !yearOfStudy) {
    throw new ValidationError('Year of study is required for students');
  }

  if (userType === 'professional' && (!company || !designation)) {
    throw new ValidationError('Company and designation are required for professionals');
  }

  // Create user
  const user = new User({
    name,
    email,
    password,
    mobile,
    userType,
    yearOfStudy: userType === 'student' ? yearOfStudy : undefined,
    company: userType === 'professional' ? company : undefined,
    designation: userType === 'professional' ? designation : undefined,
    yearsOfExperience: userType === 'professional' ? yearsOfExperience : undefined,
    isActive: true,
  });

  await user.save();

  const token = jwt.sign(
    { id: user._id, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  // Send welcome email (non-blocking)
  sendEmail(
    user.email,
    'Welcome to YourInterviewCoach!',
    welcomeEmailTemplate(user.name)
  ).catch(err => console.error('Failed to send welcome email:', err));

  return { token, user };
};

/**
 * Get current user
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

/**
 * Update profile
 */
const updateProfile = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Update allowed fields
  const allowedFields = ['name', 'mobile', 'bio', 'skills', 'profileImage', 'yearOfStudy', 'company', 'designation', 'yearsOfExperience'];

  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      user[field] = updates[field];
    }
  });

  await user.save();
  return user;
};

/**
 * Generate password reset token
 */
const generateResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError('User not found with this email');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  await user.save();

  // Send password reset email (non-blocking)
  sendEmail(
    user.email,
    'Reset Your Password',
    forgotPasswordTemplate(user.name, resetToken)
  ).catch(err => console.error('Failed to send password reset email:', err));

  return { resetToken, user };
};

/**
 * Verify reset token
 */
const verifyResetToken = async (token) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ValidationError('Invalid or expired reset token');
  }

  return user;
};

/**
 * Reset password
 */
const resetPassword = async (token, newPassword) => {
  const user = await verifyResetToken(token);

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return user;
};

/**
 * Update mentor settings
 */
const updateMentorSettings = async (userId, settings) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.userType !== 'admin' && user.userType !== 'professional') {
    throw new ValidationError('Only mentors can update mentor settings');
  }

  // Update mentor-specific settings
  const allowedFields = [
    'availability',
    'specializations',
    'hourlyRate',
    'bio',
    'linkedIn',
    'github',
    'businessName',
    'website',
    'timezone',
    'language',
    'maxStudentsPerDay',
    'sessionBuffer',
    'autoConfirmBookings',
    'allowDirectMessages',
    'notifyNewBookings',
    'notifyJobMatches',
    'emailNotifications'
  ];

  allowedFields.forEach(field => {
    if (settings[field] !== undefined) {
      user[field] = settings[field];
    }
  });

  await user.save();
  return user;
};

/**
 * Get all users (admin)
 */
const getAllUsers = async (filters = {}) => {
  const users = await User.find(filters).select('-password').sort({ createdAt: -1 });
  return users;
};

/**
 * Update user (admin)
 */
const updateUser = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Admin can update any field except password
  Object.keys(updates).forEach(key => {
    if (key !== 'password' && updates[key] !== undefined) {
      user[key] = updates[key];
    }
  });

  await user.save();
  return user;
};

/**
 * Delete user (admin)
 */
const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

/**
 * Update user status (admin)
 */
const updateUserStatus = async (userId, isActive) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  user.isActive = isActive;
  await user.save();

  return user;
};

/**
 * Create user (admin)
 */
const createUser = async (userData) => {
  const { name, email, password, mobile, userType, yearOfStudy, company, designation } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ValidationError('Email already exists');
  }

  const user = new User({
    name,
    email,
    password,
    mobile,
    userType: userType || 'student',
    yearOfStudy,
    company,
    designation,
    isActive: true,
  });

  await user.save();
  return user;
};

export {
  loginWithEmail,
  loginWithGoogle,
  signup,
  getCurrentUser,
  updateProfile,
  generateResetToken,
  verifyResetToken,
  resetPassword,
  updateMentorSettings,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserStatus,
  createUser,
};
export default {
  loginWithEmail,
  loginWithGoogle,
  signup,
  getCurrentUser,
  updateProfile,
  generateResetToken,
  verifyResetToken,
  resetPassword,
  updateMentorSettings,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserStatus,
  createUser,
};
