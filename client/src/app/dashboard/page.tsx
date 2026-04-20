"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  Calendar,
  ArrowRight,
  Clock,
  Zap,
  User,
  ExternalLink,
} from "lucide-react";
import { authAPI, getAuthToken, removeAuthToken } from "@/lib/api";
import axios from "axios";

interface UserData {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  userType: "student" | "professional" | "admin";
  profileImage?: string;
  bio?: string;
  yearOfStudy?: number;
  company?: string;
  designation?: string;
  yearsOfExperience?: number;
  skills?: string[];
  googleId?: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  title: string;
  value: string;
  points: string[];
  level: string;
  support: string;
  access: string;
  discount?: {
    type: "percentage" | "fixed" | "none";
    value: number;
    isActive: boolean;
  };
}

interface Booking {
  _id: string;
  title: string;
  scheduledDate: string;
  duration: number;
  status: string;
  meetingLink?: string;
  mentorId: {
    name: string;
    email: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await authAPI.getCurrentUser();
        const userData = response.data.user;

        // Redirect admin users to mentor dashboard
        if (userData.userType === "admin") {
          router.push("/mentor-dashboard");
          return;
        }

        setUser(userData);

        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

        // Fetch services from pricing section
        const servicesRes = await axios.get(
          `${API_URL}/pricing-section/public`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setServices(servicesRes.data.services || []);

        // Fetch upcoming bookings
        try {
          const bookingsRes = await axios.get(`${API_URL}/bookings/student`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          const upcoming = (bookingsRes.data.bookings || [])
            .filter(
              (b: Booking) =>
                b.status === "confirmed" &&
                new Date(b.scheduledDate) > new Date(),
            )
            .sort(
              (a: Booking, b: Booking) =>
                new Date(a.scheduledDate).getTime() -
                new Date(b.scheduledDate).getTime(),
            )
            .slice(0, 3);
          setUpcomingBookings(upcoming);
        } catch (err) {
          console.error("Error fetching bookings:", err);
        }
      } catch (err: any) {
        removeAuthToken();
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDiscountedPrice = (service: Service) => {
    if (!service.discount?.isActive || service.discount.type === "none") {
      return { original: service.price, discounted: service.price, saving: 0 };
    }

    let saving = 0;
    if (service.discount.type === "percentage") {
      saving = (service.price * service.discount.value) / 100;
    } else {
      saving = service.discount.value;
    }

    return {
      original: service.price,
      discounted: Math.max(0, service.price - saving),
      saving: Math.round(saving),
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Redirecting to login...</p>
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Welcome back, {user.name.split(" ")[0]}! 👋
              </h1>
              <p className="text-blue-100 text-base sm:text-lg">
                {user.userType === "student"
                  ? "Ready to accelerate your career growth?"
                  : "Continue making an impact today."}
              </p>
            </div>
            <button
              onClick={() =>
                document
                  .getElementById("services-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Browse Services
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Profile Card */}
          <div className="col-span-2 lg:col-span-1 rounded-2xl border border-slate-200 bg-white shadow-md shadow-blue-500/5 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <div className="flex items-center gap-4">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {getInitials()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate">
                  {user.name}
                </h3>
                <p className="text-sm text-slate-500 truncate">{user.email}</p>
                <Link
                  href="/dashboard/profile"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Profile →
                </Link>
              </div>
            </div>
          </div>

          {/* Sessions Stat */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-md shadow-blue-500/5 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <span className="text-xs font-medium text-slate-500 bg-blue-50 px-2 py-1 rounded-full">
                This Month
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">0</p>
            <p className="text-sm text-slate-500">Sessions Completed</p>
          </div>
        </div>

        {/* Upcoming Sessions Section */}
        {upcomingBookings.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  Upcoming Sessions
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Your confirmed mentorship sessions
                </p>
              </div>
              <Link
                href="/user-dashboard/bookings"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="rounded-xl border border-slate-200 bg-white shadow-md shadow-blue-500/5 p-6 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      <span className="text-sm font-medium text-blue-600">
                        Confirmed
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {booking.duration} min
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {booking.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      {new Date(booking.scheduledDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {new Date(booking.scheduledDate).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="w-4 h-4 text-blue-500" />
                      {booking.mentorId.name}
                    </div>
                  </div>

                  {booking.meetingLink && (
                    <a
                      href={booking.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Join Meeting
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Section */}
        <div id="services-section" className="mb-8 scroll-mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Book a Session</h2>
              <p className="text-slate-500 text-sm mt-0.5">Pick a service and choose your slot</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex rounded-2xl overflow-hidden h-36">
                  <div className="w-56 bg-slate-200 shrink-0" />
                  <div className="flex-1 bg-white border border-slate-100 p-5 space-y-3">
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 bg-white">
              <Zap className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 text-sm">No services available yet. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service, idx) => {
                const pricing = getDiscountedPrice(service);
                const hasDiscount = service.discount?.isActive && service.discount.type !== "none";
                const discountedWithGst = Math.round(pricing.discounted * 1.18);
                const originalWithGst  = Math.round(pricing.original * 1.18);
                const gstAmount        = Math.round(pricing.discounted * 0.18);

                const palettes = [
                  { dark: "from-blue-900 to-blue-800",   light: "text-blue-200",  btn: "bg-white text-blue-800 hover:bg-blue-50",  check: "text-blue-300" },
                  { dark: "from-violet-900 to-violet-800", light: "text-violet-200", btn: "bg-white text-violet-800 hover:bg-violet-50", check: "text-violet-300" },
                  { dark: "from-emerald-900 to-emerald-800", light: "text-emerald-200", btn: "bg-white text-emerald-800 hover:bg-emerald-50", check: "text-emerald-300" },
                  { dark: "from-amber-900 to-amber-800",  light: "text-amber-200",  btn: "bg-white text-amber-800 hover:bg-amber-50",  check: "text-amber-300" },
                ];
                const p = palettes[idx % palettes.length];

                return (
                  <div key={service.id} className="group flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">

                    {/* LEFT — dark panel */}
                    <div className={`bg-gradient-to-br ${p.dark} p-5 sm:w-64 shrink-0 flex flex-col justify-between`}>
                      <div>
                        {/* Name + badge */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-white font-bold text-base leading-snug">{service.name}</h3>
                          {hasDiscount && (
                            <span className="shrink-0 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                              {service.discount?.type === "percentage" ? `−${service.discount.value}%` : `−₹${service.discount?.value}`}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs ${p.light} leading-relaxed mb-3`}>{service.title}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white text-[11px]`}>
                            <Clock className="w-3 h-3" />{service.duration}
                          </span>
                          {service.level && <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[11px]">{service.level}</span>}
                          {service.support && <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[11px]">{service.support}</span>}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT — white panel */}
                    <div className="flex-1 bg-white border border-l-0 border-slate-200 group-hover:border-slate-300 transition-colors p-5 flex flex-col sm:flex-row gap-5">

                      {/* Features */}
                      {service.points?.length > 0 && (
                        <ul className="flex-1 space-y-2 self-start">
                          {service.points.slice(0, 4).map((pt, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                              <svg className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${p.check.replace("text-", "text-").replace("-300", "-500")}`} fill="none" viewBox="0 0 10 8">
                                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M1 4l2.5 2.5L9 1"/>
                              </svg>
                              {pt}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Price waterfall + CTA */}
                      <div className="sm:w-44 shrink-0 flex flex-col justify-between gap-4">
                        <div className="space-y-1.5">
                          {/* Original */}
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Original</span>
                            <span className={hasDiscount ? "line-through" : "font-semibold text-slate-700"}>₹{pricing.original}</span>
                          </div>
                          {/* Discount */}
                          {hasDiscount && (
                            <div className="flex items-center justify-between text-xs text-emerald-600">
                              <span>Discount</span>
                              <span className="font-semibold">− ₹{pricing.saving}</span>
                            </div>
                          )}
                          {/* After discount */}
                          {hasDiscount && (
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span>After discount</span>
                              <span className="font-semibold">₹{pricing.discounted}</span>
                            </div>
                          )}
                          {/* GST line */}
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>GST (18%)</span>
                            <span>+ ₹{gstAmount}</span>
                          </div>
                          {/* Divider */}
                          <div className="border-t border-slate-200 pt-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-500">Total payable</span>
                              <span className="text-lg font-black text-slate-900">₹{discountedWithGst}</span>
                            </div>
                            {hasDiscount && (
                              <p className="text-[10px] text-emerald-600 font-medium text-right">
                                You save ₹{originalWithGst - discountedWithGst}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => router.push(`/select-slot?serviceId=${service.id}`)}
                          className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r ${p.dark} text-white text-xs font-bold hover:opacity-90 transition-opacity`}
                        >
                          Book Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
