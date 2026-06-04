"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ArrowRight } from "lucide-react";
import Image from "next/image";

interface WebinarSlot {
  date: string;
  start: string;
  end: string;
  topic: string;
  spotsLeft: number;
  maxParticipants: number;
}

function useCountdown(targetISO: string | null) {
  const calc = useCallback(() => {
    if (!targetISO) return { d: 0, h: 0, m: 0, s: 0, expired: true };
    const diff = new Date(targetISO).getTime() - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
      expired: false,
    };
  }, [targetISO]);

  const [t, setT] = useState(calc);
  useEffect(() => {
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return t;
}

const PAD = (n: number) => String(n).padStart(2, "0");
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function fmtDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  });
}
function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hr}${m ? `:${PAD(m)}` : ""} ${ap}`;
}

export default function ServicesPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [slot, setSlot] = useState<WebinarSlot | null>(null);

  const targetISO = slot ? `${slot.date}T${slot.start}:00+05:30` : null;
  const ct = useCountdown(targetISO);

  useEffect(() => {
    fetch(`${API_URL}/bookings/public/webinar-schedule`)
      .then(r => r.json())
      .then(data => {
        const upcoming = (data.slots || []).filter((s: WebinarSlot) => {
          const diff = new Date(`${s.date}T${s.start}:00+05:30`).getTime() - Date.now();
          return diff > 0;
        });
        setSlot(upcoming[0] || null);
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
    setTimeout(() => setIsVisible(false), 320);
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:ital,opsz,wght@1,9..144,400;1,9..144,600&display=swap');

        .sp-overlay {
          background: rgba(10, 12, 20, 0.45);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .sp-card {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #fafafa;
        }
        .sp-close {
          transition: background 0.15s, transform 0.2s cubic-bezier(.23,1,.32,1);
        }
        .sp-close:hover { background: rgba(15,23,42,0.06); transform: rotate(90deg); }
        .sp-cta {
          background: #0F172A;
          transition: opacity 0.18s, transform 0.18s;
        }
        .sp-cta:hover { opacity: 0.88; transform: translateY(-1px); }
        .sp-tile { background: #f1f2f4; }

        @keyframes sp-in {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sp-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(8px) scale(0.98); }
        }
        .sp-enter { animation: sp-in 0.32s cubic-bezier(.23,1,.32,1) forwards; }
        .sp-exit  { animation: sp-out 0.26s cubic-bezier(.23,1,.32,1) forwards; }

        @keyframes sp-dot {
          0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
        }
        .sp-dot { animation: sp-dot 2s ease-in-out infinite; }
      `}</style>

      {/* Overlay */}
      <div
        className="sp-overlay fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
        onClick={close}
      >
        <div
          className={`sp-card relative w-full rounded-2xl overflow-hidden pointer-events-auto ${animIn ? "sp-enter" : "sp-exit"}`}
          style={{
            maxWidth: 360,
            boxShadow: "0 24px 60px rgba(10,12,20,0.18), 0 2px 8px rgba(10,12,20,0.06)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Top rule */}
          <div style={{ height: 2, background: "#1A3BCC" }} />

          {/* Close */}
          <button
            onClick={close}
            className="sp-close absolute top-3.5 right-3.5 z-10 w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(15,23,42,0.04)", border: "1px solid rgba(15,23,42,0.07)" }}
            aria-label="Close"
          >
            <X style={{ width: 13, height: 13, color: "#94a3b8" }} />
          </button>

          <div className="px-6 pt-5 pb-6">

            {/* Eyebrow */}
            <div className="flex items-center gap-1.5 mb-4">
              <div
                className="sp-dot w-1.5 h-1.5 rounded-full"
                style={{ background: "#22c55e" }}
              />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Free Live Webinar
              </span>
            </div>

            {/* Topic */}
            <h2
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "clamp(19px, 4.5vw, 22px)",
                fontWeight: 600,
                fontStyle: "italic",
                lineHeight: 1.25,
                color: "#0F172A",
                letterSpacing: "-0.02em",
                marginBottom: 12,
                paddingRight: 24,
              }}
            >
              {slot?.topic || "Crack your next interview — live, with Neel."}
            </h2>

            {/* Date · Time */}
            {slot && (
              <p style={{ fontSize: 12.5, color: "#64748b", marginBottom: 16, lineHeight: 1.4 }}>
                {fmtDate(slot.date)}&nbsp;&nbsp;·&nbsp;&nbsp;{fmtTime(slot.start)}–{fmtTime(slot.end)} IST
              </p>
            )}

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(15,23,42,0.07)", marginBottom: 16 }} />

            {/* Mentor */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="relative rounded-xl overflow-hidden shrink-0"
                style={{ width: 40, height: 40, border: "1px solid rgba(15,23,42,0.10)" }}
              >
                <Image src="/neel-aashish-seru.jpeg" alt="Neel" fill className="object-cover object-top" />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>
                  Neel Aashish Seru
                </p>
                <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>
                  Ex-Tech Mahindra · IndiaMART · 5,000+ coached
                </p>
              </div>
            </div>

            {/* Countdown — only if slot exists and not expired */}
            {slot && !ct.expired && (
              <div className="grid grid-cols-4 gap-1.5 mb-5">
                {[
                  { v: ct.d, l: "Days" },
                  { v: ct.h, l: "Hrs" },
                  { v: ct.m, l: "Min" },
                  { v: ct.s, l: "Sec" },
                ].map(({ v, l }) => (
                  <div key={l} className="sp-tile rounded-xl flex flex-col items-center py-2">
                    <span style={{
                      fontSize: 18, fontWeight: 700, color: "#0F172A", lineHeight: 1,
                      fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em",
                    }}>
                      {PAD(v)}
                    </span>
                    <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginTop: 3 }}>
                      {l}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <a
              href="https://www.yourinterviewcoach.in/select-slot?serviceId=webinars"
              className="sp-cta w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-[13.5px]"
              style={{ textDecoration: "none", letterSpacing: "-0.01em" }}
            >
              Reserve My Free Seat
              <ArrowRight style={{ width: 13, height: 13 }} />
            </a>

            <p style={{ fontSize: 10.5, color: "#cbd5e1", textAlign: "center", marginTop: 8 }}>
              Free · No card required
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
