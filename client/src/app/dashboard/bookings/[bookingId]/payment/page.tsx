'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';
import { ChevronLeft, Clock, DollarSign, User } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
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
}

export default function BookingPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
    loadRazorpayScript();
  }, [bookingId]);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const fetchBookingDetails = async () => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      setBooking(response.data.booking);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load booking details');
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking) return;

    setProcessing(true);
    try {
      // Create payment order
      const orderResponse = await api.post(`/bookings/${bookingId}/create-payment`);

      const order = orderResponse.data.order;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: order.id,
        amount: booking.amount! * 100,
        currency: 'INR',
        name: 'Career Coach LMS',
        description: `${booking.title} - Booking Payment`,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await api.post(
              `/bookings/${bookingId}/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            toast.success('Payment successful!');
            router.push(`/dashboard/bookings/${bookingId}/confirmation`);
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: booking.mentorId.name,
          email: booking.mentorId.email,
        },
        theme: {
          color: '#3b82f6',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Failed to initiate payment');
    } finally {
      setProcessing(false);
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
      <Link href={`/dashboard/bookings/${bookingId}`} className="inline-flex items-center gap-2 text-blue-400 hover:underline mb-6">
        <ChevronLeft size={20} />
        Back to Booking
      </Link>

      <div className="max-w-2xl mx-auto bg-zinc-900 rounded-lg p-8 border border-zinc-800">
        <h1 className="text-3xl font-bold mb-8">Payment Confirmation</h1>

        {/* Booking Summary */}
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
              <User size={20} className="text-blue-400" />
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

        {/* Price Breakdown */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Session Fee</span>
            <span className="font-semibold">₹{booking.amount}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">GST (18%)</span>
            <span className="font-semibold">₹{gst}</span>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-zinc-700 text-lg">
            <span className="font-bold">Total Amount</span>
            <span className="text-blue-400 font-bold">₹{total}</span>
          </div>
        </div>

        {/* Payment Notice */}
        <div className="bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg p-4 mb-8">
          <p className="text-blue-300 text-sm">
            Please note: Payment must be completed before the mentor confirms your booking. After successful payment, the mentor will receive a notification to confirm the session.
          </p>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2"
        >
          <DollarSign size={20} />
          {processing ? 'Processing...' : `Pay ₹${total}`}
        </button>

        {/* Security Notice */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>💳 Secure payment powered by Razorpay</p>
          <p className="mt-2">Your payment is completely secure and encrypted</p>
        </div>
      </div>
    </div>
  );
}
