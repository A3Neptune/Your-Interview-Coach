"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BookOpen,
  Eye,
  Globe,
  Calendar as CalendarIcon,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { toast } from 'sonner';
import axios from "axios";

type HomeStatsWindow = { hits: number; unique: number };
type HomeStats = {
  today: HomeStatsWindow;
  week: HomeStatsWindow;
  month: HomeStatsWindow;
  allTime: HomeStatsWindow;
  lastViewAt: string | null;
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [sessionTypes, setSessionTypes] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [homeStats, setHomeStats] = useState<HomeStats | null>(null);
  const [homeStatsLoading, setHomeStatsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
    fetchHomeStats();
  }, []);

  const fetchHomeStats = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("authToken");
      if (!token) {
        setHomeStatsLoading(false);
        return;
      }
      const res = await axios.get(`${API_URL}/analytics/home-stats`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 8000,
      });
      if (res.data?.success) setHomeStats(res.data.stats);
    } catch {
      // non-fatal
    } finally {
      setHomeStatsLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      // Fetch mentor bookings for analytics
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Session expired. Please login again.");
        setIsLoading(false);
        return;
      }

      let bookings = [];
      let allUsers: any[] = [];

      try {
        const [bookingsRes, usersRes] = await Promise.all([
          axios.get(`${API_URL}/bookings/mentor`, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}`, "Cache-Control": "no-cache" },
            timeout: 10000,
          }),
          axios.get(`${API_URL}/auth/all-users`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }),
        ]);
        bookings = bookingsRes.data.bookings || [];
        allUsers = (usersRes.data.users || []).filter((u: any) => u.userType !== 'admin');
      } catch {
        bookings = [];
      }

      // Only count revenue from successfully paid bookings
      const paidBookings = bookings.filter((b: any) => b.paymentStatus === "completed");
      const totalRevenue = paidBookings.reduce((sum: number, b: any) => sum + (b.amount || 0), 0);
      // Real month-over-month comparison
      const now = new Date();
      const completedSessions = bookings.filter(
        (b: any) => b.status === "completed" ||
          (b.status === "confirmed" && new Date(b.scheduledDate).getTime() + (b.duration || 60) * 60000 <= now.getTime())
      ).length;
      const thisMonth = now.getMonth();
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
      const thisYear = now.getFullYear();
      const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

      const thisMonthBookings = bookings.filter((b: any) => {
        const d = new Date(b.scheduledDate);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      });
      const lastMonthBookings = bookings.filter((b: any) => {
        const d = new Date(b.scheduledDate);
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
      });

      const thisMonthRevenue = thisMonthBookings.filter((b: any) => b.paymentStatus === "completed").reduce((s: number, b: any) => s + (b.amount || 0), 0);
      const lastMonthRevenue = lastMonthBookings.filter((b: any) => b.paymentStatus === "completed").reduce((s: number, b: any) => s + (b.amount || 0), 0);
      const revenueChange = lastMonthRevenue > 0
        ? `${thisMonthRevenue >= lastMonthRevenue ? "+" : ""}${Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)}% vs last month`
        : thisMonthRevenue > 0 ? "New this month" : "No data yet";


      const thisMonthCompleted = thisMonthBookings.filter((b: any) => b.status === "completed").length;
      const lastMonthCompleted = lastMonthBookings.filter((b: any) => b.status === "completed").length;
      const sessionChange = thisMonthCompleted === 0 && lastMonthCompleted === 0
        ? "No completed yet"
        : `${thisMonthCompleted >= lastMonthCompleted ? "+" : ""}${thisMonthCompleted - lastMonthCompleted} vs last month`;

      const totalUsers = allUsers.length;
      const studentCount = allUsers.filter((u: any) => u.userType === 'student').length;
      const professionalCount = allUsers.filter((u: any) => u.userType === 'professional').length;

      const newStats = [
        {
          label: "Total Revenue",
          value: `₹${totalRevenue.toLocaleString()}`,
          change: revenueChange,
          isPositive: thisMonthRevenue >= lastMonthRevenue,
          icon: DollarSign,
          bgColor: "from-emerald-500/10 to-teal-500/10",
          borderColor: "border-emerald-500/20",
        },
        {
          label: "Total Users",
          value: totalUsers,
          change: `${studentCount} students · ${professionalCount} professionals`,
          isPositive: true,
          icon: Users,
          bgColor: "from-blue-500/10 to-cyan-500/10",
          borderColor: "border-blue-500/20",
        },
        {
          label: "Sessions Completed",
          value: completedSessions,
          change: sessionChange,
          isPositive: thisMonthCompleted >= lastMonthCompleted,
          icon: BookOpen,
          bgColor: "from-purple-500/10 to-pink-500/10",
          borderColor: "border-purple-500/20",
        },
        {
          label: "Professionals",
          value: professionalCount,
          change: `${studentCount} students registered`,
          isPositive: true,
          icon: Users,
          bgColor: "from-amber-500/10 to-orange-500/10",
          borderColor: "border-amber-500/20",
        },
      ];

      setStats(newStats);

      // Revenue for last 6 actual calendar months
      const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const m = d.getMonth();
        const y = d.getFullYear();
        const label = d.toLocaleString("default", { month: "short" });
        const revenue = bookings
          .filter((b: any) => {
            // Use scheduledDate so revenue is attributed to when service was delivered
            const bd = new Date(b.scheduledDate);
            return bd.getMonth() === m && bd.getFullYear() === y && b.paymentStatus === "completed";
          })
          .reduce((sum: number, b: any) => sum + (b.amount || 0), 0);
        return { month: label, revenue };
      });

      setRevenueData(monthlyRevenue);

      // Calculate real session types from bookings
      const sessionTypeColors: any = {
        "mock-interview": { label: "Mock Interview", color: "bg-blue-500" },
        "cv-review": { label: "CV Review", color: "bg-purple-500" },
        "gd-practice": { label: "GD Practice", color: "bg-pink-500" },
        guidance: { label: "Guidance", color: "bg-emerald-500" },
      };

      const sessionTypeCounts: any = {};
      bookings.forEach((b: any) => {
        const type = b.sessionType || "guidance";
        sessionTypeCounts[type] = (sessionTypeCounts[type] || 0) + 1;
      });

      const calculatedSessionTypes = Object.keys(sessionTypeCounts).map(
        (type) => ({
          label:
            sessionTypeColors[type]?.label ||
            type
              .replace("-", " ")
              .replace(/\b\w/g, (l: string) => l.toUpperCase()),
          count: sessionTypeCounts[type],
          color: sessionTypeColors[type]?.color || "bg-zinc-500",
        }),
      );

      setSessionTypes(
        calculatedSessionTypes.length > 0
          ? calculatedSessionTypes
          : [{ label: "No sessions yet", count: 0, color: "bg-zinc-500" }],
      );

      // Generate recent activity from actual bookings
      const sortedBookings = [...bookings].sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      const activities = sortedBookings.slice(0, 4).map((booking: any) => {
        const timeDiff = Date.now() - new Date(booking.createdAt).getTime();
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        let timeStr = "";
        if (days > 0) {
          timeStr = `${days} day${days > 1 ? "s" : ""} ago`;
        } else if (hours > 0) {
          timeStr = `${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else {
          timeStr = "Just now";
        }

        let action = "";
        let icon = "📅";

        if (booking.status === "completed") {
          action = `Session completed with ${booking.studentId?.name || "student"}`;
          icon = "⭐";
        } else if (booking.status === "confirmed") {
          action = `Session confirmed with ${booking.studentId?.name || "student"}`;
          icon = "✅";
        } else if (booking.paymentStatus === "completed") {
          action = `Payment received - ₹${booking.amount || 0}`;
          icon = "💰";
        } else {
          action = `New booking from ${booking.studentId?.name || "student"}`;
          icon = "📅";
        }

        return { action, time: timeStr, icon };
      });

      setRecentActivity(
        activities.length > 0
          ? activities
          : [{ action: "No recent activity", time: "", icon: "📭" }],
      );

      setIsLoading(false);
    } catch (err) {
      toast.error("Failed to load analytics");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const maxRevenue =
    revenueData.length > 0 ? Math.max(...revenueData.map((d) => d.revenue)) : 1;

  const homeStatCards: { label: string; window: HomeStatsWindow | null; icon: any; gradient: string; border: string }[] = [
    { label: "Today",      window: homeStats?.today    ?? null, icon: Activity,      gradient: "from-blue-500/15 to-cyan-500/10",     border: "border-blue-500/25" },
    { label: "This Week",  window: homeStats?.week     ?? null, icon: CalendarIcon,  gradient: "from-violet-500/15 to-fuchsia-500/10", border: "border-violet-500/25" },
    { label: "This Month", window: homeStats?.month    ?? null, icon: Globe,         gradient: "from-emerald-500/15 to-teal-500/10",   border: "border-emerald-500/25" },
    { label: "All Time",   window: homeStats?.allTime  ?? null, icon: Eye,           gradient: "from-amber-500/15 to-orange-500/10",   border: "border-amber-500/25" },
  ];

  return (
    <div className="space-y-8">
      {/* Home Page Traffic */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-3">
              <Globe size={10} />
              Home Page Traffic
            </div>
            <h2 className="text-xl font-bold text-white">Visitors on yourinterviewcoach.in</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Tracking unique visitors and total page views on the homepage
              {homeStats?.lastViewAt && (
                <>
                  <span className="mx-1.5 text-zinc-600">·</span>
                  Last visit {new Date(homeStats.lastViewAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {homeStatCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`bg-gradient-to-br ${card.gradient} border ${card.border} rounded-xl p-5 transition`}
              >
                <div className="flex items-start justify-between mb-4">
                  <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider">{card.label}</p>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                    <Icon size={14} className="text-white" />
                  </div>
                </div>
                {homeStatsLoading ? (
                  <div className="space-y-2">
                    <div className="h-7 w-16 bg-white/10 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <p className="text-3xl font-bold text-white tabular-nums">{(card.window?.unique ?? 0).toLocaleString()}</p>
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">unique</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      <span className="font-semibold text-zinc-300 tabular-nums">{(card.window?.hits ?? 0).toLocaleString()}</span>
                      <span className="ml-1">total hits</span>
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} rounded-2xl p-6 hover:border-opacity-100 transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-zinc-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="p-3 rounded-lg bg-black/30">
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {stat.isPositive ? (
                  <TrendingUp size={16} className="text-emerald-400" />
                ) : (
                  <TrendingDown size={16} className="text-red-400" />
                )}
                <span
                  className={
                    stat.isPositive ? "text-emerald-400" : "text-red-400"
                  }
                  style={{ fontSize: "0.875rem" }}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition">
          <h2 className="text-xl font-bold text-white mb-6">Revenue Trend</h2>
          <div className="h-64 flex items-end gap-4">
            {revenueData.map((data, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg hover:from-blue-600 hover:to-cyan-500 transition cursor-pointer group relative"
                  style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-zinc-800 px-2 py-1 rounded text-xs whitespace-nowrap">
                    ₹{data.revenue}
                  </div>
                </div>
                <p className="text-xs text-zinc-400 mt-2">{data.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Session Types */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition">
          <h2 className="text-xl font-bold text-white mb-6">Session Types</h2>
          <div className="space-y-4">
            {sessionTypes.map((item) => {
              const maxCount = Math.max(...sessionTypes.map((s) => s.count), 1);
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-300">{item.label}</span>
                    <span className="text-sm font-bold text-white">
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition">
        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-white font-medium">{activity.action}</p>
                {activity.time && (
                  <p className="text-xs text-zinc-400">{activity.time}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
