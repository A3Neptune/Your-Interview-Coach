import express from 'express';
import { verifyToken, verifyUser, verifyAdmin } from '../middleware/auth.js';
import authController from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/email-login', authController.emailLogin);
router.post('/google-login', authController.googleLogin);
router.post('/signup', authController.signup);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-reset-token', authController.verifyResetToken);
router.post('/reset-password', authController.resetPassword);

// Authenticated routes
router.get('/me', verifyToken, authController.getCurrentUser);
router.put('/profile', verifyToken, verifyUser, authController.updateProfile);
router.post('/verify', verifyToken, authController.verifyToken);
router.post('/logout', verifyToken, authController.logout);
router.put('/update-mentor-settings', verifyToken, authController.updateMentorSettings);

// Admin routes
router.get('/all-users', verifyToken, verifyAdmin, authController.getAllUsers);
router.put('/users/:userId', verifyToken, verifyAdmin, authController.updateUser);
router.delete('/users/:userId', verifyToken, verifyAdmin, authController.deleteUser);
router.put('/users/:userId/status', verifyToken, verifyAdmin, authController.updateUserStatus);
router.post('/users/create', verifyToken, verifyAdmin, authController.createUser);

export default router;
