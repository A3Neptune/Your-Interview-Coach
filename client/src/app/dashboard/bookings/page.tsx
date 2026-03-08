'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingAPI } from '@/lib/api';
import { getAuthToken, removeAuthToken } from '@/lib/api';

interface Booking {
  _id: string;
  mentorId: {
    name: string;
    designation: string;
    profileImage?: string;
  };
  sessionType: string;
  title: string;
  scheduledDate: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
  feedback?: {
    rating: number;
    comment: string;
  };
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push('/login');
          return;
        }

        setIsLoading(true);
        const response = await bookingAPI.getStudentBookings();
        setBookings(response.data.bookings || []);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
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

    fetchBookings();
  }, [router]);

  const filterBookings = () => {
    const now = new Date();

    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(
          (b) => new Date(b.scheduledDate) > now && b.status !== 'cancelled'
        );
      case 'completed':
        return bookings.filter(
          (b) => b.status === 'completed' || (new Date(b.scheduledDate) < now && b.status !== 'cancelled')
        );
      default:
        return bookings;
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Cancel this booking?')) return;

    try {
      await bookingAPI.cancelBooking(bookingId);
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error('Failed to cancel booking');
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

  const BookingCard = ({ booking }: { booking: Booking }) => {
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

    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {booking.mentorId.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{booking.title}</h3>
              <p className="text-sm text-zinc-400">{booking.mentorId.name}</p>
              <p className="text-xs text-zinc-600">{booking.mentorId.designation}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{formattedTime} • {booking.duration} minutes</span>
          </div>
          <div className="text-sm text-zinc-400 capitalize">
            <span className="inline-block px-2 py-1 rounded bg-white/5 text-xs">
              {booking.sessionType.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Link
            href={`/dashboard/bookings/${booking._id}`}
            className="flex-1 px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium transition-colors text-center"
          >
            View Details
          </Link>
          {booking.status === 'confirmed' && booking.meetingLink && (
            <a
              href={booking.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
            >
              Join Meeting
            </a>
          )}
          {booking.status === 'pending' && (
            <>
              <Link
                href={`/dashboard/bookings/${booking._id}/payment`}
                className="flex-1 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors text-center"
              >
                Pay Now
              </Link>
              <button
                onClick={() => handleCancel(booking._id)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </>
          )}
          {booking.status === 'completed' && booking.feedback?.rating && (
            <div className="flex-1 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Rated: {booking.feedback.rating}/5
            </div>
          )}
        </div>
      </div>
    );
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Sessions</h1>
          <p className="text-zinc-400">Manage your booking and mentorship sessions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 rounded-lg bg-white/5 border border-white/10 w-fit">
          {['upcoming', 'completed', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-md transition-all font-medium capitalize ${
                activeTab === tab
                  ? 'bg-white text-zinc-900'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-12 text-center">
            <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
            <p className="text-zinc-400">No {activeTab} sessions found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
