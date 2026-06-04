"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ArrowRight } from "lucide-react";
import Image from "next/image";

/* ── Site color tokens (matches HeroSection) ─────────────── */
const BRAND      = "#2563eb";
const BRAND_DEEP = "#1d4ed8";
const INK        = "#0f172a";
const MUTED      = "#64748b";
const PAPER      = "#F8F6F1";
const RULE       = "rgba(15,23,42,0.08)";

/* ── Types ───────────────────────────────────────────────── */
interface WebinarSlot {
  date: string;
  start: string;
  end: string;
  topic: string;
  spotsLeft: number;
  maxParticipants: number;
}

/* ── Countdown ───────────────────────────────────────────── */
// Counts down to an absolute UTC moment derived from the slot's IST datetime.
// Because both target and Date.now() are absolute, every visitor's browser
// ticks toward the same real-world moment — the display is globally consistent.
function useCountdown(iso: string | null) {
  const calc = useCallback((): { d: number; h: number; m: number; s: number; expired: boolean } => {
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

  const [t, setT] = useState<ReturnType<typeof calc>>(calc);
  useEffect(() => {
    // Re-evaluate immediately when iso changes, then tick every second
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return t;
}

const PAD = (n: number) => String(n).padStart(2, "0");
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

/* ── Component ───────────────────────────────────────────── */
export default function ServicesPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [slot, setSlot] = useState<WebinarSlot | null>(null);

  const iso = slot ? `${slot.date}T${slot.start}:00+05:30` : null;
  const ct  = useCountdown(iso);

  useEffect(() => {
    fetch(`${API_URL}/bookings/public/webinar-schedule`)
      .then(r => r.json())
      .then(data => {
        const next = (data.slots || []).find((s: WebinarSlot) =>
          new Date(`${s.date}T${s.start}:00+05:30`).getTime() > Date.now()
        );
        setSlot(next || null);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const show = () => {
      if (hasShown) return;
      setHasShown(true);
      setIsVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    };
    const timer = setTimeout(show, 12000);
    const onScroll = () => { if (window.scrollY > 300) show(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  }, [hasShown]);

  const close = () => {
    setAnimIn(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        .sp-overlay {
          background: rgba(3,7,18,0.50);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .sp-card {
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .sp-close-btn {
          transition: background 0.15s, transform 0.22s cubic-bezier(.23,1,.32,1);
        }
        .sp-close-btn:hover {
          background: rgba(15,23,42,0.08);
          transform: rotate(90deg);
        }
        .sp-cta-btn {
          background: ${BRAND};
          transition: background 0.16s, transform 0.16s;
        }
        .sp-cta-btn:hover {
          background: ${BRAND_DEEP};
          transform: translateY(-1px);
        }
        @keyframes sp-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sp-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(8px) scale(0.97); }
        }
        .sp-enter { animation: sp-in  0.30s cubic-bezier(.23,1,.32,1) forwards; }
        .sp-exit  { animation: sp-out 0.24s cubic-bezier(.23,1,.32,1) forwards; }
        @keyframes sp-blink {
          0%,100% { opacity: 1; } 50% { opacity: 0.25; }
        }
        .sp-blink { animation: sp-blink 2s ease-in-out infinite; }
      `}</style>

      {/* ── Overlay ── */}
      <div
        className="sp-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={close}
      >
        {/* ── Card ── */}
        <div
          className={`sp-card relative w-full overflow-hidden pointer-events-auto ${animIn ? "sp-enter" : "sp-exit"}`}
          style={{
            maxWidth: 352,
            borderRadius: 20,
            background: "#ffffff",
            boxShadow: "0 20px 60px rgba(3,7,18,0.20), 0 2px 8px rgba(3,7,18,0.06)",
            border: `1px solid ${RULE}`,
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Accent stripe */}
          <div style={{ height: 3, background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DEEP})` }} />

          {/* Close */}
          <button
            onClick={close}
            className="sp-close-btn absolute top-3.5 right-3.5 z-10 w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(15,23,42,0.04)", border: `1px solid ${RULE}` }}
            aria-label="Close"
          >
            <X style={{ width: 13, height: 13, color: MUTED }} />
          </button>

          <div style={{ padding: "20px 22px 22px" }}>

            {/* ── Eyebrow ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <div
                className="sp-blink"
                style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }}
              />
              <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                Free Live Webinar
              </span>
            </div>

            {/* ── Topic ── */}
            <p
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: INK,
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
                marginBottom: slot ? 8 : 16,
                paddingRight: 20,
              }}
            >
              {slot?.topic || "Crack your next interview — live."}
            </p>

            {/* ── Date + time ── */}
            {slot && (
              <p style={{ fontSize: 12, color: MUTED, marginBottom: 16, fontWeight: 500 }}>
                {fmtDate(slot.date)}&nbsp; · &nbsp;{fmtTime(slot.start)} – {fmtTime(slot.end)} IST
              </p>
            )}

            {/* ── Divider ── */}
            <div style={{ height: 1, background: RULE, marginBottom: 16 }} />

            {/* ── Mentor ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div
                style={{
                  position: "relative", width: 38, height: 38,
                  borderRadius: 10, overflow: "hidden", flexShrink: 0,
                  border: `1px solid ${RULE}`,
                }}
              >
                <Image src="/neel-aashish-seru.jpeg" alt="Neel" fill className="object-cover object-top" />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: INK, lineHeight: 1.2 }}>
                  Neel Aashish Seru
                </p>
                <p style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                  Ex-Tech Mahindra · 5,000+ coached
                </p>
              </div>
            </div>

            {/* ── Countdown ── */}
            {slot && !ct.expired && (
              <div
                style={{
                  // Show 4 tiles when days > 0, else 3
                  display: "grid",
                  gridTemplateColumns: ct.d > 0 ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
                  gap: 8, marginBottom: 18,
                }}
              >
                {(ct.d > 0
                  ? [{ v: ct.d, l: "Days" }, { v: ct.h, l: "Hrs" }, { v: ct.m, l: "Min" }, { v: ct.s, l: "Sec" }]
                  : [{ v: ct.h, l: "Hrs" }, { v: ct.m, l: "Min" }, { v: ct.s, l: "Sec" }]
                ).map(({ v, l }) => (
                  <div
                    key={l}
                    style={{
                      background: PAPER,
                      borderRadius: 10,
                      padding: "8px 0",
                      display: "flex", flexDirection: "column", alignItems: "center",
                      border: `1px solid ${RULE}`,
                    }}
                  >
                    <span style={{
                      fontSize: 20, fontWeight: 700, color: INK, lineHeight: 1,
                      fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em",
                    }}>
                      {PAD(v)}
                    </span>
                    <span style={{ fontSize: 9, color: MUTED, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginTop: 3 }}>
                      {l}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ── CTA ── */}
            <a
              href="https://www.yourinterviewcoach.in/select-slot?serviceId=webinars"
              className="sp-cta-btn"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                width: "100%", padding: "11px 0", borderRadius: 11,
                color: "#fff", fontWeight: 600, fontSize: 13.5,
                textDecoration: "none", letterSpacing: "-0.01em",
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              Reserve My Free Seat
              <ArrowRight style={{ width: 13, height: 13 }} />
            </a>

            <p style={{ fontSize: 10.5, color: "#94a3b8", textAlign: "center", marginTop: 8 }}>
              Free · No card required
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
