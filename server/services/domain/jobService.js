import Job from '../../models/Job.js';
import User from '../../models/User.js';
import {  NotFoundError  } from '../../utils/errors.js';

const getAllJobs = async (filters = {}) => {
  const query = filters.type ? { type: filters.type } : {};
  return await Job.find(query).sort({ createdAt: -1 });
};

const getJobById = async (jobId) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new NotFoundError('Job not found');
  }
  return job;
};

const createJob = async (jobData) => {
  const job = new Job(jobData);
  return await job.save();
};

const updateJob = async (jobId, updates) => {
  const job = await Job.findByIdAndUpdate(jobId, updates, { new: true });
  if (!job) {
    throw new NotFoundError('Job not found');
  }
  return job;
};

const deleteJob = async (jobId) => {
  const job = await Job.findByIdAndDelete(jobId);
  if (!job) {
    throw new NotFoundError('Job not found');
  }
  return job;
};

const getMatchedJobs = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const userSkills = user.skills || [];

  return await Job.find({
    $or: [
      { requiredSkills: { $in: userSkills } },
      { experienceLevel: user.yearsOfExperience || 0 },
    ],
  }).sort({ createdAt: -1 });
};

export {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMatchedJobs,
};
export default {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMatchedJobs,
};
