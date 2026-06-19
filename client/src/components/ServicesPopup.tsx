"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { X, ArrowRight, BookOpen, Clock, Lock, Play, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BRAND      = "#2563eb";
const BRAND_DEEP = "#1d4ed8";
const INK        = "#0f172a";
const MUTED      = "#64748b";
const PAPER      = "#F8F6F1";
const GREEN      = "#059669";
const RULE       = "rgba(15,23,42,0.08)";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/* ── types ─────────────────────────────────────────────────── */
interface WebinarSlot {
  date: string;
  start: string;
  end: string;
  topic: string;
  spotsLeft: number;
  maxParticipants: number;
}

interface Course {
  _id: string;
  title: string;
  shortDescription?: string;
  contentType: "free" | "paid" | "exclusive";
  price?: number;
  discount?: { type: string; value: number; isActive: boolean };
  thumbnail?: string;
  totalDuration?: number;
  modules?: { title: string }[];
}

/* ── helpers ────────────────────────────────────────────────── */
const PAD = (n: number) => String(n).padStart(2, "0");

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  });
}
function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hr}${m ? `:${PAD(m)}` : ""} ${ap}`;
}
function fmtDuration(mins: number) {
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}

/* ── countdown hook ─────────────────────────────────────────── */
function useCountdown(iso: string | null) {
  const calc = useCallback(() => {
    if (!iso) return { d: 0, h: 0, m: 0, s: 0, expired: true };
    const diff = new Date(iso).getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
      expired: false,
    };
  }, [iso]);

  const [t, setT] = useState(calc);
  useEffect(() => {
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return t;
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */
export default function ServicesPopup() {
  const [isVisible, setIsVisible]   = useState(false);
  const [hasShown, setHasShown]     = useState(false);
  const [animIn, setAnimIn]         = useState(false);
  const [slot, setSlot]             = useState<WebinarSlot | null>(null);
  const [course, setCourse]         = useState<Course | null>(null);
  const [mode, setMode]             = useState<"webinar" | "course">("webinar");
  // track whether we've already transitioned to course so re-poll can re-show webinar
  const transitionedRef             = useRef(false);

  /* ── fetch webinar slot (poll every 60s) ── */
  const fetchSlot = useCallback(() => {
    fetch(`${API_URL}/bookings/public/webinar-schedule`)
      .then(r => r.json())
      .then(data => {
        const next = (data.slots || []).find((s: WebinarSlot) =>
          new Date(`${s.date}T${s.start}:00+05:30`).getTime() > Date.now()
        );
        if (next) {
          setSlot(next);
          // If a new webinar appeared while we were showing the course fallback,
          // swap back to webinar mode and re-show
          if (transitionedRef.current) {
            transitionedRef.current = false;
            setMode("webinar");
            setIsVisible(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
          }
        } else {
          setSlot(null);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchSlot();
    const id = setInterval(fetchSlot, 60_000);
    return () => clearInterval(id);
  }, [fetchSlot]);

  /* ── fetch featured course once ── */
  useEffect(() => {
    fetch(`${API_URL}/advanced/courses/public?limit=1&sortBy=createdAt&sortOrder=desc`)
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.courses?.[0]) setCourse(d.data.courses[0]); })
      .catch(() => {});
  }, []);

  /* ── auto-show popup after 3 s or first scroll ── */
  useEffect(() => {
    const show = () => {
      if (hasShown) return;
      setHasShown(true);
      setIsVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    };
    const timer = setTimeout(show, 3000);
    const onScroll = () => { if (window.scrollY > 100) show(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  }, [hasShown]);

  /* ── close ── */
  const close = useCallback(() => {
    setAnimIn(false);
    setTimeout(() => setIsVisible(false), 300);
  }, []);

  /* ── countdown ── */
  const iso = slot ? `${slot.date}T${slot.start}:00+05:30` : null;
  const ct  = useCountdown(iso);

  /* ── when countdown expires → swap to course card ── */
  useEffect(() => {
    if (ct.expired && mode === "webinar" && isVisible && !transitionedRef.current) {
      transitionedRef.current = true;
      // brief fade-out then swap content
      setAnimIn(false);
      setTimeout(() => {
        setMode("course");
        setAnimIn(true);
      }, 320);
    }
  }, [ct.expired, mode, isVisible]);

  /* ── course price helpers ── */
  const isPaid = course?.contentType === "paid" || course?.contentType === "exclusive";
  const hasDiscount = isPaid && course?.discount?.isActive && course.discount.type !== "none" && (course.discount.value ?? 0) > 0;
  const discAmt = hasDiscount
    ? course!.discount!.type === "percentage"
      ? Math.round(((course!.price ?? 0) * course!.discount!.value) / 100)
      : course!.discount!.value
    : 0;
  const effective = hasDiscount ? Math.max(0, (course!.price ?? 0) - discAmt) : (course!.price ?? 0);
  const moduleCount = course?.modules?.length ?? 0;

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        .sp-overlay {
          background: rgba(3,7,18,0.50);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .sp-card { font-family: 'DM Sans', system-ui, sans-serif; }
        .sp-close-btn { transition: background 0.15s, transform 0.22s cubic-bezier(.23,1,.32,1); }
        .sp-close-btn:hover { background: rgba(15,23,42,0.08); transform: rotate(90deg); }
        .sp-cta-btn { background: ${BRAND}; transition: background 0.16s, transform 0.16s; }
        .sp-cta-btn:hover { background: ${BRAND_DEEP}; transform: translateY(-1px); }
        @keyframes sp-in  { from { opacity:0; transform:translateY(12px) scale(0.97); } to { opacity:1; transform:none; } }
        @keyframes sp-out { from { opacity:1; transform:none; } to { opacity:0; transform:translateY(8px) scale(0.97); } }
        .sp-enter { animation: sp-in  0.30s cubic-bezier(.23,1,.32,1) forwards; }
        .sp-exit  { animation: sp-out 0.24s cubic-bezier(.23,1,.32,1) forwards; }
        @keyframes sp-blink { 0%,100%{opacity:1;} 50%{opacity:0.25;} }
        .sp-blink { animation: sp-blink 2s ease-in-out infinite; }
      `}</style>

      <div className="sp-overlay fixed inset-0 z-50 flex items-center justify-center p-4" onClick={close}>
        <div
          className={`sp-card relative w-full overflow-hidden pointer-events-auto ${animIn ? "sp-enter" : "sp-exit"}`}
          style={{ maxWidth: 352, borderRadius: 20, background: "#fff",
            boxShadow: "0 20px 60px rgba(3,7,18,0.20), 0 2px 8px rgba(3,7,18,0.06)",
            border: `1px solid ${RULE}` }}
          onClick={e => e.stopPropagation()}
        >
          {/* accent bar */}
          <div style={{ height: 3, background: `linear-gradient(90deg,${BRAND},${BRAND_DEEP})` }} />

          {/* close */}
          <button onClick={close}
            className="sp-close-btn absolute top-3.5 right-3.5 z-10 w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(15,23,42,0.04)", border: `1px solid ${RULE}` }}
            aria-label="Close">
            <X style={{ width: 13, height: 13, color: MUTED }} />
          </button>

          {/* ════════ WEBINAR MODE ════════ */}
          {mode === "webinar" && (
            <div style={{ padding: "20px 22px 22px" }}>

              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                <div className="sp-blink"
                  style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                  Free Live Webinar
                </span>
              </div>

              <p style={{ fontSize: 17, fontWeight: 600, color: INK, lineHeight: 1.3,
                letterSpacing: "-0.02em", marginBottom: slot ? 8 : 16, paddingRight: 20 }}>
                {slot?.topic || "Crack your next interview — live."}
              </p>

              {slot && (
                <p style={{ fontSize: 12, color: MUTED, marginBottom: 16, fontWeight: 500 }}>
                  {fmtDate(slot.date)}&nbsp;·&nbsp;{fmtTime(slot.start)} – {fmtTime(slot.end)} IST
                </p>
              )}

              <div style={{ height: 1, background: RULE, marginBottom: 16 }} />

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ position: "relative", width: 38, height: 38, borderRadius: 10,
                  overflow: "hidden", flexShrink: 0, border: `1px solid ${RULE}` }}>
                  <Image src="/neel-aashish-seru.jpeg" alt="Neel" fill className="object-cover object-top" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: INK, lineHeight: 1.2 }}>Neel Aashish Seru</p>
                  <p style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Ex-IndiaMART · Ex-Tech Mahindra · 5,000+ coached</p>
                </div>
              </div>

              {slot && !ct.expired && (
                <div style={{ display: "grid",
                  gridTemplateColumns: ct.d > 0 ? "repeat(4,1fr)" : "repeat(3,1fr)",
                  gap: 8, marginBottom: 18 }}>
                  {(ct.d > 0
                    ? [{ v: ct.d, l: "Days" }, { v: ct.h, l: "Hrs" }, { v: ct.m, l: "Min" }, { v: ct.s, l: "Sec" }]
                    : [{ v: ct.h, l: "Hrs" }, { v: ct.m, l: "Min" }, { v: ct.s, l: "Sec" }]
                  ).map(({ v, l }) => (
                    <div key={l} style={{ background: PAPER, borderRadius: 10, padding: "8px 0",
                      display: "flex", flexDirection: "column", alignItems: "center",
                      border: `1px solid ${RULE}` }}>
                      <span style={{ fontSize: 20, fontWeight: 700, color: INK, lineHeight: 1,
                        fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
                        {PAD(v)}
                      </span>
                      <span style={{ fontSize: 9, color: MUTED, fontWeight: 600,
                        letterSpacing: "0.07em", textTransform: "uppercase", marginTop: 3 }}>
                        {l}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <a href="https://www.yourinterviewcoach.in/select-slot?serviceId=webinars"
                className="sp-cta-btn"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  width: "100%", padding: "11px 0", borderRadius: 11,
                  color: "#fff", fontWeight: 600, fontSize: 13.5,
                  textDecoration: "none", letterSpacing: "-0.01em",
                  fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                Reserve My Free Seat
                <ArrowRight style={{ width: 13, height: 13 }} />
              </a>

              <p style={{ fontSize: 10.5, color: "#94a3b8", textAlign: "center", marginTop: 8 }}>
                Free · No card required
              </p>
            </div>
          )}

          {/* ════════ COURSE FALLBACK MODE ════════ */}
          {mode === "course" && course && (
            <div>
              {/* thumbnail */}
              <div style={{ position: "relative", paddingTop: "50%",
                background: `linear-gradient(135deg,${INK},${BRAND_DEEP})` }}>
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex",
                    alignItems: "center", justifyContent: "center" }}>
                    <BookOpen style={{ width: 40, height: 40, color: "rgba(255,255,255,0.15)" }} />
                  </div>
                )}
                <div style={{ position: "absolute", inset: 0,
                  background: "linear-gradient(to top,rgba(15,23,42,0.5) 0%,transparent 55%)" }} />
                <div style={{ position: "absolute", top: 10, left: 10,
                  background: `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`,
                  color: "#fff", fontSize: 9.5, fontWeight: 800,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  padding: "4px 10px", borderRadius: 99,
                  boxShadow: "0 2px 8px rgba(37,99,235,0.4)" }}>
                  ★ Featured Course
                </div>
                {isPaid && (course.price ?? 0) > 0 && (
                  <div style={{ position: "absolute", bottom: 10, right: 10,
                    background: "rgba(15,23,42,0.82)", backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
                    padding: "5px 10px", display: "flex", alignItems: "baseline", gap: 5 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>
                      ₹{effective.toLocaleString("en-IN")}
                    </span>
                    {hasDiscount && (
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "line-through" }}>
                        ₹{course.price?.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div style={{ padding: "16px 18px 18px" }}>
                {/* expiry notice */}
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12,
                  background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.14)",
                  borderRadius: 8, padding: "7px 10px" }}>
                  <span style={{ fontSize: 13 }}>⏰</span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: BRAND }}>
                    Webinar ended — check out this course!
                  </span>
                </div>

                <h3 style={{ fontSize: 15.5, fontWeight: 800, color: INK, margin: "0 0 6px",
                  lineHeight: 1.3, letterSpacing: "-0.02em",
                  display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {course.title}
                </h3>

                {course.shortDescription && (
                  <p style={{ fontSize: 12.5, color: MUTED, margin: "0 0 10px", lineHeight: 1.55,
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {course.shortDescription}
                  </p>
                )}

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                  {(course.totalDuration ?? 0) > 0 && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: MUTED }}>
                      <Clock style={{ width: 11, height: 11 }} />{fmtDuration(course.totalDuration!)}
                    </span>
                  )}
                  {moduleCount > 0 && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: MUTED }}>
                      <BookOpen style={{ width: 11, height: 11 }} />{moduleCount} modules
                    </span>
                  )}
                </div>

                {hasDiscount && (
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14,
                    padding: "7px 10px", borderRadius: 8, background: "rgba(5,150,105,0.06)",
                    border: "1px solid rgba(5,150,105,0.15)" }}>
                    <Tag style={{ width: 12, height: 12, color: GREEN, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>
                      Save ₹{discAmt.toLocaleString("en-IN")} —&nbsp;
                      {course.discount!.type === "percentage" ? `${course.discount!.value}% off` : `₹${course.discount!.value} off`}
                    </span>
                  </div>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={`/courses/${course._id}`} onClick={close} style={{
                    flex: 1, padding: "10px 0", borderRadius: 10,
                    fontSize: 13, fontWeight: 700, color: BRAND,
                    background: "rgba(37,99,235,0.06)", border: "1.5px solid rgba(37,99,235,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                    textDecoration: "none" }}>
                    <Play style={{ width: 11, height: 11, fill: BRAND }} /> Preview
                  </Link>
                  <Link
                    href={isPaid ? `/dashboard/checkout/${course._id}` : `/dashboard/content/${course._id}`}
                    onClick={close}
                    style={{
                      flex: 1.4, padding: "10px 0", borderRadius: 10,
                      fontSize: 13, fontWeight: 700, color: "#fff",
                      background: isPaid
                        ? `linear-gradient(135deg,${BRAND},${BRAND_DEEP})`
                        : `linear-gradient(135deg,${GREEN},#047857)`,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      textDecoration: "none",
                      boxShadow: isPaid
                        ? "0 4px 14px rgba(37,99,235,0.3)"
                        : "0 4px 14px rgba(5,150,105,0.3)" }}>
                    {isPaid
                      ? <><Lock style={{ width: 11, height: 11 }} /> Enroll Now</>
                      : <><Play style={{ width: 11, height: 11, fill: "#fff" }} /> Enroll Free</>}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}