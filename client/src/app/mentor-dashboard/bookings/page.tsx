'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI, bookingAPI, getAuthToken, removeAuthToken } from '@/lib/api';

interface Booking {
  _id: string;
  studentId: {
    name: string;
    email: string;
    mobile: string;
    profileImage?: string;
  };
  sessionType: string;
  title: string;
  scheduledDate: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  studentNotes: string;
  meetingLink?: string;
}

export default function MentorBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'all'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [meetingLink, setMeetingLink] = useState('');

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await authAPI.getCurrentUser();
        if (response.data.user.userType !== 'admin') {
          toast.error('Only admins can access this page');
          router.push('/dashboard');
          return;
        }

        fetchBookings();
      } catch (err: any) {
        if (err.response?.status === 401) {
          removeAuthToken();
          router.push('/login');
        }
      }
    };

    verifyAdmin();
  }, [router]);

  const fetchBookings = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }

      setIsLoading(true);
      const response = await bookingAPI.getMentorBookings();
      setBookings(response.data.bookings || []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        removeAuthToken();
        router.push('/login');
      } else {
        toast.error('Failed to load bookings');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    switch (activeTab) {
      case 'pending':
        return bookings.filter((b) => b.status === 'pending');
      case 'confirmed':
        return bookings.filter((b) => b.status === 'confirmed');
      default:
        return bookings;
    }
  };

  const handleConfirm = async (bookingId: string) => {
    if (!meetingLink) {
      toast.error('Please enter a meeting link');
      return;
    }

    try {
      await bookingAPI.updateBookingStatus(bookingId, {
        status: 'confirmed',
        meetingLink,
      });
      setBookings(bookings.map((b) => (b._id === bookingId ? { ...b, status: 'confirmed', meetingLink } : b)));
      setSelectedBooking(null);
      setMeetingLink('');
      toast.success('Booking confirmed');
    } catch (err) {
      toast.error('Failed to confirm booking');
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, {
        status: 'cancelled',
      });
      setBookings(bookings.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b)));
      toast.success('Booking rejected');
    } catch (err) {
      toast.error('Failed to reject booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400 bg-green-500/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'completed':
        return 'text-blue-400 bg-blue-500/10';
      case 'cancelled':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-zinc-400 bg-zinc-500/10';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border border-white/20 border-t-white" />
      </div>
    );
  }

  const filteredBookings = filterBookings();

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Back Navigation */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/mentor-dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors w-fit">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Session Bookings</h1>
          <p className="text-zinc-400">Manage student booking requests and confirmed sessions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 rounded-lg bg-white/5 border border-white/10 w-fit">
          {['pending', 'confirmed', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-md transition-all font-medium capitalize ${
                activeTab === tab ? 'bg-white text-zinc-900' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Bookings List */}
          <div className={selectedBooking ? 'lg:col-span-2' : 'lg:col-span-3'}>
            {filteredBookings.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-12 text-center">
                <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                <p className="text-zinc-400">No {activeTab} bookings</p>
              </div>
            ) : (
              <motion.div
                className="grid gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
              >
                {filteredBookings.map((booking, idx) => {
                  const bookingDate = new Date(booking.scheduledDate);
                  const formattedDate = bookingDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const formattedTime = bookingDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const isConfirmed = booking.status === 'confirmed';

                  return (
                    <motion.button
                      key={booking._id}
                      onClick={() => setSelectedBooking(booking)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`rounded-2xl border-2 transition-all p-6 text-left ${
                        selectedBooking?._id === booking._id
                          ? isConfirmed
                            ? 'border-emerald-600 bg-emerald-500/15'
                            : 'border-blue-500 bg-blue-500/10'
                          : isConfirmed
                          ? 'border-emerald-700/50 bg-emerald-900/20 hover:border-emerald-600/50'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {booking.studentId.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-white">{booking.title}</p>
                            <p className="text-sm text-zinc-400">{booking.studentId.name}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formattedTime} • {booking.duration} min</span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Booking Details */}
          {selectedBooking && (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sticky top-20 max-h-96 overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-6">Booking Details</h3>

              <div className="space-y-4">
                {/* Student Info */}
                <div>
                  <p className="text-xs text-zinc-500 mb-2">Student</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-zinc-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">{selectedBooking.studentId.name}</p>
                      <p className="text-xs text-zinc-600">{selectedBooking.studentId.email}</p>
                    </div>
                  </div>
                </div>

                {/* Session Type */}
                <div>
                  <p className="text-xs text-zinc-500 mb-2">Session Type</p>
                  <p className="text-sm text-white font-medium capitalize">{selectedBooking.sessionType.replace('-', ' ')}</p>
                </div>

                {/* Student Notes */}
                {selectedBooking.studentNotes && (
                  <div>
                    <p className="text-xs text-zinc-500 mb-2">Student Notes</p>
                    <p className="text-sm text-zinc-300 bg-white/5 rounded p-2 border border-white/10">
                      {selectedBooking.studentNotes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-white/10">
                  {selectedBooking.status === 'pending' && (
                    <>
                      <div className="mb-4">
                        <label className="block text-xs text-zinc-500 mb-2">Meeting Link *</label>
                        <input
                          type="url"
                          value={meetingLink}
                          onChange={(e) => setMeetingLink(e.target.value)}
                          placeholder="https://zoom.us/j/..."
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none transition-colors text-sm"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirm(selectedBooking._id)}
                          className="flex-1 px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleReject(selectedBooking._id)}
                          className="flex-1 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </>
                  )}

                  {selectedBooking.status === 'confirmed' && selectedBooking.meetingLink && (
                    <a
                      href={selectedBooking.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors text-center"
                    >
                      Join Meeting
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
