import cloudinary from 'cloudinary';.v2;
import {  ValidationError  } from '../../utils/errors.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (file) => {
  if (!file) {
    throw new ValidationError('No file provided');
  }

  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'career-coach',
    resource_type: 'auto',
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    resourceType: result.resource_type,
  };
};

const deleteFile = async (publicId) => {
  if (!publicId) {
    throw new ValidationError('Public ID is required');
  }

  const result = await cloudinary.uploader.destroy(publicId);
  return result;
};

const generateSignature = async () => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: 'career-coach' },
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: 'career-coach',
  };
};

export {
  uploadFile,
  deleteFile,
  generateSignature,
};
export default {
  uploadFile,
  deleteFile,
  generateSignature,
};
