// 'use client';

// import { useEffect, useState, Suspense } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { toast } from 'sonner';
// import axios from 'axios';
// import { Loader2, CheckCircle } from 'lucide-react';

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// interface Service {
//   id: string;
//   name: string;
//   price: number;
//   title: string;
//   value: string;
//   duration: number;
//   discount?: {
//     type: 'percentage' | 'fixed' | 'none';
//     value: number;
//     isActive: boolean;
//   };
// }

// function CheckoutContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [service, setService] = useState<Service | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [user, setUser] = useState<any>(null);
//   const [selectedSlot, setSelectedSlot] = useState<any>(null);
//   const [mentorId, setMentorId] = useState<string | null>(null);

//   const serviceId = searchParams.get('serviceId');
//   const slotData = searchParams.get('slot');
//   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

//   useEffect(() => {
//     // Parse slot from URL param
//     if (slotData) {
//       try {
//         setSelectedSlot(JSON.parse(decodeURIComponent(slotData)));
//       } catch { /* invalid slot param — handled in render */ }
//     }

//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       toast.error('Please login first');
//       router.push(`/login?redirect=/checkout?serviceId=${serviceId}`);
//       return;
//     }

//     // Preload Razorpay script immediately in background
//     if (!document.querySelector('script[src*="razorpay"]')) {
//       const s = document.createElement('script');
//       s.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       s.async = true;
//       document.body.appendChild(s);
//     }

//     checkAuthAndLoadData(token);
//   }, [slotData]);

//   const checkAuthAndLoadData = async (token: string) => {
//     try {
//       // Fire all 3 requests in parallel — user, pricing, mentor
//       const [userRes, pricingRes, mentorRes] = await Promise.all([
//         axios.get(`${API_URL}/auth/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }),
//         axios.get(`${API_URL}/pricing-section/public`),
//         axios.get(`${API_URL}/bookings/mentors`, {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }),
//       ]);

//       setUser(userRes.data.user);

//       const selectedService = pricingRes.data.services.find((s: Service) => s.id === serviceId);
//       if (!selectedService) {
//         toast.error('Service not found');
//         router.push('/');
//         return;
//       }
//       setService(selectedService);

//       const mid = mentorRes.data.mentors[0]?._id;
//       if (mid) setMentorId(mid);

//       setIsLoading(false);
//     } catch {
//       toast.error('Failed to load checkout');
//       setIsLoading(false);
//     }
//   };

//   const getDiscountedPrice = () => {
//     if (!service) return 0;

//     if (!service.discount?.isActive || service.discount.type === 'none') {
//       return service.price;
//     }

//     let discount = 0;
//     if (service.discount.type === 'percentage') {
//       discount = (service.price * service.discount.value) / 100;
//     } else {
//       discount = service.discount.value;
//     }

//     return Math.max(0, service.price - discount);
//   };

//   const getGST = () => {
//     const discountedPrice = getDiscountedPrice();
//     return discountedPrice * 0.18; // 18% GST
//   };

//   const getFinalAmount = () => {
//     return getDiscountedPrice() + getGST();
//   };

//   const handlePayment = async () => {
//     if (!service || !user || !selectedSlot) {
//       toast.error('Missing required information');
//       return;
//     }

//     const token = localStorage.getItem('authToken');
//     if (!token) { router.push('/login'); return; }

//     try {
//       setIsProcessing(true);

//       // Use preloaded mentorId; fall back to fetch if somehow missing
//       let mid = mentorId;
//       if (!mid) {
//         const res = await axios.get(`${API_URL}/bookings/mentors`, {
//           headers: { Authorization: `Bearer ${token}` }, withCredentials: true,
//         });
//         mid = res.data.mentors[0]?._id;
//       }
//       if (!mid) {
//         toast.error('No mentor available');
//         setIsProcessing(false);
//         return;
//       }

//       // Use slot duration (dynamic), fall back to 60
//       const durationMinutes = selectedSlot.duration || 60;

//       // Create booking (amount calculated server-side)
//       const bookingRes = await axios.post(
//         `${API_URL}/bookings`,
//         {
//           mentorId: mid,
//           sessionType: serviceId,
//           title: `${service.name} Session`,
//           description: 'Booked through marketplace',
//           scheduledDate: `${selectedSlot.date}T${selectedSlot.time}:00+05:30`,
//           duration: durationMinutes,
//         },
//         { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
//       );

//       const bookingId = bookingRes.data.booking._id;

//       // Wait for Razorpay to be ready (was preloaded on mount)
//       await new Promise<void>((resolve) => {
//         if (window.Razorpay) return resolve();
//         const interval = setInterval(() => {
//           if (window.Razorpay) { clearInterval(interval); resolve(); }
//         }, 100);
//         setTimeout(() => { clearInterval(interval); resolve(); }, 5000);
//       });

//       if (!window.Razorpay) {
//         toast.error('Payment gateway failed to load');
//         setIsProcessing(false);
//         return;
//       }

//       // Create payment order
//       const orderRes = await axios.post(
//         `${API_URL}/bookings/${bookingId}/create-payment`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
//       );

//       const razorpayOrder = orderRes.data.order;
//       const razorpayKey   = orderRes.data.keyId;

//       const razorpayInstance = new window.Razorpay({
//         key: razorpayKey,
//         order_id: razorpayOrder.id,
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency || 'INR',
//         name: 'YourInterviewCoach',
//         description: `${service.name} Session`,
//         handler: async (response: any) => {
//           try {
//             const verifyId = toast.loading('Verifying payment...');
//             const verifyRes = await axios.post(
//               `${API_URL}/bookings/${bookingId}/verify-payment`,
//               {
//                 razorpay_order_id:   response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature:  response.razorpay_signature,
//               },
//               { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
//             );
//             toast.dismiss(verifyId);
//             if (verifyRes.data.success) {
//               toast.success('Payment successful! Booking confirmed.');
//               setTimeout(() => router.push('/user-dashboard/bookings'), 1500);
//             } else {
//               toast.error('Payment verification failed');
//               setIsProcessing(false);
//             }
//           } catch (err: any) {
//             toast.error(err.response?.data?.error || 'Payment verification failed');
//             setIsProcessing(false);
//           }
//         },
//         prefill: { name: user.fullName || user.name, email: user.email },
//         theme: { color: '#1d4ed8' },
//         modal: {
//           ondismiss: async () => {
//             // Release the 15-minute payment lock so the slot becomes available again
//             try {
//               await axios.post(
//                 `${API_URL}/bookings/${bookingId}/release-payment-lock`,
//                 {},
//                 { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
//               );
//             } catch { /* lock auto-expires after 15 min anyway */ }
//             toast.error('Payment cancelled. Your slot has been released.');
//             setIsProcessing(false);
//           },
//         },
//       });

//       // payment.failed fires when a card is declined / network drops inside the modal.
//       // The Razorpay modal STAYS OPEN so the user can retry with a different card.
//       // Do NOT release the lock here — wait for ondismiss (modal close) to free the slot.
//       razorpayInstance.on('payment.failed', () => {
//         toast.error('Payment failed. You can retry with a different card.');
//       });

//       razorpayInstance.open();
//     } catch (err: any) {
//       toast.error(err.response?.data?.error || 'Failed to process payment');
//       setIsProcessing(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
//         <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
//       </div>
//     );
//   }

//   if (!service || !user || !selectedSlot) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-slate-900 mb-4">Booking information incomplete</h1>
//           <button
//             onClick={() => router.back()}
//             className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4">
//       <div className="max-w-md mx-auto">
//         <button
//           onClick={() => router.back()}
//           className="text-slate-600 hover:text-blue-600 transition mb-6 flex items-center gap-1 text-sm font-semibold"
//         >
//           ← Back
//         </button>

//         <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-xl">
//           <h1 className="text-3xl font-bold text-slate-900 mb-6">Checkout</h1>

//           <div className="mb-6 pb-6 border-b-2 border-blue-100">
//             <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Service</p>
//             <p className="text-slate-900 font-bold text-xl">{service.name}</p>
//             <p className="text-slate-700 text-sm mt-2 font-medium">{service.title}</p>
//             <p className="text-blue-600 text-sm mt-1 font-semibold">{service.value}</p>
//           </div>

//           <div className="mb-6 pb-6 border-b-2 border-blue-100">
//             <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Scheduled Date & Time</p>
//             <p className="text-slate-900 font-bold text-lg">
//               {new Date(`${selectedSlot.date}T${selectedSlot.time}`).toLocaleDateString('en-US', {
//                 weekday: 'short',
//                 month: 'short',
//                 day: 'numeric',
//               })}
//             </p>
//             <p className="text-blue-600 text-sm mt-1 font-semibold">
//               {(() => {
//                 const [sh, sm] = selectedSlot.time.split(':').map(Number);
//                 const duration = selectedSlot.duration || 60;
//                 const endTotal = sh * 60 + sm + duration;
//                 const eh = Math.floor(endTotal / 60);
//                 const em = endTotal % 60;
//                 const fmt = (h: number, m: number) => {
//                   const p = h >= 12 ? 'PM' : 'AM';
//                   const d = h > 12 ? h - 12 : h === 0 ? 12 : h;
//                   return m === 0 ? `${d} ${p}` : `${d}:${String(m).padStart(2,'0')} ${p}`;
//                 };
//                 return `${fmt(sh, sm)} – ${fmt(eh, em)} (${duration} mins)`;
//               })()}
//             </p>
//           </div>

//           <div className="mb-6 pb-6 border-b-2 border-blue-100">
//             <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Customer</p>
//             <p className="text-slate-900 font-bold text-lg">{user.fullName || user.name}</p>
//             <p className="text-slate-600 text-sm font-medium">{user.email}</p>
//           </div>

//           <div className="mb-6 pb-6 border-b-2 border-blue-100">
//             {service.discount?.isActive && service.discount.type !== 'none' ? (
//               <>
//                 <div className="flex justify-between mb-3">
//                   <p className="text-slate-600 font-medium">Original Price</p>
//                   <p className="text-slate-500 line-through font-medium">₹{service.price}</p>
//                 </div>
//                 <div className="mb-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-xl">
//                   <div className="flex justify-between mb-1">
//                     <p className="text-emerald-700 font-bold text-sm">
//                       {service.discount.type === 'percentage'
//                         ? `${service.discount.value}% Discount`
//                         : `Special Discount`}
//                     </p>
//                     <p className="text-emerald-700 font-black text-lg">
//                       -₹{Math.round(
//                         service.discount.type === 'percentage'
//                           ? (service.price * service.discount.value) / 100
//                           : service.discount.value
//                       )}
//                     </p>
//                   </div>
//                   <p className="text-emerald-600 text-xs font-semibold">🎉 Great deal on this service!</p>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <p className="text-slate-600 font-medium">Tax (GST 18%)</p>
//                   <p className="text-slate-900 font-bold">₹{Math.round(getGST())}</p>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="flex justify-between mb-3">
//                   <p className="text-slate-600 font-medium">Price per session</p>
//                   <p className="text-slate-900 font-bold text-lg">₹{service.price}</p>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <p className="text-slate-600 font-medium">Tax (GST 18%)</p>
//                   <p className="text-slate-900 font-bold">₹{Math.round(getGST())}</p>
//                 </div>
//               </>
//             )}
//           </div>

//           <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl">
//             <div className="flex justify-between items-center">
//               <p className="text-slate-900 font-bold text-lg">Total Amount</p>
//               <p className="text-blue-600 font-black text-3xl">₹{Math.round(getFinalAmount())}</p>
//             </div>
//             <p className="text-blue-600 text-xs mt-1 font-semibold">Includes 18% GST</p>
//           </div>

//           <button
//             onClick={handlePayment}
//             disabled={isProcessing}
//             className="w-full px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <CheckCircle className="w-5 h-5" />
//                 Complete Booking
//               </>
//             )}
//           </button>

//           <p className="text-slate-600 text-xs text-center mt-4 font-medium">
//             💳 Secure payment powered by Razorpay. Your booking will be confirmed after successful payment.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function CheckoutPage() {
//   return (
//     <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>}>
//       <CheckoutContent />
//     </Suspense>
//   );
// }






'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import {
  Loader2, CheckCircle, ArrowLeft, Shield, Clock,
  Calendar, User, Tag, Zap, ChevronRight, Lock, Star,
} from 'lucide-react';

declare global {
  interface Window { Razorpay: any; }
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

/* ─── Skeleton ───────────────────────────────────────────── */
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{
        background: 'linear-gradient(90deg,#f0f0f0 25%,#fafafa 50%,#f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
}

function CheckoutSkeleton() {
  return (
    <div className="checkout-grid">
      {/* Left */}
      <div className="space-y-5">
        <Skeleton className="h-8 w-40" />
        <div className="rounded-3xl border border-slate-100 bg-white p-8 space-y-6">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="border-t border-slate-100 pt-5 space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-6 space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
          <div className="border-t border-slate-100 pt-3">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          </div>
        </div>
      </div>
      {/* Right */}
      <div className="space-y-4">
        <Skeleton className="h-[56px] w-full rounded-2xl" />
        <div className="rounded-3xl border border-slate-100 bg-white p-6 space-y-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-4 w-full" />)}
        </div>
      </div>
    </div>
  );
}

/* ─── Row helper ─────────────────────────────────────────── */
function DetailRow({
  icon, label, value, sub, accent = false,
}: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accent ? 'rgba(26,86,219,.08)' : '#f8f9fb' }}>
        <span style={{ color: accent ? '#1a56db' : '#94a3b8' }}>{icon}</span>
      </div>
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-slate-900 font-semibold text-sm leading-snug">{value}</p>
        {sub && <p className="text-blue-600 text-xs font-medium mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Price Row helper ───────────────────────────────────── */
function PriceRow({ label, value, strike = false, highlight = false, green = false, large = false }:
  { label: string; value: string; strike?: boolean; highlight?: boolean; green?: boolean; large?: boolean }) {
  return (
    <div className={`flex justify-between items-center ${large ? 'mt-1' : ''}`}>
      <span className={`text-sm ${large ? 'font-bold text-slate-800' : 'text-slate-500 font-medium'}`}>{label}</span>
      <span className={`
        ${strike ? 'line-through text-slate-400 text-sm' : ''}
        ${green ? 'text-emerald-600 font-semibold text-sm' : ''}
        ${large ? 'text-2xl font-black text-slate-900' : ''}
        ${highlight && !large ? 'text-slate-800 font-semibold text-sm' : ''}
      `}>{value}</span>
    </div>
  );
}

/* ─── Trust Badge ────────────────────────────────────────── */
function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
      <span className="text-slate-400">{icon}</span>
      {text}
    </div>
  );
}

/* ─── Steps indicator ────────────────────────────────────── */
function StepBar({ step }: { step: 1 | 2 | 3 }) {
  const steps = ['Select Service', 'Pick Slot', 'Checkout'];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all`}
                style={{
                  background: done ? '#1a56db' : active ? '#1a56db' : '#f1f5f9',
                  color: done || active ? '#fff' : '#94a3b8',
                }}>
                {done ? <CheckCircle className="w-3.5 h-3.5" /> : n}
              </div>
              <span className={`text-xs font-semibold ${active ? 'text-slate-900' : done ? 'text-blue-600' : 'text-slate-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-3 h-px w-8 bg-slate-200 rounded" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Content ───────────────────────────────────────── */
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [mentorId, setMentorId] = useState<string | null>(null);

  const serviceId = searchParams.get('serviceId');
  const slotData  = searchParams.get('slot');
  const API_URL   = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (slotData) {
      try { setSelectedSlot(JSON.parse(decodeURIComponent(slotData))); } catch {}
    }
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please login first');
      router.push(`/login?redirect=/checkout?serviceId=${serviceId}`);
      return;
    }
    // Preload Razorpay
    if (!document.querySelector('script[src*="razorpay"]')) {
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.async = true;
      document.body.appendChild(s);
    }
    loadData(token);
  }, [slotData]);

  const loadData = async (token: string) => {
    try {
      const [userRes, pricingRes, mentorRes] = await Promise.all([
        axios.get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }),
        axios.get(`${API_URL}/pricing-section/public`),
        axios.get(`${API_URL}/bookings/mentors`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }),
      ]);
      setUser(userRes.data.user);
      const svc = pricingRes.data.services.find((s: Service) => s.id === serviceId);
      if (!svc) { toast.error('Service not found'); router.push('/'); return; }
      setService(svc);
      const mid = mentorRes.data.mentors[0]?._id;
      if (mid) setMentorId(mid);
    } catch {
      toast.error('Failed to load checkout');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Pricing helpers ──────────────────────────── */
  const discountedPrice = (() => {
    if (!service) return 0;
    if (!service.discount?.isActive || service.discount.type === 'none') return service.price;
    const d = service.discount.type === 'percentage'
      ? (service.price * service.discount.value) / 100
      : service.discount.value;
    return Math.max(0, service.price - d);
  })();

  const gst         = Math.round(discountedPrice * 0.18);
  const totalAmount = Math.round(discountedPrice + gst);
  const originalWithGst = service ? Math.round(service.price * 1.18) : 0;
  const savings     = originalWithGst - totalAmount;
  const hasDiscount = !!(service?.discount?.isActive && service.discount.type !== 'none');

  /* ── Slot display ─────────────────────────────── */
  const slotDisplay = (() => {
    if (!selectedSlot) return { date: '', time: '' };
    const dateStr = new Date(`${selectedSlot.date}T${selectedSlot.time}`).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });
    const [sh, sm] = selectedSlot.time.split(':').map(Number);
    const dur = selectedSlot.duration || 60;
    const endTotal = sh * 60 + sm + dur;
    const eh = Math.floor(endTotal / 60), em = endTotal % 60;
    const fmt = (h: number, m: number) => {
      const p = h >= 12 ? 'PM' : 'AM';
      const d = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return m === 0 ? `${d} ${p}` : `${d}:${String(m).padStart(2, '0')} ${p}`;
    };
    return { date: dateStr, time: `${fmt(sh, sm)} – ${fmt(eh, em)} (${dur} min)` };
  })();

  /* ── Payment ──────────────────────────────────── */
  const handlePayment = async () => {
    if (!service || !user || !selectedSlot) { toast.error('Missing required information'); return; }
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }

    try {
      setIsProcessing(true);
      let mid = mentorId;
      if (!mid) {
        const r = await axios.get(`${API_URL}/bookings/mentors`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
        mid = r.data.mentors[0]?._id;
      }
      if (!mid) { toast.error('No mentor available'); setIsProcessing(false); return; }

      const durationMinutes = selectedSlot.duration || 60;
      const bookingRes = await axios.post(
        `${API_URL}/bookings`,
        { mentorId: mid, sessionType: serviceId, title: `${service.name} Session`, description: 'Booked through marketplace', scheduledDate: `${selectedSlot.date}T${selectedSlot.time}:00+05:30`, duration: durationMinutes },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      const bookingId = bookingRes.data.booking._id;

      await new Promise<void>((resolve) => {
        if (window.Razorpay) return resolve();
        const id = setInterval(() => { if (window.Razorpay) { clearInterval(id); resolve(); } }, 100);
        setTimeout(() => { clearInterval(id); resolve(); }, 5000);
      });
      if (!window.Razorpay) { toast.error('Payment gateway failed to load'); setIsProcessing(false); return; }

      const orderRes = await axios.post(`${API_URL}/bookings/${bookingId}/create-payment`, {}, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
      const { order: rzOrder, keyId } = orderRes.data;

      const rz = new window.Razorpay({
        key: keyId,
        order_id: rzOrder.id,
        amount: rzOrder.amount,
        currency: rzOrder.currency || 'INR',
        name: 'YourInterviewCoach',
        description: `${service.name} Session`,
        handler: async (response: any) => {
          try {
            const tid = toast.loading('Verifying payment…');
            const vr = await axios.post(
              `${API_URL}/bookings/${bookingId}/verify-payment`,
              { razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature },
              { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );
            toast.dismiss(tid);
            if (vr.data.success) {
              setPaymentDone(true);
              toast.success('Booking confirmed!');
              setTimeout(() => router.push('/user-dashboard/bookings'), 2000);
            } else {
              toast.error('Payment verification failed'); setIsProcessing(false);
            }
          } catch (err: any) {
            toast.error(err.response?.data?.error || 'Verification failed'); setIsProcessing(false);
          }
        },
        prefill: { name: user.fullName || user.name, email: user.email },
        theme: { color: '#1a56db' },
        modal: {
          ondismiss: async () => {
            try {
              await axios.post(`${API_URL}/bookings/${bookingId}/release-payment-lock`, {}, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
            } catch {}
            toast.error('Payment cancelled. Slot released.');
            setIsProcessing(false);
          },
        },
      });
      rz.on('payment.failed', () => toast.error('Payment failed. Retry with a different card.'));
      rz.open();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to process payment');
      setIsProcessing(false);
    }
  };

  /* ── Success screen ───────────────────────────── */
  if (paymentDone) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#fff' }}>
        <div className="text-center max-w-sm" style={{ animation: 'scaleIn .4s ease' }}>
          <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1a56db,#3b82f6)', boxShadow: '0 12px 40px rgba(26,86,219,.3)' }}>
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="checkout-title text-3xl font-black text-slate-900 mb-2">Booking Confirmed!</h2>
          <p className="text-slate-500 text-sm">Redirecting to your bookings…</p>
        </div>
      </div>
    );
  }

  /* ── Error / missing data ─────────────────────── */
  if (!isLoading && (!service || !user || !selectedSlot)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-slate-300" />
          </div>
          <h2 className="checkout-title text-2xl font-black text-slate-900 mb-2">Info Incomplete</h2>
          <p className="text-slate-400 text-sm mb-6">Some booking details are missing. Please go back and try again.</p>
          <button onClick={() => router.back()} className="pay-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-8 py-10 bg-white" style={{ animation: 'fadeIn .4s ease' }}>
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-800 font-semibold transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Steps */}
        <StepBar step={3} />

        {isLoading ? (
          <CheckoutSkeleton />
        ) : (
          <div className="checkout-grid">

            {/* ══ LEFT COLUMN ═══════════════════════════ */}
            <div className="space-y-4" style={{ animation: 'slideUp .45s ease' }}>

              {/* Header */}
              <div className="mb-2">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Order Summary</p>
                <h1 className="checkout-title text-3xl font-black text-slate-900 leading-tight">{service!.name}</h1>
                <p className="text-slate-400 text-sm mt-1">{service!.title}</p>
              </div>

              {/* Session details card */}
              <div className="rounded-3xl border border-slate-100 bg-white shadow-sm p-6 space-y-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Session Details</p>

                <DetailRow
                  icon={<Calendar className="w-4 h-4" />}
                  label="Date"
                  value={slotDisplay.date}
                  accent
                />
                <DetailRow
                  icon={<Clock className="w-4 h-4" />}
                  label="Time"
                  value={slotDisplay.time}
                  accent
                />
                <DetailRow
                  icon={<User className="w-4 h-4" />}
                  label="Customer"
                  value={user!.fullName || user!.name}
                  sub={user!.email}
                />
                {service!.value && (
                  <DetailRow
                    icon={<Star className="w-4 h-4" />}
                    label="Includes"
                    value={service!.value}
                  />
                )}
              </div>

              {/* Pricing breakdown card */}
              <div className="rounded-3xl border border-slate-100 bg-white shadow-sm p-6 space-y-3.5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Price Breakdown</p>

                <PriceRow label="Base price" value={`₹${service!.price}`} strike={hasDiscount} />

                {hasDiscount && (
                  <>
                    <PriceRow
                      label={service!.discount!.type === 'percentage' ? `Discount (${service!.discount!.value}%)` : 'Special discount'}
                      value={`−₹${service!.price - discountedPrice}`}
                      green
                    />
                    <PriceRow label="After discount" value={`₹${discountedPrice}`} highlight />
                  </>
                )}

                <PriceRow label="GST (18%)" value={`+₹${gst}`} highlight />

                <div className="border-t border-slate-100 pt-3.5">
                  <PriceRow label="Total payable" value={`₹${totalAmount}`} large />
                  {hasDiscount && (
                    <p className="text-right text-[11px] text-emerald-600 font-semibold mt-1">
                      🎉 You save ₹{savings}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ══ RIGHT COLUMN ══════════════════════════ */}
            <div className="space-y-4" style={{ animation: 'slideUp .5s ease' }}>

              {/* Pay CTA card */}
              <div className="rounded-3xl border border-slate-100 bg-white shadow-sm p-6 space-y-5 sticky top-8">

                {/* Amount preview */}
                <div className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg,#f0f5ff,#e8f0fe)' }}>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Amount Due</p>
                  <p className="checkout-title text-5xl font-black text-slate-900">₹{totalAmount}</p>
                  <p className="text-slate-400 text-xs mt-1">Incl. 18% GST</p>
                </div>

                {/* Discount badge */}
                {hasDiscount && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                    <p className="text-emerald-700 text-xs font-semibold">Discount applied — saving ₹{savings}</p>
                  </div>
                )}

                {/* Pay button */}
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="pay-btn w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Pay ₹{totalAmount} Securely</>
                  )}
                </button>

                {/* Trust badges */}
                <div className="grid grid-cols-1 gap-2.5">
                  <TrustBadge icon={<Shield className="w-3.5 h-3.5" />} text="256-bit SSL encrypted payment" />
                  <TrustBadge icon={<CheckCircle className="w-3.5 h-3.5" />} text="Instant booking confirmation" />
                  <TrustBadge icon={<Zap className="w-3.5 h-3.5" />} text="Powered by Razorpay" />
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                    By completing this booking you agree to our&nbsp;
                    <a href="/terms" className="text-blue-500 hover:underline">Terms</a> &amp;&nbsp;
                    <a href="/refund" className="text-blue-500 hover:underline">Refund Policy</a>.
                  </p>
                </div>
              </div>

              {/* Steps card */}
              <div className="rounded-3xl border border-slate-100 bg-white shadow-sm p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">What happens next</p>
                <div className="space-y-3.5">
                  {[
                    { label: 'Payment confirmed', desc: 'You\'ll receive an email receipt.' },
                    { label: 'Slot locked', desc: 'Your selected time is reserved.' },
                    { label: 'Join meeting', desc: 'Link active 10 min before session.' },
                  ].map(({ label, desc }, i) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0 mt-0.5"
                        style={{ background: 'linear-gradient(135deg,#1a56db,#3b82f6)' }}>
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{label}</p>
                        <p className="text-xs text-slate-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page wrapper ───────────────────────────────────────── */
export default function CheckoutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes shimmer   { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn   { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }

        body, * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .checkout-title {
          font-family: 'Instrument Serif', Georgia, serif;
          letter-spacing: -.02em;
        }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        @media (min-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr 380px;
            gap: 2.5rem;
          }
        }

        .pay-btn {
          background: linear-gradient(135deg, #1a56db 0%, #3b82f6 100%);
          box-shadow: 0 8px 28px rgba(26,86,219,.28);
          transition: transform .15s ease, box-shadow .15s ease, opacity .15s;
        }
        .pay-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 36px rgba(26,86,219,.38);
        }
        .pay-btn:not(:disabled):active {
          transform: translateY(0);
        }
      `}</style>

      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin mx-auto" style={{ color: '#1a56db' }} />
            <p className="text-sm text-slate-400 font-medium">Loading checkout…</p>
          </div>
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </>
  );
}