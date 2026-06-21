import express from 'express';
import ResumeAnalysisRecord from '../models/ResumeAnalysisRecord.js';
import { verifyToken, verifyMentor } from '../middleware/auth.js';

const router = express.Router();

// Public route to save a new record
router.post('/public/record', async (req, res) => {
  try {
    const { publicUrl, atsScore, fileName } = req.body;
    if (!publicUrl) {
      return res.status(400).json({ success: false, message: 'publicUrl is required' });
    }
    const record = new ResumeAnalysisRecord({
      publicUrl,
      atsScore,
      fileName,
    });
    await record.save();
    res.json({ success: true, record });
  } catch (error) {
    console.error('Error saving resume analysis record:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin/Mentor route to get all records
router.get('/records', verifyMentor, async (req, res) => {
  try {
    const records = await ResumeAnalysisRecord.find().sort({ createdAt: -1 });
    res.json({ success: true, records });
  } catch (error) {
    console.error('Error fetching resume analysis records:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
