import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import enrollmentController from '../controllers/enrollmentController.js';

const router = express.Router();

// Enrollment routes
router.post('/:courseId/enroll', verifyToken, enrollmentController.enrollInCourse);
router.get('/my-enrollments', verifyToken, enrollmentController.getMyEnrollments);
router.get('/:courseId/check', verifyToken, enrollmentController.checkEnrollment);
router.put('/:courseId/progress', verifyToken, enrollmentController.updateProgress);
router.delete('/:courseId/unenroll', verifyToken, enrollmentController.unenrollFromCourse);

export default router;
