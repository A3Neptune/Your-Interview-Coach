// IMPORTANT: Load environment config FIRST before any other imports
import config from './config/env.js';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import sessionRoutes from './routes/sessions.js';
import contentRoutes from './routes/content.js';
import bookingRoutes from './routes/bookings.js';
import paymentRoutes from './routes/payments.js';
import webinarRoutes from './routes/webinars.js';
import mentorRatesRoutes from './routes/mentorRates.js';
import jobsRoutes from './routes/jobs.js';
import messagesRoutes from './routes/messages.js';
import pricingSectionRoutes from './routes/pricingSection.js';
import gdRoutes from './routes/groupDiscussions.js';
import gdBookingRoutes from './routes/gdBookings.js';
import notificationRoutes from './routes/notifications.js';
import launchBannerRoutes from './routes/launchBanner.js';
import courseAdvancedRoutes from './routes/courseAdvanced.js';
import uploadRoutes from './routes/upload.js';
import enrollmentRoutes from './routes/enrollments.js';
import feedbackRouter from './routes/feedback.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map(o => o.trim())
    .concat(['http://localhost:3000', 'https://yourinterviewcoach.vercel.app', 'https://your-interview-coach.vercel.app', 'https://yourinterviewcoach.in', 'https://www.yourinterviewcoach.in']);

app.use(cors({
    origin: (origin, cb) => {
        cb(null, true);
    },
    credentials: true,
}));
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
}));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/webinars', webinarRoutes);
app.use('/api/mentor-rates', mentorRatesRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/pricing-section', pricingSectionRoutes);
app.use('/api/group-discussions', gdRoutes);
app.use('/api/gd-bookings', gdBookingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/launch-banner', launchBannerRoutes);
app.use('/api/advanced', courseAdvancedRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/feedback', feedbackRouter);

app.get('/', (req, res) => {
    res.json({ message: 'Career Coach LMS API' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Global Error Handler (guarantees CORS headers on any server error)
app.use((err, req, res, next) => {
    console.error('💥 Unhandled server error caught:', err);
    if (req.headers.origin) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/career-coach-lms';

const dbOptions = {
    dbName: 'career-coach-lms-new',
};

mongoose.connect(MONGO_URI, dbOptions)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('📍 SIGTERM received, gracefully shutting down...');
            server.close(() => {
                process.exit(0);
            });
        });

        process.on('SIGINT', async () => {
            console.log('📍 SIGINT received, gracefully shutting down...');
            server.close(() => {
                process.exit(0);
            });
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
