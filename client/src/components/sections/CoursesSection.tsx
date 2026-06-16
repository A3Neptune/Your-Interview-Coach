"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, Clock, Users, Star, Lock, ArrowRight, Sparkles, Tag, Award,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/* ── Palette — matches site-wide tokens ── */
const BRAND   = "#2563eb";
const PAPER   = "#F8F6F1";
const INK     = "#0f172a";
const MUTED   = "#64748b";

interface Course {
  _id: string;
  title: string;
  shortDescription?: string;
  contentType: "free" | "paid" | "exclusive";
  category: string;
  difficulty?: string;
  price?: number;
  tags?: string[];
  thumbnail?: string;
  totalDuration?: number;
  totalLectures?: number;
  certificateEnabled?: boolean;
  analytics?: {
    enrollments: number;
    averageRating: number;
    totalRatings: number;
  };
  mentorId: {
    name: string;
    designation: string;
    company?: string;
  };
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

const DIFF_COLOR: Record<string, { dot: string; text: string }> = {
  beginner:     { dot: "#10b981", text: "#065f46" },
  intermediate: { dot: "#2563eb", text: "#1e3a8a" },
  advanced:     { dot: "#f97316", text: "#9a3412" },
  expert:       { dot: "#ef4444", text: "#7f1d1d" },
};

/* ─────────── Featured (large) card ─────────── */
function FeaturedCard({ course }: { course: Course }) {
  const isPaid = course.contentType === "paid" || course.contentType === "exclusive";
  const diff   = DIFF_COLOR[course.difficulty ?? ""] ?? { dot: MUTED, text: MUTED };
  const initials = course.mentorId.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col h-full"
      style={{
        background: "#fff",
        border: `2px solid ${INK}`,
        borderRadius: 16,
        boxShadow: `6px 6px 0 ${INK}`,
        overflow: "hidden",
        transition: "transform 0.14s, box-shadow 0.14s",
      }}
      whileHover={{ x: 2, y: 2 }}
    >
      {/* Thumbnail */}
      <div
        className="relative w-full flex-shrink-0 overflow-hidden"
        style={{ height: 200, background: `linear-gradient(135deg, ${BRAND} 0%, #1d4ed8 100%)` }}
      >
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80" />
          : <div className="absolute inset-0 flex items-center justify-center"><BookOpen style={{ color: "rgba(255,255,255,0.25)", width: 64, height: 64 }} /></div>
        }
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,23,42,0.55), transparent)" }} />

        {/* Category chip */}
        <div className="absolute top-3 left-3">
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "3px 9px", borderRadius: 4,
            background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.35)",
            color: "#fff", backdropFilter: "blur(6px)",
          }}>
            {CAT_LABEL[course.category] ?? course.category}
          </span>
        </div>

        {/* Price badge */}
        <div className="absolute top-3 right-3">
          {isPaid
            ? <span style={{
                fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 5,
                background: BRAND, border: `2px solid ${INK}`, boxShadow: `2px 2px 0 ${INK}`, color: "#fff",
                display: "inline-flex", alignItems: "center", gap: 4,
              }}><Lock style={{ width: 10, height: 10 }} /> ₹{course.price}</span>
            : <span style={{
                fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 5,
                background: "#10b981", border: `2px solid ${INK}`, boxShadow: `2px 2px 0 ${INK}`, color: "#fff",
              }}>Free</span>
          }
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 gap-3 p-5">
        {/* Difficulty + cert */}
        <div className="flex items-center gap-2 flex-wrap">
          {course.difficulty && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: diff.text }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: diff.dot, display: "inline-block", flexShrink: 0 }} />
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </span>
          )}
          {course.certificateEnabled && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700,
              color: "#059669", background: "#ecfdf5", border: "1.5px solid #6ee7b7",
              padding: "2px 7px", borderRadius: 99,
            }}>
              <Award style={{ width: 10, height: 10 }} /> Certificate
            </span>
          )}
        </div>

        <h3 style={{ fontSize: 20, fontWeight: 800, color: INK, lineHeight: 1.18, letterSpacing: "-0.02em", margin: 0 }}
            className="line-clamp-2 group-hover:text-blue-700 transition-colors">
          {course.title}
        </h3>

        {course.shortDescription && (
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, margin: 0 }} className="line-clamp-2">
            {course.shortDescription}
          </p>
        )}

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-auto pt-3" style={{ borderTop: `2px solid ${INK}` }}>
          {(course.analytics?.enrollments ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: MUTED }}>
              <Users style={{ width: 13, height: 13 }} />
              {course.analytics!.enrollments.toLocaleString("en-IN")} enrolled
            </span>
          )}
          {(course.analytics?.averageRating ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: MUTED }}>
              <Star style={{ width: 13, height: 13, color: "#eab308", fill: "#eab308" }} />
              {course.analytics!.averageRating.toFixed(1)}
            </span>
          )}
          {(course.totalDuration ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: MUTED }}>
              <Clock style={{ width: 13, height: 13 }} />
              {course.totalDuration} min
            </span>
          )}
        </div>

        {/* Instructor row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 7, flexShrink: 0,
            background: BRAND, border: `2px solid ${INK}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 11, fontWeight: 800,
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: INK, margin: 0, lineHeight: 1.3 }}>{course.mentorId.name}</p>
            {course.mentorId.company && (
              <p style={{ fontSize: 10, color: BRAND, fontWeight: 500, margin: 0 }}>{course.mentorId.company}</p>
            )}
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/login"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "11px 0", borderRadius: 8,
            background: BRAND, border: `2px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}`,
            color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none",
            transition: "transform 0.12s, box-shadow 0.12s",
          }}
          className="hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#0f172a]"
        >
          {isPaid ? <><Lock style={{ width: 13, height: 13 }} /> Enroll Now</> : <>View Course <ArrowRight style={{ width: 13, height: 13 }} /></>}
        </Link>
      </div>
    </motion.div>
  );
}

/* ─────────── Compact card ─────────── */
function CompactCard({ course, delay = 0 }: { course: Course; delay?: number }) {
  const isPaid = course.contentType === "paid" || course.contentType === "exclusive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      style={{
        background: "#fff",
        border: `2px solid ${INK}`,
        borderRadius: 14,
        boxShadow: `3px 3px 0 ${INK}`,
        padding: "16px",
        display: "flex", flexDirection: "column", gap: 10,
        transition: "transform 0.12s, box-shadow 0.12s",
      }}
      className="group hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#0f172a]"
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: MUTED }}>
          {CAT_LABEL[course.category] ?? course.category}
        </span>
        {isPaid
          ? <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 4, background: "#eff6ff", border: "1.5px solid #bfdbfe", color: BRAND, flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 3 }}>
              <Lock style={{ width: 9, height: 9 }} /> ₹{course.price}
            </span>
          : <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 4, background: "#ecfdf5", border: "1.5px solid #6ee7b7", color: "#065f46", flexShrink: 0 }}>
              Free
            </span>
        }
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 800, color: INK, lineHeight: 1.3, margin: 0, letterSpacing: "-0.01em" }}
          className="line-clamp-2 group-hover:text-blue-700 transition-colors">
        {course.title}
      </h3>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "auto", flexWrap: "wrap" }}>
        {(course.analytics?.enrollments ?? 0) > 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: MUTED, fontWeight: 500 }}>
            <Users style={{ width: 11, height: 11 }} />{course.analytics!.enrollments}
          </span>
        )}
        {(course.analytics?.averageRating ?? 0) > 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: MUTED, fontWeight: 500 }}>
            <Star style={{ width: 11, height: 11, color: "#eab308", fill: "#eab308" }} />{course.analytics!.averageRating.toFixed(1)}
          </span>
        )}
        {(course.totalDuration ?? 0) > 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: MUTED, fontWeight: 500 }}>
            <Clock style={{ width: 11, height: 11 }} />{course.totalDuration}m
          </span>
        )}
      </div>

      <Link
        href="/login"
        style={{
          display: "block", textAlign: "center", padding: "8px 0", borderRadius: 7,
          background: INK, border: `2px solid ${INK}`, boxShadow: `2px 2px 0 #64748b`,
          color: "#fff", fontWeight: 700, fontSize: 11, textDecoration: "none",
          transition: "transform 0.12s, box-shadow 0.12s",
        }}
        className="hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#64748b]"
      >
        {isPaid ? "Enroll Now" : "View Free"}
      </Link>
    </motion.div>
  );
}

/* ─────────── Stat tile ─────────── */
function StatTile({ icon: Icon, value, label, accent, delay }: {
  icon: React.ElementType; value: string; label: string; accent: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
      style={{
        background: accent, border: `2px solid ${INK}`, borderRadius: 14,
        boxShadow: `3px 3px 0 ${INK}`, padding: "18px",
        display: "flex", flexDirection: "column", gap: 6,
      }}
    >
      <Icon style={{ width: 22, height: 22, color: INK, opacity: 0.55 }} />
      <p style={{ fontSize: 30, fontWeight: 900, color: INK, lineHeight: 1, margin: 0, letterSpacing: "-0.04em" }}>{value}</p>
      <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.09em", margin: 0 }}>{label}</p>
    </motion.div>
  );
}

/* ─────────── Section ─────────── */
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
    <section
      style={{
        background: PAPER,
        borderTop:  `2px solid ${INK}`,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        position:   "relative",
        overflow:   "hidden",
      }}
    >
      {/* Dot-grid background — matches hero section */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.1) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">

        {/* ── Section header — same pattern as hero eyebrow chips ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 12px", marginBottom: 20, borderRadius: 5,
            background: BRAND, border: `2px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}`,
            color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            <Sparkles style={{ width: 12, height: 12 }} />
            Courses
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              {/* Headline — same weight / style as hero */}
              <h2 style={{
                fontSize: "clamp(34px, 4.5vw, 58px)",
                fontWeight: 900, color: INK, lineHeight: 1.0,
                letterSpacing: "-0.04em", margin: 0,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}>
                Learn from{" "}
                <span style={{
                  color: "transparent",
                  WebkitTextStroke: `2.5px ${BRAND}`,
                } as React.CSSProperties}>
                  the best.
                </span>
              </h2>
              <p style={{
                marginTop: 12, fontSize: 15, color: MUTED,
                fontWeight: 400, lineHeight: 1.65, maxWidth: 440,
              }}>
                Expert-crafted courses for every stage — mock interviews, resume, GD, coding &amp; more.
              </p>
            </div>

            <Link
              href="/login"
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
                <p style={{ color: "#fff", fontWeight: 900, fontSize: 18, margin: 0, letterSpacing: "-0.02em" }}>
                  Full access — sign in once, learn forever.
                </p>
                <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 4, fontWeight: 400 }}>
                  Track progress, earn certificates, and unlock every premium course.
                </p>
              </div>
              <Link
                href="/login"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "11px 24px", borderRadius: 8, flexShrink: 0,
                  background: "#fff", border: `2px solid #94a3b8`,
                  boxShadow: `3px 3px 0 rgba(255,255,255,0.15)`,
                  color: INK, fontWeight: 800, fontSize: 13, textDecoration: "none",
                  transition: "transform 0.12s, box-shadow 0.12s",
                }}
                className="hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                Sign in to get started <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}