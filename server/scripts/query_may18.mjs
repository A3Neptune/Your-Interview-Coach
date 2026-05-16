import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../../.env') });
// fallback: try server-level .env
if (!process.env.MONGO_URI) dotenv.config({ path: join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('MONGO_URI not found'); process.exit(1); }

await mongoose.connect(MONGO_URI);

const Booking = mongoose.model('Booking', new mongoose.Schema({}, { strict: false }));
const User    = mongoose.model('User',    new mongoose.Schema({}, { strict: false }));

// May 18 IST: 00:00 IST = 18:30 UTC May 17, 23:59 IST = 18:29 UTC May 18
const dayStart = new Date('2025-05-17T18:30:00.000Z');
const dayEnd   = new Date('2025-05-18T18:29:59.999Z');

const bookings = await Booking.find({
  scheduledDate: { $gte: dayStart, $lte: dayEnd }
}).lean();

if (!bookings.length) {
  console.log('\nNo bookings found for May 18th.\n');
  await mongoose.disconnect();
  process.exit(0);
}

// Fetch student names
const studentIds = [...new Set(bookings.map(b => b.studentId?.toString()).filter(Boolean))];
const students = await User.find({ _id: { $in: studentIds } }, 'name email phone').lean();
const studentMap = Object.fromEntries(students.map(s => [s._id.toString(), s]));

console.log(`\n📅  Bookings for Monday 18 May 2025  (${bookings.length} total)\n`);
console.log('─'.repeat(72));

for (const b of bookings.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))) {
  const student = studentMap[b.studentId?.toString()] || {};
  const istTime = new Date(b.scheduledDate).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true
  });
  console.log(`🕐  ${istTime}  |  ${b.sessionType || '—'}  |  ${b.status}`);
  console.log(`    Student : ${student.name || 'Unknown'}  <${student.email || '—'}>`);
  console.log(`    Title   : ${b.title || '—'}`);
  console.log(`    Duration: ${b.duration} min   Amount: ₹${b.amount ?? '—'}`);
  if (b.meetingLink) console.log(`    Link    : ${b.meetingLink}`);
  console.log('─'.repeat(72));
}

await mongoose.disconnect();
