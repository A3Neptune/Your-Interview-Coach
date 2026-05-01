"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

const DM = "'DM Sans', system-ui, sans-serif";

const FADE_UP = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.23, 1, 0.32, 1] as const },
});

export default function HeroSection() {
  return (
    <>
      <style>{`
        .hs {
          --blue: #1a3bcc;
          --blue-bg: #eef1fc;
          --ink: #0d1117;
          --rule: rgba(13,17,23,0.09);
          font-family: ${DM};
          background: #f7f4ef;
          position: relative;
          min-height: 100svh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .hs::after {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.028;
        }

        /* Photo decorative borders — hidden on narrow screens */
        .hs-photo-wrap { position: relative; width: 100%; }

        @media (min-width: 640px) {
          .hs-photo-wrap::before {
            content: '';
            position: absolute;
            inset: -12px -8px -8px -12px;
            border: 1px solid rgba(26,59,204,0.15);
            border-radius: 20px;
            z-index: 0;
            pointer-events: none;
          }
          .hs-photo-wrap::after {
            content: '';
            position: absolute;
            inset: -24px -18px -18px -24px;
            border: 1px dashed rgba(201,168,76,0.18);
            border-radius: 26px;
            z-index: 0;
            pointer-events: none;
          }
        }

        .hs-btn {
          background: var(--blue);
          color: #fff;
          border: 1.5px solid var(--blue);
          border-radius: 8px;
          font-family: ${DM};
          font-size: 14px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 26px;
          text-decoration: none;
          transition: background 0.18s, box-shadow 0.18s, transform 0.15s;
          cursor: pointer;
          white-space: nowrap;
          line-height: 1;
        }
        .hs-btn:hover {
          background: #0f2799;
          box-shadow: 0 6px 24px rgba(26,59,204,0.28);
          transform: translateY(-1px);
          color: #fff;
        }

        .hs-ghost {
          background: transparent;
          color: #374151;
          font-family: ${DM};
          font-size: 15px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          text-decoration: none;
          transition: color 0.18s;
          cursor: pointer;
          white-space: nowrap;
          line-height: 1;
        }
        .hs-ghost:hover { color: var(--blue); }
        .hs-ghost:hover .hs-arrow { transform: translateX(4px); }
        .hs-arrow { transition: transform 0.18s; }

        /* Stepper */
        .hs-stepper { display: grid; grid-template-columns: 1fr 1fr 1fr; width: 100%; }
        .hs-step-top { display: flex; align-items: center; margin-bottom: 10px; }
        .hs-step-circle {
          width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10.5px; font-weight: 700; flex-shrink: 0;
          background: var(--blue); border: 1.5px solid var(--blue); color: #fff;
          font-family: ${DM};
          font-variant-numeric: tabular-nums;
        }
        .hs-step-line {
          flex: 1; height: 1px; margin-left: 7px;
          background: linear-gradient(to right, rgba(26,59,204,0.25), rgba(26,59,204,0.08));
        }
        .hs-step:last-child .hs-step-line { display: none; }
        .hs-step-label {
          display: block; font-size: clamp(11px, 1vw, 13px); font-weight: 700;
          color: var(--blue); margin-bottom: 2px; font-family: ${DM};
        }
        .hs-step-sub {
          display: block; font-size: clamp(10px, 0.8vw, 11px);
          color: #9ca3af; line-height: 1.4; font-family: ${DM};
        }

        /* Stats cards */
        .hs-stats-row { display: flex; gap: 8px; flex-wrap: nowrap; }
        .hs-stat-card {
          flex: 1; min-width: 0;
          background: rgba(255,255,255,0.65);
          border: 1px solid rgba(13,17,23,0.07);
          border-radius: 11px;
          padding: 12px 14px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .hs-stat-num {
          font-size: clamp(19px, 2vw, 26px); font-weight: 800;
          color: #0d1117; letter-spacing: -0.03em; line-height: 1;
          font-variant-numeric: tabular-nums; font-family: ${DM};
          display: flex; align-items: baseline; gap: 4px;
        }
        .hs-stat-lbl {
          font-size: 9.5px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: #9ca3af; font-family: ${DM};
        }
        @media (max-width: 400px) {
          .hs-stat-card { padding: 10px 8px; gap: 3px; }
          .hs-stats-row { gap: 5px; }
          .hs-step-circle { width: 26px; height: 26px; font-size: 9.5px; }
        }

        .hs-blob {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none; z-index: 0;
        }

        @keyframes hsScroll {
          0%, 100% { transform: scaleY(0); transform-origin: top; opacity: 0.5; }
          50%       { transform: scaleY(1); transform-origin: top; opacity: 1; }
        }
        .hs-scroll-line { animation: hsScroll 2.6s ease-in-out infinite; }
      `}</style>

      <section className="hs">
        {/* Blobs */}
        <div className="hs-blob" style={{ width: 560, height: 560, background: "radial-gradient(circle, rgba(26,59,204,0.055) 0%, transparent 70%)", top: "-100px", right: "-60px" }} />
        <div className="hs-blob" style={{ width: 380, height: 380, background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)", bottom: "40px", left: "-50px" }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(rgba(13,17,23,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(13,17,23,0.025) 1px,transparent 1px)", backgroundSize: "72px 72px" }} />

        {/* Main content */}
        <div className="relative z-10 flex-1 w-full max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 pt-24 pb-20 lg:pt-[120px] lg:pb-0 flex flex-col lg:grid lg:grid-cols-[55%_45%] lg:items-center gap-10 lg:gap-0">

          {/* ── LEFT ── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:pr-16">

            {/* Headline */}
            <motion.h1
              {...FADE_UP(0.12)}
              className="mb-6"
              style={{ fontFamily: DM, letterSpacing: "-0.02em", lineHeight: 1 }}
            >
              <span style={{ display: "block", fontSize: "clamp(24px, 3vw, 44px)", fontWeight: 400, color: "#94a3b8", letterSpacing: "-0.01em", paddingBottom: "6px" }}>
                Crack your
              </span>
              <span style={{ display: "inline-block", position: "relative", fontSize: "clamp(50px, 6.6vw, 86px)", fontWeight: 800, color: "#1a3bcc", letterSpacing: "-0.04em", lineHeight: 0.92, paddingBottom: "14px" }}>
                next job
                <svg viewBox="0 0 260 10" fill="none" preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", bottom: 2, left: 0, width: "100%", height: 10, pointerEvents: "none" }}>
                  <path d="M4,6 Q33,1 65,6 Q97,11 130,6 Q163,1 195,6 Q220,10 256,5" stroke="#1a3bcc" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.3" />
                </svg>
              </span>
              <span style={{ display: "block", fontSize: "clamp(30px, 3.8vw, 54px)", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.03em", paddingTop: "8px" }}>
                interview.
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              {...FADE_UP(0.22)}
              className="mb-8"
              style={{ fontSize: "clamp(14px, 1.2vw, 15.5px)", color: "#6b7280", lineHeight: 1.75, maxWidth: 360, fontFamily: DM }}
            >
              Real sessions. Expert feedback. A proven path from prep to placement — built around your goals.
            </motion.p>

            {/* Process stepper */}
            <motion.div {...FADE_UP(0.30)} className="hs-stepper mb-8 w-full" style={{ maxWidth: 400 }}>
              {[
                { n: "01", label: "Prepare",    sub: "Resume & strategy" },
                { n: "02", label: "Practice",   sub: "Mock interviews"   },
                { n: "03", label: "Get Placed", sub: "Dream company"     },
              ].map(({ n, label, sub }) => (
                <div key={n} className="hs-step">
                  <div className="hs-step-top">
                    <div className="hs-step-circle">{n}</div>
                    <div className="hs-step-line" />
                  </div>
                  <span className="hs-step-label">{label}</span>
                  <span className="hs-step-sub">{sub}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div {...FADE_UP(0.38)} className="flex flex-wrap gap-4 items-center justify-center lg:justify-start mb-7">
              <Link href="/signup" className="hs-btn">
                Start your journey
                <ArrowRight size={14} />
              </Link>
              <Link href="/services" className="hs-ghost">
                Explore services
                <ArrowRight size={16} className="hs-arrow" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div {...FADE_UP(0.50)} className="hs-stats-row w-full" style={{ maxWidth: 400 }}>
              <div className="hs-stat-card">
                <span className="hs-stat-num">5,000+</span>
                <span className="hs-stat-lbl">Students Coached</span>
              </div>
              <div className="hs-stat-card">
                <span className="hs-stat-num">94%</span>
                <span className="hs-stat-lbl">Success Rate</span>
              </div>
              <div className="hs-stat-card">
                <span className="hs-stat-num">
                  4.9
                  <Star size={11} style={{ color: "#ca8a04", fill: "#ca8a04", flexShrink: 0 }} />
                </span>
                <span className="hs-stat-lbl">Avg. Rating</span>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT — Photo ── */}
          <div className="flex items-center justify-center lg:justify-end pt-2 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
              className="hs-photo-wrap"
              style={{ maxWidth: "clamp(260px, 38vw, 460px)" }}
            >
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ boxShadow: "0 28px 60px -10px rgba(13,17,23,0.16), 0 4px 14px rgba(13,17,23,0.07)", border: "1px solid rgba(13,17,23,0.06)" }}
              >
                <div className="relative" style={{ aspectRatio: "4/5" }}>
                  <img
                    src="/neel-aashish-seru.jpeg"
                    alt="Neel Aashish Seru — Interview & Career Mentor"
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,14,26,0.70) 0%, rgba(10,14,26,0.12) 42%, transparent 66%)" }} />
                  <div style={{
                    position: "absolute", bottom: 18, left: 18, right: 18,
                    background: "rgba(255,255,255,0.09)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 12,
                    padding: "14px 16px",
                  }}>
                    <p style={{ color: "#fff", fontWeight: 600, fontSize: 18, letterSpacing: "-0.01em", lineHeight: 1.2, fontFamily: DM }}>
                      Neel Aashish Seru
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 10.5, fontWeight: 500, marginTop: 4, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: DM }}>
                      Interview Coach · Ex-IndiaMART & Tech Mahindra · 12+ Yrs
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        >
          <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color: "#c4bfb5", fontFamily: DM }}>
            Scroll
          </span>
          <div className="hs-scroll-line" style={{ width: 1, height: 36, background: "linear-gradient(to bottom, #1a3bcc, transparent)" }} />
        </motion.div>
      </section>
    </>
  );
}
