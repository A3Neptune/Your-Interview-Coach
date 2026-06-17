"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, Clock, Star, Lock, ArrowRight, Sparkles, Award, Play, CheckCircle, Tag,
} from "lucide-react";
import { getAuthToken } from "@/lib/api";

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
  discountPrice?: number | null;
  discount?: { type: string; value: number; isActive: boolean };
  thumbnail?: string;
  totalDuration?: number;
  certificateEnabled?: boolean;
  analytics?: { enrollments: number; averageRating: number; totalRatings: number };
  mentorId: { name: string; designation: string; company?: string };
  enrollment?: { progress: number };
  totalLectures?: number;
  modules?: { title: string }[];
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
  const isPaid     = course.contentType === "paid" || course.contentType === "exclusive";
  const isEnrolled = !!course.enrollment;
  const pct        = course.enrollment?.progress ?? 0;
  const inits      = course.mentorId.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const hasDiscount = !isEnrolled && isPaid && course.discount?.isActive && course.discount.type !== "none" && (course.discount.value ?? 0) > 0;
  const effectivePrice = hasDiscount && course.discountPrice != null ? course.discountPrice : (course.price ?? 0);
  const discountLabel = hasDiscount
    ? course.discount!.type === "percentage"
      ? `${course.discount!.value}% OFF`
      : `₹${course.discount!.value} OFF`
    : null;

  const green      = "#059669";
  const accentClr  = isEnrolled ? green : BRAND;
  const borderClr  = isEnrolled ? "rgba(5,150,105,0.2)" : "rgba(37,99,235,0.18)";
  const accentBar  = isEnrolled
    ? "linear-gradient(90deg,#10b981,#05966955,transparent)"
    : `linear-gradient(90deg,${BRAND},${BRAND_DEEP}55,transparent)`;
  const isLoggedIn  = !!getAuthToken();
  const previewHref = `/courses/${course._id}`;
  const enrollHref  = isEnrolled
    ? `/dashboard/content/${course._id}`
    : isLoggedIn
      ? isPaid ? `/dashboard/checkout/${course._id}` : `/dashboard/content/${course._id}`
      : isPaid ? `/login?redirect=/dashboard/checkout/${course._id}` : `/login?redirect=/dashboard/content/${course._id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      style={{
        display: "flex", flexDirection: "column", height: "100%",
        borderRadius: 20, overflow: "hidden",
        background: "#fff",
        border: `1.5px solid ${borderClr}`,
        boxShadow: "0 2px 16px rgba(37,99,235,0.07)",
        willChange: "transform",
      }}
      whileHover={{ translateY: -4, boxShadow: "0 14px 40px rgba(37,99,235,0.13)" }}
    >
      {/* Accent bar */}
      <div style={{ height: 3, background: accentBar, flexShrink: 0 }} />

      {/* Thumbnail */}
      <div style={{
        height: 172, flexShrink: 0, overflow: "hidden",
        background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
        position: "relative",
      }}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen style={{ width: 44, height: 44, color: "rgba(255,255,255,0.18)" }} />
            </div>
        }
        {/* Subtle bottom fade for readability */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,23,42,0.18),transparent 55%)" }} />
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "16px 18px 18px", gap: 9 }}>

        {/* Chips row — category + type + difficulty + cert all inline */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
            padding: "2px 8px", borderRadius: 99,
            background: "rgba(37,99,235,0.08)", color: BRAND, border: "1px solid rgba(37,99,235,0.15)",
          }}>
            {CAT_LABEL[course.category] ?? course.category}
          </span>
          {isEnrolled
            ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 700, color: green, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 7px", borderRadius: 99 }}>
                <CheckCircle style={{ width: 8, height: 8 }} /> Enrolled
              </span>
            : isPaid
              ? <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#eff6ff", color: BRAND, border: "1px solid rgba(37,99,235,0.2)" }}>Paid</span>
              : <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#f0fdf4", color: green, border: "1px solid #bbf7d0" }}>Free</span>
          }
          {course.difficulty && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 600, color: MUTED }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: DIFF_DOT[course.difficulty] ?? MUTED, display: "inline-block" }} />
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </span>
          )}
          {course.certificateEnabled && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 700, color: green, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 6px", borderRadius: 99 }}>
              <Award style={{ width: 8, height: 8 }} /> Cert
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 15, fontWeight: 700, lineHeight: 1.32, letterSpacing: "-0.018em", margin: 0, color: INK,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {course.title}
        </h3>

        {/* Description */}
        {course.shortDescription && (
          <p style={{
            fontSize: 12.5, color: MUTED, lineHeight: 1.6, margin: 0, flex: 1,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {course.shortDescription}
          </p>
        )}

        {/* Instructor + stats combined */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingTop: 8, borderTop: "1px solid rgba(37,99,235,0.07)", marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7, flexShrink: 0,
              background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 9, fontWeight: 700,
            }}>
              {inits}
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {course.mentorId.name}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {(course.analytics?.averageRating ?? 0) > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: MUTED }}>
                <Star style={{ width: 10, height: 10, color: "#f59e0b", fill: "#f59e0b" }} />
                {course.analytics!.averageRating.toFixed(1)}
              </span>
            )}
            {(course.modules?.length ?? 0) > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 500, color: MUTED }}>
                <BookOpen style={{ width: 10, height: 10 }} />
                {course.modules!.length} mod
              </span>
            )}
            {(course.totalDuration ?? 0) > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 500, color: MUTED }}>
                <Clock style={{ width: 10, height: 10 }} />
                {course.totalDuration}m
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg,${borderClr},transparent)` }} />

        {/* Bottom: price box + CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Price row */}
          <div style={{ background: isEnrolled ? "rgba(5,150,105,0.07)" : "rgba(37,99,235,0.06)", borderRadius: 10, padding: "8px 11px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {isEnrolled ? (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: accentClr, lineHeight: 1 }}>
                  {pct >= 100 ? "Completed" : pct > 0 ? "In Progress" : "Enrolled"}
                </div>
                {pct > 0 && pct < 100 && (
                  <div style={{ marginTop: 5, height: 3, borderRadius: 99, background: "rgba(37,99,235,0.12)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: `linear-gradient(90deg,${BRAND},${BRAND_DEEP})` }} />
                  </div>
                )}
              </div>
            ) : isPaid && (course.price ?? 0) > 0 ? (
              <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: BRAND, lineHeight: 1, letterSpacing: "-0.02em" }}>₹{effectivePrice}</span>
                {hasDiscount && <span style={{ fontSize: 11, color: MUTED, textDecoration: "line-through" }}>₹{course.price}</span>}
                <span style={{ fontSize: 9.5, color: MUTED, fontWeight: 500 }}>excl. GST</span>
              </div>
            ) : (
              <div style={{ fontSize: 15, fontWeight: 800, color: green, lineHeight: 1 }}>Free</div>
            )}
            {discountLabel && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 800, color: "#fff", background: "linear-gradient(135deg,#f97316,#ea580c)", padding: "2px 7px", borderRadius: 99 }}>
                <Tag style={{ width: 7, height: 7 }} />{discountLabel}
              </span>
            )}
          </div>

          {/* CTA buttons */}
          {isEnrolled ? (
            <Link
              href={`/dashboard/content/${course._id}`}
              style={{
                padding: "9px 0", borderRadius: 10, width: "100%",
                fontSize: 12, fontWeight: 700, color: "#fff",
                background: "linear-gradient(135deg,#10b981,#059669)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                textDecoration: "none",
                boxShadow: "0 3px 10px rgba(5,150,105,0.28)",
              }}
            >
              <Play style={{ width: 11, height: 11, fill: "#fff" }} /> {pct >= 100 ? "Review" : pct > 0 ? "Continue" : "Start"}
            </Link>
          ) : (
            <div style={{ display: "flex", gap: 6 }}>
              <Link
                href={previewHref}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 10,
                  fontSize: 11.5, fontWeight: 700, color: BRAND,
                  background: "rgba(37,99,235,0.08)", border: "1.5px solid rgba(37,99,235,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                  textDecoration: "none",
                }}
              >
                <Play style={{ width: 10, height: 10, fill: BRAND }} /> Free Preview
              </Link>
              <Link
                href={enrollHref}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 10,
                  fontSize: 11.5, fontWeight: 700, color: "#fff",
                  background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                  textDecoration: "none",
                  boxShadow: "0 3px 10px rgba(37,99,235,0.24)",
                }}
              >
                {isPaid ? <><Lock style={{ width: 10, height: 10 }} /> Enroll</> : <><Play style={{ width: 10, height: 10, fill: "#fff" }} /> Enroll</>}
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();

    const publicFetch = fetch(`${API_URL}/advanced/courses/public?limit=6&sortBy=createdAt&sortOrder=desc`)
      .then(r => r.json());

    const enrollFetch = token
      ? fetch(`${API_URL}/enrollments/my-enrollments`, { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.json()).catch(() => ({ success: false }))
      : Promise.resolve({ success: false });

    Promise.all([publicFetch, enrollFetch])
      .then(([pubData, enrollData]) => {
        let list: Course[] = pubData.success ? pubData.data.courses || [] : [];
        if (enrollData.success && Array.isArray(enrollData.data)) {
          const enrollMap = new Map<string, { progress: number }>();
          enrollData.data.forEach((e: any) => {
            const id = e.courseId?._id ?? e.courseId;
            if (id) enrollMap.set(id, { progress: e.progress || 0 });
          });
          list = list.map(c => enrollMap.has(c._id) ? { ...c, enrollment: enrollMap.get(c._id) } : c);
        }
        setCourses(list);
      })
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

          {/* ── Header — centered like other home sections ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 44, textAlign: "center" }}
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

            <h2 style={{
              fontSize: "clamp(32px, 4.2vw, 54px)",
              fontWeight: 700, color: INK, lineHeight: 1.06,
              letterSpacing: "-0.033em", margin: "0 0 14px",
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

            <p style={{ fontSize: 15, color: MUTED, fontWeight: 400, lineHeight: 1.65, maxWidth: 480, margin: "0 auto 24px" }}>
              Expert-crafted courses for every stage — mock interviews, resume, GD, coding &amp; more.
            </p>

            {/* Stats pill */}
            <div style={{
              display: "inline-flex", alignItems: "center",
              gap: "clamp(14px,3vw,32px)", flexWrap: "wrap", justifyContent: "center",
              padding: "12px 20px", borderRadius: 99,
              background: "#fff", border: "1px solid #2563eb1a",
              boxShadow: "0 6px 24px #2563eb0f",
            }}>
              {STATS.map(s => (
                <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: BRAND, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.val}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</span>
                </div>
              ))}
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