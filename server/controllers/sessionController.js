import sessionService from '../services/domain/sessionService.js';
import {  handleControllerError  } from '../utils/errorHandler.js';

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getAllSessions();
    res.json(sessions);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const createSession = async (req, res) => {
  try {
    const session = await sessionService.createSession(req.body);
    res.status(201).json(session);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export default {
  getAllSessions,
  createSession,
};
