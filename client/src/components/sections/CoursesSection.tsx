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

function CourseCard({ course, delay = 0 }: { course: Course; delay?: number }) {
  const [hovered, setHovered] = useState(false);
  const isPaid = course.contentType === "paid" || course.contentType === "exclusive";
  const initials = course.mentorId.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", height: "100%",
        borderRadius: 20,
        background: hovered ? "#ffffff" : "rgba(255,255,255,0.75)",
        border: hovered ? "1px solid rgba(29,78,216,0.22)" : "1px solid rgba(29,78,216,0.09)",
        boxShadow: hovered
          ? "0 20px 56px rgba(29,78,216,0.12), 0 4px 14px rgba(29,78,216,0.06)"
          : "0 2px 12px rgba(29,78,216,0.05)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(.23,1,.32,1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        overflow: "hidden",
      }}
    >
      {/* Hover accent line */}
      <div style={{
        height: 2,
        background: hovered
          ? `linear-gradient(90deg, ${BRAND}, rgba(29,78,216,0.3), transparent)`
          : "transparent",
        transition: "background 0.35s ease",
      }} />

      {/* Thumbnail */}
      <div style={{
        position: "relative", height: 150, flexShrink: 0, overflow: "hidden",
        background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
      }}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.88 }} />
          : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen style={{ width: 44, height: 44, color: "rgba(255,255,255,0.2)" }} />
            </div>
        }
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.45), transparent)" }} />

        {/* Category */}
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase",
            padding: "3px 9px", borderRadius: 99,
            background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.28)",
            color: "#fff", backdropFilter: "blur(6px)",
          }}>
            {CAT_LABEL[course.category] ?? course.category}
          </span>
        </div>

        {/* Price badge */}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          {isPaid
            ? <span style={{
                fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 99,
                background: BRAND, color: "#fff",
                display: "inline-flex", alignItems: "center", gap: 3,
                boxShadow: "0 2px 8px rgba(37,99,235,0.4)",
              }}><Lock style={{ width: 8, height: 8 }} /> ₹{course.price}</span>
            : <span style={{
                fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 99,
                background: "#10b981", color: "#fff", boxShadow: "0 2px 8px rgba(16,185,129,0.35)",
              }}>Free</span>
          }
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "16px 18px 18px", gap: 10 }}>

        {/* Difficulty + cert row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {course.difficulty && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 600, color: MUTED }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: DIFF_DOT[course.difficulty] ?? MUTED, display: "inline-block" }} />
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </span>
          )}
          {course.certificateEnabled && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9.5, fontWeight: 700,
              color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0",
              padding: "2px 7px", borderRadius: 99,
            }}>
              <Award style={{ width: 8, height: 8 }} /> Certificate
            </span>
          )}
        </div>

        <h3 style={{
          fontSize: 15, fontWeight: 700, lineHeight: 1.3,
          letterSpacing: "-0.018em", margin: 0,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          transition: "color 0.2s",
          color: hovered ? BRAND_DEEP : INK,
        }} className="line-clamp-2">
          {course.title}
        </h3>

        {course.shortDescription && (
          <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.6, margin: 0 }} className="line-clamp-2">
            {course.shortDescription}
          </p>
        )}

        {/* Stats */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: "auto", paddingTop: 10, borderTop: "1px solid rgba(29,78,216,0.07)" }}>
          {(course.analytics?.enrollments ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500, color: MUTED }}>
              <Users style={{ width: 11, height: 11 }} />
              {course.analytics!.enrollments.toLocaleString("en-IN")}
            </span>
          )}
          {(course.analytics?.averageRating ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500, color: MUTED }}>
              <Star style={{ width: 11, height: 11, color: "#f59e0b", fill: "#f59e0b" }} />
              {course.analytics!.averageRating.toFixed(1)}
            </span>
          )}
          {(course.totalDuration ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500, color: MUTED }}>
              <Clock style={{ width: 11, height: 11 }} />
              {course.totalDuration} min
            </span>
          )}
        </div>

        {/* Instructor */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 9.5, fontWeight: 700,
            boxShadow: "0 2px 8px rgba(29,78,216,0.22)",
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 11.5, fontWeight: 600, color: INK, margin: 0, lineHeight: 1.3 }}>{course.mentorId.name}</p>
            {course.mentorId.company && (
              <p style={{ fontSize: 10, color: BRAND, fontWeight: 500, margin: 0 }}>{course.mentorId.company}</p>
            )}
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/courses"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "9px 0", borderRadius: 11,
            background: hovered
              ? `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`
              : "linear-gradient(135deg, #1e3a8a22, #2563eb22)",
            border: `1px solid ${hovered ? BRAND : "rgba(29,78,216,0.18)"}`,
            color: hovered ? "#fff" : BRAND_DEEP,
            fontWeight: 700, fontSize: 12.5, textDecoration: "none",
            transition: "all 0.25s cubic-bezier(.23,1,.32,1)",
            boxShadow: hovered ? "0 8px 20px rgba(37,99,235,0.28)" : "none",
          }}
        >
          {isPaid
            ? <><Lock style={{ width: 11, height: 11 }} /> View Course</>
            : <>View Free <ArrowRight style={{ width: 11, height: 11 }} /></>}
        </Link>
      </div>
    </motion.div>
  );
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/advanced/courses/public?limit=6&sortBy=createdAt&sortOrder=desc`)
      .then(r => r.json())
      .then(d => { if (d.success) setCourses(d.data.courses || []); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const totalEnrollments = courses.reduce((s, c) => s + (c.analytics?.enrollments ?? 0), 0);
  const freeCnt = courses.filter(c => c.contentType === "free").length;

  const STATS = [
    { val: `${courses.length > 0 ? courses.length + "+" : "—"}`, label: "Courses" },
    { val: totalEnrollments > 0 ? `${totalEnrollments.toLocaleString("en-IN")}+` : "0+", label: "Students" },
    { val: `${freeCnt > 0 ? freeCnt : "—"}`, label: "Free" },
    { val: "Expert", label: "Instructors" },
  ];

  return (
    <>
      <style>{`
        .courses-lc2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <section
        style={{
          background: PAPER,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient blobs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "5%", left: "8%", width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle,rgba(29,78,216,0.055) 0%,transparent 70%)", filter: "blur(90px)" }} />
          <div style={{ position: "absolute", bottom: "5%", right: "8%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(8,145,178,0.045) 0%,transparent 70%)", filter: "blur(90px)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 44 }}
          >
            {/* Eyebrow */}
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

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <h2 style={{
                  fontSize: "clamp(32px, 4.2vw, 54px)",
                  fontWeight: 700, color: INK, lineHeight: 1.06,
                  letterSpacing: "-0.033em", margin: "0 0 12px",
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
                <p style={{ fontSize: 14.5, color: MUTED, fontWeight: 400, lineHeight: 1.65, maxWidth: 420, margin: 0 }}>
                  Expert-crafted courses for every stage — mock interviews, resume, GD, coding &amp; more.
                </p>
              </div>

              {/* Stats pill */}
              <div style={{
                display: "inline-flex", alignItems: "center",
                gap: "clamp(14px,3vw,32px)", flexWrap: "wrap",
                padding: "12px 20px", borderRadius: 99,
                background: "#fff", border: "1px solid #2563eb1a",
                boxShadow: "0 6px 24px #2563eb0f",
                flexShrink: 0,
              }}>
                {STATS.map(s => (
                  <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: BRAND, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.val}</span>
                    <span style={{ fontSize: 9.5, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Grid ── */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  height: 340, borderRadius: 20,
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(29,78,216,0.08)",
                }} className="animate-pulse" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div style={{
              borderRadius: 20, padding: "52px 48px", textAlign: "center",
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(29,78,216,0.09)",
              boxShadow: "0 4px 20px rgba(29,78,216,0.05)",
              backdropFilter: "blur(12px)",
            }}>
              <BookOpen style={{ width: 44, height: 44, color: "#cbd5e1", margin: "0 auto 12px" }} />
              <p style={{ color: MUTED, fontWeight: 600, fontSize: 15 }}>Courses coming soon</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.slice(0, 6).map((c, i) => (
                  <CourseCard key={c._id} course={c} delay={Math.min(i * 0.06, 0.3)} />
                ))}
              </div>

              {/* Browse all CTA */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                style={{ textAlign: "center", marginTop: 40 }}
              >
                <Link
                  href="/courses"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 9,
                    padding: "13px 30px", borderRadius: 14,
                    background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`,
                    color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
                    boxShadow: "0 10px 28px rgba(37,99,235,0.30)",
                    transition: "transform 0.18s, box-shadow 0.2s",
                  }}
                  className="hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(37,99,235,0.40)]"
                >
                  Browse all courses <ArrowRight style={{ width: 14, height: 14 }} />
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </>
  );
}