import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import pricingController from '../controllers/pricingController.js';

const router = express.Router();

// Public routes
router.get('/public', pricingController.getPublicPricingSection);
router.get('/public/:serviceId', pricingController.getServiceById);

// Admin routes
router.get('/admin', authenticate, authorize('admin'), pricingController.getAdminPricingSection);
router.put('/admin/header', authenticate, authorize('admin'), pricingController.updateHeader);
router.post('/admin/services', authenticate, authorize('admin'), pricingController.addService);
router.put('/admin/services/:serviceId', authenticate, authorize('admin'), pricingController.updateService);
router.delete('/admin/services/:serviceId', authenticate, authorize('admin'), pricingController.deleteService);
router.put('/admin/stats', authenticate, authorize('admin'), pricingController.updateStats);
router.put('/admin/settings', authenticate, authorize('admin'), pricingController.updateSettings);
router.put('/admin/services/:serviceId/discount', authenticate, authorize('admin'), pricingController.updateServiceDiscount);

export default router;
