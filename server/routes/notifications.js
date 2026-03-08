import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import notificationController from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', verifyToken, notificationController.getUserNotifications);
router.put('/:notificationId/read', verifyToken, notificationController.markAsRead);
router.delete('/:notificationId', verifyToken, notificationController.deleteNotification);

export default router;
