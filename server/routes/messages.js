import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import messageController from '../controllers/messageController.js';

const router = express.Router();

// Booking-based messaging (new endpoints)
router.get('/conversations', verifyToken, messageController.getUserConversations);
router.get('/booking/:bookingId', verifyToken, messageController.getBookingMessages);
router.post('/send', verifyToken, messageController.sendBookingMessage);

// Legacy endpoints (keep for backwards compatibility)
router.get('/:otherUserId', verifyToken, messageController.getConversation);
router.post('/', verifyToken, messageController.sendMessage);
router.put('/:senderId/read', verifyToken, messageController.markAsRead);

export default router;
