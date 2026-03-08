'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, User, CheckCircle, ExternalLink, Play, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { contentAPI } from '@/lib/api';
import { getAuthToken, removeAuthToken } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Content {
  _id: string;
  title: string;
  description: string;
  contentType: 'google-doc' | 'google-sheet' | 'video-link' | 'pdf' | 'other';
  embedUrl?: string;
  videoUrl?: string;
  duration: number;
  order: number;
}

interface Course {
  _id: string;
  title: string;
  shortDescription?: string;
  fullDescription?: string;
  description?: string;
  contentType: 'free' | 'paid' | 'exclusive';
  category: string;
  difficulty?: string;
  price?: number;
  tags?: string[];
  modules?: Array<{
    title: string;
    description?: string;
    order: number;
    estimatedDuration?: number;
    resources?: Array<{
      type: string;
      title: string;
      url?: string;
      embedUrl?: string;
      duration?: number;
      description?: string;
    }>;
  }>;
  mentorId: {
    _id: string;
    name: string;
    designation: string;
    company: string;
    profileImage?: string;
  };
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // Video caching and rendering states
  const [videoCache, setVideoCache] = useState<Map<string, string>>(new Map());
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<Map<string, number>>(new Map());
  const [preloadedVideos, setPreloadedVideos] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push('/login');
          return;
        }

        setIsLoading(true);

        // Fetch from advanced courses API
        const response = await fetch(`${API_URL}/advanced/courses/published/${courseId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch course');
        }

        const courseData = data.data;
        setCourse(courseData);

        // Extract contents from modules
        const moduleContents: Content[] = [];
        if (courseData.modules && courseData.modules.length > 0) {
          courseData.modules.forEach((module: any, moduleIndex: number) => {
            if (module.resources && module.resources.length > 0) {
              module.resources.forEach((resource: any, resourceIndex: number) => {
                moduleContents.push({
                  _id: `${module._id || moduleIndex}-${resource._id || resourceIndex}`,
                  title: resource.title || resource.type,
                  description: resource.description || module.description || '',
                  contentType: resource.type === 'video' ? 'video-link' : 'other',
                  embedUrl: resource.embedUrl || resource.url,
                  videoUrl: resource.url,
                  duration: resource.duration || 0,
                  order: resource.order || resourceIndex,
                });
              });
            }
          });
        }

        setContents(moduleContents);

        if (moduleContents.length > 0) {
          setSelectedContent(moduleContents[0]);
        }

        // Check enrollment status
        await checkEnrollmentStatus();
      } catch (err: any) {
        console.error('Error fetching course:', err);
        if (err.response?.status === 401 || err.message?.includes('token')) {
          removeAuthToken();
          router.push('/login');
        } else if (err.response?.status === 403) {
          toast.error('You need to purchase this course to access it');
          router.push('/dashboard/content');
        } else {
          toast.error('Failed to load course');
          router.push('/dashboard/content');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, router]);

  // Video caching and preloading effect
  useEffect(() => {
    if (!selectedContent || !isEnrolled) return;

    const preloadVideo = async (content: Content) => {
      if (!content.videoUrl || preloadedVideos.has(content._id)) return;

      try {
        setIsVideoLoading(true);
        setVideoError(null);

        // Cache video URL
        setVideoCache(prev => new Map(prev).set(content._id, content.videoUrl!));
        setPreloadedVideos(prev => new Set(prev).add(content._id));

        // Load progress from localStorage
        const savedProgress = localStorage.getItem(`video_progress_${content._id}`);
        if (savedProgress) {
          setVideoProgress(prev => new Map(prev).set(content._id, parseFloat(savedProgress)));
        }
      } catch (error) {
        console.error('Error preloading video:', error);
        setVideoError('Failed to load video. Please try again.');
      } finally {
        setIsVideoLoading(false);
      }
    };

    preloadVideo(selectedContent);

    // Preload next video
    const currentIndex = contents.findIndex(c => c._id === selectedContent._id);
    if (currentIndex >= 0 && currentIndex < contents.length - 1) {
      const nextContent = contents[currentIndex + 1];
      if (nextContent.videoUrl) {
        setTimeout(() => preloadVideo(nextContent), 2000); // Preload after 2s
      }
    }
  }, [selectedContent, contents, isEnrolled, preloadedVideos]);

  // Save video progress
  const handleVideoProgress = (contentId: string, progress: number) => {
    setVideoProgress(prev => new Map(prev).set(contentId, progress));
    localStorage.setItem(`video_progress_${contentId}`, progress.toString());
  };

  const checkEnrollmentStatus = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/enrollments/${courseId}/check`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setIsEnrolled(data.isEnrolled);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!course) return;

    // If paid, show modal asking for payment
    if (course.contentType === 'paid' || course.contentType === 'exclusive') {
      setShowEnrollModal(true);
      return;
    }

    // For free courses, enroll directly
    try {
      setIsEnrolling(true);
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/enrollments/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Enrolled successfully!');
        setIsEnrolled(true);
        setShowEnrollModal(false);
      } else {
        toast.error(data.error || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handlePaymentAndEnroll = async () => {
    // Redirect to checkout page
    router.push(`/dashboard/checkout/${courseId}`);
  };

  const renderContent = () => {
    if (!selectedContent) return null;

    switch (selectedContent.contentType) {
      case 'google-doc':
      case 'google-sheet':
        return (
          <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-blue-200 shadow-lg">
            <iframe
              src={selectedContent.embedUrl}
              className="w-full h-full"
              allow="fullscreen"
              title={selectedContent.title}
            />
          </div>
        );

      case 'video-link':
        const cachedUrl = videoCache.get(selectedContent._id) || selectedContent.videoUrl;
        const progress = videoProgress.get(selectedContent._id) || 0;

        return (
          <div className="relative w-full rounded-2xl overflow-hidden border-2 border-blue-300 aspect-video shadow-2xl">
            {isVideoLoading && (
              <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">Loading video...</p>
                </div>
              </div>
            )}

            {videoError && (
              <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10 p-6">
                <div className="text-center">
                  <p className="text-red-600 font-semibold mb-2">{videoError}</p>
                  <button
                    onClick={() => {
                      setVideoError(null);
                      setIsVideoLoading(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            <div className="relative w-full h-full bg-slate-900">
              <iframe
                src={cachedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedContent.title}
                onLoad={() => setIsVideoLoading(false)}
                onError={() => setVideoError('Failed to load video')}
              />

              {/* Progress bar */}
              {progress > 0 && progress < 100 && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800/80">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className="w-full rounded-2xl overflow-hidden border-2 border-blue-200 shadow-lg">
            <embed src={selectedContent.videoUrl} type="application/pdf" width="100%" height="600" />
          </div>
        );

      default:
        return (
          <div className="rounded-2xl border-2 border-blue-200 bg-white shadow-lg p-8 text-center">
            <p className="text-slate-600">Content type not supported for preview</p>
            {selectedContent.videoUrl && (
              <a
                href={selectedContent.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Open content <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Course not found</p>
          <Link href="/dashboard/content" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Video/Content Player */}
            <div className="mb-8">
              {selectedContent ? (
                renderContent()
              ) : (
                <div className="rounded-2xl border-2 border-blue-200 bg-white shadow-lg p-12 text-center aspect-video flex items-center justify-center">
                  <p className="text-slate-600 font-medium">Select a lesson to begin</p>
                </div>
              )}
            </div>

            {/* Content Details */}
            {selectedContent && (
              <div className="rounded-2xl border-2 border-blue-200 bg-white shadow-lg p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedContent.title}</h2>
                  {selectedContent.description && (
                    <p className="text-slate-600 leading-relaxed">{selectedContent.description}</p>
                  )}
                </div>

                {selectedContent.duration > 0 && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                    <Clock className="w-4 h-4" />
                    <span>{selectedContent.duration} minutes</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar: Course Info & Lesson List */}
          <div className="space-y-6">
            {/* Course Card */}
            <div className="rounded-2xl border-2 border-blue-200 bg-white shadow-lg p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{course.title}</h3>
                <p className="text-xs text-blue-600 capitalize font-semibold bg-blue-50 px-2 py-1 rounded-lg inline-block">{course.category.replace('-', ' ')}</p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">{course.description}</p>

              {/* Enrollment Button */}
              {!isEnrolled && (
                <div className="pt-4 border-t border-blue-100">
                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {isEnrolling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Enrolling...
                      </>
                    ) : (
                      <>
                        {course.contentType === 'paid' || course.contentType === 'exclusive' ? (
                          <>
                            <Lock size={18} />
                            Enroll Now - ₹{course.price}
                          </>
                        ) : (
                          <>
                            <Play size={18} />
                            Enroll for Free
                          </>
                        )}
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-500 text-center mt-2">
                    {course.contentType === 'paid' || course.contentType === 'exclusive'
                      ? 'You need to enroll to access this course'
                      : 'Enroll to start learning'}
                  </p>
                </div>
              )}

              {isEnrolled && (
                <div className="pt-4 border-t border-blue-100">
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-200">
                    <CheckCircle size={18} />
                    <span className="text-sm font-semibold">You're enrolled in this course</span>
                  </div>
                </div>
              )}

              {/* Mentor Info */}
              <div className="pt-4 border-t border-blue-100">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Instructor</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                    {course.mentorId.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900">{course.mentorId.name}</p>
                    <p className="text-xs text-slate-600">{course.mentorId.designation}</p>
                    {course.mentorId.company && (
                      <p className="text-xs text-blue-600 font-medium">{course.mentorId.company}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enrollment Modal for Paid Courses */}
            {showEnrollModal && course && (course.contentType === 'paid' || course.contentType === 'exclusive') && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-md border-2 border-blue-200 shadow-2xl p-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Enroll in Course</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-slate-600 font-medium mb-2">Course</p>
                      <p className="font-bold text-slate-900">{course.title}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-slate-600 font-medium mb-2">Amount</p>
                      <p className="text-3xl font-bold text-blue-600">₹{course.price}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowEnrollModal(false)}
                        className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-xl font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePaymentAndEnroll}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lessons List */}
            <div className="rounded-2xl border-2 border-blue-200 bg-white shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white">
                <h4 className="font-bold text-slate-900">Lessons ({contents.length})</h4>
              </div>

              <div className="divide-y divide-blue-100 max-h-96 overflow-y-auto">
                {contents.map((content, index) => {
                  const contentProgress = videoProgress.get(content._id) || 0;
                  const isCompleted = contentProgress >= 90;
                  const isInProgress = contentProgress > 0 && contentProgress < 90;

                  return (
                    <button
                      key={content._id}
                      onClick={() => setSelectedContent(content)}
                      className={`w-full px-6 py-4 text-left transition-all hover:bg-blue-50 relative ${
                        selectedContent?._id === content._id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      {/* Progress indicator at bottom */}
                      {isInProgress && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
                          <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${contentProgress}%` }}
                          />
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {isCompleted ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          ) : selectedContent?._id === content._id ? (
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                              <Play className="w-3 h-3 text-white" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-400 bg-white flex items-center justify-center">
                              <span className="text-[10px] font-bold text-slate-600">{index + 1}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                            {content.title}
                          </p>
                          {content.duration > 0 && (
                            <div className="flex items-center gap-3 mt-1.5">
                              <p className="text-xs text-blue-600 font-semibold flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded">
                                <Clock className="w-3 h-3" />
                                {content.duration} min
                              </p>
                              {isInProgress && (
                                <p className="text-xs text-emerald-600 font-semibold">
                                  {Math.round(contentProgress)}% watched
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
