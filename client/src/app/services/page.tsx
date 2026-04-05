"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  Check,
  Sparkles,
  Users,
  Video,
  BarChart3,
  Map,
  Clock,
  Star,
  ArrowRight,
  Zap,
  Shield,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const services = [
  {
    icon: Video,
    title: "1-on-1 Mock Interview",
    tag: "Most popular",
    tagColor: "#2563eb",
    price: "₹999",
    duration: "60 min",
    desc: "A full-length live mock interview with expert feedback on every answer — tone, structure, confidence and content.",
    highlights: [
      "Real interview simulation",
      "Live feedback session",
      "Recording provided",
      "Improvement plan",
    ],
    accent: "#2563eb",
    accentLight: "rgba(37,99,235,0.08)",
    accentBorder: "rgba(37,99,235,0.2)",
    href: "/select-slot?service=mock-interview",
    stat: "94%",
    statLabel: "success rate",
  },
  {
    icon: Map,
    title: "Career Roadmap Session",
    tag: "AI powered",
    tagColor: "#0891b2",
    price: "₹799",
    duration: "45 min",
    desc: "Get a personalised, step-by-step career roadmap built around your goals — with milestones, timelines and resources.",
    highlights: [
      "Goal clarity session",
      "Custom milestones",
      "Skill gap analysis",
      "Resource guide",
    ],
    accent: "#0891b2",
    accentLight: "rgba(8,145,178,0.08)",
    accentBorder: "rgba(8,145,178,0.2)",
    href: "/select-slot?service=roadmap",
    stat: "98%",
    statLabel: "goal hit rate",
  },
  {
    icon: BarChart3,
    title: "Resume & LinkedIn Review",
    tag: "High impact",
    tagColor: "#7c3aed",
    price: "₹499",
    duration: "30 min",
    desc: "Line-by-line resume critique and LinkedIn optimisation. Make sure every recruiter who sees your profile wants to call you.",
    highlights: [
      "ATS optimisation",
      "LinkedIn rewrite",
      "Industry keywords",
      "Before & after",
    ],
    accent: "#7c3aed",
    accentLight: "rgba(124,58,237,0.08)",
    accentBorder: "rgba(124,58,237,0.2)",
    href: "/select-slot?service=resume",
    stat: "3.2×",
    statLabel: "more callbacks",
  },
  {
    icon: Users,
    title: "Group Workshop",
    tag: "Best value",
    tagColor: "#059669",
    price: "₹299",
    duration: "90 min",
    desc: "Join a live cohort covering the most common interview patterns across tech, consulting and finance roles.",
    highlights: [
      "Live Q&A",
      "Peer practice rounds",
      "Recorded replay",
      "Community access",
    ],
    accent: "#059669",
    accentLight: "rgba(5,150,105,0.08)",
    accentBorder: "rgba(5,150,105,0.2)",
    href: "/select-slot?service=workshop",
    stat: "500+",
    statLabel: "sessions/mo",
  },
];

const faqs = [
  {
    q: "How do I book a session?",
    a: "Click 'Book Now' on any service, pick a time slot that works for you, and confirm. You'll get a calendar invite and Zoom link instantly.",
  },
  {
    q: "Can I reschedule?",
    a: "Yes — up to 12 hours before your session. Just use the link in your confirmation email.",
  },
  {
    q: "What if I'm not satisfied?",
    a: "We offer a full refund if you feel the session didn't add value. No questions asked.",
  },
  {
    q: "Which roles do you cover?",
    a: "SWE, PM, Design, Finance, Consulting, Marketing and more. Tell us your target role when booking and we'll tailor everything.",
  },
];

export default function ServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#F8F6F1", fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navbar />
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&display=swap");
        @keyframes sv-word {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes sv-shim {
          from {
            transform: translateX(-120%) skewX(-8deg);
          }
          to {
            transform: translateX(280%) skewX(-8deg);
          }
        }
        .sv-word {
          animation: sv-word 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .sv-card {
          transition:
            transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.34s ease;
          will-change: transform;
        }
        .sv-card:hover {
          transform: translateY(-5px);
        }
        .sv-btn {
          position: relative;
          overflow: hidden;
          transition:
            transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.28s ease;
          will-change: transform;
        }
        .sv-btn:hover {
          transform: translateY(-2px);
        }
        .sv-btn:hover .sv-shim {
          animation: sv-shim 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .sv-shim {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 45%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          pointer-events: none;
        }
        .sv-faq {
          overflow: hidden;
          transition:
            max-height 0.36s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.28s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .sv-word,
          .sv-card,
          .sv-btn {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            style={{
              position: "absolute",
              top: "8%",
              right: "-2%",
              width: "380px",
              height: "380px",
              background:
                "radial-gradient(circle,rgba(37,99,235,0.08) 0%,transparent 68%)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "4%",
              width: "280px",
              height: "280px",
              background:
                "radial-gradient(circle,rgba(8,145,178,0.06) 0%,transparent 68%)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(rgba(37,99,235,0.06) 1px,transparent 1px)",
              backgroundSize: "36px 36px",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 55% at 50% 40%,black 0%,transparent 100%)",
              maskImage:
                "radial-gradient(ellipse 70% 55% at 50% 40%,black 0%,transparent 100%)",
            }}
          />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <div
            className="sv-word inline-flex items-center gap-2 px-4 py-2 rounded-full mb-7"
            style={{
              background: "rgba(255,255,255,0.88)",
              border: "1.5px solid rgba(147,197,253,0.6)",
              boxShadow: "0 2px 14px rgba(37,99,235,0.07)",
              animationDelay: "0ms",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-widest">
              Our Services
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Fraunces',serif",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            {["Pick", "the", "session"].map((w, i) => (
              <span
                key={i}
                className="sv-word"
                style={{
                  display: "inline-block",
                  marginRight: "0.22em",
                  fontSize: "clamp(36px,7vw,70px)",
                  fontWeight: 300,
                  color: "#0f172a",
                  animationDelay: `${i * 55 + 60}ms`,
                }}
              >
                {w}
              </span>
            ))}
            <span
              className="sv-word"
              style={{
                display: "inline-block",
                marginRight: "0.22em",
                fontSize: "clamp(36px,7vw,70px)",
                fontStyle: "italic",
                fontWeight: 600,
                color: "#2563eb",
                animationDelay: "230ms",
              }}
            >
              that fits
            </span>
            <span
              className="sv-word"
              style={{
                display: "inline-block",
                fontSize: "clamp(36px,7vw,70px)",
                fontWeight: 600,
                color: "#0f172a",
                animationDelay: "320ms",
              }}
            >
              your goal.
            </span>
          </h1>

          <p
            className="sv-word text-slate-500 max-w-xl mx-auto leading-relaxed"
            style={{
              fontSize: "clamp(15px,2vw,17px)",
              animationDelay: "400ms",
            }}
          >
            From mock interviews to career roadmaps — every session is built
            around getting you the offer.
          </p>
        </div>
      </section>

      {/* ── CARDS GRID ── */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <FadeUp key={i} delay={i * 65}>
                <div
                  className="sv-card h-full rounded-[20px] overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.97)",
                    border: `1.5px solid ${s.accentBorder}`,
                    boxShadow: `0 4px 20px ${s.accentLight}`,
                  }}
                >
                  <div
                    style={{
                      height: "3px",
                      background: `linear-gradient(90deg,${s.accent},${s.accent}55,transparent)`,
                    }}
                  />
                  <div
                    style={{
                      padding: "22px 20px 20px",
                      display: "flex",
                      flexDirection: "column",
                      height: "calc(100% - 3px)",
                    }}
                  >
                    {/* Header row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: "14px",
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "13px",
                          background: `linear-gradient(135deg,${s.accent}cc,${s.accent})`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: `0 4px 12px ${s.accentLight}`,
                        }}
                      >
                        <Icon
                          style={{
                            width: "19px",
                            height: "19px",
                            color: "white",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: s.tagColor,
                            background: `${s.tagColor}12`,
                            border: `1px solid ${s.tagColor}28`,
                            padding: "2px 8px",
                            borderRadius: "100px",
                          }}
                        >
                          {s.tag}
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#94a3b8",
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <Clock style={{ width: "10px", height: "10px" }} />{" "}
                          {s.duration}
                        </span>
                      </div>
                    </div>

                    <h3
                      style={{
                        fontSize: "15.5px",
                        fontWeight: 700,
                        color: "#0f172a",
                        lineHeight: 1.25,
                        marginBottom: "7px",
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "12.5px",
                        color: "#64748b",
                        lineHeight: 1.65,
                        marginBottom: "14px",
                        flex: 1,
                      }}
                    >
                      {s.desc}
                    </p>

                    {/* Highlights */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        marginBottom: "16px",
                      }}
                    >
                      {s.highlights.map((h, hi) => (
                        <div
                          key={hi}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: "17px",
                              height: "17px",
                              borderRadius: "5px",
                              background: s.accentLight,
                              border: `1px solid ${s.accentBorder}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Check
                              style={{
                                width: "9px",
                                height: "9px",
                                color: s.accent,
                              }}
                              strokeWidth={3}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#334155",
                              fontWeight: 500,
                            }}
                          >
                            {h}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        height: "1px",
                        background: `linear-gradient(90deg,${s.accentBorder},transparent)`,
                        marginBottom: "14px",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: 800,
                            color: s.accent,
                            lineHeight: 1,
                          }}
                        >
                          {s.price}
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#94a3b8",
                            fontWeight: 500,
                            marginTop: "2px",
                          }}
                        >
                          per session
                        </div>
                      </div>
                      <Link
                        href={s.href}
                        className="sv-btn"
                        style={{
                          padding: "8px 15px",
                          borderRadius: "10px",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "white",
                          background: `linear-gradient(135deg,${s.accent}dd,${s.accent})`,
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          textDecoration: "none",
                          boxShadow: `0 3px 10px ${s.accentLight}`,
                        }}
                      >
                        <span className="sv-shim" />
                        <span
                          style={{
                            position: "relative",
                            zIndex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          Book{" "}
                          <ChevronRight
                            style={{ width: "12px", height: "12px" }}
                          />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <div
              style={{
                padding: "32px 32px",
                borderRadius: "24px",
                background:
                  "linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#1d4ed8 100%)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 16px 50px rgba(37,99,235,0.2)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-30px",
                  right: "-30px",
                  width: "180px",
                  height: "180px",
                  background:
                    "radial-gradient(circle,rgba(96,165,250,0.2) 0%,transparent 70%)",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="relative z-10">
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "rgba(148,163,184,0.7)",
                    marginBottom: "20px",
                  }}
                >
                  Why candidates choose us
                </p>
                <div className="grid sm:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Zap,
                      val: "2 days",
                      label: "Avg. time from booking to first session",
                    },
                    {
                      icon: Shield,
                      val: "100%",
                      label:
                        "Satisfaction guarantee — full refund if unsatisfied",
                    },
                    // { icon:Star, val:'4.4★',label:'Average rating across 12,000+ coached sessions' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: "14px",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "9px",
                            background: "rgba(255,255,255,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Icon
                            style={{
                              width: "15px",
                              height: "15px",
                              color: "#93c5fd",
                            }}
                          />
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "20px",
                              fontWeight: 800,
                              color: "white",
                              lineHeight: 1,
                              marginBottom: "4px",
                            }}
                          >
                            {item.val}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "rgba(148,163,184,0.8)",
                              lineHeight: 1.5,
                            }}
                          >
                            {item.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <FadeUp className="text-center mb-10">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#2563eb",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  width: "18px",
                  height: "1px",
                  background: "#2563eb",
                  display: "inline-block",
                }}
              />
              FAQ
              <span
                style={{
                  width: "18px",
                  height: "1px",
                  background: "#2563eb",
                  display: "inline-block",
                }}
              />
            </span>
            <h2
              style={{
                fontFamily: "'Fraunces',serif",
                fontSize: "clamp(24px,4vw,38px)",
                fontWeight: 600,
                color: "#0f172a",
                lineHeight: 1.2,
              }}
            >
              Common questions
            </h2>
          </FadeUp>

          <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
            {faqs.map((faq, i) => (
              <FadeUp key={i} delay={i * 55}>
                <div
                  style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    background:
                      openFaq === i
                        ? "rgba(255,255,255,0.97)"
                        : "rgba(255,255,255,0.72)",
                    border:
                      openFaq === i
                        ? "1.5px solid rgba(147,197,253,0.55)"
                        : "1.5px solid rgba(219,234,254,0.6)",
                    boxShadow:
                      openFaq === i
                        ? "0 4px 18px rgba(37,99,235,0.07)"
                        : "0 1px 4px rgba(37,99,235,0.03)",
                    transition: "all 0.25s ease",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%",
                      padding: "15px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: openFaq === i ? "#1d4ed8" : "#0f172a",
                      }}
                    >
                      {faq.q}
                    </span>
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        background:
                          openFaq === i
                            ? "rgba(37,99,235,0.1)"
                            : "rgba(219,234,254,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform:
                          openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                        transition:
                          "transform 0.3s cubic-bezier(0.22,1,0.36,1),background 0.2s ease",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "16px",
                          color: openFaq === i ? "#2563eb" : "#94a3b8",
                          lineHeight: 1,
                          marginTop: "-1px",
                          display: "block",
                        }}
                      >
                        +
                      </span>
                    </div>
                  </button>
                  <div
                    className="sv-faq"
                    style={{
                      maxHeight: openFaq === i ? "200px" : "0px",
                      opacity: openFaq === i ? 1 : 0,
                    }}
                  >
                    <p
                      style={{
                        padding: "0 18px 15px",
                        fontSize: "13.5px",
                        color: "#475569",
                        lineHeight: 1.7,
                      }}
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div
              style={{
                padding: "44px 36px",
                borderRadius: "26px",
                background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 18px 56px rgba(37,99,235,0.22)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <h2
                  style={{
                    fontFamily: "'Fraunces',serif",
                    fontSize: "clamp(24px,4vw,40px)",
                    fontWeight: 600,
                    color: "white",
                    lineHeight: 1.15,
                    marginBottom: "10px",
                  }}
                >
                  Not sure which session?
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: "rgba(191,219,254,0.9)",
                    marginBottom: "22px",
                    maxWidth: "440px",
                    margin: "0 auto 22px",
                    lineHeight: 1.6,
                  }}
                >
                  Book a free 15-min discovery call and we'll tell you exactly
                  what you need.
                </p>
                <Link
                  href="/contact"
                  className="sv-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: 700,
                    background: "white",
                    color: "#1d4ed8",
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                  }}
                >
                  <span className="sv-shim" />
                  <span
                    style={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Book free call{" "}
                    <ArrowRight style={{ width: "14px", height: "14px" }} />
                  </span>
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
      <StandardFooter />
    </main>
  );
}
