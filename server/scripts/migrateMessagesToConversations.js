import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

dotenv.config();

/**
 * Migration script to convert booking-based messages to conversation-based messages
 * Run this once after deploying the new conversation system
 */
async function migrateMessagesToConversations() {
  try {
    console.log('🔄 Starting migration of messages to conversation-based system...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all messages that don't have a conversationId
    const messagesWithoutConversation = await Message.find({
      conversationId: { $exists: false }
    }).populate('bookingId');

    console.log(`📊 Found ${messagesWithoutConversation.length} messages to migrate`);

    let migratedCount = 0;
    let errorCount = 0;

    for (const message of messagesWithoutConversation) {
      try {
        // Get sender and receiver
        const sender = await User.findById(message.senderId);
        const receiver = await User.findById(message.receiverId);

        if (!sender || !receiver) {
          console.warn(`⚠️  Skipping message ${message._id}: User not found`);
          errorCount++;
          continue;
        }

        // Determine mentor and student
        const isSenderMentor = sender.userType === 'admin';
        const mentorId = isSenderMentor ? message.senderId : message.receiverId;
        const studentId = isSenderMentor ? message.receiverId : message.senderId;

        // Find or create conversation
        let conversation = await Conversation.findOne({ mentorId, studentId });

        if (!conversation) {
          conversation = new Conversation({
            mentorId,
            studentId,
            lastMessage: message.content,
            lastMessageTime: message.createdAt,
            lastMessageSenderId: message.senderId,
          });
          await conversation.save();
          console.log(`✨ Created new conversation between ${mentorId} and ${studentId}`);
        }

        // Update message with conversationId
        message.conversationId = conversation._id;
        await message.save();

        migratedCount++;

        if (migratedCount % 100 === 0) {
          console.log(`   Migrated ${migratedCount} messages...`);
        }
      } catch (error) {
        console.error(`❌ Error migrating message ${message._id}:`, error.message);
        errorCount++;
      }
    }

    // Update conversation metadata (last message, unread counts)
    console.log('\n🔄 Updating conversation metadata...');
    const allConversations = await Conversation.find();

    for (const conversation of allConversations) {
      // Get last message
      const lastMessage = await Message.findOne({
        conversationId: conversation._id
      }).sort({ createdAt: -1 });

      if (lastMessage) {
        conversation.lastMessage = lastMessage.content;
        conversation.lastMessageTime = lastMessage.createdAt;
        conversation.lastMessageSenderId = lastMessage.senderId;
      }

      // Count unread messages for mentor
      const mentorUnreadCount = await Message.countDocuments({
        conversationId: conversation._id,
        receiverId: conversation.mentorId,
        isRead: false,
      });
      conversation.unreadCount.mentor = mentorUnreadCount;

      // Count unread messages for student
      const studentUnreadCount = await Message.countDocuments({
        conversationId: conversation._id,
        receiverId: conversation.studentId,
        isRead: false,
      });
      conversation.unreadCount.student = studentUnreadCount;

      await conversation.save();
    }

    console.log('\n✅ Migration completed successfully!');
    console.log(`   Total messages migrated: ${migratedCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Total conversations: ${allConversations.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run migration
migrateMessagesToConversations()
  .then(() => {
    console.log('🎉 Migration script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  });
