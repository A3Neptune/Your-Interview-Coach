"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Clock, Star, Lock, ArrowRight, Sparkles, Award,
  Search, ChevronDown, X, Play, CheckCircle, Tag,
  Mic, FileText, Users, Briefcase, Code2, Brain, TrendingUp,
  Bell, BellRing, CalendarClock, HelpCircle, Plus, Minus, GraduationCap,
  Zap,
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
const SUCCESS    = "#059669";
const MONO       = "'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace";

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
  "soft-skills":     "Soft Skills",
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

const PREP_TRACKS: { value: string; label: string; blurb: string; icon: React.ElementType }[] = [
  { value: "mock-interview",  label: "Mock Interviews",  blurb: "Live practice rounds",   icon: Mic },
  { value: "resume-building", label: "Resume Building",  blurb: "ATS-ready resumes",      icon: FileText },
  { value: "gd-practice",     label: "Group Discussion", blurb: "Structured GD drills",   icon: Users },
  { value: "placement-prep",  label: "Placement Prep",   blurb: "End-to-end prep plans",  icon: Briefcase },
  { value: "coding",          label: "Coding",           blurb: "DSA & problem solving",  icon: Code2 },
  { value: "behavioral",      label: "Behavioral",       blurb: "STAR-method answers",    icon: Brain },
  { value: "career-growth",   label: "Career Growth",    blurb: "Beyond your first job",  icon: TrendingUp },
];

type ComingSoonItem = { id: string; title: string; category: string; difficulty: string; blurb: string; eta: string };
const COMING_SOON: ComingSoonItem[] = [
  { id: "cs-1", title: "Professional Communication Masterclass",  category: "soft-skills", difficulty: "beginner",     blurb: "Build clear, confident communication for emails, meetings, and one-on-ones with stakeholders.",   eta: "Aug 2026" },
  { id: "cs-2", title: "Public Speaking & Presentation Skills",   category: "soft-skills", difficulty: "intermediate", blurb: "Conquer stage fright and deliver compelling presentations that keep every audience engaged.",     eta: "Aug 2026" },
  { id: "cs-3", title: "Emotional Intelligence at Work",          category: "soft-skills", difficulty: "beginner",     blurb: "Understand and manage emotions — yours and your team's — to build stronger working relationships.", eta: "Sep 2026" },
  { id: "cs-4", title: "Leadership & Team Management",            category: "soft-skills", difficulty: "intermediate", blurb: "Practical frameworks for leading teams, giving feedback, and driving outcomes without authority.",   eta: "Sep 2026" },
  { id: "cs-5", title: "Conflict Resolution & Negotiation",       category: "soft-skills", difficulty: "intermediate", blurb: "Navigate disagreements and negotiate outcomes that work for everyone — in interviews and at work.", eta: "Oct 2026" },
  { id: "cs-6", title: "Time Management & Productivity",          category: "soft-skills", difficulty: "beginner",     blurb: "Proven systems to prioritise ruthlessly, eliminate distractions, and ship work that matters.",        eta: "Oct 2026" },
  { id: "cs-7", title: "Networking & Personal Branding",          category: "soft-skills", difficulty: "beginner",     blurb: "Build a professional network that opens doors — LinkedIn, referrals, industry events, and beyond.",  eta: "Nov 2026" },
  { id: "cs-8", title: "Critical Thinking & Problem Solving",     category: "soft-skills", difficulty: "advanced",     blurb: "Structured mental models to break down ambiguous problems and communicate solutions under pressure.", eta: "Nov 2026" },
];

const STEPS = [
  { n: "01", title: "Pick your track",  body: "Browse mock interviews, resume building, GD, coding and more — filter by what you need right now." },
  { n: "02", title: "Learn & practice", body: "Work through mentor-led lessons and hands-on drills at your own pace, on your own schedule." },
  { n: "03", title: "Get certified",    body: "Finish strong and add a verifiable certificate to your profile when a course supports it." },
];

const FAQS = [
  { q: "Do I get a certificate after finishing a course?", a: "Yes — any course with the Cert badge issues a certificate once you complete it, ready to add to your profile or resume." },
  { q: "Can I preview a course before enrolling?",         a: "Every course has a free preview, so you can see the format, the mentor, and the structure before you commit." },
  { q: "What happens after I enroll in a paid course?",    a: "You get full access to all modules, downloadable resources, and any live sessions tied to that course." },
  { q: "Will free courses stay free?",                     a: "Yes — courses currently marked Free remain free to access." },
];

/* ─── Featured Course Spotlight ─── */
function FeaturedCourse({ course, isLoggedIn }: { course: Course; isLoggedIn: boolean }) {
  const isPaid     = course.contentType === "paid" || course.contentType === "exclusive";
  const isEnrolled = !!course.enrollment;
  const hasDiscount = !isEnrolled && isPaid && course.discount?.isActive && course.discount.type !== "none" && (course.discount.value ?? 0) > 0;
  const effectivePrice = hasDiscount && course.discountPrice != null ? course.discountPrice : (course.price ?? 0);
  const discountLabel  = hasDiscount
    ? course.discount!.type === "percentage" ? `${course.discount!.value}% OFF` : `₹${course.discount!.value} OFF`
    : null;
  const enrollHref = isEnrolled
    ? `/dashboard/content/${course._id}`
    : isLoggedIn
      ? isPaid ? `/dashboard/checkout/${course._id}` : `/dashboard/content/${course._id}`
      : isPaid ? `/login?redirect=/dashboard/checkout/${course._id}` : `/login?redirect=/dashboard/content/${course._id}`;
  const inits = course.mentorId.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <section style={{
      background: `linear-gradient(135deg, ${INK} 0%, #172554 50%, ${BRAND_DEEP} 100%)`,
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", right: "8%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 68%)" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "3%", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(29,78,216,0.15) 0%, transparent 70%)" }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        {/* Label */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 13px", borderRadius: 99,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
          }}>
            <Zap size={10} style={{ color: "#fbbf24" }} />
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.88)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Featured Course
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "clamp(32px,6vw,72px)", alignItems: "center", flexWrap: "wrap" }}>

          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: "1 1 360px", minWidth: 0 }}
          >
            {/* Tags */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
                padding: "3px 10px", borderRadius: 99,
                background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}>
                {CAT_LABEL[course.category] ?? course.category}
              </span>
              {course.difficulty && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: DIFF_DOT[course.difficulty] ?? MUTED, display: "inline-block" }} />
                  {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                </span>
              )}
              {course.certificateEnabled && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: "#4ade80", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", padding: "3px 9px", borderRadius: 99 }}>
                  <Award style={{ width: 9, height: 9 }} /> Certificate
                </span>
              )}
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: "clamp(26px,3.8vw,46px)",
              lineHeight: 1.08, letterSpacing: "-0.035em", fontWeight: 800,
              color: "#fff", margin: "0 0 14px",
            }}>
              {course.title}
            </h2>

            {/* Description */}
            {course.shortDescription && (
              <p style={{ fontSize: "clamp(13px,1.2vw,15.5px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 22px", maxWidth: 500 }}>
                {course.shortDescription}
              </p>
            )}

            {/* Mentor */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 11, fontWeight: 700,
              }}>
                {inits}
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff" }}>{course.mentorId.name}</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}>{course.mentorId.designation}</div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 22, flexWrap: "wrap", marginBottom: 26, paddingBottom: 26, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              {(course.modules?.length ?? 0) > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
                  <BookOpen style={{ width: 13, height: 13, color: "rgba(255,255,255,0.4)" }} />
                  {course.modules!.length} modules
                </span>
              )}
              {(course.totalDuration ?? 0) > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
                  <Clock style={{ width: 13, height: 13, color: "rgba(255,255,255,0.4)" }} />
                  {course.totalDuration}m total
                </span>
              )}
              {(course.analytics?.averageRating ?? 0) > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
                  <Star style={{ width: 13, height: 13, color: "#fbbf24", fill: "#fbbf24" }} />
                  {course.analytics!.averageRating.toFixed(1)} rating
                </span>
              )}
              {(course.analytics?.enrollments ?? 0) > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
                  <Users style={{ width: 13, height: 13, color: "rgba(255,255,255,0.4)" }} />
                  {course.analytics!.enrollments.toLocaleString("en-IN")} enrolled
                </span>
              )}
            </div>

            {/* Price + CTAs */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              {isPaid ? (
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: "clamp(22px,2.8vw,30px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", fontFamily: MONO }}>
                    ₹{effectivePrice}
                  </span>
                  {hasDiscount && (
                    <span style={{ fontSize: 15, color: "rgba(255,255,255,0.38)", textDecoration: "line-through", fontFamily: MONO }}>
                      ₹{course.price}
                    </span>
                  )}
                  <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.42)", fontWeight: 500 }}>excl. GST</span>
                  {discountLabel && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 800, color: "#fff", background: "linear-gradient(135deg,#f97316,#ea580c)", padding: "3px 8px", borderRadius: 99, fontFamily: MONO }}>
                      <Tag style={{ width: 7, height: 7 }} />{discountLabel}
                    </span>
                  )}
                </div>
              ) : (
                <span style={{ fontSize: 24, fontWeight: 800, color: "#4ade80", fontFamily: MONO }}>Free</span>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <Link
                  href={enrollHref}
                  className="feat-enroll"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "12px 24px", borderRadius: 12,
                    fontSize: 14, fontWeight: 700, color: INK, textDecoration: "none",
                    background: "#fff", boxShadow: "0 8px 28px rgba(0,0,0,0.32)",
                    transition: "transform 0.18s, box-shadow 0.2s",
                  }}
                >
                  {isEnrolled ? "Continue learning" : isPaid ? "Enroll now" : "Start for free"}
                  <ArrowRight style={{ width: 13, height: 13 }} />
                </Link>
                <Link
                  href={`/courses/${course._id}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "12px 18px", borderRadius: 12,
                    fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.82)", textDecoration: "none",
                    background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.16)",
                    transition: "background 0.18s",
                  }}
                >
                  <Play style={{ width: 11, height: 11, fill: "rgba(255,255,255,0.82)" }} /> Preview
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right — thumbnail */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: "0 1 380px", minWidth: 260 }}
            className="hidden sm:block"
          >
            <div style={{
              borderRadius: 22, overflow: "hidden",
              boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
              border: "1.5px solid rgba(255,255,255,0.1)",
              background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
              aspectRatio: "16 / 10",
              position: "relative",
            }}>
              {course.thumbnail
                ? <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BookOpen style={{ width: 68, height: 68, color: "rgba(255,255,255,0.12)" }} />
                  </div>
              }
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 55%)" }} />
              <Link href={`/courses/${course._id}`} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Play style={{ width: 22, height: 22, fill: "#fff", color: "#fff", marginLeft: 2 }} />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Course Card ─── */
function CourseCard({ course, delay = 0, isLoggedIn = false }: { course: Course; delay?: number; isLoggedIn?: boolean }) {
  const isPaid     = course.contentType === "paid" || course.contentType === "exclusive";
  const isEnrolled = !!course.enrollment;
  const pct        = course.enrollment?.progress ?? 0;
  const inits      = course.mentorId.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const hasDiscount    = !isEnrolled && isPaid && course.discount?.isActive && course.discount.type !== "none" && (course.discount.value ?? 0) > 0;
  const effectivePrice = hasDiscount && course.discountPrice != null ? course.discountPrice : (course.price ?? 0);
  const discountLabel  = hasDiscount
    ? course.discount!.type === "percentage" ? `${course.discount!.value}% OFF` : `₹${course.discount!.value} OFF`
    : null;

  const green      = "#059669";
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
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1], delay }}
      style={{
        display: "flex", flexDirection: "column", height: "100%",
        borderRadius: 18, overflow: "hidden",
        background: "#fff",
        border: isEnrolled ? "1.5px solid rgba(5,150,105,0.2)" : "1.5px solid rgba(37,99,235,0.1)",
        boxShadow: "0 2px 14px rgba(15,23,42,0.06)",
      }}
      whileHover={{ translateY: -3, boxShadow: "0 14px 40px rgba(37,99,235,0.12)" }}
    >
      {/* Thumbnail */}
      <div style={{ height: 178, flexShrink: 0, overflow: "hidden", background: "linear-gradient(135deg,#1e3a8a,#2563eb)", position: "relative" }}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen style={{ width: 42, height: 42, color: "rgba(255,255,255,0.14)" }} />
            </div>
        }
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,23,42,0.22),transparent 55%)" }} />

        {/* Badges on thumbnail */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 5 }}>
          {isEnrolled
            ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9.5, fontWeight: 700, color: "#fff", background: "rgba(5,150,105,0.82)", backdropFilter: "blur(6px)", padding: "3px 8px", borderRadius: 6 }}>
                <CheckCircle style={{ width: 8, height: 8 }} /> Enrolled
              </span>
            : course.contentType === "free"
              ? <span style={{ fontSize: 9.5, fontWeight: 700, color: "#fff", background: "rgba(5,150,105,0.82)", backdropFilter: "blur(6px)", padding: "3px 8px", borderRadius: 6 }}>Free</span>
              : null
          }
          {course.certificateEnabled && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9.5, fontWeight: 700, color: "#fff", background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)", padding: "3px 8px", borderRadius: 6 }}>
              <Award style={{ width: 8, height: 8 }} /> Cert
            </span>
          )}
          {discountLabel && (
            <span style={{ fontSize: 9.5, fontWeight: 800, color: "#fff", background: "linear-gradient(135deg,#f97316,#ea580c)", padding: "3px 8px", borderRadius: 6, fontFamily: MONO }}>
              {discountLabel}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "14px 16px 16px", gap: 8 }}>
        {/* Category + difficulty */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
            padding: "2px 8px", borderRadius: 99,
            background: "rgba(37,99,235,0.07)", color: BRAND,
          }}>
            {CAT_LABEL[course.category] ?? course.category}
          </span>
          {course.difficulty && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9.5, fontWeight: 600, color: MUTED }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: DIFF_DOT[course.difficulty] ?? MUTED, display: "inline-block" }} />
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 15, fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.02em", margin: 0, color: INK,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {course.title}
        </h3>

        {/* Description */}
        {course.shortDescription && (
          <p style={{
            fontSize: 12.5, color: MUTED, lineHeight: 1.62, margin: 0,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {course.shortDescription}
          </p>
        )}

        <div style={{ flex: 1 }} />

        {/* Mentor + stats */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingTop: 9, borderTop: "1px solid rgba(15,23,42,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6, flexShrink: 0,
              background: `linear-gradient(135deg,${BRAND_DEEP},${BRAND})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 8.5, fontWeight: 700,
            }}>
              {inits}
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {course.mentorId.name}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {(course.analytics?.averageRating ?? 0) > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: MUTED, fontFamily: MONO }}>
                <Star style={{ width: 9, height: 9, color: "#f59e0b", fill: "#f59e0b" }} />
                {course.analytics!.averageRating.toFixed(1)}
              </span>
            )}
            {(course.modules?.length ?? 0) > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: MUTED, fontFamily: MONO }}>
                <BookOpen style={{ width: 9, height: 9 }} />
                {course.modules!.length} modules
              </span>
            )}
            {(course.totalDuration ?? 0) > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: MUTED, fontFamily: MONO }}>
                <Clock style={{ width: 9, height: 9 }} />
                {course.totalDuration}m
              </span>
            )}
          </div>
        </div>

        {/* Enrolled progress bar */}
        {isEnrolled && pct > 0 && pct < 100 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10.5, color: MUTED, fontWeight: 500 }}>Progress</span>
              <span style={{ fontSize: 10.5, color: green, fontWeight: 700, fontFamily: MONO }}>{pct}%</span>
            </div>
            <div style={{ height: 3, borderRadius: 99, background: "rgba(5,150,105,0.1)" }}>
              <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: `linear-gradient(90deg,#10b981,${green})` }} />
            </div>
          </div>
        )}

        {/* Price row + CTAs */}
        {isEnrolled ? (
          <Link href={enrollHref} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "9px 0", borderRadius: 10, fontSize: 12.5, fontWeight: 700, color: "#fff", textDecoration: "none",
            background: `linear-gradient(135deg,#10b981,${green})`,
            boxShadow: "0 4px 12px rgba(5,150,105,0.24)",
          }}>
            <Play style={{ width: 10, height: 10, fill: "#fff" }} />
            {pct >= 100 ? "Review course" : pct > 0 ? "Continue" : "Start learning"}
          </Link>
        ) : (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              {isPaid && (course.price ?? 0) > 0 ? (
                <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                  <span style={{ fontSize: 17, fontWeight: 800, color: BRAND, fontFamily: MONO, letterSpacing: "-0.02em" }}>₹{effectivePrice}</span>
                  {hasDiscount && <span style={{ fontSize: 11, color: MUTED, textDecoration: "line-through", fontFamily: MONO }}>₹{course.price}</span>}
                  <span style={{ fontSize: 9.5, color: MUTED }}>+GST</span>
                </div>
              ) : (
                <span style={{ fontSize: 15, fontWeight: 800, color: green }}>Free</span>
              )}
              <Link href={previewHref} style={{ fontSize: 11.5, fontWeight: 600, color: BRAND, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
                Preview <ArrowRight style={{ width: 10, height: 10 }} />
              </Link>
            </div>
            <Link href={enrollHref} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "9px 0", borderRadius: 10, fontSize: 12.5, fontWeight: 700, color: "#fff", textDecoration: "none",
              background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
              boxShadow: "0 4px 14px rgba(37,99,235,0.24)",
            }}>
              {isPaid ? <><Lock style={{ width: 10, height: 10 }} /> Enroll now</> : <><Play style={{ width: 10, height: 10, fill: "#fff" }} /> Enroll free</>}
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Coming-soon card ─── */
function ComingSoonCard({ item, delay = 0 }: { item: ComingSoonItem; delay?: number }) {
  const [notified, setNotified] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1], delay }}
      style={{
        display: "flex", flexDirection: "column",
        borderRadius: 18, overflow: "hidden",
        background: "#fff",
        border: "1.5px dashed rgba(100,116,139,0.28)",
      }}
    >
      {/* Muted thumbnail */}
      <div style={{ height: 160, flexShrink: 0, position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#f1f5f9,#e2e8f0)" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lock style={{ width: 30, height: 30, color: "rgba(100,116,139,0.25)" }} />
        </div>
        <div style={{ position: "absolute", top: 10, left: 10, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 6, background: INK, color: "#fff" }}>
          <CalendarClock style={{ width: 9, height: 9 }} /> Coming Soon
        </div>
        <div style={{ position: "absolute", bottom: 10, right: 10 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, color: MUTED, background: "rgba(255,255,255,0.72)", padding: "2px 8px", borderRadius: 6 }}>{item.eta}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "14px 16px 16px", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 99, background: "rgba(100,116,139,0.07)", color: MUTED }}>
            {CAT_LABEL[item.category] ?? item.category}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9.5, fontWeight: 600, color: MUTED }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: DIFF_DOT[item.difficulty] ?? MUTED, display: "inline-block" }} />
            {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
          </span>
        </div>
        <h3 style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.02em", margin: 0, color: INK }}>
          {item.title}
        </h3>
        <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.62, margin: 0, flex: 1 }}>
          {item.blurb}
        </p>
        <button
          type="button"
          onClick={() => setNotified(true)}
          disabled={notified}
          style={{
            marginTop: 4, padding: "9px 0", borderRadius: 10, width: "100%",
            fontSize: 12, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            border: notified ? "1.5px solid rgba(5,150,105,0.22)" : "1.5px solid rgba(37,99,235,0.18)",
            background: notified ? "#f0fdf4" : "rgba(37,99,235,0.05)",
            color: notified ? SUCCESS : BRAND,
            cursor: notified ? "default" : "pointer",
            transition: "all 0.18s", fontFamily: "inherit",
          }}
        >
          {notified ? <><BellRing style={{ width: 11, height: 11 }} /> We'll notify you</> : <><Bell style={{ width: 11, height: 11 }} /> Notify me</>}
        </button>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ height: 380, borderRadius: 18, overflow: "hidden", background: "#fff", border: "1px solid rgba(29,78,216,0.06)" }} className="animate-pulse">
      <div style={{ height: 178, background: "rgba(37,99,235,0.07)" }} />
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ width: "36%", height: 12, borderRadius: 6, background: "rgba(37,99,235,0.08)" }} />
        <div style={{ width: "88%", height: 14, borderRadius: 6, background: "rgba(15,23,42,0.07)" }} />
        <div style={{ width: "66%", height: 14, borderRadius: 6, background: "rgba(15,23,42,0.05)" }} />
        <div style={{ width: "100%", height: 28, borderRadius: 9, background: "rgba(37,99,235,0.06)", marginTop: 8 }} />
        <div style={{ width: "100%", height: 34, borderRadius: 10, background: "rgba(37,99,235,0.09)" }} />
      </div>
    </div>
  );
}

function FaqItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(29,78,216,0.08)" }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          padding: "16px 4px", background: "none", border: "none", cursor: "pointer",
          fontFamily: "inherit", textAlign: "left",
        }}
      >
        <span style={{ fontSize: 14.5, fontWeight: 700, color: INK, letterSpacing: "-0.01em" }}>{q}</span>
        <span style={{
          flexShrink: 0, width: 24, height: 24, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isOpen ? BRAND : "rgba(37,99,235,0.07)", transition: "background 0.18s",
        }}>
          {isOpen
            ? <Minus style={{ width: 11, height: 11, color: "#fff" }} />
            : <Plus style={{ width: 11, height: 11, color: BRAND }} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.7, margin: "0 4px 16px", maxWidth: 640 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
  const [sortBy, setSortBy]     = useState<"newest" | "rating" | "popular">("newest");
  const [openFaq, setOpenFaq]   = useState<number | null>(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  useEffect(() => {
    const token = getAuthToken();
    const publicFetch = fetch(`${API_URL}/advanced/courses/public?limit=100&sortBy=createdAt&sortOrder=desc`).then(r => r.json());
    const enrollFetch = token
      ? fetch(`${API_URL}/enrollments/my-enrollments`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => ({ success: false }))
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
    if (type === "free")  r = r.filter(c => c.contentType === "free");
    if (type === "paid")  r = r.filter(c => c.contentType !== "free");
    setFiltered(r);
  }, [courses, search, category, type]);

  const sortedFiltered = useMemo(() => {
    if (sortBy === "newest") return filtered;
    const arr = [...filtered];
    if (sortBy === "rating")  arr.sort((a, b) => (b.analytics?.averageRating ?? 0) - (a.analytics?.averageRating ?? 0));
    if (sortBy === "popular") arr.sort((a, b) => (b.analytics?.enrollments ?? 0) - (a.analytics?.enrollments ?? 0));
    return arr;
  }, [filtered, sortBy]);

  const featuredCourse   = courses.length > 0 ? courses[0] : null;
  const totalEnrollments = courses.reduce((s, c) => s + (c.analytics?.enrollments ?? 0), 0);
  const freeCnt          = courses.filter(c => c.contentType === "free").length;
  const hasFilters       = search || category || type;

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
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600;700&display=swap');
        .si:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
        .fs { appearance: none; }
        .fs:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .feat-enroll:hover { transform: translateY(-1px); box-shadow: 0 14px 34px rgba(0,0,0,0.38) !important; }
        .track-pill:hover { background: rgba(37,99,235,0.06) !important; border-color: rgba(37,99,235,0.24) !important; }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <div style={{ background: PAPER, fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: "100vh" }}>
        <Navbar />

        {/* ── Hero ── */}
        <section style={{
          position: "relative",
          paddingTop: "calc(var(--yic-header-h, 64px) + 60px)",
          paddingBottom: 60, overflow: "hidden", background: PAPER,
        }}>
          {/* Subtle dot grid */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
            backgroundImage: "radial-gradient(rgba(37,99,235,0.13) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 70% 55% at 50% 35%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 35%, black, transparent)",
          }} />
          <div style={{ position: "absolute", top: "-12%", right: "-2%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(29,78,216,0.07) 0%,transparent 68%)", filter: "blur(72px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-8%", left: "2%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(8,145,178,0.05) 0%,transparent 68%)", filter: "blur(72px)", pointerEvents: "none" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div style={{ display: "flex", gap: 52, alignItems: "flex-start", flexWrap: "wrap" }}>

              {/* Left — headline + CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ flex: "1 1 460px", minWidth: 0 }}
              >
                {/* Eyebrow pill */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 22,
                  padding: "6px 14px", borderRadius: 99,
                  background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.18)",
                }}>
                  <Sparkles size={11} style={{ color: BRAND }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: BRAND, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    All Courses
                  </span>
                </div>

                <h1 style={{
                  margin: "0 0 18px",
                  fontSize: "clamp(38px, 5.5vw, 68px)",
                  lineHeight: 1.02, letterSpacing: "-0.04em", fontWeight: 800, color: INK,
                }}>
                  Learn from{" "}
                  <span style={{ color: BRAND, position: "relative", display: "inline-block" }}>
                    the best.
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.72, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        position: "absolute", left: 0, right: 0, bottom: -5,
                        height: 4, borderRadius: 2,
                        background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DEEP})`,
                        transformOrigin: "left", display: "block",
                      }}
                    />
                  </span>
                </h1>

                <p style={{
                  fontSize: "clamp(14px, 1.2vw, 16px)", color: MUTED, lineHeight: 1.74,
                  maxWidth: 510, marginBottom: 30, fontWeight: 400,
                }}>
                  Expert-crafted courses for every stage of your job search — mock interviews, resume building, coding, GD, and more.
                  {!isLoggedIn && " Sign in to track progress and earn certificates."}
                </p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 34 }}>
                  <button
                    type="button"
                    onClick={scrollToGrid}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "13px 26px", borderRadius: 12, border: "none", cursor: "pointer",
                      fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "inherit",
                      background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DEEP})`,
                      boxShadow: "0 10px 26px rgba(37,99,235,0.32)",
                    }}
                  >
                    Explore courses <ArrowRight style={{ width: 14, height: 14 }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setType("free"); scrollToGrid(); }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "13px 22px", borderRadius: 12, cursor: "pointer",
                      fontSize: 14, fontWeight: 700, color: BRAND, fontFamily: "inherit",
                      background: "rgba(37,99,235,0.07)", border: "1.5px solid rgba(37,99,235,0.2)",
                    }}
                  >
                    <Play style={{ width: 12, height: 12, fill: BRAND }} /> Try free
                  </button>
                </div>

                {/* Stats */}
                {!isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.28 }}
                    style={{
                      display: "inline-flex", alignItems: "center",
                      gap: "clamp(16px,3vw,36px)", flexWrap: "wrap",
                      padding: "12px 22px", borderRadius: 99,
                      background: "#fff", border: "1px solid rgba(29,78,216,0.09)",
                      boxShadow: "0 4px 18px rgba(29,78,216,0.08)",
                    }}
                  >
                    {STATS.map(s => (
                      <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                        <span style={{ fontSize: "clamp(14px,1.6vw,18px)", fontWeight: 800, color: BRAND, letterSpacing: "-0.02em", fontFamily: MONO }}>{s.val}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Right — value prop cards */}
              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="hidden md:flex"
                style={{ flex: "0 0 300px", flexDirection: "column", gap: 10, paddingTop: 8 }}
              >
                {[
                  { icon: GraduationCap, title: "Mentor-led",  desc: "Industry professionals who've been there", color: BRAND },
                  { icon: Award,         title: "Certificates", desc: "Verifiable credentials on completion",    color: SUCCESS },
                  { icon: Clock,         title: "Self-paced",   desc: "Learn on your schedule, at your speed",  color: "#7c3aed" },
                ].map(v => {
                  const Icon = v.icon;
                  return (
                    <div key={v.title} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 16px", borderRadius: 14,
                      background: "#fff", border: "1px solid rgba(29,78,216,0.08)",
                      boxShadow: "0 2px 10px rgba(15,23,42,0.05)",
                    }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: `${v.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon style={{ width: 17, height: 17, color: v.color }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: INK, letterSpacing: "-0.01em" }}>{v.title}</div>
                        <div style={{ fontSize: 12, color: MUTED }}>{v.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Featured Course ── */}
        {!isLoading && featuredCourse && (
          <FeaturedCourse course={featuredCourse} isLoggedIn={isLoggedIn} />
        )}

        {/* ── Prep Track Pills ── */}
        <section style={{ background: PAPER, borderBottom: "1px solid rgba(29,78,216,0.07)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
            <div className="flex hide-scrollbar" style={{ gap: 7, overflowX: "auto", paddingBottom: 2 }}>
              {([{ value: "", label: "All tracks", icon: Sparkles }, ...PREP_TRACKS] as { value: string; label: string; icon: React.ElementType }[]).map(t => {
                const Icon = t.icon;
                const active = category === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    className="track-pill"
                    onClick={() => { setCategory(active && t.value !== "" ? "" : t.value); scrollToGrid(); }}
                    style={{
                      flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "8px 15px", borderRadius: 99, cursor: "pointer",
                      border: active ? `1.5px solid ${BRAND}` : "1.5px solid rgba(29,78,216,0.12)",
                      background: active ? BRAND : "#fff",
                      color: active ? "#fff" : INK,
                      fontSize: 12.5, fontWeight: 600, fontFamily: "inherit",
                      transition: "all 0.18s", whiteSpace: "nowrap",
                      boxShadow: active ? "0 4px 14px rgba(37,99,235,0.22)" : "none",
                    }}
                  >
                    <Icon size={12} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Sticky Filter Bar ── */}
        <div style={{
          background: "rgba(248,246,241,0.94)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(29,78,216,0.08)",
          position: "sticky", top: "var(--yic-header-h, 64px)", zIndex: 40,
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>

              {/* Search */}
              <div style={{ position: "relative", flex: "1 1 180px", minWidth: 0, maxWidth: 280 }}>
                <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "#94a3b8", pointerEvents: "none" }} />
                <input
                  type="text"
                  placeholder="Search courses…"
                  aria-label="Search courses"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="si"
                  style={{
                    width: "100%", paddingLeft: 32, paddingRight: search ? 30 : 11,
                    paddingTop: 8, paddingBottom: 8,
                    border: "1px solid rgba(29,78,216,0.16)", borderRadius: 10,
                    fontSize: 13, fontFamily: "inherit", color: INK,
                    background: "rgba(255,255,255,0.9)",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxSizing: "border-box",
                  }}
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")} aria-label="Clear search" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                    <X style={{ width: 12, height: 12, color: "#94a3b8" }} />
                  </button>
                )}
              </div>

              {/* Category */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <select value={category} onChange={e => setCategory(e.target.value)} className="fs" aria-label="Filter by category"
                  style={{ paddingLeft: 11, paddingRight: 30, paddingTop: 8, paddingBottom: 8, border: "1px solid rgba(29,78,216,0.16)", borderRadius: 10, fontSize: 13, fontFamily: "inherit", color: INK, background: "rgba(255,255,255,0.9)", cursor: "pointer" }}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <ChevronDown style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", width: 11, height: 11, color: "#94a3b8", pointerEvents: "none" }} />
              </div>

              {/* Sort */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <select value={sortBy} onChange={e => setSortBy(e.target.value as "newest" | "rating" | "popular")} className="fs" aria-label="Sort courses"
                  style={{ paddingLeft: 11, paddingRight: 30, paddingTop: 8, paddingBottom: 8, border: "1px solid rgba(29,78,216,0.16)", borderRadius: 10, fontSize: 13, fontFamily: "inherit", color: INK, background: "rgba(255,255,255,0.9)", cursor: "pointer" }}>
                  <option value="newest">Newest</option>
                  <option value="rating">Top rated</option>
                  <option value="popular">Most popular</option>
                </select>
                <ChevronDown style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", width: 11, height: 11, color: "#94a3b8", pointerEvents: "none" }} />
              </div>

              {/* Type pills */}
              <div style={{ display: "flex", gap: 5 }}>
                {(["", "free", "paid"] as const).map(t => (
                  <button key={t} type="button" onClick={() => setType(t)}
                    style={{
                      padding: "7px 13px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                      border: "1px solid", fontFamily: "inherit", cursor: "pointer",
                      borderColor: type === t ? BRAND : "rgba(29,78,216,0.14)",
                      background: type === t ? BRAND : "rgba(255,255,255,0.9)",
                      color: type === t ? "#fff" : MUTED,
                      transition: "all 0.16s",
                    }}
                  >
                    {t === "" ? "All" : t === "free" ? "Free" : "Paid"}
                  </button>
                ))}
              </div>

              {hasFilters && (
                <button type="button" onClick={() => { setSearch(""); setCategory(""); setType(""); }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 11px", borderRadius: 99, fontSize: 11.5, fontWeight: 600, border: "1px solid rgba(239,68,68,0.22)", background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontFamily: "inherit" }}>
                  <X style={{ width: 10, height: 10 }} /> Clear
                </button>
              )}

              {!isLoading && (
                <span style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 500, marginLeft: "auto", whiteSpace: "nowrap", fontFamily: MONO }}>
                  {sortedFiltered.length} course{sortedFiltered.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Course Grid ── */}
        <section ref={gridRef} style={{ background: PAPER, scrollMarginTop: "calc(var(--yic-header-h, 64px) + 60px)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : sortedFiltered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ borderRadius: 20, padding: "clamp(44px,6vw,76px) clamp(24px,6vw,56px)", textAlign: "center", background: "#fff", border: "1px solid rgba(29,78,216,0.08)" }}
              >
                <BookOpen style={{ width: 44, height: 44, color: "#cbd5e1", margin: "0 auto 14px" }} />
                <p style={{ color: INK, fontWeight: 700, fontSize: 17, marginBottom: 6, letterSpacing: "-0.02em" }}>
                  {courses.length === 0 ? "Courses coming soon" : "No courses match your filters"}
                </p>
                <p style={{ color: MUTED, fontSize: 13.5, lineHeight: 1.65 }}>
                  {courses.length === 0
                    ? "We're building something great — check back shortly."
                    : "Try clearing the search or changing the category."}
                </p>
                {hasFilters && (
                  <button type="button" onClick={() => { setSearch(""); setCategory(""); setType(""); }}
                    style={{ marginTop: 18, padding: "10px 24px", borderRadius: 12, background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", border: "none", fontFamily: "inherit", boxShadow: "0 6px 18px rgba(37,99,235,0.26)" }}>
                    Clear filters
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <AnimatePresence mode="popLayout">
                  {sortedFiltered.map((c, i) => (
                    <CourseCard key={c._id} course={c} delay={Math.min(i * 0.03, 0.18)} isLoggedIn={isLoggedIn} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>

        {/* ── Coming Soon ── */}
        <section style={{ background: PAPER }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>
                  <CalendarClock style={{ width: 11, height: 11 }} /> In the works
                </span>
                <h2 style={{ fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: INK, letterSpacing: "-0.025em", margin: 0 }}>
                  Coming soon
                </h2>
              </div>
              <p style={{ maxWidth: 400, color: MUTED, fontSize: 13, lineHeight: 1.65, margin: 0 }}>
                Soft-skill tracks in the works — communication, leadership, EQ, and more. Tap notify and we'll ping you the moment one goes live.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {COMING_SOON.map((item, i) => <ComingSoonCard key={item.id} item={item} delay={Math.min(i * 0.04, 0.2)} />)}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section style={{ background: "#fff", borderTop: "1px solid rgba(29,78,216,0.07)", borderBottom: "1px solid rgba(29,78,216,0.07)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
            <div style={{ textAlign: "center", marginBottom: 42 }}>
              <h2 style={{ fontSize: "clamp(22px,2.8vw,30px)", fontWeight: 800, color: INK, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
                How a track works
              </h2>
              <p style={{ color: MUTED, fontSize: 13.5, maxWidth: 450, margin: "0 auto" }}>
                The same three steps for every course — free or paid.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8" style={{ maxWidth: 860, margin: "0 auto" }}>
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: BRAND, letterSpacing: "0.04em" }}>{s.n}</span>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: INK, margin: "7px 0 6px", letterSpacing: "-0.015em" }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.67, margin: 0 }}>{s.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ background: PAPER }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <HelpCircle style={{ width: 17, height: 17, color: BRAND }} />
              <h2 style={{ fontSize: "clamp(20px,2.4vw,24px)", fontWeight: 700, color: INK, letterSpacing: "-0.025em", margin: 0 }}>
                Frequently asked
              </h2>
            </div>
            <div style={{ maxWidth: 700, background: "#fff", border: "1px solid rgba(29,78,216,0.09)", borderRadius: 18, padding: "4px 18px", boxShadow: "0 4px 18px rgba(29,78,216,0.05)" }}>
              {FAQS.map((f, i) => (
                <FaqItem key={f.q} q={f.q} a={f.a} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Guest CTA ── */}
        {!isLoggedIn && !isLoading && (
          <section style={{ background: PAPER }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  borderRadius: 22,
                  padding: "clamp(26px,4vw,40px) clamp(20px,5vw,48px)",
                  background: `linear-gradient(135deg, ${INK} 0%, #172554 55%, ${BRAND_DEEP} 100%)`,
                  display: "flex", flexWrap: "wrap", alignItems: "center",
                  justifyContent: "space-between", gap: 20, position: "relative", overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: "-25%", right: "6%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,0.22) 0%,transparent 68%)", pointerEvents: "none" }} />
                <div style={{ position: "relative" }}>
                  <p style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(16px,2vw,21px)", margin: "0 0 6px", letterSpacing: "-0.025em" }}>
                    Full access — sign in once, learn forever.
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 13.5, margin: 0 }}>
                    Track progress, earn certificates, and unlock every premium course.
                  </p>
                </div>
                <Link
                  href="/login?redirect=/dashboard/content"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "13px 28px", borderRadius: 12, flexShrink: 0,
                    background: "#fff", color: INK, fontWeight: 700, fontSize: 14, textDecoration: "none",
                    boxShadow: "0 10px 28px rgba(0,0,0,0.32)", position: "relative",
                  }}
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