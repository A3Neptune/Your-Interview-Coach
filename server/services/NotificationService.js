import redis from 'redis';
import BullQueue from 'bull';
import Notification from '../models/Notification.js';

class NotificationService {
  constructor() {
    this.redisClient = null;
    this.notificationQueue = null;
    this.isInitialized = false;
    this.fallbackMode = false;
    this.metrics = {
      totalSent: 0,
      totalDelivered: 0,
      totalFailed: 0,
      totalQueued: 0,
      sse_connections: 0,
      avg_delivery_time: 0,
    };
    this.sse_connections = new Map(); // userId -> Set of response objects
    this.delivery_tracking = new Map(); // notificationId -> { userId, sentAt, status }
  }

  async initialize() {
    try {
      // Initialize Redis client for connection tracking
      this.redisClient = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
      });

      this.redisClient.on('error', (err) => {
        console.error('Redis Client Error:', err);
      });

      await this.redisClient.connect();
      console.log('✅ NotificationService: Redis connected');

      // Initialize Bull queue for reliable notification delivery
      this.notificationQueue = new BullQueue('notifications', {
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          password: process.env.REDIS_PASSWORD,
        },
      });

      // Set up queue event listeners
      this.notificationQueue.on('completed', (job) => {
        console.log(`✅ Notification job ${job.id} completed`);
      });

      this.notificationQueue.on('failed', (job, err) => {
        console.error(`❌ Notification job ${job.id} failed:`, err.message);
        this.metrics.totalFailed++;
      });

      // Create processor for the queue
      this.notificationQueue.process(10, async (job) => {
        return await this.processNotificationJob(job);
      });

      console.log('✅ NotificationService: Bull queue and worker initialized');
    } catch (err) {
      console.error('❌ NotificationService initialization error:', err);
      throw err;
    }
  }

  // Register SSE connection
  registerSSEConnection(userId, responseObject) {
    if (!this.sse_connections.has(userId)) {
      this.sse_connections.set(userId, new Set());
    }
    this.sse_connections.get(userId).add(responseObject);
    this.metrics.sse_connections = this.getTotalSSEConnections();
    console.log(`✓ SSE: User ${userId} connected. Total connections: ${this.metrics.sse_connections}`);

    // Store in Redis for multi-server deployment
    this.redisClient.hSet(`sse:connections:${userId}`, `conn_${Date.now()}`, '1', (err) => {
      if (err) console.error('Redis HSET error:', err);
    });
  }

  // Unregister SSE connection
  unregisterSSEConnection(userId, responseObject) {
    const clients = this.sse_connections.get(userId);
    if (clients) {
      clients.delete(responseObject);
      if (clients.size === 0) {
        this.sse_connections.delete(userId);
      }
    }
    this.metrics.sse_connections = this.getTotalSSEConnections();
    console.log(`✓ SSE: User ${userId} disconnected. Total connections: ${this.metrics.sse_connections}`);
  }

  // Get total SSE connections
  getTotalSSEConnections() {
    let total = 0;
    for (const [, clients] of this.sse_connections) {
      total += clients.size;
    }
    return total;
  }

  // Queue notification for delivery (replaces direct broadcast)
  async queueNotification(userId, notificationData) {
    try {
      const job = await this.notificationQueue.add(
        {
          userId,
          notification: notificationData,
          attempts: 0,
        },
        {
          attempts: 3, // Retry up to 3 times
          backoff: {
            type: 'exponential',
            delay: 2000, // Start with 2 seconds
          },
          removeOnComplete: true,
          timeout: 10000, // 10 second timeout per attempt
        }
      );

      this.metrics.totalQueued++;
      console.log(`📍 Notification queued for user ${userId}, job ID: ${job.id}`);
      return job;
    } catch (err) {
      console.error('❌ Error queueing notification:', err);
      throw err;
    }
  }

  // Process notification from queue
  async processNotificationJob(job) {
    const { userId, notification } = job.data;
    const startTime = Date.now();

    try {
      // Try SSE delivery first
      const sseDelivered = this.sendViaSSE(userId, notification);

      if (sseDelivered) {
        const deliveryTime = Date.now() - startTime;
        this.updateMetrics(userId, notification._id, 'delivered', deliveryTime);
        console.log(`✅ Notification delivered via SSE in ${deliveryTime}ms`);
        return { success: true, method: 'SSE', deliveryTime };
      } else {
        // SSE not available, notification already in DB for polling
        console.log(`⚠️ SSE unavailable for user ${userId}, falling back to polling`);
        return { success: true, method: 'polling', deliveryTime: Date.now() - startTime };
      }
    } catch (err) {
      console.error(`❌ Error processing notification job:`, err);
      throw err; // Throw to trigger retry
    }
  }

  // Send notification via SSE
  sendViaSSE(userId, notification) {
    const clients = this.sse_connections.get(userId);
    if (!clients || clients.size === 0) {
      return false;
    }

    const message = {
      type: 'notification',
      data: notification,
      timestamp: new Date().toISOString(),
    };

    let successCount = 0;
    clients.forEach(client => {
      try {
        client.write(`data: ${JSON.stringify(message)}\n\n`);
        successCount++;
      } catch (err) {
        console.error(`❌ Error sending SSE message:`, err.message);
        clients.delete(client);
      }
    });

    console.log(`📊 SSE: Sent to ${successCount}/${clients.size} clients`);
    return successCount > 0;
  }

  // Update delivery metrics
  updateMetrics(userId, notificationId, status, deliveryTime = 0) {
    this.delivery_tracking.set(notificationId, {
      userId,
      status,
      sentAt: new Date(),
      deliveryTime,
    });

    if (status === 'delivered' && deliveryTime > 0) {
      const currentAvg = this.metrics.avg_delivery_time;
      const totalDelivered = this.metrics.totalDelivered + 1;
      this.metrics.avg_delivery_time = (currentAvg * this.metrics.totalDelivered + deliveryTime) / totalDelivered;
    }

    this.metrics.totalSent++;
  }

  // Broadcast notification (optimized version)
  async broadcastNotification(userId, notificationData) {
    try {
      // Try immediate SSE delivery
      const sseDelivered = this.sendViaSSE(userId, notificationData);

      if (sseDelivered) {
        console.log(`✅ Notification delivered immediately via SSE`);
        return { success: true, method: 'SSE', queued: false };
      } else {
        // Queue for retry and fallback to polling
        await this.queueNotification(userId, notificationData);
        return { success: true, method: 'queued', queued: true };
      }
    } catch (err) {
      console.error('❌ Broadcast error:', err);
      throw err;
    }
  }

  // Get delivery status
  getDeliveryStatus(notificationId) {
    return this.delivery_tracking.get(notificationId);
  }

  // Get metrics
  getMetrics() {
    return {
      ...this.metrics,
      delivery_tracking_size: this.delivery_tracking.size,
      queue_count: this.notificationQueue ? this.notificationQueue.count() : 0,
    };
  }

  // Acknowledge notification delivery (for read receipts)
  async acknowledgeDelivery(userId, notificationId) {
    try {
      const status = this.delivery_tracking.get(notificationId);
      if (status) {
        status.acknowledgedAt = new Date();
        status.status = 'acknowledged';
      }
      console.log(`✅ Notification ${notificationId} acknowledged by user ${userId}`);
    } catch (err) {
      console.error('❌ Error acknowledging delivery:', err);
    }
  }

  // Clean up old delivery tracking
  cleanupDeliveryTracking(maxAge = 3600000) { // 1 hour default
    const now = Date.now();
    for (const [notifId, record] of this.delivery_tracking) {
      if (now - new Date(record.sentAt).getTime() > maxAge) {
        this.delivery_tracking.delete(notifId);
      }
    }
  }

  // Graceful shutdown
  async shutdown() {
    try {
      if (this.notificationQueue) {
        await this.notificationQueue.close();
      }
      if (this.redisClient) {
        await this.redisClient.quit();
      }
      console.log('✅ NotificationService shut down gracefully');
    } catch (err) {
      console.error('❌ Error during shutdown:', err);
    }
  }
}

export default new NotificationService();
