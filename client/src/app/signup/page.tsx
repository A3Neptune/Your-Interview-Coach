'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authAPI, setAuthToken } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading, fetchUser } = useAuth();
  const [googleData, setGoogleData] = useState<any>(null);
  const [userType, setUserType] = useState<'student' | 'professional'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    yearOfStudy: '',
    company: '',
    designation: '',
    yearsOfExperience: '',
    skills: '',
  });

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, authLoading, router]);

  useEffect(() => {
    const data = sessionStorage.getItem('googleData');
    if (data) {
      const parsed = JSON.parse(data);
      setGoogleData(parsed);
      setFormData(prev => ({
        ...prev,
        name: parsed.name || '',
        email: parsed.email || '',
      }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.mobile) {
      toast.error('Name, email, and mobile are required');
      return;
    }

    if (!googleData && !formData.password) {
      toast.error('Password is required');
      return;
    }

    if (userType === 'student' && !formData.yearOfStudy) {
      toast.error('Year of study is required');
      return;
    }

    if (userType === 'professional' && (!formData.company || !formData.designation || !formData.yearsOfExperience)) {
      toast.error('Company, designation, and experience are required');
      return;
    }

    try {
      setIsLoading(true);

      const signupData: any = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        userType,
        isEmailSignup: !googleData,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
      };

      if (!googleData) {
        signupData.password = formData.password;
      }

      if (userType === 'student') {
        signupData.yearOfStudy = parseInt(formData.yearOfStudy);
      } else {
        signupData.company = formData.company;
        signupData.designation = formData.designation;
        signupData.yearsOfExperience = parseInt(formData.yearsOfExperience);
      }

      const response = await authAPI.signup(signupData);
      setAuthToken(response.data.token);
      await fetchUser(); // Wait for auth context to update
      toast.success('Account created successfully!');
      sessionStorage.removeItem('googleData');

      // Allow time for auth state to propagate
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="text-xl font-semibold text-slate-900">YourInterviewCoach</span>
        </Link>

        {/* Form Card */}
        <div className="bg-white/80  border border-blue-200/50 rounded-3xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create account</h1>
            <p className="text-slate-600 text-sm">Start your journey with us</p>
          </div>

          {!googleData && (
            <Link href="/login" className="block w-full mb-6">
              <div className="w-full py-4 bg-blue-50 border border-blue-200 rounded-lg text-center hover:bg-blue-100 transition">
                <p className="text-slate-900 font-semibold">Sign up with Google</p>
                <p className="text-slate-600 text-xs mt-1">Quick signup in one click</p>
              </div>
            </Link>
          )}

          {!googleData && (
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-slate-500">OR</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!!googleData}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!!googleData}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Mobile</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition"
                />
              </div>

              {!googleData && (
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  className={`p-3 rounded-lg border transition ${
                    userType === 'student'
                      ? 'bg-blue-100 border-blue-400'
                      : 'bg-blue-50 border-blue-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">🎓</div>
                    <div className={`text-sm font-semibold ${userType === 'student' ? 'text-blue-600' : 'text-slate-700'}`}>
                      Student
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType('professional')}
                  className={`p-3 rounded-lg border transition ${
                    userType === 'professional'
                      ? 'bg-blue-100 border-blue-400'
                      : 'bg-blue-50 border-blue-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">💼</div>
                    <div className={`text-sm font-semibold ${userType === 'professional' ? 'text-blue-600' : 'text-slate-700'}`}>
                      Professional
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {userType === 'student' && (
              <div>
                <label className="block text-sm text-slate-700 mb-2">Year of Study</label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-400 focus:bg-white transition"
                >
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            )}

            {userType === 'professional' && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Google"
                    className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Role</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="Engineer"
                    className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Exp (yrs)</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    placeholder="3"
                    className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-700 mb-2">Skills (optional)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="Python, React, System Design"
                className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        {/* Bottom Links */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>•</span>
          <Link href="/#features" className="hover:text-blue-600">Features</Link>
          <span>•</span>
          <Link href="/#pricing" className="hover:text-blue-600">Pricing</Link>
        </div>
      </div>
    </div>
  );
}
