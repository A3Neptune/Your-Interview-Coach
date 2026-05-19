import express from 'express';
import { verifyToken, verifyMentor } from '../middleware/auth.js';
import { trackPageView, getHomeStats, getAllPathsStats } from '../controllers/analyticsController.js';

const router = express.Router();

// IP-based rate limiter for the public tracking beacon.
// Allows reasonable bursts (a few page reloads) but blocks runaway abuse.
const trackRateLimit = (() => {
  const buckets = new Map();
  const MAX = 30;            // max requests per window per IP
  const WINDOW_MS = 60 * 1000;

  return (req, res, next) => {
    const ip =
      (req.headers['x-forwarded-for'] && String(req.headers['x-forwarded-for']).split(',')[0].trim()) ||
      req.ip ||
      req.connection?.remoteAddress ||
      'unknown';
    const now = Date.now();
    const bucket = buckets.get(ip);

    if (!bucket || now > bucket.resetAt) {
      buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
      return next();
    }

    bucket.count++;
    if (bucket.count > MAX) {
      return res.status(429).json({ success: false, error: 'Too many requests' });
    }
    next();
  };
})();

// Public — page-view beacon
router.post('/track', trackRateLimit, trackPageView);

// Mentor — home page analytics summary
router.get('/home-stats', verifyToken, verifyMentor, getHomeStats);

// Mentor — all paths analytics summary
router.get('/all-stats', verifyToken, verifyMentor, getAllPathsStats);

export default router;
