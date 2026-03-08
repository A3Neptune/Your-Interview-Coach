import contentService from '../services/domain/contentService.js';
import {  handleControllerError  } from '../utils/errorHandler.js';

export const getFreeCourses = async (req, res) => {
  try {
    const courses = await contentService.getFreeCourses();
    res.json({ success: true, courses });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const courses = await contentService.getEnrolledCourses(userId);
    res.json({ success: true, courses });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const result = await contentService.getCourseById(courseId, userId);
    res.json({ success: true, ...result });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getContentById = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user.id;

    const content = await contentService.getContentById(contentId, userId);
    res.json({ success: true, content });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const createCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.userType;

    const course = await contentService.createCourse(userId, userType, req.body);
    res.status(201).json({ success: true, course });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await contentService.updateCourse(courseId, userId, req.body);
    res.json({ success: true, course });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    await contentService.deleteCourse(courseId, userId);
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const addContentToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const content = await contentService.addContentToCourse(courseId, userId, req.body);
    res.status(201).json({ success: true, content });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const updateContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user.id;

    const content = await contentService.updateContent(contentId, userId, req.body);
    res.json({ success: true, content });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const deleteContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.user.id;

    await contentService.deleteContent(contentId, userId);
    res.json({ success: true, message: 'Content deleted' });
  } catch (error) {
    handleControllerError(res, error);
  }
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
