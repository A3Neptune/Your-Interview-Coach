import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

// Cache for reusing connections across hot reloads (especially in development)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with proper connection pooling.
 * Reuses existing connections to avoid hitting Atlas connection limits.
 */
export async function connectDB() {
  // Return cached connection if available
  if (cached.conn) {
    console.log('📦 Using cached MongoDB connection');
    return cached.conn;
  }

  // Return existing promise if connection is in progress
  if (!cached.promise) {
    console.log('🔗 Initiating new MongoDB connection...');
    
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'career-coach-lms-new',
      // Connection pooling options
      maxPoolSize: 10,           // Max connections in the pool (M0 default is ~10)
      minPoolSize: 2,            // Min connections to maintain
      maxIdleTimeMS: 45000,      // Close idle connections after 45s
      waitQueueTimeoutMS: 10000, // Wait up to 10s for available connection
      // Performance options
      serverSelectionTimeoutMS: 5000,  // Server selection timeout
      socketTimeoutMS: 45000,          // Socket timeout
      // Buffer commands when disconnected (recommended: false for production)
      bufferCommands: true,      // Set to false if you want to fail fast
      // Connection retry options
      retryWrites: true,         // Retry writes on transient errors
      retryReads: true,          // Retry reads on transient errors
    }).catch(err => {
      console.error('❌ MongoDB connection failed:', err.message);
      // Clear the promise on error so next attempt can retry
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ Connected to MongoDB');
    return cached.conn;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Disconnect from MongoDB and clear cache.
 * Useful for graceful shutdowns.
 */
export async function disconnectDB() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('🔌 Disconnected from MongoDB');
  }
}

export default connectDB;
