import uploadService from '../services/domain/uploadService.js';
import {  handleControllerError  } from '../utils/errorHandler.js';

export const uploadFile = async (req, res) => {
  try {
    const result = await uploadService.uploadFile(req.file);
    res.json({ success: true, file: result });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await uploadService.deleteFile(publicId);
    res.json({ success: true, message: 'File deleted successfully', result });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const generateSignature = async (req, res) => {
  try {
    const signatureData = await uploadService.generateSignature();
    res.json({ success: true, ...signatureData });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export default {
  uploadFile,
  deleteFile,
  generateSignature,
};
