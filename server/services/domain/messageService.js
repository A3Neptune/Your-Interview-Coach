import Message from '../../models/Message.js';
import Conversation from '../../models/Conversation.js';
import Booking from '../../models/Booking.js';
import User from '../../models/User.js';
import { NotFoundError } from '../../utils/errors.js';
import mongoose from 'mongoose';

/**
 * Find or create a conversation between a mentor and student
 */
const findOrCreateConversation = async (mentorId, studentId) => {
  // Ensure mentorId and studentId are strings
  const mentorIdStr = mentorId.toString();
  const studentIdStr = studentId.toString();

  // Try to find existing conversation
  let conversation = await Conversation.findOne({
    mentorId: mentorIdStr,
    studentId: studentIdStr,
  });

  // If not found, create a new one
  if (!conversation) {
    conversation = new Conversation({
      mentorId: mentorIdStr,
      studentId: studentIdStr,
    });
    await conversation.save();
  }

  return conversation;
};

/**
 * Get all conversations for a user
 * Each mentor-student pair has ONE persistent conversation
 */
const getUserConversations = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const isMentor = user.userType === 'admin';

    // Find all conversations where user is a participant
    const query = isMentor
      ? { mentorId: userId }
      : { studentId: userId };

    const conversations = await Conversation.find(query)
      .populate('mentorId', 'name email profileImage')
      .populate('studentId', 'name email profileImage')
      .sort({ lastMessageTime: -1, createdAt: -1 });

    // Format conversations for response
    return conversations.map((conv) => {
      const otherUser = isMentor ? conv.studentId : conv.mentorId;
      const unreadCount = isMentor ? conv.unreadCount.mentor : conv.unreadCount.student;

      return {
        conversationId: conv._id,
        otherUserId: otherUser._id,
        otherUserName: otherUser.name,
        otherUserProfileImage: otherUser.profileImage,
        lastMessage: conv.lastMessage || 'No messages yet',
        lastMessageTime: conv.lastMessageTime || conv.createdAt,
        unreadCount,
      };
    });
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    throw error;
  }
};

/**
 * Get conversation messages between two users
 */
const getConversation = async (userId, otherUserId) => {
  const user = await User.findById(userId);
  const otherUser = await User.findById(otherUserId);

  if (!user || !otherUser) {
    throw new NotFoundError('User not found');
  }

  // Determine who is mentor and who is student
  const isMentor = user.userType === 'admin';
  const isOtherMentor = otherUser.userType === 'admin';

  // One must be mentor, one must be student
  if (isMentor === isOtherMentor) {
    throw new Error('Conversations can only exist between mentor and student');
  }

  const mentorId = isMentor ? userId : otherUserId;
  const studentId = isMentor ? otherUserId : userId;

  // Find or create conversation
  const conversation = await findOrCreateConversation(mentorId, studentId);

  // Get all messages in this conversation
  const messages = await Message.find({ conversationId: conversation._id })
    .sort({ createdAt: 1 })
    .populate('senderId', 'name profileImage')
    .populate('receiverId', 'name profileImage');

  // Mark messages as read for the current user
  await Message.updateMany(
    { conversationId: conversation._id, receiverId: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  // Update unread count in conversation
  if (isMentor) {
    conversation.unreadCount.mentor = 0;
  } else {
    conversation.unreadCount.student = 0;
  }
  await conversation.save();

  return messages;
};

/**
 * Get messages for a specific booking
 */
const getBookingMessages = async (bookingId, userId) => {
  // Verify user has access to this booking
  const booking = await Booking.findById(bookingId)
    .populate('studentId', 'name')
    .populate('mentorId', 'name');

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  const isAuthorized =
    booking.studentId._id.toString() === userId ||
    booking.mentorId._id.toString() === userId;

  if (!isAuthorized) {
    throw new Error('Unauthorized access to booking messages');
  }

  // Only allow chat for confirmed/completed bookings
  if (!['confirmed', 'completed'].includes(booking.status)) {
    throw new Error('Chat only available for confirmed bookings');
  }

  // Get all messages for this booking
  const messages = await Message.find({ bookingId })
    .sort({ createdAt: 1 });

  // Mark messages as read if user is the receiver
  await Message.updateMany(
    { bookingId, receiverId: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  return messages;
};

/**
 * Send a message in a booking conversation
 */
const sendBookingMessage = async (messageData) => {
  const { bookingId, senderId, receiverId, content } = messageData;

  // Verify booking exists and user has access
  const booking = await Booking.findById(bookingId)
    .populate('studentId', 'name')
    .populate('mentorId', 'name');

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  const isAuthorized =
    booking.studentId._id.toString() === senderId ||
    booking.mentorId._id.toString() === senderId;

  if (!isAuthorized) {
    throw new Error('Unauthorized to send message for this booking');
  }

  // Only allow chat for confirmed/completed bookings
  if (!['confirmed', 'completed'].includes(booking.status)) {
    throw new Error('Chat only available for confirmed bookings');
  }

  // Get sender info
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  const senderType = sender.userType === 'admin' ? 'mentor' : 'student';

  // Create message
  const message = new Message({
    bookingId,
    senderId,
    senderName: sender.name,
    senderType,
    receiverId,
    receiverName: receiver.name,
    content,
    isRead: false,
  });

  await message.save();
  return message;
};

/**
 * Send a message in a conversation
 */
const sendMessage = async (messageData) => {
  const { senderId, receiverId, message: content } = messageData;

  // Get sender and receiver info
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!sender || !receiver) {
    throw new NotFoundError('User not found');
  }

  // Determine who is mentor and who is student
  const isSenderMentor = sender.userType === 'admin';
  const isReceiverMentor = receiver.userType === 'admin';

  // One must be mentor, one must be student
  if (isSenderMentor === isReceiverMentor) {
    throw new Error('Messages can only be sent between mentor and student');
  }

  const mentorId = isSenderMentor ? senderId : receiverId;
  const studentId = isSenderMentor ? receiverId : senderId;
  const senderType = isSenderMentor ? 'mentor' : 'student';

  // Find or create conversation
  const conversation = await findOrCreateConversation(mentorId, studentId);

  // Create message
  const newMessage = new Message({
    conversationId: conversation._id,
    senderId,
    senderName: sender.name,
    senderType,
    receiverId,
    receiverName: receiver.name,
    content,
    isRead: false,
  });

  await newMessage.save();

  // Update conversation with last message info
  conversation.lastMessage = content;
  conversation.lastMessageTime = new Date();
  conversation.lastMessageSenderId = senderId;

  // Increment unread count for receiver
  if (isReceiverMentor) {
    conversation.unreadCount.mentor += 1;
  } else {
    conversation.unreadCount.student += 1;
  }

  await conversation.save();

  return await newMessage.populate('senderId receiverId', 'name profileImage');
};

/**
 * Mark messages as read between two users
 */
const markMessagesAsRead = async (userId, senderId) => {
  const user = await User.findById(userId);
  const sender = await User.findById(senderId);

  if (!user || !sender) {
    throw new NotFoundError('User not found');
  }

  // Determine who is mentor and who is student
  const isMentor = user.userType === 'admin';
  const isSenderMentor = sender.userType === 'admin';

  const mentorId = isMentor ? userId : senderId;
  const studentId = isMentor ? senderId : userId;

  // Find conversation
  const conversation = await Conversation.findOne({ mentorId, studentId });

  if (conversation) {
    // Mark messages as read
    await Message.updateMany(
      { conversationId: conversation._id, receiverId: userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    // Update unread count
    if (isMentor) {
      conversation.unreadCount.mentor = 0;
    } else {
      conversation.unreadCount.student = 0;
    }
    await conversation.save();
  }
};

export {
  findOrCreateConversation,
  getUserConversations,
  getConversation,
  getBookingMessages,
  sendBookingMessage,
  sendMessage,
  markMessagesAsRead,
};
export default {
  findOrCreateConversation,
  getUserConversations,
  getConversation,
  getBookingMessages,
  sendBookingMessage,
  sendMessage,
  markMessagesAsRead,
};
