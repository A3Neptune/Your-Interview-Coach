import notificationService from '../services/domain/notificationService.js';
import {  handleControllerError  } from '../utils/errorHandler.js';

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const notifications = await notificationService.getUserNotifications(userId);
    res.json({ success: true, notifications });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id || req.user._id;
    const notification = await notificationService.markNotificationAsRead(notificationId, userId);
    res.json({ success: true, notification });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id || req.user._id;
    await notificationService.deleteNotification(notificationId, userId);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export default {
  getUserNotifications,
  markAsRead,
  deleteNotification,
};
