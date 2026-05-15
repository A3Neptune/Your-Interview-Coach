"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ChevronRight, Eye, Mic, Zap,
  FileText, TrendingUp, Users, Award,
  CheckCircle2,
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

/* ─── Shared grid texture (used on all dark sections) ────── */
const GRID_TEXTURE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

/* ─── Data ───────────────────────────────────────────────── */
const PANEL_FILES = [
  {
    icon: Eye,
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

const WHY_ME_POINTS = [
  {
    num: "01",
    title: "Real Corporate Exposure",
    desc: "Inside experience from two of India's biggest firms — Tech Mahindra & IndiaMART.",
  },
  {
    num: "02",
    title: "Worked With Business Leaders",
    desc: "Sat alongside senior decision-makers. Knows how the top floor actually thinks.",
  },
  {
    num: "03",
    title: "Knows What Panels Write",
    desc: "Understands exactly what hiring panels note after you leave the room — and why.",
  },
  {
    num: "04",
    title: "No Scripts. No Fluff.",
    desc: "No generic tips or rehearsed lines. Only practical frameworks that hold under pressure.",
  },
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

        @keyframes shimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .image-ring {
          background: linear-gradient(135deg, #60a5fa, #3b82f6, #1d4ed8, #6366f1, #60a5fa);
          background-size: 300% 300%;
          animation: shimmer 5s ease-in-out infinite;
        }
      `}</style>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center pb-16 px-4 sm:px-6 relative overflow-hidden" style={{ paddingTop: "calc(var(--yic-header-h, 64px) + 28px)" }}>
        {/* Dot grid bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(26,59,204,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
          style={{ background: "linear-gradient(225deg, rgba(26,59,204,0.08) 0%, transparent 60%)" }}
        />

        <div className="max-w-[1200px] mx-auto w-full relative z-10">
          {/* Eyebrow */}
          <div
            className="hero-word inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#1A3BCC]/25 bg-[#1A3BCC]/5 mb-8 sm:mb-10"
            style={{ animationDelay: "0ms" }}
          >
            <FileText className="w-3 h-3 text-[#1A3BCC]" />
            <span className="text-[14px] font-extrabold text-[#1A3BCC] tracking-[0.12em] uppercase">Why Neel</span>
          </div>

          {/* Two-column */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 xl:gap-16 items-center">

            {/* Left — text */}
            <div className="order-2 lg:order-1">
              <div className="hero-word" style={{ animationDelay: "60ms" }}>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 tracking-[0.04em] uppercase mb-3">
                  12+ years. Both sides of the table.
                </p>
              </div>

              <div className="hero-word" style={{ animationDelay: "120ms" }}>
                <div
                  className="font-black leading-none tracking-[-0.04em] text-[#0F172A] mb-5 sm:mb-6"
                  style={{ fontSize: "clamp(42px,7.5vw,88px)" }}
                >
                  <span className="block">I've been</span>
                  <span className="block text-[#1A3BCC]">inside</span>
                  <span
                    className="block font-light text-slate-400 italic tracking-[-0.02em]"
                    style={{ fontSize: "clamp(28px,5vw,60px)" }}
                  >
                    the room you're&nbsp;preparing&nbsp;for.
                  </span>
                </div>
              </div>

              <div className="hero-word" style={{ animationDelay: "240ms" }}>
                <p className="text-sm lg:text-[15px] text-slate-600 leading-[1.8] max-w-[460px] mb-7 sm:mb-8">
                  Most rejection emails look the same. But the notes inside that panel room are specific — and avoidable. I've sat on both sides of that table for 12+ years across Tech Mahindra and IndiaMART.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-[10px] font-bold text-sm text-white bg-[#1A3BCC] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(26,59,204,0.35)]"
                  >
                    Start preparing <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-[10px] font-semibold text-sm text-[#1A3BCC] border border-[#1A3BCC]/25 no-underline bg-transparent hover:bg-[#1A3BCC]/5 transition-colors duration-200"
                  >
                    Explore services <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right — Neel's image, bigger, NO floating badges */}
            <div
              className="hero-word order-1 lg:order-2 flex justify-center lg:justify-end"
              style={{ animationDelay: "280ms" }}
            >
              {/* Shimmer ring */}
              <div className="image-ring p-[3px] rounded-[32px] w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[480px] xl:max-w-[520px] shadow-[0_28px_80px_rgba(26,59,204,0.25)]">
                <div className="bg-[#F8F7F3] p-1.5 rounded-[30px]">
                  <div
                    className="relative w-full rounded-[24px] overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <Image
                      src="/neel-aashish-seru.jpeg"
                      alt="Neel — Interview Coach"
                      fill
                      className="object-cover object-top"
                      priority
                    />
                    {/* Subtle depth gradient at bottom */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
                      style={{ background: "linear-gradient(to top, rgba(15,23,42,0.15), transparent)" }}
                    />
                  </div>
                </div>
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
                className={`text-[12px] tracking-[0.06em] uppercase flex-shrink-0 ${
                  t === "✦" ? "font-normal text-white/30" : "font-bold text-white/[0.88]"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
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
                <div key={i} className="bg-white px-8 py-10 sm:p-12 lg:p-[48px_36px]">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${s.bg} mb-4`}>
                    <Icon className={`w-3 h-3 ${s.color}`} />
                    <span className={`text-[10px] font-extrabold ${s.color} uppercase tracking-[0.08em]`}>{s.label}</span>
                  </div>
                  <div
                    className="font-black text-[#0F172A] leading-none tracking-[-0.04em]"
                    style={{ fontSize: "clamp(44px,7vw,80px)" }}
                  >
                    <Counter target={s.n} suffix={s.suf} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PANEL FILES ────────────────────────────────────── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 bg-[#F8F7F3]">
        <div className="max-w-[1120px] mx-auto">
          <Reveal>
            <p className="text-[18px] font-extrabold text-[#1A3BCC] tracking-[0.1em] uppercase mb-6 text-center">
              My Observations and Methodology
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PANEL_FILES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={i} delay={i * 90}>
                  <div
                    className={`bg-white border border-[#1A3BCC]/[0.09] rounded-2xl p-6 sm:p-8 h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ${f.borderHover} cursor-default`}
                  >
                    <div className={`w-9 h-[3px] ${f.barClass} rounded-full mb-6`} />
                    <div className={`w-11 h-11 rounded-xl ${f.iconBg} flex items-center justify-center mb-5`}>
                      <Icon className={`w-5 h-5 ${f.colorClass}`} />
                    </div>
                    <p className={`text-[10px] font-extrabold ${f.colorClass} tracking-[0.1em] uppercase mb-1.5`}>
                      {f.label}
                    </p>
                    <h3 className="text-lg font-extrabold text-[#0F172A] tracking-[-0.02em] mb-3.5 leading-snug">
                      Panel verdict:{" "}
                      <span className="text-red-600 italic">"{f.verdict}"</span>
                    </h3>
                    <div className="p-3.5 rounded-[10px] bg-red-600/[0.04] border border-red-600/[0.12] mb-5">
                      <p className="text-[12.5px] text-slate-500 leading-[1.65] italic">"{f.note}"</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${f.barClass} flex-shrink-0`} />
                      <span className={`text-[12px] font-bold ${f.colorClass}`}>
                        What I train: {f.fix}
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── THE GAP — dark #0F172A + grid texture ──────────── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 bg-[#0F172A] relative overflow-hidden">
        {/* Grid texture */}
        <div className="absolute inset-0 pointer-events-none" style={GRID_TEXTURE} />
        {/* Glow blobs */}
        <div
          className="absolute -top-32 -right-20 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(26,59,204,0.22) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-24 -left-16 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)" }}
        />

        <div className="max-w-[1120px] mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-10 sm:mb-14">
              <p className="text-[18px] font-extrabold text-blue-400/60 tracking-[0.1em] uppercase mb-3">
                The Perception Gap
              </p>
              <h2
                className="font-extrabold text-white leading-[1.15] tracking-[-0.03em]"
                style={{ fontSize: "clamp(26px,4.5vw,48px)" }}
              >
                What you think happened.
                <br />
                <span className="text-white/35 italic font-light">What they actually wrote.</span>
              </h2>
            </div>
          </Reveal>

          {/* Column headers — desktop only */}
          <div className="hidden sm:grid grid-cols-[1fr_48px_1fr] mb-2">
            <div className="pl-4 pb-2.5">
              <span className="text-[10px] font-extrabold text-blue-400/50 tracking-[0.1em] uppercase">
                Your interpretation
              </span>
            </div>
            <div />
            <div className="pl-4 pb-2.5">
              <span className="text-[10px] font-extrabold text-red-400/60 tracking-[0.1em] uppercase">
                Panel's interpretation
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 sm:gap-2">
            {GAP_ITEMS.map((g, i) => (
              <Reveal key={i} delay={i * 60}>
                {/* Desktop */}
                <div className="group hidden sm:grid grid-cols-[1fr_48px_1fr] items-stretch">
                  <div className="bg-[#1A3BCC]/[0.12] border border-[#1A3BCC]/20 rounded-l-xl p-4 lg:p-[18px_20px] group-hover:bg-[#1A3BCC]/[0.18] transition-colors duration-200">
                    <p className="text-sm font-medium text-white/80 leading-relaxed">{g.candidate}</p>
                  </div>
                  <div className="flex items-center justify-center bg-white/[0.03] relative">
                    <div className="absolute w-px inset-y-0 bg-white/[0.07]" />
                    <span className="text-base text-white/15 font-black relative z-10">↔</span>
                  </div>
                  <div className="bg-red-600/[0.1] border border-red-600/20 rounded-r-xl p-4 lg:p-[18px_20px] group-hover:bg-red-600/[0.14] transition-colors duration-200">
                    <p className="text-sm font-medium text-white/80 leading-relaxed">{g.panel}</p>
                  </div>
                </div>
                {/* Mobile: stacked */}
                <div className="sm:hidden flex flex-col gap-1.5">
                  <div className="bg-[#1A3BCC]/[0.15] border border-[#1A3BCC]/25 rounded-xl p-4">
                    <p className="text-[10px] font-extrabold text-blue-400/60 uppercase tracking-wider mb-1.5">You</p>
                    <p className="text-sm font-medium text-white/80 leading-relaxed">{g.candidate}</p>
                  </div>
                  <div className="bg-red-600/[0.1] border border-red-600/20 rounded-xl p-4">
                    <p className="text-[10px] font-extrabold text-red-400/60 uppercase tracking-wider mb-1.5">Panel</p>
                    <p className="text-sm font-medium text-white/80 leading-relaxed">{g.panel}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300}>
            <div className="mt-10 sm:mt-14 p-6 sm:p-[28px_32px] rounded-2xl border border-white/[0.08] bg-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex-1 min-w-[200px]">
                <p className="text-base sm:text-lg font-bold text-white leading-relaxed tracking-[-0.01em]">
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

      {/* ── WHY ME — dark #0F172A + grid texture, centered ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[#0F172A] relative overflow-hidden">
        {/* Grid texture */}
        <div className="absolute inset-0 pointer-events-none" style={GRID_TEXTURE} />
        {/* Top center glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(26,59,204,0.22) 0%, transparent 70%)" }}
        />

        <div className="max-w-[1120px] mx-auto relative z-10">
          {/* Centered heading */}
          <Reveal>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-[20px] font-extrabold text-blue-400/50 tracking-[0.14em] uppercase mb-4">
                Why Me?
              </p>
              <h2
                className="font-extrabold text-white leading-[1.1] tracking-[-0.035em] mb-5"
                style={{ fontSize: "clamp(28px,5vw,56px)" }}
              >
                Corporate experience,
                <br />
                <span className="text-white/30 italic font-light">not classroom theory.</span>
              </h2>
              <p className="text-[14px] sm:text-[15px] text-white/45 max-w-[480px] mx-auto leading-[1.75]">
                Trained at two of India's major firms. Worked alongside business leaders. Here's what that means for you.
              </p>
            </div>
          </Reveal>

          {/* 4 cards — 2×2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[860px] mx-auto">
            {WHY_ME_POINTS.map((pt, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group relative bg-white/[0.05] border border-white/[0.1] rounded-2xl p-7 sm:p-8 h-full hover:bg-white/[0.09] transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-default">
                  {/* Number watermark */}
                  <span className="absolute right-5 top-3 text-[56px] font-black text-white/[0.04] leading-none select-none pointer-events-none">
                    {pt.num}
                  </span>

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-[#1A3BCC]/30 border border-[#1A3BCC]/40 flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  </div>

                  {/* Number label */}
                  <p className="text-[10px] font-extrabold text-white/30 tracking-[0.12em] uppercase mb-2">
                    {pt.num}
                  </p>

                  <h3 className="text-[17px] sm:text-[18px] font-extrabold text-white leading-snug tracking-[-0.02em] mb-2.5">
                    {pt.title}
                  </h3>
                  <p className="text-[13.5px] text-white/45 leading-[1.7]">{pt.desc}</p>

                  {/* Bottom accent line on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ─────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#F8F7F3]">
        <div className="max-w-[820px] mx-auto text-center">
          <Reveal>
            <div className="w-10 h-[3px] bg-[#1A3BCC] rounded-full mx-auto mb-8" />
            <p
              className="font-bold text-[#0F172A] leading-[1.3] tracking-[-0.025em] mb-5"
              style={{ fontSize: "clamp(20px,4vw,40px)" }}
            >
              "The gap between your ability and how it comes across in a room — that's what I close."
            </p>
            <p className="text-[13px] font-semibold text-slate-400 tracking-[0.04em] uppercase">
              12+ years. 5,000+ coached. 94% success rate.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA — dark #0F172A + same grid texture ─────────── */}
      <section className="pt-14 sm:pt-[72px] pb-20 sm:pb-28 px-4 sm:px-6 bg-[#F8F7F3]">
        <div className="max-w-[900px] mx-auto">
          <Reveal>
            <div className="rounded-[24px] sm:rounded-[28px] p-8 sm:p-12 lg:p-[72px_64px] bg-[#0F172A] relative overflow-hidden text-center">
              {/* Grid texture — same pattern */}
              <div className="absolute inset-0 pointer-events-none" style={GRID_TEXTURE} />
              {/* Blobs */}
              <div
                className="absolute -top-20 -left-20 w-[320px] h-[320px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(26,59,204,0.35) 0%, transparent 65%)" }}
              />
              <div
                className="absolute -bottom-16 -right-16 w-[260px] h-[260px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 65%)" }}
              />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] mb-7">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                  <span className="text-[11px] font-extrabold text-white/70 uppercase tracking-[0.1em]">
                    Your move
                  </span>
                </div>

                <h2
                  className="font-extrabold text-white leading-[1.1] tracking-[-0.03em] mb-3.5"
                  style={{ fontSize: "clamp(24px,5vw,52px)" }}
                >
                  Your next offer starts here.
                </h2>
                <p className="text-[14px] sm:text-[15px] text-white/45 leading-[1.7] max-w-[420px] mx-auto mb-9 sm:mb-11">
                  Practical prep. Real techniques. No fluff.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-extrabold text-sm text-[#0F172A] bg-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(26,59,204,0.35)]"
                  >
                    Get started <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/services"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white/80 border border-white/[0.18] no-underline hover:bg-white/[0.06] transition-colors duration-200"
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