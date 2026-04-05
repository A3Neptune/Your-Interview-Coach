"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";

export default function ServicesPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    const show = () => {
      if (hasShown) return;
      setHasShown(true);
      setIsVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    };

    const timer = setTimeout(show, 12000);

    const onScroll = () => {
      if (window.scrollY > 300) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasShown]);

  const close = () => {
    setAnimIn(false);
    setTimeout(() => setIsVisible(false), 500);
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .popup-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.022;
          pointer-events: none;
          z-index: 0;
        }

        .popup-cta-primary {
          background: linear-gradient(135deg,#1e3a8a,#1d4ed8);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .popup-cta-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(29,78,216,0.32); }

        .popup-close {
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .popup-close:hover { background: rgba(29,78,216,0.07); transform: rotate(90deg); }
      `}</style>

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 pointer-events-none overflow-y-auto"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        <div
          className="popup-grain relative bg-white w-full max-w-4xl pointer-events-auto rounded-3xl overflow-hidden flex flex-col my-auto"
          style={{
            maxHeight: "92vh",
            boxShadow:
              "0 32px 80px rgba(15,23,42,0.22), 0 2px 8px rgba(29,78,216,0.06)",
            border: "1px solid rgba(29,78,216,0.10)",
            opacity: animIn ? 1 : 0,
            transform: animIn
              ? "translateY(0) scale(1)"
              : "translateY(24px) scale(0.97)",
            transition:
              "opacity 0.38s cubic-bezier(.23,1,.32,1), transform 0.38s cubic-bezier(.23,1,.32,1)",
          }}
        >
          {/* Top accent */}
          <div
            className="h-1 shrink-0"
            style={{
              background: "linear-gradient(90deg,#1e3a8a,#1d4ed8,#3b82f6)",
            }}
          />

          {/* ── Header ── */}
          <div
            className="relative z-10 flex items-start justify-between px-6 sm:px-8 pt-6 sm:pt-8 pb-5 shrink-0"
            style={{ borderBottom: "1px solid rgba(29,78,216,0.07)" }}
          >
            <div className="flex-1 pr-6">
              <h2
                style={{
                  fontSize: "clamp(22px,3.5vw,36px)",
                  fontWeight: 300,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  color: "#0f172a",
                  marginBottom: 8,
                }}
              >
                Ready to{" "}
                <span
                  style={{
                    fontWeight: 600,
                    color: "#1d4ed8",
                    fontStyle: "italic",
                  }}
                >
                  transform
                </span>{" "}
                your career?
              </h2>
            </div>

            <button
              onClick={close}
              className="popup-close w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "rgba(29,78,216,0.05)",
                border: "1px solid rgba(29,78,216,0.10)",
              }}
            >
              <X style={{ width: 16, height: 16, color: "#475569" }} />
            </button>
          </div>

          {/* ── Embedded video ── */}
          <div className="relative z-10 flex-1 overflow-y-auto px-6 sm:px-8 py-6">
            <div
              className="rounded-2xl overflow-hidden border"
              style={{
                borderColor: "rgba(29,78,216,0.14)",
                boxShadow: "0 6px 24px rgba(29,78,216,0.10)",
              }}
            >
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/jNQXAC9IVRw"
                  title="YourInterviewCoach Intro"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div
            className="relative z-10 shrink-0 px-6 sm:px-8 py-5"
            style={{
              borderTop: "1px solid rgba(29,78,216,0.07)",
              background: "rgba(248,246,241,0.6)",
            }}
          >
            <div className="flex items-center justify-center">
              <Link
                href="/services"
                onClick={(e) => e.stopPropagation()}
                className="popup-cta-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
                style={{ textDecoration: "none" }}
              >
                Book Your Session
                <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
