import GroupDiscussion from '../../models/GroupDiscussion.js';
import User from '../../models/User.js';
import Notification from '../../models/Notification.js';
import Booking from '../../models/Booking.js';
import {  ValidationError, NotFoundError, ForbiddenError  } from '../../utils/errors.js';

/**
 * Check if user has paid for GD
 */
const checkPayment = async (userId, gdId) => {
  if (!gdId) {
    throw new ValidationError('GD ID required');
  }

  const gd = await GroupDiscussion.findById(gdId);
  if (!gd) {
    throw new NotFoundError('Group discussion not found');
  }

  const booking = await Booking.findOne({
    studentId: userId,
    sessionType: 'gd-practice',
    paymentStatus: 'completed',
  });

  return {
    paymentVerified: !!booking,
    paymentAmount: gd.price || 0,
    gdTitle: gd.title,
  };
};

/**
 * Get user's invited GDs
 */
const getUserInvitations = async (userId) => {
  return await GroupDiscussion.find({
    $or: [
      { 'participants.userId': userId },
      { 'waitlist.userId': userId },
    ],
  })
    .populate('createdBy', 'name email')
    .populate('participants.userId', 'name email')
    .sort({ scheduledDate: 1 });
};

/**
 * Get all scheduled GDs
 */
const getAllGroupDiscussions = async (userId) => {
  const gds = await GroupDiscussion.find({ status: 'scheduled' })
    .populate('createdBy', 'name email')
    .populate('participants.userId', 'name email')
    .sort({ scheduledDate: 1 });

  return gds.map(gd => {
    const isParticipant = userId && gd.participants.some(p => p.userId._id.toString() === userId);
    const gdObj = gd.toObject();

    if (!isParticipant && userId !== gd.createdBy._id.toString()) {
      gdObj.meetingLink = null;
    }

    return gdObj;
  });
};

/**
 * Get single GD by ID
 */
const getGroupDiscussionById = async (gdId, userId) => {
  const gd = await GroupDiscussion.findById(gdId)
    .populate('createdBy', 'name email')
    .populate('participants.userId', 'name email')
    .populate('teams.members.userId', 'name email');

  if (!gd) {
    throw new NotFoundError('Group discussion not found');
  }

  const isParticipant = gd.participants.some(p => p.userId._id.toString() === userId);
  const isAdmin = gd.createdBy._id.toString() === userId;
  const participantIndex = gd.participants.findIndex(p => p.userId._id.toString() === userId);

  let gdResponse = gd.toObject();

  if (!isAdmin && !isParticipant) {
    gdResponse.meetingLink = null;
  } else if (isParticipant && participantIndex >= 6) {
    gdResponse.meetingLink = null;
  }

  return {
    gd: gdResponse,
    isParticipant,
    isAdmin,
    participantIndex,
  };
};

/**
 * Create new GD
 */
const createGroupDiscussion = async (adminId, gdData) => {
  const { title, description, topic, scheduledDate, duration, maxParticipants, price } = gdData;

  if (!title || !topic || !scheduledDate) {
    throw new ValidationError('Missing required fields');
  }

  const participants = Number(maxParticipants) || 6;
  if (participants < 2 || participants > 9) {
    throw new ValidationError('Max participants must be between 2 and 9');
  }

  const gdPrice = Number(price) || 0;
  if (gdPrice < 0) {
    throw new ValidationError('Price cannot be negative');
  }

  let zoomMeetingLink = null;
  try {
    const zoomResponse = await zoomService.createMeeting({
      topic: title,
      start_time: new Date(scheduledDate),
      duration: duration || 60,
      settings: {
        host_video: true,
        participant_video: true,
        meeting_authentication: true,
      },
    });
    zoomMeetingLink = zoomResponse.join_url;
  } catch (zoomErr) {
    console.error('Zoom meeting creation failed:', zoomErr.message);
  }

  const gd = new GroupDiscussion({
    title,
    description,
    topic,
    scheduledDate: new Date(scheduledDate),
    duration: duration || 60,
    maxParticipants: participants,
    price: gdPrice,
    meetingLink: zoomMeetingLink,
    createdBy: adminId,
  });

  await gd.save();
  return gd;
};

/**
 * Join GD
 */
const joinGroupDiscussion = async (gdId, userId, broadcastFn) => {
  const user = await User.findById(userId);
  const gd = await GroupDiscussion.findById(gdId);

  if (!gd) {
    throw new NotFoundError('Group discussion not found');
  }

  const alreadyJoined = gd.participants.some(p => p.userId.toString() === userId);
  if (alreadyJoined) {
    throw new ValidationError('You already joined this GD');
  }

  const isWaitlisted = gd.participants.length >= gd.maxParticipants;

  if (!isWaitlisted) {
    gd.participants.push({
      userId: userId,
      name: user.name,
      email: user.email,
    });

    if (gd.participants.length === gd.maxParticipants) {
      gd.isFull = true;
    }
  } else {
    gd.waitlist.push({
      userId: userId,
      name: user.name,
      email: user.email,
    });
  }

  await gd.save();

  try {
    const adminId = gd.createdBy.toString();
    const notification = new Notification({
      userId: gd.createdBy,
      type: 'gd-user-accepted',
      title: `${user.name} accepted GD invitation`,
      message: `${user.name} has accepted your invitation to "${gd.title}"${isWaitlisted ? ' and joined the waitlist' : ''}`,
      data: {
        gdId: gd._id,
        userId: userId,
        userName: user.name,
        isWaitlisted: isWaitlisted,
      },
      actionUrl: `/mentor-dashboard/gd-practice`,
    });
    const savedNotification = await notification.save();

    if (broadcastFn) {
      broadcastFn(adminId, savedNotification);
    }
  } catch (notifErr) {
    console.error('Notification error:', notifErr);
  }

  return {
    message: isWaitlisted ? 'Added to waitlist' : 'Joined successfully',
    gd,
  };
};

/**
 * Leave GD
 */
const leaveGroupDiscussion = async (gdId, userId, broadcastFn) => {
  const gd = await GroupDiscussion.findById(gdId);
  const user = await User.findById(userId);

  if (!gd) {
    throw new NotFoundError('Group discussion not found');
  }

  const wasParticipant = gd.participants.some(p => p.userId.toString() === userId);
  const wasWaitlisted = gd.waitlist.some(p => p.userId.toString() === userId);

  gd.participants = gd.participants.filter(p => p.userId.toString() !== userId);
  gd.waitlist = gd.waitlist.filter(p => p.userId.toString() !== userId);

  if (wasParticipant && gd.waitlist.length > 0) {
    const nextUser = gd.waitlist.shift();
    gd.participants.push({
      userId: nextUser.userId,
      name: nextUser.name,
      email: nextUser.email,
    });
  }

  gd.isFull = gd.participants.length >= gd.maxParticipants;
  await gd.save();

  try {
    const adminId = gd.createdBy.toString();
    const notification = new Notification({
      userId: gd.createdBy,
      type: 'gd-user-declined',
      title: `${user.name} declined/left GD invitation`,
      message: `${user.name} has ${wasWaitlisted ? 'declined' : 'left'} your invitation to "${gd.title}"`,
      data: {
        gdId: gd._id,
        userId: userId,
        userName: user.name,
        wasWaitlisted: wasWaitlisted,
      },
      actionUrl: `/mentor-dashboard/gd-practice`,
    });
    const savedNotification = await notification.save();

    if (broadcastFn) {
      broadcastFn(adminId, savedNotification);
    }
  } catch (notifErr) {
    console.error('Notification error:', notifErr);
  }
};

export {
  checkPayment,
  getUserInvitations,
  getAllGroupDiscussions,
  getGroupDiscussionById,
  createGroupDiscussion,
  joinGroupDiscussion,
  leaveGroupDiscussion,
};
export default {
  checkPayment,
  getUserInvitations,
  getAllGroupDiscussions,
  getGroupDiscussionById,
  createGroupDiscussion,
  joinGroupDiscussion,
  leaveGroupDiscussion,
};
