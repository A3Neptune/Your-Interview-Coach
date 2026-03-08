'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Upload, Link as LinkIcon, FileText, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAuthToken } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CreateCourseModal({ onClose, onSuccess }: any) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: 'mock-interview',
    difficulty: 'beginner',
    contentType: 'free',
    price: 0,
    tags: '',
    prerequisites: '',
    learningOutcomes: '',
    targetAudience: '',
    thumbnail: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    setThumbnailFile(file);
    setIsUploading(true);

    try {
      const token = getAuthToken();
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData({ ...formData, thumbnail: data.data.url });
        toast.success('Thumbnail uploaded successfully!');
      } else {
        toast.error(data.error || 'Failed to upload thumbnail');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload thumbnail');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.title || !formData.fullDescription) {
      toast.error('Title and description are required');
      return;
    }

    setIsLoading(true);

    try {
      const token = getAuthToken();
      const courseData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        prerequisites: formData.prerequisites ? formData.prerequisites.split('\n').filter(Boolean) : [],
        learningOutcomes: formData.learningOutcomes ? formData.learningOutcomes.split('\n').filter(Boolean) : [],
        targetAudience: formData.targetAudience ? formData.targetAudience.split('\n').filter(Boolean) : [],
        isPublished: true, // Automatically publish new courses
      };

      const response = await fetch(`${API_URL}/advanced/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Course created! Redirecting to add modules and content...');
        // Redirect to edit page to add modules, videos, and content
        router.push(`/mentor-dashboard/courses/${data.data._id}/edit`);
      } else {
        toast.error(data.error || 'Failed to create course');
      }
    } catch (error) {
      console.error('Create course error:', error);
      toast.error('Failed to create course');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-zinc-800">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">Create New Course</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            📚 Add basic info here. After creation, you'll be able to add modules, videos, documents, and links in the edit page.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>

                <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., System Design Masterclass"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Short Description (max 200 characters)
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief description for course card"
                    maxLength={200}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Full Description *
                  </label>
                  <textarea
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="Detailed course description"
                    rows={4}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
                    required
                  />
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Course Thumbnail
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      id="thumbnail-upload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className={`px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white cursor-pointer hover:bg-zinc-700 transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Upload size={18} />
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                    </label>
                    {formData.thumbnail && (
                      <div className="flex items-center gap-2">
                        <img
                          src={formData.thumbnail}
                          alt="Thumbnail preview"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, thumbnail: '' })}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Max 5MB, JPG/PNG/WEBP</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="mock-interview">Mock Interview</option>
                      <option value="resume-building">Resume Building</option>
                      <option value="gd-practice">GD Practice</option>
                      <option value="placement-prep">Placement Prep</option>
                      <option value="coding">Coding</option>
                      <option value="system-design">System Design</option>
                      <option value="behavioral">Behavioral</option>
                      <option value="skills">Skills</option>
                      <option value="career-growth">Career Growth</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Content Type
                    </label>
                    <select
                      value={formData.contentType}
                      onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                      <option value="exclusive">Exclusive</option>
                    </select>
                  </div>

                  {formData.contentType !== 'free' && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        min="0"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., interview, system-design, scalability"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="border-t border-zinc-800 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Course Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Prerequisites (one per line)
                  </label>
                  <textarea
                    value={formData.prerequisites}
                    onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                    placeholder="Basic programming knowledge&#10;Understanding of algorithms"
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Learning Outcomes (one per line)
                  </label>
                  <textarea
                    value={formData.learningOutcomes}
                    onChange={(e) => setFormData({ ...formData, learningOutcomes: e.target.value })}
                    placeholder="Master system design concepts&#10;Build scalable applications"
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Target Audience (one per line)
                  </label>
                  <textarea
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder="Software engineers&#10;Tech leads"
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Footer - Now inside form */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800 bg-zinc-900/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
