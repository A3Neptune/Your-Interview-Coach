import express from 'express';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const { type, message, rating, page, email } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const feedback = await Feedback.create({
      type: type || 'general',
      message: message.trim(),
      rating: rating || null,
      page,
      email: email.trim(),
      userId: req.user?.id,
    });

    res.status(201).json({ success: true, id: feedback._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save feedback.' });
  }
});

// Admin: list all feedback
router.get('/', /* authMiddleware, */ async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type)   filter.type   = type;

    const [items, total] = await Promise.all([
      Feedback.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Feedback.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch feedback.' });
  }
});

// Admin: update status
router.patch('/:id/status', /* authMiddleware, */ async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Could not update feedback.' });
  }
});

export default router;