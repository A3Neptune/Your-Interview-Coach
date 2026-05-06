const fs = require('fs');
const path = require('path');

// ---- Fix bookingController.js ----
const controllerPath = path.join(__dirname, '..', 'controllers', 'bookingController.js');
let controllerContent = fs.readFileSync(controllerPath, 'utf8');

// Add the new controller function after getMentorStudentsList
const newController = `
/**
 * Get all bookings for mentor dashboard (transaction-level, paginated)
 * GET /api/bookings/mentor/all-bookings?sessionType=&page=&limit=
 */
export const getMentorAllBookings = async (req, res) => {
  try {
    const mentorId = req.user.id || req.user._id;
    const { sessionType, page, limit } = req.query;
    const result = await bookingService.getMentorAllBookings(mentorId, {
      sessionType,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    handleControllerError(res, error);
  }
};
`;

// Insert after getMentorStudentsList function closing
const insertMarker = "export const getStudentBookings";
const insertIdx = controllerContent.indexOf(insertMarker);
if (insertIdx === -1) {
  console.error('Could not find getStudentBookings in controller');
  process.exit(1);
}

// Find the comment block before getStudentBookings (/**...)
let commentStart = controllerContent.lastIndexOf('/**', insertIdx);
// Only use it if it's close (within 100 chars before getStudentBookings)
if (insertIdx - commentStart < 100) {
  controllerContent = controllerContent.slice(0, commentStart) + newController + '\n' + controllerContent.slice(commentStart);
} else {
  controllerContent = controllerContent.slice(0, insertIdx) + newController + '\n' + controllerContent.slice(insertIdx);
}

// Add to default export
controllerContent = controllerContent.replace(
  /getMentorStudentsList,\s*\n(\s*)getStudentBookings,/g,
  'getMentorStudentsList,\n$1getMentorAllBookings,\n$1getStudentBookings,'
);

fs.writeFileSync(controllerPath, controllerContent, 'utf8');
console.log('Successfully updated bookingController.js');

// ---- Fix bookings routes ----
const routesPath = path.join(__dirname, '..', 'routes', 'bookings.js');
let routesContent = fs.readFileSync(routesPath, 'utf8');

// Add new route after mentor/students/list
const newRoute = `router.get('/mentor/all-bookings', verifyToken, verifyMentor, bookingController.getMentorAllBookings);\n`;
const routeMarker = "router.get('/mentor/students/list'";
const routeIdx = routesContent.indexOf(routeMarker);
if (routeIdx === -1) {
  console.error('Could not find mentor/students/list route');
  process.exit(1);
}
// Find end of that line
const lineEnd = routesContent.indexOf('\n', routeIdx);
routesContent = routesContent.slice(0, lineEnd + 1) + newRoute + routesContent.slice(lineEnd + 1);

fs.writeFileSync(routesPath, routesContent, 'utf8');
console.log('Successfully updated bookings.js routes');
