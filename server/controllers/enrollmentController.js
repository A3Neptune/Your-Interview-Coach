import Enrollment from '../models/Enrollment.js';
import CourseAdvanced from '../models/CourseAdvanced.js';
import redisCacheService from '../services/redisCacheService.js';

/**
 * Enroll in a course
 */
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id || req.user._id;

    // Check if course exists and is published
    const course = await CourseAdvanced.findOne({
      _id: courseId,
      isPublished: true
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found or not available'
      });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      return res.json({
        success: true,
        data: existing,
        message: 'Already enrolled in this course',
        alreadyEnrolled: true
      });
    }

    // For paid courses, they must go through checkout and payment
    // Enrollment is created automatically after successful payment verification
    if (course.contentType === 'paid' || course.contentType === 'exclusive') {
      return res.status(402).json({
        success: false,
        error: 'Payment required for this course. Please proceed to checkout.',
        requiresPayment: true,
        courseId: course._id,
        amount: course.price,
        currency: 'INR',
        message: 'This is a paid course. Complete the payment to enroll.'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      userId,
      courseId,
      enrollmentType: course.contentType,
      status: 'active',
      accessLevel: 'full',
    });

    // Update course analytics
    await CourseAdvanced.findByIdAndUpdate(courseId, {
      $inc: { 'analytics.enrollments': 1 }
    });

    // Invalidate user's enrollment cache
    await redisCacheService.deletePattern(`enrollments:user:${userId}*`);
    await redisCacheService.deletePattern(`courses:published:detail:${courseId}`);

    res.json({
      success: true,
      data: enrollment,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to enroll in course'
    });
  }
};

/**
 * Get user's enrollments
 */
export const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const cacheKey = `enrollments:user:${userId}`;

    // Try cache first
    const cached = await redisCacheService.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: cached,
        cached: true
      });
    }

    const enrollments = await Enrollment.find({
      userId,
      status: 'active'
    })
      .populate({
        path: 'courseId',
        model: 'CourseAdvanced',
        select: 'title shortDescription fullDescription category difficulty price contentType thumbnail mentorId modules tags',
        populate: {
          path: 'mentorId',
          select: 'name designation profileImage company'
        }
      })
      .sort('-enrolledAt')
      .lean();

    // Filter out enrollments where course doesn't exist
    const validEnrollments = enrollments.filter(e => e.courseId);

    // Cache for 2 minutes
    await redisCacheService.set(cacheKey, validEnrollments, 2 * 60);

    res.json({
      success: true,
      data: validEnrollments,
      cached: false
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch enrollments'
    });
  }
};

/**
 * Check if user is enrolled in a course
 */
export const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id || req.user._id;

    const enrollment = await Enrollment.findOne({
      userId,
      courseId,
      status: 'active'
    });

    res.json({
      success: true,
      isEnrolled: !!enrollment,
      enrollment: enrollment || null
    });
  } catch (error) {
    console.error('Check enrollment error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check enrollment'
    });
  }
};

/**
 * Update course progress
 */
export const updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress } = req.body;
    const userId = req.user.id || req.user._id;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        error: 'Progress must be between 0 and 100'
      });
    }

    const enrollment = await Enrollment.findOne({
      userId,
      courseId,
      status: 'active'
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found'
      });
    }

    enrollment.progress = progress;
    enrollment.lastAccessedAt = new Date();

    if (progress === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();

      // Update course analytics
      await CourseAdvanced.findByIdAndUpdate(courseId, {
        $inc: { 'analytics.completions': 1 }
      });
    }

    await enrollment.save();

    // Invalidate cache
    await redisCacheService.deletePattern(`enrollments:user:${userId}*`);

    res.json({
      success: true,
      data: enrollment,
      message: progress === 100 ? 'Congratulations! Course completed' : 'Progress updated'
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update progress'
    });
  }
};

/**
 * Unenroll from course
 */
export const unenrollFromCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id || req.user._id;

    const enrollment = await Enrollment.findOne({ userId, courseId });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found'
      });
    }

    // Don't allow unenrollment from paid courses
    if (enrollment.enrollmentType === 'paid' || enrollment.enrollmentType === 'exclusive') {
      return res.status(403).json({
        success: false,
        error: 'Cannot unenroll from paid courses. Please contact support.'
      });
    }

    enrollment.status = 'cancelled';
    await enrollment.save();

    // Update course analytics
    await CourseAdvanced.findByIdAndUpdate(courseId, {
      $inc: { 'analytics.enrollments': -1 }
    });

    // Invalidate cache
    await redisCacheService.deletePattern(`enrollments:user:${userId}*`);

    res.json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    console.error('Unenroll error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to unenroll from course'
    });
  }
};

export default {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollment,
  updateProgress,
  unenrollFromCourse,
};
