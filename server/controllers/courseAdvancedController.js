import CourseAdvanced from '../models/CourseAdvanced.js';
import CourseReview from '../models/CourseReview.js';
import Enrollment from '../models/Enrollment.js';
// Use Redis cache if available, fallback to in-memory cache
import redisCacheService, { courseCacheKeys, invalidateCourseCaches } from '../services/redisCacheService.js';

/**
 * Get all courses for a mentor with advanced filtering and caching
 */
export const getMentorCourses = async (req, res) => {
  try {
    const mentorId = req.user.id || req.user._id;
    const {
      category,
      contentType,
      difficulty,
      isPublished,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    // Build cache key
    const filters = { category, contentType, difficulty, isPublished, search, sortBy, sortOrder, page, limit };
    const cacheKey = courseCacheKeys.list(mentorId, filters);

    // Try to get from cache
    const cached = await redisCacheService.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // Build query
    const query = { mentorId };

    if (category) query.category = category;
    if (contentType) query.contentType = contentType;
    if (difficulty) query.difficulty = difficulty;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [courses, total] = await Promise.all([
      CourseAdvanced.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('mentorId', 'name email profileImage')
        .lean(),
      CourseAdvanced.countDocuments(query),
    ]);

    const result = {
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    };

    // Cache for 5 minutes
    await redisCacheService.set(cacheKey, result, 5 * 60 * 1000);

    res.json({
      success: true,
      data: result,
      cached: false,
    });
  } catch (error) {
    console.error('Get mentor courses error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch courses',
    });
  }
};

/**
 * Get single course with full details
 */
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const cacheKey = courseCacheKeys.detail(courseId);

    // Try cache first
    const cached = await redisCacheService.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    const course = await CourseAdvanced.findById(courseId)
      .populate('mentorId', 'name email profileImage company designation')
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    // Cache for 10 minutes
    await redisCacheService.set(cacheKey, course, 10 * 60 * 1000);

    res.json({
      success: true,
      data: course,
      cached: false,
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch course',
    });
  }
};

/**
 * Create new course
 */
export const createCourse = async (req, res) => {
  try {
    const mentorId = req.user.id || req.user._id;
    const courseData = {
      ...req.body,
      mentorId,
    };

    const course = await CourseAdvanced.create(courseData);

    // Invalidate mentor's course list cache
    await redisCacheService.deletePattern(`courses:list:${mentorId}*`);

    // If published, invalidate public caches
    if (course.isPublished) {
      await redisCacheService.deletePattern('courses:published:*');
    }

    res.status(201).json({
      success: true,
      data: course,
      message: 'Course created successfully',
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create course',
    });
  }
};

/**
 * Update course
 */
export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const mentorId = req.user.id || req.user._id;

    // Verify ownership
    const existingCourse = await CourseAdvanced.findOne({
      _id: courseId,
      mentorId,
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        error: 'Course not found or unauthorized',
      });
    }

    const updatedCourse = await CourseAdvanced.findByIdAndUpdate(
      courseId,
      { ...req.body },
      { new: true, runValidators: true }
    );

    // Invalidate all related caches
    invalidateCourseCaches(courseId, mentorId);

    // If published, invalidate public caches
    if (updatedCourse.isPublished) {
      await redisCacheService.deletePattern('courses:published:*');
    }

    res.json({
      success: true,
      data: updatedCourse,
      message: 'Course updated successfully',
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update course',
    });
  }
};

/**
 * Delete course
 */
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const mentorId = req.user.id || req.user._id;

    const course = await CourseAdvanced.findOneAndDelete({
      _id: courseId,
      mentorId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found or unauthorized',
      });
    }

    // Invalidate all related caches
    invalidateCourseCaches(courseId, mentorId);

    // If course was published, invalidate public caches
    if (course.isPublished) {
      await redisCacheService.deletePattern('courses:published:*');
    }

    res.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete course',
    });
  }
};

/**
 * Update course modules
 */
export const updateModules = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { modules } = req.body;
    const mentorId = req.user.id || req.user._id;

    const course = await CourseAdvanced.findOne({
      _id: courseId,
      mentorId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found or unauthorized',
      });
    }

    course.modules = modules;
    await course.save();

    // Invalidate caches
    invalidateCourseCaches(courseId, mentorId);

    res.json({
      success: true,
      data: course,
      message: 'Modules updated successfully',
    });
  } catch (error) {
    console.error('Update modules error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update modules',
    });
  }
};

/**
 * Publish/Unpublish course
 */
export const togglePublish = async (req, res) => {
  try {
    const { courseId } = req.params;
    const mentorId = req.user.id || req.user._id;

    const course = await CourseAdvanced.findOne({
      _id: courseId,
      mentorId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found or unauthorized',
      });
    }

    course.isPublished = !course.isPublished;
    if (course.isPublished) {
      course.publishedAt = new Date();
    }

    await course.save();

    // Invalidate caches (both mentor and public)
    invalidateCourseCaches(courseId, mentorId);
    await redisCacheService.deletePattern('courses:published:*'); // Invalidate all published course caches

    res.json({
      success: true,
      data: course,
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
    });
  } catch (error) {
    console.error('Toggle publish error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle publish status',
    });
  }
};

/**
 * Get course analytics
 */
export const getCourseAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;
    const mentorId = req.user.id || req.user._id;
    const cacheKey = courseCacheKeys.analytics(courseId);

    // Try cache
    const cached = await redisCacheService.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    const course = await CourseAdvanced.findOne({
      _id: courseId,
      mentorId,
    }).select('analytics title');

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found or unauthorized',
      });
    }

    // Cache for 2 minutes (analytics need frequent updates)
    await redisCacheService.set(cacheKey, course.analytics, 2 * 60 * 1000);

    res.json({
      success: true,
      data: course.analytics,
      cached: false,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }
};

/**
 * Bulk operations
 */
export const bulkUpdateCourses = async (req, res) => {
  try {
    const { courseIds, updates } = req.body;
    const mentorId = req.user.id || req.user._id;

    const result = await CourseAdvanced.updateMany(
      {
        _id: { $in: courseIds },
        mentorId,
      },
      updates
    );

    // Invalidate all course list caches for this mentor
    await redisCacheService.deletePattern(`courses:list:${mentorId}*`);
    courseIds.forEach(id => invalidateCourseCaches(id, mentorId));

    res.json({
      success: true,
      data: result,
      message: `${result.modifiedCount} courses updated successfully`,
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk update courses',
    });
  }
};

/**
 * Duplicate course
 */
export const duplicateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const mentorId = req.user.id || req.user._id;

    const originalCourse = await CourseAdvanced.findOne({
      _id: courseId,
      mentorId,
    }).lean();

    if (!originalCourse) {
      return res.status(404).json({
        success: false,
        error: 'Course not found or unauthorized',
      });
    }

    // Create duplicate
    const duplicate = {
      ...originalCourse,
      _id: undefined,
      title: `${originalCourse.title} (Copy)`,
      slug: undefined,
      isPublished: false,
      publishedAt: undefined,
      analytics: {
        views: 0,
        enrollments: 0,
        completions: 0,
        averageRating: 0,
        totalRatings: 0,
        revenue: 0,
      },
    };

    const newCourse = await CourseAdvanced.create(duplicate);

    // Invalidate cache
    await redisCacheService.deletePattern(`courses:list:${mentorId}*`);

    res.status(201).json({
      success: true,
      data: newCourse,
      message: 'Course duplicated successfully',
    });
  } catch (error) {
    console.error('Duplicate course error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to duplicate course',
    });
  }
};

/**
 * Get cache statistics (admin only)
 */
export const getCacheStats = async (req, res) => {
  try {
    const stats = cacheService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cache stats',
    });
  }
};

/**
 * Get all published courses for students (public)
 */
export const getPublishedCourses = async (req, res) => {
  try {
    const {
      category,
      contentType,
      difficulty,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    // Build cache key
    const filters = { category, contentType, difficulty, search, sortBy, sortOrder, page, limit };
    const cacheKey = `courses:published:${JSON.stringify(filters)}`;

    // Try to get from cache
    const cached = await redisCacheService.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // Build query - only published courses
    const query = { isPublished: true };

    if (category) query.category = category;
    if (contentType) query.contentType = contentType;
    if (difficulty) query.difficulty = difficulty;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [courses, total] = await Promise.all([
      CourseAdvanced.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('mentorId', 'name email profileImage designation company')
        .lean(),
      CourseAdvanced.countDocuments(query),
    ]);

    const result = {
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    };

    // Cache for 10 minutes
    await redisCacheService.set(cacheKey, result, 10 * 60 * 1000);

    res.json({
      success: true,
      data: result,
      cached: false,
    });
  } catch (error) {
    console.error('Get published courses error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch published courses',
    });
  }
};

/**
 * Get single published course by ID (public)
 */
export const getPublishedCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const cacheKey = `courses:published:detail:${courseId}`;

    // Try cache first
    const cached = await redisCacheService.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    const course = await CourseAdvanced.findOne({
      _id: courseId,
      isPublished: true,
    })
      .populate('mentorId', 'name email profileImage company designation')
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    // Increment views
    await CourseAdvanced.findByIdAndUpdate(courseId, {
      $inc: { 'analytics.views': 1 },
    });

    // Cache for 15 minutes
    await redisCacheService.set(cacheKey, course, 15 * 60 * 1000);

    res.json({
      success: true,
      data: course,
      cached: false,
    });
  } catch (error) {
    console.error('Get published course error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch course',
    });
  }
};

/**
 * Submit a course review (student only)
 */
export const submitReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id || req.user._id;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Rating and comment are required',
      });
    }

    // Check if course exists
    const course = await CourseAdvanced.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      userId,
      courseId,
      status: 'active',
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        error: 'You must be enrolled in this course to leave a review',
      });
    }

    // Check if user already reviewed
    const existingReview = await CourseReview.findOne({ userId, courseId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this course. You can edit your existing review.',
      });
    }

    // Create review
    const review = new CourseReview({
      courseId,
      userId,
      rating,
      comment,
      verifiedEnrollment: true,
      enrollmentId: enrollment._id,
    });

    await review.save();

    // Update course analytics - recalculate average rating
    const allReviews = await CourseReview.find({ courseId, isApproved: true });
    const totalRatings = allReviews.length;
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

    await CourseAdvanced.findByIdAndUpdate(courseId, {
      'analytics.averageRating': avgRating,
      'analytics.totalRatings': totalRatings,
    });

    // Invalidate caches
    await invalidateCourseCaches(courseId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit review',
    });
  }
};

/**
 * Get course reviews with pagination
 */
export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      rating = null,
    } = req.query;

    // Build cache key
    const cacheKey = `course:reviews:${courseId}:${page}:${limit}:${sortBy}:${sortOrder}:${rating}`;

    // Try cache
    const cached = await redisCacheService.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // Build query
    const query = { courseId, isApproved: true };
    if (rating) query.rating = parseInt(rating);

    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [reviews, total] = await Promise.all([
      CourseReview.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'name profileImage'),
      CourseReview.countDocuments(query),
    ]);

    const result = {
      reviews,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    };

    // Cache for 2 minutes
    await redisCacheService.set(cacheKey, result, 2 * 60 * 1000);

    res.json({
      success: true,
      data: result,
      cached: false,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
    });
  }
};

/**
 * Mark review as helpful
 */
export const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id || req.user._id;

    const review = await CourseReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    // Check if already marked helpful
    const alreadyHelpful = review.helpfulBy.includes(userId);

    if (alreadyHelpful) {
      // Remove from helpful
      review.helpfulBy = review.helpfulBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      // Add to helpful
      review.helpfulBy.push(userId);
      review.helpfulCount += 1;
    }

    await review.save();

    // Invalidate review cache
    const cachePattern = `course:reviews:${review.courseId}:*`;
    await redisCacheService.deletePattern(cachePattern);

    res.json({
      success: true,
      message: alreadyHelpful ? 'Removed from helpful' : 'Marked as helpful',
      data: {
        helpfulCount: review.helpfulCount,
        isHelpful: !alreadyHelpful,
      },
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update review',
    });
  }
};

/**
 * Delete own review
 */
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id || req.user._id;

    const review = await CourseReview.findOne({
      _id: reviewId,
      userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found or unauthorized',
      });
    }

    const courseId = review.courseId;
    await review.deleteOne();

    // Recalculate course rating
    const allReviews = await CourseReview.find({ courseId, isApproved: true });
    const totalRatings = allReviews.length;
    const avgRating =
      totalRatings > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

    await CourseAdvanced.findByIdAndUpdate(courseId, {
      'analytics.averageRating': avgRating,
      'analytics.totalRatings': totalRatings,
    });

    // Invalidate caches
    await invalidateCourseCaches(courseId);
    const cachePattern = `course:reviews:${courseId}:*`;
    await redisCacheService.deletePattern(cachePattern);

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete review',
    });
  }
};

/**
 * Get detailed enrollment list for a course (mentor only)
 */
export const getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const mentorId = req.user.id || req.user._id;
    const { page = 1, limit = 20, status = 'active' } = req.query;

    // Verify ownership
    const course = await CourseAdvanced.findOne({ _id: courseId, mentorId });
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found or unauthorized',
      });
    }

    const skip = (page - 1) * limit;
    const query = { courseId, status };

    const [enrollments, total] = await Promise.all([
      Enrollment.find(query)
        .populate('userId', 'name email profileImage mobile')
        .sort({ enrolledAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Enrollment.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        enrollments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch enrollments',
    });
  }
};

/**
 * Get detailed analytics for a course (mentor only)
 */
export const getDetailedAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;
    const mentorId = req.user.id || req.user._id;

    // Verify ownership
    const course = await CourseAdvanced.findOne({ _id: courseId, mentorId });
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found or unauthorized',
      });
    }

    // Get enrollment stats
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      recentEnrollments,
      avgProgress,
      reviews,
    ] = await Promise.all([
      Enrollment.countDocuments({ courseId }),
      Enrollment.countDocuments({ courseId, status: 'active' }),
      Enrollment.countDocuments({ courseId, progress: 100 }),
      Enrollment.countDocuments({
        courseId,
        enrolledAt: { $gte: thirtyDaysAgo },
      }),
      Enrollment.aggregate([
        { $match: { courseId: course._id } },
        { $group: { _id: null, avg: { $avg: '$progress' } } },
      ]),
      CourseReview.find({ courseId, isApproved: true })
        .select('rating createdAt')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const completionRate =
      totalEnrollments > 0
        ? (completedEnrollments / totalEnrollments) * 100
        : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalEnrollments,
          activeEnrollments,
          completedEnrollments,
          completionRate: completionRate.toFixed(2),
          recentEnrollments30Days: recentEnrollments,
          averageProgress:
            avgProgress.length > 0 ? avgProgress[0].avg.toFixed(2) : 0,
        },
        ratings: {
          average: course.analytics.averageRating,
          total: course.analytics.totalRatings,
          recent: reviews,
        },
        revenue: {
          total: course.analytics.revenue || 0,
          perStudent:
            totalEnrollments > 0
              ? ((course.analytics.revenue || 0) / totalEnrollments).toFixed(2)
              : 0,
        },
      },
    });
  } catch (error) {
    console.error('Get detailed analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }
};

export default {
  getMentorCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  updateModules,
  togglePublish,
  getCourseAnalytics,
  bulkUpdateCourses,
  duplicateCourse,
  getCacheStats,
  getPublishedCourses,
  getPublishedCourseById,
  // Review functions
  submitReview,
  getCourseReviews,
  markReviewHelpful,
  deleteReview,
  // Enrollment & Analytics
  getCourseEnrollments,
  getDetailedAnalytics,
};
