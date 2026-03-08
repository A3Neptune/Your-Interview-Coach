'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.forgotPassword(email);

      // Store reset link for development/testing
      if (response.data.resetLink) {
        sessionStorage.setItem('resetLink', response.data.resetLink);
      }

      toast.success('Password reset link sent to your email!');
      setSubmitted(true);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to send reset link';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

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
                  Reset Your Password
                </h1>
                <p className="text-xl text-zinc-400">
                  Secure your account by resetting your password. We'll send you a link to complete the process.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🔐</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Secure Process</h3>
                    <p className="text-sm text-zinc-400">Your reset link expires in 1 hour for security</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">✉️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Email Verification</h3>
                    <p className="text-sm text-zinc-400">Check your inbox for the password reset link</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Quick Reset</h3>
                    <p className="text-sm text-zinc-400">Create a new password and get back to your account</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <p className="text-sm text-zinc-500">
                  © 2026 CareerCoach. Keeping your account secure.
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
                <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
                <p className="text-zinc-400 text-sm">
                  {submitted
                    ? 'Check your email for the reset link'
                    : 'Enter your email address and we\'ll send you a link to reset your password'}
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-200 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none transition-colors disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-lg bg-white text-zinc-900 font-semibold hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>

                  <p className="text-center text-sm text-zinc-500">
                    Don't have an account?{' '}
                    <Link
                      href="/signup"
                      className="text-white hover:text-zinc-200 font-medium transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
                    <p className="text-lg font-semibold text-white mb-2">
                      Reset link sent!
                    </p>
                    <p className="text-sm text-zinc-400 mb-4">
                      We've sent a password reset link to <strong>{email}</strong>
                    </p>
                    <p className="text-xs text-zinc-500 mb-4">
                      The link expires in 1 hour. Check your spam folder if you don't see it.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEmail('');
                      setSubmitted(false);
                    }}
                    className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300 font-medium"
                  >
                    Try another email
                  </button>

                  <Link
                    href="/login"
                    className="block text-center py-3 rounded-lg bg-white text-zinc-900 font-semibold hover:bg-zinc-50 transition-all duration-300"
                  >
                    Back to Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
