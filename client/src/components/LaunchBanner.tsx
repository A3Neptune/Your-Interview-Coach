'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Sparkles, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface LaunchBannerProps {
  onVisibilityChange?: (isVisible: boolean) => void;
  onHeightChange?: (h: number) => void;
}

interface BannerData {
  isActive: boolean;
  message: string;
  originalPrice: number;
  discountedPrice: number;
  ctaText: string;
  ctaLink: string;
  countdownHours: number;
  countdownEndsAt?: string | null;
  showCountdown: boolean;
  badgeText: string;
  savePercentage: number;
}

const DISMISSED_KEY = 'yic_banner_dismissed_v2';

export default function LaunchBanner({ onVisibilityChange, onHeightChange }: LaunchBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const bannerRef = useRef<HTMLDivElement>(null);

  /* ── fetch ── */
  const fetchBannerData = useCallback(async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${base}/launch-banner/active`, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setBannerData(json.data);
        const active = json.data.isActive;
        const dismissed = (() => { try { return localStorage.getItem(DISMISSED_KEY) === '1'; } catch { return false; } })();
        const show = active && !dismissed;
        setIsVisible(show);
        if (!show) onVisibilityChange?.(false);
      }
    } catch {
      /* non-critical — fail silently */
    }
  }, [onVisibilityChange]);

  useEffect(() => {
    fetchBannerData();
    const t = setInterval(fetchBannerData, 30_000);
    return () => clearInterval(t);
  }, [fetchBannerData]);

  /* ── countdown ── */
  useEffect(() => {
    if (!bannerData?.showCountdown || !bannerData.countdownEndsAt) return;
    const endMs = new Date(bannerData.countdownEndsAt).getTime();
    const tick = () => {
      const diff = endMs - Date.now();
      if (diff > 0) {
        setTimeLeft({ h: Math.floor(diff / 3_600_000), m: Math.floor((diff % 3_600_000) / 60_000), s: Math.floor((diff % 60_000) / 1000) });
      } else {
        // Timer expired — hide the banner
        setTimeLeft({ h: 0, m: 0, s: 0 });
        setIsVisible(false);
        onVisibilityChange?.(false);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [bannerData, onVisibilityChange]);

  /* ── report height via ResizeObserver ── */
  useEffect(() => {
    const el = bannerRef.current;
    if (!el) { onHeightChange?.(0); return; }
    const ro = new ResizeObserver(() => onHeightChange?.(isVisible ? el.offsetHeight : 0));
    ro.observe(el);
    onHeightChange?.(isVisible ? el.offsetHeight : 0);
    return () => ro.disconnect();
  }, [isVisible, bannerData, onHeightChange]);

  /* ── dismiss ── */
  function dismiss() {
    try { localStorage.setItem(DISMISSED_KEY, '1'); } catch { /* ignore */ }
    setIsVisible(false);
    onVisibilityChange?.(false);
  }

  if (!isVisible || !bannerData?.isActive) return null;

  const pad = (n: number) => String(n).padStart(2, '0');
  const showPrice = bannerData.discountedPrice > 0 || bannerData.savePercentage > 0;
  const origFmt = `₹${bannerData.originalPrice.toLocaleString('en-IN')}`;
  const discFmt = `₹${bannerData.discountedPrice.toLocaleString('en-IN')}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes lb-sweep {
          0%   { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateX(220%) skewX(-15deg); opacity: 0; }
        }

        #launch-banner {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 200;
          overflow: hidden;
          background: linear-gradient(100deg, #0f1f5c 0%, #1d4ed8 55%, #2563eb 100%);
          border-bottom: 1px solid rgba(255,255,255,0.10);
          box-shadow: 0 2px 20px rgba(29,78,216,0.35);
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* shimmer */
        #lb-shim {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.09) 50%, transparent 65%);
          animation: lb-sweep 5s ease-in-out infinite;
          pointer-events: none;
        }

        /* inner row */
        #lb-row {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 44px 0 16px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        /* badge */
        .lb-badge {
          display: inline-flex; align-items: center; gap: 4px;
          background: rgba(255,255,255,0.13);
          border: 1px solid rgba(255,255,255,0.20);
          border-radius: 99px;
          padding: 2px 8px;
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.10em; text-transform: uppercase;
          color: #fff; white-space: nowrap; flex-shrink: 0;
        }

        /* dot divider */
        .lb-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(255,255,255,0.30);
          flex-shrink: 0;
        }

        /* message text */
        .lb-msg {
          font-size: 12.5px; font-weight: 500;
          color: rgba(255,255,255,0.88);
          white-space: nowrap;
        }

        /* price cluster */
        .lb-price {
          display: inline-flex; align-items: baseline; gap: 4px;
          flex-shrink: 0;
        }
        .lb-price-label {
          font-size: 10.5px; font-weight: 600;
          color: rgba(255,255,255,0.65);
          white-space: nowrap;
          align-self: center;
        }
        .lb-price-orig {
          font-size: 11px; font-weight: 500;
          color: rgba(255,255,255,0.35);
          text-decoration: line-through;
        }
        .lb-price-disc {
          font-size: 14px; font-weight: 800;
          color: #fff; letter-spacing: -0.02em;
        }
        .lb-pct-off {
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          background: rgba(255,255,255,0.16);
          border: 1px solid rgba(255,255,255,0.24);
          border-radius: 4px; padding: 1px 5px;
          color: #fff; white-space: nowrap;
          align-self: center;
        }

        /* countdown */
        .lb-timer {
          display: inline-flex; align-items: center; gap: 4px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 5px; padding: 2px 7px;
          font-size: 10.5px; font-weight: 600;
          color: rgba(255,255,255,0.88);
          letter-spacing: 0.04em;
          font-variant-numeric: tabular-nums;
          flex-shrink: 0;
        }

        /* CTA button */
        .lb-cta {
          display: inline-flex; align-items: center; gap: 4px;
          background: #fff;
          border-radius: 7px; padding: 5px 12px;
          font-size: 12px; font-weight: 700;
          color: #1d4ed8;
          text-decoration: none; white-space: nowrap; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
          border: none;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .lb-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.22);
        }

        /* dismiss button */
        #lb-dismiss {
          position: absolute; top: 50%; right: 10px;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 5px; padding: 4px;
          cursor: pointer; color: rgba(255,255,255,0.65);
          display: flex; align-items: center; justify-content: center;
          line-height: 0;
          transition: background 0.15s, color 0.15s;
        }
        #lb-dismiss:hover {
          background: rgba(255,255,255,0.20);
          color: #fff;
        }

        /* ── RESPONSIVE ── */

        /* Tablet: hide full message, show short version */
        @media (max-width: 768px) {
          .lb-msg       { display: none; }
          .lb-msg-sm    { display: inline !important; }
          .lb-dot       { display: none; }
          #lb-row       { gap: 8px; padding-right: 40px; }
        }

        /* Mobile: stack compactly */
        @media (max-width: 480px) {
          #lb-row        { height: auto; min-height: 40px; padding: 6px 40px 6px 12px; flex-wrap: wrap; justify-content: center; gap: 5px 8px; }
          .lb-badge      { font-size: 9px; padding: 2px 7px; }
          .lb-price-disc { font-size: 13px; }
          .lb-price-orig { font-size: 10px; }
          .lb-price-label { font-size: 9.5px; }
          .lb-pct-off    { font-size: 8px; }
          .lb-cta        { font-size: 11px; padding: 4px 10px; }
          .lb-timer      { font-size: 9.5px; padding: 2px 6px; }
        }
      `}</style>

      <div id="launch-banner" ref={bannerRef}>
        <div id="lb-shim" aria-hidden="true" />

        <div id="lb-row">
          {/* Badge */}
          <span className="lb-badge">
            <Sparkles style={{ width: 9, height: 9, flexShrink: 0 }} />
            {bannerData.badgeText}
          </span>

          {/* Dot */}
          <span className="lb-dot" aria-hidden="true" />

          {/* Full message — hidden on mobile */}
          <span className="lb-msg">{bannerData.message}</span>

          {/* Short message — mobile only (display:none by default, shown via media query) */}
          <span className="lb-msg-sm lb-msg" style={{ display: 'none' }}>
            Launch offer — limited seats
          </span>

          {/* Price — hidden when either price is 0 */}
          {showPrice && (
            <>
              <span className="lb-dot" aria-hidden="true" />
              <span className="lb-price">
                <span className="lb-price-label">Upto</span>
                {bannerData.discountedPrice > 0 ? (
                  <>
                    {bannerData.originalPrice > 0 && (
                      <span className="lb-price-orig">{origFmt}</span>
                    )}
                    <span className="lb-price-disc">{discFmt}</span>
                    {bannerData.savePercentage > 0 && (
                      <span className="lb-pct-off">{bannerData.savePercentage}% off</span>
                    )}
                  </>
                ) : (
                  <span className="lb-price-disc">{bannerData.savePercentage}% off</span>
                )}
              </span>
            </>
          )}

          {/* Countdown (optional) */}
          {bannerData.showCountdown && (
            <span className="lb-timer">
              <Clock style={{ width: 10, height: 10, flexShrink: 0 }} />
              {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
            </span>
          )}

          {/* CTA */}
          <Link href={bannerData.ctaLink} className="lb-cta">
            {bannerData.ctaText}
            <ArrowRight style={{ width: 11, height: 11 }} />
          </Link>
        </div>

        {/* Dismiss */}
        <button id="lb-dismiss" onClick={dismiss} aria-label="Dismiss banner">
          <X style={{ width: 13, height: 13 }} />
        </button>
      </div>
    </>
  );
}
