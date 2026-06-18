"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen, Clock, Star, Lock, ArrowRight, Award,
  Search, X, Play, CheckCircle, Users, PlayCircle,
  ChevronLeft, ChevronRight, ShieldCheck, Trophy,
  MessageSquare, MonitorPlay, Globe, Zap, Tag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";
import { useAuth } from "@/context/AuthContext";
import { getAuthToken } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/* ── types ── */
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

/* ── constants ── */
const CAT_LABEL: Record<string, string> = {
  "mock-interview": "Mock Interview",
  "resume-building": "Resume Building",
  "gd-practice": "Group Discussion",
  "placement-prep": "Placement Prep",
  "skills": "Skills",
  "career-growth": "Career Growth",
  "coding": "Coding",
  "system-design": "System Design",
  "behavioral": "Behavioral",
  "other": "Other",
};

const CAT_TABS = [
  { value: "", label: "All" },
  { value: "mock-interview", label: "Mock Interview" },
  { value: "resume-building", label: "Resume" },
  { value: "gd-practice", label: "Group Discussion" },
  { value: "placement-prep", label: "Placement" },
  { value: "coding", label: "Coding" },
  { value: "system-design", label: "System Design" },
  { value: "behavioral", label: "Behavioral" },
  { value: "career-growth", label: "Career Growth" },
  { value: "skills", label: "Skills" },
];

const CAT_COLOR: Record<string, { bg: string; text: string }> = {
  "mock-interview":  { bg: "#fef9c3", text: "#854d0e" },
  "resume-building": { bg: "#dbeafe", text: "#1e40af" },
  "gd-practice":     { bg: "#dcfce7", text: "#15803d" },
  "placement-prep":  { bg: "#fce7f3", text: "#9d174d" },
  "coding":          { bg: "#ede9fe", text: "#5b21b6" },
  "system-design":   { bg: "#ffedd5", text: "#9a3412" },
  "behavioral":      { bg: "#f3e8ff", text: "#6b21a8" },
  "career-growth":   { bg: "#ccfbf1", text: "#0f766e" },
  "skills":          { bg: "#fee2e2", text: "#991b1b" },
  "other":           { bg: "#f1f5f9", text: "#475569" },
};

const DIFF_COLOR: Record<string, string> = {
  beginner: "#16a34a", intermediate: "#2563eb", advanced: "#ea580c", expert: "#dc2626",
};

/* ── dummy coming-soon courses ── */
const COMING_SOON: Course[] = [
  {
    _id: "cs-1", comingSoon: true,
    title: "System Design Interview Bootcamp",
    shortDescription: "Master load balancing, caching, databases & microservices with real-world case studies.",
    contentType: "paid", category: "system-design", difficulty: "advanced",
    price: 4999, discount: { type: "percentage", value: 74, isActive: true },
    totalDuration: 1240, certificateEnabled: true,
    analytics: { enrollments: 0, averageRating: 0 },
    mentorId: { name: "Rahul Sharma", designation: "Staff Engineer", company: "Google" },
    totalLectures: 142,
    modules: [{ title: "Basics" }, { title: "Scalability" }, { title: "Databases" }, { title: "Microservices" }],
  },
  {
    _id: "cs-2", comingSoon: true,
    title: "DSA — Cracking Coding Interviews",
    shortDescription: "500+ problems covering arrays, trees, graphs, DP and greedy algorithms.",
    contentType: "paid", category: "coding", difficulty: "intermediate",
    price: 3999, discount: { type: "percentage", value: 75, isActive: true },
    totalDuration: 980, certificateEnabled: true,
    analytics: { enrollments: 0, averageRating: 0 },
    mentorId: { name: "Priya Patel", designation: "Senior SDE", company: "Amazon" },
    totalLectures: 210,
    modules: [{ title: "Arrays" }, { title: "Trees" }, { title: "Graphs" }, { title: "DP" }],
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
    modules: [{ title: "STAR Basics" }, { title: "Leadership" }, { title: "Conflict" }],
  },
  {
    _id: "cs-4", comingSoon: true,
    title: "Resume Masterclass — From Zero to Hired",
    shortDescription: "Build ATS-friendly resumes. Templates, keyword optimization, recruiter insights.",
    contentType: "free", category: "resume-building", difficulty: "beginner",
    price: 0,
    totalDuration: 180,
    analytics: { enrollments: 0, averageRating: 0 },
    mentorId: { name: "Vikram Rao", designation: "Talent Acquisition Lead", company: "Flipkart" },
    totalLectures: 28,
    modules: [{ title: "ATS" }, { title: "Templates" }, { title: "Keywords" }],
  },
  {
    _id: "cs-5", comingSoon: true,
    title: "FAANG Mock Interview Series",
    shortDescription: "Live mock interviews with ex-FAANG engineers. Detailed feedback on approach & communication.",
    contentType: "paid", category: "mock-interview", difficulty: "advanced",
    price: 5999, discount: { type: "percentage", value: 67, isActive: true },
    totalDuration: 560, certificateEnabled: true,
    analytics: { enrollments: 0, averageRating: 0 },
    mentorId: { name: "Arjun Mehta", designation: "Ex-Principal Engineer", company: "Meta" },
    totalLectures: 35,
    modules: [{ title: "Google" }, { title: "Amazon" }, { title: "Meta" }],
    highestRated: true,
  },
  {
    _id: "cs-6", comingSoon: true,
    title: "Group Discussion & Communication Workshop",
    shortDescription: "Dominate GD rounds with structured thinking, confident speaking and group dynamics.",
    contentType: "free", category: "gd-practice", difficulty: "beginner",
    price: 0, certificateEnabled: true,
    analytics: { enrollments: 0, averageRating: 0 },
    mentorId: { name: "Neha Singh", designation: "Communication Coach", company: "TCS" },
    totalLectures: 32,
    modules: [{ title: "GD Basics" }, { title: "Topics" }, { title: "Body Language" }],
  },
  {
    _id: "cs-7", comingSoon: true,
    title: "Complete Placement Prep — Campus to Corporate",
    shortDescription: "Aptitude, technical, HR rounds and offer negotiation all in one course.",
    contentType: "paid", category: "placement-prep", difficulty: "intermediate",
    price: 2999, discount: { type: "percentage", value: 73, isActive: true },
    totalDuration: 720, certificateEnabled: true,
    analytics: { enrollments: 0, averageRating: 0 },
    mentorId: { name: "Karan Malhotra", designation: "Placement Officer", company: "IIT Bombay" },
    totalLectures: 95,
    modules: [{ title: "Aptitude" }, { title: "Technical" }, { title: "HR" }],
    bestseller: true,
  },
  {
    _id: "cs-8", comingSoon: true,
    title: "Career Growth — From IC to Engineering Manager",
    shortDescription: "Transition to management: people skills, strategy and stakeholder communication.",
    contentType: "paid", category: "career-growth", difficulty: "expert",
    price: 4499, discount: { type: "percentage", value: 67, isActive: true },
    totalDuration: 480, certificateEnabled: true,
    analytics: { enrollments: 0, averageRating: 0 },
    mentorId: { name: "Sneha Iyer", designation: "Engineering Manager", company: "Uber" },
    totalLectures: 58,
    modules: [{ title: "Transition" }, { title: "People" }, { title: "Strategy" }],
    isNew: true,
  },
];

/* ── helpers ── */
function fmtDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}
function fmtNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}
function calcEffectivePrice(course: Course) {
  const isPaid = course.contentType === "paid" || course.contentType === "exclusive";
  const hasDiscount = isPaid && course.discount?.isActive && course.discount.type !== "none" && (course.discount.value ?? 0) > 0;
  const discountAmt = hasDiscount
    ? course.discount!.type === "percentage"
      ? Math.round(((course.price ?? 0) * course.discount!.value) / 100)
      : course.discount!.value
    : 0;
  const effectivePrice = hasDiscount ? Math.max(0, (course.price ?? 0) - discountAmt) : (course.price ?? 0);
  return { isPaid, hasDiscount, discountAmt, effectivePrice };
}

/* ════════════════════════════════════════════════
   COURSE CARD  (Udemy style)
════════════════════════════════════════════════ */
function CourseCard({ course, isLoggedIn }: { course: Course; isLoggedIn: boolean }) {
  const isEnrolled = !!course.enrollment;
  const pct = course.enrollment?.progress ?? 0;
  const { isPaid, hasDiscount, effectivePrice } = calcEffectivePrice(course);
  const catStyle = CAT_COLOR[course.category] ?? CAT_COLOR.other;

  const previewHref = course.comingSoon ? "#" : `/courses/${course._id}`;
  const enrollHref  = course.comingSoon ? "#"
    : isEnrolled ? `/dashboard/content/${course._id}`
    : isLoggedIn
      ? isPaid ? `/dashboard/checkout/${course._id}` : `/dashboard/content/${course._id}`
      : isPaid ? `/login?redirect=/dashboard/checkout/${course._id}` : `/login?redirect=/dashboard/content/${course._id}`;

  return (
    <div className="course-card" style={{
      display: "flex", flexDirection: "column",
      background: "#fff", border: "1px solid #e2e8f0",
      borderRadius: 6, overflow: "hidden",
      transition: "box-shadow 0.2s, transform 0.2s",
      cursor: course.comingSoon ? "default" : "pointer",
      height: "100%",
    }}
      onMouseEnter={e => {
        if (course.comingSoon) return;
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.14)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
        (e.currentTarget as HTMLDivElement).style.transform = "";
      }}
    >
      {/* ── Thumbnail ── */}
      <div style={{ position: "relative", paddingTop: "56.25%", background: "linear-gradient(135deg,#1e3a8a,#2563eb)", flexShrink: 0 }}>
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen style={{ width: 36, height: 36, color: "rgba(255,255,255,0.18)" }} />
          </div>
        )}

        {/* Coming-soon overlay */}
        {course.comingSoon && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(15,23,42,0.72)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                display: "inline-block",
                background: "#facc15", color: "#78350f",
                fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
                padding: "5px 14px", borderRadius: 99, marginBottom: 8,
                textTransform: "uppercase",
              }}>Coming Soon</div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: 0 }}>Notify me when live</p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div style={{ position: "absolute", top: 8, left: 8, display: "flex", flexDirection: "column", gap: 3, zIndex: 2 }}>
          {course.bestseller && !course.comingSoon && (
            <span style={{ fontSize: 9.5, fontWeight: 700, padding: "3px 7px", borderRadius: 3, background: "#fbbf24", color: "#78350f", textTransform: "uppercase", letterSpacing: "0.05em" }}>Bestseller</span>
          )}
          {course.highestRated && !course.comingSoon && (
            <span style={{ fontSize: 9.5, fontWeight: 700, padding: "3px 7px", borderRadius: 3, background: "#f97316", color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>Highest Rated</span>
          )}
          {course.isNew && !course.comingSoon && (
            <span style={{ fontSize: 9.5, fontWeight: 700, padding: "3px 7px", borderRadius: 3, background: "#10b981", color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>New</span>
          )}
          {isEnrolled && (
            <span style={{ fontSize: 9.5, fontWeight: 700, padding: "3px 7px", borderRadius: 3, background: "#059669", color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>Enrolled</span>
          )}
        </div>

        {/* Free/Paid top-right */}
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}>
          {!course.comingSoon && !isPaid && (
            <span style={{ fontSize: 9.5, fontWeight: 700, padding: "3px 8px", borderRadius: 3, background: "#10b981", color: "#fff", letterSpacing: "0.05em", textTransform: "uppercase" }}>Free</span>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "14px 14px 14px" }}>
        {/* Category chip */}
        <span style={{
          fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 3,
          background: catStyle.bg, color: catStyle.text,
          alignSelf: "flex-start", marginBottom: 8,
          letterSpacing: "0.02em",
        }}>
          {CAT_LABEL[course.category] ?? course.category}
        </span>

        {/* Title */}
        <h3 style={{
          fontSize: 14.5, fontWeight: 700, lineHeight: 1.38, color: "#0f172a",
          margin: "0 0 6px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          minHeight: 40,
        }}>{course.title}</h3>

        {/* Description */}
        {course.shortDescription && (
          <p style={{
            fontSize: 12, color: "#64748b", margin: "0 0 8px", lineHeight: 1.55,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{course.shortDescription}</p>
        )}

        {/* Instructor */}
        <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 8px", fontWeight: 500 }}>
          {course.mentorId.name}
          {course.mentorId.company && <span style={{ color: "#94a3b8" }}> · {course.mentorId.company}</span>}
        </p>

        {/* Rating row */}
        {(course.analytics?.averageRating ?? 0) > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#b45309" }}>
              {(course.analytics!.averageRating).toFixed(1)}
            </span>
            <div style={{ display: "flex", gap: 1 }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} style={{ width: 11, height: 11 }}
                  fill={i <= Math.round(course.analytics!.averageRating) ? "#f59e0b" : "#e2e8f0"}
                  color={i <= Math.round(course.analytics!.averageRating) ? "#f59e0b" : "#e2e8f0"}
                />
              ))}
            </div>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>({fmtNum(course.analytics!.enrollments)})</span>
          </div>
        )}

        {/* Meta chips */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {(course.totalDuration ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#64748b" }}>
              <Clock style={{ width: 10, height: 10 }} />{fmtDuration(course.totalDuration!)}
            </span>
          )}
          {(course.totalLectures ?? 0) > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#64748b" }}>
              <PlayCircle style={{ width: 10, height: 10 }} />{course.totalLectures} lectures
            </span>
          )}
          {course.difficulty && (
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#64748b", fontWeight: 600 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: DIFF_COLOR[course.difficulty] ?? "#64748b" }} />
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </span>
          )}
          {course.certificateEnabled && (
            <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, color: "#059669", fontWeight: 600 }}>
              <Award style={{ width: 10, height: 10 }} />Cert
            </span>
          )}
        </div>

        {/* ── Price / Progress ── */}
        <div style={{ marginTop: "auto", borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
          {isEnrolled ? (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>
                  {pct >= 100 ? "Completed" : pct > 0 ? `${pct}% complete` : "Enrolled"}
                </span>
              </div>
              {pct > 0 && pct < 100 && (
                <div style={{ height: 4, borderRadius: 2, background: "#e2e8f0", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: "linear-gradient(90deg,#2563eb,#1d4ed8)", transition: "width 0.8s ease" }} />
                </div>
              )}
            </div>
          ) : isPaid && (course.price ?? 0) > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                ₹{effectivePrice.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <span style={{ fontSize: 12.5, color: "#94a3b8", textDecoration: "line-through" }}>
                  ₹{course.price?.toLocaleString("en-IN")}
                </span>
              )}
              {hasDiscount && course.discount && (
                <span style={{ fontSize: 10, fontWeight: 700, background: "#dc2626", color: "#fff", padding: "2px 6px", borderRadius: 3 }}>
                  {course.discount.type === "percentage" ? `${course.discount.value}% OFF` : `₹${course.discount.value} OFF`}
                </span>
              )}
            </div>
          ) : !isPaid ? (
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#059669" }}>Free</span>
            </div>
          ) : null}

          {/* ── Action buttons ── */}
          {course.comingSoon ? (
            <button style={{
              width: "100%", padding: "9px 0", borderRadius: 4,
              background: "#f1f5f9", color: "#64748b", fontWeight: 700, fontSize: 13,
              border: "1px solid #e2e8f0", cursor: "default", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Zap style={{ width: 13, height: 13 }} /> Notify Me
            </button>
          ) : isEnrolled ? (
            <Link href={enrollHref} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              width: "100%", padding: "9px 0", borderRadius: 4,
              background: "linear-gradient(135deg,#059669,#047857)",
              color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none",
            }}>
              <Play style={{ width: 12, height: 12, fill: "#fff" }} />
              {pct >= 100 ? "Review Course" : pct > 0 ? "Continue Learning" : "Start Learning"}
            </Link>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Link href={previewHref} style={{
                flex: 1, padding: "9px 0", borderRadius: 4,
                fontSize: 12.5, fontWeight: 700, color: "#2563eb",
                background: "#eff6ff", border: "1.5px solid #bfdbfe",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                textDecoration: "none",
              }}>
                <Play style={{ width: 11, height: 11, fill: "#2563eb" }} /> Preview
              </Link>
              <Link href={enrollHref} style={{
                flex: 1, padding: "9px 0", borderRadius: 4,
                fontSize: 12.5, fontWeight: 700, color: "#fff",
                background: isPaid ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "linear-gradient(135deg,#059669,#047857)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                textDecoration: "none",
              }}>
                {isPaid ? <><Lock style={{ width: 11, height: 11 }} /> Enroll</> : <><Play style={{ width: 11, height: 11, fill: "#fff" }} /> Enroll Free</>}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   SKELETON CARD
════════════════════════════════════════════════ */
function SkeletonCard() {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ paddingTop: "56.25%", background: "#f1f5f9" }} />
      <div style={{ padding: "14px" }}>
        {[30, 90, 70, 50, 40, 25].map((w, i) => (
          <div key={i} style={{ height: i === 1 || i === 2 ? 14 : 10, width: `${w}%`, background: "#e2e8f0", borderRadius: 3, marginBottom: i < 5 ? 10 : 0 }} className="animate-pulse" />
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   SCROLLABLE CAROUSEL ROW
════════════════════════════════════════════════ */
function CourseRow({
  title, subtitle, courses, isLoggedIn, loading, badge,
}: {
  title: string; subtitle?: string; badge?: React.ReactNode;
  courses: Course[]; isLoggedIn: boolean; loading: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setLeft] = useState(false);
  const [canRight, setRight] = useState(true);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setLeft(el.scrollLeft > 4);
    setRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [courses]);

  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <div style={{ marginBottom: 56 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
            <h2 style={{ fontSize: "clamp(18px,2.2vw,24px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", margin: 0 }}>{title}</h2>
            {badge}
          </div>
          {subtitle && <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>{subtitle}</p>}
        </div>
        {courses.length > 3 && (
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {[{dir:-1, can:canLeft},{dir:1, can:canRight}].map(({dir,can}) => (
              <button key={dir} onClick={() => scroll(dir)} disabled={!can} style={{
                width: 34, height: 34, borderRadius: "50%",
                border: "1.5px solid #e2e8f0", background: can ? "#fff" : "#f8fafc",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: can ? "pointer" : "not-allowed", opacity: can ? 1 : 0.35,
                transition: "all 0.2s",
              }}>
                {dir < 0 ? <ChevronLeft style={{ width: 16, height: 16, color: "#0f172a" }} /> : <ChevronRight style={{ width: 16, height: 16, color: "#0f172a" }} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cards */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
          {[...Array(4)].map((_,i) => <SkeletonCard key={i} />)}
        </div>
      ) : courses.length === 0 ? (
        <div style={{ padding: "48px 24px", textAlign: "center", background: "#f8fafc", borderRadius: 8, border: "1px dashed #e2e8f0" }}>
          <BookOpen style={{ width: 36, height: 36, color: "#cbd5e1", margin: "0 auto 10px" }} />
          <p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>No courses yet</p>
        </div>
      ) : (
        <div ref={ref} style={{ display: "flex", gap: 16, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
          {courses.map(c => (
            <div key={c._id} style={{ flex: "0 0 clamp(240px,22vw,280px)" }}>
              <CourseCard course={c} isLoggedIn={isLoggedIn} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   TRUST BAR
════════════════════════════════════════════════ */
function TrustBar() {
  const items = [
    { icon: ShieldCheck, label: "Lifetime Access" },
    { icon: Trophy, label: "Certificates" },
    { icon: MonitorPlay, label: "HD Video" },
    { icon: Globe, label: "Learn Anywhere" },
    { icon: MessageSquare, label: "Community Support" },
  ];
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "14px 0" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(20px,3.5vw,56px)", flexWrap: "wrap" }}>
          {items.map(({ icon: Icon, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon style={{ width: 17, height: 17, color: "#2563eb" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════ */
export default function CoursesPage() {
  const { isLoggedIn } = useAuth();
  const [liveCourses, setLiveCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | "free" | "paid">("");

  /* fetch */
  useEffect(() => {
    const token = getAuthToken();
    const pub = fetch(`${API_URL}/advanced/courses/public?limit=100&sortBy=createdAt&sortOrder=desc`).then(r => r.json());
    const enr = token
      ? fetch(`${API_URL}/enrollments/my-enrollments`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => ({ success: false }))
      : Promise.resolve({ success: false });

    Promise.all([pub, enr]).then(([pubData, enrData]) => {
      let list: Course[] = pubData.success ? pubData.data.courses ?? [] : [];
      if (enrData.success && Array.isArray(enrData.data)) {
        const map = new Map<string, { progress: number }>();
        enrData.data.forEach((e: any) => {
          const id = e.courseId?._id ?? e.courseId;
          if (id) map.set(id, { progress: e.progress ?? 0 });
        });
        list = list.map(c => map.has(c._id) ? { ...c, enrollment: map.get(c._id) } : c);
      }
      setLiveCourses(list);
    }).catch(() => setLiveCourses([])).finally(() => setLoading(false));
  }, [isLoggedIn]);

  /* all courses = live + coming soon */
  const allCourses: Course[] = [...liveCourses, ...COMING_SOON];

  /* filter */
  const filtered = allCourses.filter(c => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!c.title.toLowerCase().includes(q) &&
          !(c.shortDescription ?? "").toLowerCase().includes(q) &&
          !c.mentorId.name.toLowerCase().includes(q)) return false;
    }
    if (category && c.category !== category) return false;
    if (typeFilter === "free" && c.contentType !== "free") return false;
    if (typeFilter === "paid" && c.contentType === "free") return false;
    return true;
  });

  /* derived sections */
  const enrolled     = liveCourses.filter(c => !!c.enrollment);
  const liveVisible  = filtered.filter(c => !c.comingSoon);
  const soonVisible  = filtered.filter(c => !!c.comingSoon);
  const hasFilter    = !!(search || category || typeFilter);

  /* stats */
  const totalStudents = allCourses.reduce((s, c) => s + (c.analytics?.enrollments ?? 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Inter', system-ui, sans-serif; }
        .si:focus { outline: none !important; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.15) !important; }
        .fs { appearance: none; -webkit-appearance: none; }
        .fs:focus { outline: none !important; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.15) !important; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style:none; scrollbar-width:none; }
        .cat-tab { cursor:pointer; white-space:nowrap; transition: all 0.18s; border:none; font-family:inherit; }
        .cat-tab:hover { background:#f1f5f9 !important; }
        .pill { cursor:pointer; border:none; font-family:inherit; transition:all 0.18s; }
        .pill:hover { opacity: 0.85; }
      `}</style>

      <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Navbar />

        {/* ══════════════════════════════════════
            HERO — dark Udemy-style banner
        ══════════════════════════════════════ */}
        <section style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #1e1b4b 100%)",
          paddingTop: "calc(var(--yic-header-h, 64px) + 52px)",
          paddingBottom: 60,
          position: "relative", overflow: "hidden",
        }}>
          {/* subtle grid */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.04,
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
          <div style={{ position: "absolute", top: "-20%", right: "-8%", width: 550, height: 550, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.25) 0%,transparent 70%)", filter: "blur(100px)" }} />
          <div style={{ position: "absolute", bottom: "-10%", left: "10%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,0.2) 0%,transparent 70%)", filter: "blur(80px)" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div style={{ maxWidth: 680 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18, background: "rgba(99,102,241,0.2)", padding: "5px 12px", borderRadius: 99, border: "1px solid rgba(99,102,241,0.35)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }} />
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "#c4b5fd", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Your Interview Coach — Course Library
                </span>
              </div>

              <h1 style={{ margin: "0 0 18px", fontSize: "clamp(30px,4.5vw,52px)", fontWeight: 800, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.04em" }}>
                Land your dream job.<br />
                <span style={{ color: "#93c5fd" }}>One course at a time.</span>
              </h1>

              <p style={{ fontSize: "clamp(14px,1.3vw,16.5px)", color: "#94a3b8", lineHeight: 1.7, maxWidth: 500, marginBottom: 32 }}>
                Expert-crafted courses for mock interviews, resume writing, group discussions, coding, system design & more.
                {!isLoggedIn && " Sign in to track your progress and earn certificates."}
              </p>

              {/* Stats pills */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 32 }}>
                {[
                  { val: `${allCourses.length}`, label: "Courses" },
                  { val: totalStudents > 0 ? `${fmtNum(totalStudents)}+` : "50K+", label: "Students" },
                  { val: `${allCourses.filter(c => c.contentType === "free").length}`, label: "Free" },
                  { val: "4.8★", label: "Avg Rating" },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.06)", padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{s.val}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {!isLoggedIn && (
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link href="/login?redirect=/courses" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "13px 28px", borderRadius: 6,
                    background: "#2563eb", color: "#fff",
                    fontWeight: 700, fontSize: 14.5, textDecoration: "none",
                    boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
                    transition: "background 0.2s",
                  }}>
                    Get Started Free <ArrowRight style={{ width: 16, height: 16 }} />
                  </Link>
                  <Link href="#all-courses" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "13px 28px", borderRadius: 6,
                    background: "rgba(255,255,255,0.08)", color: "#fff",
                    fontWeight: 700, fontSize: 14.5, textDecoration: "none",
                    border: "1.5px solid rgba(255,255,255,0.18)",
                    transition: "background 0.2s",
                  }}>
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <TrustBar />

        {/* ══════════════════════════════════════
            STICKY FILTER BAR
        ══════════════════════════════════════ */}
        <div style={{
          position: "sticky", top: "var(--yic-header-h, 64px)", zIndex: 40,
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e2e8f0",
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Top row: search + type pills */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 0 0" }}>
              {/* Search */}
              <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 380 }}>
                <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#94a3b8", pointerEvents: "none" }} />
                <input type="text" placeholder="Search for anything…" value={search}
                  onChange={e => setSearch(e.target.value)} className="si"
                  style={{ width: "100%", paddingLeft: 38, paddingRight: search ? 36 : 14, paddingTop: 9, paddingBottom: 9, border: "1.5px solid #e2e8f0", borderRadius: 6, fontSize: 14, fontFamily: "inherit", color: "#0f172a", background: "#f8fafc", transition: "border-color 0.2s, box-shadow 0.2s", boxSizing: "border-box" }}
                />
                {search && (
                  <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
                    <X style={{ width: 14, height: 14, color: "#94a3b8" }} />
                  </button>
                )}
              </div>

              {/* Type pills */}
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {(["", "free", "paid"] as const).map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)} className="pill" style={{
                    padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600,
                    border: "1.5px solid", fontFamily: "inherit",
                    borderColor: typeFilter === t ? "#2563eb" : "#e2e8f0",
                    background: typeFilter === t ? "#2563eb" : "#fff",
                    color: typeFilter === t ? "#fff" : "#0f172a",
                    boxShadow: typeFilter === t ? "0 2px 8px rgba(37,99,235,0.2)" : "none",
                  }}>
                    {t === "" ? "All" : t === "free" ? "Free" : "Paid"}
                  </button>
                ))}
              </div>

              {/* Count */}
              {!loading && (
                <span style={{ fontSize: 12.5, color: "#94a3b8", marginLeft: "auto", fontWeight: 500, flexShrink: 0 }}>
                  {filtered.length} course{filtered.length !== 1 ? "s" : ""}
                </span>
              )}

              {/* Clear */}
              {hasFilter && (
                <button onClick={() => { setSearch(""); setCategory(""); setTypeFilter(""); }} className="pill" style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "7px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                  border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626",
                }}>
                  <X style={{ width: 11, height: 11 }} /> Clear
                </button>
              )}
            </div>

            {/* Category tabs — scrollable */}
            <div className="hide-scroll" style={{ display: "flex", gap: 2, overflowX: "auto", padding: "8px 0" }}>
              {CAT_TABS.map(tab => (
                <button key={tab.value} onClick={() => setCategory(tab.value)} className="cat-tab" style={{
                  padding: "6px 14px", borderRadius: 99, fontSize: 13, fontWeight: category === tab.value ? 700 : 500,
                  background: category === tab.value ? "#0f172a" : "transparent",
                  color: category === tab.value ? "#fff" : "#475569",
                }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════════ */}
        <main id="all-courses" className="max-w-7xl mx-auto px-4 sm:px-6" style={{ paddingTop: 40, paddingBottom: 60 }}>

          {/* My Learning — only if enrolled courses visible */}
          {!hasFilter && enrolled.length > 0 && (
            <CourseRow
              title="My Learning"
              subtitle="Pick up where you left off"
              courses={enrolled}
              isLoggedIn={true}
              loading={loading}
              badge={<span style={{ fontSize: 11, fontWeight: 700, background: "#059669", color: "#fff", padding: "2px 8px", borderRadius: 99 }}>{enrolled.length}</span>}
            />
          )}

          {/* Live courses */}
          {(hasFilter ? liveVisible : liveCourses).length > 0 && (
            <CourseRow
              title={hasFilter ? "Matching Courses" : "Available Now"}
              subtitle={hasFilter ? undefined : "Enroll today and start learning instantly"}
              courses={hasFilter ? liveVisible : liveCourses}
              isLoggedIn={isLoggedIn}
              loading={loading}
              badge={
                <span style={{ fontSize: 11, fontWeight: 700, background: "#2563eb", color: "#fff", padding: "2px 8px", borderRadius: 99 }}>
                  Live
                </span>
              }
            />
          )}

          {/* Coming soon */}
          {(hasFilter ? soonVisible : COMING_SOON).length > 0 && (
            <CourseRow
              title="Coming Soon"
              subtitle="More courses launching — get notified when they go live"
              courses={hasFilter ? soonVisible : COMING_SOON}
              isLoggedIn={isLoggedIn}
              loading={loading}
              badge={
                <span style={{ fontSize: 11, fontWeight: 700, background: "#facc15", color: "#78350f", padding: "2px 8px", borderRadius: 99 }}>
                  {(hasFilter ? soonVisible : COMING_SOON).length} upcoming
                </span>
              }
            />
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "64px 24px", background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
              <BookOpen style={{ width: 48, height: 48, color: "#cbd5e1", margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>No courses found</h3>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px" }}>Try adjusting your search or clearing the filters.</p>
              <button onClick={() => { setSearch(""); setCategory(""); setTypeFilter(""); }} style={{
                padding: "10px 24px", borderRadius: 6,
                background: "#2563eb", color: "#fff",
                fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", fontFamily: "inherit",
              }}>
                Clear Filters
              </button>
            </div>
          )}
        </main>

        {/* ══════════════════════════════════════
            GUEST CTA BANNER
        ══════════════════════════════════════ */}
        {!isLoggedIn && !loading && (
          <section style={{ background: "#fff", borderTop: "1px solid #e2e8f0", padding: "48px 0" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div style={{
                background: "linear-gradient(135deg,#1e1b4b,#1e3a8a)",
                borderRadius: 12, padding: "clamp(28px,4vw,48px) clamp(24px,5vw,56px)",
                display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: "-30%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.3) 0%,transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />
                <div style={{ position: "relative" }}>
                  <h2 style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.03em" }}>
                    Ready to level up your career?
                  </h2>
                  <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>
                    Sign in to track progress, earn certificates, and unlock premium courses.
                  </p>
                </div>
                <Link href="/login?redirect=/courses" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "13px 28px", borderRadius: 6, flexShrink: 0,
                  background: "#fff", color: "#1e1b4b",
                  fontWeight: 800, fontSize: 14, textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  position: "relative",
                }}>
                  Get Started Free <ArrowRight style={{ width: 15, height: 15 }} />
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