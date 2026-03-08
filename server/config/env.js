// Load environment variables before anything else
import dotenv from 'dotenv';

// Configure dotenv immediately
dotenv.config();

// Validate critical environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`  - ${varName}`));
  console.error('\nPlease check your .env file and ensure all required variables are set.');
}

console.log('✅ Environment variables loaded:');
console.log('  - RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID?.substring(0, 8) + '...');
console.log('  - RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET?.substring(0, 8) + '...');
console.log('  - MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Missing');
console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');

export default {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID?.trim(),
    keySecret: process.env.RAZORPAY_KEY_SECRET?.trim(),
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  email: {
    from: process.env.EMAIL_FROM,
    host: process.env.EMAIL_HOST,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
  },
};
