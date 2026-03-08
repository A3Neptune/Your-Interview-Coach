import express from 'express';
import { verifyToken, verifyUser } from '../middleware/auth.js';
import contentController from '../controllers/contentController.js';

const router = express.Router();

// ============ COURSE ROUTES ============

router.get('/courses/free', contentController.getFreeCourses);
router.get('/courses/enrolled', verifyToken, verifyUser, contentController.getEnrolledCourses);
router.get('/courses/:courseId', verifyToken, verifyUser, contentController.getCourseById);

router.post('/courses', verifyToken, contentController.createCourse);
router.put('/courses/:courseId', verifyToken, contentController.updateCourse);
router.delete('/courses/:courseId', verifyToken, contentController.deleteCourse);

// ============ CONTENT ROUTES ============

router.get('/content/:contentId', verifyToken, verifyUser, contentController.getContentById);
router.post('/courses/:courseId/content', verifyToken, contentController.addContentToCourse);
router.put('/content/:contentId', verifyToken, contentController.updateContent);
router.delete('/content/:contentId', verifyToken, contentController.deleteContent);

export default router;
