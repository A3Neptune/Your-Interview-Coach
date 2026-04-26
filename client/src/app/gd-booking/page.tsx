"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/api";
import {
  Users,
  Phone,
  Calendar,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Crown,
  Zap,
  Star,
  User,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const GD_PLANS = [
  {
    id: "gd-starter",
    memberCount: 4,
    pricePerMember: 199,
    totalAmount: 796,
    label: "Starter",
    icon: Users,
    color: "#2563eb",
    colorLight: "rgba(37,99,235,0.08)",
    colorBorder: "rgba(37,99,235,0.2)",
    desc: "Perfect for a focused, intimate discussion with close peers.",
    badge: null,
  },
  {
    id: "gd-popular",
    memberCount: 6,
    pricePerMember: 169,
    totalAmount: 1014,
    label: "Popular",
    icon: Crown,
    color: "#7c3aed",
    colorLight: "rgba(124,58,237,0.08)",
    colorBorder: "rgba(124,58,237,0.25)",
    desc: "Most popular choice — balanced group with diverse perspectives.",
    badge: "Most Popular",
  },
  {
    id: "gd-value",
    memberCount: 10,
    pricePerMember: 99,
    totalAmount: 990,
    label: "Value",
    icon: Zap,
    color: "#059669",
    colorLight: "rgba(5,150,105,0.08)",
    colorBorder: "rgba(5,150,105,0.2)",
    desc: "Best value — large group simulating real GD environments.",
    badge: "Best Value",
  },
];

const STEPS = [
  { label: "Choose Plan", icon: Sparkles },
  { label: "Team Details", icon: Users },
  { label: "Select Date", icon: Calendar },
  { label: "Payment", icon: CreditCard },
];

export default function GDBookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<(typeof GD_PLANS)[0] | null>(null);
  const [members, setMembers] = useState<{ name: string; whatsapp: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    // Clear stale members on mount
    localStorage.removeItem("gd_members");

    // Auto-select plan if passed in URL
    const params = new URLSearchParams(window.location.search);
    const planId = params.get("plan");
    if (planId) {
      const plan = GD_PLANS.find((p) => p.id === planId);
      if (plan) {
        setSelectedPlan(plan);
        setMembers(Array.from({ length: plan.memberCount }, () => ({ name: "", whatsapp: "" })));
        setStep(1);
      }
    }
  }, []);

  const handlePlanSelect = (plan: (typeof GD_PLANS)[0]) => {
    setSelectedPlan(plan);
    setMembers(Array.from({ length: plan.memberCount }, () => ({ name: "", whatsapp: "" })));
    setStep(1);
  };

  const handleMemberChange = (idx: number, field: "name" | "whatsapp", value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  };

  const validateMembers = () => {
    for (let i = 0; i < members.length; i++) {
      if (!members[i].name.trim()) { toast.error(`Member ${i + 1}: Name is required`); return false; }
      const cleaned = members[i].whatsapp.replace(/[\s\-\+]/g, "");
      if (!/^\d{10,13}$/.test(cleaned)) { toast.error(`Member ${i + 1}: Enter a valid WhatsApp number`); return false; }
    }
    return true;
  };

  const handleDateNext = () => {
    if (!selectedDate) { toast.error("Please select a date"); return; }
    const d = new Date(selectedDate);
    if (d <= new Date()) { toast.error("Please select a future date"); return; }
    setStep(3);
  };

  const handlePayment = async () => {
    const token = getAuthToken();
    if (!token) { toast.error("Please login first"); router.push("/login"); return; }
    if (!selectedPlan || !selectedDate) return;
    setIsProcessing(true);

    try {
      const res = await fetch(`${API_URL}/gd-bookings/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planType: selectedPlan.id, members, scheduledDate: selectedDate }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Booking failed");

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Your Interview Coach",
        description: `GD Session - ${selectedPlan.memberCount} Members`,
        order_id: data.order.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${API_URL}/gd-bookings/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: data.booking._id,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast.success("GD Session booked successfully!");
              router.push("/booking-confirmed?type=gd");
            } else {
              toast.error("Payment verification failed");
            }
          } catch { toast.error("Payment verification error"); }
          setIsProcessing(false);
        },
        modal: { ondismiss: () => setIsProcessing(false) },
        theme: { color: selectedPlan.color },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      setIsProcessing(false);
    }
  };

  // Generate next 30 days for date picker
  const dateOptions: string[] = [];
  for (let i = 1; i <= 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dateOptions.push(d.toISOString().split("T")[0]);
  }

  return (
    <main className="min-h-screen" style={{ background: "#F8F6F1", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&display=swap");
        .gd-card{transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease;will-change:transform}
        .gd-card:hover{transform:translateY(-6px)}
        .gd-input{width:100%;padding:10px 14px;border-radius:10px;border:1.5px solid rgba(0,0,0,.08);background:white;font-size:14px;transition:border .2s,box-shadow .2s;outline:none}
        .gd-input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.08)}
        .gd-date-card{padding:14px 18px;border-radius:12px;border:1.5px solid rgba(0,0,0,.06);background:white;cursor:pointer;transition:all .2s;text-align:center}
        .gd-date-card:hover{border-color:#2563eb;background:rgba(37,99,235,.03)}
        .gd-date-card.selected{border-color:#2563eb;background:rgba(37,99,235,.07);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
      `}</style>

      {/* Hero */}
      <section className="pt-32 pb-8 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(255,255,255,.88)", border: "1.5px solid rgba(147,197,253,.6)", boxShadow: "0 2px 14px rgba(37,99,235,.07)" }}>
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-widest">Group Discussion</span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(32px,6vw,56px)", fontWeight: 600, color: "#0f172a", lineHeight: 1.1, marginBottom: 12 }}>
            Book a <span style={{ color: "#2563eb", fontStyle: "italic" }}>GD Session</span>
          </h1>
          <p style={{ fontSize: "clamp(14px,2vw,16px)", color: "#64748b", maxWidth: 480, margin: "0 auto" }}>
            Practice group discussions with your team. Choose a plan, add your teammates, and get started.
          </p>
        </div>
      </section>

      {/* Steps Indicator */}
      <section className="px-6 pb-6">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: active ? "#2563eb" : done ? "#059669" : "rgba(0,0,0,.04)", color: active ? "#fff" : done ? "#fff" : "#94a3b8", fontSize: 11, fontWeight: 600, transition: "all .3s" }}>
                  {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
              </div>
            );
          })}
        </div>
      </section>

      {/* Step Content */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">

          {/* STEP 0: Plan Selection */}
          {step === 0 && (
            <div className="grid sm:grid-cols-3 gap-5">
              {GD_PLANS.map((plan) => {
                const Icon = plan.icon;
                return (
                  <div key={plan.id} className="gd-card rounded-[22px] overflow-hidden relative" style={{ background: "rgba(255,255,255,.97)", border: `1.5px solid ${plan.colorBorder}`, boxShadow: `0 4px 24px ${plan.colorLight}` }}>
                    {plan.badge && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: plan.color, color: "#fff" }}>
                        {plan.badge}
                      </div>
                    )}
                    <div style={{ height: 3, background: `linear-gradient(90deg,${plan.color},${plan.color}55,transparent)` }} />
                    <div className="p-6 flex flex-col h-full">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg,${plan.color}cc,${plan.color})`, boxShadow: `0 4px 14px ${plan.colorLight}` }}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.label} Plan</h3>
                      <p className="text-xs text-slate-500 mb-4 flex-1">{plan.desc}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl font-extrabold" style={{ color: plan.color }}>₹{plan.pricePerMember}</span>
                        <span className="text-xs text-slate-400">/member</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-4 text-xs text-slate-500">
                        <Users className="w-3.5 h-3.5" />
                        <span>{plan.memberCount} members</span>
                        <span className="mx-1">·</span>
                        <span className="font-semibold" style={{ color: plan.color }}>Total ₹{plan.totalAmount}</span>
                      </div>
                      <button onClick={() => handlePlanSelect(plan)} className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90" style={{ background: `linear-gradient(135deg,${plan.color}dd,${plan.color})`, boxShadow: `0 4px 14px ${plan.colorLight}` }}>
                        Select Plan <ChevronRight className="w-4 h-4 inline" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 1: Member Details */}
          {step === 1 && selectedPlan && (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-[22px] overflow-hidden" style={{ background: "rgba(255,255,255,.97)", border: `1.5px solid ${selectedPlan.colorBorder}`, boxShadow: `0 4px 24px ${selectedPlan.colorLight}` }}>
                <div className="p-6 border-b" style={{ borderColor: selectedPlan.colorBorder }}>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Add Team Members</h2>
                  <p className="text-sm text-slate-500">Enter the name and WhatsApp number for each of the {selectedPlan.memberCount} members.</p>
                </div>
                <div className="p-6 space-y-4">
                  {members.map((m, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl" style={{ background: i % 2 === 0 ? "rgba(0,0,0,.015)" : "transparent" }}>
                      <div className="flex items-center gap-2 sm:w-8 shrink-0">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: selectedPlan.color }}>
                          {i + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                          <User className="w-3 h-3" /> Full Name
                        </label>
                        <input className="gd-input" placeholder="Enter member name" value={m.name} onChange={(e) => handleMemberChange(i, "name", e.target.value)} />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> WhatsApp Number
                        </label>
                        <input className="gd-input" placeholder="e.g. 9876543210" value={m.whatsapp} onChange={(e) => handleMemberChange(i, "whatsapp", e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t flex justify-between" style={{ borderColor: selectedPlan.colorBorder }}>
                  <button onClick={() => setStep(0)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={() => { 
                    if (validateMembers()) {
                      // Save members to localStorage temporarily
                      localStorage.setItem('gd_members', JSON.stringify(members));
                      router.push(`/select-slot?serviceId=${selectedPlan.id}`);
                    } 
                  }} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90 flex items-center gap-1" style={{ background: selectedPlan.color }}>
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Date Selection */}
          {step === 2 && selectedPlan && (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-[22px] overflow-hidden" style={{ background: "rgba(255,255,255,.97)", border: `1.5px solid ${selectedPlan.colorBorder}`, boxShadow: `0 4px 24px ${selectedPlan.colorLight}` }}>
                <div className="p-6 border-b" style={{ borderColor: selectedPlan.colorBorder }}>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Select a Date</h2>
                  <p className="text-sm text-slate-500">Choose your preferred date for the GD session.</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {dateOptions.map((d) => {
                      const dt = new Date(d);
                      const dayName = dt.toLocaleDateString("en-IN", { weekday: "short" });
                      const dayNum = dt.getDate();
                      const month = dt.toLocaleDateString("en-IN", { month: "short" });
                      const isSel = selectedDate === d;
                      return (
                        <div key={d} className={`gd-date-card ${isSel ? "selected" : ""}`} onClick={() => setSelectedDate(d)} style={isSel ? { borderColor: selectedPlan.color, background: selectedPlan.colorLight, boxShadow: `0 0 0 3px ${selectedPlan.colorLight}` } : {}}>
                          <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: isSel ? selectedPlan.color : "#94a3b8" }}>{dayName}</div>
                          <div className="text-xl font-extrabold" style={{ color: isSel ? selectedPlan.color : "#0f172a" }}>{dayNum}</div>
                          <div className="text-[10px] text-slate-400">{month}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-6 border-t flex justify-between" style={{ borderColor: selectedPlan.colorBorder }}>
                  <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={handleDateNext} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90 flex items-center gap-1" style={{ background: selectedPlan.color }}>
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Summary */}
          {step === 3 && selectedPlan && (
            <div className="max-w-lg mx-auto">
              <div className="rounded-[22px] overflow-hidden" style={{ background: "rgba(255,255,255,.97)", border: `1.5px solid ${selectedPlan.colorBorder}`, boxShadow: `0 4px 24px ${selectedPlan.colorLight}` }}>
                <div className="p-6 border-b" style={{ borderColor: selectedPlan.colorBorder }}>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Booking Summary</h2>
                  <p className="text-sm text-slate-500">Review your booking and proceed to payment.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Plan</span>
                    <span className="text-sm font-bold" style={{ color: selectedPlan.color }}>{selectedPlan.label} ({selectedPlan.memberCount} members)</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Date</span>
                    <span className="text-sm font-semibold text-slate-900">{new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Per Member</span>
                    <span className="text-sm font-semibold text-slate-900">₹{selectedPlan.pricePerMember}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Members</span>
                    <span className="text-sm text-slate-700">{members.map((m) => m.name).join(", ")}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 rounded-xl px-4" style={{ background: selectedPlan.colorLight }}>
                    <span className="text-base font-bold text-slate-900">Total Amount</span>
                    <span className="text-2xl font-extrabold" style={{ color: selectedPlan.color }}>₹{selectedPlan.totalAmount}</span>
                  </div>
                </div>
                <div className="p-6 border-t flex justify-between" style={{ borderColor: selectedPlan.colorBorder }}>
                  <button onClick={() => setStep(2)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button onClick={handlePayment} disabled={isProcessing} className="px-8 py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90 flex items-center gap-2 disabled:opacity-50" style={{ background: `linear-gradient(135deg,${selectedPlan.color}dd,${selectedPlan.color})`, boxShadow: `0 4px 14px ${selectedPlan.colorLight}` }}>
                    {isProcessing ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                    ) : (
                      <><CreditCard className="w-4 h-4" /> Pay ₹{selectedPlan.totalAmount}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <StandardFooter />
    </main>
  );
}
