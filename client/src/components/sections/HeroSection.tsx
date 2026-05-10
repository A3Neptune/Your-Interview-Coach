"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import {
  ArrowRight, Mic2, FileText, Users, Video, Target,
  Sparkles, Play, Pause, CheckCircle2,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────
   SITE PALETTE  — aligned to /services page (accentPalette)
   Blue / Cyan / Purple / Green cycle on cream background
───────────────────────────────────────────────────────── */
const BRAND = "#2563eb";
const BRAND_DEEP = "#1d4ed8";
const PAPER = "#F8F6F1";
const INK = "#0f172a";
const MUTED = "#64748b";

/* ─────────────────────────────────────────────────────────
   SLIDE DATA — user-centric, second-person copy
   Accents are subtle blue tints from the site palette.
───────────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: "mock",
    step: "01",
    service: "Mock Interview",
    Icon: Mic2,
    tint: "#2563eb",
    eyebrow: "For when stakes are real",
    headBold: "You'll walk in",
    headLight: "knowing exactly what's coming.",
    sub: "Sit across from coaches who've been on the hiring side. You get a full interview simulation, a written debrief, and a clear map of what to fix — before your actual round.",
    cta: { label: "Book your mock", href: "/mock-interview" },
    ghost: { label: "Book your mock", href: "/services" },
    floater: { avatar: "RS", name: "Rahul S.", action: "landed offer at Infosys", time: "2 h ago" },
    cardTitle: "Your Mock Session",
    cardMeta: "60 min · Recorded · Debrief in 24 h",
    highlights: [
      "Role-specific question bank",
      "Written debrief after every session",
      "Body language + communication notes",
      "Unlimited re-attempts per topic",
    ],
    proof: "94% of students improve in 3 sessions or fewer",
  },
  {
    id: "resume",
    step: "02",
    service: "Resume Review",
    Icon: FileText,
    tint: "#0891b2",
    eyebrow: "For when you're getting ghosted",
    headBold: "Your resume",
    headLight: "will finally get read.",
    sub: "If recruiters aren't calling back, they never reached your skills. We rebuild yours from scratch — ATS-proof, impact-first, aimed at the roles you actually want.",
    cta: { label: "Start my review", href: "/resume" },
    ghost: { label: "Start my review", href: "/services" },
    floater: { avatar: "AP", name: "Ananya P.", action: "got 3 callbacks in a week", time: "yesterday" },
    cardTitle: "Your Resume Rebuild",
    cardMeta: "48-hr turnaround · 2 revision rounds",
    highlights: [
      "ATS keyword optimisation",
      "Quantified, impact-driven bullets",
      "Tailored to your target company",
      "Recruiter-eye scorecard + edits",
    ],
    proof: "Students report 5× more callbacks on average",
  },
  {
    id: "gd",
    step: "03",
    service: "Group Discussion",
    Icon: Users,
    tint: "#7c3aed",
    eyebrow: "For when groups shut you down",
    headBold: "You'll speak first,",
    headLight: "and be heard.",
    sub: "GDs aren't about the loudest — they're about the clearest. Learn to enter in the first 30 seconds, steer the group, and leave with the panel remembering your name.",
    cta: { label: "Join a live batch", href: "/group-discussion" },
    ghost: { label: "Join a live batch", href: "/services" },
    floater: { avatar: "MK", name: "Meera K.", action: "cleared campus GD round", time: "3 days ago" },
    cardTitle: "Your GD Practice Round",
    cardMeta: "6–8 peers · Expert moderator",
    highlights: [
      "Structured initiation frameworks",
      "Scoring rubric after every session",
      "Real peer dynamics — not scripted",
      "Personal feedback per participant",
    ],
    proof: "Batches capped at 8 — you always get feedback",
  },
  {
    id: "webinar",
    step: "04",
    service: "Live Webinars",
    Icon: Video,
    tint: "#059669",
    eyebrow: "For when you don't know where to start",
    headBold: "You'll hear it",
    headLight: "from the people hiring.",
    sub: "Every Friday, hiring managers share what actually moves the needle in their rooms. No script, no gated content — you ask, they answer, live.",
    cta: { label: "Reserve my seat", href: "/webinars" },
    ghost: { label: "Reserve my seat", href: "/services" },
    floater: { avatar: "VT", name: "Vikram T.", action: "attended 4 webinars, placed", time: "this week" },
    cardTitle: "Friday Live Webinar",
    cardMeta: "Free · Replay access for 30 days",
    highlights: [
      "Real hiring managers on the panel",
      "Live Q&A — your questions, answered",
      "Frameworks you can apply the same day",
      "Full replay + resource kit emailed",
    ],
    proof: "700+ students join every Friday on average",
  },
  {
    id: "placement",
    step: "05",
    service: "Placement Prep",
    Icon: Target,
    tint: "#2563eb",
    eyebrow: "For when placements are weeks away",
    headBold: "You'll be offer-ready",
    headLight: "before campus season opens.",
    sub: "Aptitude, coding, HR, technical — one structured track covers every round. Weekly checkpoints make sure you never fall behind, and mock tests tell you where you actually stand.",
    cta: { label: "Start placement prep", href: "/placement-prep" },
    ghost: { label: "Start placement prep", href: "/services" },
    floater: { avatar: "NS", name: "Neha S.", action: "cracked 4 offers this season", time: "last week" },
    cardTitle: "Your Placement Track",
    cardMeta: "8-week program · Weekly checkpoints",
    highlights: [
      "Aptitude + coding + HR in one track",
      "Weekly mock tests with percentile ranks",
      "Company-wise pattern analysis",
      "Placement-ready in under 8 weeks",
    ],
    proof: "3 in 4 finishers bag an offer before campus closes",
  },
] as const;

const DURATION = 6500;

/* ─────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────── */
function Counter({ value, suffix = "", decimals = 0, trigger }: { value: number; suffix?: string; decimals?: number; trigger: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, trigger]);
  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString("en-IN");
  return <>{formatted}{suffix}</>;
}

/* ─────────────────────────────────────────────────────────
   VARIANTS
───────────────────────────────────────────────────────── */
const leftContainer = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  exit:   { opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as const } },
};
const itemV = {
  enter: { opacity: 0, y: 16, filter: "blur(6px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  exit:   { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.22 } },
};
const wordV = {
  enter: { opacity: 0, y: 28, filter: "blur(8px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
  exit:   { opacity: 0, y: -14, filter: "blur(6px)", transition: { duration: 0.25 } },
};
const headContainer = {
  enter: {},
  center: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
  exit:   { transition: { staggerChildren: 0.025, staggerDirection: -1 } },
};
const rightV = {
  enter: { opacity: 0, scale: 0.94, y: 24 },
  center: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const, delay: 0.1 } },
  exit:   { opacity: 0, scale: 0.97, y: -12, transition: { duration: 0.3 } },
};
const highlightV = {
  enter: { opacity: 0, x: -10 },
  center: (i: number) => ({ opacity: 1, x: 0, transition: { duration: 0.45, delay: 0.55 + i * 0.07, ease: [0.22, 1, 0.36, 1] as const } }),
  exit:   { opacity: 0, x: 6, transition: { duration: 0.18 } },
};
const floaterV = {
  enter: { opacity: 0, y: 18, scale: 0.92 },
  center: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: 0.8 } },
  exit:   { opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.22 } },
};
const stepV = {
  enter: { opacity: 0, scale: 0.6 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
  exit:   { opacity: 0, scale: 0.8, transition: { duration: 0.25 } },
};

/* ─────────────────────────────────────────────────────────
   STATIC CSS — plain string (no interpolation) to prevent hydration mismatch
───────────────────────────────────────────────────────── */
const HC_CSS =
"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,300;1,9..40,400;1,9..40,500;1,9..40,600;1,9..40,700&display=swap');" +
".hc-section{--brand:#2563eb;--brand-deep:#1d4ed8;--ink:#0f172a;--muted:#64748b;--rule:rgba(15,23,42,0.08);--paper:#F8F6F1;--paper-soft:#f5f2ec}" +
"@keyframes hcBarFill{from{transform:scaleX(0)}to{transform:scaleX(1)}}" +
".hc-bar{height:100%;transform-origin:left;animation:hcBarFill 6500ms linear forwards;border-radius:0 2px 2px 0}" +
"@keyframes hcHaloPulse{0%,100%{opacity:0.45;transform:scale(1)}50%{opacity:0.75;transform:scale(1.05)}}" +
".hc-halo{position:absolute;inset:-50px;z-index:-1;border-radius:50%;filter:blur(70px);animation:hcHaloPulse 5s ease-in-out infinite;pointer-events:none}" +
"@keyframes hcFloatBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}" +
".hc-floater-wrap{animation:hcFloatBob 4s ease-in-out infinite}" +
"@keyframes hcLiveDot{0%,100%{opacity:1}50%{opacity:0.35}}" +
".hc-live-dot{animation:hcLiveDot 1.8s ease-in-out infinite}" +
"@keyframes hcShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}" +
".hc-cta-p{display:inline-flex;align-items:center;gap:8px;padding:14px 26px;border-radius:10px;font-size:14px;font-weight:600;color:#fff;text-decoration:none;font-family:inherit;letter-spacing:-0.005em;background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);box-shadow:0 10px 24px rgba(59,130,246,0.28),0 2px 6px rgba(37,99,235,0.18);transition:transform 0.18s,box-shadow 0.22s;position:relative;overflow:hidden}" +
".hc-cta-p::before{content:'';position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,0.28) 50%,transparent 70%);background-size:200% 100%;animation:hcShimmer 3.4s ease-in-out infinite;pointer-events:none}" +
".hc-cta-p:hover{transform:translateY(-2px);box-shadow:0 16px 36px rgba(59,130,246,0.38),0 4px 10px rgba(37,99,235,0.24)}" +
".hc-cta-p:active{transform:translateY(0)}" +
".ga{transition:transform 0.18s;display:inline-flex}" +
".hc-tab{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;padding:14px 14px 12px;border:none;border-top:2px solid transparent;cursor:pointer;background:transparent;transition:border-color 0.22s,background 0.22s,color 0.22s;font-family:inherit;text-align:left}" +
".hc-tab:hover{background:rgba(59,130,246,0.04)}" +
".hc-hl{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid rgba(15,23,42,0.05)}" +
".hc-hl:last-child{border-bottom:none}" +
".hc-pp{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid rgba(15,23,42,0.12);background:rgba(255,255,255,0.85);backdrop-filter:blur(8px);cursor:pointer;transition:all 0.16s;flex-shrink:0}" +
".hc-pp:hover{background:#fff;border-color:#2563eb;color:#2563eb}" +
".hc-stat+.hc-stat{border-left:1px solid var(--rule);padding-left:1.4rem}" +
".hc-glass{background:rgba(255,255,255,0.72);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(59,130,246,0.14);box-shadow:0 1px 0 rgba(255,255,255,0.8) inset,0 24px 60px -18px rgba(15,23,42,0.18),0 6px 20px rgba(59,130,246,0.08)}" +
".hc-word{display:inline-block;margin-right:0.22em;will-change:transform,opacity,filter}" +
".hc-mega-step{font-family:'DM Sans',system-ui,sans-serif;font-weight:800;font-size:clamp(120px,16vw,220px);line-height:0.82;letter-spacing:-0.07em;color:rgba(37,99,235,0.18);pointer-events:none;user-select:none;white-space:nowrap;display:block}" +
".hc-tab-step{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:18px;padding:0 5px;border-radius:5px;font-size:9.5px;font-weight:700;letter-spacing:0.04em;font-variant-numeric:tabular-nums;flex-shrink:0}" +
"@media(max-width:960px){.hc-grid{grid-template-columns:1fr!important;gap:2.5rem!important}.hc-right{justify-content:center!important}.hc-right-card{max-width:420px!important}.hc-mega-step{font-size:clamp(120px,26vw,200px)!important;top:30px!important;right:0!important}}" +
"@media(max-width:640px){.hc-tab{padding:10px 6px 8px;gap:5px}.hc-tab-inner{flex-direction:column!important;align-items:flex-start!important;gap:5px!important}.hc-tab-label{font-size:9px!important;letter-spacing:0.03em!important}.hc-tab-meta{display:none!important}.hc-mega-step{font-size:clamp(96px,28vw,160px)!important;top:24px!important;right:0!important;color:rgba(37,99,235,0.16)!important}.hc-head-row{font-size:clamp(32px,9vw,48px)!important}.hc-eyebrow-row{flex-wrap:wrap!important;gap:8px!important}.hc-eyebrow-sub{display:none!important}.hc-cta-p{padding:12px 20px!important;font-size:13.5px!important}.hc-stats .hc-stat{padding-right:1.1rem!important}.hc-stats .hc-stat+.hc-stat{padding-left:1.1rem!important}.hc-floater{left:50%!important;transform:translateX(-50%)!important;bottom:-32px!important;min-width:240px!important}}" +
"@media(max-width:440px){.hc-tab-label{display:none!important}.hc-tab-step{min-width:30px!important;height:24px!important;font-size:11px!important}.hc-head-row{font-size:clamp(28px,9.5vw,42px)!important}.hc-sub{font-size:13.5px!important}.hc-cta-row{gap:12px!important}.hc-stats p:first-child{font-size:18px!important}}";

/* ─────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────── */
export default function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Parallax motion values for card
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [5, -5]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-7, 7]), { stiffness: 120, damping: 20 });
  const tx = useSpring(useTransform(mx, [-1, 1], [-8, 8]), { stiffness: 120, damping: 20 });
  const ty = useSpring(useTransform(my, [-1, 1], [-5, 5]), { stiffness: 120, damping: 20 });

  const slide = SLIDES[idx];

  const goTo = useCallback((next: number) => {
    setIdx(next);
    setTick(t => t + 1);
  }, []);
  const advance = useCallback(() => goTo((idx + 1) % SLIDES.length), [idx, goTo]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(advance, DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [idx, paused, advance]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mx.set(nx);
    my.set(ny);
  };
  const handleMouseLeave = () => { mx.set(0); my.set(0); };

  const headBoldWords = slide.headBold.split(" ");
  const headLightWords = slide.headLight.split(" ");

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: HC_CSS }} />

      <section
        className="hc-section"
        style={{
          position: "relative",
          background: "var(--paper)",
          fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          color: INK,
        }}
      >
        {/* ── Top progress bar ── */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 3, background: "rgba(59,130,246,0.08)", zIndex: 40,
        }}>
          {!paused && (
            <div
              key={tick}
              className="hc-bar"
              style={{ background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DEEP})` }}
            />
          )}
        </div>

        {/* ── Subtle radial gradient backdrop (matches bg-gradient-radial) ── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(59,130,246,0.10), transparent)",
        }} />

        {/* Grid pattern — same as site bg-grid-pattern */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.055) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(59,130,246,0.055) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
        }} />

        {/* Ambient tint blob — uses slide tint subtly */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + "-env"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
            style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
          >
            <div style={{
              position: "absolute", width: 720, height: 720, borderRadius: "50%",
              filter: "blur(120px)",
              background: `radial-gradient(circle, ${slide.tint}18 0%, transparent 65%)`,
              top: -220, right: -180,
            }} />
            <div style={{
              position: "absolute", width: 480, height: 480, borderRadius: "50%",
              filter: "blur(100px)",
              background: `radial-gradient(circle, ${slide.tint}0d 0%, transparent 70%)`,
              bottom: 20, left: -100,
            }} />
          </motion.div>
        </AnimatePresence>

        {/* Giant ghost step number — lives at section level, behind content */}
        <div className="hc-mega-wrap" style={{
          position: "absolute", top: 0, right: 0, left: 0,
          display: "flex", justifyContent: "flex-end",
          pointerEvents: "none", zIndex: 3,
          maxWidth: 1280, margin: "0 auto",
          padding: "clamp(70px, 8vw, 100px) clamp(20px, 4vw, 56px) 0",
        }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={slide.id + "-step"}
              variants={stepV}
              initial="enter"
              animate="center"
              exit="exit"
              className="hc-mega-step"
            >
              {slide.step}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* ── Main content wrapper ── */}
        <div style={{
          position: "relative", zIndex: 10,
          flex: 1,
          width: "100%", maxWidth: 1280, margin: "0 auto",
          padding: "clamp(90px, 10vw, 128px) clamp(20px, 4vw, 56px) 0",
          display: "flex", flexDirection: "column",
        }}>

          {/* Two-column grid */}
          <div
            className="hc-grid"
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "54% 46%",
              gap: "clamp(2rem, 3.5vw, 4rem)",
              alignItems: "center",
              position: "relative",
              zIndex: 5,
            }}
          >
            {/* ───────── LEFT ───────── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + "-L"}
                variants={leftContainer}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
              >
                {/* Eyebrow — step chip + label */}
                <motion.div variants={itemV} className="hc-eyebrow-row" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "4px 10px 4px 8px",
                    borderRadius: 99,
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.2)",
                  }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: BRAND,
                      letterSpacing: "0.08em",
                    }}>
                      {slide.step} · {slide.service.toUpperCase()}
                    </span>
                    <span
                      className="hc-live-dot"
                      style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: BRAND, flexShrink: 0,
                      }}
                    />
                  </div>
                  <span className="hc-eyebrow-sub" style={{
                    fontSize: 12, color: MUTED, fontWeight: 500,
                    letterSpacing: "-0.005em",
                  }}>
                    {slide.eyebrow}
                  </span>
                </motion.div>

                {/* Headline — word-by-word stagger */}
                <motion.h1
                  variants={headContainer}
                  style={{
                    margin: "0 0 20px",
                    lineHeight: 1.02,
                    letterSpacing: "-0.04em",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                >
                  <span style={{
                    display: "block",
                    fontSize: "clamp(38px, 5.4vw, 72px)",
                    fontWeight: 700,
                    color: INK,
                    paddingBottom: 2,
                  }}>
                    {headBoldWords.map((w, i) => (
                      <motion.span key={i} variants={wordV} className="hc-word">{w}</motion.span>
                    ))}
                  </span>
                  <span style={{
                    display: "block",
                    fontSize: "clamp(38px, 5.4vw, 72px)",
                    fontWeight: 300,
                    color: MUTED,
                  }}>
                    {headLightWords.map((w, i) => (
                      <motion.span key={i} variants={wordV} className="hc-word">{w}</motion.span>
                    ))}
                  </span>
                </motion.h1>

                {/* Sub */}
                <motion.p variants={itemV} style={{
                  fontSize: "clamp(14px, 1.25vw, 16px)",
                  color: "#475569",
                  lineHeight: 1.72,
                  maxWidth: 460,
                  marginBottom: 32,
                  fontWeight: 400,
                  letterSpacing: "-0.003em",
                }}>
                  {slide.sub}
                </motion.p>

                {/* CTA */}
                <motion.div variants={itemV} style={{ display: "flex", alignItems: "center", marginBottom: 36 }}>
                  <Link href={slide.ghost.href} className="hc-cta-p">
                    <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
                      {slide.ghost.label}
                      <ArrowRight size={14} />
                    </span>
                  </Link>
                </motion.div>

                {/* Stats — animated counters */}
                <motion.div
                  variants={itemV}
                  key={slide.id + "-stats"}
                  style={{
                    display: "flex", gap: 0, alignItems: "flex-start",
                    paddingTop: "1.2rem",
                    borderTop: "1px solid var(--rule)",
                  }}
                >
                  {[
                    { val: 5000, suffix: "+", decimals: 0, label: "Coached" },
                    { val: 94,   suffix: "%", decimals: 0, label: "Success rate" },
                    { val: 4.9,  suffix: " ★", decimals: 1, label: "Avg rating" },
                  ].map((s) => (
                    <div key={s.label} className="hc-stat" style={{ paddingRight: "1.4rem" }}>
                      <p style={{
                        fontSize: "clamp(18px, 2vw, 26px)",
                        fontWeight: 700, color: INK,
                        letterSpacing: "-0.03em", lineHeight: 1,
                        fontVariantNumeric: "tabular-nums",
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                      }}>
                        <Counter value={s.val} suffix={s.suffix} decimals={s.decimals} trigger={tick} />
                      </p>
                      <p style={{
                        fontSize: "10px", fontWeight: 500,
                        textTransform: "uppercase", letterSpacing: "0.11em",
                        color: "#94a3b8", marginTop: 5,
                      }}>
                        {s.label}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* ───────── RIGHT ───────── */}
            <div
              className="hc-right"
              style={{
                position: "relative",
                display: "flex", alignItems: "center", justifyContent: "flex-end",
                perspective: 1400,
              }}
              onMouseMove={handleMouse}
              onMouseLeave={handleMouseLeave}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id + "-R"}
                  variants={rightV}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{
                    width: "100%",
                    maxWidth: "clamp(280px, 36vw, 410px)",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    rotateX: rx,
                    rotateY: ry,
                  }}
                >
                  {/* Pulsing subtle halo (blue, not multicolor) */}
                  <div
                    className="hc-halo"
                    style={{ background: `radial-gradient(circle, ${slide.tint}4d 0%, transparent 70%)` }}
                  />

                  {/* ── Service card (glass, matching site .glass) ── */}
                  <motion.div
                    className="hc-glass"
                    style={{
                      borderRadius: 20, overflow: "hidden",
                      x: tx, y: ty,
                      position: "relative",
                    }}
                  >
                    {/* Accent top bar */}
                    <div style={{
                      height: 3,
                      background: `linear-gradient(90deg, ${slide.tint}, ${BRAND_DEEP})`,
                    }} />

                    {/* Card header */}
                    <div style={{ padding: "22px 24px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 18 }}>
                        <div style={{
                          width: 46, height: 46, borderRadius: 12,
                          background: `linear-gradient(135deg, ${slide.tint}14, ${slide.tint}26)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: `1px solid ${slide.tint}33`,
                          flexShrink: 0,
                        }}>
                          <slide.Icon size={22} style={{ color: slide.tint }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <p style={{
                              fontSize: 15.5, fontWeight: 700, color: INK,
                              letterSpacing: "-0.02em", lineHeight: 1.2,
                            }}>
                              {slide.cardTitle}
                            </p>
                            <span
                              className="hc-live-dot"
                              style={{
                                width: 6, height: 6, borderRadius: "50%",
                                background: slide.tint,
                                boxShadow: `0 0 0 3px ${slide.tint}22`,
                                flexShrink: 0,
                              }}
                            />
                          </div>
                          <p style={{ fontSize: 11.5, color: MUTED, fontWeight: 500, marginTop: 3 }}>
                            {slide.cardMeta}
                          </p>
                        </div>
                      </div>

                      {/* Highlights — with check icon */}
                      <div>
                        {slide.highlights.map((text, i) => (
                          <motion.div
                            key={slide.id + "-hl-" + i}
                            custom={i}
                            variants={highlightV}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="hc-hl"
                          >
                            <CheckCircle2
                              size={15}
                              style={{ color: slide.tint, flexShrink: 0, marginTop: 1 }}
                              strokeWidth={2.2}
                            />
                            <span style={{
                              fontSize: 12.75, color: "#334155",
                              fontWeight: 500, lineHeight: 1.5,
                              letterSpacing: "-0.003em",
                            }}>
                              {text}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Card footer — proof */}
                    <div style={{
                      marginTop: 18, padding: "13px 24px",
                      background: "rgba(59,130,246,0.05)",
                      borderTop: "1px solid rgba(59,130,246,0.1)",
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <Sparkles size={12} style={{ color: slide.tint, flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: BRAND_DEEP, letterSpacing: "-0.003em" }}>
                        {slide.proof}
                      </span>
                    </div>
                  </motion.div>

                  {/* ── Floating activity card ── */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slide.id + "-floater"}
                      variants={floaterV}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="hc-floater-wrap"
                      style={{
                        position: "absolute",
                        bottom: -22, left: -28,
                        background: "#fff",
                        borderRadius: 14,
                        padding: "10px 14px",
                        boxShadow: "0 16px 40px rgba(15,23,42,0.10), 0 2px 6px rgba(15,23,42,0.05)",
                        border: "1px solid rgba(59,130,246,0.14)",
                        display: "flex", alignItems: "center", gap: 10,
                        minWidth: 220,
                        zIndex: 20,
                      }}
                    >
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${slide.tint}18, ${slide.tint}30)`,
                        border: `1px solid ${slide.tint}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, color: slide.tint,
                        flexShrink: 0,
                      }}>
                        {slide.floater.avatar}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: INK, lineHeight: 1.2 }}>
                          {slide.floater.name}
                        </p>
                        <p style={{ fontSize: 10.5, color: MUTED, fontWeight: 500, marginTop: 1 }}>
                          {slide.floater.action}
                        </p>
                      </div>
                      <span style={{
                        fontSize: 9.5, color: "#94a3b8", fontWeight: 600,
                        whiteSpace: "nowrap", flexShrink: 0,
                      }}>
                        {slide.floater.time}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ────── BOTTOM TAB STRIP ────── */}
          <div style={{
            marginTop: "clamp(2.5rem, 5vw, 4rem)",
            borderTop: "1px solid var(--rule)",
            display: "flex", alignItems: "stretch",
            position: "relative", zIndex: 10,
          }}>
            {/* Play / Pause button */}
            <div style={{
              display: "flex", alignItems: "flex-start",
              paddingTop: 14, paddingRight: 10, flexShrink: 0,
            }}>
              <button
                className="hc-pp"
                onClick={() => setPaused(p => !p)}
                aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
              >
                {paused
                  ? <Play size={12} fill="#475569" style={{ color: "#475569" }} />
                  : <Pause size={12} style={{ color: "#475569" }} />
                }
              </button>
            </div>

            {/* Service tabs */}
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                className="hc-tab"
                onClick={() => {
                  if (timerRef.current) clearTimeout(timerRef.current);
                  goTo(i);
                }}
                style={{
                  borderTopColor: i === idx ? BRAND : "rgba(15,23,42,0.09)",
                  background: i === idx ? "rgba(59,130,246,0.04)" : "transparent",
                }}
              >
                <span className="hc-tab-inner" style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                }}>
                  <span
                    className="hc-tab-step"
                    style={{
                      background: i === idx ? s.tint : "rgba(15,23,42,0.06)",
                      color: i === idx ? "#fff" : "#64748b",
                    }}
                  >
                    {s.step}
                  </span>
                  <span
                    className="hc-tab-label"
                    style={{
                      fontSize: 11, fontWeight: 600,
                      letterSpacing: "0.04em", textTransform: "uppercase",
                      color: i === idx ? INK : "#94a3b8",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}
                  >
                    {s.service}
                  </span>
                </span>
                <span
                  className="hc-tab-meta"
                  style={{
                    fontSize: 10.5, color: "#9ca3af", fontWeight: 500,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}
                >
                  {s.cardMeta.split("·")[0].trim()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom breathing room */}
        <div style={{ height: "clamp(1.5rem, 3vw, 2.5rem)", position: "relative", zIndex: 10 }} />
      </section>
    </>
  );
}
