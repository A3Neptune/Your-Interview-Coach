"use client";

import { useState, useEffect, useRef } from "react";
import { Star } from "lucide-react";

const testimonialsRow1 = [
  {
    id: 1,
    name: "Rahul M.",
    role: "Software Developer",
    company: "TCS",
    initials: "RM",
    rating: 5,
    text: "Honestly, I was super nervous about interviews. After 3 sessions with Neel, I felt so much more confident. Got placed in my dream company!",
  },
  {
    id: 2,
    name: "Ananya K.",
    role: "MBA Student",
    company: "IIM Bangalore",
    initials: "AK",
    rating: 5,
    text: "The mock interviews were a game changer. Neel pointed out things I never even noticed about my answers. Totally worth it.",
  },
  {
    id: 3,
    name: "Vikram S.",
    role: "Data Analyst",
    company: "Infosys",
    initials: "VS",
    rating: 5,
    text: "I was struggling with technical rounds. The way Neel explained concepts and helped me practice made such a difference. Highly recommend!",
  },
];

const testimonialsRow2 = [
  {
    id: 4,
    name: "Priya T.",
    role: "HR Professional",
    company: "Wipro",
    initials: "PT",
    rating: 5,
    text: "Was clueless about how to answer behavioral questions. Neel's tips were so practical and easy to remember. Cleared 4 interviews back to back!",
  },
  {
    id: 5,
    name: "Arjun P.",
    role: "Marketing Manager",
    company: "Flipkart",
    initials: "AP",
    rating: 5,
    text: "Best decision ever! The resume review alone was worth it. Plus the interview prep helped me negotiate a better package. Thanks Neel!",
  },
  {
    id: 6,
    name: "Sneha R.",
    role: "Product Designer",
    company: "Swiggy",
    initials: "SR",
    rating: 5,
    text: "I had zero confidence before starting. The way Neel breaks down each question type and gives real examples really helped me understand what interviewers want.",
  },
];

const testimonialsAutoRow = [...testimonialsRow1, ...testimonialsRow2].slice(
  0,
  5,
);

const videoTestimonials = testimonialsAutoRow.map((t) => ({
  ...t,
  videoId: "jNQXAC9IVRw",
}));

/* avatar bg shades — all blue toned to match site palette */
const avatarBg = [
  "linear-gradient(135deg,#1e3a8a,#1d4ed8)",
  "linear-gradient(135deg,#0369a1,#0891b2)",
  "linear-gradient(135deg,#3730a3,#4f46e5)",
  "linear-gradient(135deg,#065f46,#059669)",
  "linear-gradient(135deg,#1e3a8a,#2563eb)",
  "linear-gradient(135deg,#0369a1,#38bdf8)",
];

/* ── Single card ── */
function TestimonialCard({
  t,
  bgIdx,
}: {
  t: (typeof testimonialsRow1)[0];
  bgIdx: number;
}) {
  const [hovered, setHovered] = useState(false);
  const bg = avatarBg[bgIdx % avatarBg.length];

  return (
    <div
      className="flex-shrink-0 mx-2.5"
      style={{ width: "clamp(270px, 26vw, 340px)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          padding: "22px",
          borderRadius: "20px",
          background: hovered ? "#ffffff" : "rgba(255,255,255,0.72)",
          border: hovered
            ? "1px solid rgba(29,78,216,0.20)"
            : "1px solid rgba(29,78,216,0.09)",
          boxShadow: hovered
            ? "0 12px 40px rgba(29,78,216,0.10), 0 2px 8px rgba(29,78,216,0.04)"
            : "0 2px 10px rgba(29,78,216,0.04)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.35s cubic-bezier(.23,1,.32,1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "column" as const,
          gap: "14px",
        }}
      >
        {/* Top accent line on hover */}
        <div
          style={{
            height: "2px",
            borderRadius: "2px",
            background: hovered
              ? "linear-gradient(90deg,#1e3a8a,rgba(29,78,216,0.3),transparent)"
              : "transparent",
            transition: "background 0.35s ease",
            marginTop: "-6px",
            marginLeft: "-4px",
            marginRight: "-4px",
          }}
        />

        {/* Stars */}
        <div style={{ display: "flex", gap: "3px" }}>
          {[...Array(t.rating)].map((_, i) => (
            <Star
              key={i}
              style={{
                width: 12,
                height: 12,
                fill: "#f59e0b",
                color: "#f59e0b",
                transition: `transform 0.2s ease ${i * 25}ms`,
                transform: hovered ? "scale(1.15)" : "scale(1)",
              }}
            />
          ))}
        </div>

        {/* Quote */}
        <p
          style={{
            fontSize: 13.5,
            color: "#475569",
            lineHeight: 1.75,
            fontWeight: 400,
            flex: 1,
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
        >
          "{t.text}"
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(29,78,216,0.07)" }} />

        {/* Author */}
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
              boxShadow: "0 3px 10px rgba(29,78,216,0.22)",
              transform: hovered
                ? "scale(1.06) rotate(2deg)"
                : "scale(1) rotate(0deg)",
              transition: "transform 0.3s cubic-bezier(.34,1.56,.64,1)",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            {t.initials}
          </div>
          <div>
            <p
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: "#0f172a",
                lineHeight: 1.2,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              {t.name}
            </p>
            <p
              style={{
                fontSize: 11.5,
                color: "#1d4ed8",
                fontWeight: 600,
                marginTop: 2,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              {t.role}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "#94a3b8",
                marginTop: 1,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              {t.company}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Marquee row ── */
function MarqueeRow({
  items,
  reverse = false,
  duration = 42,
}: {
  items: typeof testimonialsRow1;
  reverse?: boolean;
  duration?: number;
}) {
  const [paused, setPaused] = useState(false);
  const cloned = [...items, ...items, ...items];

  return (
    <div
      style={{ position: "relative", display: "flex", overflow: "hidden" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          animation: `t-${reverse ? "rev" : "fwd"} ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        {cloned.map((t, i) => (
          <TestimonialCard
            key={`${t.id}-${i}`}
            t={t}
            bgIdx={i % avatarBg.length}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Video card ── */
function VideoTestimonialCard({
  t,
  bgIdx,
}: {
  t: (typeof videoTestimonials)[0];
  bgIdx: number;
}) {
  const [hovered, setHovered] = useState(false);
  const bg = avatarBg[bgIdx % avatarBg.length];

  return (
    <div
      className="flex-shrink-0 mx-2.5"
      style={{ width: "clamp(270px, 26vw, 340px)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          padding: "14px",
          borderRadius: "20px",
          background: hovered ? "#ffffff" : "rgba(255,255,255,0.72)",
          border: hovered
            ? "1px solid rgba(29,78,216,0.20)"
            : "1px solid rgba(29,78,216,0.09)",
          boxShadow: hovered
            ? "0 12px 40px rgba(29,78,216,0.10), 0 2px 8px rgba(29,78,216,0.04)"
            : "0 2px 10px rgba(29,78,216,0.04)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.35s cubic-bezier(.23,1,.32,1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "column" as const,
          gap: "12px",
        }}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ borderRadius: 14, paddingTop: "56.25%" }}
        >
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${t.videoId}`}
            title={`${t.name} testimonial video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
            allowFullScreen
          />
        </div>

        <div style={{ height: 1, background: "rgba(29,78,216,0.07)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
              boxShadow: "0 3px 10px rgba(29,78,216,0.22)",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            {t.initials}
          </div>
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#0f172a",
                lineHeight: 1.2,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              {t.name}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "#1d4ed8",
                fontWeight: 600,
                marginTop: 2,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              {t.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoMarqueeRow({
  items,
  reverse = false,
  duration = 50,
}: {
  items: typeof videoTestimonials;
  reverse?: boolean;
  duration?: number;
}) {
  const [paused, setPaused] = useState(false);
  const cloned = [...items, ...items, ...items];

  return (
    <div
      style={{ position: "relative", display: "flex", overflow: "hidden" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          animation: `t-${reverse ? "rev" : "fwd"} ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        {cloned.map((t, i) => (
          <VideoTestimonialCard
            key={`${t.id}-${i}`}
            t={t}
            bgIdx={i % avatarBg.length}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Edge fade mask ── */
function EdgeFade({ bg }: { bg: string }) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
          pointerEvents: "none",
          width: "clamp(48px,8vw,110px)",
          background: `linear-gradient(90deg,${bg} 0%,transparent 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
          pointerEvents: "none",
          width: "clamp(48px,8vw,110px)",
          background: `linear-gradient(270deg,${bg} 0%,transparent 100%)`,
        }}
      />
    </>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .test-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes t-fwd {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes t-rev {
          from { transform: translateX(-33.333%); }
          to   { transform: translateX(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          [style*="t-fwd"], [style*="t-rev"] { animation: none !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="test-grain relative py-20 lg:py-32 overflow-hidden"
        style={{
          background: "#f8f6f1",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        {/* Ambient blobs — warm, no grid */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "15%",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(29,78,216,0.06) 0%,transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              right: "15%",
              width: 340,
              height: 340,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(8,145,178,0.05) 0%,transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div
          className="relative z-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition:
              "opacity 0.6s ease, transform 0.6s cubic-bezier(.23,1,.32,1)",
          }}
        >
          {/* ── Section header ── */}
          <div className="text-center px-4 mb-12 lg:mb-16">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 border"
              style={{
                background: "rgba(29,78,216,0.05)",
                borderColor: "rgba(29,78,216,0.15)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#1d40b0",
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                }}
              >
                Success Stories
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(28px,4vw,48px)",
                fontWeight: 300,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                color: "#0f172a",
                marginBottom: 14,
              }}
            >
              What our{" "}
              <span
                style={{
                  fontWeight: 600,
                  color: "#1d4ed8",
                  fontStyle: "italic",
                }}
              >
                mentees say
              </span>
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "#64748b",
                maxWidth: 420,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Real stories from professionals who transformed their careers with
              Neel's mentorship.
            </p>
          </div>

          {/* ── Row 1: Small video cards ── */}
          <div className="relative mx-4 sm:mx-8 lg:mx-20 rounded-2xl overflow-hidden mb-6 lg:mb-8">
            <EdgeFade bg="#f8f6f1" />
            <VideoMarqueeRow
              items={videoTestimonials}
              reverse={false}
              duration={52}
            />
          </div>

          {/* ── Row 2: One auto testimonials text row ── */}
          <div className="relative mx-4 sm:mx-8 lg:mx-20 rounded-2xl overflow-hidden">
            <EdgeFade bg="#f8f6f1" />
            <MarqueeRow
              items={testimonialsAutoRow}
              reverse={false}
              duration={42}
            />
          </div>
        </div>
      </section>
    </>
  );
}
