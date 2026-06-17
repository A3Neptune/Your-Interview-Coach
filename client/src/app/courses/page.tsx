"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Clock, Star, Lock, ArrowRight, Sparkles, Award,
  Search, ChevronDown, X, Play, CheckCircle, Tag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";
import { useAuth } from "@/context/AuthContext";
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
  analytics?: { enrollments: number; averageRating: number };
  mentorId: { name: string; designation: string; company?: string };
  enrollment?: { progress: number };
  totalLectures?: number;
  modules?: { title: string }[];
}

const CAT_LABEL: Record<string, string> = {
  "mock-interview":  "Mock Interview",
  "resume-building": "Resume Building",
  "gd-practice":     "Group Discussion",
  "placement-prep":  "Placement Prep",
  "skills":          "Skills",
  "career-growth":   "Career Growth",
  "coding":          "Coding",
  "system-design":   "System Design",
  "behavioral":      "Behavioral",
  "other":           "Other",
};

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "mock-interview",  label: "Mock Interview" },
  { value: "resume-building", label: "Resume" },
  { value: "gd-practice",     label: "Group Discussion" },
  { value: "placement-prep",  label: "Placement Prep" },
  { value: "coding",          label: "Coding" },
  { value: "behavioral",      label: "Behavioral" },
  { value: "career-growth",   label: "Career Growth" },
];

const DIFF_DOT: Record<string, string> = {
  beginner:     "#10b981",
  intermediate: "#2563eb",
  advanced:     "#f97316",
  expert:       "#ef4444",
};

/* ─── Course Card ─── */
function CourseCard({ course, delay = 0, isLoggedIn = false }: { course: Course; delay?: number; isLoggedIn?: boolean }) {
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

  const green     = "#059669";
  const accentClr = isEnrolled ? green : BRAND;
  const borderClr = isEnrolled ? "rgba(5,150,105,0.2)" : "rgba(37,99,235,0.18)";
  const accentBar = isEnrolled
    ? "linear-gradient(90deg,#10b981,#05966955,transparent)"
    : `linear-gradient(90deg,${BRAND},${BRAND_DEEP}55,transparent)`;
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
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
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
      <div style={{ height: 172, flexShrink: 0, overflow: "hidden", background: "linear-gradient(135deg,#1e3a8a,#2563eb)", position: "relative" }}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen style={{ width: 44, height: 44, color: "rgba(255,255,255,0.18)" }} />
            </div>
        }
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,23,42,0.18),transparent 55%)" }} />
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "16px 18px 18px", gap: 9 }}>

        {/* Chips — category + type + difficulty + cert inline */}
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
          fontSize: 15.5, fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.02em", margin: 0, color: INK,
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

        {/* Instructor + stats */}
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

        {/* Price box + CTAs */}
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
                <Play style={{ width: 10, height: 10, fill: BRAND }} /> Preview
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

function SkeletonCard() {
  return (
    <div style={{
      height: 400, borderRadius: 20,
      background: "rgba(255,255,255,0.72)",
      border: "1px solid rgba(29,78,216,0.08)",
    }} className="animate-pulse" />
  );
}

/* ─── Page ─── */
export default function CoursesPage() {
  const { isLoggedIn } = useAuth();
  const [courses, setCourses]   = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("");
  const [type, setType]         = useState<"" | "free" | "paid">("");

  useEffect(() => {
    const token = getAuthToken();

    const publicFetch = fetch(`${API_URL}/advanced/courses/public?limit=100&sortBy=createdAt&sortOrder=desc`)
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
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  useEffect(() => {
    let r = [...courses];
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(c =>
        c.title.toLowerCase().includes(q) ||
        (c.shortDescription ?? "").toLowerCase().includes(q) ||
        (CAT_LABEL[c.category] ?? c.category).toLowerCase().includes(q)
      );
    }
    if (category) r = r.filter(c => c.category === category);
    if (type === "free") r = r.filter(c => c.contentType === "free");
    if (type === "paid") r = r.filter(c => c.contentType !== "free");
    setFiltered(r);
  }, [courses, search, category, type]);

  const totalEnrollments = courses.reduce((s, c) => s + (c.analytics?.enrollments ?? 0), 0);
  const freeCnt = courses.filter(c => c.contentType === "free").length;
  const hasFilters = search || category || type;

  const STATS = [
    { val: `${courses.length}+`, label: "Courses" },
    { val: totalEnrollments > 0 ? `${totalEnrollments.toLocaleString("en-IN")}+` : "0+", label: "Enrolled" },
    { val: `${freeCnt}`, label: "Free" },
    { val: "4.9★", label: "Avg rating" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        .lc2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .si:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
        .fs { appearance: none; }
        .fs:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
      `}</style>

      <div style={{
        background: PAPER,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        minHeight: "100vh",
        position: "relative",
      }}>
        <Navbar />

        {/* ── Hero ── */}
        <section style={{
          position: "relative",
          paddingTop: "calc(var(--yic-header-h, 64px) + 52px)",
          paddingBottom: 52,
          overflow: "hidden",
          background: PAPER,
        }}>
          {/* Grid pattern */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.055) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(59,130,246,0.055) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          }} />
          <div style={{ position: "absolute", top: "-8%", right: "-4%", width: 480, height: 480, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle,rgba(29,78,216,0.07) 0%,transparent 70%)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", bottom: "0%", left: "3%", width: 340, height: 340, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle,rgba(8,145,178,0.05) 0%,transparent 70%)", filter: "blur(80px)" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Eyebrow */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                <span style={{ width: "clamp(20px,4vw,36px)", height: 1, background: "linear-gradient(90deg,transparent,#2563eb)" }} />
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "6px 14px", borderRadius: 99,
                  background: "#2563eb14", border: "1px solid #2563eb33",
                }}>
                  <Sparkles size={11} style={{ color: BRAND }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: BRAND, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    All Courses
                  </span>
                </div>
                <span style={{ width: "clamp(20px,4vw,36px)", height: 1, background: "linear-gradient(90deg,#2563eb,transparent)" }} />
              </div>

              <h1 style={{
                margin: "0 0 14px",
                fontSize: "clamp(34px, 5vw, 64px)",
                lineHeight: 1.04, letterSpacing: "-0.035em", fontWeight: 700,
                color: INK, fontFamily: "'DM Sans', system-ui, sans-serif",
              }}>
                Learn from{" "}
                <span style={{ position: "relative", display: "inline-block", color: BRAND }}>
                  the best.
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: "absolute", left: 0, right: 0, bottom: -3,
                      height: 3, borderRadius: 2,
                      background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DEEP})`,
                      transformOrigin: "left", display: "block",
                    }}
                  />
                </span>
              </h1>

              <p style={{
                fontSize: "clamp(14px,1.25vw,16.5px)",
                color: MUTED, lineHeight: 1.7, maxWidth: 520,
                marginBottom: 28, fontWeight: 400,
              }}>
                Expert-crafted courses for every stage — mock interviews, resume, GD, coding &amp; more.
                {!isLoggedIn && " Sign in to track progress and earn certificates."}
              </p>

              {/* Stats pill */}
              <div style={{
                display: "inline-flex", alignItems: "center",
                gap: "clamp(12px,3vw,36px)", flexWrap: "wrap",
                padding: "13px 22px", borderRadius: 99,
                background: "#fff", border: "1px solid #2563eb1a",
                boxShadow: "0 8px 28px #2563eb12",
              }}>
                {STATS.map(s => (
                  <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                    <span style={{ fontSize: "clamp(13px,1.4vw,17px)", fontWeight: 800, color: BRAND, letterSpacing: "-0.02em" }}>{s.val}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Sticky Filter Bar ── */}
        <div style={{
          background: "rgba(248,246,241,0.92)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(29,78,216,0.08)",
          borderBottom: "1px solid rgba(29,78,216,0.08)",
          position: "sticky", top: "var(--yic-header-h, 64px)", zIndex: 40,
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>

              {/* Search */}
              <div style={{ position: "relative", flex: "1 1 180px", minWidth: 0, maxWidth: 300 }}>
                <Search style={{
                  position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
                  width: 14, height: 14, color: "#94a3b8", pointerEvents: "none",
                }} />
                <input
                  type="text"
                  placeholder="Search courses…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="si"
                  style={{
                    width: "100%", paddingLeft: 34, paddingRight: search ? 32 : 12,
                    paddingTop: 8, paddingBottom: 8,
                    border: "1px solid rgba(29,78,216,0.18)", borderRadius: 11,
                    fontSize: 13, fontFamily: "inherit", color: INK,
                    background: "rgba(255,255,255,0.9)",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxSizing: "border-box",
                  }}
                />
                {search && (
                  <button onClick={() => setSearch("")} style={{
                    position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    display: "flex", alignItems: "center",
                  }}>
                    <X style={{ width: 13, height: 13, color: "#94a3b8" }} />
                  </button>
                )}
              </div>

              {/* Category dropdown */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="fs"
                  style={{
                    paddingLeft: 12, paddingRight: 32, paddingTop: 8, paddingBottom: 8,
                    border: "1px solid rgba(29,78,216,0.18)", borderRadius: 11,
                    fontSize: 13, fontFamily: "inherit", color: INK,
                    background: "rgba(255,255,255,0.9)", cursor: "pointer",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <ChevronDown style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  width: 12, height: 12, color: "#94a3b8", pointerEvents: "none",
                }} />
              </div>

              {/* Type pills */}
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {(["", "free", "paid"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    style={{
                      padding: "6px 13px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                      border: "1px solid",
                      borderColor: type === t ? BRAND : "rgba(29,78,216,0.18)",
                      background: type === t ? BRAND : "rgba(255,255,255,0.9)",
                      color: type === t ? "#fff" : MUTED,
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.18s",
                      boxShadow: type === t ? "0 4px 12px rgba(37,99,235,0.22)" : "none",
                    }}
                  >
                    {t === "" ? "All" : t === "free" ? "Free" : "Paid"}
                  </button>
                ))}
              </div>

              {/* Clear filters */}
              {hasFilters && (
                <button
                  onClick={() => { setSearch(""); setCategory(""); setType(""); }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "6px 12px", borderRadius: 99, fontSize: 11.5, fontWeight: 600,
                    border: "1px solid rgba(239,68,68,0.3)", background: "#fef2f2",
                    color: "#dc2626", cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.15s", flexShrink: 0,
                  }}
                >
                  <X style={{ width: 11, height: 11 }} /> Clear
                </button>
              )}

              {!isLoading && (
                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, marginLeft: "auto", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {filtered.length} course{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Category scroll tabs — mobile */}
            <div className="flex sm:hidden gap-2 mt-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  style={{
                    flexShrink: 0, padding: "5px 12px", borderRadius: 99, fontSize: 11.5, fontWeight: 600,
                    border: "1px solid",
                    borderColor: category === c.value ? BRAND : "rgba(29,78,216,0.15)",
                    background: category === c.value ? BRAND : "rgba(255,255,255,0.9)",
                    color: category === c.value ? "#fff" : MUTED,
                    cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                    transition: "all 0.18s",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Courses Grid ── */}
        <section style={{ background: PAPER, position: "relative" }}>
          {/* Ambient blobs */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
            <div style={{ position: "absolute", top: "15%", left: "8%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(29,78,216,0.055) 0%,transparent 70%)", filter: "blur(80px)" }} />
            <div style={{ position: "absolute", bottom: "10%", right: "8%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(8,145,178,0.045) 0%,transparent 70%)", filter: "blur(80px)" }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  borderRadius: 20, padding: "clamp(40px,6vw,72px) clamp(24px,6vw,56px)",
                  textAlign: "center",
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(29,78,216,0.09)",
                  boxShadow: "0 4px 20px rgba(29,78,216,0.05)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <BookOpen style={{ width: 48, height: 48, color: "#cbd5e1", margin: "0 auto 14px" }} />
                <p style={{ color: INK, fontWeight: 700, fontSize: 17, marginBottom: 8, letterSpacing: "-0.02em" }}>
                  {courses.length === 0 ? "Courses coming soon" : "No courses match your filters"}
                </p>
                <p style={{ color: MUTED, fontSize: 13.5, lineHeight: 1.6 }}>
                  {courses.length === 0
                    ? "We're building something great. Check back shortly."
                    : "Try clearing the search or changing the category."}
                </p>
                {hasFilters && (
                  <button
                    onClick={() => { setSearch(""); setCategory(""); setType(""); }}
                    style={{
                      marginTop: 20, padding: "10px 24px", borderRadius: 12,
                      background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`,
                      color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer",
                      border: "none", fontFamily: "inherit",
                      boxShadow: "0 8px 20px rgba(37,99,235,0.28)",
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <AnimatePresence mode="popLayout">
                  {filtered.map((c, i) => (
                    <CourseCard key={c._id} course={c} delay={Math.min(i * 0.035, 0.2)} isLoggedIn={isLoggedIn} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>

        {/* ── Guest CTA Banner ── */}
        {!isLoggedIn && !isLoading && (
          <section style={{ background: PAPER }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  borderRadius: 20, padding: "clamp(24px,4vw,36px) clamp(20px,5vw,44px)",
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(29,78,216,0.14)",
                  boxShadow: "0 16px 48px rgba(29,78,216,0.09), 0 4px 12px rgba(29,78,216,0.05)",
                  backdropFilter: "blur(16px)",
                  display: "flex", flexWrap: "wrap", alignItems: "center",
                  justifyContent: "space-between", gap: 20,
                  position: "relative", overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DEEP})` }} />
                <div>
                  <p style={{ color: INK, fontWeight: 700, fontSize: "clamp(15px,2vw,18px)", margin: 0, letterSpacing: "-0.02em" }}>
                    Full access — sign in once, learn forever.
                  </p>
                  <p style={{ color: MUTED, fontSize: 13, marginTop: 4, fontWeight: 400 }}>
                    Track progress, earn certificates, and unlock every premium course.
                  </p>
                </div>
                <Link
                  href="/login?redirect=/dashboard/content"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "11px 24px", borderRadius: 12, flexShrink: 0,
                    background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`,
                    color: "#fff", fontWeight: 700, fontSize: 13.5, textDecoration: "none",
                    boxShadow: "0 8px 24px rgba(37,99,235,0.30)",
                    transition: "transform 0.18s, box-shadow 0.2s",
                  }}
                  className="hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(37,99,235,0.40)]"
                >
                  Sign in to get started <ArrowRight style={{ width: 14, height: 14 }} />
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        <StandardFooter />
      </div>
    </>
  );
}