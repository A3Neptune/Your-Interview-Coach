import Course from '../../models/Course.js';
import Content from '../../models/Content.js';
import Enrollment from '../../models/Enrollment.js';
import {  ValidationError, NotFoundError, ForbiddenError  } from '../../utils/errors.js';

const getFreeCourses = async () => {
  return await Course.find({
    contentType: 'free',
    isActive: true,
  }).populate('mentorId', 'name designation company profileImage');
};

const getEnrolledCourses = async (userId) => {
  const enrollments = await Enrollment.find({
    userId: userId,
    status: 'active',
  }).populate({
    path: 'courseId',
    populate: { path: 'mentorId', select: 'name designation company profileImage' },
  });

  return enrollments.map(e => ({
    ...e.courseId.toObject(),
    enrollment: {
      progress: e.progress,
      lastAccessedAt: e.lastAccessedAt,
      completedAt: e.completedAt,
    },
  }));
};

const getCourseById = async (courseId, userId) => {
  const course = await Course.findById(courseId).populate('mentorId', 'name designation company profileImage');

  if (!course) {
    throw new NotFoundError('Course not found');
  }

  if (course.contentType !== 'free') {
    const enrollment = await Enrollment.findOne({
      userId: userId,
      courseId,
      status: 'active',
    });

    if (!enrollment) {
      throw new ForbiddenError('Access denied. Course must be purchased.');
    }
  }

  const contents = await Content.find({ courseId, isActive: true }).sort({ order: 1 });

  return {
    course: course.toObject(),
    contents,
  };
};

const getContentById = async (contentId, userId) => {
  const content = await Content.findById(contentId);
  if (!content) {
    throw new NotFoundError('Content not found');
  }

  const course = await Course.findById(content.courseId);

  if (course.contentType !== 'free') {
    const enrollment = await Enrollment.findOne({
      userId: userId,
      courseId: content.courseId,
      status: 'active',
    });

    if (!enrollment) {
      throw new ForbiddenError('Access denied');
    }
  }

  await Enrollment.updateOne(
    { userId: userId, courseId: content.courseId },
    { lastAccessedAt: new Date() }
  );

  return content;
};

const createCourse = async (userId, userType, courseData) => {
  const { title, description, category, contentType, price } = courseData;

  if (!title || !description || !category) {
    throw new ValidationError('Missing required fields');
  }

  if (userType !== 'admin') {
    throw new ForbiddenError('Only admins can create courses');
  }

  const course = new Course({
    title,
    description,
    category,
    contentType: contentType || 'free',
    price: price || 0,
    mentorId: userId,
  });

  await course.save();
  return course;
};

const updateCourse = async (courseId, userId, updates) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new NotFoundError('Course not found');
  }

  if (course.mentorId.toString() !== userId) {
    throw new ForbiddenError('Unauthorized');
  }

  const { title, description, category, contentType, price, isActive } = updates;

  if (title) course.title = title;
  if (description) course.description = description;
  if (category) course.category = category;
  if (contentType) course.contentType = contentType;
  if (price !== undefined) course.price = price;
  if (isActive !== undefined) course.isActive = isActive;

  await course.save();
  return course;
};

const deleteCourse = async (courseId, userId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new NotFoundError('Course not found');
  }

  if (course.mentorId.toString() !== userId) {
    throw new ForbiddenError('Unauthorized');
  }

  await Course.deleteOne({ _id: courseId });
};

const addContentToCourse = async (courseId, userId, contentData) => {
  const { title, description, contentType, embedUrl, videoUrl, duration } = contentData;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new NotFoundError('Course not found');
  }

  if (course.mentorId.toString() !== userId) {
    throw new ForbiddenError('Unauthorized');
  }

  if (!title || !contentType) {
    throw new ValidationError('Title and contentType required');
  }

  const lastContent = await Content.findOne({ courseId }).sort({ order: -1 });
  const order = (lastContent?.order || 0) + 1;

  const content = new Content({
    courseId,
    title,
    description,
    contentType,
    embedUrl,
    videoUrl,
    duration: duration || 0,
    order,
  });

  await content.save();
  return content;
};

const updateContent = async (contentId, userId, updates) => {
  const content = await Content.findById(contentId);
  if (!content) {
    throw new NotFoundError('Content not found');
  }

  const course = await Course.findById(content.courseId);
  if (course.mentorId.toString() !== userId) {
    throw new ForbiddenError('Unauthorized');
  }

  const { title, description, embedUrl, videoUrl, duration, order, isActive } = updates;

  if (title) content.title = title;
  if (description) content.description = description;
  if (embedUrl) content.embedUrl = embedUrl;
  if (videoUrl) content.videoUrl = videoUrl;
  if (duration !== undefined) content.duration = duration;
  if (order !== undefined) content.order = order;
  if (isActive !== undefined) content.isActive = isActive;

  await content.save();
  return content;
};

const deleteContent = async (contentId, userId) => {
  const content = await Content.findById(contentId);
  if (!content) {
    throw new NotFoundError('Content not found');
  }

  const course = await Course.findById(content.courseId);
  if (course.mentorId.toString() !== userId) {
    throw new ForbiddenError('Unauthorized');
  }

  await Content.deleteOne({ _id: contentId });
};

export {
  getFreeCourses,
  getEnrolledCourses,
  getCourseById,
  getContentById,
  createCourse,
  updateCourse,
  deleteCourse,
  addContentToCourse,
  updateContent,
  deleteContent,
};
export default {
  getFreeCourses,
  getEnrolledCourses,
  getCourseById,
  getContentById,
  createCourse,
  updateCourse,
  deleteCourse,
  addContentToCourse,
  updateContent,
  deleteContent,
};
