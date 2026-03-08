
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI, setAuthToken } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, fetchUser, isLoggedIn, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (!authLoading && isLoggedIn && user) {
      // Redirect admin (Neel) to mentor dashboard, everyone else to user dashboard
      const userType = user.userType;
      if (userType === 'admin') {
        router.push('/mentor-dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isLoggedIn, authLoading, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.emailLogin(formData.email, formData.password);
      setAuthToken(response.data.token);
      await fetchUser();

      const userType = response.data.user?.userType;
      // Redirect admin (Neel) to mentor dashboard, everyone else to user dashboard
      if (userType === 'admin') {
        toast.success('Welcome back, Mentor!');
        // Allow time for auth state to propagate
        setTimeout(() => router.push('/mentor-dashboard'), 800);
      } else {
        toast.success('Welcome back!');
        // Allow time for auth state to propagate
        setTimeout(() => router.push('/dashboard'), 800);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      const response = await authAPI.googleLogin(credentialResponse.credential);

      if (response.data.isNewUser) {
        sessionStorage.setItem('googleData', JSON.stringify(response.data.googleData));
        toast.success('Complete your profile');
        router.push('/signup');
      } else {
        setAuthToken(response.data.token);
        await fetchUser();
        const userType = response.data.user?.userType;

        // Redirect admin (Neel) to mentor dashboard, everyone else to user dashboard
        if (userType === 'admin') {
          toast.success('Welcome back, Mentor!');
          // Allow time for auth state to propagate
          setTimeout(() => router.push('/mentor-dashboard'), 800);
        } else {
          toast.success('Welcome back!');
          // Allow time for auth state to propagate
          setTimeout(() => router.push('/dashboard'), 800);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="text-xl font-semibold text-slate-900">YourInterviewCoach</span>
        </Link>

        {/* Form Card */}
        <div className="bg-white/80  border border-blue-200/50 rounded-3xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-600 text-sm">Sign in to continue</p>
          </div>

          {/* Google Login */}
          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              size="large"
              width="100%"
              text="continue_with"
            />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-500">OR</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-600 mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign up
            </Link>
          </p>
        </div>

        {/* Bottom Links */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-zinc-600">
          <Link href="/" className="hover:text-zinc-400">Home</Link>
          <span>•</span>
          <Link href="/#features" className="hover:text-zinc-400">Features</Link>
          <span>•</span>
          <Link href="/#pricing" className="hover:text-zinc-400">Pricing</Link>
        </div>
      </div>
    </div>
  );
}
