import { createClient } from 'redis';
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

/**
 * Redis Cache Service for Company Content
 *
 * Graceful degradation: Works without Redis (caching disabled)
 * When Redis is available, caching improves performance significantly
 *
 * Configure in .env:
 * REDIS_URL=rediss://user:password@host:port (cloud with TLS)
 * REDIS_URL=redis://localhost:6379 (local)
 */

let redisClient = null;
let isRedisConnected = false;

// Create Redis client
const createRedisClient = async () => {
  if (!process.env.REDIS_URL) {
    console.warn('⚠️  REDIS_URL not found - caching disabled');
    console.warn('💡 Add REDIS_URL to .env for better performance');
    return null;
  }

  try {
    const redisUrl = process.env.REDIS_URL;

    const client = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 10000,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.warn('⚠️  Redis reconnection failed - continuing without cache');
            isRedisConnected = false;
            return false; // Stop reconnecting
          }
          return Math.min(retries * 1000, 5000);
        },
      },
    });

    client.on('error', (err) => {
      console.warn('⚠️  Redis error:', err.message);
      isRedisConnected = false;
    });

    client.on('connect', () => {
      console.log('🔄 Redis connecting...');
    });

    client.on('ready', () => {
      console.log('✅ Redis connected and ready');
      isRedisConnected = true;
    });

    client.on('end', () => {
      console.warn('⚠️  Redis connection closed');
      isRedisConnected = false;
    });

    // Connect with timeout
    await Promise.race([
      client.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Redis connection timeout')), 10000)
      ),
    ]);

    return client;
  } catch (error) {
    console.warn('⚠️  Redis connection failed:', error.message);
    console.warn('💡 Server will continue without caching');
    return null;
  }
};

// Initialize Redis on module load (non-blocking)
(async () => {
  try {
    redisClient = await createRedisClient();
  } catch (error) {
    console.warn('⚠️  Redis initialization skipped:', error.message);
  }
})();

// Cache TTL constants (in seconds)
const CACHE_TTL = {
  COMPANY_LIST: 300, // 5 minutes
  COMPANY_DETAIL: 600, // 10 minutes
  COMPANY_PUBLIC: 180, // 3 minutes
  USER_PURCHASES: 60, // 1 minute
};

/**
 * Get data from cache
 * Returns null if Redis unavailable (graceful degradation)
 */
export const getCache = async (key) => {
  if (!redisClient || !isRedisConnected) {
    return null; // No cache available
  }

  try {
    const data = await redisClient.get(key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.warn('Redis GET error:', error.message);
    return null;
  }
};

/**
 * Set data in cache
 * Returns false if Redis unavailable (graceful degradation)
 */
export const setCache = async (key, value, ttl = CACHE_TTL.COMPANY_DETAIL) => {
  if (!redisClient || !isRedisConnected) {
    return false;
  }

  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn('Redis SET error:', error.message);
    return false;
  }
};

/**
 * Delete specific cache key
 */
export const deleteCache = async (key) => {
  if (!redisClient || !isRedisConnected) {
    return false;
  }

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.warn('Redis DELETE error:', error.message);
    return false;
  }
};

/**
 * Delete cache by pattern (e.g., "company:*")
 */
export const deleteCachePattern = async (pattern) => {
  if (!redisClient || !isRedisConnected) {
    return false;
  }

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    console.warn('Redis DELETE PATTERN error:', error.message);
    return false;
  }
};

/**
 * Clear all cache
 */
export const clearCache = async () => {
  if (!redisClient || !isRedisConnected) {
    return false;
  }

  try {
    await redisClient.flushDb();
    return true;
  } catch (error) {
    console.warn('Redis FLUSH error:', error.message);
    return false;
  }
};

/**
 * Cache key generators
 */
export const CACHE_KEYS = {
  companyList: (featured, search, industry) => {
    const parts = ['companies'];
    if (featured) parts.push('featured');
    if (search) parts.push(`search:${search}`);
    if (industry) parts.push(`industry:${industry}`);
    return parts.join(':');
  },

  companyDetail: (companyId, userId = null) => {
    return userId ? `company:${companyId}:user:${userId}` : `company:${companyId}`;
  },

  userPurchases: (userId) => `purchases:user:${userId}`,

  purchaseStatus: (userId, companyId) => `purchase:${userId}:${companyId}`,

  industries: () => 'industries:list',
};

/**
 * Invalidate company cache when updated
 */
export const invalidateCompanyCache = async (companyId) => {
  await deleteCachePattern(`company:${companyId}*`);
  await deleteCachePattern('companies:*');
  await deleteCache(CACHE_KEYS.industries());
  if (isRedisConnected) {
    console.log(`🗑️  Invalidated cache for company: ${companyId}`);
  }
};

/**
 * Invalidate user purchase cache
 */
export const invalidateUserPurchaseCache = async (userId, companyId = null) => {
  await deleteCache(CACHE_KEYS.userPurchases(userId));
  if (companyId) {
    await deleteCache(CACHE_KEYS.purchaseStatus(userId, companyId));
  }
  if (isRedisConnected) {
    console.log(`🗑️  Invalidated purchase cache for user: ${userId}`);
  }
};

// Export cache TTL for use in routes
export { CACHE_TTL };

// Export connection status checker
export const isRedisAvailable = () => isRedisConnected;

// Graceful shutdown
export const closeRedis = async () => {
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log('👋 Redis connection closed');
    } catch (error) {
      console.warn('Redis close error:', error.message);
    }
  }
};
