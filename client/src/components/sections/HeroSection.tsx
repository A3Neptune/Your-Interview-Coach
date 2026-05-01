"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

const FADE_UP = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.23, 1, 0.32, 1] as const },
});

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');

        :root {
          --cream: #f7f4ef;
          --ink: #0d1117;
          --ink-soft: #374151;
          --blue: #1a3bcc;
          --gold: #c9a84c;
          --rule: rgba(13,17,23,0.09);
        }

        .h-noise::after {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.028;
        }

        .photo-wrap::before {
          content: '';
          position: absolute;
          inset: -12px -8px -8px -12px;
          border: 1px solid rgba(26,59,204,0.15);
          border-radius: 20px;
          z-index: 0;
          pointer-events: none;
        }
        .photo-wrap::after {
          content: '';
          position: absolute;
          inset: -24px -18px -18px -24px;
          border: 1px dashed rgba(201,168,76,0.18);
          border-radius: 26px;
          z-index: 0;
          pointer-events: none;
        }

        .btn-primary {
          background: var(--blue);
          color: #fff;
          border: 1.5px solid var(--blue);
          border-radius: 6px;
          transition: background 0.18s, box-shadow 0.18s;
        }
        .btn-primary:hover {
          background: #0f2799;
          box-shadow: 0 6px 20px rgba(26,59,204,0.28);
        }
        .btn-ghost {
          background: transparent;
          color: var(--ink-soft);
          border: none;
          transition: color 0.18s;
          padding: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn-ghost:hover { color: var(--blue); }
        .btn-ghost:hover .ghost-arrow { transform: translateX(3px); }
        .ghost-arrow { transition: transform 0.18s; }

        @keyframes scrollPulse {
          0%, 100% { transform: scaleY(0); transform-origin: top; opacity: 0.5; }
          50%       { transform: scaleY(1); transform-origin: top; opacity: 1; }
        }
        .scroll-line { animation: scrollPulse 2.6s ease-in-out infinite; }

        /* process grid */
        .process-strip { display: flex; width: 100%; }
        .process-col {
          flex: 1;
          padding-top: 14px;
          border-top: 2px solid;
        }
        .process-col + .process-col { padding-left: 20px; }
        .process-col:not(:last-child) { padding-right: 20px; }

        /* stat row */
        .stat-divider + .stat-divider {
          padding-left: 2rem;
          border-left: 1px solid var(--rule);
        }

        .blob {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none; z-index: 0;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="h-noise relative min-h-svh overflow-hidden flex flex-col"
        style={{ background: "var(--cream)", fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        {/* Background blobs */}
        <div className="blob" style={{ width: 560, height: 560, background: "radial-gradient(circle, rgba(26,59,204,0.055) 0%, transparent 70%)", top: "-100px", right: "-60px" }} />
        <div className="blob" style={{ width: 380, height: 380, background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)", bottom: "40px", left: "-50px" }} />

        {/* Fine grid */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(rgba(13,17,23,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(13,17,23,0.025) 1px,transparent 1px)", backgroundSize: "72px 72px" }} />

        {/* Content */}
        <div className="relative z-10 flex-1 w-full max-w-[1280px] mx-auto px-6 lg:px-12 pt-[100px] pb-20 lg:pt-[118px] lg:pb-0 grid grid-cols-1 lg:grid-cols-[55%_45%] items-center gap-16 lg:gap-0">

          {/* ── LEFT ── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:pr-16">

            {/* Headline — 3-line typographic contrast */}
            <motion.h1
              {...FADE_UP(0.15)}
              className="mb-5"
              style={{ lineHeight: 1.04, letterSpacing: "-0.03em", color: "#0f172a" }}
            >
              <span style={{ display: "block", fontSize: "clamp(36px, 4.8vw, 62px)", fontWeight: 300, paddingBottom: "10px" }}>
                Crack your
              </span>
              <span style={{ display: "block", fontSize: "clamp(44px, 6vw, 78px)", fontWeight: 800, color: "#1a3bcc", letterSpacing: "-0.035em", paddingBottom: "10px" }}>
                next job
              </span>
              <span style={{ display: "block", fontSize: "clamp(36px, 4.8vw, 62px)", fontWeight: 300 }}>
                interview.
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              {...FADE_UP(0.24)}
              className="mb-9"
              style={{ fontSize: "clamp(15px, 1.35vw, 17px)", color: "#64748b", lineHeight: 1.65, maxWidth: 380 }}
            >
              Real sessions. Expert feedback. A proven path from prep to placement — built around your goals.
            </motion.p>

            {/* Process strip — top-border grid, no card */}
            <motion.div {...FADE_UP(0.32)} className="process-strip mb-9">
              {[
                { n: "01", label: "Prepare",    sub: "Resume & strategy", active: false },
                { n: "02", label: "Practice",   sub: "Mock interviews",   active: false },
                { n: "03", label: "Get Placed", sub: "Dream company",     active: true  },
              ].map(({ n, label, sub, active }) => (
                <div
                  key={n}
                  className="process-col"
                  style={{ borderTopColor: active ? "#1a3bcc" : "rgba(13,17,23,0.11)" }}
                >
                  <span style={{
                    display: "block", fontSize: "10px", fontWeight: 700,
                    letterSpacing: "0.10em", color: active ? "#1a3bcc" : "#9ca3af",
                    marginBottom: 6, fontVariantNumeric: "tabular-nums",
                  }}>
                    {n}
                  </span>
                  <span style={{
                    display: "block", fontSize: "13px", fontWeight: 700,
                    color: active ? "#1a3bcc" : "#0f172a", marginBottom: 3,
                  }}>
                    {label}
                  </span>
                  <span style={{ display: "block", fontSize: "11px", color: "#9ca3af", lineHeight: 1.4 }}>
                    {sub}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              {...FADE_UP(0.40)}
              className="flex flex-wrap gap-4 items-center justify-center lg:justify-start mb-3"
            >
              <Link
                href="/signup"
                className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 no-underline"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                Start your journey
                <ArrowRight size={14} />
              </Link>
             <Link
  href="/services"
  className="btn-ghost inline-flex items-center gap-3 text-[15px] font-medium hover:text-[var(--blue)] transition-colors"
>
  Explore services
  <ArrowRight size={17} className="ghost-arrow" />
</Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              {...FADE_UP(0.52)}
              className="flex gap-0 items-start"
              style={{ borderTop: "1px solid var(--rule)", paddingTop: "1.4rem" }}
            >
              <div className="stat-divider" style={{ paddingRight: "2rem" }}>
                <p style={{ fontSize: "clamp(22px, 2.4vw, 30px)", fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  5,000+
                </p>
                <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginTop: 5 }}>
                  Students Coached
                </p>
              </div>

              <div className="stat-divider" style={{ paddingRight: "2rem" }}>
                <p style={{ fontSize: "clamp(22px, 2.4vw, 30px)", fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  94%
                </p>
                <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginTop: 5 }}>
                  Success Rate
                </p>
              </div>

              <div className="stat-divider">
                <div className="flex items-baseline gap-1.5">
                  <p style={{ fontSize: "clamp(22px, 2.4vw, 30px)", fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                    4.9
                  </p>
                  <Star size={12} style={{ color: "#ca8a04", fill: "#ca8a04" }} />
                </div>
                <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginTop: 5 }}>
                  Avg. Rating
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT — Photo ── */}
          <div className="flex items-center justify-center lg:justify-end pt-6 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
              className="photo-wrap relative w-full"
              style={{ maxWidth: "clamp(280px, 38vw, 480px)" }}
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

                  {/* Gradient scrim */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,14,26,0.70) 0%, rgba(10,14,26,0.12) 42%, transparent 66%)" }} />

                  {/* Name card */}
                  <div style={{
                    position: "absolute", bottom: 20, left: 20, right: 20,
                    background: "rgba(255,255,255,0.09)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 13,
                    padding: "15px 18px",
                  }}>
                    <p style={{ color: "#fff", fontWeight: 600, fontSize: 19, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
                      Neel Aashish Seru
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 11, fontWeight: 500, marginTop: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Interview Coach · Ex-IndiaMART & Tech Mahindra · 12+ Yrs
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div />
      </section>
    </>
  );
}
