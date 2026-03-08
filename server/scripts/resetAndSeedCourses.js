import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CourseAdvanced from '../models/CourseAdvanced.js';
import Enrollment from '../models/Enrollment.js';
import Payment from '../models/Payment.js';
import CourseReview from '../models/CourseReview.js';
import User from '../models/User.js';

dotenv.config();

const sampleCourses = [
  // Free Courses
  {
    title: 'Introduction to System Design',
    shortDescription: 'Learn the fundamentals of system design and scalable architecture',
    fullDescription: 'Master the basics of system design including load balancing, caching, databases, and microservices architecture. Perfect for beginners preparing for technical interviews.',
    category: 'system-design',
    difficulty: 'beginner',
    contentType: 'free',
    price: 0,
    tags: ['system-design', 'architecture', 'scalability', 'beginner'],
    isPublished: true,
    publishedAt: new Date(),
    modules: [
      {
        title: 'Introduction to System Design',
        description: 'Understanding the basics',
        order: 0,
        estimatedDuration: 30,
        resources: [
          {
            type: 'video',
            title: 'What is System Design?',
            url: 'https://www.youtube.com/embed/UzLMhqg3_Wc',
            duration: 15,
            order: 0
          }
        ]
      },
      {
        title: 'Load Balancing',
        description: 'Understanding load balancers',
        order: 1,
        estimatedDuration: 45,
        resources: [
          {
            type: 'video',
            title: 'Load Balancing Basics',
            url: 'https://www.youtube.com/embed/K0Ta65OqQkY',
            duration: 20,
            order: 0
          }
        ]
      }
    ]
  },
  {
    title: 'Resume Building Masterclass',
    shortDescription: 'Create an ATS-friendly resume that gets you interviews',
    fullDescription: 'Learn how to craft a professional resume that passes ATS systems and impresses recruiters. Includes templates and real examples.',
    category: 'resume-building',
    difficulty: 'beginner',
    contentType: 'free',
    price: 0,
    tags: ['resume', 'career', 'ats', 'job-search'],
    isPublished: true,
    publishedAt: new Date(),
    modules: [
      {
        title: 'Resume Fundamentals',
        description: 'Learn the basics of resume writing',
        order: 0,
        estimatedDuration: 40,
        resources: [
          {
            type: 'video',
            title: 'Resume Structure',
            url: 'https://www.youtube.com/embed/Tt08KmFfIYQ',
            duration: 20,
            order: 0
          }
        ]
      }
    ]
  },
  {
    title: 'Mock Interview Preparation',
    shortDescription: 'Prepare for technical and behavioral interviews',
    fullDescription: 'Complete guide to acing your next interview with practice questions, tips, and strategies.',
    category: 'mock-interview',
    difficulty: 'intermediate',
    contentType: 'free',
    price: 0,
    tags: ['interview', 'preparation', 'technical', 'behavioral'],
    isPublished: true,
    publishedAt: new Date(),
    modules: [
      {
        title: 'Interview Basics',
        description: 'Understanding interview types',
        order: 0,
        estimatedDuration: 30,
        resources: [
          {
            type: 'video',
            title: 'Types of Interviews',
            url: 'https://www.youtube.com/embed/1qw5ITr3k9E',
            duration: 15,
            order: 0
          }
        ]
      }
    ]
  },

  // Paid Courses
  {
    title: 'Advanced System Design Masterclass',
    shortDescription: 'Master distributed systems, microservices, and scalable architectures',
    fullDescription: 'Deep dive into advanced system design concepts including CAP theorem, consistent hashing, distributed databases, message queues, and real-world case studies of Netflix, Uber, and more.',
    category: 'system-design',
    difficulty: 'advanced',
    contentType: 'paid',
    price: 2999,
    tags: ['system-design', 'distributed-systems', 'microservices', 'advanced'],
    isPublished: true,
    publishedAt: new Date(),
    modules: [
      {
        title: 'Distributed Systems Fundamentals',
        description: 'Understanding distributed computing',
        order: 0,
        estimatedDuration: 60,
        resources: [
          {
            type: 'video',
            title: 'CAP Theorem Explained',
            url: 'https://www.youtube.com/embed/k-Yaq8AHlFA',
            duration: 25,
            order: 0
          },
          {
            type: 'video',
            title: 'Consistent Hashing',
            url: 'https://www.youtube.com/embed/zaRkONvyGr8',
            duration: 20,
            order: 1
          }
        ]
      },
      {
        title: 'Designing Netflix',
        description: 'Case study: Video streaming platform',
        order: 1,
        estimatedDuration: 90,
        resources: [
          {
            type: 'video',
            title: 'Netflix Architecture',
            url: 'https://www.youtube.com/embed/psQzyFfsUGU',
            duration: 30,
            order: 0
          }
        ]
      },
      {
        title: 'Designing Uber',
        description: 'Case study: Ride-sharing platform',
        order: 2,
        estimatedDuration: 90,
        resources: [
          {
            type: 'video',
            title: 'Uber System Design',
            url: 'https://www.youtube.com/embed/umWABit-wbk',
            duration: 35,
            order: 0
          }
        ]
      }
    ]
  },
  {
    title: 'Full-Stack Interview Bootcamp',
    shortDescription: 'Complete preparation for FAANG interviews with DSA, System Design & Behavioral',
    fullDescription: 'Comprehensive bootcamp covering data structures, algorithms, system design, and behavioral interviews. Includes 100+ practice problems and mock interviews.',
    category: 'coding',
    difficulty: 'advanced',
    contentType: 'paid',
    price: 4999,
    tags: ['faang', 'interview', 'coding', 'dsa', 'system-design'],
    isPublished: true,
    publishedAt: new Date(),
    modules: [
      {
        title: 'Data Structures Deep Dive',
        description: 'Master essential data structures',
        order: 0,
        estimatedDuration: 120,
        resources: [
          {
            type: 'video',
            title: 'Arrays and Strings',
            url: 'https://www.youtube.com/embed/G0_I-ZF0S38',
            duration: 40,
            order: 0
          },
          {
            type: 'video',
            title: 'Trees and Graphs',
            url: 'https://www.youtube.com/embed/1-l_UOFi1Xw',
            duration: 45,
            order: 1
          }
        ]
      },
      {
        title: 'Algorithm Patterns',
        description: 'Learn common algorithm patterns',
        order: 1,
        estimatedDuration: 150,
        resources: [
          {
            type: 'video',
            title: 'Two Pointers Pattern',
            url: 'https://www.youtube.com/embed/On03HWe2tZM',
            duration: 30,
            order: 0
          }
        ]
      }
    ]
  },
  {
    title: 'Behavioral Interview Mastery',
    shortDescription: 'Ace behavioral rounds with the STAR method and proven strategies',
    fullDescription: 'Master behavioral interviews with frameworks, real examples, and practice sessions. Learn how to tell compelling stories and handle tough questions.',
    category: 'behavioral',
    difficulty: 'intermediate',
    contentType: 'paid',
    price: 1999,
    tags: ['behavioral', 'interview', 'star-method', 'communication'],
    isPublished: true,
    publishedAt: new Date(),
    modules: [
      {
        title: 'STAR Method Framework',
        description: 'Structure your answers effectively',
        order: 0,
        estimatedDuration: 45,
        resources: [
          {
            type: 'video',
            title: 'Introduction to STAR Method',
            url: 'https://www.youtube.com/embed/0b2yKxQLhfM',
            duration: 20,
            order: 0
          }
        ]
      },
      {
        title: 'Common Behavioral Questions',
        description: 'Practice the most asked questions',
        order: 1,
        estimatedDuration: 60,
        resources: [
          {
            type: 'video',
            title: 'Leadership Questions',
            url: 'https://www.youtube.com/embed/HG68Ymazo18',
            duration: 25,
            order: 0
          }
        ]
      }
    ]
  },
  {
    title: 'React Performance Optimization',
    shortDescription: 'Build lightning-fast React applications',
    fullDescription: 'Learn advanced React performance optimization techniques including memoization, lazy loading, code splitting, and profiling.',
    category: 'coding',
    difficulty: 'advanced',
    contentType: 'paid',
    price: 2499,
    tags: ['react', 'performance', 'optimization', 'frontend'],
    isPublished: true,
    publishedAt: new Date(),
    modules: [
      {
        title: 'React Performance Basics',
        description: 'Understanding React rendering',
        order: 0,
        estimatedDuration: 50,
        resources: [
          {
            type: 'video',
            title: 'React Rendering Explained',
            url: 'https://www.youtube.com/embed/7YhdqIR2Yzo',
            duration: 25,
            order: 0
          }
        ]
      }
    ]
  },
  {
    title: 'Career Growth Strategy',
    shortDescription: 'Level up your tech career with proven strategies',
    fullDescription: 'Strategic guide to advancing your career including promotions, salary negotiations, and building influence.',
    category: 'career-growth',
    difficulty: 'intermediate',
    contentType: 'paid',
    price: 1499,
    tags: ['career', 'growth', 'leadership', 'promotion'],
    isPublished: true,
    publishedAt: new Date(),
    modules: [
      {
        title: 'Career Planning',
        description: 'Setting career goals',
        order: 0,
        estimatedDuration: 40,
        resources: [
          {
            type: 'video',
            title: 'Career Roadmap',
            url: 'https://www.youtube.com/embed/3BFgTv8_zvg',
            duration: 20,
            order: 0
          }
        ]
      }
    ]
  }
];

async function resetAndSeed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user (mentor)
    const mentor = await User.findOne({ userType: 'admin' });
    if (!mentor) {
      console.error('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }
    console.log(`✅ Found mentor: ${mentor.name}`);

    // Clear existing data
    console.log('\n🗑️  Clearing existing courses data...');
    await CourseAdvanced.deleteMany({});
    await Enrollment.deleteMany({});
    await Payment.deleteMany({});
    await CourseReview.deleteMany({});
    console.log('✅ Database cleared');

    // Add mentor ID to all courses
    const coursesWithMentor = sampleCourses.map(course => ({
      ...course,
      mentorId: mentor._id
    }));

    // Insert courses
    console.log('\n📚 Adding sample courses...');
    const insertedCourses = await CourseAdvanced.insertMany(coursesWithMentor);
    console.log(`✅ Added ${insertedCourses.length} courses`);

    // Print summary
    console.log('\n📊 Summary:');
    console.log(`   Free courses: ${insertedCourses.filter(c => c.contentType === 'free').length}`);
    console.log(`   Paid courses: ${insertedCourses.filter(c => c.contentType === 'paid').length}`);

    console.log('\n📋 Course List:');
    insertedCourses.forEach((course, idx) => {
      console.log(`   ${idx + 1}. ${course.title}`);
      console.log(`      - Type: ${course.contentType.toUpperCase()}`);
      console.log(`      - Price: ${course.contentType === 'free' ? 'FREE' : `₹${course.price}`}`);
      console.log(`      - Modules: ${course.modules.length}`);
      console.log(`      - ID: ${course._id}`);
    });

    console.log('\n✅ Database reset and seeded successfully!');
    console.log('\n🚀 You can now test the courses at:');
    console.log('   - Student view: http://localhost:3000/dashboard/content');
    console.log('   - Mentor view: http://localhost:3000/mentor-dashboard/courses');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetAndSeed();
