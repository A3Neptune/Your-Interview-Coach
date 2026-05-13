import crypto from 'crypto';
import PageView from '../models/PageView.js';

const HASH_SECRET = process.env.JWT_SECRET || 'yic-analytics-salt';

const TRACKED_PATHS = new Set(['/']);

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return req.ip || req.connection?.remoteAddress || 'unknown';
};

const buildVisitorHash = (ip, userAgent) => {
  const raw = `${ip}::${userAgent}::${HASH_SECRET}`;
  return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 32);
};

const truncate = (val, n) => {
  if (!val) return '';
  const s = String(val);
  return s.length > n ? s.slice(0, n) : s;
};

/**
 * POST /api/analytics/track
 * Public — records a page view. Body: { path, referrer? }
 */
export const trackPageView = async (req, res) => {
  try {
    const path = (req.body?.path || '/').toString();
    if (!TRACKED_PATHS.has(path)) {
      return res.json({ success: true, tracked: false });
    }

    const ip = getClientIp(req);
    const userAgent = truncate(req.headers['user-agent'], 480);
    const referrer = truncate(req.body?.referrer || req.headers['referer'] || '', 480);
    const visitorHash = buildVisitorHash(ip, userAgent);

    await PageView.create({ path, visitorHash, userAgent, referrer });
    return res.json({ success: true, tracked: true });
  } catch (err) {
    console.error('[Analytics] track error:', err.message);
    return res.json({ success: false });
  }
};

/**
 * GET /api/analytics/home-stats
 * Mentor-only — returns hits & unique visitors for the home page
 * by today / this week / this month / all-time.
 */
export const getHomeStats = async (req, res) => {
  try {
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(startOfDay);
    const dow = startOfWeek.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    startOfWeek.setDate(startOfWeek.getDate() + mondayOffset);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

    const filter = { path: '/' };

    const aggregateWindow = async (since) => {
      const q = since ? { ...filter, createdAt: { $gte: since } } : filter;
      const [hits, uniqueIds] = await Promise.all([
        PageView.countDocuments(q),
        PageView.distinct('visitorHash', q),
      ]);
      return { hits, unique: uniqueIds.length };
    };

    const [today, week, month, allTime] = await Promise.all([
      aggregateWindow(startOfDay),
      aggregateWindow(startOfWeek),
      aggregateWindow(startOfMonth),
      aggregateWindow(null),
    ]);

    const lastViewDoc = await PageView.findOne({ path: '/' }).sort({ createdAt: -1 }).select('createdAt');

    return res.json({
      success: true,
      stats: {
        today,
        week,
        month,
        allTime,
        lastViewAt: lastViewDoc?.createdAt || null,
      },
    });
  } catch (err) {
    console.error('[Analytics] getHomeStats error:', err);
    return res.status(500).json({ success: false, error: 'Failed to load home page analytics' });
  }
};
