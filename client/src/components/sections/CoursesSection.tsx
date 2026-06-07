"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Clock, Users, ArrowRight, Lock, Star, Sparkles, GraduationCap } from "lucide-react";
import { getAuthToken } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const BRAND     = "#2563eb";
const BRAND_DEEP = "#1d4ed8";
const PAPER     = "#F8F6F1";
const INK       = "#0f172a";
const MUTED     = "#64748b";

interface Course {
  _id: string;
  title: string;
  shortDescription?: string;
  fullDescription?: string;
  category: string;
  contentType: "free" | "paid" | "exclusive";
  price: number;
  difficulty?: string;
  thumbnail?: string;
  tags?: string[];
  totalDuration?: number;
  analytics?: {
    enrollments?: number;
    averageRating?: number;
  };
}

const CATEGORY_EMOJI: Record<string, string> = {
  "Interview Prep":       "🎯",
  "Resume Building":      "📄",
  "Communication Skills": "💬",
  "Technical Skills":     "💻",
  "Leadership":           "🚀",
  "Soft Skills":          "🌟",
  "Group Discussion":     "🗣️",
  "Career Growth":        "📈",
};

const DIFFICULTY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  beginner:     { text: "#059669", bg: "rgba(5,150,105,0.08)",  border: "rgba(5,150,105,0.22)" },
  intermediate: { text: BRAND,     bg: "rgba(37,99,235,0.08)",  border: "rgba(37,99,235,0.22)" },
  advanced:     { text: "#d97706", bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.22)" },
  expert:       { text: "#dc2626", bg: "rgba(220,38,38,0.08)",  border: "rgba(220,38,38,0.22)" },
};

const TYPE_CONFIG = {
  free:      { label: "Free",      bg: "#059669", glow: "rgba(5,150,105,0.35)" },
  paid:      { label: "",          bg: BRAND,     glow: "rgba(37,99,235,0.35)" },
  exclusive: { label: "Exclusive", bg: "#7c3aed", glow: "rgba(124,58,237,0.35)" },
};

function CourseCard({ course, idx }: { course: Course; idx: number }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const diff   = DIFFICULTY_COLORS[course.difficulty || ""] || null;
  const typeConf = TYPE_CONFIG[course.contentType] || TYPE_CONFIG.paid;
  const typeLabel = course.contentType === "paid" ? `₹${course.price}` : typeConf.label;

  const handleClick = () => {
    const token = getAuthToken();
    const dest = `/dashboard/content/${course._id}`;
    router.push(token ? dest : `/login?redirect=${encodeURIComponent(dest)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer" }}
    >
      <div
        style={{
          borderRadius: 20,
          background: hovered ? "#ffffff" : "rgba(255,255,255,0.72)",
          border: hovered
            ? `1px solid rgba(29,78,216,0.22)`
            : "1px solid rgba(29,78,216,0.09)",
          boxShadow: hovered
            ? "0 16px 48px rgba(29,78,216,0.12), 0 2px 8px rgba(29,78,216,0.05)"
            : "0 2px 10px rgba(29,78,216,0.04)",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          transition: "all 0.35s cubic-bezier(.23,1,.32,1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column" as const,
        }}
      >
        {/* Top accent line on hover */}
        <div
          style={{
            height: 3,
            background: hovered
              ? `linear-gradient(90deg, ${typeConf.bg}, ${BRAND_DEEP}, transparent)`
              : "transparent",
            transition: "background 0.35s ease",
          }}
        />

        {/* Thumbnail */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 168,
            background: `linear-gradient(135deg, rgba(37,99,235,0.07) 0%, rgba(124,58,237,0.07) 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: hovered ? "scale(1.04)" : "scale(1)",
                transition: "transform 0.5s cubic-bezier(.23,1,.32,1)",
              }}
            />
          ) : (
            <span style={{ fontSize: 52, userSelect: "none" }}>
              {CATEGORY_EMOJI[course.category] || "📚"}
            </span>
          )}

          {/* Content-type badge */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              padding: "4px 10px",
              borderRadius: 99,
              background: typeConf.bg,
              boxShadow: `0 2px 10px ${typeConf.glow}`,
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.03em",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            {typeLabel}
          </div>

          {/* Lock hint */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1)" : "scale(0.85)",
              transition: "all 0.25s ease",
            }}
          >
            <Lock size={13} style={{ color: MUTED }} />
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "18px 20px 20px",
            display: "flex",
            flexDirection: "column" as const,
            gap: 10,
            flex: 1,
          }}
        >
          {/* Difficulty + category */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
            {diff && (
              <span
                style={{
                  padding: "3px 9px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  color: diff.text,
                  background: diff.bg,
                  border: `1px solid ${diff.border}`,
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                {course.difficulty}
              </span>
            )}
            <span
              style={{
                fontSize: 11,
                color: MUTED,
                fontWeight: 500,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              {course.category}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              margin: 0,
              fontSize: 15.5,
              fontWeight: 700,
              color: hovered ? BRAND : INK,
              lineHeight: 1.35,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
              transition: "color 0.25s ease",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            {course.title}
          </h3>

          {/* Description */}
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: MUTED,
              lineHeight: 1.65,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              flex: 1,
            }}
          >
            {course.shortDescription || course.fullDescription || ""}
          </p>

          {/* Stats */}
          {((course.analytics?.enrollments ?? 0) > 0 ||
            (course.totalDuration ?? 0) > 0 ||
            (course.analytics?.averageRating ?? 0) > 0) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                paddingTop: 10,
                borderTop: "1px solid rgba(29,78,216,0.07)",
              }}
            >
              {(course.analytics?.enrollments ?? 0) > 0 && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11.5,
                    color: MUTED,
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                >
                  <Users size={12} style={{ color: BRAND, flexShrink: 0 }} />
                  {course.analytics!.enrollments}
                </span>
              )}
              {(course.totalDuration ?? 0) > 0 && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11.5,
                    color: MUTED,
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                >
                  <Clock size={12} style={{ color: BRAND, flexShrink: 0 }} />
                  {course.totalDuration}m
                </span>
              )}
              {(course.analytics?.averageRating ?? 0) > 0 && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11.5,
                    color: "#d97706",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                >
                  <Star size={12} style={{ fill: "#d97706", color: "#d97706", flexShrink: 0 }} />
                  {course.analytics!.averageRating!.toFixed(1)}
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <div
            style={{
              marginTop: 4,
              padding: "10px 0",
              borderRadius: 12,
              background: hovered
                ? `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`
                : "rgba(37,99,235,0.07)",
              border: hovered ? "1px solid transparent" : `1px solid rgba(37,99,235,0.18)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              fontSize: 13,
              fontWeight: 600,
              color: hovered ? "#fff" : BRAND,
              transition: "all 0.3s cubic-bezier(.23,1,.32,1)",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              letterSpacing: "0.01em",
              boxShadow: hovered ? `0 6px 20px rgba(37,99,235,0.32)` : "none",
            }}
          >
            <BookOpen size={14} />
            View Course
            <ArrowRight
              size={13}
              style={{
                transform: hovered ? "translateX(2px)" : "translateX(-4px)",
                opacity: hovered ? 1 : 0,
                transition: "all 0.25s ease",
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CoursesSection() {
  const router  = useRouter();
  const [courses, setCourses]   = useState<Course[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/advanced/courses/published`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const list = data.data?.courses || data.data || [];
          setTotal(data.data?.pagination?.total ?? list.length);
          setCourses(list.slice(0, 6));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && courses.length === 0) return null;

  if (loading) return (
    <section style={{ background: PAPER, padding: "clamp(64px,8vw,120px) 16px", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Skeleton header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ width: 140, height: 28, borderRadius: 99, background: "rgba(37,99,235,0.08)", margin: "0 auto 20px", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ width: "clamp(240px,40vw,480px)", height: 52, borderRadius: 12, background: "rgba(37,99,235,0.06)", margin: "0 auto 14px", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ width: "clamp(180px,30vw,360px)", height: 20, borderRadius: 8, background: "rgba(37,99,235,0.05)", margin: "0 auto", animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
        {/* Skeleton cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,320px),1fr))", gap: 20 }}>
          {[0,1,2].map((i) => (
            <div key={i} style={{ borderRadius: 20, background: "rgba(255,255,255,0.72)", border: "1px solid rgba(37,99,235,0.09)", overflow: "hidden" }}>
              <div style={{ height: 168, background: "rgba(37,99,235,0.06)", animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column" as const, gap: 10 }}>
                <div style={{ width: 80, height: 22, borderRadius: 6, background: "rgba(37,99,235,0.07)", animation: "pulse 1.5s ease-in-out infinite" }} />
                <div style={{ width: "90%", height: 20, borderRadius: 6, background: "rgba(15,23,42,0.07)", animation: "pulse 1.5s ease-in-out infinite" }} />
                <div style={{ width: "70%", height: 16, borderRadius: 6, background: "rgba(15,23,42,0.05)", animation: "pulse 1.5s ease-in-out infinite" }} />
                <div style={{ width: "100%", height: 40, borderRadius: 12, background: "rgba(37,99,235,0.07)", marginTop: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
    </section>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .courses-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.022;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      <section
        className="courses-grain relative overflow-hidden"
        style={{
          background: PAPER,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          padding: "clamp(64px, 8vw, 120px) 16px",
        }}
      >
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
          <div
            style={{
              position: "absolute",
              top: "8%",
              right: "10%",
              width: 480,
              height: 480,
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(29,78,216,0.07) 0%,transparent 70%)",
              filter: "blur(90px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "8%",
              width: 360,
              height: 360,
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(124,58,237,0.05) 0%,transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div
          className="relative z-10"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* ── Section header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              textAlign: "center",
              maxWidth: 720,
              margin: "0 auto clamp(2.5rem, 5vw, 4.5rem)",
              padding: "0 8px",
            }}
          >
            {/* Badge row */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  width: "clamp(24px, 5vw, 40px)",
                  height: 1,
                  background: "linear-gradient(90deg, transparent, #2563eb)",
                }}
              />
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "6px 14px",
                  borderRadius: 99,
                  background: "#2563eb14",
                  border: "1px solid #2563eb33",
                }}
              >
                <Sparkles size={11} style={{ color: BRAND }} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: BRAND,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                >
                  05 · Expert Courses
                </span>
              </div>
              <span
                style={{
                  width: "clamp(24px, 5vw, 40px)",
                  height: 1,
                  background: "linear-gradient(90deg, #2563eb, transparent)",
                }}
              />
            </div>

            {/* H2 */}
            <h2
              style={{
                margin: "0 0 14px",
                fontSize: "clamp(34px, 5.4vw, 68px)",
                lineHeight: 1.04,
                letterSpacing: "-0.035em",
                fontWeight: 700,
                color: INK,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              Learn at your{" "}
              <span
                style={{ position: "relative", display: "inline-block", color: BRAND }}
              >
                own pace.
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: "-3px",
                    height: 3,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DEEP})`,
                    transformOrigin: "left",
                    display: "block",
                  }}
                />
              </span>
            </h2>

            {/* Sub */}
            <p
              style={{
                fontSize: "clamp(14px, 1.4vw, 17px)",
                color: MUTED,
                lineHeight: 1.65,
                maxWidth: 560,
                margin: "0 auto 22px",
                fontWeight: 400,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              Structured programs built by Neel — from interview prep to career skills.
              Preview for free, unlock full access after sign‑in.
            </p>

            {/* Stats pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "clamp(14px, 3vw, 44px)",
                flexWrap: "wrap" as const,
                justifyContent: "center",
                padding: "12px 22px",
                borderRadius: 99,
                background: "#fff",
                border: "1px solid #2563eb22",
                boxShadow: "0 8px 30px #2563eb12",
              }}
            >
              {([
                { val: `${total}`,       label: total === 1 ? "Course" : "Courses" },
                { val: "Self-paced",     label: "Format" },
                { val: "Certificate",    label: "On completion" },
                { val: "Login",          label: "to access all" },
              ] as {val:string;label:string}[]).map((s) => (
                <div
                  key={s.label}
                  style={{ display: "flex", alignItems: "baseline", gap: 6 }}
                >
                  <span
                    style={{
                      fontSize: "clamp(14px, 1.5vw, 18px)",
                      fontWeight: 800,
                      color: BRAND,
                      letterSpacing: "-0.02em",
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                    }}
                  >
                    {s.val}
                  </span>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: MUTED,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Course grid ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
              gap: 20,
              marginBottom: "clamp(2rem, 4vw, 4rem)",
            }}
          >
            {courses.map((course, idx) => (
              <CourseCard key={course._id} course={course} idx={idx} />
            ))}
          </div>

          {/* ── Bottom CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: "center" }}
          >
            <p
              style={{
                fontSize: 13.5,
                color: MUTED,
                marginBottom: 16,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              Sign in to access full course content, track your progress, and earn certificates.
            </p>
            <button
              onClick={() => {
                const token = getAuthToken();
                router.push(token ? "/dashboard/content" : `/login?redirect=${encodeURIComponent("/dashboard/content")}`);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 28px",
                borderRadius: 12,
                background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                fontFamily: "'DM Sans', system-ui, sans-serif",
                letterSpacing: "0.01em",
                boxShadow: "0 8px 28px rgba(37,99,235,0.30)",
                transition: "box-shadow 0.25s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 36px rgba(37,99,235,0.42)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(37,99,235,0.30)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              }}
            >
              <GraduationCap size={16} />
              Browse All Courses
              <ArrowRight size={15} />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}