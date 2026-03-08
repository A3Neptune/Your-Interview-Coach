'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User, DollarSign, ExternalLink, MessageSquare, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Booking {
  _id: string;
  title: string;
  description: string;
  scheduledDate: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  meetingLink?: string;
  mentorId: {
    _id: string;
    fullName: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  studentNotes?: string;
}

const statusColors = {
  pending: 'bg-amber-50 text-amber-700 border-amber-300',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  completed: 'bg-blue-50 text-blue-700 border-blue-300',
  cancelled: 'bg-red-50 text-red-700 border-red-300',
  'no-show': 'bg-orange-50 text-orange-700 border-orange-300',
};

const paymentStatusColors = {
  pending: 'bg-amber-50 text-amber-700 border-amber-300',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  failed: 'bg-red-50 text-red-700 border-red-300',
  refunded: 'bg-purple-50 text-purple-700 border-purple-300',
};

const statusIcons = {
  pending: '🕐',
  confirmed: '✅',
  completed: '🎯',
  cancelled: '❌',
  'no-show': '⚠️',
};

function UserBookingsContent() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [showAll, setShowAll] = useState(false);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${API_URL}/bookings/student`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setBookings(response.data.bookings || []);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      if (error.response?.status === 401) {
        // Silently handle unauthorized - just show empty state
        setBookings([]);
      } else {
        toast.error('Failed to load bookings');
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddNotes = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      await axios.put(
        `${API_URL}/bookings/${bookingId}`,
        { studentNotes: notes },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success('Notes added successfully');
      setShowNotes(false);
      setNotes('');
      fetchBookings();
    } catch (error) {
      console.error('Error adding notes:', error);
      toast.error('Failed to add notes');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredBookings = bookings.filter(b => filter === 'all' || b.status === filter);
  const displayedBookings = showAll ? filteredBookings : filteredBookings.slice(0, 5);
  const hasMoreBookings = filteredBookings.length > 5;

  const isUpcoming = (date: string) => new Date(date) > new Date();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-10 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">My Bookings</h1>
        <p className="text-slate-600 font-medium">View and manage your scheduled sessions</p>
      </div>

      {/* Upcoming Sessions Alert */}
      {bookings.some(b => new Date(b.scheduledDate) > new Date() && b.status !== 'cancelled') && (
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 rounded-2xl p-5 shadow-md">
          <div className="flex items-start gap-3">
            <div className="text-3xl">📅</div>
            <div className="flex-1">
              <p className="text-slate-900 font-bold text-lg mb-1">
                {bookings.filter(b => new Date(b.scheduledDate) > new Date() && b.status !== 'cancelled').length} Upcoming Session{bookings.filter(b => new Date(b.scheduledDate) > new Date() && b.status !== 'cancelled').length !== 1 ? 's' : ''}
              </p>
              {bookings
                .filter(b => new Date(b.scheduledDate) > new Date() && b.status !== 'cancelled')
                .slice(0, 1)
                .map(b => (
                  <p key={b._id} className="text-sm text-blue-700 font-semibold">
                    Next: {new Date(b.scheduledDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap bg-white p-2 rounded-2xl border-2 border-blue-200 shadow-md">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(status => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setShowAll(false); // Reset to showing only 5 when filter changes
            }}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all capitalize text-sm ${
              filter === status
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-transparent text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {status} ({status === 'all' ? bookings.length : bookings.filter(b => b.status === status).length})
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-20 bg-white border-2 border-blue-200 rounded-2xl shadow-lg">
          <div className="text-7xl mb-4">📭</div>
          <p className="text-slate-600 font-semibold text-lg mb-6">No bookings found</p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md hover:shadow-lg"
          >
            Explore Services
          </button>
        </div>
      ) : (
        <>
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          >
            {displayedBookings.map((booking, idx) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border-2 border-blue-200 rounded-2xl p-6 hover:border-blue-400 transition-all hover:shadow-xl shadow-md"
            >
              {/* Header with Status */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{statusIcons[booking.status]}</span>
                    <h3 className="text-2xl font-bold text-slate-900">{booking.title}</h3>
                  </div>
                  {booking.description && (
                    <p className="text-slate-600 text-sm font-medium">{booking.description}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-4 py-2 rounded-xl text-xs font-bold border-2 ${statusColors[booking.status]}`}>
                    {booking.status}
                  </span>
                  <span className={`px-4 py-2 rounded-xl text-xs font-bold border-2 ${paymentStatusColors[booking.paymentStatus]}`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 py-5 border-t-2 border-b-2 border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100 border-2 border-blue-300">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1 font-bold uppercase tracking-wider">Date & Time</p>
                    <p className="text-sm text-slate-900 font-bold">{formatDate(booking.scheduledDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-100 border-2 border-purple-300">
                    <Clock size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1 font-bold uppercase tracking-wider">Duration</p>
                    <p className="text-sm text-slate-900 font-bold">{booking.duration} min</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-100 border-2 border-orange-300">
                    <User size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1 font-bold uppercase tracking-wider">Mentor</p>
                    <p className="text-sm text-slate-900 font-bold">{booking.mentorId?.fullName || booking.mentorId?.name || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 border-2 border-emerald-300">
                    <DollarSign size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1 font-bold uppercase tracking-wider">Amount</p>
                    <p className="text-sm text-slate-900 font-bold">₹{booking.amount}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {booking.meetingLink && booking.status === 'confirmed' && isUpcoming(booking.scheduledDate) && (
                  <a
                    href={booking.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    <ExternalLink size={18} />
                    Join Meeting
                  </a>
                )}

                {/* Chat Button - Available for confirmed/completed bookings */}
                {['confirmed', 'completed'].includes(booking.status) && (
                  <button
                    onClick={() => router.push('/user-dashboard/messages')}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle size={18} />
                    Chat
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setNotes(booking.studentNotes || '');
                    setShowNotes(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  <MessageSquare size={18} />
                  Notes
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View More/Less Button */}
        {hasMoreBookings && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-8 py-3 bg-white hover:bg-blue-50 text-blue-600 font-bold rounded-xl transition-all border-2 border-blue-200 hover:border-blue-400 shadow-md hover:shadow-lg"
            >
              {showAll ? (
                <>
                  <span>View Less</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>View More ({filteredBookings.length - 5} more)</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </>
      )}

      {/* Notes Modal */}
      {showNotes && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Session Notes</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add your notes for this session..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-blue-50 border-2 border-blue-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none mb-4 font-medium"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNotes(false);
                  setNotes('');
                  setSelectedBooking(null);
                }}
                className="flex-1 px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddNotes(selectedBooking._id)}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md hover:shadow-lg"
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>}>
      <UserBookingsContent />
    </Suspense>
  );
}
