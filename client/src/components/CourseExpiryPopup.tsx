"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Play, Lock, Star, Clock, BookOpen, Tag } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const DISMISSED_KEY = "yic_expiry_popup_dismissed";

interface Course {
  _id: string;
  title: string;
  shortDescription?: string;
  contentType: "free" | "paid" | "exclusive";
  price?: number;
  discount?: { type: string; value: number; isActive: boolean };
  thumbnail?: string;
  totalDuration?: number;
  analytics?: { enrollments: number; averageRating: number };
  mentorId?: { name: string; designation?: string };
  modules?: { title: string }[];
}

function fmtDuration(mins: number) {
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}

export default function CourseExpiryPopup() {
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);

  /* fetch first published course */
  useEffect(() => {
    fetch(`${API_URL}/advanced/courses/public?limit=1&sortBy=createdAt&sortOrder=desc`)
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.courses?.[0]) setCourse(d.data.courses[0]); })
      .catch(() => {});
  }, []);

  /* listen for banner expiry event */
  useEffect(() => {
    const handler = () => {
      const dismissed = (() => { try { return sessionStorage.getItem(DISMISSED_KEY) === "1"; } catch { return false; } })();
      if (!dismissed) setOpen(true);
    };
    window.addEventListener("yic:banner-expired", handler);
    return () => window.removeEventListener("yic:banner-expired", handler);
  }, []);

  function close() {
    try { sessionStorage.setItem(DISMISSED_KEY, "1"); } catch {}
    setOpen(false);
  }

  if (!open || !course) return null;

  const isPaid = course.contentType === "paid" || course.contentType === "exclusive";
  const hasDiscount = isPaid && course.discount?.isActive && course.discount.type !== "none" && (course.discount.value ?? 0) > 0;
  const discAmt = hasDiscount
    ? course.discount!.type === "percentage"
      ? Math.round(((course.price ?? 0) * course.discount!.value) / 100)
      : course.discount!.value
    : 0;
  const effective = hasDiscount ? Math.max(0, (course.price ?? 0) - discAmt) : (course.price ?? 0);
  const moduleCount = course.modules?.length ?? 0;

  return (
    <>
      <style>{`
        @keyframes yic-popup-in {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: none; }
        }
        .yic-popup-card {
          animation: yic-popup-in 0.32s cubic-bezier(0.22,1,0.36,1) both;
        }
      `}</style>

      {/* backdrop */}
      <div
        onClick={close}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(15,23,42,0.55)",
          backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
        }}
      />

      {/* card */}
      <div className="yic-popup-card" style={{
        position: "fixed", zIndex: 9999,
        bottom: "clamp(16px,3vw,32px)", right: "clamp(16px,3vw,32px)",
        width: "clamp(300px,90vw,380px)",
        background: "#fff", borderRadius: 20,
        boxShadow: "0 24px 60px rgba(15,23,42,0.28), 0 4px 20px rgba(37,99,235,0.14)",
        border: "1.5px solid rgba(37,99,235,0.18)",
        overflow: "hidden",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        {/* top accent bar */}
        <div style={{ height: 3, background: "linear-gradient(90deg,#2563eb,#1d4ed8)" }} />

        {/* dismiss */}
        <button
          onClick={close}
          style={{
            position: "absolute", top: 12, right: 12, zIndex: 2,
            width: 28, height: 28, borderRadius: "50%",
            background: "rgba(15,23,42,0.06)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X style={{ width: 14, height: 14, color: "#64748b" }} />
        </button>

        {/* thumbnail */}
        <div style={{ position: "relative", paddingTop: "48%", background: "linear-gradient(135deg,#0f172a,#1d4ed8)" }}>
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen style={{ width: 40, height: 40, color: "rgba(255,255,255,0.15)" }} />
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,23,42,0.5) 0%,transparent 50%)" }} />
          {/* pill label */}
          <div style={{ position: "absolute", top: 10, left: 10,
            background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff",
            fontSize: 9.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "4px 10px", borderRadius: 99, boxShadow: "0 2px 8px rgba(37,99,235,0.4)" }}>
            ★ Featured Course
          </div>
          {/* price in thumbnail */}
          {isPaid && (course.price ?? 0) > 0 && (
            <div style={{ position: "absolute", bottom: 10, right: 10,
              background: "rgba(15,23,42,0.82)", backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
              padding: "5px 10px", display: "flex", alignItems: "baseline", gap: 5 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>₹{effective.toLocaleString("en-IN")}</span>
              {hasDiscount && (
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "line-through" }}>
                  ₹{course.price?.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          )}
        </div>

        {/* body */}
        <div style={{ padding: "16px 18px 18px" }}>
          {/* expiry message */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12,
            background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.14)",
            borderRadius: 8, padding: "7px 10px" }}>
            <span style={{ fontSize: 14 }}>⏰</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#1d4ed8" }}>
              Offer expired — but the course is still available!
            </span>
          </div>

          <h3 style={{ fontSize: 15.5, fontWeight: 800, color: "#0f172a", margin: "0 0 6px",
            lineHeight: 1.3, letterSpacing: "-0.02em",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {course.title}
          </h3>

          {course.shortDescription && (
            <p style={{ fontSize: 12.5, color: "#64748b", margin: "0 0 10px", lineHeight: 1.55,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {course.shortDescription}
            </p>
          )}

          {/* meta */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            {(course.analytics?.averageRating ?? 0) > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}>
                <Star style={{ width: 11, height: 11, fill: "#f59e0b", color: "#f59e0b" }} />
                <b style={{ color: "#0f172a" }}>{course.analytics!.averageRating.toFixed(1)}</b>
              </span>
            )}
            {(course.totalDuration ?? 0) > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}>
                <Clock style={{ width: 11, height: 11 }} />{fmtDuration(course.totalDuration!)}
              </span>
            )}
            {moduleCount > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}>
                <BookOpen style={{ width: 11, height: 11 }} />{moduleCount} modules
              </span>
            )}
          </div>

          {/* discount badge */}
          {hasDiscount && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14,
              padding: "7px 10px", borderRadius: 8, background: "rgba(5,150,105,0.06)",
              border: "1px solid rgba(5,150,105,0.15)" }}>
              <Tag style={{ width: 12, height: 12, color: "#059669", flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>
                Save ₹{discAmt.toLocaleString("en-IN")} —&nbsp;
                {course.discount!.type === "percentage" ? `${course.discount!.value}% off` : `₹${course.discount!.value} off`}
              </span>
            </div>
          )}

          {/* CTAs */}
          <div style={{ display: "flex", gap: 8 }}>
            <Link href={`/courses/${course._id}`} onClick={close} style={{
              flex: 1, padding: "10px 0", borderRadius: 10,
              fontSize: 13, fontWeight: 700, color: "#2563eb",
              background: "rgba(37,99,235,0.06)", border: "1.5px solid rgba(37,99,235,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              textDecoration: "none",
            }}>
              <Play style={{ width: 11, height: 11, fill: "#2563eb" }} /> Preview
            </Link>
            <Link href={isPaid ? `/dashboard/checkout/${course._id}` : `/dashboard/content/${course._id}`} onClick={close} style={{
              flex: 1.4, padding: "10px 0", borderRadius: 10,
              fontSize: 13, fontWeight: 700, color: "#fff",
              background: isPaid ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "linear-gradient(135deg,#059669,#047857)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              textDecoration: "none",
              boxShadow: isPaid ? "0 4px 14px rgba(37,99,235,0.3)" : "0 4px 14px rgba(5,150,105,0.3)",
            }}>
              {isPaid
                ? <><Lock style={{ width: 11, height: 11 }} /> Enroll Now</>
                : <><Play style={{ width: 11, height: 11, fill: "#fff" }} /> Enroll Free</>}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}