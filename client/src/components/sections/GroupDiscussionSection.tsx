"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Sparkles, CheckCircle2, ArrowRight, Mic, Clock,
  MessageSquare, ShieldCheck, Play, Calendar, CreditCard, Video, UserPlus,
} from "lucide-react";
import Link from "next/link";

/* ── Tokens — unified blue + white theme across the homepage ── */
const GD_ACCENT = "#2563eb";
const GD_DEEP = "#1d4ed8";
const PAPER = "#ffffff";
const INK = "#0f172a";
const MUTED = "#64748b";

/* ── Rotating content pulled from real GD topics users might face ── */
const TOPIC_ROTATION = [
  { label: "Abstract",        topic: "Is perfection the enemy of progress?" },
  { label: "Case-based",      topic: "Should your startup pivot or persevere after 18 months?" },
  { label: "Current affairs", topic: "AI in Indian classrooms — boon or distraction?" },
  { label: "Abstract",        topic: "Does convenience make us less curious?" },
];

/* ── 8 participants around the virtual GD room ── */
const PARTICIPANTS = [
  { initials: "MK", name: "Meera",  line: "I'd open with the economic angle…" },
  { initials: "RS", name: "Rahul",  line: "Counter-point — tech always disrupts first." },
  { initials: "AP", name: "Ananya", line: "Let's frame this as short-term vs long-term." },
  { initials: "VT", name: "Vikram", line: "The data from NASSCOM suggests otherwise." },
  { initials: "NS", name: "Neha",   line: "Before we conclude, can we agree on scope?" },
  { initials: "DK", name: "Dhruv",  line: "I want to bring in a stakeholder lens." },
  { initials: "SP", name: "Sneha",  line: "Summarising — three key points emerged." },
  { initials: "AG", name: "Aarav",  line: "The ethical angle hasn't been explored yet." },
];

const FEATURES = [
  "Types of GDs — abstract, case-based, current affairs",
  "How to start, enter, and conclude effectively",
  "Structuring thoughts quickly under pressure",
  "Common mistakes that eliminate candidates",
];

const STEPS = [
  { Icon: UserPlus,   label: "Choose plan",   sub: "3–6 members" },
  { Icon: Users,      label: "Add teammates", sub: "Name + WhatsApp" },
  { Icon: Calendar,   label: "Pick slot",     sub: "60 min window" },
  { Icon: CreditCard, label: "Pay & confirm", sub: "Zoom unlocks" },
  { Icon: Video,      label: "Join session",  sub: "Live + feedback" },
];

export default function GroupDiscussionSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [topicIdx, setTopicIdx] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const speakerTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const topicTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const clockTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Rotate active speaker
  useEffect(() => {
    if (paused) return;
    speakerTimer.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % PARTICIPANTS.length);
    }, 2600);
    return () => { if (speakerTimer.current) clearInterval(speakerTimer.current); };
  }, [paused]);

  // Rotate topic every ~10s
  useEffect(() => {
    if (paused) return;
    topicTimer.current = setInterval(() => {
      setTopicIdx((i) => (i + 1) % TOPIC_ROTATION.length);
    }, 10500);
    return () => { if (topicTimer.current) clearInterval(topicTimer.current); };
  }, [paused]);

  // Live clock
  useEffect(() => {
    if (paused) return;
    clockTimer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => { if (clockTimer.current) clearInterval(clockTimer.current); };
  }, [paused]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const current = PARTICIPANTS[activeIdx];
  const topic = TOPIC_ROTATION[topicIdx];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');

        .gd-section { font-family: 'DM Sans', system-ui, -apple-system, sans-serif; }

        @keyframes gdPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.45); }
          50%      { box-shadow: 0 0 0 14px rgba(37,99,235,0); }
        }
        .gd-pulse { animation: gdPulse 1.8s ease-out infinite; }

        @keyframes gdBarWave {
          0%, 100% { transform: scaleY(0.35); }
          50%      { transform: scaleY(1); }
        }
        .gd-wave-bar { transform-origin: bottom; animation: gdBarWave 0.9s ease-in-out infinite; }

        @keyframes gdLiveDot {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
        .gd-live { animation: gdLiveDot 1.4s ease-in-out infinite; }

        @keyframes gdShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .gd-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 24px; border-radius: 10px;
          font-family: inherit; font-size: 14px; font-weight: 600; color: #fff;
          background: linear-gradient(135deg, ${GD_ACCENT} 0%, ${GD_DEEP} 100%);
          text-decoration: none;
          box-shadow: 0 10px 24px rgba(37,99,235,0.28), 0 2px 6px rgba(29,78,216,0.18);
          transition: transform 0.18s, box-shadow 0.22s;
          position: relative; overflow: hidden;
        }
        .gd-cta::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%);
          background-size: 200% 100%;
          animation: gdShimmer 3.4s ease-in-out infinite;
          pointer-events: none;
        }
        .gd-cta:hover { transform: translateY(-2px); box-shadow: 0 16px 36px rgba(37,99,235,0.36); }

        .gd-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: inherit; font-size: 13px; font-weight: 500; color: ${MUTED};
          background: none; border: none; cursor: pointer; text-decoration: none;
          transition: color 0.18s;
        }
        .gd-ghost:hover { color: ${INK}; }
        .gd-ghost:hover .ga { transform: translateX(3px); }
        .ga { transition: transform 0.18s; display: inline-flex; }

        .gd-participant {
          cursor: pointer;
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s;
        }
        .gd-participant:hover { transform: scale(1.08); }

        .gd-step {
          display: flex; flex-direction: column; align-items: center;
          gap: 8px; flex: 1; min-width: 0;
          padding: 14px 10px;
          border-radius: 12px;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(37,99,235,0.16);
          transition: transform 0.22s, box-shadow 0.22s, background 0.22s;
          text-align: center;
        }
        .gd-step:hover {
          transform: translateY(-3px);
          background: #fff;
          box-shadow: 0 10px 24px rgba(37,99,235,0.12);
        }
        .gd-step-num {
          position: absolute; top: 8px; right: 10px;
          font-size: 10px; font-weight: 700; color: ${GD_ACCENT}AA;
          letter-spacing: 0.05em;
        }

        .gd-room {
          position: relative;
          aspect-ratio: 1;
          max-width: 420px;
          margin: 0 auto;
          border-radius: 50%;
          background:
            radial-gradient(circle at 50% 50%, rgba(37,99,235,0.08) 0%, transparent 65%),
            conic-gradient(from 0deg, rgba(37,99,235,0.04), rgba(37,99,235,0.12), rgba(37,99,235,0.04));
          border: 1.5px dashed rgba(37,99,235,0.22);
        }

        .gd-room::before {
          content: '';
          position: absolute; inset: 18%;
          border-radius: 50%;
          border: 1px dashed rgba(37,99,235,0.18);
        }

        .gd-glass {
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(37,99,235,0.18);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.85) inset,
            0 24px 60px -18px rgba(29,78,216,0.2),
            0 6px 20px rgba(37,99,235,0.08);
        }

        /* ── Tablet: stack columns ── */
        @media (max-width: 960px) {
          .gd-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .gd-steps { flex-wrap: wrap !important; }
          .gd-step { flex: 1 1 150px !important; }
          .gd-hero-stats { gap: 18px !important; padding: 12px 18px !important; }
        }

        /* ── Mobile: compress headings + stats ── */
        @media (max-width: 640px) {
          .gd-room { max-width: 340px !important; }
          .gd-topic-pill { font-size: 10px !important; }
          .gd-bubble { font-size: 12px !important; }
          .gd-step { flex: 1 1 calc(50% - 6px) !important; padding: 12px 8px !important; }
          .gd-step-label { font-size: 12px !important; }
          .gd-step-sub { font-size: 10.5px !important; }

          .gd-hero-stats {
            border-radius: 20px !important;
            padding: 14px 16px !important;
            gap: 14px 22px !important;
          }

          .gd-cta { padding: 12px 20px !important; font-size: 13.5px !important; }
        }

        /* ── Small mobile ── */
        @media (max-width: 440px) {
          .gd-room { max-width: 280px !important; }
          .gd-step { flex: 1 1 calc(50% - 6px) !important; padding: 10px 6px !important; }
          .gd-step-sub { display: none !important; }
          .gd-hero-stats { padding: 12px 14px !important; gap: 10px 18px !important; }
          .gd-hero-stats > div { gap: 5px !important; }
        }
      `}</style>

      <section
        className="gd-section"
        style={{
          position: "relative",
          background: PAPER,
          color: INK,
          overflow: "hidden",
          padding: "clamp(70px, 9vw, 120px) clamp(20px, 4vw, 56px)",
        }}
      >
        {/* Ambient blobs */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{
            position: "absolute", top: -160, right: -120, width: 520, height: 520, borderRadius: "50%",
            filter: "blur(110px)",
            background: `radial-gradient(circle, ${GD_ACCENT}1e 0%, transparent 65%)`,
          }} />
          <div style={{
            position: "absolute", bottom: -100, left: -80, width: 380, height: 380, borderRadius: "50%",
            filter: "blur(90px)",
            background: `radial-gradient(circle, ${GD_ACCENT}10 0%, transparent 70%)`,
          }} />
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage:
              "linear-gradient(rgba(37,99,235,0.045) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(37,99,235,0.045) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto" }}>
          {/* ── SECTION HEADER (centered) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="gd-header"
            style={{
              textAlign: "center",
              maxWidth: 760,
              margin: "0 auto clamp(2.5rem, 5vw, 4.5rem)",
              position: "relative",
            }}
          >
            {/* Decorative top rule + badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              marginBottom: 18,
            }}>
              <span style={{
                width: "clamp(24px, 5vw, 40px)", height: 1,
                background: `linear-gradient(90deg, transparent, ${GD_ACCENT})`,
              }} />
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "6px 14px",
                borderRadius: 99,
                background: `${GD_ACCENT}14`,
                border: `1px solid ${GD_ACCENT}33`,
              }}>
                <Sparkles size={11} style={{ color: GD_ACCENT }} />
                <span style={{
                  fontSize: 11, fontWeight: 700, color: GD_ACCENT,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                }}>
                  02 · Group Discussion
                </span>
              </div>
              <span style={{
                width: "clamp(24px, 5vw, 40px)", height: 1,
                background: `linear-gradient(90deg, ${GD_ACCENT}, transparent)`,
              }} />
            </div>

            {/* Big section headline */}
            <h2 className="gd-h2" style={{
              margin: "0 0 14px",
              fontSize: "clamp(34px, 5.4vw, 68px)",
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
              fontWeight: 700,
              color: INK,
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>
              Own every room{" "}
              <span style={{
                position: "relative",
                display: "inline-block",
                color: GD_ACCENT,
              }}>
                you enter.
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute",
                    left: 0, right: 0, bottom: "-3px",
                    height: 3,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${GD_ACCENT}, ${GD_DEEP})`,
                    transformOrigin: "left",
                    display: "block",
                  }}
                />
              </span>
            </h2>

            <p className="gd-sub" style={{
              fontSize: "clamp(14px, 1.4vw, 17px)",
              color: MUTED, lineHeight: 1.65,
              maxWidth: 600, margin: "0 auto",
              fontWeight: 400,
            }}>
              Where most candidates freeze, you&apos;ll lead. Practice live, get
              feedback instantly, walk into placement rounds with a plan that works.
            </p>

            {/* Mini stats row */}
            <div className="gd-hero-stats" style={{
              display: "inline-flex", alignItems: "center",
              gap: "clamp(20px, 3vw, 44px)", flexWrap: "wrap", justifyContent: "center",
              marginTop: 22,
              padding: "14px 22px",
              borderRadius: 99,
              background: "#fff",
              border: `1px solid ${GD_ACCENT}22`,
              boxShadow: `0 8px 30px ${GD_ACCENT}14`,
            }}>
              {[
                { val: "8", label: "Max per batch" },
                { val: "60 min", label: "Live session" },
                { val: "1-on-1", label: "Feedback" },
                { val: "3", label: "GD formats" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
                  <span style={{
                    fontSize: "clamp(15px, 1.6vw, 20px)", fontWeight: 800, color: GD_ACCENT,
                    letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums",
                  }}>
                    {s.val}
                  </span>
                  <span style={{
                    fontSize: 10.5, fontWeight: 600, color: MUTED,
                    textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Two-column grid ── */}
          <div
            className="gd-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "50% 50%",
              gap: "clamp(2rem, 4vw, 5rem)",
              alignItems: "center",
            }}
          >
            {/* LEFT — copy + CTAs */}
            <div>
              {/* Side eyebrow */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                marginBottom: 14,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%", background: GD_ACCENT,
                }} />
                <span style={{
                  fontSize: 11, fontWeight: 700, color: GD_ACCENT,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                }}>
                  What you&apos;ll master
                </span>
              </div>

              <h3 className="gd-h3" style={{
                margin: "0 0 16px",
                fontSize: "clamp(24px, 2.8vw, 34px)",
                lineHeight: 1.2,
                letterSpacing: "-0.025em",
                fontWeight: 700,
                color: INK,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}>
                Speak first.{" "}
                <span style={{ color: GD_ACCENT }}>Be heard.</span>{" "}
                <span style={{ fontWeight: 300, color: MUTED }}>Own the group.</span>
              </h3>

              <p style={{
                fontSize: "clamp(14px, 1.15vw, 15.5px)",
                color: "#475569",
                lineHeight: 1.7,
                maxWidth: 480,
                marginBottom: 24,
                fontWeight: 400,
              }}>
                GDs aren&apos;t about the loudest voice — they&apos;re about the clearest one.
                Learn to enter in the first 30 seconds, steer the conversation, and leave the panel remembering your name.
              </p>

              {/* Feature bullets */}
              <div style={{ marginBottom: 28 }}>
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "9px 0",
                      borderBottom: i < FEATURES.length - 1 ? "1px solid rgba(15,23,42,0.05)" : "none",
                    }}
                  >
                    <CheckCircle2 size={16} style={{ color: GD_ACCENT, flexShrink: 0, marginTop: 1 }} strokeWidth={2.2} />
                    <span style={{ fontSize: 13.5, color: "#334155", fontWeight: 500, lineHeight: 1.5 }}>
                      {f}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginBottom: 28 }}>
                <Link href="/group-discussion" className="gd-cta">
                  <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
                    Book a GD batch
                    <ArrowRight size={14} />
                  </span>
                </Link>
                <Link href="/services" className="gd-ghost">
                  <Play size={10} fill="currentColor" className="ga" />
                  See pricing plans
                  <ArrowRight size={12} className="ga" />
                </Link>
              </div>

              {/* Proof strip */}
              <div style={{
                display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap",
                padding: "14px 16px",
                borderRadius: 12,
                background: `${GD_ACCENT}0d`,
                border: `1px solid ${GD_ACCENT}22`,
              }}>
                <ShieldCheck size={16} style={{ color: GD_ACCENT, flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: GD_DEEP, fontWeight: 600, lineHeight: 1.4 }}>
                  Batches capped at 8 — every participant gets personal feedback.
                </span>
              </div>
            </div>

            {/* RIGHT — Interactive GD room */}
            <div style={{ position: "relative" }}>
              {/* Header controls above the room */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 18, gap: 12, flexWrap: "wrap",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "6px 12px", borderRadius: 99,
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.22)",
                }}>
                  <span className="gd-live" style={{
                    width: 7, height: 7, borderRadius: "50%", background: "#ef4444",
                  }} />
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "#dc2626", letterSpacing: "0.08em" }}>
                    LIVE PRACTICE
                  </span>
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 99,
                  background: "#fff",
                  border: "1px solid rgba(15,23,42,0.08)",
                }}>
                  <Clock size={11} style={{ color: MUTED }} />
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: INK,
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {mm}:{ss}
                  </span>
                </div>
              </div>

              {/* Topic card */}
              <div className="gd-glass" style={{
                padding: "14px 18px", borderRadius: 14, marginBottom: 18,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <MessageSquare size={12} style={{ color: GD_ACCENT }} />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={topic.label}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.3 }}
                      className="gd-topic-pill"
                      style={{
                        fontSize: 10.5, fontWeight: 700, color: GD_ACCENT,
                        letterSpacing: "0.08em", textTransform: "uppercase",
                      }}
                    >
                      Topic · {topic.label}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={topic.topic}
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.4 }}
                    style={{
                      fontSize: "clamp(14px, 1.4vw, 17px)", fontWeight: 600,
                      color: INK, lineHeight: 1.35, letterSpacing: "-0.01em",
                    }}
                  >
                    &ldquo;{topic.topic}&rdquo;
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Circular GD room with participants */}
              <div className="gd-room">
                {/* Center panel — active speaker */}
                <div style={{
                  position: "absolute", inset: "28%",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  textAlign: "center", padding: 12,
                }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.initials}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center", gap: 8,
                      }}
                    >
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "3px 9px", borderRadius: 99,
                        background: "#fff", border: `1px solid ${GD_ACCENT}33`,
                      }}>
                        <Mic size={9} style={{ color: GD_ACCENT }} />
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: GD_ACCENT, letterSpacing: "0.06em" }}>
                          SPEAKING
                        </span>
                      </div>
                      <p style={{
                        fontSize: "clamp(13px, 1.3vw, 16px)", fontWeight: 700,
                        color: INK, letterSpacing: "-0.015em",
                      }}>
                        {current.name}
                      </p>
                      {/* Mini waveform */}
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 18 }}>
                        {[0.2, 0.4, 0.25, 0.35].map((delay, i) => (
                          <span
                            key={i}
                            className="gd-wave-bar"
                            style={{
                              width: 3, height: "100%",
                              borderRadius: 2, background: GD_ACCENT,
                              animationDelay: `${delay}s`,
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Participant dots — 8 around the circle */}
                {PARTICIPANTS.map((p, i) => {
                  const angle = (i / PARTICIPANTS.length) * Math.PI * 2 - Math.PI / 2;
                  const radius = 44; // percent of container
                  const x = 50 + Math.cos(angle) * radius;
                  const y = 50 + Math.sin(angle) * radius;
                  const isActive = i === activeIdx;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      aria-label={`Make ${p.name} the speaker`}
                      className={`gd-participant ${isActive ? "gd-pulse" : ""}`}
                      style={{
                        position: "absolute",
                        top: `${y}%`, left: `${x}%`,
                        transform: "translate(-50%, -50%)",
                        width: isActive ? 52 : 42, height: isActive ? 52 : 42,
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: isActive ? `2px solid ${GD_ACCENT}` : "1.5px solid rgba(37,99,235,0.3)",
                        background: isActive
                          ? `linear-gradient(135deg, ${GD_ACCENT} 0%, ${GD_DEEP} 100%)`
                          : "#fff",
                        color: isActive ? "#fff" : GD_ACCENT,
                        fontSize: isActive ? 13 : 11,
                        fontWeight: 700,
                        fontFamily: "inherit",
                        boxShadow: isActive
                          ? `0 8px 20px ${GD_ACCENT}66`
                          : "0 4px 12px rgba(15,23,42,0.08)",
                        padding: 0, cursor: "pointer",
                        zIndex: isActive ? 3 : 2,
                      }}
                    >
                      {p.initials}
                    </button>
                  );
                })}
              </div>

              {/* Speech bubble below the room */}
              <div style={{ marginTop: 18, position: "relative" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.initials + "-bubble"}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="gd-glass gd-bubble"
                    style={{
                      padding: "12px 16px", borderRadius: 14,
                      display: "flex", alignItems: "flex-start", gap: 10,
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${GD_ACCENT}22, ${GD_ACCENT}44)`,
                      border: `1px solid ${GD_ACCENT}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700, color: GD_ACCENT,
                      flexShrink: 0,
                    }}>
                      {current.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 10.5, color: MUTED, fontWeight: 500, marginBottom: 2 }}>
                        {current.name} says
                      </p>
                      <p style={{ fontSize: 13, color: INK, fontWeight: 500, lineHeight: 1.45 }}>
                        {current.line}
                      </p>
                    </div>
                    <button
                      onClick={() => setPaused((p) => !p)}
                      aria-label={paused ? "Resume live demo" : "Pause live demo"}
                      style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: "#fff", border: "1px solid rgba(15,23,42,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", flexShrink: 0, color: MUTED,
                        fontFamily: "inherit", fontSize: 10, fontWeight: 700,
                      }}
                    >
                      {paused ? "▶" : "❚❚"}
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── 5-step booking flow ── */}
          <div style={{ marginTop: "clamp(3rem, 6vw, 5rem)" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 18,
            }}>
              <span style={{
                fontSize: 10.5, fontWeight: 700, color: GD_ACCENT,
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                How your batch comes together
              </span>
              <span style={{
                flex: 1, height: 1,
                background: `linear-gradient(90deg, ${GD_ACCENT}33, transparent)`,
              }} />
            </div>

            <div className="gd-steps" style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
              {STEPS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="gd-step"
                  style={{ position: "relative" }}
                >
                  <span className="gd-step-num">0{i + 1}</span>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `linear-gradient(135deg, ${GD_ACCENT}14, ${GD_ACCENT}28)`,
                    border: `1px solid ${GD_ACCENT}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <s.Icon size={16} style={{ color: GD_ACCENT }} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="gd-step-label" style={{
                      fontSize: 12.5, fontWeight: 700, color: INK,
                      letterSpacing: "-0.01em",
                    }}>
                      {s.label}
                    </p>
                    <p className="gd-step-sub" style={{
                      fontSize: 11, color: MUTED, fontWeight: 500, marginTop: 2,
                    }}>
                      {s.sub}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
