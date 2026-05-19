"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  Users,
  LogOut,
  Search,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Download,
  Calendar,
  Phone,
  Eye,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { authAPI, bookingAPI, gdBookingAPI, analyticsAPI, getAuthToken, removeAuthToken } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface UserData {
  _id: string;
  name: string;
  email: string;
  userType: string;
  createdAt: string;
}

interface BookingStudent {
  name?: string;
  email?: string;
  mobile?: string;
}

interface BookingData {
  _id: string;
  sessionType: string;
  scheduledDate: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount?: number;
  title?: string;
  studentId?: BookingStudent | null;
}

type SessionFilter =
  | "all"
  | "resumeAnalysis"
  | "mockInterview"
  | "liveWebinar"
  | "gdGroupDiscussions";

const SESSION_FILTERS: Array<{ key: SessionFilter; label: string }> = [
  { key: "all", label: "All Sessions" },
  { key: "resumeAnalysis", label: "Resume Analysis" },
  { key: "mockInterview", label: "Mock Interview" },
  { key: "liveWebinar", label: "Live Webinar" },
  { key: "gdGroupDiscussions", label: "GD Practice" },
];

const getSessionCategory = (sessionType?: string): SessionFilter => {
  const value = (sessionType || "").trim();
  if (
    ["resumeAnalysis", "resume-analysis", "cvReview", "resumeReview"].includes(
      value,
    )
  )
    return "resumeAnalysis";
  if (
    [
      "oneMentorship",
      "mockInterview",
      "mock-interview",
      "interviewPrep",
    ].includes(value)
  )
    return "mockInterview";
  if (["webinars", "liveWebinar", "live-webinar"].includes(value))
    return "liveWebinar";
  if (["gdGroupDiscussions", "groupDiscussion", "gd-practice"].includes(value))
    return "gdGroupDiscussions";
  return "all";
};

const getSessionLabel = (sessionType?: string) => {
  const type = getSessionCategory(sessionType);
  const mapping: Record<Exclude<SessionFilter, "all">, string> = {
    resumeAnalysis: "Resume Analysis",
    mockInterview: "Mock Interview",
    liveWebinar: "Live Webinar",
    gdGroupDiscussions: "GD Practice",
  };
  return type === "all" ? sessionType || "Other" : mapping[type];
};

const csvCell = (value: unknown) =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

interface GDBookingData {
  _id: string;
  planType: string;
  memberCount: number;
  pricePerMember: number;
  totalAmount: number;
  members: { name: string; whatsapp: string }[];
  scheduledDate: string;
  status: string;
  paymentStatus: string;
  userId?: { name?: string; email?: string; mobile?: string } | null;
  createdAt: string;
}

interface AnalyticsData {
  stats: { path: string; hits: number; unique: number }[];
  totals: { hits: number; unique: number };
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [gdBookings, setGdBookings] = useState<GDBookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionFilter, setSessionFilter] = useState<SessionFilter>("all");
  const [expandedGD, setExpandedGD] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await authAPI.getCurrentUser();
        if (response.data.user.userType !== "admin") {
          router.push("/dashboard");
          return;
        }
        setUser(response.data.user);

        const [usersResponse, bookingsResponse, gdBookingsResponse, analyticsResponse] = await Promise.all([
          fetch(`${API_URL}/auth/all-users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          bookingAPI.getMentorBookings(),
          gdBookingAPI.adminGetAll().catch(() => ({ data: { bookings: [] } })),
          analyticsAPI.getAllStats().catch(() => ({ data: null })),
        ]);

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData.users || []);
        }

        setBookings(bookingsResponse.data.bookings || []);
        setGdBookings(gdBookingsResponse.data.bookings || []);
        
        if (analyticsResponse?.data?.success) {
          setAnalytics(analyticsResponse.data);
        }
      } catch (err: any) {
        removeAuthToken();
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      removeAuthToken();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Logout failed";
      toast.error(errorMsg);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredBookings = bookings.filter((booking) => {
    const q = searchTerm.trim().toLowerCase();
    const bookingCategory = getSessionCategory(booking.sessionType);
    const bySession =
      sessionFilter === "all" || bookingCategory === sessionFilter;

    if (!q) return bySession;

    const studentName = booking.studentId?.name?.toLowerCase() || "";
    const studentEmail = booking.studentId?.email?.toLowerCase() || "";
    const sessionLabel = getSessionLabel(booking.sessionType).toLowerCase();

    return (
      bySession &&
      (studentName.includes(q) ||
        studentEmail.includes(q) ||
        sessionLabel.includes(q))
    );
  });

  const sessionCounts = SESSION_FILTERS.reduce(
    (acc, filter) => {
      acc[filter.key] =
        filter.key === "all"
          ? bookings.length
          : bookings.filter(
              (b) => getSessionCategory(b.sessionType) === filter.key,
            ).length;
      return acc;
    },
    {} as Record<SessionFilter, number>,
  );

  const handleExportCsv = () => {
    if (filteredBookings.length === 0) {
      toast.error("No booking data available for export");
      return;
    }

    const headers = [
      "Student Name",
      "Student Email",
      "Student Mobile",
      "Session Type",
      "Title",
      "Scheduled Date",
      "Status",
      "Amount",
    ];

    const rows = filteredBookings.map((booking) => [
      booking.studentId?.name || "Unknown",
      booking.studentId?.email || "",
      booking.studentId?.mobile || "",
      getSessionLabel(booking.sessionType),
      booking.title || "",
      booking.scheduledDate
        ? new Date(booking.scheduledDate).toLocaleString("en-IN")
        : "",
      booking.status,
      booking.amount ?? "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `student-session-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("CSV exported successfully");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border border-white/20 border-t-white" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Redirecting to login...</p>
          <Link
            href="/login"
            className="text-white hover:text-zinc-200 font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <span className="text-zinc-900 font-bold text-sm">C</span>
            </div>
            <span className="font-bold">CareerCoach Admin</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">Admin: {user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-white/10">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-zinc-400 text-sm mt-1">
                Manage users and platform analytics
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
              <div className="text-emerald-400 flex items-center gap-1 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                12%
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Students</p>
                <p className="text-3xl font-bold">
                  {users.filter((u) => u.userType === "student").length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-white/10">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Professionals</p>
                <p className="text-3xl font-bold">
                  {users.filter((u) => u.userType === "professional").length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-white/10">
                <Zap className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="border-b border-white/10 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">All Users</h2>
                <p className="text-zinc-400 text-sm">
                  Manage and monitor all registered users
                </p>
              </div>

              <div className="w-full sm:w-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            u.userType === "student"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-purple-500/10 text-purple-400"
                          }`}
                        >
                          {u.userType.charAt(0).toUpperCase() +
                            u.userType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-zinc-400 hover:text-white transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-zinc-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredUsers.length > 0 && (
            <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-zinc-400">
                Showing {filteredUsers.length} of {users.length} users
              </p>
            </div>
          )}
        </div>

        {/* Student Session Bookings */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md mt-8">
          <div className="border-b border-white/10 p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    Student Session Bookings
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Track students by session type: Resume Analysis, Mock
                    Interview, Live Webinar, and more.
                  </p>
                </div>
                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/20 transition-all text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-3">
                {SESSION_FILTERS.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setSessionFilter(filter.key)}
                    className={`text-left rounded-xl px-4 py-3 border transition-all ${
                      sessionFilter === filter.key
                        ? "bg-blue-500/15 border-blue-400/40"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <p className="text-xs text-zinc-400">{filter.label}</p>
                    <p className="text-xl font-bold mt-1">
                      {sessionCounts[filter.key] || 0}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Session Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Booked On
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">
                            {booking.studentId?.name || "Unknown Student"}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {booking.studentId?.email || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-400/20">
                          {getSessionLabel(booking.sessionType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                          {booking.scheduledDate
                            ? new Date(booking.scheduledDate).toLocaleString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : booking.status === "completed"
                                ? "bg-blue-500/10 text-blue-300"
                                : booking.status === "cancelled"
                                  ? "bg-red-500/10 text-red-300"
                                  : "bg-amber-500/10 text-amber-300"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        {typeof booking.amount === "number"
                          ? `₹${booking.amount}`
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-zinc-500"
                    >
                      No booking records found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* GD Bookings Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md mt-8">
          <div className="border-b border-white/10 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">GD Session Bookings</h2>
                <p className="text-zinc-400 text-sm">
                  All group discussion bookings with team member details.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-400/20">
                  {gdBookings.length} Bookings
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-400/20">
                  ₹{gdBookings.filter(b => b.paymentStatus === 'completed').reduce((s, b) => s + b.totalAmount, 0)} Revenue
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Booked By</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Members</th>
                </tr>
              </thead>
              <tbody>
                {gdBookings.length > 0 ? (
                  gdBookings.map((gd) => (
                    <React.Fragment key={gd._id}>
                      <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setExpandedGD(expandedGD === gd._id ? null : gd._id)}>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium">{gd.userId?.name || 'Unknown'}</span>
                            <span className="text-xs text-zinc-400">{gd.userId?.email || '-'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            gd.planType === '4-members' ? 'bg-blue-500/10 text-blue-300 border border-blue-400/20'
                            : gd.planType === '6-members' ? 'bg-purple-500/10 text-purple-300 border border-purple-400/20'
                            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-400/20'
                          }`}>
                            {gd.memberCount} Members
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-300">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            {new Date(gd.scheduledDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            gd.paymentStatus === 'completed' ? 'bg-emerald-500/10 text-emerald-300'
                            : gd.paymentStatus === 'failed' ? 'bg-red-500/10 text-red-300'
                            : 'bg-amber-500/10 text-amber-300'
                          }`}>{gd.paymentStatus}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            gd.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-300'
                            : gd.status === 'completed' ? 'bg-blue-500/10 text-blue-300'
                            : gd.status === 'cancelled' ? 'bg-red-500/10 text-red-300'
                            : 'bg-amber-500/10 text-amber-300'
                          }`}>{gd.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">₹{gd.totalAmount}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-zinc-400 hover:text-white transition-colors">
                            <ChevronDown className={`w-4 h-4 transition-transform ${expandedGD === gd._id ? 'rotate-180' : ''}`} />
                          </button>
                        </td>
                      </tr>
                      {expandedGD === gd._id && (
                        <tr key={`${gd._id}-details`}>
                          <td colSpan={7} className="px-6 py-4 bg-white/[0.02]">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                              {gd.members.map((m, idx) => (
                                <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-300">{idx + 1}</div>
                                    <span className="text-sm font-medium text-white truncate">{m.name}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-zinc-400">
                                    <Phone className="w-3 h-3" />
                                    {m.whatsapp}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                      No GD bookings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Site Traffic & Analytics Section */}
        {analytics && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md mt-8">
            <div className="border-b border-white/10 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Site Traffic & Analytics</h2>
                  <p className="text-zinc-400 text-sm">
                    Path-wise visitor tracking, unique visitors, and total page hits.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-400/20">
                    {analytics.totals?.unique || 0} Unique Visitors
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-400/20">
                    {analytics.totals?.hits || 0} Total Hits
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Page / Route Path</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Hits</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Unique Visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.stats?.map((stat, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium">{stat.path}</td>
                      <td className="px-6 py-4 text-right text-sm">{stat.hits}</td>
                      <td className="px-6 py-4 text-right text-sm">{stat.unique}</td>
                    </tr>
                  ))}
                  {(!analytics.stats || analytics.stats.length === 0) && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">
                        No traffic data recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
