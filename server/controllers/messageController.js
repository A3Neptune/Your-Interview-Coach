import messageService from '../services/domain/messageService.js';
import {  handleControllerError  } from '../utils/errorHandler.js';

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const conversations = await messageService.getUserConversations(userId.toString());
    res.json({ success: true, conversations });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getConversation = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { otherUserId } = req.params;
    const messages = await messageService.getConversation(userId.toString(), otherUserId);
    res.json({ success: true, messages });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id || req.user._id;
    const { receiverId, message } = req.body;
    const messageData = { senderId, receiverId, message };
    const newMessage = await messageService.sendMessage(messageData);
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { senderId } = req.params;
    await messageService.markMessagesAsRead(userId.toString(), senderId);
    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    handleControllerError(res, error);
  }
};

/**
 * Get messages for a specific booking
 */
export const getBookingMessages = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { bookingId } = req.params;
    const messages = await messageService.getBookingMessages(bookingId, userId.toString());
    res.json({ success: true, messages });
  } catch (error) {
    if (error.message === 'Chat only available for confirmed bookings') {
      return res.status(403).json({ success: false, error: error.message });
    }
    handleControllerError(res, error);
  }
};

/**
 * Send a message in a booking conversation
 */
export const sendBookingMessage = async (req, res) => {
  try {
    const senderId = req.user.id || req.user._id;
    const { bookingId, receiverId, content } = req.body;

    if (!bookingId || !receiverId || !content) {
      return res.status(400).json({
        success: false,
        error: 'bookingId, receiverId, and content are required'
      });
    }

    const message = await messageService.sendBookingMessage({
      bookingId,
      senderId: senderId.toString(),
      receiverId,
      content,
    });

    res.status(201).json({ success: true, message });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export default {
  getUserConversations,
  getConversation,
  sendMessage,
  markAsRead,
  getBookingMessages,
  sendBookingMessage,
};
