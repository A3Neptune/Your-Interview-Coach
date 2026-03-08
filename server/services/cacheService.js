/**
 * Advanced In-Memory Caching Service with TTL, LRU eviction, and cache warming
 * This provides Redis-like functionality without external dependencies
 */

class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttlMap = new Map();
    this.accessLog = new Map(); // For LRU tracking
    this.maxSize = 1000; // Maximum cache entries
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
    };

    // Start cleanup interval
    this.startCleanupInterval();
  }

  /**
   * Get value from cache
   */
  get(key) {
    // Check if key exists
    if (!this.cache.has(key)) {
      this.stats.misses++;
      return null;
    }

    // Check TTL
    const ttl = this.ttlMap.get(key);
    if (ttl && Date.now() > ttl) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access log for LRU
    this.accessLog.set(key, Date.now());
    this.stats.hits++;

    return JSON.parse(this.cache.get(key));
  }

  /**
   * Set value in cache with optional TTL
   */
  set(key, value, ttl = this.defaultTTL) {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, JSON.stringify(value));
    this.ttlMap.set(key, Date.now() + ttl);
    this.accessLog.set(key, Date.now());
    this.stats.sets++;

    return true;
  }

  /**
   * Delete key from cache
   */
  delete(key) {
    const deleted = this.cache.delete(key);
    this.ttlMap.delete(key);
    this.accessLog.delete(key);

    if (deleted) {
      this.stats.deletes++;
    }

    return deleted;
  }

  /**
   * Delete keys matching a pattern (e.g., 'course:*')
   */
  deletePattern(pattern) {
    const regex = new RegExp(pattern.replace('*', '.*'));
    let deletedCount = 0;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.delete(key);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  /**
   * Check if key exists
   */
  has(key) {
    const exists = this.cache.has(key);

    if (exists) {
      // Check TTL
      const ttl = this.ttlMap.get(key);
      if (ttl && Date.now() > ttl) {
        this.delete(key);
        return false;
      }
    }

    return exists;
  }

  /**
   * Clear all cache
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    this.ttlMap.clear();
    this.accessLog.clear();
    return size;
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
      size: this.cache.size,
      maxSize: this.maxSize,
    };
  }

  /**
   * Evict oldest (least recently used) entry
   */
  evictOldest() {
    let oldestKey = null;
    let oldestTime = Infinity;

    for (const [key, time] of this.accessLog.entries()) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * Start cleanup interval to remove expired entries
   */
  startCleanupInterval() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, ttl] of this.ttlMap.entries()) {
        if (now > ttl) {
          this.delete(key);
        }
      }
    }, 60000); // Check every minute
  }

  /**
   * Get or set pattern - fetch from cache or compute if missing
   */
  async getOrSet(key, fetchFn, ttl = this.defaultTTL) {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetchFn();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Cache warming - preload data
   */
  async warm(keys, fetchFn, ttl = this.defaultTTL) {
    const promises = keys.map(async (key) => {
      if (!this.has(key)) {
        const value = await fetchFn(key);
        this.set(key, value, ttl);
      }
    });

    await Promise.all(promises);
  }

  /**
   * Invalidate cache for a specific entity
   */
  invalidate(entity, id = '*') {
    const pattern = `${entity}:${id}`;
    return this.deletePattern(pattern);
  }

  /**
   * Batch operations
   */
  mget(keys) {
    return keys.map(key => this.get(key));
  }

  mset(entries, ttl = this.defaultTTL) {
    entries.forEach(([key, value]) => this.set(key, value, ttl));
    return true;
  }
}

// Singleton instance
const cacheService = new CacheService();

// Helper functions for course caching
export const courseCacheKeys = {
  list: (mentorId, filters = {}) => `courses:list:${mentorId}:${JSON.stringify(filters)}`,
  detail: (courseId) => `course:${courseId}`,
  analytics: (courseId) => `course:analytics:${courseId}`,
  modules: (courseId) => `course:modules:${courseId}`,
  student: (userId) => `courses:student:${userId}`,
};

export const invalidateCourseCaches = (courseId, mentorId) => {
  cacheService.deletePattern(`course:${courseId}*`);
  cacheService.deletePattern(`courses:list:${mentorId}*`);
};

export default cacheService;
