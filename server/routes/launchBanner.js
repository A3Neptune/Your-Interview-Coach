import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import launchBannerController from '../controllers/launchBannerController.js';

const router = express.Router();

// Public routes
router.get('/active', launchBannerController.getActiveBanner);

// Admin routes
router.put('/update', authenticate, authorize('admin'), launchBannerController.updateBanner);
router.post('/toggle', authenticate, authorize('admin'), launchBannerController.toggleBannerStatus);

export default router;
