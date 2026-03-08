import express from 'express';
import { verifyToken, verifyUser } from '../middleware/auth.js';
import webinarController from '../controllers/webinarController.js';

const router = express.Router();

// ============ WEBINAR DISCOVERY ============

router.get('/all', webinarController.getAllWebinars);
router.get('/:webinarId', webinarController.getWebinarById);

// ============ WEBINAR ENROLLMENT ============

router.post('/:webinarId/register', verifyToken, verifyUser, webinarController.registerForWebinar);
router.get('/user/my-webinars', verifyToken, verifyUser, webinarController.getUserWebinars);

// ============ MENTOR WEBINAR MANAGEMENT ============

router.post('/create', verifyToken, webinarController.createWebinar);
router.put('/:webinarId/update', verifyToken, webinarController.updateWebinar);
router.post('/:webinarId/cancel', verifyToken, webinarController.cancelWebinar);
router.get('/mentor/my-webinars', verifyToken, webinarController.getMentorWebinars);
router.get('/:webinarId/registrants', verifyToken, webinarController.getWebinarRegistrants);

export default router;
