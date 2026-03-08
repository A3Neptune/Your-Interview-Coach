import gdService from '../services/domain/groupDiscussionService.js';
import gdAdminService from '../services/domain/groupDiscussionAdminService.js';
import {  handleControllerError  } from '../utils/errorHandler.js';

// Note: broadcastNotification function should be passed from the route or imported
// This is a placeholder for SSE broadcasting
const broadcastNotification = (userId, notification) => {
  // SSE broadcast logic here
  console.log(`Broadcasting notification to ${userId}:`, notification._id);
};

export const checkPayment = async (req, res) => {
  try {
    const { gdId } = req.query;
    const userId = req.user.id;

    const result = await gdService.checkPayment(userId, gdId);

    res.json({ success: true, ...result });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getUserInvitations = async (req, res) => {
  try {
    const userId = req.user.id;

    const gds = await gdService.getUserInvitations(userId);

    res.json({
      success: true,
      gds: gds,
      timestamp: Date.now(),
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getAllGroupDiscussions = async (req, res) => {
  try {
    const userId = req.user?.id;

    const gds = await gdService.getAllGroupDiscussions(userId);

    res.json({
      success: true,
      gds: gds,
      total: gds.length,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getGroupDiscussionById = async (req, res) => {
  try {
    const { gdId } = req.params;
    const userId = req.user.id;

    const result = await gdService.getGroupDiscussionById(gdId, userId);

    res.json({ success: true, ...result });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const createGroupDiscussion = async (req, res) => {
  try {
    const adminId = req.user.id;
    const gdData = req.body;

    const gd = await gdService.createGroupDiscussion(adminId, gdData);

    res.status(201).json({
      success: true,
      message: 'Group discussion created successfully',
      gd: gd,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const joinGroupDiscussion = async (req, res) => {
  try {
    const { gdId } = req.params;
    const userId = req.user.id;

    const result = await gdService.joinGroupDiscussion(gdId, userId, broadcastNotification);

    res.json({ success: true, ...result });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const leaveGroupDiscussion = async (req, res) => {
  try {
    const { gdId } = req.params;
    const userId = req.user.id;

    await gdService.leaveGroupDiscussion(gdId, userId, broadcastNotification);

    res.json({
      success: true,
      message: 'Left group discussion',
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const connectToGD = async (req, res) => {
  try {
    const { gdId } = req.params;
    const userId = req.user.id;
    const userDetails = req.user;

    const result = await gdAdminService.connectToGD(gdId, userId, userDetails, broadcastNotification);

    res.json({
      success: true,
      message: 'Connected to GD',
      ...result,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const inviteUsersToGD = async (req, res) => {
  try {
    const { gdId } = req.params;
    const { userIds } = req.body;
    const adminId = req.user.id;

    const result = await gdAdminService.inviteUsersToGD(gdId, adminId, userIds, broadcastNotification);

    res.json({
      success: true,
      message: `Added ${result.addedCount} users to GD and sent ${result.notificationsSent} notifications`,
      ...result,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const cancelGroupDiscussion = async (req, res) => {
  try {
    const { gdId } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    const gd = await gdAdminService.cancelGroupDiscussion(gdId, adminId, reason, broadcastNotification);

    res.json({
      success: true,
      message: 'Group discussion cancelled and notifications sent to all participants',
      gd: gd,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const rescheduleGroupDiscussion = async (req, res) => {
  try {
    const { gdId } = req.params;
    const { newScheduledDate, reason } = req.body;
    const adminId = req.user.id;

    const gd = await gdAdminService.rescheduleGroupDiscussion(
      gdId,
      adminId,
      newScheduledDate,
      reason,
      broadcastNotification
    );

    res.json({
      success: true,
      message: 'Group discussion rescheduled and notifications sent to all participants',
      gd: gd,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const editGroupDiscussion = async (req, res) => {
  try {
    const { gdId } = req.params;
    const adminId = req.user.id;
    const updates = req.body;

    const gd = await gdAdminService.editGroupDiscussion(gdId, adminId, updates);

    res.json({
      success: true,
      message: 'Group discussion updated successfully',
      gd: gd,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const deleteGroupDiscussion = async (req, res) => {
  try {
    const { gdId } = req.params;
    const adminId = req.user.id;

    await gdAdminService.deleteGroupDiscussion(gdId, adminId);

    res.json({
      success: true,
      message: 'Group discussion deleted successfully',
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export default {
  checkPayment,
  getUserInvitations,
  getAllGroupDiscussions,
  getGroupDiscussionById,
  createGroupDiscussion,
  joinGroupDiscussion,
  leaveGroupDiscussion,
  connectToGD,
  inviteUsersToGD,
  cancelGroupDiscussion,
  rescheduleGroupDiscussion,
  editGroupDiscussion,
  deleteGroupDiscussion,
};
