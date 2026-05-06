const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'services', 'domain', 'bookingService.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add getMentorAllBookings function before the first "export {" block
const newFunction = `
/**
 * Get all bookings for mentor (transaction-level, not grouped by user).
 * Supports filtering by sessionType, sorting by createdAt desc,
 * and pagination via page/limit.
 */
const getMentorAllBookings = async (mentorId, { sessionType, page = 1, limit = 10 } = {}) => {
  const query = { mentorId };

  // Filter by session type if provided
  if (sessionType && sessionType !== 'all') {
    const sessionTypeMapping = {
      resumeAnalysis: ['resumeAnalysis', 'resume-analysis', 'cvReview', 'resumeReview'],
      mockInterview: ['oneMentorship', 'mockInterview', 'mock-interview', 'interviewPrep'],
      liveWebinar: ['webinars', 'liveWebinar', 'live-webinar'],
      gdGroupDiscussions: ['gdGroupDiscussions', 'groupDiscussion', 'gd-practice'],
    };

    const dbValues = sessionTypeMapping[sessionType];
    if (dbValues) {
      query.sessionType = { $in: dbValues };
    } else {
      const allKnown = Object.values(sessionTypeMapping).flat();
      query.sessionType = { $nin: allKnown };
    }
  }

  const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
  const lim = Math.min(100, Math.max(1, Number(limit)));

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate('studentId', 'name email profileImage mobile userType company designation')
      .populate('mentorId', 'name email designation profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim),
    Booking.countDocuments(query),
  ]);

  return {
    bookings,
    pagination: {
      total,
      page: Math.max(1, Number(page)),
      limit: lim,
      totalPages: Math.ceil(total / lim),
    },
  };
};

`;

// Insert before first "export {"
const exportIdx = content.indexOf('\nexport {');
if (exportIdx === -1) {
  console.error('Could not find "export {" block');
  process.exit(1);
}
content = content.slice(0, exportIdx) + '\n' + newFunction + content.slice(exportIdx);

// 2. Add getMentorAllBookings to BOTH export blocks
// Replace all occurrences of "  getMentorStudentsList,\n  getStudentBookings," with the version including getMentorAllBookings
const oldExport = '  getMentorStudentsList,\n  getStudentBookings,';
const newExport = '  getMentorStudentsList,\n  getMentorAllBookings,\n  getStudentBookings,';

// Handle both \n and \r\n
const oldExportCRLF = '  getMentorStudentsList,\r\n  getStudentBookings,';
const newExportCRLF = '  getMentorStudentsList,\r\n  getMentorAllBookings,\r\n  getStudentBookings,';

// Replace all occurrences
content = content.split(oldExportCRLF).join(newExportCRLF);
content = content.split(oldExport).join(newExport);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated bookingService.js');
