"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/**
 * Shared section header used across the homepage.
 * Pattern:
 *   ─── 0N · LABEL ───
 *   Heading with an <accentHeading> that gets a gradient underline on scroll
 *   Supporting subtitle
 *   (optional) Stats pill row
 *
 * Default accent matches the Group Discussion section (cyan #0891b2) so the
 * whole homepage stays visually consistent.
 */

export interface SectionHeaderStat {
  val: string;
  label: string;
}

interface Props {
  step: string;
  label: string;
  heading: string;
  accentHeading: string;
  subtitle?: string;
  accent?: string;
  accentDeep?: string;
  stats?: SectionHeaderStat[];
}

export default function SectionHeader({
  step,
  label,
  heading,
  accentHeading,
  subtitle,
  accent = "#0891b2",
  accentDeep = "#0e7490",
  stats,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sh-wrap"
      style={{
        textAlign: "center",
        maxWidth: 760,
        margin: "0 auto clamp(2.5rem, 5vw, 4.5rem)",
        position: "relative",
        fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Decorative rule + badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 12,
        marginBottom: 18, flexWrap: "nowrap",
      }}>
        <span style={{
          width: "clamp(24px, 5vw, 40px)", height: 1,
          background: `linear-gradient(90deg, transparent, ${accent})`,
        }} />
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "6px 14px", borderRadius: 99,
          background: `${accent}14`,
          border: `1px solid ${accent}33`,
        }}>
          <Sparkles size={11} style={{ color: accent }} />
          <span style={{
            fontSize: 11, fontWeight: 700, color: accent,
            letterSpacing: "0.12em", textTransform: "uppercase",
          }}>
            {step} · {label}
          </span>
        </div>
        <span style={{
          width: "clamp(24px, 5vw, 40px)", height: 1,
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }} />
      </div>

      {/* Big headline */}
      <h2 className="sh-h2" style={{
        margin: "0 0 14px",
        fontSize: "clamp(32px, 5.2vw, 64px)",
        lineHeight: 1.05, letterSpacing: "-0.035em",
        fontWeight: 700, color: "#0f172a",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        {heading}{" "}
        <span style={{ position: "relative", display: "inline-block", color: accent }}>
          {accentHeading}
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              left: 0, right: 0, bottom: "-3px",
              height: 3, borderRadius: 2,
              background: `linear-gradient(90deg, ${accent}, ${accentDeep})`,
              transformOrigin: "left",
              display: "block",
            }}
          />
        </span>
      </h2>

      {subtitle && (
        <p className="sh-sub" style={{
          fontSize: "clamp(14px, 1.35vw, 17px)",
          color: "#64748b", lineHeight: 1.65,
          maxWidth: 600, margin: "0 auto",
          fontWeight: 400,
        }}>
          {subtitle}
        </p>
      )}

      {stats && stats.length > 0 && (
        <div className="sh-stats" style={{
          display: "inline-flex", alignItems: "center",
          gap: "clamp(14px, 3vw, 44px)",
          flexWrap: "wrap", justifyContent: "center",
          marginTop: 22,
          padding: "14px 22px", borderRadius: 99,
          background: "#fff",
          border: `1px solid ${accent}22`,
          boxShadow: `0 8px 30px ${accent}14`,
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
              <span style={{
                fontSize: "clamp(15px, 1.6vw, 20px)", fontWeight: 800, color: accent,
                letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums",
              }}>
                {s.val}
              </span>
              <span style={{
                fontSize: 10.5, fontWeight: 600, color: "#64748b",
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .sh-stats {
            border-radius: 20px !important;
            padding: 14px 16px !important;
            gap: 14px 22px !important;
          }
        }
        @media (max-width: 440px) {
          .sh-stats { padding: 12px 14px !important; gap: 10px 18px !important; }
          .sh-stats > div { gap: 5px !important; }
        }
      `}</style>
    </motion.div>
  );
}
