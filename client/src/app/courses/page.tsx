"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Clock, Users, Star, Lock, ArrowRight, Sparkles, Award,
  Search, ChevronDown, X, Play,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";
import { useAuth } from "@/context/AuthContext";

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
  analytics?: { enrollments: number; averageRating: number };
  mentorId: { name: string; designation: string; company?: string };
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
function CourseCard({ course, delay = 0, ctaHref }: { course: Course; delay?: number; ctaHref: string }) {
  const [hovered, setHovered] = useState(false);
  const isPaid = course.contentType === "paid" || course.contentType === "exclusive";
  const initials = course.mentorId.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", height: "100%",
        borderRadius: 20,
        background: hovered ? "#ffffff" : "rgba(255,255,255,0.78)",
        border: hovered ? "1px solid rgba(29,78,216,0.22)" : "1px solid rgba(29,78,216,0.09)",
        boxShadow: hovered
          ? "0 20px 52px rgba(29,78,216,0.11), 0 4px 14px rgba(29,78,216,0.06)"
          : "0 2px 12px rgba(29,78,216,0.05)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(.23,1,.32,1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        overflow: "hidden",
      }}
    >
      {/* Hover accent */}
      <div style={{
        height: 2,
        background: hovered ? `linear-gradient(90deg, ${BRAND}, rgba(29,78,216,0.3), transparent)` : "transparent",
        transition: "background 0.35s ease",
      }} />

      {/* Thumbnail */}
      <div style={{
        position: "relative", height: 165, flexShrink: 0, overflow: "hidden",
        background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
      }}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.87 }} />
          : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen style={{ width: 48, height: 48, color: "rgba(255,255,255,0.2)" }} />
            </div>
        }
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.48), transparent)" }} />

        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "3px 9px", borderRadius: 99,
            background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.28)",
            color: "#fff", backdropFilter: "blur(6px)",
          }}>
            {CAT_LABEL[course.category] ?? course.category}
          </span>
        </div>

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
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "18px 20px 20px", gap: 11 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {course.difficulty && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: MUTED }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: DIFF_DOT[course.difficulty] ?? MUTED, display: "inline-block", flexShrink: 0 }} />
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </span>
          )}
          {course.certificateEnabled && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700,
              color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0",
              padding: "2px 7px", borderRadius: 99,
            }}>
              <Award style={{ width: 9, height: 9 }} /> Certificate
            </span>
          )}
        </div>

        <h3 style={{
          fontSize: 15.5, fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.02em", margin: 0,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          transition: "color 0.2s",
          color: hovered ? BRAND_DEEP : INK,
        }} className="lc2">
          {course.title}
        </h3>

        {course.shortDescription && (
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, margin: 0 }} className="lc2">
            {course.shortDescription}
          </p>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(29,78,216,0.07)" }}>
          {(course.analytics?.enrollments ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: MUTED }}>
              <Users style={{ width: 12, height: 12 }} />
              {course.analytics!.enrollments.toLocaleString("en-IN")}
            </span>
          )}
          {(course.analytics?.averageRating ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: MUTED }}>
              <Star style={{ width: 12, height: 12, color: "#f59e0b", fill: "#f59e0b" }} />
              {course.analytics!.averageRating.toFixed(1)}
            </span>
          )}
          {(course.totalDuration ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: MUTED }}>
              <Clock style={{ width: 12, height: 12 }} />
              {course.totalDuration} min
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9, flexShrink: 0,
            background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 10, fontWeight: 700,
            boxShadow: "0 2px 8px rgba(29,78,216,0.22)",
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: INK, margin: 0, lineHeight: 1.3 }}>{course.mentorId.name}</p>
            {course.mentorId.company && (
              <p style={{ fontSize: 10.5, color: BRAND, fontWeight: 500, margin: 0 }}>{course.mentorId.company}</p>
            )}
          </div>
        </div>

        <Link
          href={ctaHref}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            padding: "10px 0", borderRadius: 12,
            background: hovered
              ? `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`
              : "linear-gradient(135deg, #1e3a8a22, #2563eb22)",
            border: `1px solid ${hovered ? BRAND : "rgba(29,78,216,0.2)"}`,
            color: hovered ? "#fff" : BRAND_DEEP,
            fontWeight: 700, fontSize: 13, textDecoration: "none",
            transition: "all 0.25s cubic-bezier(.23,1,.32,1)",
            boxShadow: hovered ? "0 8px 20px rgba(37,99,235,0.3)" : "none",
          }}
        >
          {isPaid
            ? <><Lock style={{ width: 12, height: 12 }} /> Enroll Now</>
            : <><Play style={{ width: 12, height: 12 }} /> View Course</>}
        </Link>
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
    fetch(`${API_URL}/advanced/courses/public?limit=100&sortBy=createdAt&sortOrder=desc`)
      .then(r => r.json())
      .then(d => { if (d.success) setCourses(d.data.courses || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

  const ctaHref = isLoggedIn ? "/dashboard/content" : "/login?redirect=/dashboard/content";

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
                    {t === "" ? "All" : t === "free" ? "Free" : "Premium"}
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
                    <CourseCard key={c._id} course={c} delay={Math.min(i * 0.035, 0.2)} ctaHref={ctaHref} />
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