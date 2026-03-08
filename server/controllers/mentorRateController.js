import mentorRateService from '../services/domain/mentorRateService.js';
import {  handleControllerError  } from '../utils/errorHandler.js';

export const getPublicPricing = async (req, res) => {
  try {
    const pricing = await mentorRateService.getPublicPricing();
    res.json({ success: true, pricing });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getMentorRates = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const rates = await mentorRateService.getMentorRates(mentorId);
    res.json({ success: true, rates });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getMentorSlots = async (req, res) => {
  try {
    const { mentorId, date } = req.params;
    const slots = await mentorRateService.getMentorSlots(mentorId, date);
    res.json({ success: true, ...slots });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const updateMentorRates = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const updates = req.body;
    const rates = await mentorRateService.updateMentorRates(mentorId, updates);
    res.json({ success: true, message: 'Rates updated successfully', rates });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export default {
  getPublicPricing,
  getMentorRates,
  getMentorSlots,
  updateMentorRates,
};
