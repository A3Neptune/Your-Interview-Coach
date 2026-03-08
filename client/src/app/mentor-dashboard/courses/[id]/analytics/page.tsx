'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Users, TrendingUp, DollarSign, Award, Star, MessageSquare, Activity } from 'lucide-react';
import { getAuthToken } from '@/lib/api';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CourseAnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [courseId]);

  const fetchAnalytics = async () => {
    try {
      const token = getAuthToken();

      const [analyticsRes, courseRes] = await Promise.all([
        fetch(`${API_URL}/advanced/courses/${courseId}/analytics-detailed`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/advanced/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const analyticsData = await analyticsRes.json();
      const courseData = await courseRes.json();

      if (analyticsData.success && courseData.success) {
        setAnalytics(analyticsData.data);
        setCourse(courseData.data);
      } else {
        toast.error('Failed to load analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!analytics || !course) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No analytics data available</p>
      </div>
    );
  }

  const { overview, ratings, revenue } = analytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">{course.title}</h1>
          <p className="text-zinc-400 mt-1">Course Analytics & Performance</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Enrollments */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Users size={24} className="text-blue-400" />
            </div>
            <span className="text-sm text-blue-400 font-medium">Total</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{overview.totalEnrollments}</div>
          <p className="text-sm text-zinc-400">Students Enrolled</p>
          <p className="text-xs text-emerald-400 mt-2">
            +{overview.recentEnrollments30Days} in last 30 days
          </p>
        </div>

        {/* Active Students */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Activity size={24} className="text-emerald-400" />
            </div>
            <span className="text-sm text-emerald-400 font-medium">Active</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{overview.activeEnrollments}</div>
          <p className="text-sm text-zinc-400">Active Students</p>
          <p className="text-xs text-zinc-500 mt-2">
            {overview.totalEnrollments > 0
              ? ((overview.activeEnrollments / overview.totalEnrollments) * 100).toFixed(1)
              : 0}% of total
          </p>
        </div>

        {/* Completion Rate */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Award size={24} className="text-purple-400" />
            </div>
            <span className="text-sm text-purple-400 font-medium">Completion</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{overview.completionRate}%</div>
          <p className="text-sm text-zinc-400">Completion Rate</p>
          <p className="text-xs text-zinc-500 mt-2">
            {overview.completedEnrollments} completed
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <DollarSign size={24} className="text-yellow-400" />
            </div>
            <span className="text-sm text-yellow-400 font-medium">Revenue</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">₹{(revenue.total / 1000).toFixed(1)}k</div>
          <p className="text-sm text-zinc-400">Total Revenue</p>
          <p className="text-xs text-zinc-500 mt-2">
            ₹{revenue.perStudent} per student
          </p>
        </div>
      </div>

      {/* Rating & Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ratings Card */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <Star size={24} className="text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Course Rating</h2>
              <p className="text-sm text-zinc-400">Student feedback</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold text-white">{ratings.average.toFixed(1)}</div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={star <= Math.round(ratings.average) ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'}
                    />
                  ))}
                </div>
                <p className="text-sm text-zinc-400">{ratings.total} reviews</p>
              </div>
            </div>

            {ratings.recent && ratings.recent.length > 0 && (
              <div className="mt-6 pt-6 border-t border-zinc-800">
                <h3 className="text-sm font-semibold text-white mb-3">Recent Reviews</h3>
                <div className="space-y-2">
                  {ratings.recent.map((review: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-700'}
                            />
                          ))}
                        </div>
                        <span className="text-zinc-400">{review.rating}/5</span>
                      </div>
                      <span className="text-zinc-500 text-xs">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <TrendingUp size={24} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Student Progress</h2>
              <p className="text-sm text-zinc-400">Engagement metrics</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">Average Progress</span>
                <span className="text-sm font-semibold text-white">{overview.averageProgress}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${overview.averageProgress}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">Completion Rate</span>
                <span className="text-sm font-semibold text-white">{overview.completionRate}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${overview.completionRate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-zinc-800/50 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">{overview.completedEnrollments}</div>
                <p className="text-xs text-zinc-400">Completed</p>
              </div>
              <div className="p-4 bg-zinc-800/50 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">
                  {overview.totalEnrollments - overview.completedEnrollments}
                </div>
                <p className="text-xs text-zinc-400">In Progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push(`/mentor-dashboard/courses/${courseId}/enrollments`)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Users size={18} />
          View Enrolled Students
        </button>
        <button
          onClick={() => router.push(`/mentor-dashboard/courses/${courseId}/reviews`)}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-medium transition-colors"
        >
          <MessageSquare size={18} />
          View All Reviews
        </button>
      </div>
    </div>
  );
}
