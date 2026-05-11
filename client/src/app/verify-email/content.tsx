'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI, setAuthToken } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import BrandLogo from '@/components/BrandLogo';

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { fetchUser } = useAuth();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      handleVerification(token);
    } else {
      setStatus('error');
    }
  }, [token]);

  const handleVerification = async (verifyToken: string) => {
    try {
      const response = await authAPI.verifyEmail(verifyToken);
      if (response.data.success && response.data.token) {
        setAuthToken(response.data.token);
        await fetchUser();
        setStatus('success');
        toast.success('Email verified successfully! Welcome onboard.');
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setStatus('error');
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setIsResending(true);
      await authAPI.resendVerification(resendEmail);
      toast.success('Verification link sent successfully!');
      setResendSuccess(true);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to resend verification link';
      toast.error(errorMsg);
    } finally {
      setIsResending(false);
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
        className="grain-bg min-h-screen flex items-center justify-center p-4 relative animate-fade-in"
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

        <div className="relative z-10 w-full max-w-md mx-auto fade-up">
          <div className="bg-white rounded-3xl p-8 sm:p-10 card-shadow border border-slate-100 text-center">
            
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <BrandLogo size="md" />
            </div>

            {/* Verifying state */}
            {status === 'verifying' && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <Loader2 className="w-14 h-14 text-blue-600 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verifying Email</h2>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    Please hold on a moment while we cryptographically verify your email token...
                  </p>
                </div>
              </div>
            )}

            {/* Success state */}
            {status === 'success' && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Email Verified!</h2>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    Your account has been successfully verified. You're being logged in and redirected to the dashboard.
                  </p>
                </div>
                <div className="pt-4 flex justify-center items-center gap-2 text-blue-600 text-xs font-semibold">
                  <span>Redirecting to your dashboard</span>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
              </div>
            )}

            {/* Error state */}
            {status === 'error' && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
                    <XCircle className="w-10 h-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verification Failed</h2>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    The verification link is invalid or has expired. Standard links are active for exactly 24 hours.
                  </p>
                </div>

                {/* Resend verification panel */}
                {!resendSuccess ? (
                  <form onSubmit={handleResend} className="border-t border-slate-100 pt-6 mt-4 space-y-4 text-left">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                      Resend Link
                    </p>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={resendEmail}
                          onChange={(e) => setResendEmail(e.target.value)}
                          disabled={isResending}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all bg-white border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          style={{ paddingLeft: 40 }}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isResending}
                      className="submit-btn w-full py-3 text-white font-semibold text-sm rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send New Verification Link'
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="border-t border-slate-100 pt-6 mt-4 space-y-3">
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-center">
                      <p className="text-xs font-semibold text-blue-800">
                        New Link Dispatched!
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Please check <strong>{resendEmail}</strong> for a fresh activation email.
                      </p>
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs">
                  <Link href="/login" className="text-slate-500 hover:text-slate-800 font-semibold transition-colors">
                    Back to login
                  </Link>
                  <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                    Create new account
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
