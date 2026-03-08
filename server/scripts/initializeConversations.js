import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Conversation from '../models/Conversation.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

dotenv.config();

/**
 * Initialize conversations for all mentor-student pairs who have bookings
 * This ensures conversations exist even before the first message is sent
 */
async function initializeConversations() {
  try {
    console.log('🔄 Initializing conversations for all mentor-student pairs...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all confirmed or completed bookings
    const bookings = await Booking.find({
      status: { $in: ['confirmed', 'completed'] }
    }).populate('mentorId studentId');

    console.log(`📊 Found ${bookings.length} bookings`);

    // Track unique mentor-student pairs
    const pairs = new Map();

    for (const booking of bookings) {
      if (!booking.mentorId || !booking.studentId) {
        console.warn(`⚠️  Skipping booking ${booking._id}: Missing mentor or student`);
        continue;
      }

      const mentorId = booking.mentorId._id.toString();
      const studentId = booking.studentId._id.toString();
      const pairKey = `${mentorId}-${studentId}`;

      if (!pairs.has(pairKey)) {
        pairs.set(pairKey, { mentorId, studentId });
      }
    }

    console.log(`🔍 Found ${pairs.size} unique mentor-student pairs`);

    let createdCount = 0;
    let existingCount = 0;

    for (const [pairKey, { mentorId, studentId }] of pairs.entries()) {
      try {
        // Check if conversation already exists
        const existingConversation = await Conversation.findOne({
          mentorId,
          studentId,
        });

        if (existingConversation) {
          existingCount++;
        } else {
          // Create new conversation
          const conversation = new Conversation({
            mentorId,
            studentId,
          });
          await conversation.save();
          createdCount++;
          console.log(`✨ Created conversation for mentor ${mentorId} and student ${studentId}`);
        }
      } catch (error) {
        console.error(`❌ Error creating conversation for pair ${pairKey}:`, error.message);
      }
    }

    console.log('\n✅ Initialization completed successfully!');
    console.log(`   Conversations created: ${createdCount}`);
    console.log(`   Conversations already existed: ${existingCount}`);
    console.log(`   Total conversations: ${createdCount + existingCount}`);

  } catch (error) {
    console.error('❌ Initialization failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run initialization
initializeConversations()
  .then(() => {
    console.log('🎉 Initialization script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Initialization script failed:', error);
    process.exit(1);
  });
