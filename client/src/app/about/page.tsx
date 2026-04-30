// "use client";

// import Link from "next/link";
// import { useEffect, useRef, useState } from "react";
// import {
//   ChevronRight,
//   Sparkles,
//   Target,
//   MessageSquare,
//   BrainCircuit,
//   ArrowRight,
//   CheckCircle2,
//   Users,
//   Award,
//   TrendingUp,
// } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import StandardFooter from "@/components/StandardFooter";

// function useInView(threshold = 0.12) {
//   const ref = useRef<HTMLDivElement>(null);
//   const [inView, setInView] = useState(false);
//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const obs = new IntersectionObserver(
//       ([e]) => {
//         if (e.isIntersecting) {
//           setInView(true);
//           obs.disconnect();
//         }
//       },
//       { threshold },
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, [threshold]);
//   return { ref, inView };
// }

// function FadeUp({
//   children,
//   delay = 0,
//   className = "",
// }: {
//   children: React.ReactNode;
//   delay?: number;
//   className?: string;
// }) {
//   const { ref, inView } = useInView();
//   return (
//     <div
//       ref={ref}
//       className={className}
//       style={{
//         opacity: inView ? 1 : 0,
//         transform: inView ? "translateY(0)" : "translateY(20px)",
//         transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// const stats = [
//   { value: "12+", label: "Years corporate experience", icon: Award },
//   { value: "5,000+", label: "Candidates trained", icon: Users },
//   { value: "94%", label: "Interview success rate", icon: TrendingUp },
// ];

// const focusAreas = [
//   {
//     icon: Target,
//     title: "Structure your answers",
//     desc: "Crisp, logical responses that stick.",
//     accent: "#2563eb",
//     bg: "#dbeafe",
//   },
//   {
//     icon: MessageSquare,
//     title: "Communicate with confidence",
//     desc: "Turn nerves into clarity under pressure.",
//     accent: "#0891b2",
//     bg: "#cffafe",
//   },
//   {
//     icon: BrainCircuit,
//     title: "Think on your feet",
//     desc: "Handle curveballs without losing your thread.",
//     accent: "#7c3aed",
//     bg: "#ede9fe",
//   },
// ];

// const differentiators = [
//   "Real corporate exposure from Tech Mahindra & IndiaMART",
//   "Worked directly alongside business leaders",
//   "Understands exactly what hiring panels look for",
//   "No scripted answers. No generic tips.",
// ];

// export default function WhyMePage() {
//   return (
//     <main
//       className="min-h-screen bg-[#F8F6F1] overflow-x-hidden"
//       style={{ fontFamily: "'DM Sans', sans-serif" }}
//     >
//       <Navbar />
//       <style jsx global>{`
//         @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,400&display=swap");
//         * {
//           box-sizing: border-box;
//         }
//         @keyframes fade-up {
//           from {
//             opacity: 0;
//             transform: translateY(16px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         @keyframes float-orb {
//           0%,
//           100% {
//             transform: translate(0, 0);
//           }
//           50% {
//             transform: translate(20px, -14px);
//           }
//         }
//         .orb {
//           animation: float-orb 10s ease-in-out infinite;
//         }
//         .hero-in {
//           animation: fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
//         }
//         .value-card {
//           transition:
//             transform 0.3s ease,
//             box-shadow 0.3s ease;
//         }
//         .value-card:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 12px 32px rgba(37, 99, 235, 0.1);
//         }
//         .cta-btn {
//           transition:
//             transform 0.3s ease,
//             box-shadow 0.3s ease;
//         }
//         .cta-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);
//         }
//       `}</style>

//       {/* ── HERO ── */}
//       <section className="relative flex items-center justify-center pt-36 pb-24 overflow-hidden">
//         <div className="absolute inset-0 pointer-events-none">
//           <div
//             className="orb absolute top-[12%] left-[10%] w-72 h-72 rounded-full"
//             style={{
//               background:
//                 "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)",
//             }}
//           />
//           <div
//             className="orb absolute bottom-[10%] right-[8%] w-80 h-80 rounded-full"
//             style={{
//               background:
//                 "radial-gradient(circle, rgba(8,145,178,0.08) 0%, transparent 70%)",
//               animationDelay: "-4s",
//             }}
//           />
//           <div
//             className="absolute inset-0 opacity-[0.022]"
//             style={{
//               backgroundImage:
//                 "linear-gradient(#2563eb 1px,transparent 1px),linear-gradient(90deg,#2563eb 1px,transparent 1px)",
//               backgroundSize: "64px 64px",
//             }}
//           />
//         </div>

//         <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
//           <div
//             className="hero-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
//             style={{
//               background: "rgba(255,255,255,0.85)",
//               border: "1.5px solid rgba(147,197,253,0.5)",
//               animationDelay: "0ms",
//             }}
//           >
//             <Sparkles className="w-3 h-3 text-blue-600" />
//             <span className="text-xs font-semibold text-blue-700 uppercase tracking-widest">
//               Why Me?
//             </span>
//           </div>

//           <h1
//             className="hero-in mb-5"
//             style={{
//               fontFamily: "'Fraunces', serif",
//               fontSize: "clamp(36px, 6vw, 70px)",
//               lineHeight: 1.1,
//               animationDelay: "80ms",
//             }}
//           >
//             <span style={{ fontWeight: 300, color: "#0f172a" }}>
//               I've been{" "}
//             </span>
//             <em
//               style={{ fontWeight: 600, color: "#1d4ed8", fontStyle: "italic" }}
//             >
//               inside
//             </em>
//             <span style={{ fontWeight: 300, color: "#0f172a" }}>
//               {" "}
//               the room
//               <br />
//               you're preparing for.
//             </span>
//           </h1>

//           <p
//             className="hero-in text-slate-500 max-w-xl mx-auto leading-relaxed mb-10"
//             style={{ fontSize: "17px", animationDelay: "180ms" }}
//           >
//             12+ years of real corporate experience. 5,000+ candidates trained.
//             One truth I keep seeing: most people don't fail because they're
//             unqualified — they fail because they don't know how to present what
//             they know.
//           </p>

//           <div
//             className="hero-in flex flex-col sm:flex-row items-center justify-center gap-3"
//             style={{ animationDelay: "280ms" }}
//           >
//             <Link
//               href="/signup"
//               className="cta-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm"
//               style={{
//                 background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
//               }}
//             >
//               Start preparing <ChevronRight className="w-4 h-4" />
//             </Link>
//             <Link
//               href="/services"
//               className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium text-slate-600 text-sm border border-blue-200 hover:bg-blue-50 transition-all duration-200"
//             >
//               Explore services
//             </Link>
//           </div>
//         </div>

//         <div
//           className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
//           style={{
//             background: "linear-gradient(to bottom, transparent, #F8F6F1)",
//           }}
//         />
//       </section>

//       {/* ── STATS ── */}
//       <section className="py-10 px-6">
//         <div className="max-w-3xl mx-auto">
//           <FadeUp>
//             <div className="grid grid-cols-3 gap-4">
//               {stats.map((s, i) => {
//                 const Icon = s.icon;
//                 return (
//                   <div
//                     key={i}
//                     className="rounded-2xl p-6 text-center"
//                     style={{
//                       background: "rgba(255,255,255,0.85)",
//                       border: "1.5px solid rgba(219,234,254,0.7)",
//                       boxShadow: "0 2px 16px rgba(37,99,235,0.05)",
//                     }}
//                   >
//                     <Icon className="w-4 h-4 text-blue-400 mx-auto mb-2" />
//                     <div
//                       className="text-2xl font-bold text-slate-900 mb-0.5"
//                       style={{ fontFamily: "'Fraunces', serif" }}
//                     >
//                       {s.value}
//                     </div>
//                     <div className="text-xs text-slate-400 font-medium leading-snug">
//                       {s.label}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </FadeUp>
//         </div>
//       </section>

//       {/* ── FOCUS AREAS ── */}
//       <section className="py-20 px-6">
//         <div className="max-w-3xl mx-auto">
//           <FadeUp className="mb-10">
//             <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
//               <span className="w-5 h-px bg-blue-400 inline-block" /> Where I
//               help you
//             </span>
//             <h2
//               className="text-slate-900"
//               style={{
//                 fontFamily: "'Fraunces', serif",
//                 fontSize: "clamp(26px, 3.5vw, 40px)",
//                 fontWeight: 600,
//                 lineHeight: 1.2,
//               }}
//             >
//               Three things that change outcomes.
//             </h2>
//           </FadeUp>

//           <div className="grid md:grid-cols-3 gap-4">
//             {focusAreas.map((v, i) => {
//               const Icon = v.icon;
//               return (
//                 <FadeUp key={i} delay={i * 80}>
//                   <div
//                     className="value-card rounded-2xl p-6 h-full"
//                     style={{
//                       background: "rgba(255,255,255,0.85)",
//                       border: "1.5px solid rgba(219,234,254,0.6)",
//                       boxShadow: "0 2px 16px rgba(37,99,235,0.04)",
//                     }}
//                   >
//                     <div
//                       className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
//                       style={{ background: v.bg }}
//                     >
//                       <Icon className="w-5 h-5" style={{ color: v.accent }} />
//                     </div>
//                     <h3 className="font-semibold text-slate-900 mb-1.5 text-sm">
//                       {v.title}
//                     </h3>
//                     <p className="text-slate-400 text-sm leading-relaxed">
//                       {v.desc}
//                     </p>
//                   </div>
//                 </FadeUp>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* ── WHAT MAKES ME DIFFERENT ── */}
//       <section className="pb-20 px-6">
//         <div className="max-w-3xl mx-auto">
//           <FadeUp>
//             <div
//               className="rounded-2xl p-8 relative overflow-hidden"
//               style={{
//                 background: "rgba(255,255,255,0.9)",
//                 border: "1.5px solid rgba(219,234,254,0.7)",
//                 boxShadow: "0 4px 24px rgba(37,99,235,0.06)",
//               }}
//             >
//               <div
//                 className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
//                 style={{
//                   background:
//                     "linear-gradient(90deg, #1d4ed8, #0891b2, #7c3aed)",
//                 }}
//               />

//               <div className="grid md:grid-cols-2 gap-8 items-center pt-2">
//                 <div>
//                   <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3 block">
//                     Background
//                   </span>
//                   <h3
//                     className="text-slate-900 mb-3"
//                     style={{
//                       fontFamily: "'Fraunces', serif",
//                       fontSize: "22px",
//                       fontWeight: 600,
//                       lineHeight: 1.3,
//                     }}
//                   >
//                     Corporate experience,
//                     <br />
//                     <em style={{ color: "#2563eb", fontStyle: "italic" }}>
//                       not
//                     </em>{" "}
//                     classroom theory.
//                   </h3>
//                   <p className="text-slate-400 text-sm leading-relaxed">
//                     Trained at Tech Mahindra and IndiaMART. Worked alongside
//                     business leaders. Seen what panels actually look for — and
//                     what consistently makes candidates miss the mark.
//                   </p>
//                 </div>

//                 <div className="space-y-2.5">
//                   {differentiators.map((point, i) => (
//                     <div key={i} className="flex items-start gap-2.5">
//                       <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
//                       <span className="text-slate-600 text-sm">{point}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </FadeUp>
//         </div>
//       </section>

//       {/* ── CTA ── */}
//       <section className="pb-24 px-6">
//         <div className="max-w-3xl mx-auto">
//           <FadeUp>
//             <div
//               className="relative rounded-2xl p-10 text-center overflow-hidden"
//               style={{
//                 background:
//                   "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)",
//               }}
//             >
//               <div
//                 className="absolute top-0 left-0 w-56 h-56 rounded-full opacity-15 pointer-events-none"
//                 style={{
//                   background:
//                     "radial-gradient(circle, #60a5fa 0%, transparent 70%)",
//                   transform: "translate(-30%,-30%)",
//                 }}
//               />
//               <div
//                 className="absolute bottom-0 right-0 w-56 h-56 rounded-full opacity-10 pointer-events-none"
//                 style={{
//                   background:
//                     "radial-gradient(circle, #818cf8 0%, transparent 70%)",
//                   transform: "translate(30%,30%)",
//                 }}
//               />

//               <div className="relative z-10">
//                 <h2
//                   className="text-white mb-3"
//                   style={{
//                     fontFamily: "'Fraunces', serif",
//                     fontSize: "clamp(24px, 3.5vw, 40px)",
//                     fontWeight: 600,
//                     lineHeight: 1.2,
//                   }}
//                 >
//                   Your next offer starts{" "}
//                   <em style={{ fontStyle: "italic", color: "#93c5fd" }}>
//                     here.
//                   </em>
//                 </h2>
//                 <p className="text-blue-200 mb-7 max-w-md mx-auto text-sm leading-relaxed">
//                   Practical prep. Real techniques. No fluff.
//                 </p>
//                 <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
//                   <Link
//                     href="/signup"
//                     className="cta-btn inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-slate-900 text-sm bg-white"
//                   >
//                     Get started <ArrowRight className="w-4 h-4" />
//                   </Link>
//                   <Link
//                     href="/services"
//                     className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-medium text-white text-sm hover:bg-white/10 transition-all duration-200"
//                     style={{ border: "1.5px solid rgba(255,255,255,0.2)" }}
//                   >
//                     View services
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </FadeUp>
//         </div>
//       </section>

//       <StandardFooter />
//     </main>
//   );
// }


"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ChevronRight, Eye, Mic, Zap,
  FileText, TrendingUp, Users, Award,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";

/* ─── Intersection observer hook ─────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Animated counter ───────────────────────────────────── */
function useCounter(target: number, duration = 1600, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let v = 0;
    const step = Math.ceil(target / (duration / 16));
    const id = setInterval(() => {
      v = Math.min(v + step, target);
      setCount(v);
      if (v >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [active, target, duration]);
  return count;
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const { ref, inView } = useInView(0.4);
  const n = useCounter(target, 1400, inView);
  return <span ref={ref as React.RefObject<HTMLSpanElement>}>{n.toLocaleString()}{suffix}</span>;
}

/* ─── Fade-in wrapper ────────────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────── */
const PANEL_FILES = [
  {
    icon: Eye,
    code: "F-01",
    label: "Presence & Structure",
    verdict: "Unstructured",
    note: "Candidate jumped between points. No clear STAR framework. Panel lost the thread by minute three.",
    fix: "Structure your answers",
    colorClass: "text-[#1A3BCC]",
    barClass: "bg-[#1A3BCC]",
    iconBg: "bg-[#1A3BCC]/10",
    borderHover: "hover:border-[#1A3BCC]/30",
  },
  {
    icon: Mic,
    code: "F-02",
    label: "Composure Under Pressure",
    verdict: "Nervous",
    note: "Visible hesitation on the stress question. Filler words every 8 seconds. Good content lost in the delivery.",
    fix: "Communicate with confidence",
    colorClass: "text-violet-600",
    barClass: "bg-violet-600",
    iconBg: "bg-violet-600/10",
    borderHover: "hover:border-violet-300",
  },
  {
    icon: Zap,
    code: "F-03",
    label: "Adaptive Thinking",
    verdict: "Rigid",
    note: "When redirected with a curveball, candidate froze 4 seconds. Recovery was incomplete. Panel noted inflexibility.",
    fix: "Think on your feet",
    colorClass: "text-cyan-600",
    barClass: "bg-cyan-600",
    iconBg: "bg-cyan-600/10",
    borderHover: "hover:border-cyan-300",
  },
];

const GAP_ITEMS = [
  { candidate: "I answered all the questions.", panel: "The answers lacked a clear point." },
  { candidate: "I was calm and professional.", panel: "Confidence appeared rehearsed, not real." },
  { candidate: "I showed strong experience.", panel: "Experience wasn't connected to our problem." },
  { candidate: "I think it went well.", panel: "We're moving on to the next candidate." },
];

const TICKER = [
  "12+ Years Inside Hiring Panels", "✦",
  "5,000+ Candidates Coached", "✦",
  "94% Interview Success Rate", "✦",
  "Tech Mahindra", "✦", "IndiaMART", "✦",
  "Real Frameworks", "✦", "No Generic Scripts", "✦",
];

/* ─── Component ──────────────────────────────────────────── */
export default function WhyMePage() {
  return (
    <main className="font-[DM_Sans,sans-serif] bg-[#F8F7F3] min-h-screen overflow-x-hidden text-[#0F172A]">
      <Navbar />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400;1,9..40,700&display=swap");

        @keyframes tickerMove {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-inner { animation: tickerMove 30s linear infinite; }
        .ticker-inner:hover { animation-play-state: paused; }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-word { animation: fadeSlide 0.75s cubic-bezier(0.22,1,0.36,1) both; }

        @keyframes scanline {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(900%); opacity: 0; }
        }
        .scan { animation: scanline 3.5s ease-in-out infinite; }
      `}</style>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center pt-[90px] pb-16 px-6 relative overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(26,59,204,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
          style={{ background: "linear-gradient(225deg, rgba(26,59,204,0.08) 0%, transparent 60%)" }}
        />

        <div className="max-w-[1120px] mx-auto w-full relative z-10">
          {/* Eyebrow pill */}
          <div
            className="hero-word inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#1A3BCC]/25 bg-[#1A3BCC]/5 mb-10"
            style={{ animationDelay: "0ms" }}
          >
            <FileText className="w-3 h-3 text-[#1A3BCC]" />
            <span className="text-[11px] font-extrabold text-[#1A3BCC] tracking-[0.12em] uppercase">Panel's Perspective</span>
          </div>

          {/* Two-column hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="hero-word" style={{ animationDelay: "60ms" }}>
                <p className="text-sm font-semibold text-slate-500 tracking-[0.04em] uppercase mb-3">
                  What they write after you leave the room.
                </p>
              </div>

              <div
                className="hero-word"
                style={{ animationDelay: "120ms" }}
              >
                <div className="text-[clamp(64px,10vw,110px)] font-black leading-none tracking-[-0.04em] text-[#0F172A] mb-6">
                  <span className="block">Not</span>
                  <span className="block text-[#1A3BCC]">selected</span>
                  <span
                    className="block font-light text-slate-400 italic tracking-[-0.02em]"
                    style={{ fontSize: "clamp(48px,7vw,76px)" }}
                  >
                    to move forward.
                  </span>
                </div>
              </div>

              <div className="hero-word" style={{ animationDelay: "240ms" }}>
                <p className="text-sm lg:text-base text-slate-600 leading-[1.8] max-w-[440px] mb-8">
                  Most rejection emails look the same. But the notes inside that panel room are specific — and avoidable. I've been on both sides of that table for 12+ years.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] font-bold text-sm text-white bg-[#1A3BCC] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(26,59,204,0.35)]"
                  >
                    Start preparing <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] font-semibold text-sm text-[#1A3BCC] border border-[#1A3BCC]/25 no-underline bg-transparent hover:bg-[#1A3BCC]/5 transition-colors duration-200"
                  >
                    Explore services <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right — panel notes mockup */}
            <div className="hero-word relative" style={{ animationDelay: "320ms" }}>
              <div className="bg-white border border-[#1A3BCC]/[0.12] rounded-2xl p-7 shadow-[0_2px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
                {/* Scan line */}
                <div className="scan absolute left-0 right-0 h-[2px] pointer-events-none z-10"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(26,59,204,0.3), transparent)" }}
                />

                {/* Header */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#1A3BCC]/[0.08]">
                  <div>
                    <p className="text-[10px] font-extrabold text-[#1A3BCC] tracking-[0.1em] uppercase mb-0.5">Panel Assessment</p>
                    <p className="text-[13px] font-bold text-[#0F172A]">Candidate Review — Round 1</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-md bg-red-600/[0.08] border border-red-600/[0.15]">
                    <span className="text-[11px] font-bold text-red-600 tracking-[0.06em]">DECLINED</span>
                  </div>
                </div>

                {/* Notes */}
                {[
                  { field: "Structure", score: "2/5", note: "Answers lacked framework. Lost thread early." },
                  { field: "Presence", score: "2/5", note: "Nervous delivery. High filler word count." },
                  { field: "Adaptability", score: "1/5", note: "Froze on redirect. Recovery incomplete." },
                  { field: "Fit signal", score: "3/5", note: "Background strong. Presentation weak." },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 items-start py-3 ${i < 3 ? "border-b border-[#1A3BCC]/[0.06]" : ""}`}
                  >
                    <span className="text-[12px] font-bold text-[#1A3BCC] min-w-[90px]">{row.field}</span>
                    <span className="text-[12px] font-extrabold text-red-600 min-w-[28px]">{row.score}</span>
                    <span className="text-[12px] text-slate-500 leading-relaxed">{row.note}</span>
                  </div>
                ))}

                {/* Final note */}
                <div className="mt-4 p-3.5 rounded-[10px] bg-[#1A3BCC]/[0.04] border border-dashed border-[#1A3BCC]/[0.18]">
                  <p className="text-[11px] font-bold text-[#1A3BCC] tracking-[0.06em] uppercase mb-1">Assessor note</p>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    "Qualified on paper. Couldn't translate it in the room. Pass."
                  </p>
                </div>
              </div>

              {/* Floating tag */}
              <div className="absolute -bottom-3.5 left-6 bg-[#1A3BCC] rounded-lg px-3.5 py-1.5 flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-white">This is what I fix.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ─────────────────────────────────────────── */}
      <div className="bg-[#1A3BCC] py-3.5 overflow-hidden">
        <div className="flex whitespace-nowrap">
          <div className="ticker-inner flex gap-9 pr-9">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span
                key={i}
                className={`text-[12px] tracking-[0.06em] uppercase flex-shrink-0 ${t === "✦" ? "font-normal text-white/30" : "font-bold text-white/[0.88]"}`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ──────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1120px] mx-auto">
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-[#1A3BCC]/[0.08]"
            style={{ background: "rgba(26,59,204,0.08)" }}
          >
            {[
              { n: 12, suf: "+", label: "Years inside corporate hiring", icon: Award, color: "text-[#1A3BCC]", bg: "bg-[#1A3BCC]/10" },
              { n: 5000, suf: "+", label: "Candidates coached to offers", icon: Users, color: "text-violet-600", bg: "bg-violet-600/10" },
              { n: 94, suf: "%", label: "Interview-to-offer rate", icon: TrendingUp, color: "text-cyan-600", bg: "bg-cyan-600/10" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white p-12 lg:p-[48px_36px]">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${s.bg} mb-4`}>
                    <Icon className={`w-3 h-3 ${s.color}`} />
                    <span className={`text-[10px] font-extrabold ${s.color} uppercase tracking-[0.08em]`}>{s.label}</span>
                  </div>
                  <div className="text-[clamp(48px,7vw,80px)] font-black text-[#0F172A] leading-none tracking-[-0.04em]">
                    <Counter target={s.n} suffix={s.suf} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PANEL FILES ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#F8F7F3]">
        <div className="max-w-[1120px] mx-auto">
          <Reveal>
            <p className="text-[11px] font-extrabold text-[#1A3BCC] tracking-[0.1em] uppercase mb-2.5">Panel Assessment Files</p>
            <div className="flex items-end justify-between mb-14 gap-6 flex-wrap">
              <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold text-[#0F172A] leading-[1.1] tracking-[-0.03em] max-w-[520px]">
                Three failure patterns.<br />
                <span className="font-light text-slate-500 text-[clamp(22px,3vw,38px)] italic">Every single time.</span>
              </h2>
              <p className="text-sm text-slate-400 max-w-[280px] leading-[1.75]">
                These aren't soft skills. They're the exact observations written in panel notes when a qualified candidate gets passed over.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PANEL_FILES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={i} delay={i * 90}>
                  <div
                    className={`bg-white border border-[#1A3BCC]/[0.09] rounded-2xl p-8 h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ${f.borderHover} cursor-default`}
                  >
                    <div className="absolute top-5 right-5 text-[11px] font-extrabold text-[#1A3BCC]/20 tracking-[0.08em]">{f.code}</div>
                    <div className={`w-9 h-[3px] ${f.barClass} rounded-full mb-6`} />
                    <div className={`w-11 h-11 rounded-xl ${f.iconBg} flex items-center justify-center mb-5`}>
                      <Icon className={`w-5 h-5 ${f.colorClass}`} />
                    </div>
                    <p className={`text-[10px] font-extrabold ${f.colorClass} tracking-[0.1em] uppercase mb-1.5`}>{f.label}</p>
                    <h3 className="text-lg font-extrabold text-[#0F172A] tracking-[-0.02em] mb-3.5 leading-snug">
                      Panel verdict: <span className="text-red-600 italic">"{f.verdict}"</span>
                    </h3>
                    <div className="p-3.5 rounded-[10px] bg-red-600/[0.04] border border-red-600/[0.12] mb-5">
                      <p className="text-[12.5px] text-slate-500 leading-[1.65] italic">"{f.note}"</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${f.barClass} flex-shrink-0`} />
                      <span className={`text-[12px] font-bold ${f.colorClass}`}>What I train: {f.fix}</span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── THE GAP ────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0F172A] relative overflow-hidden">
        <div
          className="absolute -top-30 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(26,59,204,0.2) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 -left-15 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)" }}
        />

        <div className="max-w-[1120px] mx-auto relative z-10">
          <Reveal>
            <p className="text-[11px] font-extrabold text-blue-400/70 tracking-[0.1em] uppercase mb-2.5">The Perception Gap</p>
            <h2 className="text-[clamp(26px,3.5vw,44px)] font-extrabold text-white leading-[1.15] tracking-[-0.025em] mb-4 max-w-[600px]">
              What you think happened.<br />
              <span className="font-light text-white/45 italic">What they actually saw.</span>
            </h2>
            <p className="text-sm text-white/40 mb-14 leading-[1.7] max-w-[480px]">
              This gap is the entire problem. It exists because no one has ever shown you the other side of the table.
            </p>
          </Reveal>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_48px_1fr] mb-2">
            <div className="pl-4 pb-2.5">
              <span className="hidden md:inline text-[10px] font-extrabold text-blue-400/60 tracking-[0.1em] uppercase">Your interpretation</span>
            </div>
            <div />
            <div className="pl-4 pb-2.5">
              <span className="hidden md:inline text-[10px] font-extrabold text-red-400/70 tracking-[0.1em] uppercase">Panel's interpretation</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {GAP_ITEMS.map((g, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="group grid grid-cols-[1fr_48px_1fr] items-stretch">
                  <div className="bg-[#1A3BCC]/[0.12] border border-[#1A3BCC]/20 rounded-l-xl p-4 lg:p-[18px_20px] group-hover:bg-[#1A3BCC]/[0.06] transition-colors duration-200">
                    <p className="text-sm font-medium text-white/80 leading-relaxed">{g.candidate}</p>
                  </div>
                  <div className="flex items-center justify-center bg-white/[0.04] relative">
                    <div className="absolute w-px inset-y-0 bg-white/[0.06]" />
                    <span className="text-base text-white/15 font-black relative z-10">↔</span>
                  </div>
                  <div className="bg-red-600/[0.1] border border-red-600/20 rounded-r-xl p-4 lg:p-[18px_20px] group-hover:bg-red-600/[0.06] transition-colors duration-200">
                    <p className="text-sm font-medium text-white/80 leading-relaxed">{g.panel}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300}>
            <div className="mt-14 p-7 lg:p-[28px_32px] rounded-2xl border border-white/[0.08] bg-white/[0.04] flex items-center gap-5 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <p className="text-lg font-bold text-white leading-relaxed tracking-[-0.01em]">
                  I close this gap. That's the entire job.
                </p>
                <p className="text-[13px] text-white/40 mt-1 leading-relaxed">
                  12 years of sitting in those rooms. I know exactly what they're writing.
                </p>
              </div>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-[13px] text-[#1A3BCC] bg-white no-underline flex-shrink-0 hover:bg-slate-100 transition-colors duration-200"
              >
                Work with me <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MY BACKGROUND ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1120px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-12 lg:gap-20 items-start">
            {/* Left */}
            <div>
              <Reveal>
                <p className="text-[11px] font-extrabold text-[#1A3BCC] tracking-[0.1em] uppercase mb-3">Why I know this</p>
                <h2 className="text-[clamp(26px,3.5vw,44px)] font-extrabold text-[#0F172A] leading-[1.1] tracking-[-0.03em] mb-6">
                  Not a trainer.<br />
                  <span className="font-light text-slate-400 italic">A practitioner.</span>
                </h2>
                <p className="text-[15px] text-slate-500 leading-[1.85] mb-7 max-w-[520px]">
                  I spent 12+ years inside companies like Tech Mahindra and IndiaMART — not as a coach, but as someone who sat in the rooms where offers were made and rejected. I've been in the debrief where the panel dissects every answer you gave.
                </p>
                <p className="text-[15px] text-slate-500 leading-[1.85] max-w-[520px]">
                  That insider knowledge is what I bring to every session. You're not getting recycled frameworks — you're getting the actual lens the panel uses.
                </p>
                <div className="flex gap-2.5 mt-8 flex-wrap">
                  {["Tech Mahindra", "IndiaMART"].map((co) => (
                    <div
                      key={co}
                      className="px-4 py-2 rounded-lg border border-[#1A3BCC]/20 bg-[#1A3BCC]/[0.04] text-[13px] font-bold text-[#1A3BCC] tracking-[0.02em]"
                    >
                      {co}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right */}
            <Reveal delay={80}>
              <div className="border-l-2 border-[#1A3BCC]/[0.12] pl-8 pt-2">
                {[
                  { num: "01", text: "Real corporate exposure from inside two major firms" },
                  { num: "02", text: "Worked directly alongside senior business leaders" },
                  { num: "03", text: "Knows exactly what hiring panels write in their notes" },
                  { num: "04", text: "No scripted answers. No generic tips. No fluff." },
                ].map((pt, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 py-5 ${i < 3 ? "border-b border-[#1A3BCC]/[0.06]" : ""}`}
                  >
                    <span className="text-[11px] font-extrabold text-[#1A3BCC]/35 tracking-[0.06em] min-w-[22px] pt-0.5">{pt.num}</span>
                    <p className="text-sm font-medium text-[#0F172A] leading-[1.65]">{pt.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F8F7F3]">
        <div className="max-w-[820px] mx-auto text-center">
          <Reveal>
            <div className="w-10 h-[3px] bg-[#1A3BCC] rounded-full mx-auto mb-8" />
            <p className="text-[clamp(22px,4vw,40px)] font-bold text-[#0F172A] leading-[1.3] tracking-[-0.025em] mb-5">
              "The gap between your ability and how it comes across in a room — that's what I close."
            </p>
            <p className="text-[13px] font-semibold text-slate-400 tracking-[0.04em] uppercase">
              12+ years. 5,000+ coached. 94% success rate.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="pt-[72px] pb-28 px-6 bg-[#F8F7F3]">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="rounded-[28px] p-12 lg:p-[72px_64px] bg-[#0F172A] relative overflow-hidden text-center">
              {/* Grid texture */}
              <div
                className="absolute inset-0 rounded-[28px] pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />
              {/* Blobs */}
              <div
                className="absolute -top-20 -left-20 w-[340px] h-[340px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(26,59,204,0.35) 0%, transparent 65%)" }}
              />
              <div
                className="absolute -bottom-15 -right-15 w-[260px] h-[260px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 65%)" }}
              />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] mb-7">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                  <span className="text-[11px] font-extrabold text-white/70 uppercase tracking-[0.1em]">Your move</span>
                </div>

                <h2 className="text-[clamp(26px,5vw,52px)] font-extrabold text-white leading-[1.1] tracking-[-0.03em] mb-3.5">
                  Your next offer starts here.
                </h2>
                <p className="text-[15px] text-white/45 leading-[1.7] max-w-[420px] mx-auto mb-11">
                  Practical prep. Real techniques. No fluff.
                </p>

                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-extrabold text-sm text-[#0F172A] bg-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(26,59,204,0.35)]"
                  >
                    Get started <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white/80 border border-white/[0.18] no-underline hover:bg-white/[0.06] transition-colors duration-200"
                  >
                    View services
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <StandardFooter />
    </main>
  );
}