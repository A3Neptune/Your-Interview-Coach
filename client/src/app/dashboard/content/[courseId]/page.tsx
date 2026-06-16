"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Clock, CheckCircle, ExternalLink, Play, Lock, BookOpen,
  Award, ChevronRight, TrendingUp,
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
  fullDescription?: string;
  description?: string;
  contentType: "free" | "paid" | "exclusive";
  category: string;
  difficulty?: string;
  price?: number;
  tags?: string[];
  modules?: Array<{
    title: string;
    description?: string;
    order: number;
    estimatedDuration?: number;
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
    profileImage?: string;
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

export default function CourseDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse]            = useState<Course | null>(null);
  const [contents, setContents]        = useState<Content[]>([]);
  const [selected, setSelected]        = useState<Content | null>(null);
  const [isLoading, setLoading]        = useState(true);
  const [isEnrolled, setIsEnrolled]    = useState(false);
  const [isEnrolling, setEnrolling]    = useState(false);
  const [showModal, setShowModal]      = useState(false);
  const [videoCache, setVideoCache]    = useState<Map<string, string>>(new Map());
  const [completedItems, setCompleted] = useState<Set<string>>(new Set());

  // ── Fetch ─────────────────────────────────────────────────────────────────
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
    if (!selected?.videoUrl) return;
    setVideoCache(p => new Map(p).set(selected._id, selected.videoUrl!));
  }, [selected]);

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

  // ── Player ────────────────────────────────────────────────────────────────
  const renderPlayer = () => {
    if (!selected) return (
      <div style={{
        borderRadius: 20, aspectRatio: "16/9",
        background: "rgba(255,255,255,0.72)", border: "1px solid rgba(29,78,216,0.09)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
      }}>
        <BookOpen style={{ width: 44, height: 44, color: "#cbd5e1" }} />
        <p style={{ color: MUTED, fontWeight: 600 }}>Select a lesson below</p>
      </div>
    );

    // Lock wall
    if (!canWatch) {
      return (
        <div style={{
          borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(29,78,216,0.14)",
          boxShadow: "0 8px 32px rgba(29,78,216,0.08)",
        }}>
          <div style={{
            position: "relative", aspectRatio: "16/9",
            background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
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
    }

    switch (selected.contentType) {
      case "google-doc":
      case "google-sheet": {
        const docUrl = getValidUrl(selected.embedUrl);
        if (!docUrl) return <div style={{ borderRadius: 16, border: "1px solid #fde68a", background: "#fffbeb", padding: "28px", textAlign: "center" }}><p style={{ color: "#92400e", fontWeight: 600 }}>Invalid lesson link</p></div>;
        return <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(29,78,216,0.14)" }}><iframe src={docUrl} style={{ width: "100%", height: 520, display: "block" }} allow="fullscreen" title={selected.title} /></div>;
      }

      case "video-link": {
        const rawUrl   = videoCache.get(selected._id) || selected.videoUrl;
        const videoUrl = getValidUrl(rawUrl);
        if (!videoUrl) return <div style={{ borderRadius: 16, border: "1px solid #fde68a", background: "#fffbeb", padding: "28px", textAlign: "center" }}><p style={{ color: "#92400e", fontWeight: 600 }}>Invalid video link</p></div>;

        const getYtThumb = (url: string) => {
          try {
            const u = new URL(url);
            const vid = u.searchParams.get("v") || (u.hostname === "youtu.be" ? u.pathname.slice(1) : null);
            if (vid) return `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
          } catch {}
          return null;
        };
        const isYT       = /youtube\.com|youtu\.be/i.test(videoUrl);
        const ytThumb    = isYT ? getYtThumb(videoUrl) : null;
        const isPlaylist = /[?&]list=/i.test(videoUrl) && !/[?&]v=/.test(videoUrl);

        return (
          <div style={{ borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid rgba(29,78,216,0.1)", boxShadow: "0 4px 20px rgba(29,78,216,0.06)" }}>
            <div style={{ position: "relative", aspectRatio: "16/9", background: "#0f172a", overflow: "hidden" }}>
              {ytThumb && !isPlaylist
                ? <img src={ytThumb} alt={selected.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "rgba(255,255,255,0.3)" }}>
                    <svg viewBox="0 0 90 20" style={{ width: 90, fill: "rgba(255,255,255,0.18)" }}>
                      <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 0 14.285 0 14.285 0C14.285 0 5.35042 0 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C0 5.35042 0 10 0 10C0 10 0 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5701 5.35042 27.9727 3.12324ZM11.4253 14.2854V5.71458L18.8477 10.0001L11.4253 14.2854Z" />
                    </svg>
                    <p style={{ fontSize: 12 }}>{isPlaylist ? "YouTube Playlist" : "YouTube Video"}</p>
                  </div>
              }
            </div>
            <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <p style={{ fontSize: 15.5, fontWeight: 700, color: INK, margin: 0, letterSpacing: "-0.01em" }}>{selected.title}</p>
                {selected.description && <p style={{ fontSize: 13, color: MUTED, margin: "5px 0 0", lineHeight: 1.6 }}>{selected.description}</p>}
                {selected.duration > 0 && (
                  <p style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 500, margin: "5px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock style={{ width: 11, height: 11 }} /> {selected.duration} min
                  </p>
                )}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  padding: "10px 0", borderRadius: 11,
                  background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                  color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none",
                  boxShadow: "0 5px 16px rgba(220,38,38,0.28)",
                }}>
                  <Play style={{ width: 13, height: 13, fill: "#fff" }} /> Watch on YouTube
                  <ExternalLink style={{ width: 12, height: 12, opacity: 0.7 }} />
                </a>
                {isEnrolled && (
                  <button onClick={() => toggleDone(selected._id)} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "10px 14px", borderRadius: 11,
                    border: "1px solid",
                    borderColor: completedItems.has(selected._id) ? "#6ee7b7" : "rgba(29,78,216,0.18)",
                    background: completedItems.has(selected._id) ? "#f0fdf4" : "rgba(255,255,255,0.9)",
                    color: completedItems.has(selected._id) ? "#059669" : MUTED,
                    fontWeight: 600, fontSize: 12.5, cursor: "pointer", fontFamily: "inherit",
                    flexShrink: 0,
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

      case "pdf":
        return <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(29,78,216,0.14)" }}><embed src={selected.videoUrl} type="application/pdf" width="100%" height="600" /></div>;

      default:
        return (
          <div style={{ borderRadius: 16, border: "1px solid rgba(29,78,216,0.14)", background: "#fff", padding: "28px", textAlign: "center" }}>
            <p style={{ color: MUTED }}>Content type not supported for preview</p>
            {selected.videoUrl && <a href={selected.videoUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, color: BRAND, fontWeight: 600, textDecoration: "none", fontSize: 13 }}>Open content <ExternalLink style={{ width: 12, height: 12 }} /></a>}
          </div>
        );
    }
  };

  // ── Loading / not found ───────────────────────────────────────────────────
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
        .cd-scroll::-webkit-scrollbar{display:none}
        .lesson-tile:hover{background:rgba(37,99,235,0.06)!important;border-color:rgba(29,78,216,0.28)!important;}
      `}</style>

      <div style={{ minHeight: "100vh", background: PAPER, fontFamily: "'DM Sans',system-ui,sans-serif" }}>
        {/* Ambient */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "5%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(29,78,216,0.05) 0%,transparent 70%)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(8,145,178,0.04) 0%,transparent 70%)", filter: "blur(80px)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1360, margin: "0 auto", padding: "clamp(16px,3vw,32px) clamp(16px,3vw,28px)" }}>

          {/* ── Breadcrumb ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <Link href="/dashboard/content" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 12.5, fontWeight: 600, color: BRAND, textDecoration: "none",
              padding: "5px 12px", borderRadius: 10,
              background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.15)",
            }}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> All Courses
            </Link>
            <ChevronRight style={{ width: 12, height: 12, color: "#94a3b8" }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: INK, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {course.title}
            </span>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              BENTO GRID — top row
              [Player 2/3]  [Course Info 1/3]
          ═══════════════════════════════════════════════════════════════ */}
          <div style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "1fr",
            marginBottom: 16,
          }} className="lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px]">

            {/* ── Player ── */}
            <div style={{ minWidth: 0 }}>
              {renderPlayer()}
            </div>

            {/* ── Course Info card ── */}
            <div style={{
              borderRadius: 20,
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(29,78,216,0.12)",
              boxShadow: "0 4px 20px rgba(29,78,216,0.07)",
              overflow: "hidden",
              display: "flex", flexDirection: "column",
            }}>
              {/* Blue top line */}
              <div style={{ height: 3, background: `linear-gradient(90deg,${BRAND},${BRAND_DEEP})`, flexShrink: 0 }} />

              <div style={{ padding: "20px 20px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Title + category */}
                <div>
                  <span style={{
                    display: "inline-block", fontSize: 10, fontWeight: 700,
                    color: BRAND, background: "#eff6ff", border: "1px solid #bfdbfe",
                    padding: "2px 9px", borderRadius: 99, textTransform: "capitalize", marginBottom: 8,
                  }}>
                    {CAT_LABEL[course.category] ?? course.category.replace(/-/g, " ")}
                  </span>
                  <h2 style={{ fontSize: "clamp(15px,1.5vw,18px)", fontWeight: 700, color: INK, margin: 0, letterSpacing: "-0.022em", lineHeight: 1.3 }}>
                    {course.title}
                  </h2>
                  {course.shortDescription && (
                    <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.65, margin: "8px 0 0" }}>{course.shortDescription}</p>
                  )}
                </div>

                {/* Enroll status / button */}
                {isEnrolled ? (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 14px", borderRadius: 12,
                    background: "#f0fdf4", border: "1px solid #bbf7d0",
                    color: "#059669", fontWeight: 600, fontSize: 13,
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
                    boxShadow: "0 8px 22px rgba(37,99,235,0.30)",
                  }}>
                    {isEnrolling
                      ? <><span style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Enrolling…</>
                      : isPaidCourse ? <><Lock style={{ width: 13, height: 13 }} /> Enroll — ₹{course.price}</> : <><Play style={{ width: 13, height: 13, fill: "#fff" }} /> Enroll for Free</>
                    }
                  </button>
                )}

                {/* Progress if enrolled */}
                {isEnrolled && contents.length > 0 && (
                  <div style={{
                    borderRadius: 14, padding: "14px 16px",
                    background: "rgba(37,99,235,0.04)",
                    border: "1px solid rgba(29,78,216,0.1)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: INK }}>
                        <TrendingUp style={{ width: 12, height: 12, color: BRAND }} /> Your Progress
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: progressPct === 100 ? "#059669" : BRAND }}>{progressPct}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: "rgba(29,78,216,0.1)", overflow: "hidden", marginBottom: 8 }}>
                      <div style={{
                        height: "100%", borderRadius: 99, width: `${progressPct}%`, transition: "width 0.5s ease",
                        background: progressPct === 100 ? "linear-gradient(90deg,#10b981,#059669)" : `linear-gradient(90deg,${BRAND},${BRAND_DEEP})`,
                      }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>{completedItems.size} of {contents.length} done</span>
                      {progressPct === 100 && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#059669", fontWeight: 700 }}>
                          <Award style={{ width: 11, height: 11 }} /> Completed!
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Instructor */}
                <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid rgba(29,78,216,0.08)" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.09em", margin: "0 0 10px" }}>
                    Instructor
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                      background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 12, fontWeight: 700,
                      boxShadow: "0 3px 10px rgba(29,78,216,0.25)",
                    }}>
                      {initials}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: INK, margin: 0 }}>{course.mentorId.name}</p>
                      <p style={{ fontSize: 11, color: MUTED, margin: "2px 0 0" }}>{course.mentorId.designation}</p>
                      {course.mentorId.company && <p style={{ fontSize: 10.5, color: BRAND, fontWeight: 600, margin: "1px 0 0" }}>{course.mentorId.company}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              LESSONS BENTO GRID
          ═══════════════════════════════════════════════════════════════ */}
          {contents.length > 0 && (
            <div style={{
              borderRadius: 20,
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(29,78,216,0.12)",
              boxShadow: "0 4px 20px rgba(29,78,216,0.07)",
              overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{
                padding: "16px 22px",
                borderBottom: "1px solid rgba(29,78,216,0.08)",
                background: "linear-gradient(to right,rgba(37,99,235,0.04),transparent)",
                display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <BookOpen style={{ width: 15, height: 15, color: BRAND }} />
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: INK, margin: 0 }}>
                    Lessons
                    <span style={{ fontWeight: 500, color: "#94a3b8", marginLeft: 6 }}>({contents.length})</span>
                  </h3>
                  {isPaidCourse && !isEnrolled && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      fontSize: 10, fontWeight: 700, color: "#92400e",
                      background: "#fef3c7", border: "1px solid #fde68a",
                      padding: "3px 8px", borderRadius: 99,
                    }}>
                      <Lock style={{ width: 8, height: 8 }} /> Locked
                    </span>
                  )}
                </div>
                {isEnrolled && (
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: progressPct === 100 ? "#059669" : MUTED }}>
                    {completedItems.size}/{contents.length} completed · {progressPct}%
                  </span>
                )}
              </div>

              {/* Bento tile grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 1,
                background: "rgba(29,78,216,0.06)",
              }}>
                {contents.map((c, i) => {
                  const done   = completedItems.has(c._id);
                  const active = selected?._id === c._id;
                  const locked = isPaidCourse && !isEnrolled;

                  let tileBg = "#fff";
                  if (active && !locked) tileBg = "rgba(37,99,235,0.07)";
                  else if (done) tileBg = "rgba(16,185,129,0.05)";

                  return (
                    <button
                      key={c._id}
                      onClick={() => !locked && setSelected(c)}
                      disabled={locked}
                      className={!locked ? "lesson-tile" : ""}
                      style={{
                        background: tileBg,
                        border: "none",
                        borderLeft: active && !locked ? `3px solid ${BRAND}` : "3px solid transparent",
                        padding: "16px 16px 14px",
                        textAlign: "left",
                        cursor: locked ? "not-allowed" : "pointer",
                        opacity: locked ? 0.5 : 1,
                        fontFamily: "inherit",
                        display: "flex", flexDirection: "column", gap: 8,
                        transition: "background 0.15s, border-color 0.15s",
                        minHeight: 100,
                        position: "relative",
                      }}
                    >
                      {/* Top row: number + status */}
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
                            ? <Lock style={{ width: 10, height: 10, color: "#94a3b8" }} />
                            : done
                              ? <CheckCircle style={{ width: 13, height: 13, color: "#fff", fill: "#fff" }} />
                              : active
                                ? <Play style={{ width: 9, height: 9, color: "#fff", fill: "#fff", marginLeft: 1 }} />
                                : <span style={{ fontSize: 9.5, fontWeight: 700, color: BRAND }}>{i + 1}</span>
                          }
                        </div>

                        {c.duration > 0 && (
                          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10.5, color: "#94a3b8", fontWeight: 500 }}>
                            <Clock style={{ width: 9, height: 9 }} />{c.duration}m
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <p style={{
                        fontSize: 12.5, fontWeight: active ? 700 : 600,
                        color: done ? "#94a3b8" : active ? BRAND_DEEP : INK,
                        margin: 0, lineHeight: 1.4,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                        textDecoration: done ? "line-through" : "none",
                        flex: 1,
                      }}>
                        {c.title}
                      </p>

                      {/* Done badge */}
                      {done && (
                        <span style={{ fontSize: 10, color: "#059669", fontWeight: 700 }}>✓ Done</span>
                      )}

                      {/* Active indicator dot */}
                      {active && !locked && (
                        <div style={{
                          position: "absolute", bottom: 10, right: 12,
                          width: 6, height: 6, borderRadius: "50%",
                          background: BRAND,
                          boxShadow: `0 0 0 2px rgba(37,99,235,0.2)`,
                        }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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