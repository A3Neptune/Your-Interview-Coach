"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Clock, Play, Lock, BookOpen, Award, ChevronRight,
  Users, Star, CheckCircle, LogIn,
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

const FREE_PREVIEW_COUNT = 2;

const CAT_LABEL: Record<string, string> = {
  "mock-interview":  "Mock Interview",
  "resume-building": "Resume Building",
  "gd-practice":     "Group Discussion",
  "placement-prep":  "Placement Prep",
  "coding":          "Coding",
  "behavioral":      "Behavioral",
  "career-growth":   "Career Growth",
  "skills":          "Skills",
  "system-design":   "System Design",
};

interface Resource {
  type: string;
  title: string;
  url?: string;
  duration?: number;
  description?: string;
}

interface Module {
  _id?: string;
  title: string;
  description?: string;
  order: number;
  resources?: Resource[];
}

interface Course {
  _id: string;
  title: string;
  shortDescription?: string;
  fullDescription?: string;
  contentType: "free" | "paid" | "exclusive";
  category: string;
  difficulty?: string;
  price?: number;
  thumbnail?: string;
  totalDuration?: number;
  certificateEnabled?: boolean;
  tags?: string[];
  modules?: Module[];
  analytics?: { enrollments: number; averageRating: number; totalRatings: number };
  mentorId: { _id: string; name: string; designation: string; company: string };
}

function getYtVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
    if (/youtube\.com/.test(u.hostname)) return u.searchParams.get("v");
  } catch {}
  return null;
}

function buildYtEmbed(url: string): string | null {
  const vid = getYtVideoId(url);
  if (vid) return `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1`;
  try {
    const u = new URL(url);
    const list = u.searchParams.get("list");
    if (list) return `https://www.youtube.com/embed/videoseries?list=${list}&rel=0`;
  } catch {}
  return null;
}

function getYtThumb(url: string): string | null {
  const vid = getYtVideoId(url);
  return vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : null;
}

export default function PublicCourseDetailPage() {
  const params    = useParams();
  const router    = useRouter();
  const courseId  = params.courseId as string;
  const { isLoggedIn } = useAuth();

  const [course, setCourse]     = useState<Course | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [lessons, setLessons]   = useState<Array<{ title: string; duration: number; index: number; url?: string; isYT: boolean }>>([]);
  const [selected, setSelected] = useState<typeof lessons[0] | null>(null);
  const [playing, setPlaying]   = useState(false);

  useEffect(() => { setPlaying(false); }, [selected?.index]);

  useEffect(() => {
    fetch(`${API_URL}/advanced/courses/public/${courseId}`)
      .then(r => r.json())
      .then(d => {
        if (!d.success) { router.push("/courses"); return; }
        const cd: Course = d.data;
        setCourse(cd);

        // flatten modules → flat lesson list
        const flat: typeof lessons = [];
        cd.modules?.forEach(mod => {
          mod.resources?.forEach(r => {
            flat.push({
              title: r.title || mod.title,
              duration: r.duration || 0,
              index: flat.length,
              url: r.url,
              isYT: /youtube\.com|youtu\.be/i.test(r.url || ""),
            });
          });
        });
        setLessons(flat);
        if (flat.length > 0) setSelected(flat[0]);
      })
      .catch(() => router.push("/courses"))
      .finally(() => setLoading(false));
  }, [courseId, router]);

  if (isLoading) return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ minHeight: "100vh", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid rgba(37,99,235,0.2)", borderTopColor: BRAND, animation: "spin 0.7s linear infinite" }} />
      </div>
    </>
  );

  if (!course) return null;

  const isPaid     = course.contentType === "paid" || course.contentType === "exclusive";
  const initials   = course.mentorId.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const enrollHref = `/login?redirect=/dashboard/content/${courseId}`;
  const dashHref   = `/dashboard/content/${courseId}`;

  const canPreview = (idx: number) => idx < FREE_PREVIEW_COUNT;

  // ── Player ────────────────────────────────────────────────────────────────
  const renderPreviewPlayer = () => {
    if (!selected) return (
      <div style={{ borderRadius: 20, aspectRatio: "16/9", background: "rgba(255,255,255,0.72)", border: "1px solid rgba(29,78,216,0.09)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <BookOpen style={{ width: 44, height: 44, color: "#cbd5e1" }} />
      </div>
    );

    const isLocked = !canPreview(selected.index);

    if (isLocked) return (
      <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(29,78,216,0.14)" }}>
        <div style={{ position: "relative", aspectRatio: "16/9", background: "linear-gradient(135deg,#1e3a8a,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.55)" }} />
          <div style={{ position: "relative", textAlign: "center", color: "#fff" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 12px", background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock style={{ width: 26, height: 26 }} />
            </div>
            <p style={{ fontWeight: 700, fontSize: 17, margin: 0 }}>Lesson Locked</p>
            <p style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
              {isPaid ? `Enroll for ₹${course.price} to unlock all ${lessons.length} lessons` : "Sign in to access this lesson"}
            </p>
          </div>
        </div>
        <div style={{ padding: "20px 24px", textAlign: "center", background: "#fff" }}>
          <Link href={isLoggedIn ? dashHref : enrollHref} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 28px", borderRadius: 13,
            background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
            color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
            boxShadow: "0 10px 28px rgba(37,99,235,0.32)",
          }}>
            {isLoggedIn
              ? <><Play style={{ width: 13, height: 13, fill: "#fff" }} /> {isPaid ? `Enroll — ₹${course.price}` : "Enroll for Free"}</>
              : <><LogIn style={{ width: 13, height: 13 }} /> Sign in to enroll</>
            }
          </Link>
        </div>
      </div>
    );

    if (!selected.url) return (
      <div style={{ borderRadius: 20, aspectRatio: "16/9", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Play style={{ width: 44, height: 44, color: "rgba(255,255,255,0.3)" }} />
      </div>
    );

    const embedUrl = selected.isYT ? buildYtEmbed(selected.url) : null;
    const thumb    = selected.isYT ? getYtThumb(selected.url) : null;

    return (
      <div style={{ borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid rgba(29,78,216,0.1)", boxShadow: "0 4px 20px rgba(29,78,216,0.07)" }}>
        {/* Video area */}
        <div style={{ position: "relative", aspectRatio: "16/9", background: "#0f172a", overflow: "hidden" }}>
          {selected.isYT && embedUrl && playing ? (
            <iframe
              src={embedUrl}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={selected.title}
            />
          ) : thumb ? (
            <>
              <img src={thumb} alt={selected.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
              <button onClick={() => setPlaying(true)} style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: 68, height: 68, borderRadius: "50%", background: "rgba(255,255,255,0.95)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                }}>
                  <Play style={{ width: 28, height: 28, fill: "#dc2626", color: "#dc2626", marginLeft: 4 }} />
                </div>
              </button>
              {/* FREE PREVIEW badge */}
              <div style={{ position: "absolute", top: 12, left: 12 }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, color: "#fff",
                  background: "linear-gradient(135deg,#10b981,#059669)",
                  padding: "4px 10px", borderRadius: 99,
                  boxShadow: "0 2px 8px rgba(16,185,129,0.4)",
                }}>FREE PREVIEW</span>
              </div>
            </>
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Play style={{ width: 44, height: 44, color: "rgba(255,255,255,0.3)" }} />
            </div>
          )}
        </div>

        {/* Title + play button below video */}
        <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 14.5, fontWeight: 700, color: INK, margin: 0 }}>{selected.title}</p>
            {selected.duration > 0 && (
              <p style={{ fontSize: 11, color: MUTED, margin: "4px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                <Clock style={{ width: 10, height: 10 }} /> {selected.duration} min
              </p>
            )}
          </div>
          {selected.isYT && !playing && embedUrl && (
            <button onClick={() => setPlaying(true)} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 10,
              background: "linear-gradient(135deg,#dc2626,#b91c1c)",
              color: "#fff", fontWeight: 700, fontSize: 12.5, border: "none",
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 4px 14px rgba(220,38,38,0.3)",
            }}>
              <Play style={{ width: 11, height: 11, fill: "#fff" }} /> Play Preview
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        .lesson-row:hover { background: rgba(37,99,235,0.05) !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: PAPER, fontFamily: "'DM Sans',system-ui,sans-serif" }}>
        {/* Ambient */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "8%", left: "5%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(29,78,216,0.05) 0%,transparent 70%)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", bottom: "12%", right: "5%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(8,145,178,0.04) 0%,transparent 70%)", filter: "blur(80px)" }} />
        </div>

        <Navbar />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "calc(var(--yic-header-h,64px) + 24px) clamp(14px,3vw,24px) 48px" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
            <Link href="/courses" style={{
              display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: BRAND, textDecoration: "none",
              padding: "5px 12px", borderRadius: 10, background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.15)",
            }}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> All Courses
            </Link>
            <ChevronRight style={{ width: 12, height: 12, color: "#94a3b8" }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: INK, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.title}</span>
          </div>

          {/* ── BENTO GRID ── */}
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr" }} className="lg:bento-public">
            <style>{`
              @media(min-width:1024px){
                .lg\\:bento-public { grid-template-columns: 1fr 340px !important; grid-template-rows: auto 1fr !important; }
                .bp-player  { grid-column:1; grid-row:1; }
                .bp-lessons { grid-column:1; grid-row:2; }
                .bp-info    { grid-column:2; grid-row:1 / 3; }
              }
            `}</style>

            {/* ── Player ── */}
            <div className="bp-player">
              {renderPreviewPlayer()}
            </div>

            {/* ── Lessons bento ── */}
            {lessons.length > 0 && (
              <div className="bp-lessons" style={{
                borderRadius: 20, background: "rgba(255,255,255,0.88)",
                border: "1px solid rgba(29,78,216,0.12)", boxShadow: "0 4px 20px rgba(29,78,216,0.07)",
                overflow: "hidden",
              }}>
                {/* Header */}
                <div style={{
                  padding: "14px 20px", borderBottom: "1px solid rgba(29,78,216,0.08)",
                  background: "linear-gradient(to right,rgba(37,99,235,0.04),transparent)",
                  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BookOpen style={{ width: 14, height: 14, color: BRAND }} />
                    <h3 style={{ fontSize: 13.5, fontWeight: 700, color: INK, margin: 0 }}>
                      Lessons <span style={{ fontWeight: 500, color: "#94a3b8" }}>({lessons.length})</span>
                    </h3>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "3px 9px", borderRadius: 99 }}>
                    {FREE_PREVIEW_COUNT} free previews
                  </span>
                </div>

                {/* Tile grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 1, background: "rgba(29,78,216,0.07)" }}>
                  {lessons.map((l, i) => {
                    const preview = canPreview(i);
                    const active  = selected?.index === i;

                    return (
                      <button
                        key={i}
                        onClick={() => setSelected(l)}
                        className={preview ? "lesson-row" : ""}
                        disabled={!preview}
                        style={{
                          background: active ? "rgba(37,99,235,0.08)" : "#fff",
                          border: "none",
                          borderLeft: active ? `3px solid ${BRAND}` : "3px solid transparent",
                          padding: "15px 15px 13px",
                          textAlign: "left",
                          cursor: preview ? "pointer" : "not-allowed",
                          opacity: preview ? 1 : 0.55,
                          fontFamily: "inherit",
                          display: "flex", flexDirection: "column", gap: 8,
                          transition: "background 0.14s, border-color 0.14s",
                          minHeight: 90, position: "relative",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{
                            width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            ...(preview && active
                              ? { background: BRAND }
                              : preview
                                ? { background: "#f0fdf4", border: "1.5px solid #6ee7b7" }
                                : { background: "#f1f5f9", border: "1.5px solid #e2e8f0" }
                            ),
                          }}>
                            {!preview
                              ? <Lock style={{ width: 9, height: 9, color: "#94a3b8" }} />
                              : active
                                ? <Play style={{ width: 8, height: 8, color: "#fff", fill: "#fff", marginLeft: 1 }} />
                                : <Play style={{ width: 8, height: 8, color: "#10b981", fill: "#10b981", marginLeft: 1 }} />
                            }
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            {preview && (
                              <span style={{ fontSize: 8.5, fontWeight: 700, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "1px 5px", borderRadius: 99 }}>FREE</span>
                            )}
                            {l.duration > 0 && (
                              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>
                                <Clock style={{ width: 9, height: 9 }} />{l.duration}m
                              </span>
                            )}
                          </div>
                        </div>

                        <p style={{
                          fontSize: 12, fontWeight: active ? 700 : 600,
                          color: active ? BRAND_DEEP : preview ? INK : "#94a3b8",
                          margin: 0, lineHeight: 1.4,
                          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                        }}>
                          {l.title}
                        </p>

                        {!preview && (
                          <span style={{ fontSize: 9.5, color: "#94a3b8", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                            <Lock style={{ width: 8, height: 8 }} /> Sign in to unlock
                          </span>
                        )}

                        {active && preview && (
                          <div style={{ position: "absolute", bottom: 9, right: 11, width: 6, height: 6, borderRadius: "50%", background: BRAND, boxShadow: "0 0 0 2px rgba(37,99,235,0.2)" }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Course Info (right col) ── */}
            <div className="bp-info" style={{
              borderRadius: 20, background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(29,78,216,0.12)", boxShadow: "0 4px 20px rgba(29,78,216,0.07)",
              overflow: "hidden", display: "flex", flexDirection: "column",
            }}>
              <div style={{ height: 3, background: `linear-gradient(90deg,${BRAND},${BRAND_DEEP})` }} />
              <div style={{ padding: "20px 20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Category + title */}
                <div>
                  <span style={{
                    display: "inline-block", fontSize: 10, fontWeight: 700,
                    color: BRAND, background: "#eff6ff", border: "1px solid #bfdbfe",
                    padding: "2px 9px", borderRadius: 99, textTransform: "capitalize", marginBottom: 8,
                  }}>
                    {CAT_LABEL[course.category] ?? course.category.replace(/-/g, " ")}
                  </span>
                  <h1 style={{ fontSize: "clamp(16px,1.5vw,19px)", fontWeight: 700, color: INK, margin: 0, letterSpacing: "-0.022em", lineHeight: 1.3 }}>
                    {course.title}
                  </h1>
                  {course.shortDescription && (
                    <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.65, margin: "8px 0 0" }}>{course.shortDescription}</p>
                  )}
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {(course.analytics?.enrollments ?? 0) > 0 && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: MUTED }}>
                      <Users style={{ width: 12, height: 12 }} /> {course.analytics!.enrollments.toLocaleString("en-IN")} enrolled
                    </span>
                  )}
                  {(course.analytics?.averageRating ?? 0) > 0 && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: MUTED }}>
                      <Star style={{ width: 12, height: 12, color: "#f59e0b", fill: "#f59e0b" }} /> {course.analytics!.averageRating.toFixed(1)}
                    </span>
                  )}
                  {(course.totalDuration ?? 0) > 0 && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: MUTED }}>
                      <Clock style={{ width: 12, height: 12 }} /> {course.totalDuration} min
                    </span>
                  )}
                  {course.certificateEnabled && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 8px", borderRadius: 99 }}>
                      <Award style={{ width: 10, height: 10 }} /> Certificate
                    </span>
                  )}
                </div>

                {/* Price + CTA */}
                <div style={{ borderRadius: 16, padding: "16px", background: "rgba(37,99,235,0.04)", border: "1px solid rgba(29,78,216,0.1)" }}>
                  {isPaid ? (
                    <>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
                        <span style={{ fontSize: 28, fontWeight: 800, color: INK, letterSpacing: "-0.03em" }}>
                          {(course.price ?? 0) > 0 ? `₹${course.price}` : "Paid"}
                        </span>
                        {(course.price ?? 0) > 0 && <span style={{ fontSize: 11, color: MUTED }}>+ GST</span>}
                      </div>
                      <Link href={isLoggedIn ? dashHref : enrollHref} style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "12px 0", borderRadius: 13,
                        background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
                        color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
                        boxShadow: "0 8px 24px rgba(37,99,235,0.30)",
                      }}>
                        {isLoggedIn ? <><Lock style={{ width: 13, height: 13 }} /> Enroll Now</> : <><LogIn style={{ width: 13, height: 13 }} /> Sign in to Enroll</>}
                      </Link>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#059669", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 5 }}>
                        <CheckCircle style={{ width: 14, height: 14, fill: "#059669" }} /> Free Course
                      </p>
                      <Link href={isLoggedIn ? dashHref : enrollHref} style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "12px 0", borderRadius: 13,
                        background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
                        color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
                        boxShadow: "0 8px 24px rgba(37,99,235,0.28)",
                      }}>
                        {isLoggedIn ? <><Play style={{ width: 13, height: 13, fill: "#fff" }} /> Start Free</> : <><LogIn style={{ width: 13, height: 13 }} /> Sign in to Start</>}
                      </Link>
                    </>
                  )}
                </div>

                {/* What's included */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 10px" }}>What's included</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {[
                      `${lessons.length} lesson${lessons.length !== 1 ? "s" : ""}`,
                      course.certificateEnabled ? "Certificate on completion" : null,
                      course.difficulty ? `${course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)} level` : null,
                      `${FREE_PREVIEW_COUNT} free preview lessons`,
                    ].filter(Boolean).map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <CheckCircle style={{ width: 13, height: 13, color: "#059669", fill: "#059669", flexShrink: 0 }} />
                        <span style={{ fontSize: 12.5, color: INK }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructor */}
                <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid rgba(29,78,216,0.08)" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 10px" }}>Instructor</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                      background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 13, fontWeight: 700,
                      boxShadow: "0 3px 10px rgba(29,78,216,0.25)",
                    }}>{initials}</div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: INK, margin: 0 }}>{course.mentorId.name}</p>
                      <p style={{ fontSize: 11, color: MUTED, margin: "2px 0 0" }}>{course.mentorId.designation}</p>
                      {course.mentorId.company && <p style={{ fontSize: 10.5, color: BRAND, fontWeight: 600, margin: "1px 0 0" }}>{course.mentorId.company}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <StandardFooter />
      </div>
    </>
  );
}