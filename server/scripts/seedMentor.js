import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import MentorRate from '../models/MentorRate.js';

dotenv.config();

const seedMentor = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/career-coach-lms');
    console.log('Connected to MongoDB');

    // Check if mentor already exists
    const existingMentor = await User.findOne({ email: 'mentor@example.com' });
    if (existingMentor) {
      console.log('Mentor already exists');
      await mongoose.disconnect();
      return;
    }

    // Create test mentor account
    const mentorPassword = await bcryptjs.hash('password123', 10);

    const mentor = new User({
      name: 'Neel Ashish Seru',
      email: 'mentor@example.com',
      password: mentorPassword,
      mobile: '+91 9876543210',
      userType: 'admin',
      company: 'Tech Company',
      designation: 'Senior Software Engineer',
      yearsOfExperience: 10,
      skills: ['JavaScript', 'React', 'Node.js', 'System Design', 'Mentoring', 'Career Coaching'],
      bio: 'Experienced software engineer with 10+ years in the industry. Passionate about helping others grow their careers.',
      isVerified: true,
      isActive: true,
    });

    await mentor.save();

    // Create mentor rates
    const mentorRate = new MentorRate({
      mentorId: mentor._id,
      rates: {
        mockInterview: 1500,
        cvReview: 800,
        gdPractice: 1200,
        generalConsultation: 500,
        careerGuidance: 1000,
      },
      availability: [
        {
          day: 1, // Monday
          slots: [
            { startTime: '10:00', endTime: '11:00' },
            { startTime: '14:00', endTime: '15:00' },
            { startTime: '18:00', endTime: '19:00' },
          ],
        },
        {
          day: 2, // Tuesday
          slots: [
            { startTime: '10:00', endTime: '11:00' },
            { startTime: '15:00', endTime: '16:00' },
          ],
        },
        {
          day: 3, // Wednesday
          slots: [
            { startTime: '09:00', endTime: '10:00' },
            { startTime: '14:00', endTime: '15:00' },
            { startTime: '19:00', endTime: '20:00' },
          ],
        },
        {
          day: 4, // Thursday
          slots: [
            { startTime: '10:00', endTime: '11:00' },
            { startTime: '16:00', endTime: '17:00' },
          ],
        },
        {
          day: 5, // Friday
          slots: [
            { startTime: '10:00', endTime: '11:00' },
            { startTime: '14:00', endTime: '15:00' },
            { startTime: '18:00', endTime: '19:00' },
          ],
        },
        {
          day: 6, // Saturday
          slots: [
            { startTime: '11:00', endTime: '12:00' },
            { startTime: '15:00', endTime: '16:00' },
            { startTime: '19:00', endTime: '20:00' },
          ],
        },
      ],
      cancellationHours: 24,
      allowReschedule: true,
      preferredPlatform: 'zoom',
      timezone: 'Asia/Kolkata',
      averageRating: 5,
      isActive: true,
    });

    await mentorRate.save();

    console.log('✅ Mentor seeded successfully!');
    console.log('Email: mentor@example.com');
    console.log('Password: password123');
    console.log('Role: Admin + Mentor');
    console.log('\n📅 Availability:');
    console.log('Mon, Wed, Fri: 10:00-11:00, 14:00-15:00, 18:00-19:00');
    console.log('Tue, Thu: 10:00-11:00, 14:00-15:00');
    console.log('Sat: 11:00-12:00, 15:00-16:00, 19:00-20:00');
    console.log('\n💰 Session Rates:');
    console.log('Mock Interview: ₹1500/60min');
    console.log('CV Review: ₹800/45min');
    console.log('GD Practice: ₹1200/60min');
    console.log('Career Guidance: ₹1000/45min');

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding mentor:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedMentor();