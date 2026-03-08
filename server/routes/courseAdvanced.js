import express from 'express';
import { verifyMentor, verifyToken } from '../middleware/auth.js';
import courseAdvancedController from '../controllers/courseAdvancedController.js';

const router = express.Router();

// Public routes - Published courses for students
router.get('/courses/published', verifyToken, courseAdvancedController.getPublishedCourses);
router.get('/courses/published/:courseId', verifyToken, courseAdvancedController.getPublishedCourseById);

// Course CRUD - All routes require mentor access
router.get('/courses', verifyMentor, courseAdvancedController.getMentorCourses);
router.get('/courses/:courseId', verifyMentor, courseAdvancedController.getCourseById);
router.post('/courses', verifyMentor, courseAdvancedController.createCourse);
router.put('/courses/:courseId', verifyMentor, courseAdvancedController.updateCourse);
router.delete('/courses/:courseId', verifyMentor, courseAdvancedController.deleteCourse);

// Course modules
router.put('/courses/:courseId/modules', verifyMentor, courseAdvancedController.updateModules);

// Publish toggle
router.post('/courses/:courseId/toggle-publish', verifyMentor, courseAdvancedController.togglePublish);

// Analytics
router.get('/courses/:courseId/analytics', verifyMentor, courseAdvancedController.getCourseAnalytics);

// Bulk operations
router.post('/courses/bulk-update', verifyMentor, courseAdvancedController.bulkUpdateCourses);

// Duplicate course
router.post('/courses/:courseId/duplicate', verifyMentor, courseAdvancedController.duplicateCourse);

// Cache stats
router.get('/cache/stats', verifyMentor, courseAdvancedController.getCacheStats);

// Reviews - Student routes
router.post('/courses/:courseId/reviews', verifyToken, courseAdvancedController.submitReview);
router.get('/courses/:courseId/reviews', courseAdvancedController.getCourseReviews);
router.put('/reviews/:reviewId/helpful', verifyToken, courseAdvancedController.markReviewHelpful);
router.delete('/reviews/:reviewId', verifyToken, courseAdvancedController.deleteReview);

// Enrollment & Analytics - Mentor routes
router.get('/courses/:courseId/enrollments', verifyMentor, courseAdvancedController.getCourseEnrollments);
router.get('/courses/:courseId/analytics-detailed', verifyMentor, courseAdvancedController.getDetailedAnalytics);

export default router;
