'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, LogOut, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI, getAuthToken, removeAuthToken } from '@/lib/api';

interface UserData {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  userType: 'student' | 'professional';
  profileImage?: string;
  bio?: string;
  yearOfStudy?: number;
  company?: string;
  designation?: string;
  yearsOfExperience?: number;
  skills?: string[];
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    mobile: '',
    bio: '',
    skills: '',
    company: '',
    designation: '',
    yearsOfExperience: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await authAPI.getCurrentUser();
        setUser(response.data.user);

        // Populate form
        setFormData({
          mobile: response.data.user.mobile || '',
          bio: response.data.user.bio || '',
          skills: (response.data.user.skills || []).join(', '),
          company: response.data.user.company || '',
          designation: response.data.user.designation || '',
          yearsOfExperience: response.data.user.yearsOfExperience || '',
        });
      } catch (err: any) {
        removeAuthToken();
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.mobile) {
      toast.error('Mobile number is required');
      return;
    }

    try {
      setIsSaving(true);

      const updateData: any = {
        mobile: formData.mobile,
        bio: formData.bio,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
      };

      if (user?.userType === 'professional') {
        if (!formData.company || !formData.designation || !formData.yearsOfExperience) {
          toast.error('Company, designation, and years of experience are required');
          return;
        }
        updateData.company = formData.company;
        updateData.designation = formData.designation;
        updateData.yearsOfExperience = parseInt(formData.yearsOfExperience);
      }

      const response = await authAPI.updateProfile(updateData);

      setUser(response.data.user);
      toast.success('Profile updated successfully!');

      // Redirect back to dashboard after 1 second
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update profile';
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      removeAuthToken();
      localStorage.clear();
      sessionStorage.clear();
      toast.success('Logged out successfully');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Logout failed';
      toast.error(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Redirecting to login...</p>
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to Login
          </Link>
        </div>
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
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-4">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Profile Settings</h1>
              <p className="text-blue-100 mt-2">Update your profile information and preferences</p>
            </div>
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8">

        {/* Settings Form */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-blue-500/5 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h2>
          <form onSubmit={handleSave} className="space-y-6">
            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Mobile Number *</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition resize-none"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Skills (comma-separated)</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g., Python, React, System Design"
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition resize-none"
              />
            </div>

            {/* Professional Fields */}
            {user.userType === 'professional' && (
              <>
                <div className="border-t border-slate-200 pt-6 mt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Professional Information</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Company *</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g., Google"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Designation *</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Years of Experience *</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    placeholder="5"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition"
                    min="0"
                    required
                  />
                </div>
              </>
            )}

            {/* Save Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>

              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* User Info Display */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-blue-500/5 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Account Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Name:</span>
              <span className="text-slate-900 font-semibold">{user.name}</span>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Email:</span>
              <span className="text-slate-900 font-semibold">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-4">
              <span className="text-slate-600 font-medium">User Type:</span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold capitalize">{user.userType}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
