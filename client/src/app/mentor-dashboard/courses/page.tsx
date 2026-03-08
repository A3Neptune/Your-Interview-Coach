'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Grid, List, TrendingUp, Eye, Users, DollarSign, MoreVertical, Edit2, Copy, Trash2, BookOpen, Play, FileText, Link as LinkIcon, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import CreateCourseModal from '@/components/courses/CreateCourseModal';
import CourseCard from '@/components/courses/CourseCard';
import CourseList from '@/components/courses/CourseList';
import { getAuthToken } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdvancedCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    contentType: 'all',
    difficulty: 'all',
    isPublished: 'all',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    totalRevenue: 0,
    totalEnrollments: 0,
  });

  useEffect(() => {
    fetchCourses();
  }, [filters, sortBy]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();

      const queryParams = new URLSearchParams();
      if (filters.category !== 'all') queryParams.append('category', filters.category);
      if (filters.contentType !== 'all') queryParams.append('contentType', filters.contentType);
      if (filters.difficulty !== 'all') queryParams.append('difficulty', filters.difficulty);
      if (filters.isPublished !== 'all') queryParams.append('isPublished', filters.isPublished);
      if (searchQuery) queryParams.append('search', searchQuery);
      queryParams.append('sortBy', sortBy);

      const response = await fetch(`${API_URL}/advanced/courses?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setCourses(data.data.courses || []);
        calculateStats(data.data.courses || []);
      }
    } catch (error) {
      console.error('Fetch courses error:', error);
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (coursesData: any[]) => {
    const stats = coursesData.reduce((acc: any, course: any) => {
      acc.total++;
      if (course.isPublished) acc.published++;
      acc.totalRevenue += course.analytics?.revenue || 0;
      acc.totalEnrollments += course.analytics?.enrollments || 0;
      return acc;
    }, { total: 0, published: 0, totalRevenue: 0, totalEnrollments: 0 });

    setStats(stats);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleDuplicate = async (courseId: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/advanced/courses/${courseId}/duplicate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Course duplicated successfully');
        fetchCourses();
      }
    } catch (error) {
      toast.error('Failed to duplicate course');
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/advanced/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Course deleted successfully');
        fetchCourses();
      }
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Course Management
            </h1>
            <p className="text-zinc-400 mt-2">Create, manage, and track your courses</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Create Course
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="text-zinc-400" size={24} />
            </div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-zinc-400">Total Courses</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Eye className="text-zinc-400" size={24} />
            </div>
            <div className="text-2xl font-bold text-white">{stats.published}</div>
            <div className="text-sm text-zinc-400">Published</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="text-zinc-400" size={24} />
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalEnrollments}</div>
            <div className="text-sm text-zinc-400">Total Enrollments</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-zinc-400" size={24} />
            </div>
            <div className="text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-zinc-400">Revenue</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white/5 border border-white/10 rounded-lg p-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="mock-interview">Mock Interview</option>
              <option value="resume-building">Resume Building</option>
              <option value="coding">Coding</option>
              <option value="system-design">System Design</option>
              <option value="behavioral">Behavioral</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="createdAt">Newest First</option>
              <option value="-createdAt">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="-title">Title Z-A</option>
            </select>

            <div className="flex gap-1 p-1 bg-zinc-800 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600' : 'hover:bg-zinc-700'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600' : 'hover:bg-zinc-700'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-zinc-400 mb-2">No courses yet</h3>
          <p className="text-zinc-500 mb-6">Create your first course to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-colors"
          >
            Create Course
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {courses.map((course) => (
            viewMode === 'grid' ? (
              <CourseCard
                key={course._id}
                course={course}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onRefresh={fetchCourses}
              />
            ) : (
              <CourseList
                key={course._id}
                course={course}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onRefresh={fetchCourses}
              />
            )
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchCourses();
          }}
        />
      )}
    </div>
  );
}
