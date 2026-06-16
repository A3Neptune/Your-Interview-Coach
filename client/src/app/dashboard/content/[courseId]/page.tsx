"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Clock, CheckCircle, ExternalLink, Play, Lock, BookOpen,
  Award, ChevronRight, TrendingUp, Youtube,
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
    title: string;
    description?: string;
    order: number;
    resources?: Array<{
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
  try {
    const u = new URL(url);
    return u.searchParams.get("list");
  } catch {}
  return null;
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
  // when true, swap thumbnail for the actual iframe
  const [playing, setPlaying]           = useState(false);

  // reset play state on lesson change
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

  const isPaidCourse = course?.contentType === "paid" || course?.contentType === "exclusive";
  const canWatch     = !isPaidCourse || isEnrolled;
  const initials     = course?.mentorId.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";
  const progressPct  = contents.length > 0 ? Math.round((completedItems.size / contents.length) * 100) : 0;

  // ── Player tile ────────────────────────────────────────────────────────────
  const renderPlayer = () => {
    // no lesson selected
    if (!selected) return (
      <div style={{
        borderRadius: 20, aspectRatio: "16/9",
        background: "rgba(255,255,255,0.72)", border: "1px solid rgba(29,78,216,0.09)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
      }}>
        <BookOpen style={{ width: 44, height: 44, color: "#cbd5e1" }} />
        <p style={{ color: MUTED, fontWeight: 600, margin: 0 }}>Select a lesson below</p>
      </div>
    );

    // lock wall
    if (!canWatch) return (
      <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(29,78,216,0.14)", boxShadow: "0 8px 32px rgba(29,78,216,0.08)" }}>
        <div style={{
          position: "relative", aspectRatio: "16/9",
          background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.5)" }} />
          <div style={{ position: "relative", textAlign: "center", color: "#fff" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", margin: "0 auto 12px",
              background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Lock style={{ width: 28, height: 28 }} />
            </div>
            <p style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>Course Locked</p>
            <p style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
              {isPaidCourse ? `Enroll for ₹${course?.price} to unlock` : "Enroll for free to unlock"}
            </p>
          </div>
        </div>
        <div style={{ padding: "22px 28px", textAlign: "center", background: "#fff" }}>
          <button onClick={handleEnroll} disabled={isEnrolling} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 30px", borderRadius: 13,
            background: isEnrolling ? "#93c5fd" : `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
            color: "#fff", fontWeight: 700, fontSize: 14, border: "none",
            cursor: isEnrolling ? "not-allowed" : "pointer", fontFamily: "inherit",
            boxShadow: "0 10px 28px rgba(37,99,235,0.32)",
          }}>
            {isEnrolling
              ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Enrolling…</>
              : isPaidCourse ? <><Lock style={{ width: 14, height: 14 }} /> Enroll — ₹{course?.price}</> : <><Play style={{ width: 14, height: 14, fill: "#fff" }} /> Enroll for Free</>
            }
          </button>
        </div>
      </div>
    );

    // google doc / sheet
    if (selected.contentType === "google-doc" || selected.contentType === "google-sheet") {
      const docUrl = getValidUrl(selected.embedUrl);
      if (!docUrl) return <div style={{ borderRadius: 16, border: "1px solid #fde68a", background: "#fffbeb", padding: 28, textAlign: "center" }}><p style={{ color: "#92400e", fontWeight: 600, margin: 0 }}>Invalid lesson link</p></div>;
      return (
        <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(29,78,216,0.14)", background: "#fff", boxShadow: "0 4px 20px rgba(29,78,216,0.06)" }}>
          <iframe src={docUrl} style={{ width: "100%", height: 520, display: "block" }} allow="fullscreen" title={selected.title} />
          {isEnrolled && (
            <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(29,78,216,0.08)" }}>
              <button onClick={() => toggleDone(selected._id)} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10,
                border: "1px solid", borderColor: completedItems.has(selected._id) ? "#6ee7b7" : "rgba(29,78,216,0.18)",
                background: completedItems.has(selected._id) ? "#f0fdf4" : "#f8faff",
                color: completedItems.has(selected._id) ? "#059669" : MUTED,
                fontWeight: 600, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit",
              }}>
                <CheckCircle style={{ width: 13, height: 13, ...(completedItems.has(selected._id) ? { fill: "#059669", color: "#059669" } : {}) }} />
                {completedItems.has(selected._id) ? "Marked as done" : "Mark as done"}
              </button>
            </div>
          )}
        </div>
      );
    }

    // video-link (YouTube embed or external)
    if (selected.contentType === "video-link") {
      const rawUrl    = selected.videoUrl;
      const videoUrl  = getValidUrl(rawUrl);
      if (!videoUrl) return <div style={{ borderRadius: 16, border: "1px solid #fde68a", background: "#fffbeb", padding: 28, textAlign: "center" }}><p style={{ color: "#92400e", fontWeight: 600, margin: 0 }}>Invalid video link</p></div>;

      const isYT      = /youtube\.com|youtu\.be/i.test(videoUrl);
      const thumb     = isYT ? getYtThumb(videoUrl) : null;
      const embedUrl  = isYT ? buildYtEmbedUrl(videoUrl) : null;

      return (
        <div style={{ borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid rgba(29,78,216,0.1)", boxShadow: "0 4px 20px rgba(29,78,216,0.06)" }}>
          {/* Video area */}
          <div style={{ position: "relative", aspectRatio: "16/9", background: "#0f172a", overflow: "hidden" }}>
            {isYT && embedUrl && playing ? (
              // ── Inline YouTube iframe ──
              <iframe
                src={embedUrl}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={selected.title}
              />
            ) : isYT && thumb ? (
              // ── Thumbnail with big play button ──
              <>
                <img src={thumb} alt={selected.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
                <button
                  onClick={() => setPlaying(true)}
                  style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  aria-label="Play video"
                >
                  <div style={{
                    width: 68, height: 68, borderRadius: "50%",
                    background: "rgba(255,255,255,0.95)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                    transition: "transform 0.18s",
                  }}>
                    <Play style={{ width: 28, height: 28, fill: "#dc2626", color: "#dc2626", marginLeft: 4 }} />
                  </div>
                </button>
                {/* YT badge */}
                <div style={{ position: "absolute", bottom: 10, left: 12, display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ background: "#dc2626", borderRadius: 6, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}>
                    <Youtube style={{ width: 12, height: 12, color: "#fff" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>YouTube</span>
                  </div>
                </div>
              </>
            ) : (
              // ── Fallback: dark placeholder ──
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "rgba(255,255,255,0.4)" }}>
                <Play style={{ width: 44, height: 44 }} />
                <p style={{ fontSize: 12, margin: 0 }}>External video</p>
              </div>
            )}
          </div>

          {/* Info + actions below video */}
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: INK, margin: 0, letterSpacing: "-0.01em" }}>{selected.title}</p>
              {selected.description && <p style={{ fontSize: 12.5, color: MUTED, margin: "5px 0 0", lineHeight: 1.6 }}>{selected.description}</p>}
              {selected.duration > 0 && (
                <p style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 500, margin: "6px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock style={{ width: 11, height: 11 }} /> {selected.duration} min
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {isYT && !playing && embedUrl && (
                <button onClick={() => setPlaying(true)} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  padding: "10px 0", borderRadius: 11, minWidth: 140,
                  background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                  color: "#fff", fontWeight: 700, fontSize: 13, border: "none",
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 5px 16px rgba(220,38,38,0.28)",
                }}>
                  <Play style={{ width: 13, height: 13, fill: "#fff" }} /> Play on Platform
                </button>
              )}
              <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "10px 0", borderRadius: 11, minWidth: 120,
                background: "#f1f5f9", border: "1px solid #e2e8f0",
                color: INK, fontWeight: 600, fontSize: 13, textDecoration: "none",
              }}>
                <ExternalLink style={{ width: 12, height: 12 }} /> Open in YouTube
              </a>
              {isEnrolled && (
                <button onClick={() => toggleDone(selected._id)} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 11,
                  border: "1px solid", flexShrink: 0,
                  borderColor: completedItems.has(selected._id) ? "#6ee7b7" : "rgba(29,78,216,0.18)",
                  background: completedItems.has(selected._id) ? "#f0fdf4" : "#f8faff",
                  color: completedItems.has(selected._id) ? "#059669" : MUTED,
                  fontWeight: 600, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit",
                }}>
                  <CheckCircle style={{ width: 13, height: 13, ...(completedItems.has(selected._id) ? { fill: "#059669", color: "#059669" } : {}) }} />
                  {completedItems.has(selected._id) ? "Done" : "Mark done"}
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // pdf
    if (selected.contentType === "pdf") return (
      <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(29,78,216,0.14)" }}>
        <embed src={selected.videoUrl} type="application/pdf" width="100%" height="600" />
      </div>
    );

    // other
    return (
      <div style={{ borderRadius: 16, border: "1px solid rgba(29,78,216,0.14)", background: "#fff", padding: 28, textAlign: "center" }}>
        <p style={{ color: MUTED, margin: 0 }}>Content type not supported for preview</p>
        {selected.videoUrl && <a href={selected.videoUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, color: BRAND, fontWeight: 600, textDecoration: "none", fontSize: 13 }}>Open content <ExternalLink style={{ width: 12, height: 12 }} /></a>}
      </div>
    );
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div style={{ minHeight: "100vh", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid rgba(37,99,235,0.2)", borderTopColor: BRAND, animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!course) return (
    <div style={{ minHeight: "100vh", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <BookOpen style={{ width: 48, height: 48, color: "#cbd5e1", margin: "0 auto 16px" }} />
        <p style={{ color: MUTED, fontWeight: 600, marginBottom: 16 }}>Course not found</p>
        <Link href="/dashboard/content" style={{ color: BRAND, fontWeight: 600, textDecoration: "none" }}>← Back to courses</Link>
      </div>
    </div>
  );

  // ── Page ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        .lesson-tile:hover{ background:rgba(37,99,235,0.06)!important; border-color:rgba(29,78,216,0.25)!important; }
        .play-btn:hover > div { transform: scale(1.08); }
      `}</style>

      <div style={{ minHeight: "100vh", background: PAPER, fontFamily: "'DM Sans',system-ui,sans-serif" }}>
        {/* Ambient blobs */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "5%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(29,78,216,0.05) 0%,transparent 70%)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(8,145,178,0.04) 0%,transparent 70%)", filter: "blur(80px)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto", padding: "clamp(16px,3vw,28px) clamp(14px,3vw,24px)" }}>

          {/* ── Breadcrumb ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            <Link href="/dashboard/content" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 12.5, fontWeight: 600, color: BRAND, textDecoration: "none",
              padding: "5px 12px", borderRadius: 10,
              background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.15)",
            }}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> All Courses
            </Link>
            <ChevronRight style={{ width: 12, height: 12, color: "#94a3b8" }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: INK, maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {course.title}
            </span>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              BENTO MASTER GRID
              Desktop: [left-col (player + lessons)] [right-col (course info)]
              Mobile: stacks vertically
          ══════════════════════════════════════════════════════════════ */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "auto",
            gap: 14,
          }} className="lg:bento-grid">
            {/* CSS to activate the 2-col layout at lg */}
            <style>{`
              @media(min-width:1024px){
                .lg\\:bento-grid{
                  grid-template-columns: 1fr 340px !important;
                  grid-template-rows: auto 1fr !important;
                }
                .bento-player  { grid-column:1; grid-row:1; }
                .bento-lessons { grid-column:1; grid-row:2; }
                .bento-info    { grid-column:2; grid-row:1 / 3; }
              }
            `}</style>

            {/* ── PLAYER TILE ── */}
            <div className="bento-player" style={{ minWidth: 0 }}>
              {renderPlayer()}
            </div>

            {/* ── LESSONS BENTO TILE ── */}
            {contents.length > 0 && (
              <div className="bento-lessons" style={{
                borderRadius: 20,
                background: "rgba(255,255,255,0.88)",
                border: "1px solid rgba(29,78,216,0.12)",
                boxShadow: "0 4px 20px rgba(29,78,216,0.07)",
                overflow: "hidden",
              }}>
                {/* Header */}
                <div style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(29,78,216,0.08)",
                  background: "linear-gradient(to right,rgba(37,99,235,0.04),transparent)",
                  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BookOpen style={{ width: 14, height: 14, color: BRAND }} />
                    <h3 style={{ fontSize: 13.5, fontWeight: 700, color: INK, margin: 0 }}>
                      Lessons <span style={{ fontWeight: 500, color: "#94a3b8" }}>({contents.length})</span>
                    </h3>
                    {isPaidCourse && !isEnrolled && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700,
                        color: "#92400e", background: "#fef3c7", border: "1px solid #fde68a", padding: "2px 7px", borderRadius: 99,
                      }}>
                        <Lock style={{ width: 8, height: 8 }} /> Locked
                      </span>
                    )}
                  </div>
                  {isEnrolled && (
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: progressPct === 100 ? "#059669" : MUTED }}>
                      {completedItems.size}/{contents.length} done · {progressPct}%
                    </span>
                  )}
                </div>

                {/* Bento tile grid — uniform cells separated by 1px dividers */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: 1,
                  background: "rgba(29,78,216,0.07)",
                }}>
                  {contents.map((c, i) => {
                    const done   = completedItems.has(c._id);
                    const active = selected?._id === c._id;
                    const locked = isPaidCourse && !isEnrolled;

                    return (
                      <button
                        key={c._id}
                        onClick={() => !locked && setSelected(c)}
                        disabled={locked}
                        className={!locked ? "lesson-tile" : ""}
                        style={{
                          background: active && !locked ? "rgba(37,99,235,0.08)" : done ? "rgba(16,185,129,0.04)" : "#fff",
                          border: "none",
                          borderLeft: active && !locked ? `3px solid ${BRAND}` : "3px solid transparent",
                          padding: "15px 15px 13px",
                          textAlign: "left",
                          cursor: locked ? "not-allowed" : "pointer",
                          opacity: locked ? 0.5 : 1,
                          fontFamily: "inherit",
                          display: "flex", flexDirection: "column", gap: 8,
                          transition: "background 0.14s, border-color 0.14s",
                          minHeight: 90,
                          position: "relative",
                        }}
                      >
                        {/* Number / status circle + duration */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{
                            width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            ...(locked
                              ? { background: "#f1f5f9", border: "1.5px solid #e2e8f0" }
                              : done
                                ? { background: "#10b981" }
                                : active
                                  ? { background: BRAND }
                                  : { background: "rgba(29,78,216,0.07)", border: "1.5px solid rgba(29,78,216,0.2)" }
                            ),
                          }}>
                            {locked
                              ? <Lock style={{ width: 9, height: 9, color: "#94a3b8" }} />
                              : done
                                ? <CheckCircle style={{ width: 12, height: 12, color: "#fff", fill: "#fff" }} />
                                : active
                                  ? <Play style={{ width: 8, height: 8, color: "#fff", fill: "#fff", marginLeft: 1 }} />
                                  : <span style={{ fontSize: 9, fontWeight: 700, color: BRAND }}>{i + 1}</span>
                            }
                          </div>
                          {c.duration > 0 && (
                            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>
                              <Clock style={{ width: 9, height: 9 }} />{c.duration}m
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <p style={{
                          fontSize: 12, fontWeight: active ? 700 : 600,
                          color: done ? "#94a3b8" : active ? BRAND_DEEP : INK,
                          margin: 0, lineHeight: 1.4, flex: 1,
                          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                          textDecoration: done ? "line-through" : "none",
                        }}>
                          {c.title}
                        </p>

                        {done && <span style={{ fontSize: 9.5, color: "#059669", fontWeight: 700 }}>✓ Done</span>}

                        {/* Active dot */}
                        {active && !locked && (
                          <div style={{
                            position: "absolute", bottom: 9, right: 11,
                            width: 6, height: 6, borderRadius: "50%", background: BRAND,
                            boxShadow: "0 0 0 2px rgba(37,99,235,0.2)",
                          }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── COURSE INFO TILE (right column, spans both rows on lg) ── */}
            <div className="bento-info" style={{
              borderRadius: 20,
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(29,78,216,0.12)",
              boxShadow: "0 4px 20px rgba(29,78,216,0.07)",
              overflow: "hidden",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ height: 3, background: `linear-gradient(90deg,${BRAND},${BRAND_DEEP})`, flexShrink: 0 }} />

              <div style={{ padding: "20px 20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>

                {/* Category + title */}
                <div>
                  <span style={{
                    display: "inline-block", fontSize: 10, fontWeight: 700,
                    color: BRAND, background: "#eff6ff", border: "1px solid #bfdbfe",
                    padding: "2px 9px", borderRadius: 99, textTransform: "capitalize", marginBottom: 8,
                  }}>
                    {CAT_LABEL[course.category] ?? course.category.replace(/-/g, " ")}
                  </span>
                  <h2 style={{ fontSize: "clamp(15px,1.4vw,17px)", fontWeight: 700, color: INK, margin: 0, letterSpacing: "-0.022em", lineHeight: 1.3 }}>
                    {course.title}
                  </h2>
                  {course.shortDescription && (
                    <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.65, margin: "8px 0 0" }}>{course.shortDescription}</p>
                  )}
                </div>

                {/* Enroll */}
                {isEnrolled ? (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 12,
                    background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#059669", fontWeight: 600, fontSize: 13,
                  }}>
                    <CheckCircle style={{ width: 15, height: 15, fill: "#059669" }} /> Enrolled
                  </div>
                ) : (
                  <button onClick={handleEnroll} disabled={isEnrolling} style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "11px 0", borderRadius: 13,
                    background: isEnrolling ? "#93c5fd" : `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
                    color: "#fff", fontWeight: 700, fontSize: 13.5, border: "none",
                    cursor: isEnrolling ? "not-allowed" : "pointer", fontFamily: "inherit",
                    boxShadow: "0 8px 22px rgba(37,99,235,0.28)",
                  }}>
                    {isEnrolling
                      ? <><span style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Enrolling…</>
                      : isPaidCourse ? <><Lock style={{ width: 13, height: 13 }} /> Enroll — ₹{course.price}</> : <><Play style={{ width: 13, height: 13, fill: "#fff" }} /> Enroll for Free</>
                    }
                  </button>
                )}

                {/* Progress */}
                {isEnrolled && contents.length > 0 && (
                  <div style={{ borderRadius: 14, padding: "14px 16px", background: "rgba(37,99,235,0.04)", border: "1px solid rgba(29,78,216,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: INK }}>
                        <TrendingUp style={{ width: 12, height: 12, color: BRAND }} /> Progress
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: progressPct === 100 ? "#059669" : BRAND }}>{progressPct}%</span>
                    </div>
                    <div style={{ height: 7, borderRadius: 99, background: "rgba(29,78,216,0.1)", overflow: "hidden", marginBottom: 8 }}>
                      <div style={{
                        height: "100%", borderRadius: 99, width: `${progressPct}%`, transition: "width 0.5s ease",
                        background: progressPct === 100 ? "linear-gradient(90deg,#10b981,#059669)" : `linear-gradient(90deg,${BRAND},${BRAND_DEEP})`,
                      }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>{completedItems.size} of {contents.length} done</span>
                      {progressPct === 100 && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#059669", fontWeight: 700 }}>
                          <Award style={{ width: 11, height: 11 }} /> Complete!
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Currently playing */}
                {selected && (
                  <div style={{ borderRadius: 14, padding: "12px 14px", background: "#f8faff", border: "1px solid rgba(29,78,216,0.1)" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 6px" }}>Now Playing</p>
                    <p style={{ fontSize: 12.5, fontWeight: 600, color: INK, margin: 0, lineHeight: 1.4 }}>{selected.title}</p>
                    {selected.duration > 0 && (
                      <p style={{ fontSize: 11, color: MUTED, margin: "4px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock style={{ width: 10, height: 10 }} />{selected.duration} min
                      </p>
                    )}
                  </div>
                )}

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
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: INK, margin: 0 }}>{course.mentorId.name}</p>
                      <p style={{ fontSize: 11, color: MUTED, margin: "2px 0 0" }}>{course.mentorId.designation}</p>
                      {course.mentorId.company && <p style={{ fontSize: 10.5, color: BRAND, fontWeight: 600, margin: "1px 0 0" }}>{course.mentorId.company}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>{/* /bento master grid */}
        </div>

        {/* ── Payment modal ── */}
        {showModal && isPaidCourse && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}>
            <div style={{
              background: "#fff", borderRadius: 22, width: "100%", maxWidth: 420,
              border: "1px solid rgba(29,78,216,0.18)",
              boxShadow: "0 24px 64px rgba(29,78,216,0.18)",
              overflow: "hidden",
            }}>
              <div style={{ height: 3, background: `linear-gradient(90deg,${BRAND},${BRAND_DEEP})` }} />
              <div style={{ padding: "26px 26px 22px" }}>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: INK, margin: "0 0 18px", letterSpacing: "-0.025em" }}>Enroll in Course</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                  <div style={{ background: "#f8faff", border: "1px solid rgba(29,78,216,0.12)", borderRadius: 12, padding: "12px 16px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 4px" }}>Course</p>
                    <p style={{ fontWeight: 700, color: INK, margin: 0, fontSize: 13.5 }}>{course.title}</p>
                  </div>
                  <div style={{ background: "#f8faff", border: "1px solid rgba(29,78,216,0.12)", borderRadius: 12, padding: "12px 16px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 4px" }}>Amount</p>
                    <p style={{ fontSize: 26, fontWeight: 800, color: BRAND, margin: 0, letterSpacing: "-0.03em" }}>₹{course.price}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setShowModal(false)} style={{
                    flex: 1, padding: "11px 0", borderRadius: 12,
                    background: "#f1f5f9", border: "1px solid #e2e8f0", color: INK,
                    fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
                  }}>Cancel</button>
                  <button onClick={() => router.push(`/dashboard/checkout/${courseId}`)} style={{
                    flex: 1, padding: "11px 0", borderRadius: 12,
                    background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
                    border: "none", color: "#fff",
                    fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
                    boxShadow: "0 8px 20px rgba(37,99,235,0.28)",
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