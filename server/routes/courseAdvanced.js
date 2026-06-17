import express from 'express';
import { verifyMentor, verifyToken } from '../middleware/auth.js';
import courseAdvancedController from '../controllers/courseAdvancedController.js';

const router = express.Router();

// ── All static / fixed-segment paths BEFORE any /:param wildcards ──

// Public - no auth required (homepage + /courses page)
router.get('/courses/public', courseAdvancedController.getPublishedCourses);

// Public single course detail (no auth — used by /courses/[id] preview page)
router.get('/courses/public/:courseId', courseAdvancedController.getPublishedCourseById);

// Auth-required published list for students
router.get('/courses/published', verifyToken, courseAdvancedController.getPublishedCourses);

// Mentor course list + create
router.get('/courses', verifyMentor, courseAdvancedController.getMentorCourses);
router.post('/courses', verifyMentor, courseAdvancedController.createCourse);

// Bulk update (static segment "bulk-update" before /:courseId wildcard)
router.post('/courses/bulk-update', verifyMentor, courseAdvancedController.bulkUpdateCourses);

// Cache stats
router.get('/cache/stats', verifyMentor, courseAdvancedController.getCacheStats);

// ── Wildcard /:courseId routes ──

// Published single course for students
router.get('/courses/published/:courseId', verifyToken, courseAdvancedController.getPublishedCourseById);

// Mentor CRUD on single course
router.get('/courses/:courseId', verifyMentor, courseAdvancedController.getCourseById);
router.put('/courses/:courseId', verifyMentor, courseAdvancedController.updateCourse);
router.delete('/courses/:courseId', verifyMentor, courseAdvancedController.deleteCourse);

// Modules
router.put('/courses/:courseId/modules', verifyMentor, courseAdvancedController.updateModules);

// Publish toggle
router.post('/courses/:courseId/toggle-publish', verifyMentor, courseAdvancedController.togglePublish);

// Discount
router.put('/courses/:courseId/discount', verifyMentor, courseAdvancedController.updateCourseDiscount);

// Duplicate
router.post('/courses/:courseId/duplicate', verifyMentor, courseAdvancedController.duplicateCourse);

// Analytics
router.get('/courses/:courseId/analytics', verifyMentor, courseAdvancedController.getCourseAnalytics);
router.get('/courses/:courseId/analytics-detailed', verifyMentor, courseAdvancedController.getDetailedAnalytics);
router.get('/courses/:courseId/enrollments', verifyMentor, courseAdvancedController.getCourseEnrollments);

// Reviews - student routes
router.post('/courses/:courseId/reviews', verifyToken, courseAdvancedController.submitReview);
router.get('/courses/:courseId/reviews', courseAdvancedController.getCourseReviews);

// Reviews - individual review actions
router.put('/reviews/:reviewId/helpful', verifyToken, courseAdvancedController.markReviewHelpful);
router.delete('/reviews/:reviewId', verifyToken, courseAdvancedController.deleteReview);

export default router;