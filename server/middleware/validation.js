/**
 * Booking Input Validation Middleware
 */

import PricingSection from '../models/PricingSection.js';

// Must match Booking model enum and PricingSection service IDs
const VALID_SESSION_TYPES = ['oneMentorship', 'resumeAnalysis', 'gdGroupDiscussions', 'webinars'];

export const validateBookingInput = (req, res, next) => {
  try {
    const { mentorId, sessionType, scheduledDate, duration, amount } = req.body;

    const errors = [];

    // Validate mentorId
    if (!mentorId || typeof mentorId !== 'string') {
      errors.push('Invalid mentorId');
    }

    // Validate sessionType
    if (!sessionType) {
      errors.push('sessionType is required');
    } else if (!VALID_SESSION_TYPES.includes(sessionType)) {
      errors.push(
        `Invalid sessionType. Must be one of: ${VALID_SESSION_TYPES.join(', ')}`
      );
    }

    // Validate scheduledDate
    if (!scheduledDate) {
      errors.push('scheduledDate is required');
    } else {
      const bookingDate = new Date(scheduledDate);
      const now = new Date();

      if (isNaN(bookingDate.getTime())) {
        errors.push('Invalid scheduledDate format');
      } else if (bookingDate <= now) {
        errors.push('scheduledDate must be in the future');
      } else if (bookingDate > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
        errors.push('Can only book up to 30 days in advance');
      }
    }

    // Validate duration
    if (duration) {
      if (typeof duration !== 'number' || duration <= 0 || duration > 480) {
        errors.push('Duration must be a positive number between 1 and 480 minutes');
      }
    }

    // Note: amount validation removed from here
    // FIX 1 & 5: Amount is calculated server-side from pricing database, never from client
    // Client should NOT send amount - it will be ignored
    if (amount !== undefined) {
      console.warn('SECURITY: Client sent amount in booking request - this will be ignored. Amount is calculated server-side.');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    // Attach validated data to request
    req.validated = {
      sessionType,
      duration: duration || 60, // Default to 60 minutes (will be overridden by PricingSection data)
      // amount is NOT included - it will be calculated server-side
    };

    next();
  } catch (err) {
    console.error('Validation error:', err);
    res.status(400).json({ error: 'Validation failed' });
  }
};

/**
 * Rate Limiting Middleware
 * Prevents users from spamming booking requests
 */
export const createRateLimiter = (maxRequests = 10, windowMs = 60 * 1000) => {
  const requestCounts = new Map();

  return (req, res, next) => {
    const userId = req.user?.id || req.user?._id;
    const endpoint = `${req.method}:${req.path}`;
    const key = `${userId}:${endpoint}`;

    const now = Date.now();
    const userData = requestCounts.get(key) || { count: 0, resetTime: now + windowMs };

    // Check if window has expired
    if (now > userData.resetTime) {
      userData.count = 0;
      userData.resetTime = now + windowMs;
    }

    userData.count++;

    if (userData.count > maxRequests) {
      const resetIn = Math.ceil((userData.resetTime - now) / 1000);
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: resetIn,
        message: `Please wait ${resetIn} seconds before trying again`,
      });
    }

    requestCounts.set(key, userData);

    // Add rate limit info to response headers
    res.set({
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': maxRequests - userData.count,
      'X-RateLimit-Reset': userData.resetTime,
    });

    next();
  };
};
