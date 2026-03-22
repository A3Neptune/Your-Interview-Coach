'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Briefcase, Book, Award, Edit3 } from 'lucide-react';
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

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (err: any) {
        removeAuthToken();
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">My Profile</h1>
          <p className="text-blue-100 mt-2">View and manage your profile information</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Profile Header */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-lg shadow-blue-500/5 p-8 sm:p-12 mb-8">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-blue-200 ring-4 ring-blue-100 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-4 border-blue-200 ring-4 ring-blue-100 shadow-lg">
                  <span className="text-6xl font-bold text-white">{getInitials()}</span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-slate-900">{user.name}</h2>
                <p className="text-lg sm:text-xl text-blue-600 capitalize font-medium">
                  {user.userType === 'student' ? `Student • Year ${user.yearOfStudy}` : user.designation}
                </p>
              </div>

              {user.bio && (
                <p className="text-slate-600 mb-6 max-w-2xl leading-relaxed">{user.bio}</p>
              )}

              <Link
                href="/dashboard/settings"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-white font-semibold"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Contact Information */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-blue-500/5 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              Contact Information
            </h2>

            <div className="space-y-4">
              <div className="pb-4 border-b border-slate-200">
                <p className="text-sm text-slate-500 mb-2 font-medium">Email</p>
                <p className="text-slate-900 font-semibold">{user.email}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-2 font-medium">Mobile</p>
                <p className="text-slate-900 font-semibold">{user.mobile}</p>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          {user.userType === 'professional' ? (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-blue-500/5 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                </div>
                Professional Details
              </h2>

              <div className="space-y-4">
                <div className="pb-4 border-b border-slate-200">
                  <p className="text-sm text-slate-500 mb-2 font-medium">Company</p>
                  <p className="text-slate-900 font-semibold">{user.company}</p>
                </div>

                <div className="pb-4 border-b border-slate-200">
                  <p className="text-sm text-slate-500 mb-2 font-medium">Designation</p>
                  <p className="text-slate-900 font-semibold">{user.designation}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-2 font-medium">Years of Experience</p>
                  <p className="text-slate-900 font-semibold">{user.yearsOfExperience} years</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-blue-500/5 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Book className="w-5 h-5 text-purple-600" />
                </div>
                Academic Details
              </h2>

              <div>
                <p className="text-sm text-slate-500 mb-2 font-medium">Year of Study</p>
                <p className="text-slate-900 font-semibold text-lg">{user.yearOfStudy} Year</p>
              </div>
            </div>
          )}
        </div>

        {/* Skills Section */}
        {user.skills && user.skills.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-blue-500/5 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              Skills
            </h2>

            <div className="flex flex-wrap gap-3">
              {user.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-lg bg-blue-100 border border-blue-200 text-blue-700 text-sm font-semibold hover:bg-blue-200 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
