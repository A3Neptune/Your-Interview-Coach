"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { authAPI, bookingAPI, getAuthToken, removeAuthToken } from "@/lib/api";

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

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionFilter, setSessionFilter] = useState<SessionFilter>("all");

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

        const [usersResponse, bookingsResponse] = await Promise.all([
          fetch(`${API_URL}/auth/all-users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          bookingAPI.getMentorBookings(),
        ]);

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData.users || []);
        }

        setBookings(bookingsResponse.data.bookings || []);
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
      </div>
    </div>
  );
}
