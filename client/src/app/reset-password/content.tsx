'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Eye, EyeOff, ShieldCheck, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';
import BrandLogo from '@/components/BrandLogo';

export default function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

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
  }, [token]);

  const verifyToken = async () => {
    if (!token) {
      toast.error('Invalid or missing reset link');
      setIsVerifying(false);
      return;
    }

    try {
      // Backend verify-reset-token only requires token
      await authAPI.verifyResetToken(token, '');
      setTokenValid(true);
      setIsVerifying(false);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Invalid or expired reset link';
      toast.error(errorMsg);
      setIsVerifying(false);
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
      // Reset password on backend
      await authAPI.resetPassword(
        token!,
        '',
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

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#f8f6f1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Verifying reset link...</p>
        </div>
      </div>
    );
  }

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
        {/* Grid background */}
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
          {/* Left panel: Branding and security info */}
          <div className="lg:col-span-5 space-y-6 hidden lg:block pr-4">
            <div className="mb-6">
              <BrandLogo size="lg" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
                Choose a New Password
              </h1>
              <p className="text-slate-600 text-base leading-relaxed">
                Set a strong, unique password to secure your account. Once verified, you'll be redirected straight back to login.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Enhanced Protection</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Your password is encrypted using high-entropy bcrypt hashing algorithms.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Immediate Match Check</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Both inputs are evaluated instantly for safe mismatch protection.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Form card */}
          <div className="lg:col-span-7 w-full max-w-[480px] mx-auto lg:mx-0">
            <div className="bg-white rounded-3xl p-8 sm:p-10 card-shadow border border-slate-100">
              {/* Back link */}
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

              {/* Token Invalid State */}
              {!tokenValid ? (
                <div className="space-y-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mx-auto mb-3">
                    <ShieldCheck className="w-6 h-6 text-red-500" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Link Invalid or Expired</h2>
                  <p className="text-slate-500 text-sm">
                    This password reset link is invalid, broken, or has expired. Please request a new link to proceed.
                  </p>
                  <Link
                    href="/forgot-password"
                    className="submit-btn block text-center py-3 text-white font-semibold text-sm rounded-xl"
                  >
                    Request New Link
                  </Link>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                      Reset Password
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Please type your new secure password below
                    </p>
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    {/* New password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none z-10" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Min 6 characters"
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all duration-200 bg-white border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          style={{ paddingLeft: 40 }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none z-10" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all duration-200 bg-white border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          style={{ paddingLeft: 40 }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="submit-btn w-full py-3.5 text-white font-semibold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                      {isLoading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
