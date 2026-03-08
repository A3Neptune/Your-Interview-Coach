import MentorRate from '../../models/MentorRate.js';
import {  NotFoundError  } from '../../utils/errors.js';

const getPublicPricing = async () => {
  return await MentorRate.find({ isActive: true })
    .populate('mentorId', 'name email designation company profileImage')
    .sort({ createdAt: -1 });
};

const getMentorRates = async (mentorId) => {
  const rates = await MentorRate.findOne({ mentorId })
    .populate('mentorId', 'name email designation company profileImage yearsOfExperience skills');

  if (!rates) {
    throw new NotFoundError('Mentor rates not found');
  }
  return rates;
};

const getMentorSlots = async (mentorId, date) => {
  const rates = await MentorRate.findOne({ mentorId });
  if (!rates) {
    throw new NotFoundError('Mentor rates not found');
  }

  // Return available slots for the specified date
  return {
    mentor: rates.mentorId,
    date,
    availableSlots: rates.availableSlots || [],
  };
};

const updateMentorRates = async (mentorId, updates) => {
  let rates = await MentorRate.findOne({ mentorId });

  if (!rates) {
    rates = new MentorRate({ mentorId, ...updates });
  } else {
    Object.assign(rates, updates);
  }

  return await rates.save();
};

export {
  getPublicPricing,
  getMentorRates,
  getMentorSlots,
  updateMentorRates,
};
export default {
  getPublicPricing,
  getMentorRates,
  getMentorSlots,
  updateMentorRates,
};
