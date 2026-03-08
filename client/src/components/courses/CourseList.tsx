'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoreVertical, Edit2, Copy, Trash2, Eye, EyeOff, Users, Clock, DollarSign, TrendingUp, BookOpen } from 'lucide-react';
import { getAuthToken } from '@/lib/api';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CourseList({ course, onDuplicate, onDelete, onRefresh }: any) {
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
      case 'beginner': return 'text-green-400 bg-green-500/10';
      case 'intermediate': return 'text-blue-400 bg-blue-500/10';
      case 'advanced': return 'text-orange-400 bg-orange-500/10';
      case 'expert': return 'text-red-400 bg-red-500/10';
      default: return 'text-zinc-400 bg-zinc-500/10';
    }
  };

  return (
    <div className="group bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all">
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className="w-24 h-24 flex-shrink-0 bg-zinc-800 rounded-lg flex items-center justify-center">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <BookOpen className="text-zinc-400" size={32} />
          )}
        </div>

        {/* Course Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white truncate">
                {course.title}
              </h3>
              <p className="text-sm text-zinc-400 line-clamp-1">
                {course.shortDescription || course.fullDescription}
              </p>
            </div>

            {/* Status & Menu */}
            <div className="flex items-center gap-2">
              {course.isPublished ? (
                <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-full text-xs text-emerald-400 whitespace-nowrap">
                  <Eye size={12} />
                  Published
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-1 bg-zinc-700 rounded-full text-xs text-zinc-400 whitespace-nowrap">
                  <EyeOff size={12} />
                  Draft
                </span>
              )}

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
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm">
            <span className={`px-2 py-0.5 rounded ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty}
            </span>

            <span className="text-zinc-500">{course.category}</span>

            <div className="flex items-center gap-1 text-zinc-400">
              <Users size={14} />
              <span>{course.analytics?.enrollments || 0} enrolled</span>
            </div>

            <div className="flex items-center gap-1 text-zinc-400">
              <Clock size={14} />
              <span>{course.totalDuration || 0} mins</span>
            </div>

            {course.contentType === 'paid' && (
              <div className="flex items-center gap-1 text-blue-400">
                <DollarSign size={14} />
                <span>₹{course.price}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/mentor-dashboard/courses/${course._id}/edit`}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
        >
          Manage
        </Link>
      </div>
    </div>
  );
}
