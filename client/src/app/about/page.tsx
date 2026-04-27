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

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChevronRight, Sparkles, Target, MessageSquare,
  BrainCircuit, ArrowRight, CheckCircle2, Users, Award, TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";

/* ─── helpers ─────────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCounter(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function AnimCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const { ref, inView } = useInView(0.3);
  const count = useCounter(target, 1600, inView);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const focusAreas = [
  { icon: Target, title: "Structure your answers", desc: "Crisp, logical responses that stick in the panel's memory long after the interview ends.", num: "01", accent: "#1A3BCC", bg: "rgba(26,59,204,0.06)" },
  { icon: MessageSquare, title: "Communicate with confidence", desc: "Turn nerves into clarity. Speak under pressure the way leaders do — measured, direct, compelling.", num: "02", accent: "#0891b2", bg: "rgba(8,145,178,0.06)" },
  { icon: BrainCircuit, title: "Think on your feet", desc: "Handle curveballs without losing your thread. Structured thinking that works even when the question blindsides you.", num: "03", accent: "#7c3aed", bg: "rgba(124,58,237,0.06)" },
];

const differentiators = [
  "Real corporate exposure from Tech Mahindra & IndiaMART",
  "Worked directly alongside senior business leaders",
  "Understands exactly what hiring panels look for",
  "No scripted answers. No generic tips. No fluff.",
];

const TICKER_ITEMS = [
  "12+ Years Corporate Experience", "★", "5,000+ Candidates Trained", "★",
  "94% Interview Success Rate", "★", "Tech Mahindra", "★", "IndiaMART", "★",
  "Real Frameworks. Real Results.", "★",
];

export default function WhyMePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", background: "#F7F4FE", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400;1,9..144,600&display=swap");

        * { box-sizing: border-box; }

        /* Ticker */
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track { animation: ticker 28s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }

        /* Fade up */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.75s cubic-bezier(0.22,1,0.36,1) both; }

        /* Hero word */
        @keyframes wordIn {
          from { opacity: 0; transform: translateY(40px) skewY(3deg); }
          to   { opacity: 1; transform: translateY(0) skewY(0); }
        }
        .word-in { animation: wordIn 0.8s cubic-bezier(0.22,1,0.36,1) both; }

        /* Orb drift */
        @keyframes drift {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(18px,-14px) scale(1.04); }
          66%      { transform: translate(-12px, 10px) scale(0.97); }
        }
        .orb { animation: drift 14s ease-in-out infinite; }

        /* Card hover */
        .focus-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .focus-card:hover { transform: translateY(-6px); box-shadow: 0 24px 56px rgba(26,59,204,0.12); }

        /* Marquee stripe */
        .marquee-stripe { background: #1A3BCC; overflow: hidden; }

        /* Diagonal cut */
        .diagonal-top    { clip-path: polygon(0 5%, 100% 0%, 100% 100%, 0% 100%); }
        .diagonal-bottom { clip-path: polygon(0 0%, 100% 0%, 100% 95%, 0 100%); }

        /* Number outline */
        .num-outline {
          -webkit-text-stroke: 1.5px rgba(26,59,204,0.18);
          color: transparent;
          font-family: 'Fraunces', serif;
          font-size: 80px;
          font-weight: 700;
          line-height: 1;
          user-select: none;
        }

        /* Glowing dot */
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(26,59,204,0.4); }
          50%      { box-shadow: 0 0 0 10px rgba(26,59,204,0); }
        }
        .glow-dot { animation: glowPulse 2.4s ease-in-out infinite; }

        /* Progress line */
        @keyframes lineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* Shimmer */
        @keyframes shimmer {
          from { background-position: -200% center; }
          to   { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #1A3BCC 0%, #60a5fa 40%, #1A3BCC 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        /* CTA glow btn */
        .glow-btn {
          position: relative;
          transition: transform 0.25s ease;
        }
        .glow-btn::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 16px;
          background: linear-gradient(135deg, #1A3BCC, #3b82f6);
          z-index: -1;
          opacity: 0;
          filter: blur(10px);
          transition: opacity 0.3s ease;
        }
        .glow-btn:hover { transform: translateY(-2px); }
        .glow-btn:hover::after { opacity: 0.6; }

        /* Split line */
        .split-line {
          width: 40px; height: 3px;
          background: linear-gradient(90deg, #1A3BCC, #60a5fa);
          border-radius: 99px;
          margin-bottom: 16px;
        }
      `}</style>

      {/* ══════════════════════════════════════
          HERO — editorial split layout
      ══════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: 96 }}
      >
        {/* Ambient orbs */}
        <div className="orb" style={{ position: "absolute", top: "8%", left: "6%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,59,204,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="orb" style={{ position: "absolute", bottom: "6%", right: "4%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)", animationDelay: "-6s", pointerEvents: "none" }} />

        {/* Grid texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(26,59,204,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,59,204,0.04) 1px, transparent 1px)", backgroundSize: "56px 56px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%", position: "relative", zIndex: 1 }}>

          {/* Eyebrow */}
          <div className="fade-up" style={{ animationDelay: "0ms", display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 99, background: "rgba(26,59,204,0.08)", border: "1px solid rgba(26,59,204,0.16)", marginBottom: 32 }}>
            <Sparkles style={{ width: 12, height: 12, color: "#1A3BCC" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#1A3BCC", letterSpacing: "0.1em", textTransform: "uppercase" }}>Why choose me?</span>
          </div>

          {/* Giant editorial headline */}
          <div style={{ marginBottom: 32 }}>
            <div className="word-in" style={{ animationDelay: "60ms" }}>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(52px, 9vw, 110px)", fontWeight: 300, lineHeight: 0.95, color: "#0F172A", letterSpacing: "-0.03em", marginBottom: 4 }}>
                I've been
              </p>
            </div>
            <div className="word-in" style={{ animationDelay: "140ms", display: "flex", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
              <em style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(52px, 9vw, 110px)", fontWeight: 600, fontStyle: "italic", lineHeight: 0.95, letterSpacing: "-0.03em", color: "#1A3BCC" }}>inside</em>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(52px, 9vw, 110px)", fontWeight: 300, lineHeight: 0.95, color: "#0F172A", letterSpacing: "-0.03em" }}>the</span>
            </div>
            <div className="word-in" style={{ animationDelay: "220ms" }}>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(52px, 9vw, 110px)", fontWeight: 300, lineHeight: 0.95, color: "#0F172A", letterSpacing: "-0.03em" }}>
                room you're<br />
                <span style={{ fontWeight: 700, color: "#0F172A" }}>preparing for.</span>
              </p>
            </div>
          </div>

          {/* Sub + CTAs in two-column layout */}
          <div className="fade-up" style={{ animationDelay: "380ms", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", marginTop: 48, flexWrap: "wrap" }}>
            <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.75, maxWidth: 480 }}>
              12+ years of real corporate experience across Tech Mahindra & IndiaMART. 5,000+ candidates trained. Most people don't fail because they're unqualified — they fail because they can't <em style={{ color: "#1A3BCC", fontStyle: "italic" }}>present</em> what they know.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
              <Link
                href="/signup"
                className="glow-btn"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 14, fontWeight: 700, fontSize: 14, color: "#fff", background: "linear-gradient(135deg, #1A3BCC, #3B5EE8)", textDecoration: "none" }}
              >
                Start preparing <ChevronRight style={{ width: 16, height: 16 }} />
              </Link>
              <Link
                href="/services"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, fontWeight: 600, fontSize: 14, color: "#1A3BCC", border: "1.5px solid rgba(26,59,204,0.2)", textDecoration: "none", background: "transparent", transition: "background 0.2s" }}
              >
                Explore services <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to bottom, transparent, #F7F4FE)", pointerEvents: "none" }} />
      </section>

      {/* ══════════════════════════════════════
          MARQUEE TICKER STRIPE
      ══════════════════════════════════════ */}
      <div className="marquee-stripe" style={{ padding: "14px 0" }}>
        <div style={{ display: "flex", overflow: "hidden", whiteSpace: "nowrap" }}>
          <div className="ticker-track" style={{ display: "flex", gap: 40, paddingRight: 40 }}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 600, color: item === "★" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.9)", letterSpacing: "0.04em", textTransform: "uppercase", flexShrink: 0 }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          STATS — oversized counter section
      ══════════════════════════════════════ */}
      <section style={{ padding: "100px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {[
              { label: "Years corporate experience", value: 12, suffix: "+", icon: Award, color: "#1A3BCC" },
              { label: "Candidates trained", value: 5000, suffix: "+", icon: Users, color: "#7c3aed" },
              { label: "Interview success rate", value: 94, suffix: "%", icon: TrendingUp, color: "#0891b2" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} style={{ padding: "56px 40px", borderRight: i < 2 ? "1px solid rgba(26,59,204,0.08)" : "none", textAlign: i === 1 ? "center" : i === 2 ? "right" : "left" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20, background: `${stat.color}12`, padding: "6px 14px", borderRadius: 99 }}>
                    <Icon style={{ width: 14, height: 14, color: stat.color }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: stat.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</span>
                  </div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(56px, 8vw, 96px)", fontWeight: 700, color: "#0F172A", lineHeight: 1, letterSpacing: "-0.04em" }}>
                    <AnimCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOCUS AREAS — numbered card grid
      ══════════════════════════════════════ */}
      <section style={{ padding: "100px 24px", background: "#F7F4FE", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Section header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 64, gap: 32, flexWrap: "wrap" }}>
            <div>
              <div className="split-line" />
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 600, color: "#0F172A", lineHeight: 1.15, letterSpacing: "-0.02em", maxWidth: 480 }}>
                Three things that <em style={{ fontStyle: "italic", color: "#1A3BCC" }}>change</em> outcomes.
              </h2>
            </div>
            <p style={{ fontSize: 14, color: "#94a3b8", maxWidth: 300, lineHeight: 1.7 }}>
              Not theory. Not scripts. Practical frameworks built from years inside hiring panels.
            </p>
          </div>

          {/* Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {focusAreas.map((v, i) => {
              const Icon = v.icon;
              const { ref, inView } = useInView();
              return (
                <div
                  key={i}
                  ref={ref}
                  className="focus-card"
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(26,59,204,0.08)",
                    borderRadius: 24,
                    padding: "36px 32px",
                    position: "relative",
                    overflow: "hidden",
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(32px)",
                    transition: `opacity 0.65s ease ${i * 100}ms, transform 0.65s ease ${i * 100}ms`,
                  }}
                >
                  {/* Outline number watermark */}
                  <div className="num-outline" style={{ position: "absolute", top: -8, right: 16, opacity: 0.6 }}>{v.num}</div>

                  {/* Top bar */}
                  <div style={{ height: 3, width: 40, background: v.accent, borderRadius: 99, marginBottom: 28 }} />

                  {/* Icon */}
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: v.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <Icon style={{ width: 22, height: 22, color: v.accent }} />
                  </div>

                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.01em", marginBottom: 10, lineHeight: 1.25 }}>{v.title}</h3>
                  <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.7 }}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BACKGROUND SECTION — dark split
      ══════════════════════════════════════ */}
      <section style={{ background: "#0F172A", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: -100, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,59,204,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, right: -60, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

            {/* Left — headline */}
            <div>
              <div className="split-line" style={{ background: "linear-gradient(90deg, #60a5fa, #818cf8)" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(96,165,250,0.8)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 16 }}>
                My Background
              </span>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 600, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 24 }}>
                Corporate experience,<br />
                <em style={{ fontStyle: "italic", color: "#93c5fd" }}>not</em> classroom theory.
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
                Trained at Tech Mahindra and IndiaMART. Worked alongside senior business leaders for over a decade. I've seen what makes candidates shine — and what consistently makes them miss the mark.
              </p>

              {/* Mini logos / company strip */}
              <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
                {["Tech Mahindra", "IndiaMART"].map((co) => (
                  <div key={co} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.02em" }}>
                    {co}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — differentiators as vertical checklist */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {differentiators.map((point, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 16,
                    padding: "24px 0",
                    borderBottom: i < differentiators.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <div className="glow-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#60a5fa", flexShrink: 0, marginTop: 6 }} />
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(96,165,250,0.7)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>
                      0{i + 1}
                    </span>
                    <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, fontWeight: 500 }}>{point}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUTH SECTION — editorial pull quote
      ══════════════════════════════════════ */}
      <section style={{ padding: "120px 24px", background: "#fff", position: "relative", overflow: "hidden" }}>
        {/* Large faint quote mark */}
        <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", fontFamily: "'Fraunces', serif", fontSize: 320, color: "rgba(26,59,204,0.04)", lineHeight: 1, pointerEvents: "none", userSelect: "none", fontWeight: 700 }}>"</div>

        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 16px", borderRadius: 99, background: "rgba(26,59,204,0.06)", border: "1px solid rgba(26,59,204,0.12)", marginBottom: 36 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1A3BCC", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#1A3BCC", textTransform: "uppercase", letterSpacing: "0.08em" }}>The hard truth</span>
          </div>

          <blockquote style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(26px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.3, color: "#0F172A", letterSpacing: "-0.02em", marginBottom: 32 }}>
            Most people don't fail because they're{" "}
            <em style={{ fontStyle: "italic", color: "#94a3b8", textDecoration: "line-through" }}>unqualified.</em>
            <br />They fail because they can't{" "}
            <span className="shimmer-text" style={{ fontWeight: 700 }}>present what they know.</span>
          </blockquote>

          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.7 }}>
            That gap between your ability and how it comes across in a room — that's exactly what I close.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA — full bleed gradient with glow
      ══════════════════════════════════════ */}
      <section style={{ padding: "80px 24px 120px", background: "#F7F4FE" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ borderRadius: 32, padding: "72px 56px", background: "linear-gradient(135deg, #0F172A 0%, #1A3BCC 50%, #1e40af 100%)", position: "relative", overflow: "hidden", textAlign: "center" }}>

            {/* Corner orbs */}
            <div style={{ position: "absolute", top: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.25) 0%, transparent 65%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />

            {/* Grid on dark */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px", borderRadius: 32, pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 99, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", marginBottom: 28 }}>
                <Sparkles style={{ width: 11, height: 11, color: "#93c5fd" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Ready to start?</span>
              </div>

              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 600, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.025em", marginBottom: 16 }}>
                Your next offer starts{" "}
                <em style={{ fontStyle: "italic", color: "#93c5fd" }}>here.</em>
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", marginBottom: 44, lineHeight: 1.7, maxWidth: 440, margin: "0 auto 44px" }}>
                Practical prep. Real techniques. No fluff.
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                <Link
                  href="/signup"
                  className="glow-btn"
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px", borderRadius: 14, fontWeight: 700, fontSize: 14, color: "#1A3BCC", background: "#fff", textDecoration: "none" }}
                >
                  Get started <ArrowRight style={{ width: 16, height: 16 }} />
                </Link>
                <Link
                  href="/services"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(255,255,255,0.2)", textDecoration: "none" }}
                >
                  View services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StandardFooter />
    </main>
  );
}
