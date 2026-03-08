import Webinar from '../../models/Webinar.js';
import WebinarEnrollment from '../../models/WebinarEnrollment.js';
import {  ValidationError, NotFoundError, ForbiddenError  } from '../../utils/errors.js';

const getAllWebinars = async () => {
  return await Webinar.find({
    status: { $in: ['scheduled', 'live'] },
    scheduledDate: { $gte: new Date() },
  })
    .populate('mentorId', 'name designation company profileImage')
    .sort({ scheduledDate: 1 });
};

const getWebinarById = async (webinarId) => {
  const webinar = await Webinar.findById(webinarId).populate(
    'mentorId',
    'name designation company profileImage'
  );

  if (!webinar) {
    throw new NotFoundError('Webinar not found');
  }

  return webinar;
};

const registerForWebinar = async (webinarId, userId) => {
  const webinar = await Webinar.findById(webinarId);
  if (!webinar) {
    throw new NotFoundError('Webinar not found');
  }

  const existingEnrollment = await WebinarEnrollment.findOne({
    userId: userId,
    webinarId,
  });

  if (existingEnrollment) {
    throw new ValidationError('Already registered for this webinar');
  }

  if (webinar.registeredCount >= webinar.maxParticipants) {
    throw new ValidationError('Webinar is full');
  }

  const enrollmentType = webinar.price > 0 ? 'pending' : 'free';

  const enrollment = new WebinarEnrollment({
    userId: userId,
    webinarId,
    enrollmentType: webinar.price > 0 ? 'paid' : 'free',
    status: enrollmentType === 'free' ? 'registered' : 'registered',
  });

  await enrollment.save();

  await Webinar.updateOne({ _id: webinarId }, { $inc: { registeredCount: 1 } });

  return {
    message: webinar.price > 0 ? 'Proceed to payment' : 'Registered successfully',
    enrollment,
  };
};

const getUserWebinars = async (userId) => {
  return await WebinarEnrollment.find({ userId: userId })
    .populate({
      path: 'webinarId',
      populate: { path: 'mentorId', select: 'name designation profileImage' },
    })
    .sort({ enrolledAt: -1 });
};

const createWebinar = async (mentorId, userType, webinarData) => {
  if (userType !== 'admin') {
    throw new ForbiddenError('Only mentors can create webinars');
  }

  const { title, description, category, scheduledDate, duration, maxParticipants, price } = webinarData;

  if (!title || !category || !scheduledDate) {
    throw new ValidationError('Missing required fields');
  }

  let zoomData = {};
  try {
    zoomData = await zoomService.createWebinar({
      title,
      description,
      scheduledDate,
      duration: duration || 60,
    });
  } catch (err) {
    console.error('Zoom integration failed:', err);
  }

  const webinar = new Webinar({
    mentorId: mentorId,
    title,
    description,
    category,
    scheduledDate: new Date(scheduledDate),
    duration: duration || 60,
    maxParticipants: maxParticipants || 100,
    price: price || 0,
    status: 'scheduled',
    zoomMeetingId: zoomData.webinarId || null,
    zoomJoinUrl: zoomData.joinUrl || null,
    zoomStartUrl: zoomData.startUrl || null,
  });

  await webinar.save();
  return webinar;
};

const updateWebinar = async (webinarId, userId, updates) => {
  const webinar = await Webinar.findById(webinarId);

  if (!webinar) {
    throw new NotFoundError('Webinar not found');
  }

  if (webinar.mentorId.toString() !== userId) {
    throw new ForbiddenError('Unauthorized');
  }

  const { title, description, scheduledDate, duration, maxParticipants, price, status } = updates;

  if (title) webinar.title = title;
  if (description) webinar.description = description;
  if (scheduledDate) webinar.scheduledDate = new Date(scheduledDate);
  if (duration) webinar.duration = duration;
  if (maxParticipants) webinar.maxParticipants = maxParticipants;
  if (price !== undefined) webinar.price = price;
  if (status) webinar.status = status;

  await webinar.save();
  return webinar;
};

const cancelWebinar = async (webinarId, userId) => {
  const webinar = await Webinar.findById(webinarId);

  if (!webinar) {
    throw new NotFoundError('Webinar not found');
  }

  if (webinar.mentorId.toString() !== userId) {
    throw new ForbiddenError('Unauthorized');
  }

  webinar.status = 'cancelled';
  await webinar.save();
};

const getMentorWebinars = async (mentorId, userType) => {
  if (userType !== 'admin') {
    throw new ForbiddenError('Only mentors can view this');
  }

  return await Webinar.find({ mentorId: mentorId }).sort({
    scheduledDate: -1,
  });
};

const getWebinarRegistrants = async (webinarId, userId) => {
  const webinar = await Webinar.findById(webinarId);

  if (!webinar) {
    throw new NotFoundError('Webinar not found');
  }

  if (webinar.mentorId.toString() !== userId) {
    throw new ForbiddenError('Unauthorized');
  }

  return await WebinarEnrollment.find({ webinarId: webinarId })
    .populate('userId', 'name email mobile')
    .populate('paymentId', 'status invoiceNumber');
};

export {
  getAllWebinars,
  getWebinarById,
  registerForWebinar,
  getUserWebinars,
  createWebinar,
  updateWebinar,
  cancelWebinar,
  getMentorWebinars,
  getWebinarRegistrants,
};
export default {
  getAllWebinars,
  getWebinarById,
  registerForWebinar,
  getUserWebinars,
  createWebinar,
  updateWebinar,
  cancelWebinar,
  getMentorWebinars,
  getWebinarRegistrants,
};
