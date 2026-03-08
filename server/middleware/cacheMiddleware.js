/**
 * Express Middleware for Response Caching
 *
 * Caches the entire response in Redis, including:
 * - Response body
 * - Status code
 * - Headers
 *
 * This bypasses ALL route logic for cache hits
 */

import { getCache, setCache } from '../services/redisCache.js';
import crypto from 'crypto';

/**
 * Generate cache key from request
 */
const generateCacheKey = (req) => {
  const { method, originalUrl, headers } = req;

  // Include authorization in cache key for user-specific responses
  const authToken = headers.authorization || 'public';
  const userId = req.user?.id || 'anonymous';

  // Create unique key
  const keyData = `${method}:${originalUrl}:${userId}`;
  return `response:${crypto.createHash('md5').update(keyData).digest('hex')}`;
};

/**
 * Response Cache Middleware
 *
 * Usage:
 * router.get('/path', responseCache(300), handler)
 */
export const responseCache = (ttl = 180) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = generateCacheKey(req);
    const cacheStart = Date.now();

    try {
      // Try to get cached response
      const cachedResponse = await getCache(cacheKey);

      if (cachedResponse) {
        const cacheTime = Date.now() - cacheStart;
        console.log(`⚡ FAST Cache HIT: ${req.originalUrl} (${cacheTime}ms)`);

        // Send cached response immediately
        res.status(cachedResponse.status);

        // Set cached headers
        if (cachedResponse.headers) {
          Object.keys(cachedResponse.headers).forEach(key => {
            res.set(key, cachedResponse.headers[key]);
          });
        }

        return res.json(cachedResponse.body);
      }

      // Cache miss - intercept response
      const originalJson = res.json.bind(res);

      res.json = function(body) {
        // Store in cache
        const responseData = {
          status: res.statusCode,
          body: body,
          headers: {
            'Content-Type': 'application/json',
          },
          cachedAt: new Date().toISOString(),
        };

        // Cache asynchronously (don't block response)
        setCache(cacheKey, responseData, ttl).catch(err => {
          console.error('Cache set error:', err.message);
        });

        // Send response normally
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error.message);
      // On error, bypass cache
      next();
    }
  };
};

/**
 * Clear cache for specific route pattern
 */
export const clearRouteCache = async (pattern) => {
  const { deleteCachePattern } = await import('../services/redisCache.js');
  await deleteCachePattern(`response:*${pattern}*`);
};
