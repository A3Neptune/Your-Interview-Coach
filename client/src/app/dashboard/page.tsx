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
  CheckCircle2,
  Sparkles,
  ChevronRight,
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
  isNewGd?: boolean;
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
  mentorId: { name: string; email: string };
}

// ─── Skeleton primitives ────────────────────────────────────────────────────

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-slate-100 rounded-lg ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-3">
      <Shimmer className="h-8 w-8 rounded-xl" />
      <Shimmer className="h-7 w-16" />
      <Shimmer className="h-4 w-28" />
    </div>
  );
}

function ProfileCardSkeleton() {
  return (
    <div className="col-span-2 lg:col-span-1 rounded-2xl border border-slate-100 bg-white p-6">
      <div className="flex items-center gap-4">
        <Shimmer className="w-16 h-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-32" />
          <Shimmer className="h-3 w-40" />
          <Shimmer className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

function BookingCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Shimmer className="h-5 w-24 rounded-full" />
        <Shimmer className="h-5 w-16 rounded-full" />
      </div>
      <Shimmer className="h-6 w-3/4" />
      <div className="space-y-2">
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-2/3" />
      </div>
      <Shimmer className="h-10 w-full rounded-xl" />
    </div>
  );
}

function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white">
      <Shimmer className="h-32 w-full" />
      <div className="p-5 space-y-3">
        <Shimmer className="h-4 w-3/4" />
        <Shimmer className="h-3 w-1/2" />
        <div className="pt-4 space-y-2">
          <Shimmer className="h-3 w-full" />
          <Shimmer className="h-3 w-full" />
        </div>
        <Shimmer className="h-10 w-full rounded-xl mt-4" />
      </div>
    </div>
  );
}

// ─── Palettes ────────────────────────────────────────────────────────────────

const PALETTES = [
  {
    dark: "from-blue-700 to-blue-900",
    light: "text-blue-200",
    check: "text-blue-500",
    cta: "from-blue-600 to-blue-800",
  },
  {
    dark: "from-violet-700 to-violet-900",
    light: "text-violet-200",
    check: "text-violet-500",
    cta: "from-violet-600 to-violet-800",
  },
  {
    dark: "from-emerald-700 to-emerald-900",
    light: "text-emerald-200",
    check: "text-emerald-500",
    cta: "from-emerald-600 to-emerald-800",
  },
  {
    dark: "from-amber-700 to-amber-900",
    light: "text-amber-200",
    check: "text-amber-500",
    cta: "from-amber-600 to-amber-800",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        if (!token) { router.push("/login"); return; }

        const response = await authAPI.getCurrentUser();
        const userData = response.data.user;

        if (userData.userType === "admin") { router.push("/mentor-dashboard"); return; }

        setUser(userData);

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

        const servicesRes = await axios.get(
          `${API_URL}/pricing-section/public`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const fetchedServices = servicesRes.data.services || [];
        
        // Filter out any GD services from API to avoid duplicates
        const filteredServices = fetchedServices.filter((s: any) => !s.id.toLowerCase().includes("gd"));

        // Add 3 new tiered GD plans manually
        const gdPlans: Service[] = [
          {
            id: "gd-starter",
            name: "GD Starter (4 Members)",
            title: "Small Group Discussion",
            price: 796,
            duration: "60 min",
            points: ["4 Participants", "Expert Feedback", "WhatsApp Support", "1 Session"],
            level: "Starter",
            support: "WhatsApp",
            access: "Single",
            value: "Perfect for focused discussions with your core team.",
            isNewGd: true
          },
          {
            id: "gd-popular",
            name: "GD Popular (6 Members)",
            title: "Realistic Simulation",
            price: 1014,
            duration: "60 min",
            points: ["6 Participants", "Peer Review", "Performance Report", "1 Session"],
            level: "Popular",
            support: "WhatsApp",
            access: "Single",
            value: "Our most popular choice for realistic group simulations.",
            isNewGd: true
          },
          {
            id: "gd-value",
            name: "GD Value (10 Members)",
            title: "Large Team Practice",
            price: 990,
            duration: "60 min",
            points: ["10 Participants", "Live Moderation", "Group Dynamics", "Best Value"],
            level: "Value",
            support: "WhatsApp",
            access: "Single",
            value: "Maximum value for large teams practicing together.",
            isNewGd: true
          }
        ];

        setServices([...filteredServices, ...gdPlans]);

        try {
          const bookingsRes = await axios.get(`${API_URL}/bookings/student`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          const all: Booking[] = bookingsRes.data.bookings || [];
          const upcoming = all
            .filter((b) => b.status === "confirmed" && new Date(b.scheduledDate) > new Date())
            .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
            .slice(0, 3);
          setUpcomingBookings(upcoming);
          setCompletedCount(all.filter((b) => b.status === "completed").length);
        } catch {}
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
    return user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getDiscountedPrice = (service: Service) => {
    if (!service.discount?.isActive || service.discount.type === "none")
      return { original: service.price, discounted: service.price, saving: 0 };
    const saving = service.discount.type === "percentage"
      ? (service.price * service.discount.value) / 100
      : service.discount.value;
    return { original: service.price, discounted: Math.max(0, service.price - saving), saving: Math.round(saving) };
  };

  if (isLoading && !user) {
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
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=DM+Sans:wght@400;500;700&display=swap");
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}</style>

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
                Welcome back, {user.name.split(" ")[0]}! 👋
              </h1>
              <p className="text-blue-100 text-base sm:text-lg">
                {user.userType === "student"
                  ? "Ready to accelerate your career growth?"
                  : "Continue making an impact today."}
              </p>
            </div>
            <button
              onClick={() => document.getElementById("services-section")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 text-sm"
            >
              <Zap className="w-4 h-4" />
              Browse Services
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">

        {/* ── Quick Stats Grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading ? <ProfileCardSkeleton /> : (
            <div className="col-span-2 lg:col-span-1 rounded-2xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-50" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                    <span className="text-xl font-bold text-white">{getInitials()}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate text-sm">{user.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  <Link href="/dashboard/profile" className="text-[10px] text-blue-600 hover:text-blue-700 font-bold uppercase tracking-wider mt-1 inline-block">
                    Edit Profile →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {isLoading ? <StatCardSkeleton /> : (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{completedCount}</p>
              <p className="text-xs text-slate-500 mt-1">Sessions finished</p>
            </div>
          )}

          {isLoading ? <StatCardSkeleton /> : (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upcoming</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{upcomingBookings.length}</p>
              <p className="text-xs text-slate-500 mt-1">Confirmed slots</p>
            </div>
          )}
        </div>

        {/* ── Upcoming Sessions ──────────────────────────────────────────── */}
        {upcomingBookings.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>Upcoming Sessions</h2>
                <p className="text-slate-500 text-sm">Your confirmed mentorship slots</p>
              </div>
              <Link href="/user-dashboard/bookings" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                VIEW ALL <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {upcomingBookings.map((booking) => (
                <div key={booking._id} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md transition-all flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Confirmed
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">{booking.duration} MIN</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{booking.title}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {new Date(booking.scheduledDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      {new Date(booking.scheduledDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      {booking.mentorId.name}
                    </div>
                  </div>
                  {booking.meetingLink && (
                    <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" className="mt-auto w-full py-2.5 rounded-xl bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                      <ExternalLink className="w-3.5 h-3.5" />
                      JOIN MEETING
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Services Section ───────────────────────────────────────────── */}
        <div id="services-section" className="space-y-8 scroll-mt-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>Book a Session</h2>
            <p className="text-slate-500 text-sm">Pick a service and choose your preferred slot</p>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <ServiceCardSkeleton key={i} />)}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 bg-white">
              <Zap className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 text-sm">No services available yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => {
                const pricing = getDiscountedPrice(service);
                const hasDiscount = service.discount?.isActive && service.discount.type !== "none";
                const totalWithGst = Math.round(pricing.discounted * 1.18);
                const p = PALETTES[idx % PALETTES.length];

                return (
                  <div key={service.id} className="group flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                    {/* Header Panel */}
                    <div className={`bg-gradient-to-br ${p.dark} p-6 flex flex-col gap-4 relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8" />
                      
                      <div className="flex items-start justify-between gap-3 relative z-10">
                        <h3 className="text-white font-bold text-lg leading-tight">{service.name}</h3>
                        {hasDiscount && (
                          <span className="shrink-0 px-2 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-black uppercase tracking-tighter">
                            {service.discount?.type === "percentage" ? `${service.discount.value}% OFF` : `₹${service.discount?.value} OFF`}
                          </span>
                        )}
                      </div>

                      <p className={`text-xs ${p.light} leading-relaxed relative z-10 opacity-90`}>{service.title}</p>

                      <div className="flex flex-wrap gap-2 relative z-10">
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-white text-[10px] font-bold tracking-wide uppercase">
                          <Clock className="w-3 h-3" />{service.duration}
                        </span>
                        {service.level && <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[10px] font-bold tracking-wide uppercase">{service.level}</span>}
                      </div>
                    </div>

                    {/* Content Panel */}
                    <div className="flex-1 p-6 flex flex-col gap-6">
                      <p className="text-xs text-slate-500 leading-relaxed italic">"{service.value}"</p>
                      
                      {service.points?.length > 0 && (
                        <ul className="space-y-2.5 flex-1">
                          {service.points.slice(0, 4).map((pt, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                              <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${p.check}`} />
                              {pt}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Pricing + Action */}
                      <div className="pt-6 border-t border-slate-50 space-y-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Payable</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>₹{totalWithGst}</span>
                              {hasDiscount && <span className="text-xs text-slate-400 line-through">₹{Math.round(service.price * 1.18)}</span>}
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium mt-0.5">Incl. 18% GST</p>
                          </div>
                          
                          <button
                            onClick={() => router.push(`/select-slot?serviceId=${service.id}`)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r ${p.cta} text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95`}
                          >
                            BOOK NOW
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
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