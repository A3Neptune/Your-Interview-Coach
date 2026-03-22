// import { v2 as cloudinary } from 'cloudinary';
// import multer from 'multer';

// Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// Memory storage for multer
// const storage = multer.memoryStorage();

// Multer upload middleware
// export const uploadImage = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit for images
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed!'), false);
//     }
//   },
// });

// export const uploadVideo = multer({
//   storage: storage,
//   limits: {
//     fileSize: 100 * 1024 * 1024, // 100MB limit for videos
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('video/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only video files are allowed!'), false);
//     }
//   },
// });
//
// export const uploadDocument = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit for documents
//   },
// });

/**
 * Upload buffer to Cloudinary
 */
// export const uploadBufferToCloudinary = (buffer, folder = 'misc', resourceType = 'auto') => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: `career-coach/${folder}`,
//         resource_type: resourceType,
//       },
//       (error, result) => {
//         if (error) {
//           console.error('Cloudinary upload error:', error);
//           reject(new Error('Failed to upload file to cloud storage'));
//         } else {
//           resolve({
//             url: result.secure_url,
//             publicId: result.public_id,
//             format: result.format,
//             width: result.width,
//             height: result.height,
//             bytes: result.bytes,
//           });
//         }
//       }
//     );
//
//     uploadStream.end(buffer);
//   });
// };

/**
 * Upload file to Cloudinary (from file path or buffer)
 */
// export const uploadToCloudinary = async (file, folder = 'misc', resourceType = 'auto') => {
//   try {
//     // If file is a buffer (from multer memory storage)
//     if (Buffer.isBuffer(file)) {
//       return await uploadBufferToCloudinary(file, folder, resourceType);
//     }
//
//     // If file has buffer property (from multer)
//     if (file.buffer) {
//       return await uploadBufferToCloudinary(file.buffer, folder, resourceType);
//     }

    // Otherwise, use file path
//     const result = await cloudinary.uploader.upload(file.path || file, {
//       folder: `career-coach/${folder}`,
//       resource_type: resourceType,
//     });
//
//     return {
//       url: result.secure_url,
//       publicId: result.public_id,
//       format: result.format,
//       width: result.width,
//       height: result.height,
//       bytes: result.bytes,
//     };
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     throw new Error('Failed to upload file to cloud storage');
//   }
// };

/**
 * Delete file from Cloudinary
 */
// export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId, {
//       resource_type: resourceType,
//     });
//     return result;
//   } catch (error) {
//     console.error('Cloudinary delete error:', error);
//     throw new Error('Failed to delete file from cloud storage');
//   }
// };

/**
 * Generate signed upload URL (for client-side uploads)
 */
// export const generateUploadSignature = (folder = 'misc', resourceType = 'auto') => {
//   const timestamp = Math.round(new Date().getTime() / 1000);
//   const params = {
//     timestamp,
//     folder: `career-coach/${folder}`,
//     resource_type: resourceType,
//   };
//
//   const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
//
//   return {
//     signature,
//     timestamp,
//     cloudName: process.env.CLOUDINARY_CLOUD_NAME,
//     apiKey: process.env.CLOUDINARY_API_KEY,
//     folder: params.folder,
//     resourceType,
//   };
// };

/**
 * Get optimized image URL
 */
// export const getOptimizedImageUrl = (publicId, options = {}) => {
//   const {
//     width = 800,
//     height = 600,
//     crop = 'fill',
//     quality = 'auto',
//     format = 'auto',
//   } = options;
//
//   return cloudinary.url(publicId, {
//     width,
//     height,
//     crop,
//     quality,
//     fetch_format: format,
//   });
// };

/**
 * Get video thumbnail
 */
// export const getVideoThumbnail = (publicId, options = {}) => {
//   const {
//     width = 640,
//     height = 360,
//     crop = 'fill',
//     quality = 'auto',
//   } = options;
//
//   return cloudinary.url(publicId, {
//     resource_type: 'video',
//     transformation: [
//       { width, height, crop, quality },
//       { start_offset: '0' }, // Get first frame
//     ],
//     format: 'jpg',
//   });
// };
//
// export default cloudinary;


import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import os from 'os';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** -----------------------
 * Multer Storage Config
 * ----------------------- */

// Memory storage for small files
const memoryStorage = multer.memoryStorage();

// Disk storage for large files (videos)
const diskStorage = multer.diskStorage({
  destination: os.tmpdir(), // temporary OS directory
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

/** -----------------------
 * Multer Middlewares
 * ----------------------- */

export const uploadImage = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    cb(file.mimetype.startsWith('image/') ? null : new Error('Only images allowed'), true);
  },
});

export const uploadVideo = multer({
  storage: diskStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    cb(file.mimetype.startsWith('video/') ? null : new Error('Only videos allowed'), true);
  },
});

export const uploadDocument = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/** -----------------------
 * Cloudinary Upload Helpers
 * ----------------------- */

// Upload buffer to Cloudinary
export const uploadBufferToCloudinary = (buffer, folder = 'misc', resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `career-coach/${folder}`, resource_type: resourceType },
        (err, result) => {
          if (err) return reject(err);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          });
        }
    );
    uploadStream.end(buffer);
  });
};

// Upload file from disk to Cloudinary using streams
export const uploadFileToCloudinary = (filePath, folder = 'misc', resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `career-coach/${folder}`, resource_type: resourceType },
        (err, result) => {
          // Remove temporary file after upload
          fs.unlink(filePath, () => {});
          if (err) return reject(err);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          });
        }
    );
    fileStream.pipe(uploadStream);
  });
};

// Main upload function
export const uploadToCloudinary = async (file, folder = 'misc', resourceType = 'auto') => {
  if (Buffer.isBuffer(file)) return await uploadBufferToCloudinary(file, folder, resourceType);
  if (file.buffer) return await uploadBufferToCloudinary(file.buffer, folder, resourceType);
  if (file.path) return await uploadFileToCloudinary(file.path, folder, resourceType);

  throw new Error('Invalid file input');
};

/** -----------------------
 * Cloudinary Delete
 * ----------------------- */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from cloud storage');
  }
};

/** -----------------------
 * Signed Upload (Client-Side)
 * ----------------------- */
export const generateUploadSignature = (folder = 'misc', resourceType = 'auto') => {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { timestamp, folder: `career-coach/${folder}`, resource_type: resourceType };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
  return { signature, timestamp, cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY, folder: params.folder, resourceType };
};

/** -----------------------
 * URL Utilities
 * ----------------------- */
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const { width = 800, height = 600, crop = 'fill', quality = 'auto', format = 'auto' } = options;
  return cloudinary.url(publicId, { width, height, crop, quality, fetch_format: format });
};

export const getVideoThumbnail = (publicId, options = {}) => {
  const { width = 640, height = 360, crop = 'fill', quality = 'auto' } = options;
  return cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: [{ width, height, crop, quality }, { start_offset: '0' }],
    format: 'jpg',
  });
};

export default cloudinary;