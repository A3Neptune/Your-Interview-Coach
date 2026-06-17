import authService from '../services/domain/authService.js';
import { handleControllerError } from '../utils/errorHandler.js';

export const emailLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginWithEmail(email, password, req);
    res.json({ success: true, token: result.token, user: result.user });
  } catch (error) {
    console.error('Email login error:', error);
    handleControllerError(res, error);
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token, tokenType } = req.body;
    const result = await authService.loginWithGoogle(token, tokenType || 'id_token');
    if (result.isNewUser) {
      return res.json({ success: true, isNewUser: true, googleData: result.googleData });
    }
    res.json({ success: true, token: result.token, user: result.user });
  } catch (error) {
    console.error('Google login error:', error);
    handleControllerError(res, error);
  }
};

export const signup = async (req, res) => {
  try {
    const userData = req.body;
    const result = await authService.signup(userData);
    res.status(201).json({
      success: true,
      token: result.token,
      user: result.user,
      isVerified: result.isVerified,
      message: result.message
    });
  } catch (error) {
    console.error('Sign up error:', error);
    handleControllerError(res, error);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await authService.getCurrentUser(userId);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get current user error:', error);
    handleControllerError(res, error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const updates = req.body;
    const user = await authService.updateProfile(userId, updates);
    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    handleControllerError(res, error);
  }
};

export const verifyToken = (req, res) => {
  res.json({ success: true, user: req.user });
};

export const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.generateResetToken(email);
    res.json({
      success: true,
      message: 'Password reset link sent to email',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    handleControllerError(res, error);
  }
};

export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;
    await authService.verifyResetToken(token);
    res.json({ success: true, message: 'Token is valid' });
  } catch (error) {
    console.error('Verify reset token error:', error);
    handleControllerError(res, error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    handleControllerError(res, error);
  }
};

export const updateMentorSettings = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const settings = req.body;
    const user = await authService.updateMentorSettings(userId, settings);
    res.json({ success: true, message: 'Settings updated successfully', user });
  } catch (error) {
    console.error('Update mentor settings error:', error);
    handleControllerError(res, error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { userType, page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = -1 } = req.query;
    const filters = userType ? { userType } : {};
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search: search || '',
      sortBy: sortBy || 'createdAt',
      sortOrder: parseInt(sortOrder) || -1
    };
    const result = await authService.getAllUsers(filters, options);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Get all users error:', error);
    handleControllerError(res, error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const user = await authService.updateUser(userId, updates);
    res.json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    console.error('Update user error:', error);
    handleControllerError(res, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await authService.deleteUser(userId);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    handleControllerError(res, error);
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    const user = await authService.updateUserStatus(userId, isActive);
    res.json({ success: true, message: 'User status updated successfully', user });
  } catch (error) {
    console.error('Update user status error:', error);
    handleControllerError(res, error);
  }
};

export const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await authService.createUser(userData);
    res.status(201).json({ success: true, message: 'User created successfully', user });
  } catch (error) {
    console.error('Create user error:', error);
    handleControllerError(res, error);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const result = await authService.verifyEmail(token);
    res.json({ success: true, token: result.token, user: result.user, message: 'Email verified successfully!' });
  } catch (error) {
    console.error('Verify email error:', error);
    handleControllerError(res, error);
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.resendVerification(email);
    res.json(result);
  } catch (error) {
    console.error('Resend verification error:', error);
    handleControllerError(res, error);
  }
};

export default {
  emailLogin,
  googleLogin,
  signup,
  getCurrentUser,
  updateProfile,
  verifyToken,
  logout,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  updateMentorSettings,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserStatus,
  createUser,
  verifyEmail,
  resendVerification,
};