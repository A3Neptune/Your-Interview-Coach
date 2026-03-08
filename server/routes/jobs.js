import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import jobController from '../controllers/jobController.js';

const router = express.Router();

router.get('/', jobController.getAllJobs);
router.get('/matched', verifyToken, jobController.getMatchedJobs);
router.get('/:jobId', jobController.getJobById);
router.post('/', verifyToken, verifyAdmin, jobController.createJob);
router.put('/:jobId', verifyToken, verifyAdmin, jobController.updateJob);
router.delete('/:jobId', verifyToken, verifyAdmin, jobController.deleteJob);

export default router;
