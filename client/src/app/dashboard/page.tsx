// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   BarChart3,
//   Calendar,
//   ArrowRight,
//   Clock,
//   Zap,
//   User,
//   ExternalLink,
// } from "lucide-react";
// import { authAPI, getAuthToken, removeAuthToken } from "@/lib/api";
// import axios from "axios";

// interface UserData {
//   _id: string;
//   name: string;
//   email: string;
//   mobile: string;
//   userType: "student" | "professional" | "admin";
//   profileImage?: string;
//   bio?: string;
//   yearOfStudy?: number;
//   company?: string;
//   designation?: string;
//   yearsOfExperience?: number;
//   skills?: string[];
//   googleId?: string;
// }

// interface Service {
//   id: string;
//   name: string;
//   price: number;
//   duration: string;
//   title: string;
//   value: string;
//   points: string[];
//   level: string;
//   support: string;
//   access: string;
//   discount?: {
//     type: "percentage" | "fixed" | "none";
//     value: number;
//     isActive: boolean;
//   };
// }

// interface Booking {
//   _id: string;
//   title: string;
//   scheduledDate: string;
//   duration: number;
//   status: string;
//   meetingLink?: string;
//   mentorId: {
//     name: string;
//     email: string;
//   };
// }

// export default function DashboardPage() {
//   const router = useRouter();
//   const [user, setUser] = useState<UserData | null>(null);
//   const [services, setServices] = useState<Service[]>([]);
//   const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
//   const [now, setNow] = useState(() => new Date());
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = getAuthToken();
//         if (!token) {
//           router.push("/login");
//           return;
//         }

//         const response = await authAPI.getCurrentUser();
//         const userData = response.data.user;

//         // Redirect admin users to mentor dashboard
//         if (userData.userType === "admin") {
//           router.push("/mentor-dashboard");
//           return;
//         }

//         setUser(userData);

//         const API_URL =
//           process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

//         // Fetch services from pricing section
//         const servicesRes = await axios.get(
//           `${API_URL}/pricing-section/public`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           },
//         );
//         setServices(servicesRes.data.services || []);

//         // Fetch upcoming bookings
//         try {
//           const bookingsRes = await axios.get(`${API_URL}/bookings/student`, {
//             headers: { Authorization: `Bearer ${token}` },
//             withCredentials: true,
//           });
//           const upcoming = (bookingsRes.data.bookings || [])
//             .filter(
//               (b: Booking) =>
//                 b.status === "confirmed" &&
//                 new Date(b.scheduledDate) > new Date(),
//             )
//             .sort(
//               (a: Booking, b: Booking) =>
//                 new Date(a.scheduledDate).getTime() -
//                 new Date(b.scheduledDate).getTime(),
//             )
//             .slice(0, 3);
//           setUpcomingBookings(upcoming);
//         } catch (err) {
//         }
//       } catch (err: any) {
//         removeAuthToken();
//         router.push("/login");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [router]);

//   // Tick every 30 s so join-button visibility and session expiry stay current
//   useEffect(() => {
//     const id = setInterval(() => setNow(new Date()), 30_000);
//     return () => clearInterval(id);
//   }, []);

//   // Mark a booking completed via API and remove it from local list
//   const markCompleted = useCallback(async (bookingId: string) => {
//     try {
//       const token = getAuthToken();
//       const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
//       await axios.put(
//         `${API_URL}/bookings/${bookingId}/status`,
//         { status: "completed" },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//     } catch {
//       // fail silently — UI already hides the card
//     }
//     setUpcomingBookings((prev) => prev.filter((b) => b._id !== bookingId));
//   }, []);

//   // Returns per-booking timing state
//   const getSessionState = useCallback((booking: Booking) => {
//     const start = new Date(booking.scheduledDate).getTime();
//     const end   = start + booking.duration * 60_000;
//     const ms    = now.getTime();
//     return {
//       showJoin:   ms >= start - 10 * 60_000 && ms < end,
//       isExpired:  ms >= end,
//     };
//   }, [now]);

//   const getInitials = () => {
//     if (!user?.name) return "U";
//     return user.name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   const getDiscountedPrice = (service: Service) => {
//     if (!service.discount?.isActive || service.discount.type === "none") {
//       return { original: service.price, discounted: service.price, saving: 0 };
//     }

//     let saving = 0;
//     if (service.discount.type === "percentage") {
//       saving = (service.price * service.discount.value) / 100;
//     } else {
//       saving = service.discount.value;
//     }

//     return {
//       original: service.price,
//       discounted: Math.max(0, service.price - saving),
//       saving: Math.round(saving),
//     };
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600" />
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600 mb-4">Redirecting to login...</p>
//           <Link
//             href="/login"
//             className="text-blue-600 hover:text-blue-700 font-medium"
//           >
//             Back to Login
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       {/* Hero Banner */}
//       <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
//         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
//         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
//             <div>
//               <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
//                 Welcome back, {user.name.split(" ")[0]}! 👋
//               </h1>
//               <p className="text-blue-100 text-base sm:text-lg">
//                 {user.userType === "student"
//                   ? "Ready to accelerate your career growth?"
//                   : "Continue making an impact today."}
//               </p>
//             </div>
//             <button
//               onClick={() =>
//                 document
//                   .getElementById("services-section")
//                   ?.scrollIntoView({ behavior: "smooth" })
//               }
//               className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
//             >
//               <Zap className="w-5 h-5" />
//               Browse Services
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12">
//         {/* Quick Stats Grid */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//           {/* Profile Card */}
//           <div className="col-span-2 lg:col-span-1 rounded-2xl border border-slate-200 bg-white shadow-md shadow-blue-500/5 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
//             <div className="flex items-center gap-4">
//               {user.profileImage ? (
//                 <img
//                   src={user.profileImage}
//                   alt={user.name}
//                   className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
//                 />
//               ) : (
//                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
//                   <span className="text-2xl font-bold text-white">
//                     {getInitials()}
//                   </span>
//                 </div>
//               )}
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-bold text-slate-900 truncate">
//                   {user.name}
//                 </h3>
//                 <p className="text-sm text-slate-500 truncate">{user.email}</p>
//                 <Link
//                   href="/dashboard/profile"
//                   className="text-xs text-blue-600 hover:text-blue-700 font-medium"
//                 >
//                   View Profile →
//                 </Link>
//               </div>
//             </div>
//           </div>

//           {/* Sessions Stat */}
//           <div className="rounded-2xl border border-slate-200 bg-white shadow-md shadow-blue-500/5 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
//             <div className="flex items-center justify-between mb-3">
//               <BarChart3 className="w-8 h-8 text-blue-600" />
//               <span className="text-xs font-medium text-slate-500 bg-blue-50 px-2 py-1 rounded-full">
//                 This Month
//               </span>
//             </div>
//             <p className="text-3xl font-bold text-slate-900">0</p>
//             <p className="text-sm text-slate-500">Sessions Completed</p>
//           </div>
//         </div>

//         {/* Upcoming Sessions Section */}
//         {upcomingBookings.filter((b) => !getSessionState(b).isExpired).length > 0 && (
//           <div className="mb-12">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h2 className="text-3xl font-bold text-slate-900">
//                   Upcoming Sessions
//                 </h2>
//                 <p className="text-slate-600 text-sm mt-1">
//                   Your confirmed mentorship sessions
//                 </p>
//               </div>
//               <Link
//                 href="/user-dashboard/bookings"
//                 className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
//               >
//                 View All
//                 <ArrowRight className="w-4 h-4" />
//               </Link>
//             </div>

//             <div className="grid md:grid-cols-3 gap-6">
//               {upcomingBookings.map((booking) => {
//                 const { showJoin, isExpired } = getSessionState(booking);
//                 if (isExpired) {
//                   // Fire-and-forget mark-completed on next tick so render isn't blocked
//                   setTimeout(() => markCompleted(booking._id), 0);
//                   return null;
//                 }
//                 return (
//                   <div
//                     key={booking._id}
//                     className="rounded-xl border border-slate-200 bg-white shadow-md shadow-blue-500/5 p-6 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300"
//                   >
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex items-center gap-2">
//                         <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
//                         <span className="text-sm font-medium text-blue-600">Confirmed</span>
//                       </div>
//                       <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
//                         {booking.duration} mins
//                       </div>
//                     </div>

//                     <h3 className="text-lg font-bold text-slate-900 mb-2">{booking.title}</h3>

//                     <div className="space-y-2 mb-4">
//                       <div className="flex items-center gap-2 text-sm text-slate-600">
//                         <Calendar className="w-4 h-4 text-blue-500" />
//                         {new Date(booking.scheduledDate).toLocaleDateString("en-US", {
//                           weekday: "short", month: "short", day: "numeric", year: "numeric",
//                         })}
//                       </div>
//                       <div className="flex items-center gap-2 text-sm text-slate-600">
//                         <Clock className="w-4 h-4 text-blue-500" />
//                         {new Date(booking.scheduledDate).toLocaleTimeString("en-US", {
//                           hour: "2-digit", minute: "2-digit",
//                         })}
//                       </div>
//                       <div className="flex items-center gap-2 text-sm text-slate-600">
//                         <User className="w-4 h-4 text-blue-500" />
//                         {booking.mentorId.name}
//                       </div>
//                     </div>

//                     {showJoin && booking.meetingLink ? (
//                       <a
//                         href={booking.meetingLink}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
//                       >
//                         <ExternalLink className="w-4 h-4" />
//                         Join Meeting
//                       </a>
//                     ) : !showJoin ? (
//                       <div className="w-full py-2 px-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 text-xs text-center">
//                         Join link available 10 min before session
//                       </div>
//                     ) : null}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Services Section */}
//         <div id="services-section" className="mb-8 scroll-mt-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-2xl font-bold text-slate-900">Book a Session</h2>
//               <p className="text-slate-500 text-sm mt-0.5">Pick a service and choose your slot</p>
//             </div>
//           </div>

//           {isLoading ? (
//             <div className="space-y-3">
//               {[1, 2, 3].map(i => (
//                 <div key={i} className="animate-pulse flex rounded-2xl overflow-hidden h-36">
//                   <div className="w-56 bg-slate-200 shrink-0" />
//                   <div className="flex-1 bg-white border border-slate-100 p-5 space-y-3">
//                     <div className="h-3 bg-slate-100 rounded w-2/3" />
//                     <div className="h-3 bg-slate-100 rounded w-1/2" />
//                     <div className="h-3 bg-slate-100 rounded w-1/3" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : services.length === 0 ? (
//             <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 bg-white">
//               <Zap className="w-10 h-10 mx-auto mb-3 text-slate-300" />
//               <p className="text-slate-500 text-sm">No services available yet. Check back soon.</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {services.map((service, idx) => {
//                 const pricing = getDiscountedPrice(service);
//                 const hasDiscount = service.discount?.isActive && service.discount.type !== "none";
//                 const discountedWithGst = Math.round(pricing.discounted * 1.18);
//                 const originalWithGst  = Math.round(pricing.original * 1.18);
//                 const gstAmount        = Math.round(pricing.discounted * 0.18);

//                 const palettes = [
//                   { dark: "from-blue-900 to-blue-800",   light: "text-blue-200",  btn: "bg-white text-blue-800 hover:bg-blue-50",  check: "text-blue-300" },
//                   { dark: "from-violet-900 to-violet-800", light: "text-violet-200", btn: "bg-white text-violet-800 hover:bg-violet-50", check: "text-violet-300" },
//                   { dark: "from-emerald-900 to-emerald-800", light: "text-emerald-200", btn: "bg-white text-emerald-800 hover:bg-emerald-50", check: "text-emerald-300" },
//                   { dark: "from-amber-900 to-amber-800",  light: "text-amber-200",  btn: "bg-white text-amber-800 hover:bg-amber-50",  check: "text-amber-300" },
//                 ];
//                 const p = palettes[idx % palettes.length];

//                 return (
//                   <div key={service.id} className="group flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">

//                     {/* LEFT — dark panel */}
//                     <div className={`bg-gradient-to-br ${p.dark} p-5 sm:w-64 shrink-0 flex flex-col justify-between`}>
//                       <div>
//                         {/* Name + badge */}
//                         <div className="flex items-start justify-between gap-2 mb-2">
//                           <h3 className="text-white font-bold text-base leading-snug">{service.name}</h3>
//                           {hasDiscount && (
//                             <span className="shrink-0 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
//                               {service.discount?.type === "percentage" ? `−${service.discount.value}%` : `−₹${service.discount?.value}`}
//                             </span>
//                           )}
//                         </div>
//                         <p className={`text-xs ${p.light} leading-relaxed mb-3`}>{service.title}</p>

//                         {/* Tags */}
//                         <div className="flex flex-wrap gap-1.5">
//                           <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white text-[11px]`}>
//                             <Clock className="w-3 h-3" />{service.duration}
//                           </span>
//                           {service.level && <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[11px]">{service.level}</span>}
//                           {service.support && <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[11px]">{service.support}</span>}
//                         </div>
//                       </div>
//                     </div>

//                     {/* RIGHT — white panel */}
//                     <div className="flex-1 bg-white border border-l-0 border-slate-200 group-hover:border-slate-300 transition-colors p-5 flex flex-col sm:flex-row gap-5">

//                       {/* Features */}
//                       {service.points?.length > 0 && (
//                         <ul className="flex-1 space-y-2 self-start">
//                           {service.points.slice(0, 4).map((pt, i) => (
//                             <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
//                               <svg className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${p.check.replace("text-", "text-").replace("-300", "-500")}`} fill="none" viewBox="0 0 10 8">
//                                 <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M1 4l2.5 2.5L9 1"/>
//                               </svg>
//                               {pt}
//                             </li>
//                           ))}
//                         </ul>
//                       )}

//                       {/* Price waterfall + CTA */}
//                       <div className="sm:w-44 shrink-0 flex flex-col justify-between gap-4">
//                         <div className="space-y-1.5">
//                           {/* Original */}
//                           <div className="flex items-center justify-between text-xs text-slate-400">
//                             <span>Original</span>
//                             <span className={hasDiscount ? "line-through" : "font-semibold text-slate-700"}>₹{pricing.original}</span>
//                           </div>
//                           {/* Discount */}
//                           {hasDiscount && (
//                             <div className="flex items-center justify-between text-xs text-emerald-600">
//                               <span>Discount</span>
//                               <span className="font-semibold">− ₹{pricing.saving}</span>
//                             </div>
//                           )}
//                           {/* After discount */}
//                           {hasDiscount && (
//                             <div className="flex items-center justify-between text-xs text-slate-600">
//                               <span>After discount</span>
//                               <span className="font-semibold">₹{pricing.discounted}</span>
//                             </div>
//                           )}
//                           {/* GST line */}
//                           <div className="flex items-center justify-between text-xs text-slate-400">
//                             <span>GST (18%)</span>
//                             <span>+ ₹{gstAmount}</span>
//                           </div>
//                           {/* Divider */}
//                           <div className="border-t border-slate-200 pt-1.5">
//                             <div className="flex items-center justify-between">
//                               <span className="text-xs font-semibold text-slate-500">Total payable</span>
//                               <span className="text-lg font-black text-slate-900">₹{discountedWithGst}</span>
//                             </div>
//                             {hasDiscount && (
//                               <p className="text-[10px] text-emerald-600 font-medium text-right">
//                                 You save ₹{originalWithGst - discountedWithGst}
//                               </p>
//                             )}
//                           </div>
//                         </div>

//                         <button
//                           onClick={() => router.push(`/select-slot?serviceId=${service.id}`)}
//                           className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r ${p.dark} text-white text-xs font-bold hover:opacity-90 transition-opacity`}
//                         >
//                           Book Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  Sparkles,
  ChevronRight,
  Star,
} from "lucide-react";
import { authAPI, getAuthToken, removeAuthToken } from "@/lib/api";
import axios from "axios";

/* ─── Types ──────────────────────────────────────────────── */
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
  mentorId: { name: string; email: string };
}

/* ─── Skeleton components ─────────────────────────────────── */
function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-slate-100 ${className}`}
      style={{ background: "linear-gradient(90deg,#e8e8e8 25%,#f5f5f5 50%,#e8e8e8 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.6s infinite" }}
    />
  );
}

function HeroSkeleton() {
  return (
    <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)", minHeight: 220 }}>
      <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-3">
          <Shimmer className="h-10 w-72 rounded-lg" />
          <Shimmer className="h-5 w-48 rounded-lg" />
        </div>
        <Shimmer className="h-12 w-40 rounded-xl" />
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ${i === 0 ? "col-span-2 lg:col-span-1" : ""}`}>
          <div className="flex items-center gap-4">
            <Shimmer className="w-14 h-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-4 w-3/4 rounded" />
              <Shimmer className="h-3 w-1/2 rounded" />
              <Shimmer className="h-3 w-1/3 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BookingsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Shimmer className="h-8 w-56 rounded-lg" />
        <Shimmer className="h-5 w-20 rounded" />
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <Shimmer className="h-4 w-1/3 rounded" />
            <Shimmer className="h-6 w-2/3 rounded-lg" />
            <div className="space-y-2">
              <Shimmer className="h-4 w-full rounded" />
              <Shimmer className="h-4 w-3/4 rounded" />
              <Shimmer className="h-4 w-1/2 rounded" />
            </div>
            <Shimmer className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
      <Shimmer className="sm:w-64 h-40 sm:h-auto shrink-0 rounded-none" />
      <div className="flex-1 bg-white p-6 space-y-4">
        <Shimmer className="h-4 w-2/3 rounded" />
        <Shimmer className="h-4 w-1/2 rounded" />
        <Shimmer className="h-4 w-3/4 rounded" />
        <div className="flex justify-end">
          <Shimmer className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser]                     = useState<UserData | null>(null);
  const [services, setServices]             = useState<Service[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [now, setNow]                       = useState(() => new Date());
  const [isLoading, setIsLoading]           = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [visibleServices, setVisibleServices] = useState<Set<number>>(new Set());
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ── Fetch user + data ─────────────────────────── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        if (!token) { router.push("/login"); return; }

        const response = await authAPI.getCurrentUser();
        const userData = response.data.user;
        if (userData.userType === "admin") { router.push("/mentor-dashboard"); return; }
        setUser(userData);
        setIsLoading(false);

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

        /* services (lazy) */
        axios
          .get(`${API_URL}/pricing-section/public`, { headers: { Authorization: `Bearer ${token}` } })
          .then((r) => { setServices(r.data.services || []); setServicesLoading(false); })
          .catch(() => setServicesLoading(false));

        /* bookings */
        axios
          .get(`${API_URL}/bookings/student`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
          .then((r) => {
            const upcoming = (r.data.bookings || [])
              .filter((b: Booking) => b.status === "confirmed" && new Date(b.scheduledDate) > new Date())
              .sort((a: Booking, b: Booking) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
              .slice(0, 3);
            setUpcomingBookings(upcoming);
          })
          .catch(() => {})
          .finally(() => setBookingsLoading(false));
      } catch {
        removeAuthToken();
        router.push("/login");
      }
    };
    fetchData();
  }, [router]);

  /* ── Tick every 30 s ───────────────────────────── */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  /* ── Intersection Observer for service cards ───── */
  useEffect(() => {
    if (servicesLoading || services.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            setVisibleServices((prev) => new Set([...prev, idx]));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    serviceRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [services, servicesLoading]);

  /* ── Helpers ───────────────────────────────────── */
  const markCompleted = useCallback(async (bookingId: string) => {
    try {
      const token = getAuthToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await axios.put(`${API_URL}/bookings/${bookingId}/status`, { status: "completed" }, { headers: { Authorization: `Bearer ${token}` } });
    } catch {}
    setUpcomingBookings((prev) => prev.filter((b) => b._id !== bookingId));
  }, []);

  const getSessionState = useCallback((booking: Booking) => {
    const start = new Date(booking.scheduledDate).getTime();
    const end   = start + booking.duration * 60_000;
    const ms    = now.getTime();
    return { showJoin: ms >= start - 10 * 60_000 && ms < end, isExpired: ms >= end };
  }, [now]);

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

  /* ── Palette config ─────────────────────────────── */
  const palettes = [
    { grad: "from-[#0f172a] to-[#1e3a5f]", accent: "#3b82f6",   tag: "bg-blue-500/20 text-blue-300",   glow: "rgba(59,130,246,0.15)"  },
    { grad: "from-[#170f29] to-[#2e1065]", accent: "#a855f7",   tag: "bg-purple-500/20 text-purple-300", glow: "rgba(168,85,247,0.15)" },
    { grad: "from-[#052e16] to-[#14532d]", accent: "#22c55e",   tag: "bg-green-500/20 text-green-300",  glow: "rgba(34,197,94,0.15)"   },
    { grad: "from-[#27150a] to-[#431407]", accent: "#f97316",   tag: "bg-orange-500/20 text-orange-300", glow: "rgba(249,115,22,0.15)" },
  ];

  /* ── Full-page spinner (first paint only) ─────── */
  if (isLoading) {
    return (
      <>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <HeroSkeleton />
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
          <StatsSkeleton />
          <BookingsSkeleton />
          <div className="space-y-4">{[1,2,3].map(i=><ServiceCardSkeleton key={i}/>)}</div>
        </div>
      </>
    );
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500">Redirecting… <Link href="/login" className="text-blue-600 underline">Login</Link></p>
    </div>
  );

  const activeBookings = upcomingBookings.filter((b) => !getSessionState(b).isExpired);

  return (
    <>
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600;700&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn    { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        @keyframes pulse-ring  { 0%{box-shadow:0 0 0 0 rgba(59,130,246,.4)} 70%{box-shadow:0 0 0 8px rgba(59,130,246,0)} 100%{box-shadow:0 0 0 0 rgba(59,130,246,0)} }

        body { font-family:'Manrope',sans-serif; background:#f6f8fc; }

        .card-hover { transition:transform .25s ease,box-shadow .25s ease; }
        .card-hover:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(0,0,0,.08); }

        .service-card { transition:opacity .5s ease,transform .5s ease; opacity:0; transform:translateY(24px); }
        .service-card.visible { opacity:1; transform:translateY(0); }

        .join-btn { animation:pulse-ring 2s infinite; }
        .hero-text { font-family:'Syne',sans-serif; }

        .shimmer-bg { background:linear-gradient(90deg,#e8eaf0 25%,#f5f7fc 50%,#e8eaf0 75%); background-size:200% 100%; animation:shimmer 1.6s infinite; }
      `}</style>

      {/* ══ Hero ══════════════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#0f172a 0%,#0c2340 55%,#0f3460 100%)",
          animation: "scaleIn .5s ease",
        }}
      >
        {/* Mesh blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position:"absolute",top:"-30%",right:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,.25) 0%,transparent 70%)" }} />
          <div style={{ position:"absolute",bottom:"-40%",left:"5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,.15) 0%,transparent 70%)" }} />
          <div style={{ position:"absolute",top:"20%",left:"30%",width:600,height:2,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-18">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div style={{ animation:"fadeSlideUp .5s ease" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-4">
                <Sparkles className="w-3 h-3" />
                {user.userType === "student" ? "Student Dashboard" : "Professional Dashboard"}
              </div>
              <h1 className="hero-text text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-2">
                Hey, {user.name.split(" ")[0]}! 👋
              </h1>
              <p className="text-blue-200/80 text-base sm:text-lg max-w-md">
                {user.userType === "student"
                  ? "Your next career leap starts with the right mentor."
                  : "Continue making an impact today."}
              </p>
            </div>
            <div style={{ animation:"fadeSlideUp .55s ease" }}>
              <button
                onClick={() => document.getElementById("services-section")?.scrollIntoView({ behavior:"smooth" })}
                className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm overflow-hidden"
                style={{ background:"linear-gradient(135deg,#3b82f6,#6366f1)", color:"#fff", boxShadow:"0 8px 30px rgba(59,130,246,.4)" }}
              >
                <Zap className="w-4 h-4" />
                Browse Services
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">

        {/* ══ Stats Row ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" style={{ animation:"fadeSlideUp .6s ease" }}>

          {/* Profile */}
          <div className="col-span-2 lg:col-span-1 rounded-2xl bg-white border border-slate-100 shadow-sm p-5 card-hover">
            <div className="flex items-center gap-4">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-100" />
              ) : (
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-white text-xl"
                  style={{ background:"linear-gradient(135deg,#3b82f6,#6366f1)", boxShadow:"0 4px 14px rgba(99,102,241,.35)" }}>
                  {getInitials()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-sm truncate">{user.name}</h3>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                <Link href="/dashboard/profile" className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-700">
                  View Profile <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Sessions */}
          <StatCard
            icon={<BarChart3 className="w-5 h-5" style={{ color:"#3b82f6" }} />}
            color="#3b82f6"
            label="Sessions Completed"
            value="0"
            badge="This Month"
          />

          {/* Upcoming */}
          <StatCard
            icon={<Calendar className="w-5 h-5" style={{ color:"#a855f7" }} />}
            color="#a855f7"
            label="Upcoming Sessions"
            value={String(activeBookings.length)}
            badge="Confirmed"
          />

          {/* Quick action */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 card-hover cursor-pointer shadow-sm"
            onClick={() => document.getElementById("services-section")?.scrollIntoView({ behavior:"smooth" })}>
            <div className="flex flex-col h-full justify-between">
              <Star className="w-6 h-6 text-white/70" />
              <div className="mt-6">
                <p className="text-white font-bold text-sm">Book a Session</p>
                <p className="text-blue-100 text-xs mt-0.5">Explore all services →</p>
              </div>
            </div>
          </div>
        </div>

        {/* ══ Upcoming Sessions ════════════════════════════════════ */}
        {bookingsLoading ? (
          <BookingsSkeleton />
        ) : activeBookings.length > 0 && (
          <section style={{ animation:"fadeSlideUp .7s ease" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="hero-text text-2xl font-extrabold text-slate-900">Upcoming Sessions</h2>
                <p className="text-slate-400 text-sm mt-0.5">Your confirmed mentorship sessions</p>
              </div>
              <Link href="/user-dashboard/bookings" className="inline-flex items-center gap-1 text-sm text-blue-600 font-semibold hover:text-blue-700">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {upcomingBookings.map((booking, i) => {
                const { showJoin, isExpired } = getSessionState(booking);
                if (isExpired) { setTimeout(() => markCompleted(booking._id), 0); return null; }
                return (
                  <div
                    key={booking._id}
                    className="group rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden card-hover"
                    style={{ animationDelay:`${i * 80}ms`, animation:"fadeSlideUp .6s ease both" }}
                  >
                    {/* Top stripe */}
                    <div style={{ height:4, background:"linear-gradient(90deg,#3b82f6,#6366f1)" }} />

                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          Confirmed
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                          {booking.duration} min
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base mb-3 leading-snug">{booking.title}</h3>

                      <div className="space-y-2 mb-4">
                        {[
                          { Icon: Calendar, text: new Date(booking.scheduledDate).toLocaleDateString("en-US",{ weekday:"short",month:"short",day:"numeric",year:"numeric" }) },
                          { Icon: Clock,    text: new Date(booking.scheduledDate).toLocaleTimeString("en-US",{ hour:"2-digit",minute:"2-digit" }) },
                          { Icon: User,     text: booking.mentorId.name },
                        ].map(({ Icon, text }, j) => (
                          <div key={j} className="flex items-center gap-2 text-xs text-slate-500">
                            <Icon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            {text}
                          </div>
                        ))}
                      </div>

                      {showJoin && booking.meetingLink ? (
                        <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer"
                          className="join-btn w-full py-2.5 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-2"
                          style={{ background:"linear-gradient(135deg,#3b82f6,#6366f1)" }}>
                          <ExternalLink className="w-3.5 h-3.5" />
                          Join Meeting Now
                        </a>
                      ) : (
                        <div className="w-full py-2.5 rounded-xl border border-dashed border-slate-200 text-slate-400 text-[11px] text-center">
                          Join link active 10 min before
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ══ Services Section ═════════════════════════════════════ */}
        <section id="services-section" className="scroll-mt-6" style={{ animation:"fadeSlideUp .8s ease" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="hero-text text-2xl font-extrabold text-slate-900">Book a Session</h2>
              <p className="text-slate-400 text-sm mt-0.5">Pick a service and choose your slot</p>
            </div>
          </div>

          {servicesLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <ServiceCardSkeleton key={i} />)}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed border-slate-200 bg-white">
              <Zap className="w-10 h-10 mx-auto mb-3 text-slate-200" />
              <p className="text-slate-400 text-sm">No services available yet. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {services.map((service, idx) => {
                const pricing = getDiscountedPrice(service);
                const hasDiscount = service.discount?.isActive && service.discount.type !== "none";
                const discountedWithGst = Math.round(pricing.discounted * 1.18);
                const originalWithGst  = Math.round(pricing.original * 1.18);
                const gstAmount        = Math.round(pricing.discounted * 0.18);
                const pal = palettes[idx % palettes.length];
                const isVisible = visibleServices.has(idx);

                return (
                  <div
                    key={service.id}
                    ref={(el) => { serviceRefs.current[idx] = el; }}
                    data-idx={idx}
                    className={`service-card group flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:border-slate-200 ${isVisible ? "visible" : ""}`}
                    style={{ transitionDelay:`${idx * 60}ms` }}
                  >
                    {/* Left dark panel */}
                    <div
                      className={`bg-gradient-to-br ${pal.grad} sm:w-72 shrink-0 p-6 flex flex-col justify-between gap-5`}
                      style={{ boxShadow:`inset -1px 0 0 rgba(255,255,255,.04)` }}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="hero-text text-white font-bold text-lg leading-tight">{service.name}</h3>
                          {hasDiscount && (
                            <span className="shrink-0 px-2.5 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold tracking-wide">
                              {service.discount?.type === "percentage" ? `−${service.discount.value}%` : `−₹${service.discount?.value}`}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/50 leading-relaxed mb-4">{service.title}</p>

                        <div className="flex flex-wrap gap-2">
                          {service.duration && (
                            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${pal.tag}`}>
                              <Clock className="w-3 h-3" />{service.duration}
                            </span>
                          )}
                          {service.level && (
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${pal.tag}`}>{service.level}</span>
                          )}
                          {service.support && (
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${pal.tag}`}>{service.support}</span>
                          )}
                        </div>
                      </div>

                      {/* Decorative circle */}
                      <div style={{ width:80,height:80,borderRadius:"50%",background:`radial-gradient(circle,${pal.accent}22,transparent)`,border:`1px solid ${pal.accent}30`,alignSelf:"flex-end",marginBottom:-12,marginRight:-12 }} />
                    </div>

                    {/* Right white panel */}
                    <div className="flex-1 bg-white p-6 flex flex-col sm:flex-row gap-6">

                      {/* Features list */}
                      {service.points?.length > 0 && (
                        <ul className="flex-1 space-y-2.5 self-start">
                          {service.points.slice(0, 5).map((pt, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                              <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                                style={{ background:`${pal.accent}18` }}>
                                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                  <path d="M1 3l2 2 4-4" stroke={pal.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </span>
                              {pt}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Pricing waterfall + CTA */}
                      <div className="sm:w-48 shrink-0 flex flex-col justify-between gap-5">
                        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Original</span>
                            <span className={hasDiscount ? "line-through" : "font-bold text-slate-700"}>₹{pricing.original}</span>
                          </div>
                          {hasDiscount && <>
                            <div className="flex justify-between text-xs text-emerald-600">
                              <span>Discount</span>
                              <span className="font-semibold">− ₹{pricing.saving}</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>After discount</span>
                              <span className="font-semibold">₹{pricing.discounted}</span>
                            </div>
                          </>}
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>GST (18%)</span>
                            <span>+ ₹{gstAmount}</span>
                          </div>
                          <div className="border-t border-slate-200 pt-2 mt-1">
                            <div className="flex justify-between items-end">
                              <span className="text-[11px] text-slate-400 font-medium">Total payable</span>
                              <span className="text-xl font-black text-slate-900">₹{discountedWithGst}</span>
                            </div>
                            {hasDiscount && (
                              <p className="text-[10px] text-emerald-600 font-semibold text-right mt-0.5">
                                You save ₹{originalWithGst - discountedWithGst}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => router.push(`/select-slot?serviceId=${service.id}`)}
                          className="w-full group/btn flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[.98]"
                          style={{
                            background:`linear-gradient(135deg,${pal.accent},${pal.accent}cc)`,
                            boxShadow:`0 6px 20px ${pal.glow}`,
                          }}
                        >
                          Book Now
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

/* ─── StatCard helper ─────────────────────────────────────── */
function StatCard({ icon, color, label, value, badge }: {
  icon: React.ReactNode; color: string; label: string; value: string; badge: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:`${color}15` }}>
          {icon}
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border" style={{ color, borderColor:`${color}30`, background:`${color}10` }}>
          {badge}
        </span>
      </div>
      <p className="text-3xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}