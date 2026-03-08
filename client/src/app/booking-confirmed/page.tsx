'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Calendar, Clock, User, DollarSign, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface BookingDetails {
  _id: string;
  title: string;
  description: string;
  scheduledDate: string;
  duration: number;
  status: string;
  amount: number;
  paymentStatus: string;
  meetingLink?: string;
  mentorId: {
    _id: string;
    fullName: string;
    name: string;
    email: string;
  };
  studentId: {
    _id: string;
    fullName: string;
    name: string;
    email: string;
  };
  invoiceNumber?: string;
}

function BookingConfirmedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (!bookingId) {
      toast.error('No booking ID provided');
      router.push('/');
      return;
    }
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(
        `${API_URL}/bookings/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setBooking(response.data.booking);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Failed to load booking details');
      setIsLoading(false);
      router.push('/');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownloadReceipt = async () => {
    try {
      toast.success('Receipt download initiated');
      // This would integrate with a PDF generation service
      console.log('Downloading receipt for booking:', bookingId);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Failed to download receipt');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Booking Not Found</h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
              <CheckCircle size={80} className="text-green-500 relative" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-zinc-400">Your session has been successfully scheduled</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl p-8 mb-8">
          <div className="space-y-6">
            {/* Session Title */}
            <div className="border-b border-zinc-700 pb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{booking.title}</h2>
              <p className="text-zinc-400">{booking.description}</p>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Scheduled Date & Time */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Calendar className="text-blue-400" size={24} />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm mb-1">Scheduled Date & Time</p>
                  <p className="text-white font-semibold">{formatDate(booking.scheduledDate)}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Clock className="text-purple-400" size={24} />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm mb-1">Duration</p>
                  <p className="text-white font-semibold">{booking.duration} minutes</p>
                </div>
              </div>

              {/* Mentor */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <User className="text-orange-400" size={24} />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm mb-1">Mentor</p>
                  <p className="text-white font-semibold">
                    {booking.mentorId.fullName || booking.mentorId.name}
                  </p>
                  <p className="text-zinc-500 text-xs">{booking.mentorId.email}</p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <DollarSign className="text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm mb-1">Amount Paid</p>
                  <p className="text-white font-semibold">₹{booking.amount}</p>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="pt-6 border-t border-zinc-700">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Payment Status</span>
                <span
                  className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                    booking.paymentStatus === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                </span>
              </div>
            </div>

            {/* Meeting Link (when available) */}
            {booking.meetingLink && (
              <div className="pt-6 border-t border-zinc-700">
                <p className="text-zinc-400 text-sm mb-3">Meeting Link</p>
                <a
                  href={booking.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                >
                  Join Zoom Meeting
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleDownloadReceipt}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition"
          >
            <Download size={20} />
            Download Receipt
          </button>
          <button
            onClick={() => router.push('/user-dashboard/bookings')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            View All Bookings
          </button>
        </div>

        {/* Next Steps */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">What's Next?</h3>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex gap-3">
              <span className="text-blue-400 font-bold">1</span>
              <span>Check your email for session details and meeting link</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 font-bold">2</span>
              <span>Join the Zoom meeting 5 minutes before the scheduled time</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 font-bold">3</span>
              <span>Have your questions ready and make the most of your session</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 font-bold">4</span>
              <span>Provide feedback after the session to help us improve</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmedPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-black"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>}>
      <BookingConfirmedContent />
    </Suspense>
  );
}
