'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
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

  const serviceId = searchParams.get('serviceId');
  const slotData = searchParams.get('slot');

  useEffect(() => {
    checkAuthAndLoadData();

    // Decode slot data if present
    if (slotData) {
      try {
        const slot = JSON.parse(decodeURIComponent(slotData));
        setSelectedSlot(slot);
      } catch (e) {
        console.error('Error parsing slot data:', e);
      }
    }
  }, [slotData]);

  const checkAuthAndLoadData = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        toast.error('Please login first');
        router.push(`/login?redirect=/checkout?serviceId=${serviceId}`);
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      // Get current user
      const userRes = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setUser(userRes.data.user);

      // Get pricing data
      const pricingRes = await axios.get(`${API_URL}/pricing-section/public`);
      const selectedService = pricingRes.data.services.find((s: Service) => s.id === serviceId);

      if (!selectedService) {
        toast.error('Service not found');
        router.push('/');
        return;
      }

      setService(selectedService);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading checkout:', error);
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!service || !user || !selectedSlot) {
      toast.error('Missing required information');
      return;
    }

    try {
      setIsProcessing(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('authToken');

      // Step 1: Get admin mentor
      const mentorRes = await axios.get(`${API_URL}/bookings/mentors`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const mentorId = mentorRes.data.mentors[0]?._id;
      if (!mentorId) {
        toast.error('No mentor available');
        setIsProcessing(false);
        return;
      }

      // Calculate final price with discount
      const finalPrice = getDiscountedPrice();

      // Get duration in minutes (handle "60 mins" or just "60" format)
      const durationMatch = selectedSlot.duration?.toString().match(/\d+/) || service?.duration?.toString().match(/\d+/);
      const durationMinutes = durationMatch ? parseInt(durationMatch[0]) : 60;

      // Step 2: Create booking
      // NOTE: amount is NOT sent to the server - it's calculated server-side from pricing database
      // This prevents price tampering attacks
      const bookingRes = await axios.post(
        `${API_URL}/bookings`,
        {
          mentorId,
          sessionType: serviceId,
          title: `${service.name} Session`,
          description: `Booked through marketplace`,
          scheduledDate: `${selectedSlot.date}T${selectedSlot.time}`,
          duration: durationMinutes,
          // amount is NOT included - server calculates it from pricing database
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const bookingId = bookingRes.data.booking._id;
      const serverCalculatedAmount = bookingRes.data.booking.amount;

      // Step 3: Load Razorpay script
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        toast.error('Failed to load payment gateway');
        setIsProcessing(false);
        return;
      }

      // Step 4: Create Razorpay order
      const orderRes = await axios.post(
        `${API_URL}/bookings/${bookingId}/create-payment`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const razorpayOrder = orderRes.data.order;

      // Step 5: Open Razorpay checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'Career Coach LMS',
        description: `${service.name} Session`,
        customer_notif: 1,
        handler: async (response: any) => {
          try {
            toast.loading('Verifying payment...');

            // Step 6: Verify payment with backend
            const verifyRes = await axios.post(
              `${API_URL}/bookings/${bookingId}/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
              }
            );

            if (verifyRes.data.success) {
              toast.success('Payment successful! Booking confirmed.');
              setTimeout(() => {
                router.push(`/user-dashboard/bookings`);
              }, 1500);
            } else {
              toast.error('Payment verification failed');
              setIsProcessing(false);
            }
          } catch (error: any) {
            console.error('Error verifying payment:', error);
            toast.error(error.response?.data?.error || 'Payment verification failed');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user.fullName || user.name,
          email: user.email,
        },
        theme: {
          color: '#ffffff',
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast.error(error.response?.data?.error || 'Failed to process payment');
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
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="text-blue-600 text-sm mt-1 font-semibold">{service.duration || 60} minute session</p>
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
