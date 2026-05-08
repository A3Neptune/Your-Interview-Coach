"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import Link from "next/link";
import {
  FileText, Users, Mic2, Video, ArrowRight, CheckCircle2,
  Clock, ChevronRight, Sparkles, Zap, Target,
  TrendingUp, Play, Pause, Star,
} from "lucide-react";

/* ── Brand tokens (matches /services accentPalette + HeroCarousel) ── */
const PAPER   = "#F8F6F1";
const INK     = "#0f172a";
const MUTED   = "#64748b";
const BRAND   = "#2563eb";
const BRAND_D = "#1e3a8a";

/* ── Module data ── */
type ModuleType = {
  id: string;
  step: string;
  icon: React.ElementType;
  dur: string;
  tag: string;
  color: string;
  colorDk: string;
  colorLt: string;
  colorBd: string;
  name: string;
  full: string;
  eyebrow: string;
  obj: string;
  content: { type: "points"; points: string[] } | { type: "parts"; parts: { label: string; items: string[] }[] };
  activity?: string;
  outcomes: string[];
  proof: string;
  floater: { initials: string; name: string; win: string; time: string };
};

const MODULES: ModuleType[] = [
  {
    id: "resume",
    step: "01",
    icon: FileText,
    dur: "60 min",
    tag: "Start Here",
    color: "#2563eb",
    colorDk: "#1e3a8a",
    colorLt: "rgba(37,99,235,0.08)",
    colorBd: "rgba(37,99,235,0.22)",
    name: "Resume",
    full: "Resume Analysis & Positioning",
    eyebrow: "Before anything else — fix your resume.",
    obj: "Turn a basic resume into an interview-winning document.",
    content: {
      type: "points",
      points: [
        "Live resume audit — structure, keywords, impact",
        "Identifying gaps & weak areas",
        "Converting responsibilities → achievements",
        "Aligning resume with your target roles",
      ],
    },
    outcomes: ["Refined, recruiter-ready resume", "Clear positioning of your profile"],
    proof: "Students report 5× more callbacks after the session",
    floater: { initials: "RS", name: "Rahul S.", win: "landed Infosys offer", time: "2 h ago" },
  },
  {
    id: "gd",
    step: "02",
    icon: Users,
    dur: "60 min",
    tag: "Group Activity",
    color: "#0891b2",
    colorDk: "#155e75",
    colorLt: "rgba(8,145,178,0.08)",
    colorBd: "rgba(8,145,178,0.22)",
    name: "GD Mastery",
    full: "Group Discussion (GD) Mastery",
    eyebrow: "For when groups shut you out.",
    obj: "Stand out in GDs without over-speaking.",
    content: {
      type: "points",
      points: [
        "Types of GDs — abstract, case-based, current affairs",
        "How to start, enter, and conclude effectively",
        "Structuring thoughts quickly under pressure",
        "Common mistakes that eliminate candidates",
      ],
    },
    activity: "Live mini GD simulation + real-time feedback",
    outcomes: ["Structured thinking under pressure", "Confident participation strategy"],
    proof: "Batches capped at 8 — every participant gets personal feedback",
    floater: { initials: "MK", name: "Meera K.", win: "cleared campus GD round", time: "3 days ago" },
  },
  {
    id: "interview",
    step: "03",
    icon: Mic2,
    dur: "120 min",
    tag: "Intensive",
    color: "#7c3aed",
    colorDk: "#4c1d95",
    colorLt: "rgba(124,58,237,0.08)",
    colorBd: "rgba(124,58,237,0.22)",
    name: "Interview Prep",
    full: "Interview Preparation – Core",
    eyebrow: "For when you blank out mid-answer.",
    obj: "Build strong, structured, and confident responses.",
    content: {
      type: "parts",
      parts: [
        {
          label: "Part A — Introduction Mastery",
          items: [
            'Crafting a powerful "Tell Me About Yourself"',
            "Personal branding in 60–90 seconds",
          ],
        },
        {
          label: "Part B — Common Questions",
          items: [
            "HR questions — strengths, weaknesses, goals",
            "Situation-based answers using STAR method",
            "Answer structuring for clarity & impact",
          ],
        },
        {
          label: "Part C — Live Practice",
          items: ["Real-time correction & improvement"],
        },
      ],
    },
    outcomes: [
      "Finalized, polished introduction",
      "Ready answers for most-asked questions",
      "Improved articulation & confidence",
    ],
    proof: "94% of participants feel interview-ready after this module",
    floater: { initials: "AP", name: "Ananya P.", win: "got 3 callbacks in a week", time: "yesterday" },
  },
  {
    id: "mock",
    step: "04",
    icon: Video,
    dur: "60 min",
    tag: "Final Round",
    color: "#059669",
    colorDk: "#064e3b",
    colorLt: "rgba(5,150,105,0.08)",
    colorBd: "rgba(5,150,105,0.22)",
    name: "Mock Interview",
    full: "Mock Interview + Feedback",
    eyebrow: "The final test before the real one.",
    obj: "Simulate real interview pressure in a safe environment.",
    content: {
      type: "points",
      points: [
        "Short mock interview rounds",
        "Personalized feedback on communication & confidence",
        "Assessment of content quality",
        "Key improvement pointers",
      ],
    },
    outcomes: ["Real interview experience", "Clear action plan for improvement"],
    proof: "3 in 4 graduates bag an offer within 4 weeks",
    floater: { initials: "VT", name: "Vikram T.", win: "cracked TCS & Wipro", time: "this week" },
  },
];

const DELIVERABLES = [
  { icon: FileText,    color: "#2563eb", lt: "rgba(37,99,235,0.08)",    label: "Resume improvement suggestions (documented)" },
  { icon: Mic2,        color: "#0891b2", lt: "rgba(8,145,178,0.08)",    label: "Finalized interview introduction" },
  { icon: Users,       color: "#7c3aed", lt: "rgba(124,58,237,0.08)",   label: "GD performance feedback" },
  { icon: TrendingUp,  color: "#059669", lt: "rgba(5,150,105,0.08)",    label: "Personalized interview improvement roadmap" },
];

const MENTORS = [
  { name: "Neel",    role: "Interview Coach & Career Strategist", color: "#2563eb", grd: "linear-gradient(135deg,#1e3a8a,#2563eb)" },
  { name: "Aashish", role: "GD Facilitator & HR Specialist",      color: "#0891b2", grd: "linear-gradient(135deg,#155e75,#0891b2)" },
  { name: "Seru",    role: "Resume Expert & Placement Advisor",    color: "#7c3aed", grd: "linear-gradient(135deg,#4c1d95,#7c3aed)" },
];

/* ── Motion variants ── */
const tabContent = {
  enter: { opacity: 0, y: 20, filter: "blur(6px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, staggerChildren: 0.06 } },
  exit:   { opacity: 0, y: -14, filter: "blur(4px)", transition: { duration: 0.25 } },
};
const child = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
  exit:   { opacity: 0, y: -8, transition: { duration: 0.2 } },
};
const floaterV = {
  enter: { opacity: 0, y: 18, scale: 0.92 },
  center: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: 0.65 } },
  exit:   { opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.22 } },
};
const cardV = {
  enter: { opacity: 0, scale: 0.94, x: 24 },
  center: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const, delay: 0.08 } },
  exit:   { opacity: 0, scale: 0.97, x: -16, transition: { duration: 0.28 } },
};
const megaV = {
  enter: { opacity: 0, scale: 0.55 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
  exit:   { opacity: 0, scale: 0.75, transition: { duration: 0.25 } },
};

/* ── Animated counter ── */
function Counter({ to, suffix = "", decimals = 0, trigger }: { to: number; suffix?: string; decimals?: number; trigger: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const c = animate(0, to, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: v => setVal(v) });
    return () => c.stop();
  }, [to, trigger]);
  return <>{decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-IN")}{suffix}</>;
}

/* ── Point item ── */
function Point({ text, color, lt, bd }: { text: string; color: string; lt: string; bd: string }) {
  return (
    <motion.div variants={child} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 9 }}>
      <div style={{
        width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 2,
        background: lt, border: `1px solid ${bd}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <CheckCircle2 size={10} style={{ color }} strokeWidth={3} />
      </div>
      <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, fontWeight: 450 }}>{text}</span>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════ */
export default function PlacementJourney() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick]     = useState(0);
  const DURATION = 7000;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Parallax for right card */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-1, 1], [6, -6]), { stiffness: 100, damping: 18 });
  const rotY = useSpring(useTransform(mx, [-1, 1], [-8, 8]), { stiffness: 100, damping: 18 });
  const tx   = useSpring(useTransform(mx, [-1, 1], [-7, 7]), { stiffness: 100, damping: 18 });
  const ty   = useSpring(useTransform(my, [-1, 1], [-4, 4]), { stiffness: 100, damping: 18 });

  const mod = MODULES[active];

  const goTo = useCallback((i: number) => { setActive(i); setTick(t => t + 1); }, []);
  const advance = useCallback(() => goTo((active + 1) % MODULES.length), [active, goTo]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(advance, DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, paused, advance]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top)  / r.height) * 2 - 1);
  };
  const onMouseLeave = () => { mx.set(0); my.set(0); };

  /* For scroll-reveal on static sections */
  const useReveal = (threshold = 0.1) => {
    const ref = useRef<HTMLDivElement>(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
      obs.observe(el);
      return () => obs.disconnect();
    }, [threshold]);
    return { ref, vis };
  };

  const deliv   = useReveal();
  const mentors = useReveal();
  const cta     = useReveal();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,400;1,9..144,600&display=swap');

        .pj-wrap { --paper:${PAPER}; --ink:${INK}; --muted:${MUTED}; --brand:${BRAND}; --brand-d:${BRAND_D}; --rule:rgba(15,23,42,0.08); }

        @keyframes pj-bar   { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes pj-bob   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes pj-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes pj-glow  { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.06)} }
        @keyframes pj-shim  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

        .pj-bar-fill {
          height:100%; transform-origin:left; border-radius:0 2px 2px 0;
          animation: pj-bar ${DURATION}ms linear forwards;
        }
        .pj-float { animation: pj-bob 4s ease-in-out infinite; }
        .pj-dot-live { animation: pj-pulse 1.8s ease-in-out infinite; }
        .pj-halo { position:absolute; border-radius:50%; filter:blur(72px); animation:pj-glow 5s ease-in-out infinite; pointer-events:none; }

        /* Tab strip */
        .pj-tab {
          flex:1; min-width:0; padding:14px 12px 12px;
          border:none; border-top:2px solid transparent;
          cursor:pointer; background:transparent;
          transition:border-color .22s,background .22s;
          font-family:inherit; text-align:left;
          display:flex; flex-direction:column; gap:4px;
        }
        .pj-tab:hover { background:rgba(37,99,235,0.04); }

        /* Module card (glass) */
        .pj-glass {
          background:rgba(255,255,255,0.75);
          backdrop-filter:blur(22px);
          -webkit-backdrop-filter:blur(22px);
          border:1px solid rgba(37,99,235,0.14);
          box-shadow:0 1px 0 rgba(255,255,255,0.85) inset, 0 28px 64px -20px rgba(15,23,42,0.16), 0 6px 22px rgba(37,99,235,0.07);
        }

        /* CTA primary */
        .pj-cta-p {
          display:inline-flex; align-items:center; gap:8px;
          padding:14px 28px; border-radius:12px; font-size:15px;
          font-weight:700; color:#fff; cursor:pointer; border:none;
          background:linear-gradient(135deg,${BRAND_D},${BRAND});
          box-shadow:0 8px 28px rgba(37,99,235,0.28);
          transition:transform .2s,box-shadow .2s;
          font-family:inherit; text-decoration:none; position:relative; overflow:hidden;
        }
        .pj-cta-p::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,0.26) 50%,transparent 70%);
          background-size:200% 100%; animation:pj-shim 3.4s ease-in-out infinite;
          pointer-events:none;
        }
        .pj-cta-p:hover { transform:translateY(-2px); box-shadow:0 14px 40px rgba(37,99,235,0.38); }

        /* Ghost CTA */
        .pj-cta-g {
          display:inline-flex; align-items:center; gap:6px;
          padding:14px 22px; border-radius:12px; font-size:14px;
          font-weight:600; cursor:pointer;
          border:1.5px solid rgba(37,99,235,0.22);
          background:rgba(37,99,235,0.05); color:${BRAND_D};
          transition:background .2s,border-color .2s;
          font-family:inherit; text-decoration:none;
        }
        .pj-cta-g:hover { background:rgba(37,99,235,0.1); border-color:${BRAND}; }

        /* Stat block */
        .pj-stat + .pj-stat { border-left:1px solid var(--rule); padding-left:1.4rem; }

        /* Reveal */
        .pj-reveal { opacity:0; transform:translateY(28px); transition:opacity .65s,transform .65s; }
        .pj-reveal.in { opacity:1; transform:none; }

        /* Mega step number */
        .pj-mega {
          font-family:'DM Sans',system-ui,sans-serif;
          font-size:clamp(110px,15vw,200px);
          font-weight:800; line-height:0.84; letter-spacing:-0.07em;
          color:rgba(37,99,235,0.15); pointer-events:none; user-select:none;
          white-space:nowrap;
        }

        /* Mobile responsive */
        @media(max-width:900px){
          .pj-two-col { grid-template-columns:1fr !important; }
          .pj-card-wrap { justify-content:center !important; }
          .pj-card-inner { max-width:440px !important; }
        }
        @media(max-width:640px){
          .pj-tab { padding:10px 6px 8px; }
          .pj-tab-meta { display:none !important; }
          .pj-tab-name { font-size:9px !important; }
          .pj-floater { left:50% !important; transform:translateX(-50%) !important; bottom:-28px !important; min-width:220px !important; }
          .pj-cta-p { padding:12px 20px !important; font-size:14px !important; }
        }
        @media(max-width:440px){
          .pj-tab-name { display:none !important; }
          .pj-tab-chip { min-width:28px !important; height:22px !important; font-size:10.5px !important; }
        }
      `}</style>

      <main className="pj-wrap" style={{ background: PAPER, fontFamily: "'DM Sans',system-ui,sans-serif", color: INK, minHeight: "100vh", overflowX: "hidden" }}>

        {/* ══════════ HERO ══════════ */}
        <section style={{ position: "relative", padding: "clamp(80px,10vw,130px) clamp(20px,5vw,60px) 0", overflow: "hidden" }}>

          {/* BG layers */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {/* Dot grid */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "radial-gradient(rgba(37,99,235,0.07) 1px,transparent 1px)",
              backgroundSize: "30px 30px",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%,black,transparent)",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%,black,transparent)",
            }} />
            {/* Line grid */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(37,99,235,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.045) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
              WebkitMaskImage: "radial-gradient(ellipse 55% 45% at 50% 20%,black,transparent)",
              maskImage: "radial-gradient(ellipse 55% 45% at 50% 20%,black,transparent)",
            }} />
            {/* Top-right glow */}
            <div style={{ position: "absolute", top: -100, right: -80, width: 600, height: 600, borderRadius: "50%", filter: "blur(100px)", background: "radial-gradient(circle,rgba(37,99,235,0.1),transparent 65%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: -60, width: 400, height: 400, borderRadius: "50%", filter: "blur(80px)", background: "radial-gradient(circle,rgba(8,145,178,0.07),transparent 65%)" }} />
          </div>

          {/* Progress bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "rgba(37,99,235,0.07)", zIndex: 40 }}>
            {!paused && (
              <div key={tick} className="pj-bar-fill" style={{ background: `linear-gradient(90deg,${BRAND},${BRAND_D})` }} />
            )}
          </div>

          {/* Mega step — behind everything */}
          <div style={{ position: "absolute", top: "clamp(60px,9vw,110px)", right: "clamp(16px,4vw,56px)", zIndex: 1, pointerEvents: "none" }}>
            <AnimatePresence mode="wait">
              <motion.span key={mod.step} variants={megaV} initial="enter" animate="center" exit="exit" className="pj-mega">
                {mod.step}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Ambient tint (changes per slide) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mod.id + "-env"}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
            >
              <div style={{ position: "absolute", width: 680, height: 680, borderRadius: "50%", filter: "blur(110px)", background: `radial-gradient(circle,${mod.color}18,transparent 65%)`, top: -200, right: -150 }} />
            </motion.div>
          </AnimatePresence>

          {/* ── Two-column grid ── */}
          <div
            className="pj-two-col"
            style={{
              position: "relative", zIndex: 10,
              display: "grid", gridTemplateColumns: "54% 46%",
              gap: "clamp(2rem,4vw,5rem)",
              alignItems: "center",
              maxWidth: 1280, margin: "0 auto",
            }}
          >

            {/* ─── LEFT ─── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mod.id + "-L"}
                variants={tabContent}
                initial="enter" animate="center" exit="exit"
                style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
              >

                {/* Eyebrow pill */}
                <motion.div variants={child} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "4px 12px 4px 8px", borderRadius: 99,
                    background: `${mod.colorLt}`, border: `1px solid ${mod.colorBd}`,
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: mod.color, letterSpacing: "0.08em" }}>
                      {mod.step} · {mod.name.toUpperCase()}
                    </span>
                    <span className="pj-dot-live" style={{ width: 5, height: 5, borderRadius: "50%", background: mod.color }} />
                  </div>
                  <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>{mod.eyebrow}</span>
                </motion.div>

                {/* Headline */}
                <motion.h1 variants={child} style={{ margin: "0 0 18px", fontFamily: "'Fraunces',serif", fontSize: "clamp(34px,5vw,66px)", fontWeight: 600, lineHeight: 1.04, letterSpacing: "-0.03em", color: INK }}>
                  {mod.full.split(" ").map((w, i) => {
                    const isAccent = w === "Analysis" || w === "Discussion" || w === "Preparation" || w === "Interview";
                    return (
                      <span key={i} style={{ color: isAccent ? mod.color : INK, fontStyle: isAccent ? "italic" : "normal", marginRight: "0.18em", display: "inline-block" }}>{w}</span>
                    );
                  })}
                </motion.h1>

                {/* Objective */}
                <motion.p variants={child} style={{ fontSize: "clamp(14px,1.3vw,16px)", color: "#475569", lineHeight: 1.72, maxWidth: 460, marginBottom: 28, fontWeight: 400 }}>
                  <strong style={{ color: mod.color, fontWeight: 700 }}>Objective:</strong>{" "}{mod.obj}
                </motion.p>

                {/* Points / Parts */}
                <motion.div variants={child} style={{ marginBottom: 24, width: "100%" }}>
                  {mod.content.type === "points" ? (
                    mod.content.points.map((p, i) => (
                      <Point key={i} text={p} color={mod.color} lt={mod.colorLt} bd={mod.colorBd} />
                    ))
                  ) : (
                    mod.content.parts.map((pt, pi) => (
                      <div key={pi} style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: mod.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, marginTop: pi > 0 ? 10 : 0 }}>
                          {pt.label}
                        </div>
                        {pt.items.map((it, ii) => (
                          <Point key={ii} text={it} color={mod.color} lt={mod.colorLt} bd={mod.colorBd} />
                        ))}
                      </div>
                    ))
                  )}
                </motion.div>

                {/* Activity pill */}
                {mod.activity && (
                  <motion.div variants={child} style={{
                    display: "flex", alignItems: "center", gap: 9, padding: "10px 14px",
                    borderRadius: 10, background: mod.colorLt, border: `1px solid ${mod.colorBd}`, marginBottom: 22,
                  }}>
                    <Zap size={13} style={{ color: mod.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, color: mod.color, fontWeight: 700 }}>{mod.activity}</span>
                  </motion.div>
                )}

                {/* Outcomes */}
                <motion.div variants={child} style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 30 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94a3b8", marginBottom: 2 }}>Outcomes</span>
                  {mod.outcomes.map((o, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CheckCircle2 size={15} style={{ color: mod.color, flexShrink: 0 }} strokeWidth={2.2} />
                      <span style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>{o}</span>
                    </div>
                  ))}
                </motion.div>

                {/* CTAs */}
                <motion.div variants={child} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
                  <Link href="/services" className="pj-cta-p">
                    <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
                      Book Now — ₹4,999
                      <ArrowRight size={15} />
                    </span>
                  </Link>
                  <Link href="/contact" className="pj-cta-g">
                    Free discovery call
                    <ChevronRight size={14} />
                  </Link>
                </motion.div>

                {/* Stats row */}
                <motion.div variants={child} style={{ display: "flex", gap: 0, paddingTop: "1.2rem", borderTop: "1px solid rgba(15,23,42,0.08)" }}>
                  {[
                    { val: 5000, sfx: "+", dec: 0, label: "Students coached" },
                    { val: 94,   sfx: "%", dec: 0, label: "Success rate" },
                    { val: 4.9,  sfx: "★", dec: 1, label: "Avg rating" },
                  ].map((s, i) => (
                    <div key={i} className="pj-stat" style={{ paddingRight: "1.4rem" }}>
                      <p style={{ fontSize: "clamp(18px,2.2vw,27px)", fontWeight: 800, color: INK, letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                        <Counter to={s.val} suffix={s.sfx} decimals={s.dec} trigger={tick} />
                      </p>
                      <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginTop: 5 }}>{s.label}</p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* ─── RIGHT — card ─── */}
            <div
              className="pj-card-wrap"
              style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "flex-end", perspective: 1400 }}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mod.id + "-R"}
                  variants={cardV}
                  initial="enter" animate="center" exit="exit"
                  className="pj-card-inner"
                  style={{ width: "100%", maxWidth: "clamp(280px,36vw,420px)", position: "relative", transformStyle: "preserve-3d", rotateX: rotX, rotateY: rotY }}
                >
                  {/* Halo */}
                  <div className="pj-halo" style={{ inset: -40, background: `radial-gradient(circle,${mod.color}40,transparent 68%)` }} />

                  <motion.div className="pj-glass" style={{ borderRadius: 20, overflow: "hidden", x: tx, y: ty }}>
                    {/* Accent bar */}
                    <div style={{ height: 3, background: `linear-gradient(90deg,${mod.color},${mod.colorDk})` }} />

                    {/* Card header */}
                    <div style={{ padding: "22px 24px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 13, flexShrink: 0,
                          background: mod.colorLt, border: `1px solid ${mod.colorBd}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <mod.icon size={22} style={{ color: mod.color }} />
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <p style={{ fontSize: 15, fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}>Module {mod.step}</p>
                            <span className="pj-dot-live" style={{ width: 6, height: 6, borderRadius: "50%", background: mod.color, boxShadow: `0 0 0 3px ${mod.colorLt}` }} />
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                            <span style={{
                              fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                              color: mod.color, background: mod.colorLt, border: `1px solid ${mod.colorBd}`,
                              padding: "2px 8px", borderRadius: 99,
                            }}>{mod.tag}</span>
                            <span style={{ fontSize: 11, color: MUTED, display: "flex", alignItems: "center", gap: 3 }}>
                              <Clock size={10} />{mod.dur}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div style={{ marginBottom: 0 }}>
                        {(mod.content.type === "points" ? mod.content.points : mod.content.parts.flatMap(p => p.items)).slice(0, 4).map((text, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "9px 0", borderBottom: i < 3 ? "1px solid rgba(15,23,42,0.05)" : "none" }}>
                            <CheckCircle2 size={14} style={{ color: mod.color, flexShrink: 0, marginTop: 1 }} strokeWidth={2.2} />
                            <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 500, lineHeight: 1.5 }}>{text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card footer */}
                    <div style={{
                      marginTop: 16, padding: "13px 24px",
                      background: `${mod.colorLt}`,
                      borderTop: `1px solid ${mod.colorBd}`,
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <Sparkles size={12} style={{ color: mod.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: mod.colorDk }}>{mod.proof}</span>
                    </div>
                  </motion.div>

                  {/* Floater */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mod.id + "-flt"}
                      variants={floaterV}
                      initial="enter" animate="center" exit="exit"
                      className="pj-float pj-floater"
                      style={{
                        position: "absolute", bottom: -24, left: -24,
                        background: "#fff", borderRadius: 14,
                        padding: "10px 14px",
                        boxShadow: "0 16px 40px rgba(15,23,42,0.10), 0 2px 6px rgba(15,23,42,0.05)",
                        border: `1px solid ${mod.colorBd}`,
                        display: "flex", alignItems: "center", gap: 10, minWidth: 220, zIndex: 20,
                      }}
                    >
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                        background: mod.colorLt, border: `1px solid ${mod.colorBd}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, color: mod.color,
                      }}>
                        {mod.floater.initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: INK, lineHeight: 1.2 }}>{mod.floater.name}</p>
                        <p style={{ fontSize: 10.5, color: MUTED, fontWeight: 500, marginTop: 1 }}>{mod.floater.win}</p>
                      </div>
                      <span style={{ fontSize: 9.5, color: "#94a3b8", fontWeight: 600, flexShrink: 0 }}>{mod.floater.time}</span>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ══ TAB STRIP ══ */}
          <div style={{
            maxWidth: 1280, margin: "clamp(2.5rem,5vw,4rem) auto 0",
            borderTop: "1px solid rgba(15,23,42,0.08)",
            display: "flex", alignItems: "stretch",
            position: "relative", zIndex: 10,
          }}>
            {/* Play/Pause */}
            <div style={{ display: "flex", alignItems: "flex-start", paddingTop: 14, paddingRight: 10, flexShrink: 0 }}>
              <button
                onClick={() => setPaused(p => !p)}
                aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.8)", border: "1px solid rgba(15,23,42,0.12)",
                  cursor: "pointer", transition: "all .16s",
                }}
              >
                {paused ? <Play size={11} fill={MUTED} style={{ color: MUTED }} /> : <Pause size={11} style={{ color: MUTED }} />}
              </button>
            </div>

            {MODULES.map((m, i) => (
              <button
                key={m.id}
                className="pj-tab"
                onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); goTo(i); }}
                style={{
                  borderTopColor: i === active ? BRAND : "rgba(15,23,42,0.09)",
                  background: i === active ? "rgba(37,99,235,0.04)" : "transparent",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                  <span
                    className="pj-tab-chip"
                    style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      minWidth: 22, height: 18, padding: "0 6px", borderRadius: 5,
                      fontSize: 9.5, fontWeight: 700, letterSpacing: "0.04em",
                      background: i === active ? m.color : "rgba(15,23,42,0.06)",
                      color: i === active ? "#fff" : MUTED,
                      transition: "all .22s",
                    }}
                  >
                    {m.step}
                  </span>
                  <span
                    className="pj-tab-name"
                    style={{
                      fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
                      textTransform: "uppercase", color: i === active ? INK : "#94a3b8",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}
                  >
                    {m.name}
                  </span>
                </span>
                <span className="pj-tab-meta" style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 500 }}>{m.dur}</span>
              </button>
            ))}
          </div>
          <div style={{ height: "clamp(1.5rem,3vw,2.5rem)" }} />
        </section>

        {/* ══════════ DELIVERABLES ══════════ */}
        <section style={{ padding: "80px clamp(20px,5vw,60px)", maxWidth: 1100, margin: "0 auto" }}>
          {/* Section label */}
          <div
            ref={deliv.ref}
            className={`pj-reveal${deliv.vis ? " in" : ""}`}
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 10 }}>
              <div style={{ height: 1, width: 40, background: `linear-gradient(90deg,transparent,${BRAND}40)` }} />
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: BRAND }}>What you take home</span>
              <div style={{ height: 1, width: 40, background: `linear-gradient(90deg,${BRAND}40,transparent)` }} />
            </div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,4vw,40px)", fontWeight: 600, color: INK, letterSpacing: "-0.02em", marginBottom: 8 }}>
              Final deliverables
            </h2>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.6, maxWidth: 500, margin: "0 auto" }}>
              Every session ends with tangible outputs — real assets you walk away with.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
            {DELIVERABLES.map((d, i) => {
              const DIcon = d.icon;
              return (
                <div
                  key={i}
                  style={{
                    background: "#fff", borderRadius: 18, border: "1.5px solid rgba(15,23,42,0.07)",
                    padding: 22, display: "flex", alignItems: "flex-start", gap: 14,
                    boxShadow: "0 2px 16px rgba(15,23,42,0.04)",
                    transition: "transform .25s,box-shadow .25s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(15,23,42,0.08)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(15,23,42,0.04)"; }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: d.lt, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <DIcon size={18} style={{ color: d.color }} />
                  </div>
                  <span style={{ fontSize: 13.5, color: "#334155", fontWeight: 500, lineHeight: 1.55, marginTop: 2 }}>{d.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════ MENTORS ══════════ */}
        <section style={{ padding: "0 clamp(20px,5vw,60px) 80px", maxWidth: 1100, margin: "0 auto" }}>
          <div
            ref={mentors.ref}
            className={`pj-reveal${mentors.vis ? " in" : ""}`}
            style={{ textAlign: "center", marginBottom: 40 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 10 }}>
              <div style={{ height: 1, width: 40, background: `linear-gradient(90deg,transparent,${BRAND}40)` }} />
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: BRAND }}>Your Mentors</span>
              <div style={{ height: 1, width: 40, background: `linear-gradient(90deg,${BRAND}40,transparent)` }} />
            </div>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,4vw,40px)", fontWeight: 600, color: INK, letterSpacing: "-0.02em", marginBottom: 8 }}>
              Coached by people who know both sides.
            </h2>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
              Neel, Aashish & Seru have been on the interviewer&apos;s chair too — they know exactly what gets you the offer.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {MENTORS.map((m, i) => (
              <div
                key={i}
                style={{
                  background: "#fff", borderRadius: 22,
                  border: "1.5px solid rgba(15,23,42,0.07)",
                  padding: 28, textAlign: "center",
                  boxShadow: "0 2px 16px rgba(15,23,42,0.04)",
                  transition: "transform .3s,box-shadow .3s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 36px rgba(15,23,42,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(15,23,42,0.04)"; }}
              >
                <div style={{ width: 66, height: 66, borderRadius: "50%", background: m.grd, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22, fontWeight: 800, color: "#fff", boxShadow: `0 6px 22px ${m.color}35` }}>
                  {m.name[0]}
                </div>
                <div style={{ height: 3, width: 36, background: m.grd, borderRadius: 2, margin: "0 auto 14px" }} />
                <h4 style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 5 }}>{m.name}</h4>
                <p style={{ fontSize: 12.5, color: MUTED, fontWeight: 500, lineHeight: 1.55 }}>{m.role}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 3, marginTop: 14 }}>
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} size={12} style={{ color: m.color, fill: m.color }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════ FINAL CTA ══════════ */}
        <section style={{ padding: "0 clamp(20px,5vw,60px) 100px", maxWidth: 800, margin: "0 auto" }}>
          <div
            ref={cta.ref}
            className={`pj-reveal${cta.vis ? " in" : ""}`}
          >
            <div style={{
              borderRadius: 28, padding: "clamp(40px,6vw,60px) clamp(28px,5vw,52px)",
              background: `linear-gradient(135deg,${BRAND_D},${BRAND})`,
              textAlign: "center", position: "relative", overflow: "hidden",
              boxShadow: "0 24px 72px rgba(37,99,235,0.28)",
            }}>
              {/* Texture */}
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
              <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -30, left: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* badge */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 99, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", marginBottom: 20 }}>
                  <Target size={12} style={{ color: "#bfdbfe" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#bfdbfe", textTransform: "uppercase", letterSpacing: "0.12em" }}>Ready to get started?</span>
                </div>

                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px,5vw,48px)", fontWeight: 600, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 14 }}>
                  Your next offer<br />starts here.
                </h2>
                <p style={{ fontSize: 15, color: "rgba(191,219,254,0.85)", lineHeight: 1.7, maxWidth: 420, margin: "0 auto 12px" }}>
                  Book the full 4-module Placement Accelerator and walk into every interview with clarity, confidence, and a game plan.
                </p>
                <p style={{ fontSize: 13, color: "rgba(191,219,254,0.65)", marginBottom: 30 }}>
                  ₹<s style={{ opacity: 0.6 }}>6,999</s>&nbsp;&nbsp;<strong style={{ color: "#fff", fontSize: 18 }}>₹4,999</strong>&nbsp; incl. GST · 100% satisfaction guarantee
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                  <Link href="/services" className="pj-cta-p" style={{ background: "#fff", color: BRAND_D, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
                    <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
                      Book for ₹4,999 <ArrowRight size={15} />
                    </span>
                  </Link>
                  <Link href="/contact" style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "14px 24px", borderRadius: 12,
                    background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)",
                    color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none",
                    transition: "background .2s",
                  }}>
                    Free discovery call
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}