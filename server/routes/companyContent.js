import express from 'express';
import { authenticate, verifyAdmin, verifyMentor } from '../middleware/auth.js';
import { responseCache } from '../middleware/cacheMiddleware.js';
import { CACHE_TTL } from '../services/redisCache.js';
import companyContentController from '../controllers/companyContentController.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

router.get('/public', responseCache(CACHE_TTL.COMPANY_PUBLIC), companyContentController.getAllCompanies);
router.get('/public/meta/industries', companyContentController.getAllIndustries);
router.get('/public/:id', responseCache(CACHE_TTL.COMPANY_DETAIL), companyContentController.getCompanyById);

// ==================== AUTHENTICATED ROUTES ====================

router.get('/:id/purchase-status', authenticate, companyContentController.getPurchaseStatus);
router.get('/user/purchased', authenticate, companyContentController.getUserPurchases);
router.post('/:id/create-order', authenticate, companyContentController.createPaymentOrder);
router.post('/:id/verify-payment', authenticate, companyContentController.verifyPayment);

// ==================== ADMIN ROUTES ====================

router.post('/', authenticate, verifyMentor, companyContentController.createCompanyContent);
router.put('/:id', authenticate, verifyMentor, companyContentController.updateCompanyContent);
router.delete('/:id', authenticate, verifyAdmin, companyContentController.deleteCompanyContent);
router.get('/admin/all', authenticate, verifyMentor, companyContentController.getAllCompaniesAdmin);

export default router;
