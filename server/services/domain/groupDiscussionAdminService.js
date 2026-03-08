import GroupDiscussion from '../../models/GroupDiscussion.js';
import User from '../../models/User.js';
import Notification from '../../models/Notification.js';
import {  ValidationError, NotFoundError, ForbiddenError  } from '../../utils/errors.js';

/**
 * Connect to GD session
 */
const connectToGD = async (gdId, userId, userDetails, broadcastFn) => {
  const gd = await GroupDiscussion.findById(gdId);
  const user = await User.findById(userId);

  if (!gd) {
    throw new NotFoundError('Group discussion not found');
  }

  const isParticipant = gd.participants.some(p => p.userId.toString() === userId);
  if (!isParticipant) {
    throw new ForbiddenError('User is not a participant in this GD');
  }

  try {
    const userNotification = new Notification({
      userId: userId,
      type: 'gd-user-connected',
      title: `You're now connected to ${gd.title}`,
      message: `You've joined the Zoom session. Good luck!`,
      data: {
        gdId: gd._id,
        meetingLink: gd.meetingLink,
      },
      actionUrl: gd.meetingLink,
    });
    await userNotification.save();

    if (broadcastFn) {
      broadcastFn(userId, userNotification);
    }
  } catch (userNotifErr) {
    console.error('User notification error:', userNotifErr);
  }

  try {
    const adminId = gd.createdBy.toString();
    const adminNotification = new Notification({
      userId: gd.createdBy,
      type: 'gd-user-connected',
      title: `${user.name} connected to "${gd.title}"`,
      message: `${user.name} has joined the Zoom session for your group discussion`,
      data: {
        gdId: gd._id,
        userId: userId,
        userName: user.name,
      },
      actionUrl: `/mentor-dashboard/gd-practice`,
    });
    const savedAdminNotification = await adminNotification.save();

    if (broadcastFn) {
      broadcastFn(adminId, savedAdminNotification);
    }
  } catch (adminNotifErr) {
    console.error('Admin notification error:', adminNotifErr);
  }

  return {
    meetingLink: gd.meetingLink,
  };
};

/**
 * Invite users to GD
 */
const inviteUsersToGD = async (gdId, adminId, userIds, broadcastFn) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new ValidationError('userIds must be a non-empty array');
  }

  const gd = await GroupDiscussion.findById(gdId);
  if (!gd) {
    throw new NotFoundError('Group discussion not found');
  }

  let addedCount = 0;
  let notificationsSent = 0;

  const admin = await User.findById(adminId);

  for (const userId of userIds) {
    const alreadyParticipant = gd.participants.some(p => p.userId.toString() === userId);
    if (alreadyParticipant) continue;

    const user = await User.findById(userId);
    if (!user) continue;

    if (gd.participants.length < gd.maxParticipants) {
      gd.participants.push({
        userId: userId,
        name: user.name,
        email: user.email,
      });
    } else {
      gd.waitlist.push({
        userId: userId,
        name: user.name,
        email: user.email,
      });
    }

    addedCount++;

    try {
      const notification = new Notification({
        userId: userId,
        type: 'gd-invite',
        title: 'You\'ve been invited to a Group Discussion!',
        message: `${admin.name} invited you to join "${gd.title}" on ${new Date(gd.scheduledDate).toLocaleDateString()}`,
        data: {
          gdId: gd._id,
          adminId: admin._id,
          adminName: admin.name,
          isPaid: gd.isPaid || false,
          paymentAmount: gd.price || 0,
        },
        actionUrl: `/group-discussions/${gd._id}`,
        isRead: false,
      });
      await notification.save();
      notificationsSent++;
    } catch (notifErr) {
      console.error('Notification error:', notifErr);
    }
  }

  if (gd.participants.length >= gd.maxParticipants) {
    gd.isFull = true;
  }
  await gd.save();

  return { addedCount, notificationsSent };
};

/**
 * Cancel GD
 */
const cancelGroupDiscussion = async (gdId, adminId, reason, broadcastFn) => {
  const gd = await GroupDiscussion.findById(gdId);
  if (!gd) {
    throw new NotFoundError('Group discussion not found');
  }

  if (gd.createdBy.toString() !== adminId) {
    throw new ForbiddenError('Only creator can cancel this GD');
  }

  gd.status = 'cancelled';
  await gd.save();

  const allUsers = [...gd.participants, ...gd.waitlist];
  for (const userInfo of allUsers) {
    try {
      const notification = new Notification({
        userId: userInfo.userId,
        type: 'gd-cancelled',
        title: `GD "${gd.title}" has been cancelled`,
        message: `The group discussion scheduled for ${new Date(gd.scheduledDate).toLocaleDateString()} has been cancelled.${reason ? ` Reason: ${reason}` : ''}`,
        data: {
          gdId: gd._id,
          reason: reason,
          refundEligible: true,
        },
        actionUrl: `/dashboard/bookings`,
      });
      await notification.save();

      if (broadcastFn) {
        broadcastFn(userInfo.userId.toString(), notification);
      }
    } catch (notifErr) {
      console.error('Notification error:', notifErr);
    }
  }

  return gd;
};

/**
 * Reschedule GD
 */
const rescheduleGroupDiscussion = async (gdId, adminId, newScheduledDate, reason, broadcastFn) => {
  if (!newScheduledDate) {
    throw new ValidationError('New scheduled date is required');
  }

  const gd = await GroupDiscussion.findById(gdId);
  if (!gd) {
    throw new NotFoundError('Group discussion not found');
  }

  if (gd.createdBy.toString() !== adminId) {
    throw new ForbiddenError('Only creator can reschedule this GD');
  }

  const oldDate = new Date(gd.scheduledDate).toLocaleDateString();
  const newDate = new Date(newScheduledDate).toLocaleDateString();

  gd.scheduledDate = new Date(newScheduledDate);
  await gd.save();

  const allUsers = [...gd.participants, ...gd.waitlist];
  for (const userInfo of allUsers) {
    try {
      const notification = new Notification({
        userId: userInfo.userId,
        type: 'gd-rescheduled',
        title: `GD "${gd.title}" has been rescheduled`,
        message: `The group discussion has been moved from ${oldDate} to ${newDate}.${reason ? ` Reason: ${reason}` : ''}`,
        data: {
          gdId: gd._id,
          oldDate: oldDate,
          newDate: newDate,
          reason: reason,
        },
        actionUrl: `/dashboard/gd-invitations`,
      });
      await notification.save();

      if (broadcastFn) {
        broadcastFn(userInfo.userId.toString(), notification);
      }
    } catch (notifErr) {
      console.error('Notification error:', notifErr);
    }
  }

  return gd;
};

/**
 * Edit GD
 */
const editGroupDiscussion = async (gdId, adminId, updates) => {
  const { title, description, topic, duration, maxParticipants } = updates;

  const gd = await GroupDiscussion.findById(gdId);
  if (!gd) {
    throw new NotFoundError('Group discussion not found');
  }

  if (gd.createdBy.toString() !== adminId) {
    throw new ForbiddenError('Only creator can edit this GD');
  }

  if (maxParticipants) {
    if (maxParticipants < 2 || maxParticipants > 9) {
      throw new ValidationError('Max participants must be between 2 and 9');
    }
    if (maxParticipants < gd.participants.length) {
      throw new ValidationError(`Cannot reduce max participants below current count (${gd.participants.length})`);
    }
  }

  if (title) gd.title = title;
  if (description) gd.description = description;
  if (topic) gd.topic = topic;
  if (duration) gd.duration = duration;
  if (maxParticipants) {
    gd.maxParticipants = maxParticipants;
    gd.isFull = gd.participants.length >= maxParticipants;
  }

  await gd.save();
  return gd;
};

/**
 * Delete GD
 */
const deleteGroupDiscussion = async (gdId, adminId) => {
  const gd = await GroupDiscussion.findById(gdId);
  if (!gd) {
    throw new NotFoundError('Group discussion not found');
  }

  if (gd.createdBy.toString() !== adminId) {
    throw new ForbiddenError('Only creator can delete this GD');
  }

  if (new Date() >= new Date(gd.scheduledDate)) {
    throw new ValidationError('Cannot delete GD that has already started');
  }

  await GroupDiscussion.findByIdAndDelete(gdId);
};

export {
  connectToGD,
  inviteUsersToGD,
  cancelGroupDiscussion,
  rescheduleGroupDiscussion,
  editGroupDiscussion,
  deleteGroupDiscussion,
};
export default {
  connectToGD,
  inviteUsersToGD,
  cancelGroupDiscussion,
  rescheduleGroupDiscussion,
  editGroupDiscussion,
  deleteGroupDiscussion,
};
