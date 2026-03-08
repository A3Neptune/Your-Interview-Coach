import Redis from 'ioredis';

/**
 * Redis-based Caching Service with TTL, pattern deletion, and advanced features
 * Provides production-ready caching with persistence
 */

class RedisCacheService {
  constructor() {
    // Initialize Redis client
    const redisOptions = {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    };

    if (process.env.REDIS_URL) {
      this.client = new Redis(process.env.REDIS_URL, redisOptions);
    } else {
      const redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: process.env.REDIS_DB || 0,
        ...redisOptions
      };
      this.client = new Redis(redisConfig);
    }
    this.defaultTTL = 5 * 60; // 5 minutes in seconds
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
    };

    // Handle Redis events
    this.client.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    this.client.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });

    this.client.on('ready', () => {
      console.log('🚀 Redis ready for operations');
    });
  }

  /**
   * Get value from Redis
   */
  async get(key) {
    try {
      const value = await this.client.get(key);

      if (value === null) {
        this.stats.misses++;
        return null;
      }

      this.stats.hits++;
      return JSON.parse(value);
    } catch (error) {
      console.error(`Redis GET error for key ${key}:`, error);
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Set value in Redis with optional TTL
   */
  async set(key, value, ttl = this.defaultTTL) {
    try {
      const serialized = JSON.stringify(value);

      if (ttl) {
        await this.client.setex(key, ttl, serialized);
      } else {
        await this.client.set(key, serialized);
      }

      this.stats.sets++;
      return true;
    } catch (error) {
      console.error(`Redis SET error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete key from Redis
   */
  async delete(key) {
    try {
      const deleted = await this.client.del(key);
      if (deleted > 0) {
        this.stats.deletes++;
      }
      return deleted > 0;
    } catch (error) {
      console.error(`Redis DEL error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete keys matching a pattern (e.g., 'course:*')
   */
  async deletePattern(pattern) {
    try {
      const keys = await this.client.keys(pattern);

      if (keys.length === 0) {
        return 0;
      }

      const deleted = await this.client.del(...keys);
      this.stats.deletes += deleted;
      return deleted;
    } catch (error) {
      console.error(`Redis DELETE PATTERN error for pattern ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async has(key) {
    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      console.error(`Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all cache (use with caution)
   */
  async clear() {
    try {
      await this.client.flushdb();
      return true;
    } catch (error) {
      console.error('Redis FLUSHDB error:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0
      ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
      : 0;

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
    };
  }

  /**
   * Get or set pattern - fetch from cache or compute if missing
   */
  async getOrSet(key, fetchFn, ttl = this.defaultTTL) {
    const cached = await this.get(key);

    if (cached !== null) {
      return cached;
    }

    const value = await fetchFn();
    await this.set(key, value, ttl);
    return value;
  }

  /**
   * Batch get multiple keys
   */
  async mget(keys) {
    try {
      if (keys.length === 0) return [];

      const values = await this.client.mget(...keys);
      return values.map(v => v ? JSON.parse(v) : null);
    } catch (error) {
      console.error('Redis MGET error:', error);
      return keys.map(() => null);
    }
  }

  /**
   * Batch set multiple key-value pairs
   */
  async mset(entries, ttl = this.defaultTTL) {
    try {
      const pipeline = this.client.pipeline();

      entries.forEach(([key, value]) => {
        const serialized = JSON.stringify(value);
        if (ttl) {
          pipeline.setex(key, ttl, serialized);
        } else {
          pipeline.set(key, serialized);
        }
      });

      await pipeline.exec();
      this.stats.sets += entries.length;
      return true;
    } catch (error) {
      console.error('Redis MSET error:', error);
      return false;
    }
  }

  /**
   * Increment a counter
   */
  async incr(key, amount = 1) {
    try {
      return await this.client.incrby(key, amount);
    } catch (error) {
      console.error(`Redis INCR error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set expiration time for a key
   */
  async expire(key, ttl) {
    try {
      return await this.client.expire(key, ttl);
    } catch (error) {
      console.error(`Redis EXPIRE error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get remaining TTL for a key
   */
  async ttl(key) {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error(`Redis TTL error for key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Close Redis connection
   */
  async disconnect() {
    await this.client.quit();
  }
}

// Singleton instance
const redisCacheService = new RedisCacheService();

// Helper functions for course caching
export const courseCacheKeys = {
  list: (mentorId, filters = {}) => `courses:list:${mentorId}:${JSON.stringify(filters)}`,
  detail: (courseId) => `course:${courseId}`,
  analytics: (courseId) => `course:analytics:${courseId}`,
  modules: (courseId) => `course:modules:${courseId}`,
  student: (userId) => `courses:student:${userId}`,
  published: (filters = {}) => `courses:published:${JSON.stringify(filters)}`,
};

export const invalidateCourseCaches = async (courseId, mentorId) => {
  await redisCacheService.deletePattern(`course:${courseId}*`);
  await redisCacheService.deletePattern(`courses:list:${mentorId}*`);
  await redisCacheService.deletePattern(`courses:published:*`);
};

export default redisCacheService;
