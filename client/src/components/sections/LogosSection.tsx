"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const companies = [
  {
    name: "Wipro",
    logo: "https://e7.pngegg.com/pngimages/157/702/png-clipart-wipro-logo-business-corporate-identity-business-text-service.png",
  },
  {
    name: "Tech Mahindra",
    logo: "https://i.pinimg.com/736x/05/4d/ce/054dcec1ace21a43d5b5f8d608576ba0.jpg",
  },
  {
    name: "Hcl",
    logo: "https://e7.pngegg.com/pngimages/685/961/png-clipart-logo-brand-trademark-product-design-hcl-technologies-design-blue-text.png",
  },
  {
    name: "Accenture",
    logo: "https://e7.pngegg.com/pngimages/916/300/png-clipart-accenture-new-logo-icons-logos-emojis-iconic-brands-thumbnail.png",
  },
  {
    name: "Apple",
    logo: "https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png",
  },
  {
    name: "Infosys",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/500px-Infosys_logo.svg.png",
  },
  {
    name: "Servicenow",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSmQV0IWOvYZIMUVDOWIyS4HwGEf4lhCYyuA&s",
  },
  {
    name: "Cognizant",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cognizant_logo_2022.svg/3840px-Cognizant_logo_2022.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail",
  },
  {
    name: "TCS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Tata_Consultancy_Services_old_logo.svg/1280px-Tata_Consultancy_Services_old_logo.svg.png",
  },
  {
    name: "LinkedIn",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
  },
  {
    name: "Samsung",
    logo: "https://www.shutterstock.com/image-vector/samsung-company-logo-south-korean-260nw-2394493913.jpg",
  },
  {
    name: "Adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png",
  },
  {
    name: "Ltimindtree",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/LTIMindtree_Logo.svg/960px-LTIMindtree_Logo.svg.png",
  },
  {
    name: "IBM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  },
  {
    name: "Sprinklr",
    logo: "https://www.vhv.rs/dpng/d/407-4073972_new-logo-sprinkler-social-media-hd-png-download.png",
  },
  {
    name: "Makemytrip",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/Makemytrip_logo.svg",
  },
  {
    name: "Goldman Sachs",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg",
  },
];

/* split into two rows */
const row1 = companies.slice(0, Math.ceil(companies.length / 2));
const row2 = companies.slice(Math.ceil(companies.length / 2));

function LogoStrip({
  items,
  reverse = false,
  duration = 55,
}: {
  items: typeof companies;
  reverse?: boolean;
  duration?: number;
}) {
  const [paused, setPaused] = useState(false);
  const cloned = [...items, ...items, ...items];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          animation: `logos-${reverse ? "rev" : "fwd"} ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        {cloned.map((co, i) => (
          <LogoItem key={`${co.name}-${i}`} co={co} />
        ))}
      </div>
    </div>
  );
}

function LogoItem({ co }: { co: (typeof companies)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex-shrink-0 px-6 sm:px-10 py-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 18px",
          borderRadius: 12,
          background: hovered ? "rgba(255,255,255,0.95)" : "transparent",
          border: hovered
            ? "1px solid rgba(29,78,216,0.12)"
            : "1px solid transparent",
          boxShadow: hovered ? "0 4px 18px rgba(29,78,216,0.08)" : "none",
          transition: "all 0.3s cubic-bezier(.23,1,.32,1)",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
        }}
      >
        <img
          src={co.logo}
          alt={co.name}
          style={{
            height: "clamp(20px, 2.2vw, 28px)",
            width: "auto",
            maxWidth: 110,
            objectFit: "contain",
            opacity: hovered ? 0.85 : 0.32,
            filter: hovered ? "grayscale(0%)" : "grayscale(100%)",
            transition: "opacity 0.35s ease, filter 0.35s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function LogosSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .logos-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes logos-fwd {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes logos-rev {
          from { transform: translateX(-33.333%); }
          to   { transform: translateX(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          [style*="logos-fwd"], [style*="logos-rev"] { animation: none !important; }
        }
      `}</style>

      <section
        className="logos-grain relative py-6 lg:py-8 overflow-hidden"
        style={{
          background: "#f8f6f1",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          borderTop: "1px solid rgba(29,78,216,0.07)",
          borderBottom: "1px solid rgba(29,78,216,0.07)",
        }}
      >
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(29,78,216,0.05) 0%,transparent 70%)",
              filter: "blur(80px)",
              transform: "translate(-50%,-50%)",
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              textAlign: "center",
              maxWidth: 600,
              margin: "0 auto clamp(2rem, 4vw, 3.5rem)",
              padding: "0 16px",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <span style={{ width: "clamp(20px, 4vw, 32px)", height: 1, background: "linear-gradient(90deg, transparent, #2563eb)" }} />
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 12px", borderRadius: 99, background: "#2563eb14", border: "1px solid #2563eb33" }}>
                <Sparkles size={10} style={{ color: "#2563eb" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "#2563eb", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  03 · From Potential To Placement
                </span>
              </div>
              <span style={{ width: "clamp(20px, 4vw, 32px)", height: 1, background: "linear-gradient(90deg, #2563eb, transparent)" }} />
            </div>

            <h2 style={{
              margin: "0 0 10px",
              fontSize: "clamp(22px, 3vw, 36px)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              fontWeight: 700,
              color: "#0f172a",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>
              Our mentees work at the{" "}
              <span style={{ position: "relative", display: "inline-block", color: "#2563eb" }}>
                world&apos;s best.
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: "absolute", left: 0, right: 0, bottom: "-2px", height: 2.5, borderRadius: 2, background: "linear-gradient(90deg, #2563eb, #1d4ed8)", transformOrigin: "left", display: "block" }}
                />
              </span>
            </h2>

            <p style={{
              fontSize: "clamp(12px, 1.2vw, 14px)",
              color: "#64748b",
              lineHeight: 1.65,
              maxWidth: 420,
              margin: "0 auto",
              fontWeight: 400,
            }}>
              From FAANG to fintech — graduates of Neel&apos;s coaching land roles everywhere.
            </p>
          </motion.div>

          {/* Row 1 */}
          <div className="relative mb-3 mx-4 sm:mx-8 lg:mx-20">
            {/* edge fades */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 10,
                pointerEvents: "none",
                width: "clamp(40px,7vw,100px)",
                background:
                  "linear-gradient(90deg,#f8f6f1 0%,transparent 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 10,
                pointerEvents: "none",
                width: "clamp(40px,7vw,100px)",
                background:
                  "linear-gradient(270deg,#f8f6f1 0%,transparent 100%)",
              }}
            />
            <LogoStrip items={row1} reverse={false} duration={52} />
          </div>

          {/* Row 2 */}
          <div className="relative mx-4 sm:mx-8 lg:mx-20">
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 10,
                pointerEvents: "none",
                width: "clamp(40px,7vw,100px)",
                background:
                  "linear-gradient(90deg,#f8f6f1 0%,transparent 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 10,
                pointerEvents: "none",
                width: "clamp(40px,7vw,100px)",
                background:
                  "linear-gradient(270deg,#f8f6f1 0%,transparent 100%)",
              }}
            />
            <LogoStrip items={row2} reverse={true} duration={44} />
          </div>
        </div>
      </section>
    </>
  );
}
