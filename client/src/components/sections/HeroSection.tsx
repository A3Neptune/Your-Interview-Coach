"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const FADE_UP = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');


        :root {
          --cream: #f7f4ef;
          --ink: #0d1117;
          --ink-soft: #374151;
          --blue: #1a3bcc;
          --blue-light: #dce7ff;
          --gold: #c9a84c;
          --rule: rgba(13,17,23,0.10);
        }

        /* ── Noise overlay ── */
        .h-noise::after {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.030;
        }

        /* ── Diagonal rule behind headline ── */
        .diag-rule {
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: 1px;
          background: var(--rule);
        }

        /* ── Photo frame border trick ── */
        .photo-wrap::before {
          content: '';
          position: absolute;
          inset: -14px -10px -10px -14px;
          border: 1px solid rgba(26,59,204,0.18);
          border-radius: 20px;
          z-index: 0;
          pointer-events: none;
        }
        .photo-wrap::after {
          content: '';
          position: absolute;
          inset: -28px -22px -22px -28px;
          border: 1px dashed rgba(201,168,76,0.20);
          border-radius: 26px;
          z-index: 0;
          pointer-events: none;
        }

        /* ── Buttons ── */
        .btn-primary {
          background: var(--blue);
          color: #fff;
          border: 1.5px solid var(--blue);
          transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
        }
        .btn-primary:hover {
          background: #0f2799;
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(26,59,204,0.28);
        }
        .btn-outline {
          background: transparent;
          color: var(--ink-soft);
          border: 1.5px solid var(--rule);
          transition: border-color 0.22s, color 0.22s, transform 0.22s;
        }
        .btn-outline:hover {
          border-color: rgba(26,59,204,0.35);
          color: var(--blue);
          transform: translateY(-2px);
        }

        /* ── Scroll indicator ── */
        @keyframes scrollPulse {
          0%, 100% { transform: scaleY(0); transform-origin: top; opacity: 0.6; }
          50%       { transform: scaleY(1); transform-origin: top; opacity: 1; }
        }
        .scroll-line { animation: scrollPulse 2.4s ease-in-out infinite; }

        /* ── Highlight span ── */
        .hl {
          position: relative;
          display: inline-block;
        }
        .hl::after {
          content: '';
          position: absolute;
          left: 0; bottom: 0.04em;
          width: 100%; height: 0.18em;
          background: linear-gradient(90deg, var(--gold) 0%, rgba(201,168,76,0.3) 100%);
          border-radius: 2px;
          z-index: -1;
        }

        /* ── Badge pill ── */
        .eyebrow-pill {
          background: rgba(26,59,204,0.06);
          border: 1px solid rgba(26,59,204,0.18);
        }

        /* ── Stat dividers ── */
        .stat-block + .stat-block {
          padding-left: 2rem;
          border-left: 1px solid var(--rule);
        }

        /* ── Trust badges ── */
        .trust-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: var(--ink-soft); font-weight: 500;
        }

        /* ── Gradient mesh blobs ── */
        .blob {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none; z-index: 0;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="h-noise relative min-h-svh overflow-hidden flex flex-col"
        style={{
          background: "var(--cream)",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        {/* ── Subtle mesh blobs (static) ── */}
        <div
          className="blob"
          style={{
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(26,59,204,0.06) 0%, transparent 70%)",
            top: "-120px",
            right: "-80px",
          }}
        />
        <div
          className="blob"
          style={{
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
            bottom: "60px",
            left: "-60px",
          }}
        />

        {/* ── Fine grid ── */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(13,17,23,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(13,17,23,0.03) 1px,transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* ── Main content ── */}
        <div className="relative z-10 flex-1 w-full max-w-[1280px] mx-auto px-6 lg:px-12 pt-[100px] pb-8 lg:pt-[118px] lg:pb-0 grid grid-cols-1 lg:grid-cols-[55%_45%] items-center gap-16 lg:gap-0">
          {/* ════ LEFT ════ */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:pr-16">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="mb-6"
              style={{
                fontSize: "clamp(56px, 5.0vw, 120px)", // slightly reduced for fit
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                fontWeight: 500,
                color: "#0f172a",
                whiteSpace: "nowrap", // 🔥 KEY LINE
              }}
            >
              Crack your{" "}
              <span
                style={{
                  fontWeight: 700,
                  color: "#075a20be",
                  fontStyle: "italic",
                }}
              >
                next job
              </span>{" "}
              <br />
              interview.
            </motion.h1>

            {/* Body */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.35,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="mb-9 flex flex-wrap items-center gap-3 justify-center lg:justify-start"
            >
              {[
                { label: "Prepare" },
                { label: "Practice" },
                { label: "Get Placed" },
              ].map(({ label }, i) => (
                <span key={label} className="flex items-center gap-3">
                  {/* BUTTON */}
                  <span
                    style={{
                      fontSize: "clamp(13px, 1.2vw, 15px)",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "5px 16px",
                      borderRadius: "999px",

                      // SAME COLOR FOR ALL
                      background: "#2563EB", // Tailwind blue-600
                      color: "#ffffff",

                      border: "1.5px solid #2563EB",

                      boxShadow: "0 4px 12px rgba(37,99,235,0.35)",

                      transition: "all 0.25s ease",
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </span>

                  {/* ARROW */}
                  {i < 2 && (
                    <span
                      style={{
                        color: "rgba(148,163,184,0.6)",
                        fontSize: "18px",
                        fontWeight: 400,
                      }}
                    >
                      {"→"}
                    </span>
                  )}
                </span>
              ))}
            </motion.div>
            {/* CTAs */}
            <motion.div
              {...FADE_UP(0.4)}
              className="flex flex-wrap gap-3 items-center justify-center lg:justify-start mb-12"
            >
              <Link
                href="/signup"
                className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-lg no-underline"
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Start your journey
                <ArrowRight size={14} />
              </Link>

              <button
                onClick={scrollToFeatures}
                className="btn-outline inline-flex items-center gap-2 px-6 py-3.5 rounded-lg"
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Explore services
                <ArrowRight size={14} />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              {...FADE_UP(0.5)}
              className="flex gap-0 items-center"
              style={{
                borderTop: "1px solid var(--rule)",
                paddingTop: "1.6rem",
              }}
            >
              {[
                { num: "5000+", label: "Students Coached" },
                { num: "94%", label: "Success Rate" },
              ].map(({ num, label }) => (
                <div
                  key={label}
                  className="stat-block"
                  style={{ paddingRight: "2rem" }}
                >
                  <p
                    style={{
                      fontSize: "clamp(24px, 2.8vw, 34px)",
                      fontWeight: 600,
                      color: "var(--ink)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {num}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      color: "#9ca3af",
                      marginTop: "5px",
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ════ RIGHT — Photo ════ */}
          <div className="flex items-center justify-center lg:justify-end pt-6 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="photo-wrap relative w-full"
              style={{ maxWidth: "clamp(280px, 38vw, 480px)" }}
            >
              {/* Image card */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  boxShadow:
                    "0 30px 70px -10px rgba(13,17,23,0.18), 0 4px 16px rgba(13,17,23,0.08)",
                  border: "1px solid rgba(13,17,23,0.07)",
                }}
              >
                {/* Aspect ratio box */}
                <div className="relative" style={{ aspectRatio: "4/5" }}>
                  <img
                    src="/neel-aashish-seru.jpeg"
                    alt="Neel Aashish Seru — Interview & Career Mentor"
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top",
                      display: "block",
                    }}
                  />

                  {/* Bottom gradient scrim */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(10,14,26,0.72) 0%, rgba(10,14,26,0.15) 44%, transparent 68%)",
                    }}
                  />

                  {/* Glass name card */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 20,
                      left: 20,
                      right: 20,
                      background: "rgba(255,255,255,0.10)",
                      backdropFilter: "blur(18px)",
                      WebkitBackdropFilter: "blur(18px)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      borderRadius: 14,
                      padding: "18px 22px",
                    }}
                  >
                    <p
                      style={{
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 22,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.1,
                      }}
                    >
                      Neel Aashish Seru
                    </p>
                    <p
                      style={{
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 500,
                        marginTop: 5,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      Interview Coach | Ex-IndiaMART & Tech Mahindra | <br />{" "}
                      12+ Years Experience
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
          transition={{ duration: 0.5, delay: 1.2 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        >
          <span
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              color: "#c4bfb5",
            }}
          >
            Scroll
          </span>
          <div
            className="scroll-line"
            style={{
              width: 1,
              height: 38,
              background:
                "linear-gradient(to bottom, var(--blue), transparent)",
            }}
          />
        </motion.div>
        <div />
      </section>
    </>
  );
}
