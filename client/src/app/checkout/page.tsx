'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2, CheckCircle } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Service {
  id: string;
  name: string;
  price: number;
  title: string;
  value: string;
  duration: number;
  discount?: {
    type: 'percentage' | 'fixed' | 'none';
    value: number;
    isActive: boolean;
  };
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [mentorId, setMentorId] = useState<string | null>(null);

  const serviceId = searchParams.get('serviceId');
  const slotData = searchParams.get('slot');
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Parse slot from URL param
    if (slotData) {
      try {
        setSelectedSlot(JSON.parse(decodeURIComponent(slotData)));
      } catch { /* invalid slot param — handled in render */ }
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please login first');
      router.push(`/login?redirect=/checkout?serviceId=${serviceId}`);
      return;
    }

    // Preload Razorpay script immediately in background
    if (!document.querySelector('script[src*="razorpay"]')) {
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.async = true;
      document.body.appendChild(s);
    }

    checkAuthAndLoadData(token);
  }, [slotData]);

  const checkAuthAndLoadData = async (token: string) => {
    try {
      // Fire all 3 requests in parallel — user, pricing, mentor
      const [userRes, pricingRes, mentorRes] = await Promise.all([
        axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
        axios.get(`${API_URL}/pricing-section/public`),
        axios.get(`${API_URL}/bookings/mentors`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
      ]);

      setUser(userRes.data.user);

      const selectedService = pricingRes.data.services.find((s: Service) => s.id === serviceId);
      if (!selectedService) {
        toast.error('Service not found');
        router.push('/');
        return;
      }
      setService(selectedService);

      const mid = mentorRes.data.mentors[0]?._id;
      if (mid) setMentorId(mid);

      setIsLoading(false);
    } catch {
      toast.error('Failed to load checkout');
      setIsLoading(false);
    }
  };

  const getDiscountedPrice = () => {
    if (!service) return 0;

    if (!service.discount?.isActive || service.discount.type === 'none') {
      return service.price;
    }

    let discount = 0;
    if (service.discount.type === 'percentage') {
      discount = (service.price * service.discount.value) / 100;
    } else {
      discount = service.discount.value;
    }

    return Math.max(0, service.price - discount);
  };

  const getGST = () => {
    const discountedPrice = getDiscountedPrice();
    return discountedPrice * 0.18; // 18% GST
  };

  const getFinalAmount = () => {
    return getDiscountedPrice() + getGST();
  };

  const handlePayment = async () => {
    if (!service || !user || !selectedSlot) {
      toast.error('Missing required information');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }

    try {
      setIsProcessing(true);

      // Use preloaded mentorId; fall back to fetch if somehow missing
      let mid = mentorId;
      if (!mid) {
        const res = await axios.get(`${API_URL}/bookings/mentors`, {
          headers: { Authorization: `Bearer ${token}` }, withCredentials: true,
        });
        mid = res.data.mentors[0]?._id;
      }
      if (!mid) {
        toast.error('No mentor available');
        setIsProcessing(false);
        return;
      }

      // Use slot duration (dynamic), fall back to 60
      const durationMinutes = selectedSlot.duration || 60;

      // Create booking (amount calculated server-side)
      const bookingRes = await axios.post(
        `${API_URL}/bookings`,
        {
          mentorId: mid,
          sessionType: serviceId,
          title: `${service.name} Session`,
          description: 'Booked through marketplace',
          scheduledDate: `${selectedSlot.date}T${selectedSlot.time}:00+05:30`,
          duration: durationMinutes,
        },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      const bookingId = bookingRes.data.booking._id;

      // Wait for Razorpay to be ready (was preloaded on mount)
      await new Promise<void>((resolve) => {
        if (window.Razorpay) return resolve();
        const interval = setInterval(() => {
          if (window.Razorpay) { clearInterval(interval); resolve(); }
        }, 100);
        setTimeout(() => { clearInterval(interval); resolve(); }, 5000);
      });

      if (!window.Razorpay) {
        toast.error('Payment gateway failed to load');
        setIsProcessing(false);
        return;
      }

      // Create payment order
      const orderRes = await axios.post(
        `${API_URL}/bookings/${bookingId}/create-payment`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      const razorpayOrder = orderRes.data.order;
      const razorpayKey   = orderRes.data.keyId;

      const razorpayInstance = new window.Razorpay({
        key: razorpayKey,
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'YourInterviewCoach',
        description: `${service.name} Session`,
        handler: async (response: any) => {
          try {
            const verifyId = toast.loading('Verifying payment...');
            const verifyRes = await axios.post(
              `${API_URL}/bookings/${bookingId}/verify-payment`,
              {
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );
            toast.dismiss(verifyId);
            if (verifyRes.data.success) {
              toast.success('Payment successful! Booking confirmed.');
              setTimeout(() => router.push('/user-dashboard/bookings'), 1500);
            } else {
              toast.error('Payment verification failed');
              setIsProcessing(false);
            }
          } catch (err: any) {
            toast.error(err.response?.data?.error || 'Payment verification failed');
            setIsProcessing(false);
          }
        },
        prefill: { name: user.fullName || user.name, email: user.email },
        theme: { color: '#1d4ed8' },
        modal: {
          ondismiss: async () => {
            // Release the 15-minute payment lock so the slot becomes available again
            try {
              await axios.post(
                `${API_URL}/bookings/${bookingId}/release-payment-lock`,
                {},
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
              );
            } catch { /* lock auto-expires after 15 min anyway */ }
            toast.error('Payment cancelled. Your slot has been released.');
            setIsProcessing(false);
          },
        },
      });

      // payment.failed fires when a card is declined / network drops inside the modal.
      // The Razorpay modal STAYS OPEN so the user can retry with a different card.
      // Do NOT release the lock here — wait for ondismiss (modal close) to free the slot.
      razorpayInstance.on('payment.failed', () => {
        toast.error('Payment failed. You can retry with a different card.');
      });

      razorpayInstance.open();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to process payment');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!service || !user || !selectedSlot) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Booking information incomplete</h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => router.back()}
          className="text-slate-600 hover:text-blue-600 transition mb-6 flex items-center gap-1 text-sm font-semibold"
        >
          ← Back
        </button>

        <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Checkout</h1>

          <div className="mb-6 pb-6 border-b-2 border-blue-100">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Service</p>
            <p className="text-slate-900 font-bold text-xl">{service.name}</p>
            <p className="text-slate-700 text-sm mt-2 font-medium">{service.title}</p>
            <p className="text-blue-600 text-sm mt-1 font-semibold">{service.value}</p>
          </div>

          <div className="mb-6 pb-6 border-b-2 border-blue-100">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Scheduled Date & Time</p>
            <p className="text-slate-900 font-bold text-lg">
              {new Date(`${selectedSlot.date}T${selectedSlot.time}`).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <p className="text-blue-600 text-sm mt-1 font-semibold">
              {(() => {
                const [sh, sm] = selectedSlot.time.split(':').map(Number);
                const duration = selectedSlot.duration || 60;
                const endTotal = sh * 60 + sm + duration;
                const eh = Math.floor(endTotal / 60);
                const em = endTotal % 60;
                const fmt = (h: number, m: number) => {
                  const p = h >= 12 ? 'PM' : 'AM';
                  const d = h > 12 ? h - 12 : h === 0 ? 12 : h;
                  return m === 0 ? `${d} ${p}` : `${d}:${String(m).padStart(2,'0')} ${p}`;
                };
                return `${fmt(sh, sm)} – ${fmt(eh, em)} (${duration} min)`;
              })()}
            </p>
          </div>

          <div className="mb-6 pb-6 border-b-2 border-blue-100">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Customer</p>
            <p className="text-slate-900 font-bold text-lg">{user.fullName || user.name}</p>
            <p className="text-slate-600 text-sm font-medium">{user.email}</p>
          </div>

          <div className="mb-6 pb-6 border-b-2 border-blue-100">
            {service.discount?.isActive && service.discount.type !== 'none' ? (
              <>
                <div className="flex justify-between mb-3">
                  <p className="text-slate-600 font-medium">Original Price</p>
                  <p className="text-slate-500 line-through font-medium">₹{service.price}</p>
                </div>
                <div className="mb-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-xl">
                  <div className="flex justify-between mb-1">
                    <p className="text-emerald-700 font-bold text-sm">
                      {service.discount.type === 'percentage'
                        ? `${service.discount.value}% Discount`
                        : `Special Discount`}
                    </p>
                    <p className="text-emerald-700 font-black text-lg">
                      -₹{Math.round(
                        service.discount.type === 'percentage'
                          ? (service.price * service.discount.value) / 100
                          : service.discount.value
                      )}
                    </p>
                  </div>
                  <p className="text-emerald-600 text-xs font-semibold">🎉 Great deal on this service!</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-slate-600 font-medium">Tax (GST 18%)</p>
                  <p className="text-slate-900 font-bold">₹{Math.round(getGST())}</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between mb-3">
                  <p className="text-slate-600 font-medium">Price per session</p>
                  <p className="text-slate-900 font-bold text-lg">₹{service.price}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-slate-600 font-medium">Tax (GST 18%)</p>
                  <p className="text-slate-900 font-bold">₹{Math.round(getGST())}</p>
                </div>
              </>
            )}
          </div>

          <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl">
            <div className="flex justify-between items-center">
              <p className="text-slate-900 font-bold text-lg">Total Amount</p>
              <p className="text-blue-600 font-black text-3xl">₹{Math.round(getFinalAmount())}</p>
            </div>
            <p className="text-blue-600 text-xs mt-1 font-semibold">Includes 18% GST</p>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Complete Booking
              </>
            )}
          </button>

          <p className="text-slate-600 text-xs text-center mt-4 font-medium">
            💳 Secure payment powered by Razorpay. Your booking will be confirmed after successful payment.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
