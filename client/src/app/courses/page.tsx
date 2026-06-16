"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, Clock, Users, Star, Lock, ArrowRight, Sparkles, Award,
  Search, ChevronDown, Tag, CheckCircle2,
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
  { value: "", label: "All Categories" },
  { value: "mock-interview",  label: "Mock Interview" },
  { value: "resume-building", label: "Resume Building" },
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

/* ─── Card ─── */
function CourseCard({ course, delay = 0, ctaHref }: { course: Course; delay?: number; ctaHref: string }) {
  const [hovered, setHovered] = useState(false);
  const isPaid = course.contentType === "paid" || course.contentType === "exclusive";
  const initials = course.mentorId.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const dotColor = DIFF_DOT[course.difficulty ?? ""] ?? MUTED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 20,
        background: hovered ? "#ffffff" : "rgba(255,255,255,0.72)",
        border: hovered
          ? "1px solid rgba(29,78,216,0.20)"
          : "1px solid rgba(29,78,216,0.09)",
        boxShadow: hovered
          ? "0 16px 48px rgba(29,78,216,0.11), 0 4px 12px rgba(29,78,216,0.06)"
          : "0 2px 12px rgba(29,78,216,0.05)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(.23,1,.32,1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        overflow: "hidden",
      }}
    >
      {/* Top accent line on hover */}
      <div style={{
        height: 2, borderRadius: "2px 2px 0 0",
        background: hovered
          ? `linear-gradient(90deg, ${BRAND}, rgba(29,78,216,0.3), transparent)`
          : "transparent",
        transition: "background 0.35s ease",
      }} />

      {/* Thumbnail */}
      <div style={{
        position: "relative",
        height: 160,
        background: `linear-gradient(135deg, #1e3a8a, #2563eb)`,
        flexShrink: 0,
        overflow: "hidden",
      }}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
          : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen style={{ width: 48, height: 48, color: "rgba(255,255,255,0.22)" }} />
            </div>
        }
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.5), transparent)" }} />

        {/* Category chip */}
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "3px 9px", borderRadius: 99,
            background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
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
                boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
              }}>
                <Lock style={{ width: 8, height: 8 }} /> ₹{course.price}
              </span>
            : <span style={{
                fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 99,
                background: "#10b981", color: "#fff",
                boxShadow: "0 2px 8px rgba(16,185,129,0.35)",
              }}>Free</span>
          }
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "18px 20px 20px", gap: 12 }}>

        {/* Difficulty + cert */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {course.difficulty && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: MUTED }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor, display: "inline-block", flexShrink: 0 }} />
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
          fontSize: 15.5, fontWeight: 700, lineHeight: 1.3,
          letterSpacing: "-0.02em", margin: 0,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          transition: "color 0.2s",
          color: hovered ? BRAND_DEEP : INK,
        }} className="line-clamp-2">
          {course.title}
        </h3>

        {course.shortDescription && (
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, margin: 0 }} className="line-clamp-2">
            {course.shortDescription}
          </p>
        )}

        {/* Stats */}
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

        {/* Instructor */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 10, fontWeight: 700,
            boxShadow: "0 3px 8px rgba(29,78,216,0.22)",
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

        {/* CTA */}
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
            : <>View Course <ArrowRight style={{ width: 12, height: 12 }} /></>}
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
      backdropFilter: "blur(12px)",
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible]   = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/advanced/courses/public?limit=100&sortBy=analytics.enrollments&sortOrder=desc`)
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        .courses-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }
        .filter-select { appearance: none; }
        .filter-select:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
        .search-input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <div
        className="courses-grain"
        style={{
          background: PAPER,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Navbar />

        {/* ── HERO ── */}
        <section style={{
          position: "relative",
          background: PAPER,
          paddingTop: "calc(var(--yic-header-h, 64px) + 56px)",
          paddingBottom: 64,
          overflow: "hidden",
        }}>
          {/* Grid pattern — same as HeroSection */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.055) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(59,130,246,0.055) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          }} />
          {/* Ambient blobs */}
          <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 480, height: 480, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle,rgba(29,78,216,0.07) 0%,transparent 70%)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", bottom: "0%", left: "5%", width: 340, height: 340, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle,rgba(8,145,178,0.05) 0%,transparent 70%)", filter: "blur(80px)" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Eyebrow — same pattern as TestimonialsSection */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
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
                margin: "0 0 16px",
                fontSize: "clamp(36px, 5.2vw, 68px)",
                lineHeight: 1.04,
                letterSpacing: "-0.035em",
                fontWeight: 700,
                color: INK,
                fontFamily: "'DM Sans', system-ui, sans-serif",
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
                fontSize: "clamp(14px,1.3vw,17px)",
                color: "#475569", lineHeight: 1.7, maxWidth: 540,
                marginBottom: 32, fontWeight: 400,
              }}>
                Expert-crafted courses for every stage &mdash; mock interviews, resume, GD, coding &amp; more.
                {!isLoggedIn && " Sign in once to track your progress and earn certificates."}
              </p>

              {/* Stats pill — same as TestimonialsSection */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "clamp(14px,3vw,40px)",
                flexWrap: "wrap",
                padding: "14px 22px", borderRadius: 99,
                background: "#fff", border: "1px solid #2563eb22",
                boxShadow: "0 8px 30px #2563eb14",
              }}>
                {STATS.map(s => (
                  <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{
                      fontSize: "clamp(14px,1.5vw,18px)", fontWeight: 800, color: BRAND,
                      letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums",
                    }}>{s.val}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FILTERS ── */}
        <div style={{
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(29,78,216,0.08)", borderBottom: "1px solid rgba(29,78,216,0.08)",
          position: "sticky", top: "var(--yic-header-h, 64px)", zIndex: 40,
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-wrap">

              {/* Search */}
              <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 320 }}>
                <Search style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  width: 15, height: 15, color: "#94a3b8", pointerEvents: "none",
                }} />
                <input
                  type="text"
                  placeholder="Search courses…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="search-input"
                  style={{
                    width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                    border: "1px solid rgba(29,78,216,0.18)", borderRadius: 12,
                    fontSize: 13, fontFamily: "inherit", color: INK,
                    background: "rgba(255,255,255,0.9)",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
              </div>

              {/* Category */}
              <div style={{ position: "relative" }}>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="filter-select"
                  style={{
                    paddingLeft: 14, paddingRight: 36, paddingTop: 9, paddingBottom: 9,
                    border: "1px solid rgba(29,78,216,0.18)", borderRadius: 12,
                    fontSize: 13, fontFamily: "inherit", color: INK,
                    background: "rgba(255,255,255,0.9)", cursor: "pointer",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <ChevronDown style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  width: 13, height: 13, color: "#94a3b8", pointerEvents: "none",
                }} />
              </div>

              {/* Type pills */}
              <div style={{ display: "flex", gap: 6 }}>
                {(["", "free", "paid"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    style={{
                      padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                      border: "1px solid",
                      borderColor: type === t ? BRAND : "rgba(29,78,216,0.18)",
                      background: type === t ? BRAND : "rgba(255,255,255,0.9)",
                      color: type === t ? "#fff" : "#475569",
                      cursor: "pointer", fontFamily: "inherit",
                      transition: "all 0.18s",
                      boxShadow: type === t ? "0 4px 12px rgba(37,99,235,0.22)" : "none",
                    }}
                  >
                    {t === "" ? "All" : t === "free" ? "Free" : "Premium"}
                  </button>
                ))}
              </div>

              {!isLoading && (
                <span style={{ fontSize: 12.5, color: "#94a3b8", fontWeight: 500, marginLeft: "auto", whiteSpace: "nowrap" }}>
                  {filtered.length} course{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── COURSES GRID ── */}
        <section
          ref={sectionRef}
          style={{
            background: PAPER, position: "relative",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(.23,1,.32,1)",
          }}
        >
          {/* Ambient blobs */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
            <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(29,78,216,0.06) 0%,transparent 70%)", filter: "blur(80px)" }} />
            <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle,rgba(8,145,178,0.05) 0%,transparent 70%)", filter: "blur(80px)" }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  borderRadius: 20, padding: "64px 48px", textAlign: "center",
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(29,78,216,0.09)",
                  boxShadow: "0 4px 20px rgba(29,78,216,0.05)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <BookOpen style={{ width: 52, height: 52, color: "#cbd5e1", margin: "0 auto 16px" }} />
                <p style={{ color: INK, fontWeight: 700, fontSize: 18, marginBottom: 8, letterSpacing: "-0.02em" }}>
                  {courses.length === 0 ? "Courses coming soon" : "No courses match your filters"}
                </p>
                <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6 }}>
                  {courses.length === 0
                    ? "We're building something great. Check back shortly."
                    : "Try clearing the search or changing the category."}
                </p>
                {(search || category || type) && (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((c, i) => (
                  <CourseCard key={c._id} course={c} delay={Math.min(i * 0.04, 0.24)} ctaHref={ctaHref} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA BANNER (guests only) ── */}
        {!isLoggedIn && (
          <section style={{ background: PAPER, position: "relative" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  borderRadius: 24, padding: "36px 40px",
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(29,78,216,0.14)",
                  boxShadow: "0 16px 48px rgba(29,78,216,0.09), 0 4px 12px rgba(29,78,216,0.05)",
                  backdropFilter: "blur(16px)",
                  display: "flex", flexWrap: "wrap", alignItems: "center",
                  justifyContent: "space-between", gap: 24,
                  position: "relative", overflow: "hidden",
                }}
              >
                {/* Blue gradient strip */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DEEP})`,
                }} />

                <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: "linear-gradient(135deg, #1e3a8a14, #2563eb22)",
                    border: "1px solid rgba(29,78,216,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <CheckCircle2 style={{ width: 24, height: 24, color: BRAND }} />
                  </div>
                  <div>
                    <p style={{ color: INK, fontWeight: 700, fontSize: 18, margin: 0, letterSpacing: "-0.025em" }}>
                      Full access &mdash; sign in once, learn forever.
                    </p>
                    <p style={{ color: MUTED, fontSize: 13.5, marginTop: 5, fontWeight: 400, lineHeight: 1.5 }}>
                      Track progress, earn certificates, and unlock every premium course.
                    </p>
                  </div>
                </div>

                <Link
                  href="/login?redirect=/dashboard/content"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "12px 26px", borderRadius: 12, flexShrink: 0,
                    background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`,
                    color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
                    boxShadow: "0 8px 24px rgba(37,99,235,0.30)",
                    transition: "transform 0.18s, box-shadow 0.2s",
                  }}
                  className="hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(37,99,235,0.40)]"
                >
                  Sign in to get started <ArrowRight style={{ width: 15, height: 15 }} />
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