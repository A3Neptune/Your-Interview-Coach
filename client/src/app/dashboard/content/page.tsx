'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, Lock, BookOpen, Clock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { contentAPI } from '@/lib/api';
import { getAuthToken, removeAuthToken } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Course {
  _id: string;
  title: string;
  shortDescription?: string;
  fullDescription?: string;
  description?: string;
  contentType: 'free' | 'paid' | 'exclusive';
  price: number;
  category: string;
  thumbnail?: string;
  difficulty?: string;
  tags?: string[];
  mentorId: {
    name: string;
    designation: string;
    profileImage?: string;
    company?: string;
  };
  enrollment?: {
    progress: number;
    lastAccessedAt: string;
  };
}

export default function ContentPage() {
  const router = useRouter();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [freeCourses, setFreeCourses] = useState<Course[]>([]);
  const [paidCourses, setPaidCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'paid' | 'enrolled'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push('/login');
          return;
        }

        setIsLoading(true);

        // Fetch all published courses from advanced courses API
        const response = await fetch(`${API_URL}/advanced/courses/published?limit=100`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          const courses = data.data.courses || [];

          // Separate free and paid courses
          const free = courses.filter((c: Course) => c.contentType === 'free');
          const paid = courses.filter((c: Course) => c.contentType === 'paid' || c.contentType === 'exclusive');

          setAllCourses(courses);
          setFreeCourses(free);
          setPaidCourses(paid);

          // Fetch enrolled courses
          fetchEnrolledCourses();
        } else {
          toast.error('Failed to load courses');
        }
      } catch (err: any) {
        console.error('Error fetching content:', err);
        if (err.response?.status === 401) {
          removeAuthToken();
          router.push('/login');
        } else {
          toast.error('Failed to load courses');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [router]);

  const fetchEnrolledCourses = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/enrollments/my-enrollments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Map enrolled courses to match Course interface
        const enrolled = data.data
          .filter((e: any) => e.courseId) // Filter out invalid enrollments
          .map((e: any) => ({
            ...e.courseId,
            enrollment: {
              progress: e.progress || 0,
              lastAccessedAt: e.lastAccessedAt || e.enrolledAt,
            }
          }));
        setEnrolledCourses(enrolled);

        // Create a map of courseId -> enrollment for quick lookup
        const enrollmentMap = new Map();
        data.data.forEach((e: any) => {
          if (e.courseId && e.courseId._id) {
            enrollmentMap.set(e.courseId._id, {
              progress: e.progress || 0,
              lastAccessedAt: e.lastAccessedAt || e.enrolledAt,
            });
          }
        });

        // Merge enrollment status into all courses
        setAllCourses(prev => prev.map(course => ({
          ...course,
          enrollment: enrollmentMap.get(course._id) || course.enrollment
        })));

        // Update free courses
        setFreeCourses(prev => prev.map(course => ({
          ...course,
          enrollment: enrollmentMap.get(course._id) || course.enrollment
        })));

        // Update paid courses
        setPaidCourses(prev => prev.map(course => ({
          ...course,
          enrollment: enrollmentMap.get(course._id) || course.enrollment
        })));
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const CourseCard = ({ course }: { course: Course }) => {
    const isPaid = course.contentType === 'paid' || course.contentType === 'exclusive';
    const isEnrolled = !!course.enrollment;

    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-blue-500/5 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative w-full h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <BookOpen className="w-12 h-12 text-blue-400 group-hover:text-blue-500 transition-colors" />
          )}
          {course.contentType === 'paid' && (
            <div className="absolute top-3 right-3 bg-blue-600 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md">
              ₹{course.price}
            </div>
          )}
          {course.contentType === 'exclusive' && (
            <div className="absolute top-3 right-3 bg-purple-600 px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1 shadow-md">
              <Lock className="w-3 h-3" /> Exclusive
            </div>
          )}
          <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Play className="w-12 h-12 text-white fill-white drop-shadow-lg" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 flex-1 flex flex-col">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {course.title}
            </h3>
            <p className="text-xs text-slate-500 capitalize mt-1 font-medium">{course.category.replace('-', ' ')}</p>
          </div>

          <p className="text-sm text-slate-600 line-clamp-2">
            {course.shortDescription || course.description || course.fullDescription || 'No description available'}
          </p>

          {/* Mentor Info */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 shadow-md">
              {course.mentorId.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{course.mentorId.name}</p>
              <p className="text-xs text-slate-500 truncate">{course.mentorId.designation}</p>
            </div>
          </div>

          {/* Progress Bar (if enrolled) */}
          {course.enrollment && (
            <div className="pt-3 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Progress</span>
                <span className="text-blue-600 font-bold">{course.enrollment.progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                  style={{ width: `${course.enrollment.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 mt-auto">
            {isEnrolled ? (
              <Link
                href={`/dashboard/content/${course._id}`}
                className="block w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center font-semibold transition-all shadow-md hover:shadow-lg text-sm"
              >
                Continue Learning
              </Link>
            ) : isPaid ? (
              <Link
                href={`/dashboard/checkout/${course._id}`}
                className="block w-full py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-center font-semibold transition-all shadow-md hover:shadow-lg text-sm"
              >
                Buy Now - ₹{course.price}
              </Link>
            ) : (
              <Link
                href={`/dashboard/content/${course._id}`}
                className="block w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center font-semibold transition-all shadow-md hover:shadow-lg text-sm"
              >
                View Course
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Learning Content</h1>
          <p className="text-blue-100 mt-2">Access free courses and your enrolled premium content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 rounded-xl bg-slate-100 border border-slate-200 w-fit flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2.5 rounded-lg transition-all font-semibold text-sm ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            All Courses ({allCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('free')}
            className={`px-6 py-2.5 rounded-lg transition-all font-semibold text-sm ${
              activeTab === 'free'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Free ({freeCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`px-6 py-2.5 rounded-lg transition-all font-semibold text-sm ${
              activeTab === 'paid'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Paid ({paidCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-6 py-2.5 rounded-lg transition-all font-semibold text-sm ${
              activeTab === 'enrolled'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            My Learning ({enrolledCourses.length})
          </button>
        </div>

        {/* All Courses Tab */}
        {activeTab === 'all' && (
          <div>
            {allCourses.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-blue-500/5 p-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-semibold mb-2">No courses available yet</p>
                <p className="text-sm text-slate-500">Check back soon for learning content</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Free Courses Tab */}
        {activeTab === 'free' && (
          <div>
            {freeCourses.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-blue-500/5 p-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-semibold mb-2">No free courses available yet</p>
                <p className="text-sm text-slate-500">Check back soon for free learning content</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freeCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Paid Courses Tab */}
        {activeTab === 'paid' && (
          <div>
            {paidCourses.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-blue-500/5 p-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-semibold mb-2">No paid courses available yet</p>
                <p className="text-sm text-slate-500">Check back soon for premium content</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paidCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Enrolled Courses Tab */}
        {activeTab === 'enrolled' && (
          <div>
            {enrolledCourses.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-blue-500/5 p-12 text-center">
                <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-semibold mb-2">You haven't enrolled in any courses yet</p>
                <Link href="/marketplace" className="text-blue-600 hover:text-blue-700 transition-colors mt-2 inline-block font-medium">
                  Explore premium courses →
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}