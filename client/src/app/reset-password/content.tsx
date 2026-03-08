'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';

export default function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    if (!token || !email) {
      toast.error('Invalid reset link');
      setIsVerifying(false);
      return;
    }

    try {
      await authAPI.verifyResetToken(token, email);
      setTokenValid(true);
      setIsVerifying(false);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Invalid or expired reset link';
      toast.error(errorMsg);
      setIsVerifying(false);
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await authAPI.resetPassword(
        token!,
        email!,
        formData.password,
        formData.confirmPassword
      );

      toast.success('Password reset successfully!');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to reset password';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-lg text-zinc-400 mb-6">Reset link is invalid or expired</p>
          <Link
            href="/forgot-password"
            className="inline-block px-6 py-3 rounded-lg bg-white text-zinc-900 font-semibold hover:bg-zinc-50 transition-all"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-3xl translate-y-1/2" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:block">
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl font-bold text-white mb-4">
                  Create New Password
                </h1>
                <p className="text-xl text-zinc-400">
                  Set a strong password to secure your account and regain access.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🛡️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Strong Security</h3>
                    <p className="text-sm text-zinc-400">Use a unique password with a mix of characters</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🔑</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Minimum 6 Characters</h3>
                    <p className="text-sm text-zinc-400">Password should be at least 6 characters long</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">✅</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Confirm Match</h3>
                    <p className="text-sm text-zinc-400">Make sure both passwords match exactly</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <p className="text-sm text-zinc-500">
                  © 2026 CareerCoach. Your security is our priority.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 sm:p-10">
              {/* Back Link */}
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>

              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                <p className="text-zinc-400 text-sm">Enter your new password below</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-zinc-200 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-colors disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-zinc-200 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-colors disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg bg-white text-zinc-900 font-semibold hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>

                <p className="text-center text-xs text-zinc-500">
                  Remember your password?{' '}
                  <Link
                    href="/login"
                    className="text-white hover:text-zinc-200 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
