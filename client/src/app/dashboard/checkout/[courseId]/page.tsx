'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { contentAPI, paymentAPI, getAuthToken, removeAuthToken } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  mentorId: {
    name: string;
    designation: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'casekaro'>('razorpay');
  const [gstNumber, setGstNumber] = useState('');
  const [hasGST, setHasGST] = useState(false);

  useEffect(() => {
    fetchCourse();
    loadRazorpayScript();
  }, [courseId, router]);

  const fetchCourse = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }

      setIsLoading(true);

      // Fetch from advanced courses API
      const response = await fetch(`${API_URL}/advanced/courses/published/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setCourse(data.data);
      } else {
        throw new Error(data.error || 'Failed to load course');
      }
    } catch (err: any) {
      console.error('Fetch course error:', err);
      if (err.response?.status === 401 || err.message?.includes('token')) {
        removeAuthToken();
        router.push('/login');
      } else {
        toast.error('Failed to load course');
        router.push('/dashboard/content');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const handlePayment = async () => {
    if (!course) return;

    try {
      setIsProcessing(true);

      // Create order (GST is now calculated and included by backend)
      const orderResponse = await paymentAPI.createOrder({
        courseId,
        paymentMethod,
        gstNumber: hasGST ? gstNumber : null,
      });

      if (paymentMethod === 'razorpay') {
        const options = {
          key: orderResponse.data.keyId,
          amount: orderResponse.data.amount, // This now includes GST (18%)
          currency: orderResponse.data.currency,
          order_id: orderResponse.data.orderId,
          handler: async (response: any) => {
            try {
              // Verify payment
              const verifyResponse = await paymentAPI.verifyPayment({
                paymentId: orderResponse.data.paymentId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              toast.success('Payment successful!');
              router.push(`/dashboard/payment-success/${orderResponse.data.paymentId}`);
            } catch (err) {
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            email: 'customer@example.com',
          },
          theme: {
            color: '#ffffff',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (paymentMethod === 'casekaro') {
        toast.success('Casekaro payment integration coming soon');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4 font-medium">Course not found</p>
          <Link href="/dashboard/content" className="text-blue-600 hover:text-blue-700 font-semibold">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Back Navigation */}
      <nav className="border-b-2 border-blue-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link href={`/dashboard/content/${courseId}`} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors w-fit font-medium">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Course</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Summary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Payment Method Selection */}
            <div className="rounded-2xl border-2 border-blue-200 bg-white shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Method</h2>

              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-bold text-slate-900">Razorpay</p>
                    <p className="text-sm text-slate-600 font-medium">Fast, secure payment</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 p-5 rounded-xl border-2 border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed">
                  <input
                    type="radio"
                    name="payment"
                    value="casekaro"
                    checked={paymentMethod === 'casekaro'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-5 h-5"
                    disabled
                  />
                  <div>
                    <p className="font-bold text-slate-700">Casekaro (Coming Soon)</p>
                    <p className="text-sm text-slate-500 font-medium">For users without GST</p>
                  </div>
                </label>
              </div>
            </div>

            {/* GST Information */}
            <div className="rounded-2xl border-2 border-blue-200 bg-white shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">GST Details</h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasGST}
                    onChange={(e) => setHasGST(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-900 font-semibold">I have a GST number</span>
                </label>

                {hasGST && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">GST Number</label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="GSTIN123456789"
                      className="w-full px-4 py-3 rounded-xl bg-blue-50 border-2 border-blue-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none transition-colors font-medium"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-2xl border-2 border-blue-200 bg-white shadow-xl p-8 sticky top-20 h-fit">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider mb-1">Course</p>
                <p className="text-slate-900 font-bold text-lg">{course.title}</p>
                <p className="text-blue-600 text-sm font-semibold mt-1">{course.mentorId.name}</p>
              </div>

              <div className="pt-4 border-t-2 border-blue-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-600 font-medium">Subtotal</span>
                  <span className="text-slate-900 font-bold">₹{course.price}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-600 font-medium">GST (18%)</span>
                  <span className="text-slate-900 font-bold">₹{(course.price * 0.18).toFixed(2)}</span>
                </div>
                <p className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-2 rounded-lg mt-2">
                  GST will be included in your Razorpay payment
                </p>
              </div>

              <div className="pt-4 border-t-2 border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-900 font-bold text-lg">Total</span>
                  <span className="text-3xl font-black text-blue-600">₹{(course.price * 1.18).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Processing...' : `Pay ₹${(course.price * 1.18).toFixed(2)}`}
            </button>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>Money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Check className="w-5 h-5 text-emerald-500" />
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
