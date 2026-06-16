"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Clock, CheckCircle, ExternalLink, Play, Lock, BookOpen,
  Award, ChevronRight, TrendingUp, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { getAuthToken, removeAuthToken } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const BRAND      = "#2563eb";
const BRAND_DEEP = "#1d4ed8";
const PAPER      = "#F8F6F1";
const INK        = "#0f172a";
const MUTED      = "#64748b";

interface Content {
  _id: string;
  title: string;
  description: string;
  contentType: "google-doc" | "google-sheet" | "video-link" | "pdf" | "other";
  embedUrl?: string;
  videoUrl?: string;
  duration: number;
  order: number;
  moduleTitle?: string;
  moduleIndex?: number;
}

interface Course {
  _id: string;
  title: string;
  shortDescription?: string;
  contentType: "free" | "paid" | "exclusive";
  category: string;
  difficulty?: string;
  price?: number;
  modules?: Array<{
    _id?: string;
    title: string;
    description?: string;
    order: number;
    resources?: Array<{
      _id?: string;
      type: string;
      title: string;
      url?: string;
      embedUrl?: string;
      duration?: number;
      description?: string;
    }>;
  }>;
  mentorId: {
    _id: string;
    name: string;
    designation: string;
    company: string;
  };
}

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

// ── YouTube helpers ────────────────────────────────────────────────────────
function getYtVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
    if (/youtube\.com/.test(u.hostname)) return u.searchParams.get("v");
  } catch {}
  return null;
}
function getYtPlaylistId(url: string): string | null {
  try { return new URL(url).searchParams.get("list"); } catch { return null; }
}
function buildYtEmbedUrl(rawUrl: string): string | null {
  const vid = getYtVideoId(rawUrl);
  if (vid) return `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1`;
  const list = getYtPlaylistId(rawUrl);
  if (list) return `https://www.youtube.com/embed/videoseries?list=${list}&rel=0`;
  return null;
}
function getYtThumb(rawUrl: string): string | null {
  const vid = getYtVideoId(rawUrl);
  return vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : null;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function CourseDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse]             = useState<Course | null>(null);
  const [contents, setContents]         = useState<Content[]>([]);
  const [selected, setSelected]         = useState<Content | null>(null);
  const [isLoading, setLoading]         = useState(true);
  const [isEnrolled, setIsEnrolled]     = useState(false);
  const [isEnrolling, setEnrolling]     = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [completedItems, setCompleted]  = useState<Set<string>>(new Set());
  const [playing, setPlaying]           = useState(false);

  useEffect(() => { setPlaying(false); }, [selected?._id]);

  useEffect(() => {
    const load = async () => {
      const token = getAuthToken();
      if (!token) { router.push("/login"); return; }
      setLoading(true);
      try {
        const res  = await fetch(`${API_URL}/advanced/courses/published/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed");
        const cd = data.data;
        setCourse(cd);

        const items: Content[] = [];
        cd.modules?.forEach((mod: any, mi: number) => {
          mod.resources?.forEach((r: any, ri: number) => {
            items.push({
              _id: `${mod._id || mi}-${r._id || ri}`,
              title: r.title || r.type,
              description: r.description || mod.description || "",
              contentType: (r.type === "video" || r.type === "youtube") ? "video-link" : "other",
              embedUrl: r.embedUrl || r.url,
              videoUrl: r.url,
              duration: r.duration || 0,
              order: r.order || ri,
              moduleTitle: mod.title,
              moduleIndex: mi,
            });
          });
        });
        setContents(items);
        if (items.length > 0) setSelected(items[0]);

        const er = await fetch(`${API_URL}/enrollments/${courseId}/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ed = await er.json();
        if (ed.success) setIsEnrolled(ed.isEnrolled);
      } catch (err: any) {
        if (err.response?.status === 401 || err.message?.includes("token")) {
          removeAuthToken(); router.push("/login");
        } else if (err.response?.status === 403) {
          toast.error("Purchase this course to access it");
          router.push("/dashboard/content");
        } else {
          toast.error("Failed to load course");
          router.push("/dashboard/content");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId, router]);

  useEffect(() => {
    if (!courseId) return;
    try {
      const saved = localStorage.getItem(`completed_items_${courseId}`);
      if (saved) setCompleted(new Set(JSON.parse(saved)));
    } catch {}
  }, [courseId]);

  useEffect(() => {
    if (!isEnrolled || contents.length === 0) return;
    const pct   = Math.round((completedItems.size / contents.length) * 100);
    const token = getAuthToken();
    if (!token) return;
    fetch(`${API_URL}/enrollments/${courseId}/progress`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ progress: pct }),
    }).catch(() => {});
  }, [completedItems, contents, isEnrolled, courseId]);

  const toggleDone = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(`completed_items_${courseId}`, JSON.stringify([...next]));
      return next;
    });
  };

  const handleEnroll = async () => {
    if (!course) return;
    if (course.contentType === "paid" || course.contentType === "exclusive") {
      setShowModal(true); return;
    }
    try {
      setEnrolling(true);
      const token = getAuthToken();
      const res   = await fetch(`${API_URL}/enrollments/${courseId}/enroll`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const d = await res.json();
      if (d.success) { toast.success(d.message || "Enrolled!"); setIsEnrolled(true); setShowModal(false); }
      else toast.error(d.error || "Failed to enroll");
    } catch { toast.error("Failed to enroll"); }
    finally { setEnrolling(false); }
  };

  const getValidUrl = (raw?: string) => {
    if (!raw?.trim()) return null;
    const n = /^www\./i.test(raw.trim()) ? `https://${raw.trim()}` : raw.trim();
    return /^https?:\/\//i.test(n) ? n : null;
  };

  const FREE_PREVIEW_COUNT = 2;
  const isPaidCourse   = course?.contentType === "paid" || course?.contentType === "exclusive";
  const selectedIndex  = selected ? contents.findIndex(c => c._id === selected._id) : -1;
  const isPreviewLesson = selectedIndex >= 0 && selectedIndex < FREE_PREVIEW_COUNT;
  const canWatch       = !isPaidCourse || isEnrolled || isPreviewLesson;
  const initials       = course?.mentorId.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";
  const progressPct    = contents.length > 0 ? Math.round((completedItems.size / contents.length) * 100) : 0;

  // group contents by module
  const moduleGroups: { title: string; items: Content[] }[] = [];
  contents.forEach(c => {
    const last = moduleGroups[moduleGroups.length - 1];
    if (!last || last.title !== c.moduleTitle) {
      moduleGroups.push({ title: c.moduleTitle ?? "Module", items: [c] });
    } else {
      last.items.push(c);
    }
  });

  // ── Player ─────────────────────────────────────────────────────────────────
  const renderPlayer = () => {
    if (isLoading) return (
      <div style={{
        borderRadius: 16, aspectRatio: "16/9",
        background: "linear-gradient(135deg,#e2e8f0,#f1f5f9)",
        overflow: "hidden", position: "relative",
      }}>
        <div className="shimmer" style={{ position: "absolute", inset: 0 }} />
      </div>
    );

    if (!selected) return (
      <div style={{
        borderRadius: 16, aspectRatio: "16/9",
        background: "rgba(255,255,255,0.7)", border: "1px solid rgba(29,78,216,0.09)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
      }}>
        <BookOpen style={{ width: 40, height: 40, color: "#cbd5e1" }} />
        <p style={{ color: MUTED, fontWeight: 600, margin: 0, fontSize: 14 }}>Select a lesson to start</p>
      </div>
    );

    if (!canWatch) return (
      <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(29,78,216,0.1)" }}>
        <div style={{
          position: "relative", aspectRatio: "16/9",
          background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.5)" }} />
          <div style={{ position: "relative", textAlign: "center", color: "#fff" }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%", margin: "0 auto 12px",
              background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Lock style={{ width: 26, height: 26 }} />
            </div>
            <p style={{ fontWeight: 700, fontSize: 17, margin: 0 }}>This lesson is locked</p>
            <p style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
              {isPaidCourse ? `Enroll for ₹${course?.price} to unlock all content` : "Enroll for free to unlock"}
            </p>
          </div>
        </div>
        <div style={{ padding: "18px 22px", textAlign: "center", background: "#fff" }}>
          <button onClick={handleEnroll} disabled={isEnrolling} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "11px 28px", borderRadius: 12,
            background: isEnrolling ? "#93c5fd" : `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
            color: "#fff", fontWeight: 700, fontSize: 14, border: "none",
            cursor: isEnrolling ? "not-allowed" : "pointer", fontFamily: "inherit",
            boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
          }}>
            {isEnrolling
              ? <><span className="spinner" /> Enrolling…</>
              : isPaidCourse
                ? <><Lock style={{ width: 13, height: 13 }} /> Enroll — ₹{course?.price}</>
                : <><Play style={{ width: 13, height: 13, fill: "#fff" }} /> Enroll for Free</>
            }
          </button>
        </div>
      </div>
    );

    const previewBanner = isPreviewLesson && isPaidCourse && !isEnrolled ? (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        padding: "9px 14px", borderRadius: 10, marginBottom: 8,
        background: "linear-gradient(90deg,#f0fdf4,#dcfce7)",
        border: "1px solid #bbf7d0",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#059669" }}>
          <Eye style={{ width: 11, height: 11 }} />
          Free Preview · Lesson {selectedIndex + 1} of {FREE_PREVIEW_COUNT}
        </span>
        <button onClick={handleEnroll} style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "5px 11px", borderRadius: 8,
          background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
          color: "#fff", fontWeight: 700, fontSize: 11.5, border: "none",
          cursor: "pointer", fontFamily: "inherit",
        }}>
          <Lock style={{ width: 9, height: 9 }} /> Enroll for full access
        </button>
      </div>
    ) : null;

    if (selected.contentType === "google-doc" || selected.contentType === "google-sheet") {
      const docUrl = getValidUrl(selected.embedUrl);
      if (!docUrl) return <div style={{ borderRadius: 12, border: "1px solid #fde68a", background: "#fffbeb", padding: 24, textAlign: "center" }}><p style={{ color: "#92400e", fontWeight: 600, margin: 0 }}>Invalid lesson link</p></div>;
      return (
        <>{previewBanner}
          <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(29,78,216,0.12)", background: "#fff" }}>
            <iframe src={docUrl} style={{ width: "100%", height: 500, display: "block" }} allow="fullscreen" title={selected.title} />
          </div>
        </>
      );
    }

    if (selected.contentType === "video-link") {
      const videoUrl = getValidUrl(selected.videoUrl);
      if (!videoUrl) return <div style={{ borderRadius: 12, border: "1px solid #fde68a", background: "#fffbeb", padding: 24, textAlign: "center" }}><p style={{ color: "#92400e", fontWeight: 600, margin: 0 }}>Invalid video URL</p></div>;

      const isYT    = /youtube\.com|youtu\.be/i.test(videoUrl);
      const thumb   = isYT ? getYtThumb(videoUrl) : null;
      const embedUrl = isYT ? buildYtEmbedUrl(videoUrl) : null;

      return (
        <>{previewBanner}
          <div style={{ borderRadius: 16, overflow: "hidden", background: "#000", boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}>
            <div style={{ position: "relative", aspectRatio: "16/9" }}>
              {isYT && embedUrl && playing ? (
                <iframe
                  src={embedUrl}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={selected.title}
                />
              ) : isYT && thumb ? (
                <>
                  <img src={thumb} alt={selected.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
                  <button
                    onClick={() => setPlaying(true)}
                    aria-label="Play video"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <div className="play-circle" style={{
                      width: 64, height: 64, borderRadius: "50%",
                      background: "rgba(255,255,255,0.95)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 6px 28px rgba(0,0,0,0.32)",
                      transition: "transform 0.18s",
                    }}>
                      <Play style={{ width: 26, height: 26, fill: "#dc2626", color: "#dc2626", marginLeft: 3 }} />
                    </div>
                  </button>
                </>
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "rgba(255,255,255,0.45)" }}>
                  <Play style={{ width: 40, height: 40 }} />
                  {!isYT && <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#93c5fd", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}><ExternalLink style={{ width: 12, height: 12 }} /> Open video</a>}
                </div>
              )}
            </div>

            {/* Below-video bar */}
            <div style={{ background: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {isYT && !playing && embedUrl && (
                <button onClick={() => setPlaying(true)} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9,
                  background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                  color: "#fff", fontWeight: 700, fontSize: 12.5, border: "none",
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 4px 14px rgba(220,38,38,0.28)",
                }}>
                  <Play style={{ width: 12, height: 12, fill: "#fff" }} /> Play
                </button>
              )}
              {isEnrolled && selected && (
                <button onClick={() => toggleDone(selected._id)} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9,
                  border: "1px solid",
                  borderColor: completedItems.has(selected._id) ? "#6ee7b7" : "rgba(29,78,216,0.2)",
                  background: completedItems.has(selected._id) ? "#f0fdf4" : "#f8faff",
                  color: completedItems.has(selected._id) ? "#059669" : MUTED,
                  fontWeight: 600, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit",
                }}>
                  <CheckCircle style={{ width: 12, height: 12, ...(completedItems.has(selected._id) ? { fill: "#059669", color: "#059669" } : {}) }} />
                  {completedItems.has(selected._id) ? "Marked done" : "Mark as done"}
                </button>
              )}
              <span style={{ marginLeft: "auto", fontSize: 11, color: MUTED, fontWeight: 500 }}>
                {selected?.duration > 0 ? `${selected.duration} min` : ""}
              </span>
            </div>
          </div>
        </>
      );
    }

    if (selected.contentType === "pdf") return (
      <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(29,78,216,0.12)" }}>
        <embed src={selected.videoUrl} type="application/pdf" width="100%" height="560" />
      </div>
    );

    return (
      <div style={{ borderRadius: 14, border: "1px solid rgba(29,78,216,0.12)", background: "#fff", padding: 24, textAlign: "center" }}>
        <p style={{ color: MUTED, margin: 0 }}>Content type not supported for preview</p>
        {selected.videoUrl && <a href={selected.videoUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 5, color: BRAND, fontWeight: 600, textDecoration: "none", fontSize: 13 }}>Open content <ExternalLink style={{ width: 11, height: 11 }} /></a>}
      </div>
    );
  };

  // ── Loading spinner page ───────────────────────────────────────────────────
  if (isLoading && !course) return (
    <div style={{ minHeight: "100vh", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}.spinner{border:3px solid rgba(37,99,235,0.18);border-top-color:${BRAND};border-radius:50%;animation:spin 0.7s linear infinite}`}</style>
    </div>
  );

  if (!course) return (
    <div style={{ minHeight: "100vh", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <BookOpen style={{ width: 44, height: 44, color: "#cbd5e1", margin: "0 auto 14px" }} />
        <p style={{ color: MUTED, fontWeight: 600, marginBottom: 14 }}>Course not found</p>
        <Link href="/dashboard/content" style={{ color: BRAND, fontWeight: 600, textDecoration: "none" }}>← Back to courses</Link>
      </div>
    </div>
  );

  // ── Page ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmerAnim{0%{background-position:-600px 0}100%{background-position:600px 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        .shimmer{background:linear-gradient(90deg,#f0f2f5 25%,#e6e9ec 50%,#f0f2f5 75%);background-size:600px 100%;animation:shimmerAnim 1.4s ease-in-out infinite}
        .spinner{border:3px solid rgba(37,99,235,0.18);border-top-color:${BRAND};border-radius:50%;animation:spin 0.7s linear infinite}
        .lesson-row:hover{background:rgba(37,99,235,0.055)!important}
        .play-circle:hover{transform:scale(1.1)}
        .mod-list::-webkit-scrollbar{width:4px}
        .mod-list::-webkit-scrollbar-thumb{background:rgba(29,78,216,0.18);border-radius:99px}
        /* layout */
        .course-layout{display:grid;grid-template-columns:1fr;gap:18px}
        .sidebar{display:flex;flex-direction:column;gap:14px}
        @media(min-width:900px){
          .course-layout{grid-template-columns:1fr 360px;grid-template-rows:auto}
          .player-col{grid-column:1;grid-row:1}
          .sidebar-col{grid-column:2;grid-row:1;position:sticky;top:88px;align-self:start;max-height:calc(100vh - 110px);overflow-y:auto}
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: PAPER, fontFamily: "'DM Sans',system-ui,sans-serif" }}>
        {/* Ambient blobs */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "5%", left: "5%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(29,78,216,0.05) 0%,transparent 70%)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(8,145,178,0.04) 0%,transparent 70%)", filter: "blur(80px)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1320, margin: "0 auto", padding: "clamp(14px,2.5vw,24px) clamp(12px,3vw,24px)" }}>

          {/* ── Breadcrumb ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <Link href="/dashboard/content" style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 12.5, fontWeight: 600, color: BRAND, textDecoration: "none",
              padding: "5px 11px", borderRadius: 9,
              background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.15)",
            }}>
              <ArrowLeft style={{ width: 11, height: 11 }} /> All Courses
            </Link>
            <ChevronRight style={{ width: 11, height: 11, color: "#94a3b8" }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: INK, maxWidth: 340, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {course.title}
            </span>
          </div>

          {/* ══ MAIN LAYOUT ══ */}
          <div className="course-layout">

            {/* ── LEFT: Player + video meta ── */}
            <div className="player-col" style={{ minWidth: 0 }}>
              {renderPlayer()}

              {/* Video title + description below player */}
              {selected && !isLoading && (
                <div style={{
                  marginTop: 14, padding: "16px 18px",
                  borderRadius: 14, background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(29,78,216,0.1)",
                  animation: "fadeUp 0.25s ease",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 16, fontWeight: 700, color: INK, margin: 0, letterSpacing: "-0.015em", lineHeight: 1.3 }}>
                        {selected.title}
                      </p>
                      {selected.description && (
                        <p style={{ fontSize: 13, color: MUTED, margin: "6px 0 0", lineHeight: 1.6 }}>{selected.description}</p>
                      )}
                    </div>
                    {selected.duration > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#94a3b8", fontWeight: 500, flexShrink: 0, marginTop: 3 }}>
                        <Clock style={{ width: 12, height: 12 }} />{selected.duration} min
                      </span>
                    )}
                  </div>
                  {/* Nav between lessons */}
                  {contents.length > 1 && (
                    <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                      <button
                        disabled={selectedIndex <= 0}
                        onClick={() => selectedIndex > 0 && setSelected(contents[selectedIndex - 1])}
                        style={{
                          display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 9,
                          background: "#f1f5f9", border: "1px solid #e2e8f0", color: selectedIndex <= 0 ? "#cbd5e1" : INK,
                          fontWeight: 600, fontSize: 12, cursor: selectedIndex <= 0 ? "not-allowed" : "pointer", fontFamily: "inherit",
                        }}
                      >
                        ← Prev
                      </button>
                      <span style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, color: MUTED, fontWeight: 500 }}>
                        {selectedIndex + 1} / {contents.length}
                      </span>
                      <button
                        disabled={selectedIndex >= contents.length - 1 || (isPaidCourse && !isEnrolled && selectedIndex >= FREE_PREVIEW_COUNT - 1)}
                        onClick={() => {
                          const nextIdx = selectedIndex + 1;
                          if (nextIdx < contents.length && (!isPaidCourse || isEnrolled || nextIdx < FREE_PREVIEW_COUNT)) {
                            setSelected(contents[nextIdx]);
                          }
                        }}
                        style={{
                          display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 9,
                          background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
                          border: "none", color: "#fff",
                          fontWeight: 600, fontSize: 12,
                          cursor: (selectedIndex >= contents.length - 1 || (isPaidCourse && !isEnrolled && selectedIndex >= FREE_PREVIEW_COUNT - 1)) ? "not-allowed" : "pointer",
                          opacity: (selectedIndex >= contents.length - 1 || (isPaidCourse && !isEnrolled && selectedIndex >= FREE_PREVIEW_COUNT - 1)) ? 0.45 : 1,
                          fontFamily: "inherit",
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── RIGHT: Sidebar — course info + module list ── */}
            <div className="sidebar-col mod-list">

              {/* Course info card */}
              <div style={{
                borderRadius: 16, background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(29,78,216,0.12)",
                boxShadow: "0 4px 18px rgba(29,78,216,0.07)",
                overflow: "hidden",
              }}>
                <div style={{ height: 3, background: `linear-gradient(90deg,${BRAND},${BRAND_DEEP})` }} />
                <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 13 }}>

                  {/* Title + category */}
                  <div>
                    <span style={{
                      display: "inline-block", fontSize: 9.5, fontWeight: 700,
                      color: BRAND, background: "#eff6ff", border: "1px solid #bfdbfe",
                      padding: "2px 8px", borderRadius: 99, textTransform: "capitalize", marginBottom: 7,
                    }}>
                      {CAT_LABEL[course.category] ?? course.category.replace(/-/g, " ")}
                    </span>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: INK, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                      {course.title}
                    </h2>
                    {course.shortDescription && (
                      <p style={{ fontSize: 12, color: MUTED, margin: "6px 0 0", lineHeight: 1.6 }}>{course.shortDescription}</p>
                    )}
                  </div>

                  {/* Enroll / enrolled status */}
                  {isEnrolled ? (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 7, padding: "9px 13px", borderRadius: 10,
                      background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#059669", fontWeight: 600, fontSize: 13,
                    }}>
                      <CheckCircle style={{ width: 14, height: 14, fill: "#059669" }} /> You're enrolled
                    </div>
                  ) : (
                    <button onClick={handleEnroll} disabled={isEnrolling} style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      padding: "10px 0", borderRadius: 11,
                      background: isEnrolling ? "#93c5fd" : `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
                      color: "#fff", fontWeight: 700, fontSize: 13.5, border: "none",
                      cursor: isEnrolling ? "not-allowed" : "pointer", fontFamily: "inherit",
                      boxShadow: "0 6px 18px rgba(37,99,235,0.28)",
                    }}>
                      {isEnrolling
                        ? <><span className="spinner" style={{ width: 13, height: 13 }} /> Enrolling…</>
                        : isPaidCourse
                          ? <><Lock style={{ width: 12, height: 12 }} /> Enroll — ₹{course.price}</>
                          : <><Play style={{ width: 12, height: 12, fill: "#fff" }} /> Enroll for Free</>
                      }
                    </button>
                  )}

                  {/* Progress bar */}
                  {isEnrolled && contents.length > 0 && (
                    <div style={{ borderRadius: 12, padding: "12px 14px", background: "rgba(37,99,235,0.04)", border: "1px solid rgba(29,78,216,0.09)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: INK }}>
                          <TrendingUp style={{ width: 11, height: 11, color: BRAND }} /> Progress
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: progressPct === 100 ? "#059669" : BRAND }}>{progressPct}%</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: "rgba(29,78,216,0.1)", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 99, width: `${progressPct}%`, transition: "width 0.5s ease",
                          background: progressPct === 100 ? "linear-gradient(90deg,#10b981,#059669)" : `linear-gradient(90deg,${BRAND},${BRAND_DEEP})`,
                        }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                        <span style={{ fontSize: 10.5, color: MUTED, fontWeight: 500 }}>{completedItems.size}/{contents.length} lessons</span>
                        {progressPct === 100 && <span style={{ fontSize: 10.5, color: "#059669", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}><Award style={{ width: 10, height: 10 }} /> Done!</span>}
                      </div>
                    </div>
                  )}

                  {/* Instructor */}
                  <div style={{ paddingTop: 10, borderTop: "1px solid rgba(29,78,216,0.07)" }}>
                    <p style={{ fontSize: 9.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 8px" }}>Instructor</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 12, fontWeight: 700,
                        boxShadow: "0 3px 9px rgba(29,78,216,0.25)",
                      }}>{initials}</div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 12.5, fontWeight: 700, color: INK, margin: 0 }}>{course.mentorId.name}</p>
                        <p style={{ fontSize: 11, color: MUTED, margin: "1px 0 0" }}>{course.mentorId.designation}</p>
                        {course.mentorId.company && <p style={{ fontSize: 10.5, color: BRAND, fontWeight: 600, margin: "1px 0 0" }}>{course.mentorId.company}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modules list */}
              <div style={{
                borderRadius: 16, background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(29,78,216,0.12)",
                boxShadow: "0 4px 18px rgba(29,78,216,0.07)",
                overflow: "hidden",
              }}>
                {/* Header */}
                <div style={{
                  padding: "13px 18px",
                  background: "linear-gradient(to right,rgba(37,99,235,0.05),transparent)",
                  borderBottom: "1px solid rgba(29,78,216,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <BookOpen style={{ width: 13, height: 13, color: BRAND }} />
                    {isLoading ? (
                      <div className="shimmer" style={{ width: 90, height: 14, borderRadius: 6 }} />
                    ) : (
                      <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>
                        Modules <span style={{ fontWeight: 500, color: "#94a3b8" }}>({contents.length})</span>
                      </span>
                    )}
                  </div>
                  {!isLoading && isPaidCourse && !isEnrolled && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9.5, fontWeight: 700,
                      color: "#92400e", background: "#fef3c7", border: "1px solid #fde68a", padding: "2px 7px", borderRadius: 99,
                    }}>
                      <Lock style={{ width: 7, height: 7 }} /> Locked
                    </span>
                  )}
                </div>

                {/* Skeleton while loading */}
                {isLoading ? (
                  <div style={{ padding: "10px 0" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px" }}>
                        <div className="shimmer" style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0 }} />
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                          <div className="shimmer" style={{ width: "80%", height: 12, borderRadius: 5 }} />
                          <div className="shimmer" style={{ width: "45%", height: 10, borderRadius: 5 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {moduleGroups.map((group, gi) => (
                      <div key={gi}>
                        {/* Module header — only show if >1 module or has a real title */}
                        {(moduleGroups.length > 1 || group.title !== "Module") && (
                          <div style={{
                            padding: "9px 18px 7px",
                            background: "rgba(37,99,235,0.03)",
                            borderBottom: "1px solid rgba(29,78,216,0.07)",
                            borderTop: gi > 0 ? "1px solid rgba(29,78,216,0.07)" : "none",
                          }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: BRAND, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                              {group.title}
                            </span>
                          </div>
                        )}

                        {/* Lessons in module */}
                        {group.items.map((c) => {
                          const globalIdx = contents.findIndex(x => x._id === c._id);
                          const done      = completedItems.has(c._id);
                          const active    = selected?._id === c._id;
                          const isPreview = globalIdx < FREE_PREVIEW_COUNT;
                          const locked    = isPaidCourse && !isEnrolled && !isPreview;

                          return (
                            <button
                              key={c._id}
                              onClick={() => !locked && setSelected(c)}
                              disabled={locked}
                              className={!locked ? "lesson-row" : ""}
                              style={{
                                width: "100%", display: "flex", alignItems: "center", gap: 11,
                                padding: "10px 18px",
                                background: active ? "rgba(37,99,235,0.07)" : "#fff",
                                borderLeft: active ? `3px solid ${BRAND}` : "3px solid transparent",
                                border: "none",
                                borderBottom: "1px solid rgba(29,78,216,0.05)",
                                cursor: locked ? "not-allowed" : "pointer",
                                opacity: locked ? 0.55 : 1,
                                fontFamily: "inherit",
                                textAlign: "left",
                                transition: "background 0.13s",
                              }}
                            >
                              {/* Status circle */}
                              <div style={{
                                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                ...(locked
                                  ? { background: "#f1f5f9", border: "1.5px solid #e2e8f0" }
                                  : done
                                    ? { background: "#10b981" }
                                    : active
                                      ? { background: BRAND }
                                      : isPreview && isPaidCourse && !isEnrolled
                                        ? { background: "#f0fdf4", border: "1.5px solid #6ee7b7" }
                                        : { background: "rgba(29,78,216,0.06)", border: "1.5px solid rgba(29,78,216,0.18)" }
                                ),
                              }}>
                                {locked
                                  ? <Lock style={{ width: 10, height: 10, color: "#94a3b8" }} />
                                  : done
                                    ? <CheckCircle style={{ width: 13, height: 13, color: "#fff", fill: "#fff" }} />
                                    : active
                                      ? <Play style={{ width: 9, height: 9, color: "#fff", fill: "#fff", marginLeft: 1 }} />
                                      : isPreview && isPaidCourse && !isEnrolled
                                        ? <Play style={{ width: 9, height: 9, color: "#10b981", fill: "#10b981", marginLeft: 1 }} />
                                        : <span style={{ fontSize: 9.5, fontWeight: 700, color: BRAND }}>{globalIdx + 1}</span>
                                }
                              </div>

                              {/* Title + meta */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                  fontSize: 12.5, fontWeight: active ? 700 : 600,
                                  color: done ? "#94a3b8" : active ? BRAND_DEEP : locked ? "#94a3b8" : INK,
                                  margin: 0, lineHeight: 1.35,
                                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                  textDecoration: done ? "line-through" : "none",
                                }}>
                                  {c.title}
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                                  {c.duration > 0 && (
                                    <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10.5, color: "#94a3b8", fontWeight: 500 }}>
                                      <Clock style={{ width: 9, height: 9 }} />{c.duration}m
                                    </span>
                                  )}
                                  {isPreview && isPaidCourse && !isEnrolled && (
                                    <span style={{
                                      fontSize: 8.5, fontWeight: 700, color: "#059669",
                                      background: "#f0fdf4", border: "1px solid #bbf7d0",
                                      padding: "1px 5px", borderRadius: 99,
                                    }}>FREE</span>
                                  )}
                                  {done && <span style={{ fontSize: 9.5, color: "#059669", fontWeight: 700 }}>✓</span>}
                                </div>
                              </div>

                              {active && !locked && (
                                <div style={{ width: 5, height: 5, borderRadius: "50%", background: BRAND, flexShrink: 0 }} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Payment modal ── */}
        {showModal && isPaidCourse && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}>
            <div style={{
              background: "#fff", borderRadius: 20, width: "100%", maxWidth: 400,
              border: "1px solid rgba(29,78,216,0.18)",
              boxShadow: "0 24px 64px rgba(29,78,216,0.18)", overflow: "hidden",
            }}>
              <div style={{ height: 3, background: `linear-gradient(90deg,${BRAND},${BRAND_DEEP})` }} />
              <div style={{ padding: "22px 24px 20px" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: INK, margin: "0 0 16px", letterSpacing: "-0.025em" }}>Enroll in Course</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 20 }}>
                  <div style={{ background: "#f8faff", border: "1px solid rgba(29,78,216,0.1)", borderRadius: 11, padding: "11px 14px" }}>
                    <p style={{ fontSize: 9.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 3px" }}>Course</p>
                    <p style={{ fontWeight: 700, color: INK, margin: 0, fontSize: 13 }}>{course.title}</p>
                  </div>
                  <div style={{ background: "#f8faff", border: "1px solid rgba(29,78,216,0.1)", borderRadius: 11, padding: "11px 14px" }}>
                    <p style={{ fontSize: 9.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 3px" }}>Amount</p>
                    <p style={{ fontSize: 24, fontWeight: 800, color: BRAND, margin: 0, letterSpacing: "-0.03em" }}>₹{course.price}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 9 }}>
                  <button onClick={() => setShowModal(false)} style={{
                    flex: 1, padding: "10px 0", borderRadius: 11,
                    background: "#f1f5f9", border: "1px solid #e2e8f0", color: INK,
                    fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                  }}>Cancel</button>
                  <button onClick={() => router.push(`/dashboard/checkout/${courseId}`)} style={{
                    flex: 1, padding: "10px 0", borderRadius: 11,
                    background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
                    border: "none", color: "#fff",
                    fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                    boxShadow: "0 6px 18px rgba(37,99,235,0.28)",
                  }}>Proceed to Payment</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}