import express from 'express';
import { verifyToken, verifyMentor } from '../middleware/auth.js';
import { uploadImage, uploadVideo, uploadDocument, uploadToCloudinary } from '../services/cloudinaryService.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

/**
 * Upload image (thumbnail, profile pic, etc.)
 */
router.post('/image', verifyToken, uploadImage.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const result = await uploadToCloudinary(req.file, 'images', 'image');

    res.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
      },
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload image',
    });
  }
});

/**
 * Upload video
 */
router.post('/video', verifyToken, verifyMentor, uploadVideo.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const result = await uploadToCloudinary(req.file, 'videos', 'video');

    res.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        format: result.format,
        bytes: result.bytes,
      },
      message: 'Video uploaded successfully',
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload video',
    });
  }
});

/**
 * Upload course thumbnail - optimized for courses
 */
router.post('/course-thumbnail', verifyMentor, uploadImage.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const result = await uploadToCloudinary(req.file, 'courses/thumbnails', 'image');

    // Generate optimized URLs
    const optimizedUrls = {
      original: result.url,
      thumbnail: cloudinary.url(result.publicId, {
        width: 400,
        height: 300,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
      }),
      medium: cloudinary.url(result.publicId, {
        width: 800,
        height: 600,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
      }),
      large: cloudinary.url(result.publicId, {
        width: 1200,
        height: 900,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
      }),
    };

    res.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        optimizedUrls,
        width: result.width,
        height: result.height,
      },
      message: 'Course thumbnail uploaded successfully',
    });
  } catch (error) {
    console.error('Thumbnail upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload thumbnail',
    });
  }
});

/**
 * Upload course video with auto-generated thumbnail
 */
router.post('/course-video', verifyMentor, uploadVideo.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const result = await uploadToCloudinary(req.file, 'courses/videos', 'video');

    // Generate video thumbnail URL (first frame)
    const thumbnailUrl = cloudinary.url(result.publicId, {
      resource_type: 'video',
      transformation: [
        { width: 640, height: 360, crop: 'fill', quality: 'auto' },
        { start_offset: '0' },
      ],
      format: 'jpg',
    });

    // Get video player embed URL
    const embedUrl = cloudinary.url(result.publicId, {
      resource_type: 'video',
      transformation: [
        { width: 1280, height: 720, crop: 'limit' },
      ],
    });

    res.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        thumbnailUrl,
        embedUrl,
        format: result.format,
        bytes: result.bytes,
        duration: result.duration || null,
      },
      message: 'Video uploaded successfully',
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload video',
    });
  }
});

/**
 * Upload course document (PDF, DOC, etc.)
 */
router.post('/course-document', verifyMentor, uploadDocument.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const result = await uploadToCloudinary(req.file, 'courses/documents', 'auto');

    res.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        format: result.format,
        bytes: result.bytes,
        originalName: req.file.originalname,
      },
      message: 'Document uploaded successfully',
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload document',
    });
  }
});

export default router;
