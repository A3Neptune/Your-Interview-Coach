"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, Clock, Users, Star, Lock, ArrowRight, Sparkles, Tag, Award,
  Search, ChevronDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const BRAND = "#2563eb";
const PAPER = "#F8F6F1";
const INK   = "#0f172a";
const MUTED = "#64748b";

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

const DIFF_COLOR: Record<string, { dot: string; text: string }> = {
  beginner:     { dot: "#10b981", text: "#065f46" },
  intermediate: { dot: "#2563eb", text: "#1e3a8a" },
  advanced:     { dot: "#f97316", text: "#9a3412" },
  expert:       { dot: "#ef4444", text: "#7f1d1d" },
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

function CourseCard({ course, delay = 0, ctaHref }: { course: Course; delay?: number; ctaHref: string }) {
  const isPaid = course.contentType === "paid" || course.contentType === "exclusive";
  const diff   = DIFF_COLOR[course.difficulty ?? ""] ?? { dot: MUTED, text: MUTED };
  const initials = course.mentorId.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className="group flex flex-col h-full"
      style={{
        background: "#fff",
        border: `2px solid ${INK}`,
        borderRadius: 16,
        boxShadow: `4px 4px 0 ${INK}`,
        overflow: "hidden",
        transition: "transform 0.14s, box-shadow 0.14s",
      }}
      whileHover={{ x: 2, y: 2 }}
    >
      {/* Thumbnail */}
      <div
        className="relative w-full flex-shrink-0 overflow-hidden"
        style={{ height: 180, background: `linear-gradient(135deg, ${BRAND} 0%, #1d4ed8 100%)` }}
      >
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80" />
          : <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen style={{ color: "rgba(255,255,255,0.25)", width: 56, height: 56 }} />
            </div>
        }
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,23,42,0.55), transparent)" }} />

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

        <h3 style={{ fontSize: 17, fontWeight: 800, color: INK, lineHeight: 1.2, letterSpacing: "-0.02em", margin: 0 }}
            className="line-clamp-2 group-hover:text-blue-700 transition-colors">
          {course.title}
        </h3>

        {course.shortDescription && (
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: 0 }} className="line-clamp-2">
            {course.shortDescription}
          </p>
        )}

        <div className="flex flex-wrap gap-4 mt-auto pt-3" style={{ borderTop: `1.5px solid #e2e8f0` }}>
          {(course.analytics?.enrollments ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: MUTED }}>
              <Users style={{ width: 12, height: 12 }} />
              {course.analytics!.enrollments.toLocaleString("en-IN")}
            </span>
          )}
          {(course.analytics?.averageRating ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: MUTED }}>
              <Star style={{ width: 12, height: 12, color: "#eab308", fill: "#eab308" }} />
              {course.analytics!.averageRating.toFixed(1)}
            </span>
          )}
          {(course.totalDuration ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: MUTED }}>
              <Clock style={{ width: 12, height: 12 }} />
              {course.totalDuration} min
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7, flexShrink: 0,
            background: BRAND, border: `2px solid ${INK}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 10, fontWeight: 800,
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

        <Link
          href={ctaHref}
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

function SkeletonCard() {
  return (
    <div
      style={{
        height: 380, borderRadius: 16, border: `2px solid ${INK}`,
        background: "#e2e8f0", boxShadow: `4px 4px 0 ${INK}`,
      }}
      className="animate-pulse"
    />
  );
}

export default function CoursesPage() {
  const { isLoggedIn } = useAuth();
  const [courses, setCourses]     = useState<Course[]>([]);
  const [filtered, setFiltered]   = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("");
  const [contentType, setContentType] = useState<"" | "free" | "paid">("");

  useEffect(() => {
    fetch(`${API_URL}/advanced/courses/public?limit=100&sortBy=analytics.enrollments&sortOrder=desc`)
      .then(r => r.json())
      .then(d => { if (d.success) setCourses(d.data.courses || []); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let result = [...courses];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        (c.shortDescription ?? "").toLowerCase().includes(q) ||
        (CAT_LABEL[c.category] ?? c.category).toLowerCase().includes(q)
      );
    }
    if (category) result = result.filter(c => c.category === category);
    if (contentType === "free")  result = result.filter(c => c.contentType === "free");
    if (contentType === "paid")  result = result.filter(c => c.contentType === "paid" || c.contentType === "exclusive");
    setFiltered(result);
  }, [courses, search, category, contentType]);

  const totalEnrollments = courses.reduce((s, c) => s + (c.analytics?.enrollments ?? 0), 0);
  const freeCnt  = courses.filter(c => c.contentType === "free").length;
  const paidCnt  = courses.filter(c => c.contentType !== "free").length;

  const ctaHref = isLoggedIn ? "/dashboard/content" : "/login?redirect=/dashboard/content";

  return (
    <div style={{ background: PAPER, fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        style={{
          background: INK,
          paddingTop: "calc(var(--yic-header-h, 64px) + 56px)",
          paddingBottom: 64,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* dot grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        {/* blue glow */}
        <div style={{
          position: "absolute", top: -120, right: -120, width: 480, height: 480,
          borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)",
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 12px", marginBottom: 20, borderRadius: 5,
              background: BRAND, border: `2px solid rgba(255,255,255,0.15)`, boxShadow: `3px 3px 0 rgba(255,255,255,0.1)`,
              color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              <Sparkles style={{ width: 12, height: 12 }} />
              All Courses
            </div>

            <h1 style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 900, color: "#fff", lineHeight: 1.0,
              letterSpacing: "-0.04em", margin: "0 0 16px",
            }}>
              Learn from{" "}
              <span style={{ color: "transparent", WebkitTextStroke: `2.5px ${BRAND}` } as React.CSSProperties}>
                the best.
              </span>
            </h1>

            <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.65, maxWidth: 520, margin: "0 0 40px" }}>
              Expert-crafted courses for every stage — mock interviews, resume, GD, coding &amp; more.
              {!isLoggedIn && " Sign in once to track progress and earn certificates."}
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: BookOpen, val: `${courses.length}+`, lbl: "Courses" },
                { icon: Users,    val: totalEnrollments > 0 ? `${totalEnrollments.toLocaleString("en-IN")}+` : "—", lbl: "Enrolled" },
                { icon: Tag,      val: `${freeCnt}`,  lbl: "Free" },
                { icon: Lock,     val: `${paidCnt}`,  lbl: "Premium" },
              ].map(({ icon: Icon, val, lbl }) => (
                <div key={lbl} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "8px 14px", borderRadius: 8,
                  background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)",
                }}>
                  <Icon style={{ width: 14, height: 14, color: BRAND }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{val}</span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{lbl}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FILTERS ── */}
      <section style={{ background: "#fff", borderBottom: `2px solid ${INK}`, position: "sticky", top: "var(--yic-header-h, 64px)", zIndex: 40 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: MUTED }} />
              <input
                type="text"
                placeholder="Search courses…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: "100%", paddingLeft: 38, paddingRight: 12, paddingTop: 10, paddingBottom: 10,
                  border: `2px solid ${INK}`, borderRadius: 8,
                  fontSize: 13, fontFamily: "inherit", color: INK,
                  outline: "none", background: PAPER,
                }}
              />
            </div>

            {/* Category */}
            <div className="relative">
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{
                  appearance: "none", paddingLeft: 12, paddingRight: 36, paddingTop: 10, paddingBottom: 10,
                  border: `2px solid ${INK}`, borderRadius: 8,
                  fontSize: 13, fontFamily: "inherit", color: INK,
                  outline: "none", background: PAPER, cursor: "pointer",
                }}
              >
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <ChevronDown style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: MUTED, pointerEvents: "none" }} />
            </div>

            {/* Type filter pills */}
            <div className="flex gap-2">
              {(["", "free", "paid"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setContentType(t)}
                  style={{
                    padding: "8px 14px", borderRadius: 7, fontSize: 12, fontWeight: 700,
                    border: `2px solid ${INK}`,
                    background: contentType === t ? INK : "#fff",
                    color:      contentType === t ? "#fff" : INK,
                    cursor: "pointer", fontFamily: "inherit",
                    boxShadow: contentType === t ? `2px 2px 0 ${BRAND}` : `2px 2px 0 ${INK}`,
                    transition: "all 0.12s",
                  }}
                >
                  {t === "" ? "All" : t === "free" ? "Free" : "Premium"}
                </button>
              ))}
            </div>

            {/* Results count */}
            {!isLoading && (
              <span style={{ fontSize: 13, color: MUTED, fontWeight: 500, whiteSpace: "nowrap", marginLeft: "auto" }}>
                {filtered.length} course{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── COURSE GRID ── */}
      <section style={{ background: PAPER, borderTop: `2px solid ${INK}` }}>
        {/* dot-grid bg */}
        <div style={{
          position: "absolute", pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          inset: 0, zIndex: 0,
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                borderRadius: 16, border: `2px solid ${INK}`, boxShadow: `4px 4px 0 ${INK}`,
                background: "#fff", padding: "64px 48px", textAlign: "center",
              }}
            >
              <BookOpen style={{ width: 56, height: 56, color: "#cbd5e1", margin: "0 auto 16px" }} />
              <p style={{ color: INK, fontWeight: 800, fontSize: 18, marginBottom: 8 }}>
                {courses.length === 0 ? "Courses coming soon" : "No courses match your filters"}
              </p>
              <p style={{ color: MUTED, fontSize: 14 }}>
                {courses.length === 0
                  ? "We're building something great. Check back shortly."
                  : "Try clearing the search or changing category."}
              </p>
              {(search || category || contentType) && (
                <button
                  onClick={() => { setSearch(""); setCategory(""); setContentType(""); }}
                  style={{
                    marginTop: 20, padding: "10px 22px", borderRadius: 8,
                    background: INK, border: `2px solid ${INK}`, boxShadow: `3px 3px 0 ${BRAND}`,
                    color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((c, i) => (
                <CourseCard key={c._id} course={c} delay={Math.min(i * 0.04, 0.28)} ctaHref={ctaHref} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      {!isLoggedIn && (
        <section style={{ background: "#fff", borderTop: `2px solid ${INK}`, borderBottom: `2px solid ${INK}` }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                background: INK, borderRadius: 16,
                border: `2px solid ${INK}`, boxShadow: `6px 6px 0 ${BRAND}`,
                padding: "28px 36px",
                display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20,
              }}
            >
              <div>
                <p style={{ color: "#fff", fontWeight: 900, fontSize: 22, margin: 0, letterSpacing: "-0.03em" }}>
                  Full access — sign in once, learn forever.
                </p>
                <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 6, fontWeight: 400 }}>
                  Track progress, earn certificates, and unlock every premium course.
                </p>
              </div>
              <Link
                href="/login?redirect=/dashboard/content"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "13px 28px", borderRadius: 8, flexShrink: 0,
                  background: "#fff", border: `2px solid #94a3b8`,
                  color: INK, fontWeight: 800, fontSize: 14, textDecoration: "none",
                  transition: "transform 0.12s, box-shadow 0.12s",
                }}
                className="hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                Sign in to get started <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      <StandardFooter />
    </div>
  );
}