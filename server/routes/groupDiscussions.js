import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import gdController from '../controllers/groupDiscussionController.js';

const router = express.Router();

// User routes (MUST BE BEFORE /:gdId to avoid route conflicts)
router.get('/check-payment', verifyToken, gdController.checkPayment);
router.get('/user/invitations', verifyToken, gdController.getUserInvitations);
router.get('/all', gdController.getAllGroupDiscussions);

// GD operations
router.get('/:gdId', verifyToken, gdController.getGroupDiscussionById);
router.post('/create', verifyToken, verifyAdmin, gdController.createGroupDiscussion);
router.post('/:gdId/join', verifyToken, gdController.joinGroupDiscussion);
router.post('/:gdId/leave', verifyToken, gdController.leaveGroupDiscussion);
router.post('/:gdId/connect', verifyToken, gdController.connectToGD);

// Admin operations
router.post('/:gdId/invite-users', verifyToken, verifyAdmin, gdController.inviteUsersToGD);
router.post('/:gdId/cancel', verifyToken, verifyAdmin, gdController.cancelGroupDiscussion);
router.put('/:gdId/reschedule', verifyToken, verifyAdmin, gdController.rescheduleGroupDiscussion);
router.put('/:gdId/edit', verifyToken, verifyAdmin, gdController.editGroupDiscussion);
router.delete('/:gdId', verifyToken, verifyAdmin, gdController.deleteGroupDiscussion);

export default router;
