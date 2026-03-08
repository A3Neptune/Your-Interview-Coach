import redis from 'redis';
import BullQueue from 'bull';

class WebSocketNotificationService {
  constructor() {
    this.io = null; // Socket.IO instance
    this.redisClient = null;
    this.notificationQueue = null;
    this.userSockets = new Map(); // userId -> Set of socket IDs
    this.socketUserMap = new Map(); // socketId -> userId
    this.metrics = {
      totalSent: 0,
      totalDelivered: 0,
      totalFailed: 0,
      totalQueued: 0,
      activeConnections: 0,
      avg_delivery_time: 0,
    };
  }

  async initialize(io) {
    try {
      this.io = io;
      console.log('🔌 WebSocketNotificationService: Initializing Socket.IO...');

      // Initialize Redis client for persistence and multi-server support
      const redisConfig = process.env.REDIS_URL ? {
        url: process.env.REDIS_URL
      } : {
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
        },
        password: process.env.REDIS_PASSWORD,
      };

      this.redisClient = redis.createClient(redisConfig);

      this.redisClient.on('error', (err) => {
        console.error('Redis Client Error:', err);
      });

      await this.redisClient.connect();
      console.log('✅ WebSocketNotificationService: Redis connected');

      // Initialize Bull queue for reliable notification delivery
      const bullConfig = process.env.REDIS_URL ? process.env.REDIS_URL : {
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          password: process.env.REDIS_PASSWORD,
        }
      };
      
      this.notificationQueue = new BullQueue('notifications', bullConfig);

      // Queue event listeners
      this.notificationQueue.on('completed', (job) => {
        console.log(`✅ Notification job ${job.id} completed`);
      });

      this.notificationQueue.on('failed', (job, err) => {
        console.error(`❌ Notification job ${job.id} failed:`, err.message);
        this.metrics.totalFailed++;
      });

      // Process queue jobs
      this.notificationQueue.process(10, async (job) => {
        return await this.processNotificationJob(job);
      });

      console.log('✅ WebSocketNotificationService: Bull queue initialized');

      // Socket.IO middleware for authentication
      this.io.use(async (socket, next) => {
        try {
          console.log('🔐 WebSocket Auth: Checking authentication...');
          const token = socket.handshake.auth.token;

          if (!token) {
            console.error('🔐 WebSocket Auth: No token provided');
            return next(new Error('No token provided'));
          }

          console.log('🔐 WebSocket Auth: Token received, verifying...');
          const decoded = await this.verifyToken(token);
          console.log('🔐 WebSocket Auth: Token verified for user:', decoded.id);

          socket.userId = decoded.id;
          socket.userEmail = decoded.email;
          socket.userType = decoded.userType;
          next();
        } catch (err) {
          console.error('🔐 WebSocket Auth: Error -', err.message);
          next(new Error(`Auth failed: ${err.message}`));
        }
      });

      // Socket.IO connection handler
      this.io.on('connection', (socket) => {
        console.log('🔌 WebSocketNotificationService: New socket connection attempt');
        this.handleSocketConnection(socket);
      });

      this.io.on('error', (error) => {
        console.error('❌ Socket.IO error:', error);
      });

      console.log('✅ WebSocketNotificationService initialized successfully');
      console.log('🔌 Socket.IO listening on root namespace');
    } catch (err) {
      console.error('❌ WebSocketNotificationService initialization error:', err);
      throw err;
    }
  }

  async verifyToken(token) {
    const jwt = (await import('jsonwebtoken')).default;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  }

  handleSocketConnection(socket) {
    const userId = socket.userId;
    console.log(`🔌 WebSocket: User ${userId} connected (socket: ${socket.id})`);

    // Track this socket for the user
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(socket.id);
    this.socketUserMap.set(socket.id, userId);
    this.metrics.activeConnections = Array.from(this.userSockets.values()).reduce((sum, set) => sum + set.size, 0);

    // Send connection confirmation
    socket.emit('notification:connected', {
      message: 'Connected to notification service',
      timestamp: new Date().toISOString(),
    });

    // Handle incoming events
    socket.on('notification:subscribe', (callback) => {
      console.log(`✅ User ${userId} subscribed to notifications`);
      callback({ success: true });
    });

    socket.on('notification:ack', (data) => {
      console.log(`✓ User ${userId} acknowledged notification ${data.notificationId}`);
      this.updateMetrics(userId, data.notificationId, 'acknowledged', data.deliveryTime);
    });

    socket.on('disconnect', () => {
      this.handleSocketDisconnect(socket, userId);
    });

    socket.on('error', (err) => {
      console.error(`❌ WebSocket error for user ${userId}:`, err);
    });
  }

  handleSocketDisconnect(socket, userId) {
    console.log(`🔌 WebSocket: User ${userId} disconnected (socket: ${socket.id})`);

    // Remove socket from tracking
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
    this.socketUserMap.delete(socket.id);
    this.metrics.activeConnections = Array.from(this.userSockets.values()).reduce((sum, set) => sum + set.size, 0);
  }

  async broadcastNotification(userId, notificationData) {
    try {
      console.log(`📢 Broadcasting notification to user ${userId}`);

      // Try immediate WebSocket delivery
      const wsDelivered = this.deliverViaWebSocket(userId, notificationData);

      if (wsDelivered) {
        console.log(`✅ Notification delivered immediately via WebSocket`);
        return { success: true, method: 'WebSocket', queued: false };
      } else {
        // Queue for retry with polling fallback
        await this.queueNotification(userId, notificationData);
        console.log(`📍 Notification queued for user ${userId}`);
        return { success: true, method: 'queued', queued: true };
      }
    } catch (err) {
      console.error('❌ Broadcast error:', err);
      throw err;
    }
  }

  deliverViaWebSocket(userId, notification) {
    const socketIds = this.userSockets.get(userId);
    if (!socketIds || socketIds.size === 0) {
      return false;
    }

    const message = {
      type: 'notification',
      data: notification,
      timestamp: new Date().toISOString(),
    };

    let successCount = 0;
    socketIds.forEach(socketId => {
      try {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
          socket.emit('notification:new', message);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error sending to socket ${socketId}:`, err.message);
      }
    });

    console.log(`📊 WebSocket: Delivered to ${successCount}/${socketIds.size} clients`);
    this.metrics.totalDelivered++;
    return successCount > 0;
  }

  async queueNotification(userId, notificationData) {
    try {
      const job = await this.notificationQueue.add(
        {
          userId,
          notification: notificationData,
          attempts: 0,
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          timeout: 10000,
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

  async processNotificationJob(job) {
    const { userId, notification } = job.data;
    const startTime = Date.now();

    try {
      // Try WebSocket delivery first
      const wsDelivered = this.deliverViaWebSocket(userId, notification);

      if (wsDelivered) {
        const deliveryTime = Date.now() - startTime;
        this.updateMetrics(userId, notification._id, 'delivered', deliveryTime);
        console.log(`✅ Notification delivered via WebSocket in ${deliveryTime}ms`);
        return { success: true, method: 'WebSocket', deliveryTime };
      } else {
        // Notification will be picked up via polling
        console.log(`⚠️ User ${userId} not connected, will be fetched via polling`);
        return { success: true, method: 'polling', deliveryTime: Date.now() - startTime };
      }
    } catch (err) {
      console.error(`❌ Error processing notification job:`, err);
      throw err;
    }
  }

  updateMetrics(userId, notificationId, status, deliveryTime = 0) {
    if (status === 'delivered' && deliveryTime > 0) {
      const currentAvg = this.metrics.avg_delivery_time;
      const totalDelivered = this.metrics.totalDelivered;
      this.metrics.avg_delivery_time = (currentAvg * totalDelivered + deliveryTime) / (totalDelivered + 1);
    }

    this.metrics.totalSent++;
  }

  getMetrics() {
    return {
      ...this.metrics,
      queue_count: this.notificationQueue ? this.notificationQueue.count() : 0,
      active_users: this.userSockets.size,
    };
  }

  async shutdown() {
    try {
      if (this.notificationQueue) {
        await this.notificationQueue.close();
      }
      if (this.redisClient) {
        await this.redisClient.quit();
      }
      console.log('✅ WebSocketNotificationService shut down gracefully');
    } catch (err) {
      console.error('❌ Error during shutdown:', err);
    }
  }
}

export default new WebSocketNotificationService();
