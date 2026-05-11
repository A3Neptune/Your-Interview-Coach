'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';
import BrandLogo from '@/components/BrandLogo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.forgotPassword(email);
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .grain-bg::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        .card-shadow {
          box-shadow: 0 4px 32px rgba(29,78,216,0.08), 0 1px 4px rgba(29,78,216,0.04);
        }

        .submit-btn {
          background: linear-gradient(135deg, #1e3a8a, #1d4ed8);
          transition: transform 0.2s ease, box-shadow 0.25s ease;
        }
        .submit-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(29,78,216,0.30);
        }
        .submit-btn:not(:disabled):active { transform: translateY(0); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(.23,1,.32,1) both; }
      `}</style>

      <div
        className="grain-bg min-h-screen flex items-center justify-center p-4 relative"
        style={{
          background: "#f8f6f1",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        {/* Grid Background */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(29,78,216,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(29,78,216,0.03) 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Blobs */}
        <div
          className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(circle,rgba(29,78,216,0.07) 0%,transparent 70%)",
            filter: "blur(80px)",
            transform: "translate(30%,-30%)",
          }}
        />
        <div
          className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(circle,rgba(8,145,178,0.05) 0%,transparent 70%)",
            filter: "blur(80px)",
            transform: "translate(-30%,30%)",
          }}
        />

        <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-12 gap-8 items-center fade-up">
          {/* Left Panel: Branding & Benefits */}
          <div className="lg:col-span-5 space-y-6 hidden lg:block pr-4">
            <div className="mb-6">
              <BrandLogo size="lg" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
                Forgot your password?
              </h1>
              <p className="text-slate-600 text-base leading-relaxed">
                No worries! Enter your registered email address, and we'll send you a secure verification link to choose a new password.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Secure Authentication</h4>
                  <p className="text-slate-500 text-xs mt-0.5">We use high-security cryptographic reset links that expire in 1 hour.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Instant Delivery</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Password reset links are dispatched directly to your inbox via nodemailer.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Reset Card */}
          <div className="lg:col-span-7 w-full max-w-[480px] mx-auto lg:mx-0">
            <div className="bg-white rounded-3xl p-8 sm:p-10 card-shadow border border-slate-100">
              {/* Back Link */}
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-6 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>

              {/* Logo for mobile view */}
              <div className="flex lg:hidden mb-6">
                <BrandLogo size="md" />
              </div>

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                  Reset Password
                </h2>
                <p className="text-slate-500 text-sm">
                  {submitted
                    ? 'Check your inbox for the reset link'
                    : 'Enter your email address and we\'ll send you a link to reset your password'}
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none z-10" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all duration-200 bg-white border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        style={{ paddingLeft: 40 }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="submit-btn w-full py-3.5 text-white font-semibold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                  </button>

                  <p className="text-center text-sm text-slate-500 mt-4">
                    Don't have an account?{' '}
                    <Link
                      href="/signup"
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </form>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-blue-50 bg-blue-50/50 p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mx-auto mb-3">
                      <Mail className="w-6 h-6" />
                    </div>
                    <p className="text-base font-semibold text-slate-850 mb-1.5">
                      Reset link sent!
                    </p>
                    <p className="text-sm text-slate-600">
                      We have dispatched a password reset link to <strong>{email}</strong>.
                    </p>
                    <p className="text-xs text-slate-400 mt-3 border-t border-blue-100 pt-3">
                      The link remains active for exactly 1 hour. Please check your spam folder if you do not receive it.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEmail('');
                      setSubmitted(false);
                    }}
                    className="w-full py-3 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Try another email address
                  </button>

                  <Link
                    href="/login"
                    className="submit-btn block text-center py-3.5 text-white font-semibold text-sm rounded-xl"
                  >
                    Back to Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
