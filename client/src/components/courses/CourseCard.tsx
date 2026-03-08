'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoreVertical, Edit2, Copy, Trash2, Eye, EyeOff, Users, Clock, DollarSign, TrendingUp, Star, BarChart3, MessageSquare } from 'lucide-react';
import { getAuthToken } from '@/lib/api';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CourseCard({ course, onDuplicate, onDelete, onRefresh }: any) {
  const [showMenu, setShowMenu] = useState(false);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);

  const handleTogglePublish = async () => {
    setIsTogglingPublish(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/advanced/courses/${course._id}/toggle-publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Course ${data.data.isPublished ? 'published' : 'unpublished'}`);
        onRefresh();
      }
    } catch (error) {
      toast.error('Failed to toggle publish status');
    } finally {
      setIsTogglingPublish(false);
      setShowMenu(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'intermediate': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'advanced': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'expert': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'free': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'paid': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'exclusive': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all">
      {/* Status Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {course.isPublished ? (
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400">
            <Eye size={12} />
            Published
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-1 bg-zinc-500/10 border border-zinc-500/20 rounded-full text-xs text-zinc-400">
            <EyeOff size={12} />
            Draft
          </span>
        )}

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden">
                <Link
                  href={`/mentor-dashboard/courses/${course._id}/edit`}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-700 transition-colors text-sm"
                  onClick={() => setShowMenu(false)}
                >
                  <Edit2 size={16} />
                  Edit Course
                </Link>
                <button
                  onClick={handleTogglePublish}
                  disabled={isTogglingPublish}
                  className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-700 transition-colors text-sm"
                >
                  {course.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                  {course.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => {
                    onDuplicate(course._id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-700 transition-colors text-sm"
                >
                  <Copy size={16} />
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    onDelete(course._id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-700 transition-colors text-sm text-red-400"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail Placeholder */}
      <div className="w-full h-40 bg-zinc-800 rounded-lg mb-4 flex items-center justify-center">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="text-6xl">📚</div>
        )}
      </div>

      {/* Course Info */}
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getContentTypeColor(course.contentType)}`}>
            {course.contentType === 'paid' ? `₹${course.price}` : course.contentType}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white line-clamp-2">
          {course.title}
        </h3>

        <p className="text-sm text-zinc-400 line-clamp-2">
          {course.shortDescription || course.fullDescription}
        </p>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {course.tags.slice(0, 3).map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded">
                +{course.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Enhanced Stats Grid */}
        <div className="space-y-3 pt-3 border-t border-zinc-800">
          {/* Top Row - Primary Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded-lg">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users size={16} className="text-blue-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{course.analytics?.enrollments || 0}</div>
                <div className="text-xs text-zinc-400">Students</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded-lg">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star size={16} className="text-yellow-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white flex items-center gap-1">
                  {course.analytics?.averageRating ? course.analytics.averageRating.toFixed(1) : '0.0'}
                  <span className="text-xs text-zinc-500">({course.analytics?.totalRatings || 0})</span>
                </div>
                <div className="text-xs text-zinc-400">Rating</div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Secondary Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-zinc-800/30 rounded-lg">
              <div className="flex items-center justify-center text-zinc-400 mb-1">
                <Clock size={14} />
              </div>
              <div className="text-sm font-semibold text-white">{course.totalDuration || 0}m</div>
              <div className="text-xs text-zinc-500">Duration</div>
            </div>

            <div className="text-center p-2 bg-zinc-800/30 rounded-lg">
              <div className="flex items-center justify-center text-zinc-400 mb-1">
                <MessageSquare size={14} />
              </div>
              <div className="text-sm font-semibold text-white">{course.analytics?.totalRatings || 0}</div>
              <div className="text-xs text-zinc-500">Reviews</div>
            </div>

            {course.contentType === 'paid' && (
              <div className="text-center p-2 bg-zinc-800/30 rounded-lg">
                <div className="flex items-center justify-center text-emerald-400 mb-1">
                  <DollarSign size={14} />
                </div>
                <div className="text-sm font-semibold text-emerald-400">
                  ₹{((course.analytics?.revenue || 0) / 1000).toFixed(0)}k
                </div>
                <div className="text-xs text-zinc-500">Revenue</div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Link
            href={`/mentor-dashboard/courses/${course._id}/edit`}
            className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-medium transition-colors"
          >
            <Edit2 size={16} />
            Edit
          </Link>
          <Link
            href={`/mentor-dashboard/courses/${course._id}/analytics`}
            className="flex items-center justify-center gap-2 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white text-center rounded-lg font-medium transition-colors"
          >
            <BarChart3 size={16} />
            Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
