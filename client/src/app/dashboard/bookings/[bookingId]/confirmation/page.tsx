'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';
import { CheckCircle, Download, Mail, Calendar, Clock, User, DollarSign } from 'lucide-react';

interface Payment {
  invoiceNumber: string;
  amount: number;
  createdAt: string;
}

interface Booking {
  _id: string;
  title: string;
  description: string;
  mentorId: { name: string; email: string };
  sessionType: string;
  scheduledDate: string;
  duration: number;
  amount?: number;
  paymentStatus?: string;
  invoiceNumber?: string;
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingAndPayment();
  }, [bookingId]);

  const fetchBookingAndPayment = async () => {
    try {
      const bookingResponse = await api.get(`/bookings/${bookingId}`);
      setBooking(bookingResponse.data.booking);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load booking details');
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
    if (!booking?.invoiceNumber) {
      toast.error('Invoice number not found');
      return;
    }

    try {
      const response = await api.get(`/payments/invoice/${booking.invoiceNumber}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${booking.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
          <Link href="/dashboard/bookings" className="text-blue-400 hover:underline">
            Back to bookings
          </Link>
        </div>
      </div>
    );
  }

  const bookedDate = new Date(booking.scheduledDate);
  const gst = booking.amount ? Math.round(booking.amount * 0.18) : 0;
  const total = (booking.amount || 0) + gst;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-400">Your booking has been confirmed and payment received.</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800 mb-8">
          <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

          <div className="space-y-6 mb-8 pb-8 border-b border-zinc-700">
            <div>
              <p className="text-gray-400 text-sm mb-2">Session Title</p>
              <p className="text-xl font-semibold">{booking.title}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <User size={20} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">Mentor</p>
                  <p className="font-semibold">{booking.mentorId.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock size={20} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">Duration</p>
                  <p className="font-semibold">{booking.duration} minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-3 md:col-span-2">
                <Calendar size={20} className="text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">Scheduled Date & Time</p>
                  <p className="font-semibold">{bookedDate.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">Description</p>
              <p className="text-gray-300">{booking.description}</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-bold mb-4">Payment Summary</h3>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Session Fee</span>
              <span className="font-semibold">₹{booking.amount}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">GST (18%)</span>
              <span className="font-semibold">₹{gst}</span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-zinc-700 text-lg">
              <span className="font-bold">Total Paid</span>
              <span className="text-green-400 font-bold">₹{total}</span>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-700">
              <p className="text-gray-400 text-sm">Invoice Number</p>
              <p className="font-mono text-sm">{booking.invoiceNumber}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={downloadInvoice}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Download Invoice
            </button>

            <button
              onClick={() => {
                // Send confirmation email to mentor
                toast.info('Confirmation email sent to mentor');
              }}
              className="w-full bg-zinc-800 hover:bg-zinc-700 px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <Mail size={20} />
              Send Mentor Notification
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-green-900 bg-opacity-30 border border-green-500 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-green-300 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-green-300 text-sm">
            <li>✓ Your booking request has been submitted to the mentor</li>
            <li>✓ The mentor will review and confirm your session within 24 hours</li>
            <li>✓ You'll receive an email confirmation with the Zoom meeting link</li>
            <li>✓ Join the session 5 minutes before the scheduled time</li>
          </ul>
        </div>

        {/* Back to Bookings */}
        <div className="text-center">
          <Link
            href="/dashboard/bookings"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Back to Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
