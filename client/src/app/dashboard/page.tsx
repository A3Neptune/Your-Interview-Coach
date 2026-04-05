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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                All Available Services
              </h2>
              <p className="text-slate-600 text-base">
                Choose from our comprehensive range of mentorship services
              </p>
            </div>
          </div>

          {services.length === 0 ? (
            <div className="col-span-full text-center py-16 px-4 rounded-2xl border border-slate-200 bg-white shadow-md">
              <Zap className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No Services Available
              </h3>
              <p className="text-slate-600 mb-6">
                Check back soon for available mentorship services
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const pricing = getDiscountedPrice(service);
                const hasDiscount =
                  service.discount?.isActive &&
                  service.discount.type !== "none";

                return (
                  <button
                    key={service.id}
                    onClick={() => {
                      window.location.href = `/select-slot?serviceId=${service.id}`;
                    }}
                    className="group relative text-left rounded-2xl border border-slate-200 bg-white shadow-lg shadow-blue-500/5 p-8 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden hover:scale-[1.03]"
                  >
                    {/* Enhanced Discount Badge - Eye Catching */}
                    {hasDiscount && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <style>{`
                        @keyframes pulse-discount-badge {
                          0%, 100% {
                            transform: scale(1);
                            box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
                          }
                          50% {
                            transform: scale(1.08);
                            box-shadow: 0 0 30px rgba(239, 68, 68, 0.8);
                          }
                        }
                        .badge-pulse {
                          animation: pulse-discount-badge 2s ease-in-out infinite;
                        }
                      `}</style>
                        <div className="badge-pulse w-20 h-20 relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 p-1 shadow-2xl shadow-red-600/60">
                            <div className="h-full w-full rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex flex-col items-center justify-center text-center p-1">
                              <div className="text-xs font-bold text-white uppercase tracking-wider leading-none">
                                {service.discount?.type === "percentage"
                                  ? "Save"
                                  : "Deal"}
                              </div>
                              <div className="text-lg font-black text-white leading-none">
                                {service.discount?.type === "percentage"
                                  ? `${service.discount?.value}%`
                                  : `₹${service.discount?.value}`}
                              </div>
                              <div className="text-xs font-bold text-red-100 leading-none">
                                OFF
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-500/30">
                        <Zap className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                        {service.name}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {service.title}
                      </p>
                    </div>

                    {/* Pricing - Enhanced */}
                    <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200">
                      {hasDiscount ? (
                        <div className="space-y-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                              ₹{pricing.discounted}
                            </span>
                            <span className="text-sm text-slate-500 line-through">
                              ₹{pricing.original}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300">
                            <span className="text-xs font-semibold text-emerald-700">
                              Save ₹{pricing.saving}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold text-slate-900">
                          ₹{pricing.original}
                        </span>
                      )}
                      <p className="text-sm text-slate-600 mt-2">/session</p>
                    </div>

                    {/* Quick Info */}
                    <div className="space-y-3 text-sm mb-6">
                      <div className="flex items-center gap-3 text-slate-700">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-700">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                          <Zap className="w-4 h-4 text-blue-600" />
                        </div>
                        <span>{service.level}</span>
                      </div>
                    </div>

                    {/* CTA Button - Enhanced */}
                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between text-base font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                        <span>Book Now</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
