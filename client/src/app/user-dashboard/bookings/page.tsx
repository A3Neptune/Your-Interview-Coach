'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar, MessageCircle, Clock, ExternalLink,
  MessageSquare, User, IndianRupee, ChevronDown, ChevronUp,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const isPA = (b: Booking) => b.sessionType === 'placementAccelerator';
const paWeekEnded = (b: Booking) => new Date(b.scheduledDate).getTime() + WEEK_MS < Date.now();

const getWhatsappLink = (booking: Booking) => {
  const phone = booking.mentorId?.mobile?.replace(/\D/g, '') || '919718713646';
  const msg = `Hi, I enrolled in "${booking.title}" scheduled for ${new Date(booking.scheduledDate).toLocaleDateString('en-IN')}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
};

interface Booking {
  _id: string;
  title: string;
  description: string;
  scheduledDate: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  sessionType: string;
  weekLabel?: string;
  meetingLink?: string;
  topic?: string;
  mentorId: {
    _id: string;
    fullName: string;
    name: string;
    email: string;
    mobile?: string;
    profileImage?: string;
  };
  studentNotes?: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700',
  confirmed: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-blue-50 text-blue-700',
  cancelled: 'bg-red-50 text-red-700',
  'no-show': 'bg-orange-50 text-orange-700',
};

const STATUS_DOT: Record<string, string> = {
  pending:   'bg-amber-400',
  confirmed: 'bg-emerald-500 animate-pulse',
  completed: 'bg-blue-500',
  cancelled: 'bg-red-400',
  'no-show': 'bg-orange-400',
};

const PAY_STYLES: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700',
  completed: 'bg-emerald-50 text-emerald-700',
  failed:    'bg-red-50 text-red-700',
  refunded:  'bg-purple-50 text-purple-700',
};

function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-slate-100 rounded-lg ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Shimmer className="h-5 w-24 rounded-full" />
        <Shimmer className="h-5 w-16 rounded-full" />
      </div>
      <Shimmer className="h-6 w-3/4" />
      <div className="grid grid-cols-2 gap-3">
        <Shimmer className="h-12 rounded-xl" />
        <Shimmer className="h-12 rounded-xl" />
        <Shimmer className="h-12 rounded-xl" />
        <Shimmer className="h-12 rounded-xl" />
      </div>
      <div className="flex gap-3 pt-2">
        <Shimmer className="h-10 w-36 rounded-xl" />
        <Shimmer className="h-10 w-36 rounded-xl" />
      </div>
    </div>
  );
}

function UserBookingsContent() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) { setIsLoading(false); return; }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${API_URL}/bookings/student`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setBookings(response.data.bookings || []);
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status !== 401) toast.error('Failed to load bookings');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleAddNotes = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await axios.put(`${API_URL}/bookings/${bookingId}/notes`, { studentNotes: notes }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success('Notes saved');
      setShowNotes(false);
      setNotes('');
      fetchBookings();
    } catch {
      toast.error('Failed to save notes');
    }
  };

  const canJoinNow = (scheduledDate: string, duration: number) => {
    const start = new Date(scheduledDate).getTime();
    const end = start + duration * 60 * 1000;
    return now >= start - 10 * 60 * 1000 && now <= end;
  };

  const getJoinCountdown = (scheduledDate: string) => {
    const start = new Date(scheduledDate).getTime();
    const diff = start - now;
    if (diff <= 0) return null;
    const mins = Math.ceil(diff / 60000);
    if (mins > 60) return null;
    return `Opens in ${mins} min`;
  };

  const filteredBookings = bookings.filter(b => filter === 'all' || b.status === filter);
  const displayedBookings = showAll ? filteredBookings : filteredBookings.slice(0, 5);
  const hasMore = filteredBookings.length > 5;

  const upcomingList = bookings
    .filter(b => b.status !== 'cancelled' && (isPA(b) ? !paWeekEnded(b) : new Date(b.scheduledDate) > new Date()))
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  return (
    <div className="space-y-8">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=DM+Sans:wght@400;500;700&display=swap");
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}</style>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>My Bookings</h1>
        <p className="text-slate-500 text-sm mt-1">View and manage your scheduled sessions</p>
      </div>

      {/* Upcoming alert */}
      {upcomingList.length > 0 && (() => {
        const next = upcomingList[0];
        const pa = isPA(next);
        const label = pa
          ? (() => {
              const ws = new Date(next.scheduledDate);
              const we = new Date(ws.getTime() + WEEK_MS);
              return `Week of ${ws.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${we.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            })()
          : new Date(next.scheduledDate).toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit',
            });
        return (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-900 font-bold text-sm">
                {upcomingList.length} Upcoming Session{upcomingList.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-blue-700 font-medium mt-0.5">Next: {label}</p>
            </div>
          </div>
        );
      })()}

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-fit">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(status => (
          <button
            key={status}
            onClick={() => { setFilter(status); setShowAll(false); }}
            className={`px-4 py-2 rounded-lg font-bold transition-all capitalize text-xs ${
              filter === status
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {status} ({status === 'all' ? bookings.length : bookings.filter(b => b.status === status).length})
          </button>
        ))}
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-14 text-center space-y-4">
          <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
          <div>
            <p className="text-slate-700 font-semibold text-sm">No bookings found</p>
            <p className="text-slate-400 text-xs mt-1">
              {filter === 'all' ? "You haven't made any bookings yet." : `No ${filter} bookings.`}
            </p>
          </div>
          {filter === 'all' && (
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Explore Services
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedBookings.map((booking) => {
              const pa = isPA(booking);
              const weekEnded = pa && paWeekEnded(booking);

              const jitsiRoom = booking.sessionType === 'webinars'
                ? `yic-webinar-${booking.mentorId?._id || booking.mentorId}-${new Date(booking.scheduledDate).getTime()}`
                : `yic-session-${booking._id}`;
              const sessionLink = booking.meetingLink || `https://meet.jit.si/${jitsiRoom}`;

              const expired = now > new Date(booking.scheduledDate).getTime() + booking.duration * 60000;
              const joinable = canJoinNow(booking.scheduledDate, booking.duration);
              const countdown = getJoinCountdown(booking.scheduledDate);

              const dateLabel = pa
                ? (() => {
                    const ws = new Date(booking.scheduledDate);
                    const we = new Date(ws.getTime() + WEEK_MS);
                    return `${ws.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${we.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                  })()
                : new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric',
                    year: 'numeric', hour: '2-digit', minute: '2-digit',
                  });

              return (
                <div
                  key={booking._id}
                  className={`rounded-2xl border border-slate-200 bg-white shadow-sm p-6 hover:shadow-md transition-all ${weekEnded ? 'opacity-60' : ''}`}
                >
                  {/* Card header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 leading-snug" style={{ fontFamily: "'Fraunces', serif" }}>
                        {booking.title}
                      </h3>
                      {!pa && booking.description && (
                        <p className="text-slate-500 text-xs mt-1 line-clamp-2">{booking.description}</p>
                      )}
                      {pa && (
                        <p className="text-xs text-slate-400 mt-1">Placement Accelerator programme</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[booking.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[booking.status]}`} />
                        {booking.status}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${PAY_STYLES[booking.paymentStatus]}`}>
                        {booking.paymentStatus}
                      </span>
                      {weekEnded && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-500">
                          Week ended
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 py-4 border-y border-slate-100">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-blue-50">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{pa ? 'Week' : 'Date & Time'}</p>
                        <p className="text-xs text-slate-800 font-semibold leading-snug">{dateLabel}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-purple-50">
                        <Clock className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Duration</p>
                        <p className="text-xs text-slate-800 font-semibold">{booking.duration} mins</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-orange-50">
                        <User className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Mentor</p>
                        <p className="text-xs text-slate-800 font-semibold">{booking.mentorId?.fullName || booking.mentorId?.name || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-50">
                        <IndianRupee className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Amount</p>
                        <p className="text-xs text-slate-800 font-semibold">₹{booking.amount}</p>
                      </div>
                    </div>

                    {booking.sessionType === 'webinars' && booking.topic && (
                      <div className="flex items-start gap-2.5 col-span-2">
                        <div className="p-2 rounded-xl bg-cyan-50">
                          <BookOpen className="w-4 h-4 text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Topic</p>
                          <p className="text-xs text-slate-800 font-semibold">{booking.topic}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2.5">
                    {!pa && booking.status === 'confirmed' && (() => {
                      if (expired) return (
                        <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-400 text-[11px] font-bold border border-slate-100 cursor-not-allowed">
                          <Clock className="w-3.5 h-3.5" />
                          Session Ended
                        </span>
                      );
                      if (joinable) return (
                        <a
                          href={sessionLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          JOIN MEETING
                        </a>
                      );
                      if (countdown) return (
                        <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-100 cursor-not-allowed">
                          <Clock className="w-3.5 h-3.5" />
                          {countdown}
                        </span>
                      );
                      return (
                        <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-400 text-[11px] font-bold border border-slate-100 cursor-not-allowed">
                          <Clock className="w-3.5 h-3.5" />
                          Link active 10 min before
                        </span>
                      );
                    })()}

                    <a
                      href={getWhatsappLink(booking)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp Mentor
                    </a>

                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setNotes(booking.studentNotes || '');
                        setShowNotes(true);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Notes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                {showAll ? (
                  <><ChevronUp className="w-4 h-4" /> View Less</>
                ) : (
                  <><ChevronDown className="w-4 h-4" /> View {filteredBookings.length - 5} More</>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Notes modal */}
      {showNotes && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-7 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Fraunces', serif" }}>Session Notes</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedBooking.title}</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add your notes for this session..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 focus:outline-none mb-4 text-sm"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowNotes(false); setNotes(''); setSelectedBooking(null); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddNotes(selectedBooking._id)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition shadow-sm"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserBookingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600" />
      </div>
    }>
      <UserBookingsContent />
    </Suspense>
  );
}
