import jobService from '../services/domain/jobService.js';
import {  handleControllerError  } from '../utils/errorHandler.js';

export const getAllJobs = async (req, res) => {
  try {
    const { type } = req.query;
    const jobs = await jobService.getAllJobs({ type });
    res.json({ success: true, jobs });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await jobService.getJobById(jobId);
    res.json({ success: true, job });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const createJob = async (req, res) => {
  try {
    const job = await jobService.createJob(req.body);
    res.status(201).json({ success: true, message: 'Job created successfully', job });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await jobService.updateJob(jobId, req.body);
    res.json({ success: true, message: 'Job updated successfully', job });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    await jobService.deleteJob(jobId);
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getMatchedJobs = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const jobs = await jobService.getMatchedJobs(userId);
    res.json({ success: true, jobs });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export default {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMatchedJobs,
};
