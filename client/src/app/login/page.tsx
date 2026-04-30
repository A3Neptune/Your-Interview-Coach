"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ChevronRight,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { authAPI, setAuthToken } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const { user, fetchUser, isLoggedIn, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const getPostLoginPath = (userType: string) => {
    if (redirectTo) return redirectTo;
    return userType === "admin" ? "/mentor-dashboard" : "/dashboard";
  };

  useEffect(() => {
    if (!authLoading && isLoggedIn && user) {
      router.push(getPostLoginPath(user.userType));
    }
  }, [isLoggedIn, authLoading, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (name: string) =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const passwordValid = formData.password.length >= 6;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      setIsLoading(true);
      const response = await authAPI.emailLogin(
        formData.email,
        formData.password,
      );
      setAuthToken(response.data.token);
      await fetchUser();
      const userType = response.data.user?.userType;
      toast.success(
        userType === "admin" ? "Welcome back, Mentor!" : "Welcome back!",
      );
      setTimeout(() => router.push(getPostLoginPath(userType)), 800);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      const response = await authAPI.googleLogin(credentialResponse.credential);
      if (response.data.isNewUser) {
        sessionStorage.setItem(
          "googleData",
          JSON.stringify(response.data.googleData),
        );
        toast.success("Complete your profile");
        router.push("/signup");
      } else {
        setAuthToken(response.data.token);
        await fetchUser();
        const userType = response.data.user?.userType;
        toast.success(
          userType === "admin" ? "Welcome back, Mentor!" : "Welcome back!",
        );
        setTimeout(() => router.push(getPostLoginPath(userType)), 800);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => toast.error("Google login failed");

  const inputBase =
    "w-full pl-10 pr-10 py-3 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all duration-200 bg-white border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .login-grain::before {
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

        .google-btn {
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
        }
        .google-btn:hover { transform: translateY(-1px); background: #f8faff !important; border-color: rgba(29,78,216,0.22) !important; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(.23,1,.32,1) both; }

        /* make GoogleLogin iframe fill its container cleanly */
        .google-wrapper > div,
        .google-wrapper iframe { width: 100% !important; border-radius: 12px !important; }
      `}</style>

      <div
        className="login-grain min-h-screen flex items-center justify-center p-4 relative"
        style={{
          background: "#f8f6f1",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        {/* grid */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(29,78,216,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(29,78,216,0.03) 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* blobs */}
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

        <div className="relative z-10 w-full max-w-[420px] fade-up">
          {/* Logo */}
          <div className="flex justify-center mb-7">
            <BrandLogo size="lg" />
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl p-7 card-shadow border border-slate-100">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-1">
                Welcome back
              </h1>
              <p className="text-slate-500 text-sm">
                Sign in to continue your journey
              </p>
            </div>

            {/* Google login */}
            <div className="mb-5">
              <div
                className="google-btn flex items-center justify-between w-full py-3 px-4 rounded-xl border cursor-pointer"
                style={{
                  background: "#fff",
                  borderColor: "rgba(29,78,216,0.14)",
                  boxShadow: "0 1px 4px rgba(29,78,216,0.04)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-800 font-semibold text-sm leading-tight">
                      Continue with Google
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      One-click sign in
                    </p>
                  </div>
                </div>
                {/* Actual GoogleLogin hidden behind this UI — overlay technique */}
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>

              {/* Real GoogleLogin — transparent overlay */}
              <div className="google-wrapper relative -mt-[52px] opacity-0 h-[52px]">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  size="large"
                  width="380"
                  text="continue_with"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-slate-400 font-medium">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none transition-colors z-10" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("email")}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    className={inputBase}
                    style={{ paddingLeft: 40 }}
                  />
                  {emailValid && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </span>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("password")}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className={inputBase}
                    style={{ paddingLeft: 40 }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {passwordValid && (
                      <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="text-slate-300 hover:text-slate-500 transition-colors shrink-0"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="submit-btn w-full py-3.5 text-white font-semibold text-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-slate-500 mt-5">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Sign up free
              </Link>
            </p>
          </div>

          {/* Bottom nav */}
          <div className="flex items-center justify-center gap-5 mt-5 text-xs text-slate-400">
            {[
              ["Home", "/"],
              ["Features", "/#features"],
              ["Pricing", "/#pricing"],
            ].map(([label, href], i, arr) => (
              <span key={label} className="flex items-center gap-5">
                <Link
                  href={href}
                  className="hover:text-blue-500 transition-colors"
                >
                  {label}
                </Link>
                {i < arr.length - 1 && (
                  <span className="text-slate-200">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
