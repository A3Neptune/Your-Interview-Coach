import express from 'express';
import sessionController from '../controllers/sessionController.js';

const router = express.Router();

router.get('/', sessionController.getAllSessions);
router.post('/', sessionController.createSession);

export default router;
