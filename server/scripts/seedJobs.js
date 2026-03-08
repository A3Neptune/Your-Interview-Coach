import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job.js';

dotenv.config();

const SAMPLE_JOBS = [
  {
    companyName: 'Google',
    position: 'Frontend Developer',
    description: 'Looking for an experienced frontend developer with React expertise to join our team. You will work on scalable web applications.',
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
    experienceLevel: 'Mid',
    salary: { min: 800000, max: 1200000, currency: 'INR' },
    location: 'Bangalore',
    jobType: 'Full-time',
    isActive: true,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    companyName: 'Microsoft',
    position: 'Full Stack Developer',
    description: 'Join our team to build full-stack applications using modern technologies. Experience with both frontend and backend required.',
    requiredSkills: ['Node.js', 'React', 'MongoDB', 'Express'],
    experienceLevel: 'Mid',
    salary: { min: 900000, max: 1400000, currency: 'INR' },
    location: 'Hyderabad',
    jobType: 'Full-time',
    isActive: true,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    companyName: 'Amazon',
    position: 'Backend Engineer',
    description: 'Build scalable backend systems that power our services. Work with databases, APIs, and cloud infrastructure.',
    requiredSkills: ['Java', 'Python', 'SQL', 'AWS'],
    experienceLevel: 'Senior',
    salary: { min: 1200000, max: 1800000, currency: 'INR' },
    location: 'Bangalore',
    jobType: 'Full-time',
    isActive: true,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    companyName: 'TCS',
    position: 'Web Developer',
    description: 'Develop web applications using modern frontend frameworks. Contribute to our growing tech team.',
    requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS'],
    experienceLevel: 'Entry',
    salary: { min: 400000, max: 600000, currency: 'INR' },
    location: 'Pune',
    jobType: 'Full-time',
    isActive: true,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    companyName: 'Infosys',
    position: 'Data Scientist',
    description: 'Analyze complex datasets and build machine learning models. Use your data science expertise to solve real-world problems.',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis'],
    experienceLevel: 'Mid',
    salary: { min: 700000, max: 1100000, currency: 'INR' },
    location: 'Bangalore',
    jobType: 'Full-time',
    isActive: true,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    companyName: 'Wipro',
    position: 'DevOps Engineer',
    description: 'Manage infrastructure and deployment pipelines. Work with cloud platforms and containerization technologies.',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins'],
    experienceLevel: 'Mid',
    salary: { min: 750000, max: 1150000, currency: 'INR' },
    location: 'Bangalore',
    jobType: 'Full-time',
    isActive: true,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
];

async function seedJobs() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/career-coach-lms');
    console.log('Connected to MongoDB');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Insert sample jobs
    const createdJobs = await Job.insertMany(SAMPLE_JOBS);
    console.log(`Successfully seeded ${createdJobs.length} jobs`);

    createdJobs.forEach(job => {
      console.log(`- ${job.position} at ${job.companyName}`);
    });

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error seeding jobs:', err);
    process.exit(1);
  }
}

seedJobs();
