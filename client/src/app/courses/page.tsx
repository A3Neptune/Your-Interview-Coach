"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen, Clock, Star, Lock, ArrowRight,
  Search, X, Play, CheckCircle, Users, PlayCircle,
  ChevronLeft, ChevronRight, Sparkles, GraduationCap,
  Zap, Tag, TrendingUp, Target, Shield,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";
import { useAuth } from "@/context/AuthContext";
import { getAuthToken } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/* ─── site palette (matches globals.css + HeroSection) ─── */
const BRAND      = "#2563eb";
const BRAND_DEEP = "#1d4ed8";
const PAPER      = "#F8F6F1";
const INK        = "#0f172a";
const MUTED      = "#64748b";
const MUTED_LT   = "#94a3b8";
const GREEN      = "#059669";
const BORDER     = "rgba(59,130,246,0.15)";

/* ─── types ─── */
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
  bestseller?: boolean;
  highestRated?: boolean;
  isNew?: boolean;
  comingSoon?: boolean;
}

/* ─── category data ─── */
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

const CAT_TABS = [
  { value: "", label: "All" },
  { value: "mock-interview",  label: "Mock Interview" },
  { value: "resume-building", label: "Resume" },
  { value: "gd-practice",     label: "Group Discussion" },
  { value: "placement-prep",  label: "Placement" },
  { value: "coding",          label: "Coding" },
  { value: "system-design",   label: "System Design" },
  { value: "behavioral",      label: "Behavioral" },
  { value: "career-growth",   label: "Career Growth" },
  { value: "skills",          label: "Skills" },
];

const CAT_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  "mock-interview":  { bg: "rgba(234,179,8,0.08)",   text: "#92400e", border: "rgba(234,179,8,0.2)" },
  "resume-building": { bg: "rgba(37,99,235,0.07)",   text: "#1e40af", border: "rgba(37,99,235,0.18)" },
  "gd-practice":     { bg: "rgba(5,150,105,0.07)",   text: "#065f46", border: "rgba(5,150,105,0.18)" },
  "placement-prep":  { bg: "rgba(236,72,153,0.07)",  text: "#9d174d", border: "rgba(236,72,153,0.18)" },
  "coding":          { bg: "rgba(124,58,237,0.07)",  text: "#5b21b6", border: "rgba(124,58,237,0.18)" },
  "system-design":   { bg: "rgba(249,115,22,0.08)",  text: "#9a3412", border: "rgba(249,115,22,0.2)" },
  "behavioral":      { bg: "rgba(139,92,246,0.07)",  text: "#6b21a8", border: "rgba(139,92,246,0.18)" },
  "career-growth":   { bg: "rgba(8,145,178,0.07)",   text: "#0e7490", border: "rgba(8,145,178,0.18)" },
  "skills":          { bg: "rgba(239,68,68,0.07)",   text: "#991b1b", border: "rgba(239,68,68,0.18)" },
  "other":           { bg: "rgba(100,116,139,0.07)", text: "#475569", border: "rgba(100,116,139,0.18)" },
};

const DIFF_COLOR: Record<string, string> = {
  beginner: "#10b981", intermediate: "#2563eb", advanced: "#f97316", expert: "#ef4444",
};

/* ─── coming-soon dummy courses ─── */
const COMING_SOON: Course[] = [
  {
    _id: "cs-1", comingSoon: true,
    title: "System Design Interview Bootcamp",
    shortDescription: "Master load balancing, caching, databases & microservices through real-world case studies.",
    contentType: "paid", category: "system-design", difficulty: "advanced",
    price: 4999, discount: { type: "percentage", value: 74, isActive: true },
    totalDuration: 1240, certificateEnabled: true,
    analytics: { enrollments: 0, averageRating: 0 },
    mentorId: { name: "Rahul Sharma", designation: "Staff Engineer", company: "Google" },
    totalLectures: 142,
    modules: [{ title: "A" }, { title: "B" }, { title: "C" }, { title: "D" }, { title: "E" }],
  },
  {
    _id: "cs-2", comingSoon: true,
    title: "DSA — Cracking Coding Interviews",
    shortDescription: "500+ problems covering arrays, trees, graphs, dynamic programming and greedy algorithms.",
    contentType: "paid", category: "coding", difficulty: "intermediate",
    price: 3999, discount: { type: "percentage", value: 75, isActive: true },
    totalDuration: 980, certificateEnabled: true,
    analytics: { enrollments: 0, averageRating: 0 },
    mentorId: { name: "Priya Patel", designation: "Senior SDE", company: "Amazon" },
    totalLectures: 210,
    modules: [{ title: "A" }, { title: "B" }, { title: "C" }, { title: "D" }],
  },
  {
    _id: "cs-3", comingSoon: true,
    title: "Behavioral Interview Mastery — STAR Method",
    shortDescription: "50+ real interview scenarios with expert feedback using the STAR framework.",
    contentType: "free", category: "behavioral", difficulty: "beginner",
    price: 0,
    totalDuration: 320, certificateEnabled: true,
    analytics: { enrollments: 0, averageRating: 0 },
    mentorId: { name: "Ananya Gupta", designation: "HR Director", company: "Microsoft" },
    totalLectures: 45,
    modules: [{ title: "A" }, { title: "B" }, { title: "C" }],
  },
  {
    _id: "cs-4", comingSoon: true,
    title: "Resume Masterclass — From Zero to Hired",
    shortDescription: "Build ATS-friendly resumes with templates, keyword optimisation and recruiter insights.",
    contentType: "free", category: "resume-building", difficulty: "beginner",
    price: 0,
    totalDuration: 180,
    analytics: { enrollments: 0, averageRating: 0 },
    mentorId: { name: "Vikram Rao", designation: "Talent Acquisition Lead", company: "Flipkart" },
    totalLectures: 28,
    modules: [{ title: "A" }, { title: "B" }, { title: "C" }],
  },
  {
    _id: "cs-5", comingSoon: true, highestRated: true,
    title: "FAANG Mock Interview Series",
    shortDescription: "Live mock interviews with ex-FAANG engineers. Detailed feedback on approach & communication.",
    contentType: "paid", category: "mock-interview", difficulty: "advanced",
    price: 5999, discount: { type: "percentage", value: 67, isActive: true },
    totalDuration: 560, certificateEnabled: true,
    analytics: { enrollments: 0, averageRating: 0 },
    mentorId: { name: "Arjun Mehta", designation: "Ex-Principal Engineer", company: "Meta" },
    totalLectures: 35,
    modules: [{ title: "A" }, { title: "B" }, { title: "C" }],
  },
  {
    _id: "cs-6", comingSoon: true,
    title: "Group Discussion & Communication Workshop",
    shortDescription: "Dominate GD rounds with structured thinking, confident speaking and group dynamics.",
    contentType: "free", category: "gd-practice", difficulty: "beginner",
    price: 0,
    analytics: { enrollments: 0, averageRating: 0 },
    mentorId: { name: "Neha Singh", designation: "Communication Coach", company: "TCS" },
    totalLectures: 32,
    modules: [{ title: "A" }, { title: "B" }, { title: "C" }],
  },
  {
    _id: "cs-7", comingSoon: true, bestseller: true,
    title: "Complete Placement Prep — Campus to Corporate",
    shortDescription: "Aptitude, technical, HR rounds and offer negotiation all in one structured course.",
    contentType: "paid", category: "placement-prep", difficulty: "intermediate",
    price: 2999, discount: { type: "percentage", value: 73, isActive: true },
    totalDuration: 720, certificateEnabled: true,
    analytics: { enrollments: 0, averageRating: 0 },
    mentorId: { name: "Karan Malhotra", designation: "Placement Officer", company: "IIT Bombay" },
    totalLectures: 95,
    modules: [{ title: "A" }, { title: "B" }, { title: "C" }, { title: "D" }],
  },
  {
    _id: "cs-8", comingSoon: true, isNew: true,
    title: "Career Growth — From IC to Engineering Manager",
    shortDescription: "Transition to management: people skills, strategy and stakeholder communication.",
    contentType: "paid", category: "career-growth", difficulty: "expert",
    price: 4499, discount: { type: "percentage", value: 67, isActive: true },
    totalDuration: 480,
    analytics: { enrollments: 0, averageRating: 0 },
    mentorId: { name: "Sneha Iyer", designation: "Engineering Manager", company: "Uber" },
    totalLectures: 58,
    modules: [{ title: "A" }, { title: "B" }, { title: "C" }],
  },
];

/* ─── helpers ─── */
function fmtDuration(mins: number) {
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}
function fmtNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return String(n);
}
function calcPrice(course: Course) {
  const isPaid = course.contentType === "paid" || course.contentType === "exclusive";
  const hasDiscount = isPaid && course.discount?.isActive && course.discount.type !== "none" && (course.discount.value ?? 0) > 0;
  const discAmt = hasDiscount
    ? course.discount!.type === "percentage"
      ? Math.round(((course.price ?? 0) * course.discount!.value) / 100)
      : course.discount!.value
    : 0;
  return { isPaid, hasDiscount, discAmt, effective: hasDiscount ? Math.max(0, (course.price ?? 0) - discAmt) : (course.price ?? 0) };
}

/* ══════════════════════════════════════════════════
   COURSE CARD
══════════════════════════════════════════════════ */
function CourseCard({ course, isLoggedIn }: { course: Course; isLoggedIn: boolean }) {
  const isEnrolled = !!course.enrollment;
  const pct = course.enrollment?.progress ?? 0;
  const { isPaid, hasDiscount, discAmt, effective } = calcPrice(course);
  const cat = CAT_COLOR[course.category] ?? CAT_COLOR.other;
  const moduleCount = course.modules?.length ?? 0;

  const previewHref = course.comingSoon ? "#" : `/courses/${course._id}`;
  const enrollHref  = course.comingSoon ? "#"
    : isEnrolled ? `/dashboard/content/${course._id}`
    : isLoggedIn
      ? isPaid ? `/dashboard/checkout/${course._id}` : `/dashboard/content/${course._id}`
      : isPaid ? `/login?redirect=/dashboard/checkout/${course._id}` : `/login?redirect=/dashboard/content/${course._id}`;

  return (
    <div
      style={{
        display: "flex", flexDirection: "column", height: "100%",
        background: "#fff",
        border: `1.5px solid ${BORDER}`,
        borderRadius: 16,
        overflow: "hidden",
        transition: "box-shadow 0.22s, transform 0.22s, border-color 0.22s",
        cursor: course.comingSoon ? "default" : "pointer",
        boxShadow: "0 2px 12px rgba(37,99,235,0.06)",
      }}
      onMouseEnter={e => {
        if (course.comingSoon) return;
        Object.assign((e.currentTarget as HTMLDivElement).style, {
          boxShadow: "0 12px 36px rgba(37,99,235,0.14)",
          transform: "translateY(-3px)",
          borderColor: "rgba(37,99,235,0.32)",
        });
      }}
      onMouseLeave={e => {
        Object.assign((e.currentTarget as HTMLDivElement).style, {
          boxShadow: "0 2px 12px rgba(37,99,235,0.06)",
          transform: "",
          borderColor: BORDER,
        });
      }}
    >
      {/* ── thumbnail ── */}
      <div style={{ position: "relative", paddingTop: "56.25%", background: `linear-gradient(135deg,${INK},${BRAND_DEEP})`, flexShrink: 0 }}>
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            background: `linear-gradient(135deg,${INK} 0%,${BRAND_DEEP} 100%)` }}>
            <BookOpen style={{ width: 38, height: 38, color: "rgba(255,255,255,0.15)" }} />
          </div>
        )}

        {/* coming-soon dim */}
        {course.comingSoon && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.68)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ display: "inline-block", background: "#fbbf24", color: "#78350f",
                fontSize: 10.5, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
                padding: "5px 14px", borderRadius: 99, marginBottom: 7 }}>
                Coming Soon
              </span>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, margin: 0 }}>Launching soon · Stay tuned</p>
            </div>
          </div>
        )}

        {/* badges top-left */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 4, zIndex: 2 }}>
          {course.bestseller  && !course.comingSoon && <Badge bg="#fbbf24" text="#78350f">Bestseller</Badge>}
          {course.highestRated && !course.comingSoon && <Badge bg="#f97316" text="#fff">Highest Rated</Badge>}
          {course.isNew       && !course.comingSoon && <Badge bg="#10b981" text="#fff">New</Badge>}
          {isEnrolled                                && <Badge bg={GREEN}   text="#fff">Enrolled</Badge>}
        </div>

        {/* free badge top-right */}
        {!isPaid && !course.comingSoon && (
          <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}>
            <Badge bg={GREEN} text="#fff">Free</Badge>
          </div>
        )}

        {/* blue accent bar at bottom of thumbnail */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg,${BRAND},${BRAND_DEEP}88,transparent)` }} />
      </div>

      {/* ── body ── */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "16px 16px 18px" }}>

        {/* category chip */}
        <span style={{
          alignSelf: "flex-start", fontSize: 10, fontWeight: 700,
          padding: "3px 9px", borderRadius: 99,
          background: cat.bg, color: cat.text, border: `1px solid ${cat.border}`,
          letterSpacing: "0.04em", marginBottom: 10,
        }}>
          {CAT_LABEL[course.category] ?? course.category}
        </span>

        {/* title */}
        <h3 style={{
          fontSize: 15, fontWeight: 700, lineHeight: 1.38, color: INK,
          margin: "0 0 7px", letterSpacing: "-0.01em",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          minHeight: 41,
        }}>{course.title}</h3>

        {/* description */}
        {course.shortDescription && (
          <p style={{
            fontSize: 12.5, color: MUTED, margin: "0 0 10px", lineHeight: 1.6,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{course.shortDescription}</p>
        )}

        {/* instructor */}
        <p style={{ fontSize: 12, color: MUTED, margin: "0 0 10px", fontWeight: 500 }}>
          <span style={{ fontWeight: 600, color: INK }}>{course.mentorId.name}</span>
          {course.mentorId.company && <span style={{ color: MUTED_LT }}> · {course.mentorId.company}</span>}
        </p>

        {/* rating */}
        {(course.analytics?.averageRating ?? 0) > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#b45309" }}>
              {course.analytics!.averageRating.toFixed(1)}
            </span>
            <div style={{ display: "flex", gap: 1 }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} style={{ width: 11, height: 11 }}
                  fill={i <= Math.round(course.analytics!.averageRating) ? "#f59e0b" : "rgba(37,99,235,0.1)"}
                  color={i <= Math.round(course.analytics!.averageRating) ? "#f59e0b" : "rgba(37,99,235,0.2)"}
                />
              ))}
            </div>
            <span style={{ fontSize: 11, color: MUTED_LT }}>({fmtNum(course.analytics!.enrollments)})</span>
          </div>
        )}

        {/* meta row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          {(course.totalDuration ?? 0) > 0 && (
            <MetaChip icon={<Clock style={{ width: 10, height: 10 }} />}>
              {fmtDuration(course.totalDuration!)}
            </MetaChip>
          )}
          {moduleCount > 0 && (
            <MetaChip icon={<BookOpen style={{ width: 10, height: 10 }} />}>
              {moduleCount} module{moduleCount !== 1 ? "s" : ""}
            </MetaChip>
          )}
          {course.difficulty && (
            <MetaChip icon={<span style={{ width: 6, height: 6, borderRadius: "50%", background: DIFF_COLOR[course.difficulty] ?? MUTED, display: "inline-block", flexShrink: 0 }} />}>
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </MetaChip>
          )}
        </div>

        {/* ── price + actions ── */}
        <div style={{ marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>

          {/* enrolled progress */}
          {isEnrolled && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>
                  {pct >= 100 ? "Completed ✓" : pct > 0 ? `${pct}% complete` : "Enrolled"}
                </span>
              </div>
              {pct > 0 && pct < 100 && (
                <div style={{ height: 4, borderRadius: 99, background: "rgba(37,99,235,0.1)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99,
                    background: `linear-gradient(90deg,${BRAND},${BRAND_DEEP})` }} />
                </div>
              )}
            </div>
          )}

          {/* price */}
          {!isEnrolled && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              {isPaid && (course.price ?? 0) > 0 ? (
                <>
                  <span style={{ fontSize: 18, fontWeight: 800, color: INK, letterSpacing: "-0.02em" }}>
                    ₹{effective.toLocaleString("en-IN")}
                  </span>
                  {hasDiscount && (
                    <>
                      <span style={{ fontSize: 12.5, color: MUTED_LT, textDecoration: "line-through" }}>
                        ₹{course.price?.toLocaleString("en-IN")}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(220,38,38,0.1)",
                        color: "#dc2626", border: "1px solid rgba(220,38,38,0.2)",
                        padding: "2px 7px", borderRadius: 99 }}>
                        {course.discount!.type === "percentage" ? `${course.discount!.value}% OFF` : `₹${course.discount!.value} OFF`}
                      </span>
                    </>
                  )}
                  <span style={{ fontSize: 10.5, color: MUTED_LT }}>excl. GST</span>
                </>
              ) : (
                <span style={{ fontSize: 18, fontWeight: 800, color: GREEN }}>Free</span>
              )}
            </div>
          )}

          {/* CTA buttons */}
          {course.comingSoon ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8,
              padding: "10px 14px", borderRadius: 10,
              background: "rgba(37,99,235,0.04)", border: `1px dashed ${BORDER}` }}>
              <Zap style={{ width: 13, height: 13, color: BRAND, flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: MUTED }}>Launching soon — stay tuned</span>
            </div>
          ) : isEnrolled ? (
            <Link href={enrollHref} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "10px 0", borderRadius: 10,
              background: `linear-gradient(135deg,${GREEN},#047857)`,
              color: "#fff", fontWeight: 700, fontSize: 13.5, textDecoration: "none",
              boxShadow: "0 4px 14px rgba(5,150,105,0.28)",
            }}>
              <Play style={{ width: 12, height: 12, fill: "#fff" }} />
              {pct >= 100 ? "Review Course" : pct > 0 ? "Continue Learning" : "Start Learning"}
            </Link>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Link href={previewHref} style={{
                flex: 1, padding: "9px 0", borderRadius: 10,
                fontSize: 13, fontWeight: 700, color: BRAND,
                background: "rgba(37,99,235,0.06)", border: `1.5px solid rgba(37,99,235,0.22)`,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                textDecoration: "none",
                transition: "background 0.18s",
              }}>
                <Play style={{ width: 11, height: 11, fill: BRAND }} /> Preview
              </Link>
              <Link href={enrollHref} style={{
                flex: 1.4, padding: "9px 0", borderRadius: 10,
                fontSize: 13, fontWeight: 700, color: "#fff",
                background: isPaid
                  ? `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`
                  : `linear-gradient(135deg,${GREEN},#047857)`,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                textDecoration: "none",
                boxShadow: isPaid ? "0 4px 14px rgba(37,99,235,0.28)" : "0 4px 14px rgba(5,150,105,0.28)",
              }}>
                {isPaid
                  ? <><Lock style={{ width: 11, height: 11 }} /> Enroll Now</>
                  : <><Play style={{ width: 11, height: 11, fill: "#fff" }} /> Enroll Free</>}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── tiny helpers ── */
function Badge({ bg, text, children }: { bg: string; text: string; children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
      padding: "3px 8px", borderRadius: 4, background: bg, color: text }}>
      {children}
    </span>
  );
}
function MetaChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: MUTED, fontWeight: 500 }}>
      {icon}{children}
    </span>
  );
}

/* ══════════════════════════════════════════════════
   SKELETON
══════════════════════════════════════════════════ */
function Skeleton() {
  return (
    <div style={{ background: "#fff", border: `1.5px solid ${BORDER}`, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ paddingTop: "56.25%", background: "rgba(37,99,235,0.05)" }} className="animate-pulse" />
      <div style={{ padding: "16px" }}>
        {[28, 88, 68, 50, 38].map((w, i) => (
          <div key={i} style={{ height: i === 1 || i === 2 ? 13 : 9, width: `${w}%`,
            background: "rgba(37,99,235,0.08)", borderRadius: 6, marginBottom: 10 }} className="animate-pulse" />
        ))}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, height: 38, background: "rgba(37,99,235,0.06)", borderRadius: 10 }} className="animate-pulse" />
          <div style={{ flex: 1.4, height: 38, background: "rgba(37,99,235,0.12)", borderRadius: 10 }} className="animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   HERO FEATURED CARD
══════════════════════════════════════════════════ */
function HeroFeaturedCard({ course, loading, isLoggedIn }: { course: Course | null; loading: boolean; isLoggedIn: boolean }) {
  if (loading) {
    return (
      <div style={{ background: "#fff", borderRadius: 20, border: `1.5px solid ${BORDER}`,
        boxShadow: "0 8px 40px rgba(37,99,235,0.12)", overflow: "hidden" }}>
        <div style={{ paddingTop: "52%", background: "rgba(37,99,235,0.05)" }} className="animate-pulse" />
        <div style={{ padding: 20 }}>
          {[60, 90, 70, 50].map((w, i) => (
            <div key={i} style={{ height: i === 1 ? 14 : 9, width: `${w}%`,
              background: "rgba(37,99,235,0.08)", borderRadius: 6, marginBottom: 12 }} className="animate-pulse" />
          ))}
          <div style={{ height: 44, background: "rgba(37,99,235,0.1)", borderRadius: 12 }} className="animate-pulse" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ background: "#fff", borderRadius: 20, border: `1.5px dashed ${BORDER}`,
        padding: 32, textAlign: "center", minHeight: 280, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 10 }}>
        <Sparkles style={{ width: 32, height: 32, color: "rgba(37,99,235,0.2)" }} />
        <p style={{ fontSize: 14, color: MUTED_LT, fontWeight: 500, margin: 0 }}>Courses launching soon</p>
      </div>
    );
  }

  const { isPaid, hasDiscount, discAmt, effective } = calcPrice(course);
  const isEnrolled = !!course.enrollment;
  const moduleCount = course.modules?.length ?? 0;
  const cat = CAT_COLOR[course.category] ?? CAT_COLOR.other;

  const enrollHref = isEnrolled
    ? `/dashboard/content/${course._id}`
    : isLoggedIn
      ? isPaid ? `/dashboard/checkout/${course._id}` : `/dashboard/content/${course._id}`
      : isPaid ? `/login?redirect=/dashboard/checkout/${course._id}` : `/login?redirect=/dashboard/content/${course._id}`;

  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      border: `1.5px solid rgba(37,99,235,0.2)`,
      boxShadow: "0 8px 40px rgba(37,99,235,0.13), 0 2px 12px rgba(37,99,235,0.07)",
      overflow: "hidden", position: "relative",
    }}>
      {/* "Featured" ribbon */}
      <div style={{
        position: "absolute", top: 14, left: -1, zIndex: 10,
        background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
        color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
        textTransform: "uppercase", padding: "5px 14px 5px 12px",
        borderRadius: "0 6px 6px 0",
        boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
      }}>
        ★ Featured Course
      </div>

      {/* thumbnail */}
      <div style={{ position: "relative", paddingTop: "52%", background: `linear-gradient(135deg,${INK},${BRAND_DEEP})` }}>
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            background: `linear-gradient(135deg,${INK} 0%,${BRAND_DEEP} 100%)` }}>
            <BookOpen style={{ width: 48, height: 48, color: "rgba(255,255,255,0.12)" }} />
          </div>
        )}
        <div style={{ position: "absolute", inset: 0,
          background: "linear-gradient(to top,rgba(15,23,42,0.55) 0%,transparent 55%)" }} />
        {/* price badge over thumbnail */}
        {isPaid && (course.price ?? 0) > 0 && (
          <div style={{ position: "absolute", bottom: 12, right: 12,
            background: "rgba(15,23,42,0.85)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10,
            padding: "6px 12px", display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
              ₹{effective.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textDecoration: "line-through" }}>
                ₹{course.price?.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        )}
        {!isPaid && (
          <div style={{ position: "absolute", bottom: 12, right: 12,
            background: GREEN, borderRadius: 8, padding: "5px 12px" }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Free</span>
          </div>
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg,${BRAND},${BRAND_DEEP}88,transparent)` }} />
      </div>

      {/* body */}
      <div style={{ padding: "18px 20px 20px" }}>
        {/* category */}
        <span style={{
          display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
          padding: "3px 9px", borderRadius: 99, marginBottom: 10,
          background: cat.bg, color: cat.text, border: `1px solid ${cat.border}`,
        }}>
          {CAT_LABEL[course.category] ?? course.category}
        </span>

        <h3 style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.32, color: INK,
          margin: "0 0 8px", letterSpacing: "-0.02em",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {course.title}
        </h3>

        {course.shortDescription && (
          <p style={{ fontSize: 13, color: MUTED, margin: "0 0 12px", lineHeight: 1.55,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {course.shortDescription}
          </p>
        )}

        {/* instructor + meta row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 14, flexWrap: "wrap", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: INK }}>
            {course.mentorId.name}
            {course.mentorId.company && <span style={{ color: MUTED_LT, fontWeight: 400 }}> · {course.mentorId.company}</span>}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            {(course.totalDuration ?? 0) > 0 && (
              <MetaChip icon={<Clock style={{ width: 10, height: 10 }} />}>{fmtDuration(course.totalDuration!)}</MetaChip>
            )}
            {moduleCount > 0 && (
              <MetaChip icon={<BookOpen style={{ width: 10, height: 10 }} />}>{moduleCount} modules</MetaChip>
            )}
          </div>
        </div>

        {/* discount badge */}
        {hasDiscount && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
            padding: "8px 12px", borderRadius: 10, background: "rgba(5,150,105,0.06)",
            border: "1px solid rgba(5,150,105,0.15)" }}>
            <Tag style={{ width: 13, height: 13, color: GREEN, flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: GREEN }}>
              Save ₹{discAmt.toLocaleString("en-IN")} —&nbsp;
              {course.discount!.type === "percentage" ? `${course.discount!.value}% off` : `₹${course.discount!.value} off`}
            </span>
          </div>
        )}

        {/* CTA */}
        <div style={{ display: "flex", gap: 8 }}>
          <Link href={`/courses/${course._id}`} style={{
            flex: 1, padding: "11px 0", borderRadius: 12,
            fontSize: 14, fontWeight: 700, color: BRAND,
            background: "rgba(37,99,235,0.06)", border: `1.5px solid rgba(37,99,235,0.22)`,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            textDecoration: "none",
          }}>
            <Play style={{ width: 12, height: 12, fill: BRAND }} /> Preview
          </Link>
          <Link href={enrollHref} style={{
            flex: 1.5, padding: "11px 0", borderRadius: 12,
            fontSize: 14, fontWeight: 700, color: "#fff",
            background: isEnrolled
              ? `linear-gradient(135deg,${GREEN},#047857)`
              : isPaid
                ? `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`
                : `linear-gradient(135deg,${GREEN},#047857)`,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            textDecoration: "none",
            boxShadow: isEnrolled || !isPaid
              ? "0 4px 14px rgba(5,150,105,0.3)"
              : "0 4px 14px rgba(37,99,235,0.32)",
          }}>
            {isEnrolled
              ? <><Play style={{ width: 12, height: 12, fill: "#fff" }} /> Continue</>
              : isPaid
                ? <><Lock style={{ width: 12, height: 12 }} /> Enroll Now</>
                : <><Play style={{ width: 12, height: 12, fill: "#fff" }} /> Enroll Free</>}
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SCROLLABLE ROW
══════════════════════════════════════════════════ */
function CourseRow({
  title, subtitle, badge, courses, isLoggedIn, loading,
}: {
  title: string; subtitle?: string; badge?: React.ReactNode;
  courses: Course[]; isLoggedIn: boolean; loading: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [canL, setL] = useState(false);
  const [canR, setR] = useState(false);

  const sync = () => {
    const el = ref.current; if (!el) return;
    setL(el.scrollLeft > 4);
    setR(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    sync();
    return () => { el.removeEventListener("scroll", sync); ro.disconnect(); };
  }, [courses]);

  const scroll = (dir: number) => {
    const el = ref.current; if (!el) return;
    el.scrollBy({ left: dir * 310, behavior: "smooth" });
  };

  return (
    <div style={{ marginBottom: 60 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22, gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <h2 style={{ fontSize: "clamp(18px,2.2vw,24px)", fontWeight: 800, color: INK,
              letterSpacing: "-0.03em", margin: 0, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              {title}
            </h2>
            {badge}
          </div>
          {subtitle && <p style={{ fontSize: 13.5, color: MUTED, margin: 0, fontWeight: 400 }}>{subtitle}</p>}
        </div>
        {courses.length > 3 && (
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {([[-1, canL],[1, canR]] as [number,boolean][]).map(([d, can]) => (
              <button key={d} onClick={() => scroll(d)} disabled={!can} style={{
                width: 36, height: 36, borderRadius: "50%",
                border: `1.5px solid ${can ? "rgba(37,99,235,0.25)" : BORDER}`,
                background: can ? "#fff" : "rgba(248,246,241,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: can ? "pointer" : "not-allowed", opacity: can ? 1 : 0.35,
                transition: "all 0.2s",
                boxShadow: can ? "0 2px 8px rgba(37,99,235,0.1)" : "none",
              }}>
                {d < 0 ? <ChevronLeft style={{ width: 16, height: 16, color: INK }} /> : <ChevronRight style={{ width: 16, height: 16, color: INK }} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 18 }}>
          {[...Array(4)].map((_,i) => <Skeleton key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <div style={{ padding: "48px 24px", textAlign: "center",
          background: "#fff", borderRadius: 16, border: `1.5px dashed ${BORDER}` }}>
          <BookOpen style={{ width: 36, height: 36, color: "rgba(37,99,235,0.18)", margin: "0 auto 10px" }} />
          <p style={{ color: MUTED_LT, fontSize: 13, fontWeight: 500, margin: 0 }}>No courses yet</p>
        </div>
      ) : (
        <div ref={ref} className="courses-scroll"
          style={{ display: "flex", gap: 18, overflowX: "auto", paddingBottom: 6 }}>
          {courses.map(c => (
            <div key={c._id} style={{ flex: "0 0 clamp(250px,23vw,290px)" }}>
              <CourseCard course={c} isLoggedIn={isLoggedIn} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════ */
export default function CoursesPage() {
  const { isLoggedIn } = useAuth();
  const [liveCourses, setLive] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [cat, setCat]         = useState("");
  const [type, setType]       = useState<"" | "free" | "paid">("");

  /* ── fetch ── */
  useEffect(() => {
    const token = getAuthToken();
    const pub = fetch(`${API_URL}/advanced/courses/public?limit=100&sortBy=createdAt&sortOrder=desc`).then(r => r.json());
    const enr = token
      ? fetch(`${API_URL}/enrollments/my-enrollments`, { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.json()).catch(() => ({ success: false }))
      : Promise.resolve({ success: false });

    Promise.all([pub, enr]).then(([pd, ed]) => {
      let list: Course[] = pd.success ? pd.data.courses ?? [] : [];
      if (ed.success && Array.isArray(ed.data)) {
        const map = new Map<string, { progress: number }>();
        ed.data.forEach((e: any) => { const id = e.courseId?._id ?? e.courseId; if (id) map.set(id, { progress: e.progress ?? 0 }); });
        list = list.map(c => map.has(c._id) ? { ...c, enrollment: map.get(c._id) } : c);
      }
      setLive(list);
    }).catch(() => setLive([])).finally(() => setLoading(false));
  }, [isLoggedIn]);

  /* ── filter ── */
  const all = [...liveCourses, ...COMING_SOON];
  const filtered = all.filter(c => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!c.title.toLowerCase().includes(q) &&
          !(c.shortDescription ?? "").toLowerCase().includes(q) &&
          !c.mentorId.name.toLowerCase().includes(q)) return false;
    }
    if (cat  && c.category !== cat) return false;
    if (type === "free" && c.contentType !== "free")  return false;
    if (type === "paid" && c.contentType === "free")  return false;
    return true;
  });

  const hasFilter   = !!(search || cat || type);
  const enrolled    = liveCourses.filter(c => !!c.enrollment);
  const liveVisible = filtered.filter(c => !c.comingSoon);
  const soonVisible = filtered.filter(c => !!c.comingSoon);
  const totalStudents = all.reduce((s, c) => s + (c.analytics?.enrollments ?? 0), 0);
  const freeCount   = all.filter(c => c.contentType === "free").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        .courses-scroll { scrollbar-width:none; -ms-overflow-style:none; }
        .courses-scroll::-webkit-scrollbar { display:none; }
        .cat-pill { border:none; font-family:'DM Sans',system-ui,sans-serif; cursor:pointer; transition:all 0.18s; white-space:nowrap; }
        .type-pill { border:none; font-family:'DM Sans',system-ui,sans-serif; cursor:pointer; transition:all 0.18s; }
        .search-input:focus { outline:none; border-color:${BRAND} !important; box-shadow:0 0 0 3px rgba(37,99,235,0.14) !important; }
        .cat-tabs { scrollbar-width:none; -ms-overflow-style:none; }
        .cat-tabs::-webkit-scrollbar { display:none; }
        /* responsive hero grid */
        .hero-grid { grid-template-columns: minmax(0,1fr) minmax(0,420px) !important; }
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-card-wrap { display: none !important; }
        }
        /* sticky filter sits below navbar */
        .filter-bar-sticky {
          position: sticky;
          top: var(--yic-header-h, 64px);
          z-index: 30;
        }
      `}</style>

      <div style={{ background: PAPER, minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <Navbar />

        {/* ════════════════════════════════════
            HERO — cream + brand, matches site
        ════════════════════════════════════ */}
        <section style={{
          background: PAPER,
          paddingTop: "calc(var(--yic-header-h, 64px) + 56px)",
          paddingBottom: 60,
          position: "relative", overflow: "hidden",
        }}>
          {/* site's bg-grid-pattern */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.07) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(59,130,246,0.07) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center,black 40%,transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse at center,black 40%,transparent 85%)",
          }} />
          <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 520, height: 520, borderRadius: "50%",
            background: "radial-gradient(circle,rgba(37,99,235,0.08) 0%,transparent 70%)", filter: "blur(90px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-5%", left: "3%", width: 360, height: 360, borderRadius: "50%",
            background: "radial-gradient(circle,rgba(8,145,178,0.06) 0%,transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) minmax(0,420px)",
              gap: "clamp(32px,5vw,72px)",
              alignItems: "center",
            }}
            className="hero-grid">

              {/* ── LEFT: copy ── */}
              <div>
                <div className="section-badge" style={{ marginBottom: 20 }}>
                  <span className="section-badge-dot" />
                  <span className="section-badge-text">Course Library</span>
                </div>

                <h1 style={{
                  margin: "0 0 18px",
                  fontSize: "clamp(30px,4.2vw,56px)",
                  fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.04em",
                  color: INK, fontFamily: "'DM Sans', system-ui, sans-serif",
                }}>
                  Learn from the best,{" "}
                  <span style={{ position: "relative", display: "inline-block" }}>
                    <span className="text-gradient">land your dream job.</span>
                    <span style={{
                      position: "absolute", left: 0, right: 0, bottom: -3, height: 3,
                      background: `linear-gradient(90deg,${BRAND},${BRAND_DEEP})`, borderRadius: 2,
                    }} />
                  </span>
                </h1>

                <p style={{
                  fontSize: "clamp(14px,1.2vw,16px)", color: MUTED,
                  lineHeight: 1.7, marginBottom: 28, fontWeight: 400,
                }}>
                  Expert-crafted courses for every stage — mock interviews, resume, group discussions,
                  coding, system design &amp; more.{!isLoggedIn && " Sign in to track progress."}
                </p>

                {/* stats row */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 30 }}>
                  {[
                    { icon: <BookOpen style={{ width: 13, height: 13, color: BRAND }} />, val: `${all.length}`, label: "Courses" },
                    { icon: <Users style={{ width: 13, height: 13, color: BRAND }} />, val: totalStudents > 0 ? `${fmtNum(totalStudents)}+` : "50K+", label: "Students" },
                    { icon: <GraduationCap style={{ width: 13, height: 13, color: BRAND }} />, val: `${freeCount}`, label: "Free" },
                    { icon: <Star style={{ width: 13, height: 13, color: "#f59e0b", fill: "#f59e0b" }} />, val: "4.8", label: "Rating" },
                  ].map(s => (
                    <div key={s.label} style={{
                      display: "flex", alignItems: "center", gap: 7,
                      background: "#fff", padding: "7px 14px", borderRadius: 99,
                      border: `1px solid ${BORDER}`, boxShadow: "0 2px 10px rgba(37,99,235,0.07)",
                    }}>
                      {s.icon}
                      <span style={{ fontSize: 14, fontWeight: 800, color: INK }}>{s.val}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 500, color: MUTED_LT, textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link
                    href={isLoggedIn ? "/dashboard/content" : "/login?redirect=/dashboard/content"}
                    className="btn-primary"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none", color: "#fff" }}
                  >
                    {isLoggedIn ? "Go to My Learning" : "Get Started Free"}
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </Link>
                  <Link href="#all-courses" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                    Browse All
                  </Link>
                </div>
              </div>

              {/* ── RIGHT: featured course card ── */}
              <div className="hero-card-wrap">
                <HeroFeaturedCard course={liveCourses[0] ?? null} loading={loading} isLoggedIn={isLoggedIn} />
              </div>

            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            TRUST STRIP — glass card, site style
        ════════════════════════════════════ */}
        <div style={{ background: "#fff", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "13px 0" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
              gap: "clamp(18px,3.5vw,52px)", flexWrap: "wrap" }}>
              {[
                { icon: <Shield     style={{ width: 16, height: 16, color: BRAND }} />, label: "Lifetime Access" },
                { icon: <PlayCircle style={{ width: 16, height: 16, color: BRAND }} />, label: "HD Video Content" },
                { icon: <CheckCircle style={{ width: 16, height: 16, color: GREEN }} />, label: "Expert Instructors" },
                { icon: <TrendingUp style={{ width: 16, height: 16, color: BRAND }} />, label: "Track Your Progress" },
                { icon: <Target     style={{ width: 16, height: 16, color: BRAND }} />, label: "Interview Ready" },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  {icon}
                  <span style={{ fontSize: 13, fontWeight: 600, color: INK, whiteSpace: "nowrap" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════
            STICKY FILTER BAR
        ════════════════════════════════════ */}
        <div className="filter-bar-sticky" style={{
          background: "rgba(248,246,241,0.95)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid ${BORDER}`,
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* row 1: search + type + clear */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", paddingTop: 10 }}>
              <div style={{ position: "relative", flex: "1 1 180px", maxWidth: 380 }}>
                <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  width: 15, height: 15, color: MUTED_LT, pointerEvents: "none" }} />
                <input type="text" placeholder="Search courses…" value={search}
                  onChange={e => setSearch(e.target.value)} className="search-input"
                  style={{
                    width: "100%", paddingLeft: 38, paddingRight: search ? 36 : 14,
                    paddingTop: 9, paddingBottom: 9,
                    border: `1.5px solid ${BORDER}`, borderRadius: 10,
                    fontSize: 14, fontFamily: "inherit", color: INK,
                    background: "#fff",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxSizing: "border-box",
                  }} />
                {search && (
                  <button onClick={() => setSearch("")} style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    display: "flex", alignItems: "center",
                  }}>
                    <X style={{ width: 13, height: 13, color: MUTED_LT }} />
                  </button>
                )}
              </div>

              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {(["", "free", "paid"] as const).map(t => (
                  <button key={t} onClick={() => setType(t)} className="type-pill" style={{
                    padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    border: `1.5px solid ${type === t ? BRAND : BORDER}`,
                    background: type === t ? BRAND : "#fff",
                    color: type === t ? "#fff" : INK,
                    boxShadow: type === t ? "0 2px 10px rgba(37,99,235,0.22)" : "none",
                  }}>
                    {t === "" ? "All" : t === "free" ? "Free" : "Paid"}
                  </button>
                ))}
              </div>

              {!loading && (
                <span style={{ fontSize: 12, color: MUTED_LT, marginLeft: "auto", fontWeight: 500, flexShrink: 0 }}>
                  {filtered.length} course{filtered.length !== 1 ? "s" : ""}
                </span>
              )}

              {hasFilter && (
                <button onClick={() => { setSearch(""); setCat(""); setType(""); }} className="type-pill" style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "7px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                  border: "1.5px solid rgba(220,38,38,0.2)", background: "rgba(220,38,38,0.05)", color: "#dc2626",
                }}>
                  <X style={{ width: 11, height: 11 }} /> Clear
                </button>
              )}
            </div>

            {/* row 2: category tabs */}
            <div className="cat-tabs" style={{ display: "flex", gap: 2, overflowX: "auto", padding: "8px 0 9px" }}>
              {CAT_TABS.map(tab => (
                <button key={tab.value} onClick={() => setCat(tab.value)} className="cat-pill" style={{
                  padding: "6px 15px", borderRadius: 99,
                  fontSize: 13, fontWeight: cat === tab.value ? 700 : 500,
                  background: cat === tab.value ? INK : "transparent",
                  color: cat === tab.value ? "#fff" : MUTED,
                }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════
            CONTENT
        ════════════════════════════════════ */}
        <main id="all-courses" className="max-w-7xl mx-auto px-4 sm:px-6"
          style={{ paddingTop: 44, paddingBottom: 64 }}>

          {/* ── Promo banner ── */}
          {!loading && liveCourses.length > 0 && !hasFilter && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 16, flexWrap: "wrap",
              background: `linear-gradient(135deg,${INK} 0%,${BRAND_DEEP} 60%,${INK} 100%)`,
              borderRadius: 16, padding: "20px 28px", marginBottom: 44,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "-40%", right: "5%", width: 260, height: 260, borderRadius: "50%",
                background: "radial-gradient(circle,rgba(37,99,235,0.35) 0%,transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12,
                  background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.5)", flexShrink: 0 }}>
                  <Zap style={{ width: 22, height: 22, color: "#fff" }} />
                </div>
                <div>
                  <p style={{ fontSize: 17, fontWeight: 800, color: "#fff", margin: "0 0 3px", letterSpacing: "-0.02em" }}>
                    Courses starting from <span style={{ color: "#fbbf24" }}>₹499</span>
                  </p>
                  <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, fontWeight: 400 }}>
                    Expert-led interview prep · Enrol today, learn at your own pace
                  </p>
                </div>
              </div>
              <Link href="#all-courses" onClick={() => { setCat(""); setType("paid"); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "10px 22px", borderRadius: 10, flexShrink: 0,
                  background: "#fff", color: INK,
                  fontWeight: 800, fontSize: 14, textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.22)", position: "relative",
                }}>
                Browse Paid Courses <ArrowRight style={{ width: 15, height: 15 }} />
              </Link>
            </div>
          )}

          {/* My Learning */}
          {!hasFilter && enrolled.length > 0 && (
            <CourseRow
              title="My Learning"
              subtitle="Pick up where you left off"
              badge={
                <span style={{ fontSize: 11, fontWeight: 700, background: GREEN, color: "#fff", padding: "2px 9px", borderRadius: 99 }}>
                  {enrolled.length}
                </span>
              }
              courses={enrolled} isLoggedIn={true} loading={loading}
            />
          )}

          {/* Live courses — from backend, shown first */}
          {(hasFilter ? liveVisible : liveCourses).length > 0 && (
            <CourseRow
              title={hasFilter ? "Matching Courses" : "Available Now"}
              subtitle={hasFilter ? undefined : "Real courses from our expert mentors — enrol and start today"}
              badge={
                <span style={{ fontSize: 11, fontWeight: 700, background: BRAND, color: "#fff", padding: "2px 9px", borderRadius: 99 }}>
                  Live
                </span>
              }
              courses={hasFilter ? liveVisible : liveCourses} isLoggedIn={isLoggedIn} loading={loading}
            />
          )}

          {/* Coming-soon */}
          {(hasFilter ? soonVisible : COMING_SOON).length > 0 && (
            <CourseRow
              title="Coming Soon"
              subtitle="More expert courses on the way — check back regularly"
              badge={
                <span style={{ fontSize: 11, fontWeight: 700, background: "#fbbf24", color: "#78350f", padding: "2px 9px", borderRadius: 99 }}>
                  {(hasFilter ? soonVisible : COMING_SOON).length} upcoming
                </span>
              }
              courses={hasFilter ? soonVisible : COMING_SOON} isLoggedIn={isLoggedIn} loading={loading}
            />
          )}

          {/* empty state */}
          {!loading && filtered.length === 0 && (
            <div className="glass" style={{
              textAlign: "center", padding: "64px 24px", borderRadius: 20,
            }}>
              <BookOpen style={{ width: 48, height: 48, color: "rgba(37,99,235,0.2)", margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: INK, margin: "0 0 8px" }}>No courses found</h3>
              <p style={{ fontSize: 14, color: MUTED, margin: "0 0 20px" }}>
                Try adjusting your search or clearing the filters.
              </p>
              <button onClick={() => { setSearch(""); setCat(""); setType(""); }}
                className="btn-primary"
                style={{ padding: "10px 24px", borderRadius: 12, fontSize: 14, border: "none",
                  cursor: "pointer", fontFamily: "inherit", color: "#fff" }}>
                Clear Filters
              </button>
            </div>
          )}
        </main>

        {/* ════════════════════════════════════
            GUEST CTA — matches site's CTA sections
        ════════════════════════════════════ */}
        {!isLoggedIn && !loading && (
          <section style={{ background: "#fff", borderTop: `1px solid ${BORDER}`, padding: "56px 0" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div style={{
                position: "relative", overflow: "hidden",
                background: `linear-gradient(135deg,${INK} 0%,${BRAND_DEEP} 60%,${INK} 100%)`,
                borderRadius: 20, padding: "clamp(32px,4.5vw,52px) clamp(24px,5vw,60px)",
                display: "flex", flexWrap: "wrap", alignItems: "center",
                justifyContent: "space-between", gap: 28,
              }}>
                <div style={{ position: "absolute", top: "-30%", right: "-5%", width: 420, height: 420, borderRadius: "50%",
                  background: "radial-gradient(circle,rgba(37,99,235,0.25) 0%,transparent 70%)",
                  filter: "blur(80px)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg,${BRAND},${BRAND_DEEP})` }} />
                <div style={{ position: "relative" }}>
                  <div className="section-badge" style={{ marginBottom: 12 }}>
                    <span className="section-badge-dot" style={{ background: "#60a5fa" }} />
                    <span className="section-badge-text" style={{ color: "#93c5fd" }}>Free to start</span>
                  </div>
                  <h2 style={{ fontSize: "clamp(18px,2.6vw,28px)", fontWeight: 800,
                    color: "#fff", margin: "0 0 8px", letterSpacing: "-0.03em",
                    fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                    Ready to land your dream job?
                  </h2>
                  <p style={{ fontSize: 14.5, color: "#94a3b8", margin: 0, fontWeight: 400 }}>
                    Sign in to track progress, earn certificates and unlock every course.
                  </p>
                </div>
                <Link href="/login?redirect=/dashboard/content"
                  style={{
                    position: "relative",
                    display: "inline-flex", alignItems: "center", gap: 9,
                    padding: "14px 30px", borderRadius: 12, flexShrink: 0,
                    background: "#fff", color: INK,
                    fontWeight: 800, fontSize: 15, textDecoration: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { transform: "translateY(-2px)", boxShadow: "0 8px 28px rgba(0,0,0,0.3)" })}
                  onMouseLeave={e => Object.assign((e.currentTarget as HTMLAnchorElement).style, { transform: "", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" })}
                >
                  Get Started Free <ArrowRight style={{ width: 16, height: 16 }} />
                </Link>
              </div>
            </div>
          </section>
        )}

        <StandardFooter />
      </div>
    </>
  );
}