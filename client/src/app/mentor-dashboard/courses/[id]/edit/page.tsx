'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Eye, Loader2, Upload, X, Plus, Trash2, Video, FileText, Link as LinkIcon, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { getAuthToken } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Resource {
  type: string;
  title: string;
  url?: string;
  duration?: number;
}

interface Module {
  title: string;
  description: string;
  order: number;
  isLocked: boolean;
  estimatedDuration: number;
  resources: Resource[];
}

interface Course {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  contentType: string;
  difficulty: string;
  price: number;
  tags: string[];
  thumbnail: string;
  duration: number;
  modules: Module[];
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [course, setCourse] = useState<Course>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: 'mock-interview',
    contentType: 'free',
    difficulty: 'beginner',
    price: 0,
    tags: [],
    thumbnail: '',
    duration: 0,
    modules: [],
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/advanced/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setCourse(data.data);
      } else {
        toast.error('Failed to load course');
      }
    } catch (error) {
      console.error('Fetch course error:', error);
      toast.error('Failed to load course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/advanced/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(course),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Course updated successfully');
        router.push('/mentor-dashboard/courses');
      } else {
        toast.error(data.error || 'Failed to update course');
      }
    } catch (error) {
      console.error('Update course error:', error);
      toast.error('Failed to update course');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setCourse(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleTagsChange = (e: any) => {
    const tags = e.target.value.split(',').map((tag: any) => tag.trim()).filter((tag: any) => tag);
    setCourse(prev => ({ ...prev, tags }));
  };

  const handleThumbnailUpload = async (e: any) => {
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
        setCourse(prev => ({ ...prev, thumbnail: data.data.url }));
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

  const handleVideoUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video must be less than 100MB');
      return;
    }

    setUploadingVideo(true);

    try {
      const token = getAuthToken();
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch(`${API_URL}/upload/course-video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        setCourse(prev => ({ ...prev, previewVideo: data.data.url }));
        toast.success('Video uploaded successfully!');
      } else {
        toast.error(data.error || 'Failed to upload video');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const addModule = () => {
    const newModule = {
      title: '',
      description: '',
      order: course.modules?.length || 0,
      isLocked: false,
      estimatedDuration: 0,
      resources: [],
    };
    setCourse(prev => ({
      ...prev,
      modules: [...(prev.modules || []), newModule],
    }));
  };

  const updateModule = (index: number, field: string, value: any) => {
    const updatedModules = [...(course.modules || [])];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setCourse(prev => ({ ...prev, modules: updatedModules }));
  };

  const deleteModule = (index: number) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules?.filter((_, i) => i !== index) || [],
    }));
  };

  const addResourceToModule = (moduleIndex: number, resourceType: string) => {
    const updatedModules = [...(course.modules || [])];
    const newResource = {
      type: resourceType,
      title: '',
      url: '',
      description: '',
      order: updatedModules[moduleIndex].resources?.length || 0,
    };
    updatedModules[moduleIndex].resources = [...(updatedModules[moduleIndex].resources || []), newResource];
    setCourse(prev => ({ ...prev, modules: updatedModules }));
  };

  const updateResource = (moduleIndex: number, resourceIndex: number, field: string, value: any) => {
    const updatedModules = [...(course.modules || [])];
    updatedModules[moduleIndex].resources[resourceIndex] = {
      ...updatedModules[moduleIndex].resources[resourceIndex],
      [field]: value,
    };
    setCourse(prev => ({ ...prev, modules: updatedModules }));
  };

  const deleteResource = (moduleIndex: number, resourceIndex: number) => {
    const updatedModules = [...(course.modules || [])];
    updatedModules[moduleIndex].resources = updatedModules[moduleIndex].resources?.filter((_, i) => i !== resourceIndex) || [];
    setCourse(prev => ({ ...prev, modules: updatedModules }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/mentor-dashboard/courses"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Courses
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">
          Edit Course
        </h1>
        <p className="text-zinc-400">Update your course details</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        {/* Basic Info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={course.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Short Description *
              </label>
              <input
                type="text"
                name="shortDescription"
                value={course.shortDescription}
                onChange={handleChange}
                required
                maxLength={150}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-zinc-500 mt-1">
                {course.shortDescription?.length || 0}/150 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Full Description
              </label>
              <textarea
                name="fullDescription"
                value={course.fullDescription}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={course.tags?.join(', ') || ''}
                onChange={handleTagsChange}
                placeholder="e.g., javascript, react, frontend"
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
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
                {course.thumbnail && (
                  <div className="flex items-center gap-2">
                    <img
                      src={course.thumbnail}
                      alt="Thumbnail preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setCourse(prev => ({ ...prev, thumbnail: '' }))}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-1">Max 5MB, JPG/PNG/WEBP</p>
            </div>
          </div>
        </div>

        {/* Course Settings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Course Settings</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={course.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="mock-interview">Mock Interview</option>
                <option value="resume-building">Resume Building</option>
                <option value="coding">Coding</option>
                <option value="system-design">System Design</option>
                <option value="behavioral">Behavioral</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={course.difficulty}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Content Type *
              </label>
              <select
                name="contentType"
                value={course.contentType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="exclusive">Exclusive</option>
              </select>
            </div>

            {course.contentType === 'paid' && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={course.price}
                  onChange={handleChange}
                  min="0"
                  required
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Modules Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Course Modules</h2>
            <button
              type="button"
              onClick={addModule}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Add Module
            </button>
          </div>

          {course.modules && course.modules.length > 0 ? (
            <div className="space-y-4">
              {course.modules.map((module: any, moduleIndex: number) => (
                <div key={moduleIndex} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <GripVertical size={20} className="text-zinc-500 mt-2" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Module Title"
                          value={module.title}
                          onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                          className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => deleteModule(moduleIndex)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <textarea
                        placeholder="Module Description"
                        value={module.description}
                        onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
                      />

                      {/* Resources */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-zinc-400">Resources</p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => addResourceToModule(moduleIndex, 'video')}
                              className="px-3 py-1 bg-zinc-900 hover:bg-zinc-700 rounded text-xs flex items-center gap-1 transition-colors"
                            >
                              <Video size={14} />
                              Video
                            </button>
                            <button
                              type="button"
                              onClick={() => addResourceToModule(moduleIndex, 'document')}
                              className="px-3 py-1 bg-zinc-900 hover:bg-zinc-700 rounded text-xs flex items-center gap-1 transition-colors"
                            >
                              <FileText size={14} />
                              Document
                            </button>
                            <button
                              type="button"
                              onClick={() => addResourceToModule(moduleIndex, 'link')}
                              className="px-3 py-1 bg-zinc-900 hover:bg-zinc-700 rounded text-xs flex items-center gap-1 transition-colors"
                            >
                              <LinkIcon size={14} />
                              Link
                            </button>
                          </div>
                        </div>

                        {module.resources && module.resources.length > 0 && (
                          <div className="space-y-2">
                            {module.resources.map((resource: any, resourceIndex: number) => (
                              <div key={resourceIndex} className="bg-zinc-900 border border-zinc-700 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  {resource.type === 'video' && <Video size={16} className="text-blue-400" />}
                                  {resource.type === 'document' && <FileText size={16} className="text-green-400" />}
                                  {resource.type === 'link' && <LinkIcon size={16} className="text-purple-400" />}
                                  <input
                                    type="text"
                                    placeholder="Resource Title"
                                    value={resource.title}
                                    onChange={(e) => updateResource(moduleIndex, resourceIndex, 'title', e.target.value)}
                                    className="flex-1 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => deleteResource(moduleIndex, resourceIndex)}
                                    className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  placeholder={resource.type === 'video' ? 'Video URL (YouTube, Vimeo, etc.)' : 'URL'}
                                  value={resource.url}
                                  onChange={(e) => updateResource(moduleIndex, resourceIndex, 'url', e.target.value)}
                                  className="w-full px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500">
              <FileText size={48} className="mx-auto mb-3 opacity-50" />
              <p>No modules added yet. Click "Add Module" to get started.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/mentor-dashboard/courses"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
