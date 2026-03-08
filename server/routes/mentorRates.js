import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import mentorRateController from '../controllers/mentorRateController.js';

const router = express.Router();

router.get('/public/pricing', mentorRateController.getPublicPricing);
router.get('/:mentorId', mentorRateController.getMentorRates);
router.get('/:mentorId/slots/:date', mentorRateController.getMentorSlots);
router.put('/:mentorId', verifyToken, mentorRateController.updateMentorRates);

export default router;
