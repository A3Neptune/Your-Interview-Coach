"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Mail,
  Phone,
  Award,
  Download,
  FileDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  IndianRupee,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

/* ──────────────────────── Types ──────────────────────── */

type SessionTypeKey =
  | "all"
  | "resumeAnalysis"
  | "mockInterview"
  | "liveWebinar"
  | "gdGroupDiscussions"
  | "other";

/* ──────────────────────── Constants ──────────────────────── */

const normalizeSessionType = (sessionType?: string): SessionTypeKey => {
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
  return "other";
};

const sessionTypeLabels: Record<SessionTypeKey, string> = {
  all: "All Bookings",
  resumeAnalysis: "Resume Analysis",
  mockInterview: "Mock Interview",
  liveWebinar: "Live Webinar",
  gdGroupDiscussions: "GD Practice",
  other: "Other",
};

const sessionTypeBadgeColors: Record<SessionTypeKey, string> = {
  all: "bg-zinc-500/20 text-zinc-300 border-zinc-400/20",
  resumeAnalysis: "bg-cyan-500/15 text-cyan-300 border-cyan-400/20",
  mockInterview: "bg-violet-500/15 text-violet-300 border-violet-400/20",
  liveWebinar: "bg-amber-500/15 text-amber-300 border-amber-400/20",
  gdGroupDiscussions: "bg-rose-500/15 text-rose-300 border-rose-400/20",
  other: "bg-zinc-500/15 text-zinc-300 border-zinc-400/20",
};

const statusBadgeColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300",
  confirmed: "bg-blue-500/20 text-blue-300",
  completed: "bg-emerald-500/20 text-emerald-300",
  cancelled: "bg-red-500/20 text-red-300",
  "no-show": "bg-zinc-700/50 text-zinc-300",
};

const paymentStatusBadge: Record<string, string> = {
  pending: "text-yellow-400",
  completed: "text-emerald-400",
  failed: "text-red-400",
  refunded: "text-orange-400",
};

const csvCell = (value: unknown) =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

const PAGE_SIZE = 10;

/* ──────────────────────── Component ──────────────────────── */

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionTypeFilter, setSessionTypeFilter] =
    useState<SessionTypeKey>("all");
  const [bookings, setBookings] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]); // for stats
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
  });

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  /* ──── Fetch bookings (paginated) ──── */
  const fetchBookings = useCallback(
    async (page = 1, sessionType: SessionTypeKey = "all") => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Session expired. Please login again.");
          setIsLoading(false);
          return;
        }

        setIsPageLoading(true);

        const params: Record<string, string | number> = {
          page,
          limit: PAGE_SIZE,
        };
        if (sessionType !== "all") params.sessionType = sessionType;

        const res = await axios.get(`${API_URL}/bookings/mentor/all-bookings`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
          params,
          timeout: 15000,
        });

        setBookings(res.data.bookings || []);
        setPagination(
          res.data.pagination || {
            total: 0,
            page: 1,
            limit: PAGE_SIZE,
            totalPages: 1,
          },
        );
      } catch (err: any) {
        console.error("Error fetching bookings:", err);
        toast.error("Failed to load bookings");
        setBookings([]);
      } finally {
        setIsLoading(false);
        setIsPageLoading(false);
      }
    },
    [API_URL],
  );

  /* ──── Fetch ALL bookings once (for session-type counts / stats) ──── */
  const fetchAllBookingsForStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const res = await axios.get(`${API_URL}/bookings/mentor`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000,
      });

      setAllBookings(res.data.bookings || []);
    } catch {
      setAllBookings([]);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchBookings(1, "all");
    fetchAllBookingsForStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ──── Session type stats from allBookings ──── */
  const sessionTypeStats = useMemo(() => {
    const stats: Record<SessionTypeKey, number> = {
      all: 0,
      resumeAnalysis: 0,
      mockInterview: 0,
      liveWebinar: 0,
      gdGroupDiscussions: 0,
      other: 0,
    };
    allBookings.forEach((b: any) => {
      const n = normalizeSessionType(b.sessionType);
      stats[n] += 1;
      stats.all += 1;
    });
    return stats;
  }, [allBookings]);

  /* ──── Summary stats ──── */
  const summaryStats = useMemo(() => {
    const uniqueStudents = new Set(
      allBookings.map(
        (b: any) => b.studentId?._id || b.studentId,
      ),
    );
    const activeCount = allBookings.filter(
      (b: any) => b.status === "confirmed" || b.status === "pending",
    ).length;
    const totalSessions = allBookings.length;
    const revenue = allBookings
      .filter((b: any) => b.paymentStatus === "completed")
      .reduce((sum: number, b: any) => sum + (b.amount || 0), 0);

    return {
      totalStudents: uniqueStudents.size,
      activeNow: activeCount,
      totalSessions,
      revenue,
    };
  }, [allBookings]);

  /* ──── Filter change ──── */
  const handleFilterChange = (type: SessionTypeKey) => {
    setSessionTypeFilter(type);
    setCurrentPage(1);
    fetchBookings(1, type);
  };

  /* ──── Pagination ──── */
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setCurrentPage(newPage);
    fetchBookings(newPage, sessionTypeFilter);
  };

  /* ──── Client-side search on the current page ──── */
  const displayedBookings = useMemo(() => {
    if (!searchTerm.trim()) return bookings;
    const q = searchTerm.toLowerCase();
    return bookings.filter((b: any) => {
      const name = (b.studentId?.name || "").toLowerCase();
      const email = (b.studentId?.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [bookings, searchTerm]);

  /* ──── Export CSV ──── */
  const handleExportData = () => {
    if (displayedBookings.length === 0) {
      toast.error("No booking data available for export");
      return;
    }

    const header = [
      "Student Name",
      "Email",
      "Mobile",
      "Session Type",
      "Booking Date",
      "Amount",
      "Payment Status",
      "Booking Status",
    ];

    const rows = displayedBookings.map((b: any) => [
      b.studentId?.name || "N/A",
      b.studentId?.email || "N/A",
      b.studentId?.mobile || "N/A",
      sessionTypeLabels[normalizeSessionType(b.sessionType)] || b.sessionType,
      new Date(b.createdAt).toLocaleDateString("en-IN"),
      b.amount || 0,
      b.paymentStatus || "N/A",
      b.status || "N/A",
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mentor-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Booking data exported successfully");
  };

  /* ──────────────────────── Render ──────────────────────── */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Booking Management
          </h1>
          <p className="text-zinc-400 mt-2">
            All bookings &amp; transactions — each row is one booking
          </p>
        </div>
        <button
          onClick={handleExportData}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20 transition font-semibold"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Session Type Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {(Object.keys(sessionTypeLabels) as SessionTypeKey[]).map((type) => (
          <button
            key={type}
            onClick={() => handleFilterChange(type)}
            className={`rounded-xl border px-4 py-3 text-left transition ${
              sessionTypeFilter === type
                ? "border-blue-500/50 bg-blue-500/15 ring-1 ring-blue-500/30"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            }`}
          >
            <p className="text-xs text-zinc-400">{sessionTypeLabels[type]}</p>
            <p className="text-2xl font-bold text-white mt-1">
              {sessionTypeStats[type]}
            </p>
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: summaryStats.totalStudents,
            color: "from-blue-500/10",
          },
          {
            label: "Active Bookings",
            value: summaryStats.activeNow,
            color: "from-emerald-500/10",
          },
          {
            label: "Total Sessions",
            value: summaryStats.totalSessions,
            color: "from-purple-500/10",
          },
          {
            label: "Revenue",
            value: `₹${summaryStats.revenue.toLocaleString("en-IN")}`,
            color: "from-orange-500/10",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.color} to-transparent border border-zinc-800 rounded-lg p-4`}
          >
            <p className="text-zinc-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition relative">
        {/* Page loading overlay */}
        {isPageLoading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 size={28} className="animate-spin text-blue-400" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-black/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Session Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Booking Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                  Resume
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    No bookings found
                  </td>
                </tr>
              ) : (
                displayedBookings.map((booking: any) => {
                  const student = booking.studentId || {};
                  const avatar = (student.name || "")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);
                  const normalizedType = normalizeSessionType(
                    booking.sessionType,
                  );
                  const isResumeAnalysis = normalizedType === "resumeAnalysis";
                  const resumeUrl = booking.resumeFile?.url;

                  return (
                    <tr
                      key={booking._id}
                      className="border-b border-zinc-800 hover:bg-white/5 transition"
                    >
                      {/* Student */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {avatar || "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-white truncate">
                              {student.name || "Unknown"}
                            </p>
                            <p className="text-xs text-zinc-500 capitalize">
                              {student.userType || "student"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <Mail size={14} className="text-zinc-400 flex-shrink-0" />
                            <span className="truncate max-w-[180px]">
                              {student.email || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Phone size={14} className="flex-shrink-0" />
                            {student.mobile || "N/A"}
                          </div>
                        </div>
                      </td>

                      {/* Session Type */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${sessionTypeBadgeColors[normalizedType]}`}
                        >
                          {sessionTypeLabels[normalizedType]}
                        </span>
                      </td>

                      {/* Booking Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                          <Calendar
                            size={14}
                            className="text-zinc-400 flex-shrink-0"
                          />
                          <div>
                            <p>
                              {new Date(booking.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {new Date(booking.createdAt).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <IndianRupee
                            size={14}
                            className="text-emerald-400"
                          />
                          <span className="font-semibold text-emerald-400">
                            {Number(booking.amount || 0).toLocaleString(
                              "en-IN",
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold capitalize ${paymentStatusBadge[booking.paymentStatus] || "text-zinc-400"}`}
                        >
                          {booking.paymentStatus || "N/A"}
                        </span>
                      </td>

                      {/* Booking Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadgeColors[booking.status] || "bg-zinc-700/50 text-zinc-300"}`}
                        >
                          {booking.status || "N/A"}
                        </span>
                      </td>

                      {/* Resume Download */}
                      <td className="px-6 py-4">
                        {isResumeAnalysis && resumeUrl ? (
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-400/20 hover:bg-cyan-500/25 transition"
                          >
                            <FileDown size={14} />
                            Download
                          </a>
                        ) : isResumeAnalysis ? (
                          <span className="text-xs text-zinc-500 italic">
                            No resume
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          Showing{" "}
          {pagination.total === 0
            ? 0
            : (pagination.page - 1) * pagination.limit + 1}
          –{Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} booking{pagination.total !== 1 ? "s" : ""}
        </p>

        {pagination.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page numbers */}
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                // Show pages around current page
                let page: number;
                if (pagination.totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  page = pagination.totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {page}
                  </button>
                );
              },
            )}

            <button
              disabled={currentPage >= pagination.totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
