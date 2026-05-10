"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Video, CheckCircle2, XCircle, Phone, Mail, X, User, RefreshCw, FileDown } from "lucide-react";
import { toast } from 'sonner';
import { authAPI, bookingAPI, getAuthToken, removeAuthToken } from "@/lib/api";

interface BookingStudent {
  name: string;
  email: string;
  mobile?: string;
  userType?: "student" | "professional";
}

interface Booking {
  _id: string;
  studentId?: BookingStudent | null;
  sessionType: string;
  title: string;
  scheduledDate: string;
  duration: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus?: "pending" | "completed" | "failed" | "refunded";
  amount?: number;
  studentNotes?: string;
  meetingLink?: string;
  refundId?: string;
  refundAmount?: number;
  refundedAt?: string;
  weekLabel?: string;
  resumeFile?: {
    url: string;
    originalName?: string;
  };
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const getJitsiLink = (booking: { _id: string; sessionType?: string; mentorId?: any; scheduledDate?: string }) => {
  if (booking.sessionType === 'webinars') {
    const mentorId = typeof booking.mentorId === 'object' ? booking.mentorId?._id : booking.mentorId;
    const ts = booking.scheduledDate ? new Date(booking.scheduledDate).getTime() : '';
    return `https://meet.jit.si/yic-webinar-${mentorId}-${ts}`;
  }
  return `https://meet.jit.si/yic-session-${booking._id}`;
};

const SESSION_LABELS: Record<string, string> = {
  oneMentorship: "1:1 Mentorship",
  resumeAnalysis: "Resume Review",
  gdGroupDiscussions: "GD Practice",
  webinars: "Webinar",
  placementAccelerator: "Placement Accelerator",
};

type SessionFilter = "all" | "oneMentorship" | "resumeAnalysis" | "gdGroupDiscussions" | "webinars" | "placementAccelerator";

export default function MentorBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled" | "all">("upcoming");
  const [sessionFilter, setSessionFilter] = useState<SessionFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [markingRefundedId, setMarkingRefundedId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  // Refresh "now" every minute so session status updates without page reload
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);
  const [profileBooking, setProfileBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = getAuthToken();
        if (!token) { router.push("/login"); return; }
        const res = await authAPI.getCurrentUser();
        if (res.data.user.userType !== "admin") { router.push("/dashboard"); return; }
        const bookingRes = await bookingAPI.getMentorBookings();
        setBookings(bookingRes.data.bookings || []);
      } catch (err: any) {
        if (err.response?.status === 401) { removeAuthToken(); router.push("/login"); }
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [router]);

  const nowMs = now;

  const isUpcomingBooking = (b: Booking) => {
    if (b.status !== "confirmed") return false;
    if (b.sessionType === "placementAccelerator")
      return new Date(b.scheduledDate).getTime() + WEEK_MS > nowMs;
    return new Date(b.scheduledDate).getTime() + b.duration * 60000 > nowMs;
  };

  const isCompletedBooking = (b: Booking) => {
    if (b.status === "completed") return true;
    if (b.status !== "confirmed") return false;
    if (b.sessionType === "placementAccelerator")
      return new Date(b.scheduledDate).getTime() + WEEK_MS <= nowMs;
    return new Date(b.scheduledDate).getTime() + b.duration * 60000 <= nowMs;
  };

  const stats = useMemo(() => ({
    upcoming:  bookings.filter(isUpcomingBooking).length,
    completed: bookings.filter(isCompletedBooking).length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    total:     bookings.filter(b => b.status !== "pending").length,
  }), [bookings, nowMs]);

  const filtered = useMemo(() => {
    let list: Booking[];
    if (activeTab === "upcoming") {
      list = bookings.filter(isUpcomingBooking);
    } else if (activeTab === "completed") {
      list = bookings.filter(isCompletedBooking);
    } else if (activeTab === "cancelled") {
      list = bookings.filter(b => b.status === "cancelled");
    } else {
      list = bookings.filter(b => b.status !== "pending");
    }
    if (sessionFilter !== "all") {
      list = list.filter(b => b.sessionType === sessionFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(b =>
        b.studentId?.name?.toLowerCase().includes(q) ||
        b.studentId?.email?.toLowerCase().includes(q) ||
        b.studentId?.mobile?.includes(q)
      );
    }
    return list.slice().sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }, [bookings, activeTab, nowMs, sessionFilter, searchQuery]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Cancel this session? The user will be refunded automatically.")) return;
    setCancellingId(bookingId);
    try {
      await bookingAPI.cancelBooking(bookingId);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: "cancelled" } : b));
      toast.success("Session cancelled — refund initiated");
    } catch {
      toast.error("Failed to cancel session");
    } finally {
      setCancellingId(null);
    }
  };

  const handleMarkRefunded = async (bookingId: string) => {
    const refundId = prompt("Enter Razorpay Refund ID (leave blank if unknown):");
    if (refundId === null) return; // user pressed Cancel
    setMarkingRefundedId(bookingId);
    try {
      await bookingAPI.markRefunded(bookingId, refundId || undefined);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, paymentStatus: "refunded" as const, refundId: refundId || `manual_${Date.now()}` } : b));
      toast.success("Booking marked as refunded");
    } catch {
      toast.error("Failed to mark as refunded");
    } finally {
      setMarkingRefundedId(null);
    }
  };

  const getStudentName = (b: Booking) => b.studentId?.name?.trim() || "Unknown";
  const getInitials = (b: Booking) =>
    getStudentName(b).split(" ").filter(Boolean).map(p => p[0]).join("").toUpperCase().slice(0, 2) || "?";

  const tabs = [
    { key: "upcoming"  as const, label: "Upcoming",  count: stats.upcoming  },
    { key: "completed" as const, label: "Completed", count: stats.completed },
    { key: "cancelled" as const, label: "Cancelled", count: stats.cancelled },
    { key: "all"       as const, label: "All",       count: stats.total     },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/mentor-dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <span className="text-sm font-semibold text-white">Session Bookings</span>
          <span className="text-xs text-zinc-500">{stats.upcoming} upcoming</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Status Tabs */}
        <div className="flex gap-1 mb-4 p-1 rounded-xl bg-white/5 border border-white/10">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.key ? "bg-white text-zinc-900" : "text-zinc-400 hover:text-white"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === t.key ? "bg-zinc-200 text-zinc-700" : "bg-white/10 text-zinc-400"
                }`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Session Type Filter + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-1.5 flex-wrap">
            {([
              { key: "all", label: "All Types" },
              { key: "placementAccelerator", label: "PA" },
              { key: "oneMentorship", label: "1:1 Mentorship" },
              { key: "resumeAnalysis", label: "Resume" },
              { key: "gdGroupDiscussions", label: "GD" },
              { key: "webinars", label: "Webinar" },
            ] as const).map(f => (
              <button
                key={f.key}
                onClick={() => setSessionFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  sessionFilter === f.key
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email or phone…"
            className="sm:ml-auto px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 min-w-0 sm:w-56"
          />
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-600">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No {activeTab} sessions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(booking => {
              const date = new Date(booking.scheduledDate);
              const sessionLink = booking.meetingLink || getJitsiLink(booking);
              const isUpcoming = isUpcomingBooking(booking);
              const isRealRefund = booking.refundId && !booking.refundId.startsWith("manual_") && !booking.refundId.startsWith("not_applicable");
              const pa = booking.sessionType === "placementAccelerator";
              const weekEnd = pa ? new Date(date.getTime() + WEEK_MS) : null;
              const displayWeekLabel = booking.weekLabel ||
                (pa && weekEnd
                  ? `${date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${weekEnd.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
                  : "");

              return (
                <div key={booking._id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar — click to view profile */}
                    <button
                      onClick={() => setProfileBooking(booking)}
                      className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 hover:ring-2 hover:ring-indigo-400 transition-all"
                      title="View student info"
                    >
                      {getInitials(booking)}
                    </button>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      {/* Row 1: name + status */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-semibold text-white truncate">{getStudentName(booking)}</p>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${
                          booking.status === "confirmed" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" :
                          booking.status === "cancelled" ? "text-red-400 bg-red-500/10 border-red-500/30" :
                          booking.status === "completed" ? "text-blue-400 bg-blue-500/10 border-blue-500/30" :
                          "text-zinc-400 bg-zinc-500/10 border-zinc-500/30"
                        }`}>
                          {booking.status === "confirmed" && date.getTime() <= nowMs ? "ended" : booking.status}
                        </span>
                      </div>

                      {/* Row 2: session type */}
                      <p className="text-xs text-zinc-400 mb-3">
                        {SESSION_LABELS[booking.sessionType] || booking.sessionType}
                      </p>

                      {/* Row 3: date/time/duration (or week range for PA) */}
                      <div className="flex flex-wrap gap-3 text-xs text-zinc-500 mb-3">
                        {pa ? (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Week of {displayWeekLabel}
                          </span>
                        ) : (
                          <>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {date.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {date.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" })} · {booking.duration} min
                            </span>
                          </>
                        )}
                        {booking.amount != null && (
                          <span className="text-zinc-500">₹{booking.amount}</span>
                        )}
                      </div>

                      {/* Row 4: contact */}
                      <div className="flex flex-wrap gap-3 text-xs text-zinc-500 mb-4">
                        {booking.studentId?.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />{booking.studentId.email}
                          </span>
                        )}
                        {booking.studentId?.mobile && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />{booking.studentId.mobile}
                          </span>
                        )}
                      </div>

                      {/* Student notes */}
                      {booking.studentNotes && (
                        <p className="text-xs text-zinc-400 bg-white/5 rounded-lg px-3 py-2 mb-4 border border-white/5">
                          "{booking.studentNotes}"
                        </p>
                      )}

                      {/* Refund info (cancelled) */}
                      {booking.status === "cancelled" && booking.paymentStatus === "refunded" && (
                        <div className="flex items-center gap-2 text-xs text-emerald-400 mb-3">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>
                            Refund processed
                            {booking.refundAmount != null && ` · ₹${booking.refundAmount}`}
                            {isRealRefund && booking.refundId && ` · ${booking.refundId}`}
                            {booking.refundedAt && ` · ${new Date(booking.refundedAt).toLocaleDateString("en-IN")}`}
                          </span>
                        </div>
                      )}
                      {booking.status === "cancelled" && booking.paymentStatus === "completed" && (
                        <div className="flex items-start gap-2 text-xs text-amber-400 mb-3">
                          <XCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-1.5">
                            <span>Razorpay may have processed this refund but our DB wasn&apos;t updated. Check Razorpay dashboard · ₹{booking.amount}</span>
                            <button
                              onClick={() => handleMarkRefunded(booking._id)}
                              disabled={markingRefundedId === booking._id}
                              className="flex items-center gap-1.5 self-start px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-semibold transition-colors disabled:opacity-50"
                            >
                              <RefreshCw className="w-3 h-3" />
                              {markingRefundedId === booking._id ? "Saving…" : "Mark as Refunded"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        {isUpcoming && !pa && (
                          <a
                            href={sessionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                          >
                            <Video className="w-3.5 h-3.5" /> Join Session
                          </a>
                        )}
                        {booking.resumeFile?.url && (
                          <a
                            href={booking.resumeFile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-400 text-xs font-semibold transition-colors"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            Download Resume
                          </a>
                        )}
                        {isUpcoming && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            {cancellingId === booking._id ? "Cancelling…" : "Cancel & Refund"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Student Profile Modal */}
      {profileBooking && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setProfileBooking(null)}
        >
          <div
            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-semibold text-zinc-400">Student Info</p>
              <button onClick={() => setProfileBooking(null)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar + name */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold mb-3">
                {getInitials(profileBooking)}
              </div>
              <p className="text-lg font-bold text-white">{getStudentName(profileBooking)}</p>
              <span className="text-xs text-zinc-500 capitalize mt-0.5">
                {profileBooking.studentId?.userType || "student"}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              {profileBooking.studentId?.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                  <span className="text-zinc-300 break-all">{profileBooking.studentId.email}</span>
                </div>
              )}
              {profileBooking.studentId?.mobile && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                  <span className="text-zinc-300">{profileBooking.studentId.mobile}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span className="text-zinc-300">
                  {SESSION_LABELS[profileBooking.sessionType] || profileBooking.sessionType}
                  {profileBooking.sessionType === "placementAccelerator"
                    ? ` · Week of ${profileBooking.weekLabel || new Date(profileBooking.scheduledDate).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}`
                    : ` · ${new Date(profileBooking.scheduledDate).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}`}
                </span>
              </div>
              {profileBooking.sessionType !== "placementAccelerator" && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                  <span className="text-zinc-300">
                    {new Date(profileBooking.scheduledDate).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" })} · {profileBooking.duration} min
                  </span>
                </div>
              )}
              {profileBooking.amount != null && (
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                  <span className="text-zinc-300">Paid ₹{profileBooking.amount}</span>
                </div>
              )}
            </div>

            {/* Notes */}
            {profileBooking.studentNotes && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-400">
                <p className="text-zinc-500 mb-1 font-semibold uppercase tracking-wide">Notes</p>
                "{profileBooking.studentNotes}"
              </div>
            )}

            {/* Resume */}
            {profileBooking.resumeFile?.url && (
              <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs flex justify-between items-center text-zinc-400">
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-zinc-500 mb-0.5 font-semibold uppercase tracking-wide">Resume</p>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {profileBooking.resumeFile.originalName || "resume.pdf"}
                  </p>
                </div>
                <a
                  href={profileBooking.resumeFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-400/20 hover:bg-cyan-500/25 transition font-semibold shrink-0 text-[11px]"
                >
                  <FileDown size={13} />
                  Download
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
