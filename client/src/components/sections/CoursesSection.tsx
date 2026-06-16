"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, Clock, Users, Star, Lock, ArrowRight, Sparkles, Award,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const BRAND      = "#2563eb";
const BRAND_DEEP = "#1d4ed8";
const PAPER      = "#F8F6F1";
const INK        = "#0f172a";
const MUTED      = "#64748b";

interface Course {
  _id: string;
  title: string;
  shortDescription?: string;
  contentType: "free" | "paid" | "exclusive";
  category: string;
  difficulty?: string;
  price?: number;
  thumbnail?: string;
  totalDuration?: number;
  certificateEnabled?: boolean;
  analytics?: { enrollments: number; averageRating: number; totalRatings: number };
  mentorId: { name: string; designation: string; company?: string };
}

const CAT_LABEL: Record<string, string> = {
  "mock-interview":  "Mock Interview",
  "resume-building": "Resume",
  "gd-practice":     "Group Discussion",
  "placement-prep":  "Placement Prep",
  "skills":          "Skills",
  "career-growth":   "Career Growth",
  "coding":          "Coding",
  "system-design":   "System Design",
  "behavioral":      "Behavioral",
  "other":           "Other",
};

const DIFF_DOT: Record<string, string> = {
  beginner:     "#10b981",
  intermediate: "#2563eb",
  advanced:     "#f97316",
  expert:       "#ef4444",
};

/* ── Featured (tall) card ── */
function FeaturedCard({ course }: { course: Course }) {
  const [hovered, setHovered] = useState(false);
  const isPaid = course.contentType === "paid" || course.contentType === "exclusive";
  const initials = course.mentorId.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", height: "100%",
        borderRadius: 20,
        background: hovered ? "#ffffff" : "rgba(255,255,255,0.72)",
        border: hovered ? "1px solid rgba(29,78,216,0.20)" : "1px solid rgba(29,78,216,0.09)",
        boxShadow: hovered
          ? "0 20px 56px rgba(29,78,216,0.13), 0 6px 16px rgba(29,78,216,0.07)"
          : "0 4px 20px rgba(29,78,216,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(.23,1,.32,1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        overflow: "hidden",
      }}
    >
      {/* Top accent line */}
      <div style={{
        height: 2,
        background: hovered
          ? `linear-gradient(90deg, ${BRAND}, rgba(29,78,216,0.3), transparent)`
          : "transparent",
        transition: "background 0.35s ease",
      }} />

      {/* Thumbnail */}
      <div style={{
        position: "relative", height: 220, flexShrink: 0, overflow: "hidden",
        background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
      }}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
          : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen style={{ width: 64, height: 64, color: "rgba(255,255,255,0.2)" }} />
            </div>
        }
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.5), transparent)" }} />
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "3px 10px", borderRadius: 99,
            background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff", backdropFilter: "blur(6px)",
          }}>
            {CAT_LABEL[course.category] ?? course.category}
          </span>
        </div>
        <div style={{ position: "absolute", top: 12, right: 12 }}>
          {isPaid
            ? <span style={{
                fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 99,
                background: BRAND, color: "#fff",
                display: "inline-flex", alignItems: "center", gap: 3,
                boxShadow: "0 2px 8px rgba(37,99,235,0.4)",
              }}><Lock style={{ width: 8, height: 8 }} /> ₹{course.price}</span>
            : <span style={{
                fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 99,
                background: "#10b981", color: "#fff", boxShadow: "0 2px 8px rgba(16,185,129,0.35)",
              }}>Free</span>
          }
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "20px 22px 22px", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {course.difficulty && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: MUTED }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: DIFF_DOT[course.difficulty] ?? MUTED, display: "inline-block" }} />
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </span>
          )}
          {course.certificateEnabled && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700,
              color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0",
              padding: "2px 8px", borderRadius: 99,
            }}>
              <Award style={{ width: 9, height: 9 }} /> Certificate
            </span>
          )}
        </div>

        <h3 style={{
          fontSize: 20, fontWeight: 700, color: hovered ? BRAND_DEEP : INK,
          lineHeight: 1.2, letterSpacing: "-0.025em", margin: 0,
          transition: "color 0.2s",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }} className="line-clamp-2">
          {course.title}
        </h3>

        {course.shortDescription && (
          <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.65, margin: 0 }} className="line-clamp-2">
            {course.shortDescription}
          </p>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: "auto", paddingTop: 14, borderTop: "1px solid rgba(29,78,216,0.07)" }}>
          {(course.analytics?.enrollments ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: MUTED, fontWeight: 500 }}>
              <Users style={{ width: 12, height: 12 }} />
              {course.analytics!.enrollments.toLocaleString("en-IN")} enrolled
            </span>
          )}
          {(course.analytics?.averageRating ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: MUTED, fontWeight: 500 }}>
              <Star style={{ width: 12, height: 12, color: "#f59e0b", fill: "#f59e0b" }} />
              {course.analytics!.averageRating.toFixed(1)}
            </span>
          )}
          {(course.totalDuration ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: MUTED, fontWeight: 500 }}>
              <Clock style={{ width: 12, height: 12 }} />
              {course.totalDuration} min
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 11, fontWeight: 700,
            boxShadow: "0 3px 10px rgba(29,78,216,0.22)",
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: INK, margin: 0, lineHeight: 1.3 }}>{course.mentorId.name}</p>
            {course.mentorId.company && (
              <p style={{ fontSize: 11, color: BRAND, fontWeight: 500, margin: 0 }}>{course.mentorId.company}</p>
            )}
          </div>
        </div>

        <Link
          href="/login"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            padding: "11px 0", borderRadius: 12,
            background: hovered
              ? `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`
              : "linear-gradient(135deg, #1e3a8a22, #2563eb22)",
            border: `1px solid ${hovered ? BRAND : "rgba(29,78,216,0.2)"}`,
            color: hovered ? "#fff" : BRAND_DEEP,
            fontWeight: 700, fontSize: 13, textDecoration: "none",
            transition: "all 0.25s cubic-bezier(.23,1,.32,1)",
            boxShadow: hovered ? "0 8px 20px rgba(37,99,235,0.28)" : "none",
          }}
        >
          {isPaid ? <><Lock style={{ width: 12, height: 12 }} /> Enroll Now</> : <>View Course <ArrowRight style={{ width: 12, height: 12 }} /></>}
        </Link>
      </div>
    </motion.div>
  );
}

/* ── Compact card ── */
function CompactCard({ course, delay = 0 }: { course: Course; delay?: number }) {
  const [hovered, setHovered] = useState(false);
  const isPaid = course.contentType === "paid" || course.contentType === "exclusive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", gap: 10,
        padding: "18px 20px",
        borderRadius: 18,
        background: hovered ? "#ffffff" : "rgba(255,255,255,0.72)",
        border: hovered ? "1px solid rgba(29,78,216,0.20)" : "1px solid rgba(29,78,216,0.09)",
        boxShadow: hovered
          ? "0 12px 36px rgba(29,78,216,0.10), 0 3px 8px rgba(29,78,216,0.05)"
          : "0 2px 10px rgba(29,78,216,0.04)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.32s cubic-bezier(.23,1,.32,1)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: hovered
          ? `linear-gradient(90deg, ${BRAND}, rgba(29,78,216,0.3), transparent)`
          : "transparent",
        transition: "background 0.32s ease",
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#94a3b8" }}>
          {CAT_LABEL[course.category] ?? course.category}
        </span>
        {isPaid
          ? <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 99, background: "#eff6ff", border: "1px solid #bfdbfe", color: BRAND, flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 3 }}>
              <Lock style={{ width: 8, height: 8 }} /> ₹{course.price}
            </span>
          : <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 99, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#059669", flexShrink: 0 }}>
              Free
            </span>
        }
      </div>

      <h3 style={{
        fontSize: 14.5, fontWeight: 700, color: hovered ? BRAND_DEEP : INK,
        lineHeight: 1.3, margin: 0, letterSpacing: "-0.015em",
        transition: "color 0.2s",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }} className="line-clamp-2">
        {course.title}
      </h3>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto", flexWrap: "wrap" }}>
        {(course.analytics?.enrollments ?? 0) > 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: MUTED, fontWeight: 500 }}>
            <Users style={{ width: 11, height: 11 }} />{course.analytics!.enrollments}
          </span>
        )}
        {(course.analytics?.averageRating ?? 0) > 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: MUTED, fontWeight: 500 }}>
            <Star style={{ width: 11, height: 11, color: "#f59e0b", fill: "#f59e0b" }} />{course.analytics!.averageRating.toFixed(1)}
          </span>
        )}
      </div>

      <Link
        href="/login"
        style={{
          display: "block", textAlign: "center", padding: "8px 0", borderRadius: 10,
          background: hovered
            ? `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`
            : "linear-gradient(135deg, #1e3a8a22, #2563eb22)",
          border: `1px solid ${hovered ? BRAND : "rgba(29,78,216,0.2)"}`,
          color: hovered ? "#fff" : BRAND_DEEP,
          fontWeight: 700, fontSize: 12, textDecoration: "none",
          transition: "all 0.22s cubic-bezier(.23,1,.32,1)",
          boxShadow: hovered ? "0 6px 16px rgba(37,99,235,0.25)" : "none",
        }}
      >
        {isPaid ? "Enroll Now" : "View Free"}
      </Link>
    </motion.div>
  );
}

/* ── Stat tile ── */
function StatTile({ icon: Icon, value, label, delay }: {
  icon: React.ElementType; value: string; label: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
      style={{
        borderRadius: 18, padding: "20px",
        background: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(29,78,216,0.09)",
        boxShadow: "0 2px 12px rgba(29,78,216,0.05)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex", flexDirection: "column", gap: 6,
      }}
    >
      <Icon style={{ width: 20, height: 20, color: BRAND, opacity: 0.75 }} />
      <p style={{
        fontSize: 30, fontWeight: 800, color: INK, lineHeight: 1, margin: 0,
        letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>{value}</p>
      <p style={{ fontSize: 10.5, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.09em", margin: 0 }}>{label}</p>
    </motion.div>
  );
}

/* ── Section ── */
export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/advanced/courses/public?limit=6&sortBy=analytics.enrollments&sortOrder=desc`)
      .then(r => r.json())
      .then(d => { if (d.success) setCourses(d.data.courses || []); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const featured = courses[0];
  const rest     = courses.slice(1, 5);
  const totalEnrollments = courses.reduce((s, c) => s + (c.analytics?.enrollments ?? 0), 0);
  const freeCnt  = courses.filter(c => c.contentType === "free").length;

  return (
    <>
      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        @keyframes t-grain { 0%,100%{opacity:0.025} 50%{opacity:0.035} }
      `}</style>

      <section
        style={{
          background: PAPER,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient blobs — same as TestimonialsSection */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "5%", left: "10%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(29,78,216,0.06) 0%,transparent 70%)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", bottom: "5%", right: "10%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(8,145,178,0.05) 0%,transparent 70%)", filter: "blur(80px)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">

          {/* ── Section header — same eyebrow pattern as TestimonialsSection ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 48 }}
          >
            {/* Eyebrow with gradient lines */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ width: "clamp(20px,4vw,36px)", height: 1, background: "linear-gradient(90deg,transparent,#2563eb)" }} />
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "6px 14px", borderRadius: 99,
                background: "#2563eb14", border: "1px solid #2563eb33",
              }}>
                <Sparkles size={11} style={{ color: BRAND }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: BRAND, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Courses
                </span>
              </div>
              <span style={{ width: "clamp(20px,4vw,36px)", height: 1, background: "linear-gradient(90deg,#2563eb,transparent)" }} />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <Link
              href="/courses"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 20px", borderRadius: 8, flexShrink: 0, alignSelf: "flex-start",
                background: "#fff", border: `2px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}`,
                color: INK, fontWeight: 700, fontSize: 13, textDecoration: "none",
                transition: "transform 0.12s, box-shadow 0.12s",
              }}
              className="hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#0f172a]"
            >
              Browse all <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        </motion.div>

        {/* ── Bento grid ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: 260, borderRadius: 14, border: `2px solid ${INK}`, background: "#e2e8f0" }} className="animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div style={{
            borderRadius: 16, border: `2px solid ${INK}`, boxShadow: `4px 4px 0 ${INK}`,
            background: "#fff", padding: "48px", textAlign: "center",
          }}>
            <BookOpen style={{ width: 48, height: 48, color: "#cbd5e1", margin: "0 auto 12px" }} />
            <p style={{ color: MUTED, fontWeight: 600, fontSize: 15 }}>Courses coming soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
            {/* Featured — spans 2 cols × 2 rows on desktop */}
            {featured && (
              <div className="sm:col-span-2 lg:row-span-2">
                <FeaturedCard course={featured} />
              </div>
            )}

            {/* Stat tiles */}
            <StatTile icon={Users} value={totalEnrollments > 0 ? `${totalEnrollments.toLocaleString("en-IN")}+` : "0+"} label="Students enrolled" accent="#dbeafe" delay={0.06} />
            <StatTile icon={Tag}   value={`${freeCnt}`} label="Free courses"      accent="#d1fae5" delay={0.12} />

            {/* Compact cards */}
            {rest.map((c, i) => (
              <CompactCard key={c._id} course={c} delay={0.07 * (i + 1)} />
            ))}

            {/* Full-width bottom CTA — slate-900 banner */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="col-span-full"
              style={{
                background: INK, border: `2px solid ${INK}`, borderRadius: 16,
                boxShadow: `4px 4px 0 ${BRAND}`,
                padding: "20px 28px",
                display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16,
              }}
            >
              <div>
                <h2 style={{
                  fontSize: "clamp(34px, 4.5vw, 58px)",
                  fontWeight: 700, color: INK, lineHeight: 1.04,
                  letterSpacing: "-0.035em", margin: 0,
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}>
                  Learn from{" "}
                  <span style={{ position: "relative", display: "inline-block", color: BRAND }}>
                    the best.
                    <motion.span
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        position: "absolute", left: 0, right: 0, bottom: -3,
                        height: 3, borderRadius: 2,
                        background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DEEP})`,
                        transformOrigin: "left", display: "block",
                      }}
                    />
                  </span>
                </h2>
                <p style={{ marginTop: 12, fontSize: 15, color: MUTED, fontWeight: 400, lineHeight: 1.65, maxWidth: 440 }}>
                  Expert-crafted courses for every stage — mock interviews, resume, GD, coding &amp; more.
                </p>
              </div>

              <Link
                href="/courses"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "10px 22px", borderRadius: 12, flexShrink: 0, alignSelf: "flex-start",
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(29,78,216,0.18)",
                  boxShadow: "0 2px 10px rgba(29,78,216,0.06)",
                  color: BRAND_DEEP, fontWeight: 700, fontSize: 13, textDecoration: "none",
                  transition: "all 0.22s cubic-bezier(.23,1,.32,1)",
                }}
                className="hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(29,78,216,0.12)]"
              >
                Browse all <ArrowRight style={{ width: 13, height: 13 }} />
              </Link>
            </div>
          </motion.div>

          {/* ── Grid ── */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{
                  height: 260, borderRadius: 18,
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(29,78,216,0.08)",
                }} className="animate-pulse" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div style={{
              borderRadius: 20, padding: "48px", textAlign: "center",
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(29,78,216,0.09)",
              boxShadow: "0 4px 20px rgba(29,78,216,0.05)",
              backdropFilter: "blur(12px)",
            }}>
              <BookOpen style={{ width: 48, height: 48, color: "#cbd5e1", margin: "0 auto 12px" }} />
              <p style={{ color: MUTED, fontWeight: 600, fontSize: 15 }}>Courses coming soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-auto">
              {/* Featured — spans 2 cols × 2 rows on desktop */}
              {featured && (
                <div className="sm:col-span-2 lg:row-span-2">
                  <FeaturedCard course={featured} />
                </div>
              )}

              {/* Stat tiles */}
              <StatTile icon={Users} value={totalEnrollments > 0 ? `${totalEnrollments.toLocaleString("en-IN")}+` : "0+"} label="Students enrolled" delay={0.06} />
              <StatTile icon={BookOpen} value={`${freeCnt}`} label="Free courses" delay={0.12} />

              {/* Compact cards */}
              {rest.map((c, i) => (
                <CompactCard key={c._id} course={c} delay={0.07 * (i + 1)} />
              ))}

              {/* Full-width bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="col-span-full"
                style={{
                  borderRadius: 20, padding: "22px 32px",
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(29,78,216,0.14)",
                  boxShadow: "0 8px 32px rgba(29,78,216,0.07)",
                  backdropFilter: "blur(14px)",
                  display: "flex", flexWrap: "wrap", alignItems: "center",
                  justifyContent: "space-between", gap: 16,
                  position: "relative", overflow: "hidden",
                }}
              >
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DEEP})`,
                }} />
                <div>
                  <p style={{ color: INK, fontWeight: 700, fontSize: 17, margin: 0, letterSpacing: "-0.02em" }}>
                    Full access — sign in once, learn forever.
                  </p>
                  <p style={{ color: MUTED, fontSize: 13, marginTop: 4, fontWeight: 400 }}>
                    Track progress, earn certificates, and unlock every premium course.
                  </p>
                </div>
                <Link
                  href="/login"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "11px 24px", borderRadius: 12, flexShrink: 0,
                    background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`,
                    color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none",
                    boxShadow: "0 8px 20px rgba(37,99,235,0.28)",
                    transition: "transform 0.18s, box-shadow 0.2s",
                  }}
                  className="hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(37,99,235,0.38)]"
                >
                  Sign in to get started <ArrowRight style={{ width: 13, height: 13 }} />
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}