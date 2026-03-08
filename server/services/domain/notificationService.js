import Notification from '../../models/Notification.js';
import {  NotFoundError  } from '../../utils/errors.js';

const getUserNotifications = async (userId) => {
  return await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);
};

const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({ _id: notificationId, userId });
  if (!notification) {
    throw new NotFoundError('Notification not found');
  }
  notification.isRead = true;
  return await notification.save();
};

const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });
  if (!notification) {
    throw new NotFoundError('Notification not found');
  }
  return notification;
};

export {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
};
export default {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
};
