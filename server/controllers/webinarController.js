import webinarService from '../services/domain/webinarService.js';
import {  handleControllerError  } from '../utils/errorHandler.js';

export const getAllWebinars = async (req, res) => {
  try {
    const webinars = await webinarService.getAllWebinars();
    res.json({ success: true, webinars });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getWebinarById = async (req, res) => {
  try {
    const webinar = await webinarService.getWebinarById(req.params.webinarId);
    res.json({ success: true, webinar });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const registerForWebinar = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const userId = req.user.id;

    const result = await webinarService.registerForWebinar(webinarId, userId);
    res.json({ success: true, ...result });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getUserWebinars = async (req, res) => {
  try {
    const userId = req.user.id;
    const webinars = await webinarService.getUserWebinars(userId);
    res.json({ success: true, webinars });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const createWebinar = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const userType = req.user.userType;

    const webinar = await webinarService.createWebinar(mentorId, userType, req.body);

    res.status(201).json({
      success: true,
      message: 'Webinar created successfully',
      webinar,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const updateWebinar = async (req, res) => {
  try {
    const userId = req.user.id;
    const webinarId = req.params.webinarId;

    const webinar = await webinarService.updateWebinar(webinarId, userId, req.body);
    res.json({ success: true, webinar });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const cancelWebinar = async (req, res) => {
  try {
    const userId = req.user.id;
    const webinarId = req.params.webinarId;

    await webinarService.cancelWebinar(webinarId, userId);
    res.json({ success: true, message: 'Webinar cancelled' });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getMentorWebinars = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const userType = req.user.userType;

    const webinars = await webinarService.getMentorWebinars(mentorId, userType);
    res.json({ success: true, webinars });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getWebinarRegistrants = async (req, res) => {
  try {
    const userId = req.user.id;
    const webinarId = req.params.webinarId;

    const registrants = await webinarService.getWebinarRegistrants(webinarId, userId);
    res.json({ success: true, registrants });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export default {
  getAllWebinars,
  getWebinarById,
  registerForWebinar,
  getUserWebinars,
  createWebinar,
  updateWebinar,
  cancelWebinar,
  getMentorWebinars,
  getWebinarRegistrants,
};
