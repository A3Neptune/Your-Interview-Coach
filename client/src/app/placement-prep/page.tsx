// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import {
//   FileText, Users, Mic2, Video,
//   CheckCircle2, ArrowRight, Clock, Zap,
//   ChevronDown, Star, TrendingUp, Award, Sparkles, Check,
//   ShieldCheck, BadgeCheck,
// } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import StandardFooter from "@/components/StandardFooter";

// /* ─────────────────────────────────────────────────────────────
//    DESIGN TOKENS — consistent with site-wide theme
// ───────────────────────────────────────────────────────────── */
// const T = {
//   blue:   "#2563eb",
//   blueDk: "#1d4ed8",
//   ink:    "#0f172a",
//   soft:   "#334155",
//   muted:  "#64748b",
//   rule:   "rgba(37,99,235,0.10)",
//   green:  "#059669",
//   amber:  "#b45309",
//   purple: "#7c3aed",
// };

// /* ─────────────────────────────────────────────────────────────
//    MODULE DATA
// ───────────────────────────────────────────────────────────── */
// const MODULES = [
//   {
//     num: "01",
//     duration: "60 mins",
//     Icon: FileText,
//     accent: T.green,
//     accentLight: "rgba(5,150,105,0.09)",
//     accentXLight: "rgba(5,150,105,0.04)",
//     label: "Resume Analysis & Positioning",
//     objective: "Turn a basic resume into an interview-winning document",
//     topics: [
//       "Live resume audit — structure, keywords, impact",
//       "Identifying gaps & weak areas at a glance",
//       "Converting responsibilities → achievements",
//       "Aligning resume with target roles precisely",
//     ],
//     outcomes: [
//       "Refined, recruiter-ready resume",
//       "Clear positioning of your profile",
//     ],
//     tag: "Foundation",
//   },
//   {
//     num: "02",
//     duration: "60 mins",
//     Icon: Users,
//     accent: T.amber,
//     accentLight: "rgba(180,83,9,0.09)",
//     accentXLight: "rgba(180,83,9,0.04)",
//     label: "Group Discussion Mastery",
//     objective: "Stand out in GDs without over-speaking",
//     topics: [
//       "Types of GDs — abstract, case-based, current affairs",
//       "How to start, enter & conclude effectively",
//       "Structuring thoughts quickly under pressure",
//       "Common mistakes that eliminate candidates",
//     ],
//     outcomes: [
//       "Structured thinking under pressure",
//       "Confident participation strategy",
//     ],
//     activity: "Live mini GD simulation + real-time feedback",
//     tag: "Group Skill",
//   },
//   {
//     num: "03",
//     duration: "120 mins",
//     Icon: Mic2,
//     accent: T.blue,
//     accentLight: "rgba(37,99,235,0.09)",
//     accentXLight: "rgba(37,99,235,0.04)",
//     label: "Interview Preparation – Core",
//     objective: "Build strong, structured, and confident responses",
//     parts: [
//       {
//         label: "Part A — Introduction Mastery",
//         items: [
//           'Crafting a powerful "Tell Me About Yourself"',
//           "Personal branding in 60–90 seconds",
//         ],
//       },
//       {
//         label: "Part B — Common Questions",
//         items: [
//           "STAR-method answers for behavioural questions",
//           "Handling strengths, weaknesses & salary questions",
//         ],
//       },
//       {
//         label: "Part C — Live Practice",
//         items: ["Real-time correction & improvement sessions"],
//       },
//     ],
//     outcomes: [
//       "Finalized, polished introduction",
//       "Ready answers for most-asked questions",
//       "Improved articulation & confidence",
//     ],
//     tag: "Core Module",
//     featured: true,
//   },
//   {
//     num: "04",
//     duration: "60 mins",
//     Icon: Video,
//     accent: T.purple,
//     accentLight: "rgba(124,58,237,0.09)",
//     accentXLight: "rgba(124,58,237,0.04)",
//     label: "Mock Interview + Feedback",
//     objective: "Simulate real interview pressure and get actionable clarity",
//     topics: [
//       "Short mock interview rounds — as real as it gets",
//       "Personalised feedback on communication",
//       "Assessment of confidence & content quality",
//       "Key improvement pointers & next steps",
//     ],
//     outcomes: [
//       "Real interview experience under pressure",
//       "Clear action plan for improvement",
//     ],
//     tag: "Capstone",
//   },
// ] as const;

// const DELIVERABLES = [
//   { icon: "📄", label: "Resume improvement suggestions", sub: "Documented & actionable" },
//   { icon: "🎤", label: "Finalized interview introduction", sub: "Polished & personalised" },
//   { icon: "💬", label: "GD performance feedback", sub: "Scored & detailed" },
//   { icon: "🗺️", label: "Personalised improvement roadmap", sub: "Your next 30 days planned" },
// ] as const;

// /* ─────────────────────────────────────────────────────────────
//    SCROLL REVEAL HOOK
// ───────────────────────────────────────────────────────────── */
// function useReveal(threshold = 0.12) {
//   const ref = useRef<HTMLDivElement>(null);
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const obs = new IntersectionObserver(
//       ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
//       { threshold }
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, [threshold]);
//   return { ref, visible };
// }

// /* ─────────────────────────────────────────────────────────────
//    REVEAL WRAPPER
// ───────────────────────────────────────────────────────────── */
// function Reveal({
//   children, delay = 0, className = "", style = {},
// }: {
//   children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties;
// }) {
//   const { ref, visible } = useReveal();
//   return (
//     <div
//       ref={ref}
//       className={className}
//       style={{
//         opacity: visible ? 1 : 0,
//         transform: visible ? "none" : "translateY(28px)",
//         transition: `opacity 0.65s ${delay}s cubic-bezier(0.22,1,0.36,1), transform 0.65s ${delay}s cubic-bezier(0.22,1,0.36,1)`,
//         ...style,
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    MODULE CARD
// ───────────────────────────────────────────────────────────── */
// function ModuleCard({ mod, index }: { mod: typeof MODULES[number]; index: number }) {
//   const { ref, visible } = useReveal(0.08);
//   const isEven = index % 2 === 0;

//   return (
//     <div
//       ref={ref}
//       style={{
//         opacity: visible ? 1 : 0,
//         transform: visible ? "none" : `translateX(${isEven ? -32 : 32}px)`,
//         transition: `opacity 0.7s ${index * 0.1}s cubic-bezier(0.22,1,0.36,1), transform 0.7s ${index * 0.1}s cubic-bezier(0.22,1,0.36,1)`,
//       }}
//     >
//       <div
//         style={{
//           position: "relative",
//           borderRadius: 22,
//           border: `1px solid ${mod.accent}22`,
//           background: "#fff",
//           overflow: "hidden",
//           boxShadow: `0 12px 48px -8px ${mod.accent}14, 0 2px 8px rgba(15,23,42,0.04)`,
//         }}
//       >
//         <div style={{ height: 4, background: mod.accent, width: "100%" }} />
//         <div style={{ padding: "28px 30px 30px" }}>
//           <div style={{
//             display: "flex", alignItems: "flex-start",
//             justifyContent: "space-between", gap: 12, marginBottom: 22,
//           }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//               <div style={{
//                 width: 52, height: 52, borderRadius: 14,
//                 background: mod.accentLight,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 flexShrink: 0,
//                 border: `1.5px solid ${mod.accent}22`,
//               }}>
//                 <mod.Icon size={24} style={{ color: mod.accent }} />
//               </div>
//               <div>
//                 <div style={{
//                   fontSize: 11, fontWeight: 700, letterSpacing: "0.09em",
//                   textTransform: "uppercase", color: mod.accent, marginBottom: 4,
//                 }}>
//                   Module {mod.num} · {mod.tag}
//                 </div>
//                 <h3 style={{
//                   fontSize: "clamp(17px,1.8vw,21px)", fontWeight: 800,
//                   color: T.ink, letterSpacing: "-0.025em", lineHeight: 1.2,
//                 }}>
//                   {mod.label}
//                 </h3>
//               </div>
//             </div>
//             <div style={{
//               display: "flex", alignItems: "center", gap: 5,
//               background: mod.accentXLight,
//               border: `1px solid ${mod.accent}22`,
//               borderRadius: 99, padding: "5px 12px", flexShrink: 0,
//             }}>
//               <Clock size={11} style={{ color: mod.accent }} />
//               <span style={{ fontSize: 11, fontWeight: 700, color: mod.accent, letterSpacing: "0.05em" }}>
//                 {mod.duration}
//               </span>
//             </div>
//           </div>

//           <p style={{
//             fontSize: 13.5, color: T.muted, lineHeight: 1.65, marginBottom: 22,
//             paddingLeft: 14, borderLeft: `2px solid ${mod.accent}40`,
//           }}>
//             <strong style={{ color: T.soft, fontWeight: 600 }}>Objective:</strong>{" "}
//             {mod.objective}
//           </p>

//           {"parts" in mod ? (
//             <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 22 }}>
//               {mod.parts.map((part) => (
//                 <div key={part.label}>
//                   <p style={{
//                     fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
//                     textTransform: "uppercase", color: mod.accent, marginBottom: 8,
//                   }}>
//                     {part.label}
//                   </p>
//                   <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//                     {part.items.map((item) => (
//                       <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
//                         <div style={{
//                           width: 6, height: 6, borderRadius: "50%",
//                           background: mod.accent, flexShrink: 0, marginTop: 6,
//                         }} />
//                         <span style={{ fontSize: 13, color: T.soft, lineHeight: 1.55 }}>{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 22 }}>
//               {mod.topics.map((t) => (
//                 <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
//                   <div style={{
//                     width: 6, height: 6, borderRadius: "50%",
//                     background: mod.accent, flexShrink: 0, marginTop: 6,
//                   }} />
//                   <span style={{ fontSize: 13, color: T.soft, lineHeight: 1.55 }}>{t}</span>
//                 </div>
//               ))}
//             </div>
//           )}

//           {"activity" in mod && (
//             <div style={{
//               display: "flex", alignItems: "center", gap: 8,
//               background: mod.accentLight, border: `1px solid ${mod.accent}22`,
//               borderRadius: 10, padding: "9px 14px", marginBottom: 20,
//             }}>
//               <Zap size={13} style={{ color: mod.accent, flexShrink: 0 }} />
//               <span style={{ fontSize: 12, fontWeight: 600, color: mod.accent }}>
//                 Activity: {mod.activity}
//               </span>
//             </div>
//           )}

//           <div style={{ paddingTop: 18, borderTop: `1px solid ${T.rule}` }}>
//             <p style={{
//               fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em",
//               textTransform: "uppercase", color: "#94a3b8", marginBottom: 10,
//             }}>
//               What you walk away with
//             </p>
//             <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//               {mod.outcomes.map((o) => (
//                 <div key={o} style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                   <CheckCircle2 size={14} style={{ color: mod.accent, flexShrink: 0 }} />
//                   <span style={{ fontSize: 13, fontWeight: 600, color: T.soft }}>{o}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────────────────
//    PAGE
// ───────────────────────────────────────────────────────────── */
// export default function PlacementAccelerator() {
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
//         * { box-sizing: border-box; }
//         .pa-root { font-family: 'DM Sans', system-ui, sans-serif; background: #fff; color: #0f172a; -webkit-font-smoothing: antialiased; }
//         .pa-wrap { width: 100%; max-width: 1160px; margin: 0 auto; padding: 0 clamp(20px,4vw,56px); }

//         .pa-modules-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
//         @media (max-width: 820px) { .pa-modules-grid { grid-template-columns: 1fr; } }

//         .pa-deliv-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
//         @media (max-width: 900px) { .pa-deliv-grid { grid-template-columns: repeat(2, 1fr); } }
//         @media (max-width: 480px) { .pa-deliv-grid { grid-template-columns: 1fr; } }

//         .pa-stat-strip { display: flex; gap: 0; flex-wrap: wrap; }
//         .pa-stat + .pa-stat { border-left: 1px solid rgba(37,99,235,0.12); padding-left: clamp(1.2rem,3vw,2.4rem); }
//         .pa-stat { padding-right: clamp(1.2rem,3vw,2.4rem); }

//         .pa-spine { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, rgba(37,99,235,0.10) 15%, rgba(37,99,235,0.10) 85%, transparent); transform: translateX(-50%); pointer-events: none; }
//         @media (max-width: 820px) { .pa-spine { display: none; } }

//         .pa-blob { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }

//         .pa-cta-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; border-radius: 10px; background: #2563eb; color: #fff; font-size: 15px; font-weight: 700; font-family: 'DM Sans', system-ui, sans-serif; border: none; cursor: pointer; text-decoration: none; transition: filter 0.18s, box-shadow 0.18s, transform 0.14s; }
//         .pa-cta-btn:hover { filter: brightness(1.08); box-shadow: 0 12px 32px rgba(37,99,235,0.28); transform: translateY(-1px); }
//         .pa-cta-btn:active { transform: none; }

//         .pa-ghost-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: #64748b; background: none; border: 1px solid rgba(37,99,235,0.2); border-radius: 10px; cursor: pointer; text-decoration: none; padding: 13px 24px; font-family: 'DM Sans', system-ui, sans-serif; transition: color 0.18s, border-color 0.18s, background 0.18s; }
//         .pa-ghost-btn:hover { color: #2563eb; border-color: rgba(37,99,235,0.4); background: rgba(37,99,235,0.04); }

//         @keyframes heroFadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
//         .pa-hero-anim { animation: heroFadeUp 0.72s cubic-bezier(0.22,1,0.36,1) both; }

//         .pa-grid-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(37,99,235,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(37,99,235,0.04) 1px,transparent 1px); background-size: 64px 64px; }

//         @keyframes tickerMove { from { transform: translateX(0); } to { transform: translateX(-50%); } }
//         .pa-ticker { animation: tickerMove 28s linear infinite; }
//         .pa-ticker:hover { animation-play-state: paused; }
//       `}</style>

//       <div className="pa-root" style={{ minHeight: "100vh" }}>
//         <Navbar />

//         {/* ══════════════════════════════════════
//             HERO
//         ══════════════════════════════════════ */}
//         <section
//           style={{
//             position: "relative", overflow: "hidden",
//             paddingTop: "clamp(100px,12vw,140px)",
//             paddingBottom: "clamp(60px,8vw,100px)",
//             background: "#fff",
//           }}
//         >
//           <div className="pa-grid-bg" />
//           <div className="pa-blob" style={{ width: 600, height: 600, background: "radial-gradient(circle,rgba(37,99,235,0.08) 0%,transparent 65%)", top: -200, right: -140 }} />
//           <div className="pa-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(5,150,105,0.07) 0%,transparent 70%)", bottom: -80, left: -80 }} />

//           <div className="pa-wrap" style={{ position: "relative", zIndex: 2 }}>
//             <div className="pa-hero-anim" style={{ animationDelay: "0s", display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 99, padding: "5px 14px", marginBottom: 24, fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: T.blue }}>
//               <Sparkles size={11} />
//               Placement Accelerator Program
//             </div>

//             <h1 className="pa-hero-anim" style={{ animationDelay: "0.1s", fontSize: "clamp(40px,6.5vw,84px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: 22, maxWidth: 780 }}>
//               <span style={{ display: "block", color: T.ink }}>Your entire</span>
//               <span style={{ display: "block", color: T.blue }}>placement journey.</span>
//               <span style={{ display: "block", color: T.muted, fontWeight: 300 }}>In 5 hours.</span>
//             </h1>

//             <p className="pa-hero-anim" style={{ animationDelay: "0.2s", fontSize: "clamp(15px,1.5vw,18px)", color: T.muted, lineHeight: 1.72, maxWidth: 520, marginBottom: 38 }}>
//               From a blank resume to a polished interview performance — 4 structured modules,
//               live practice, and personalised feedback that gives you a clear edge over every
//               other candidate in the room.
//             </p>

//             <div className="pa-hero-anim" style={{ animationDelay: "0.28s", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 52 }}>
//               <a href="#pricing" className="pa-cta-btn">
//                 View Pricing & Enroll
//                 <ArrowRight size={15} />
//               </a>
//               <a href="#modules" className="pa-ghost-btn">
//                 Explore modules <ChevronDown size={14} />
//               </a>
//             </div>

//             <div className="pa-hero-anim pa-stat-strip" style={{ animationDelay: "0.36s", borderTop: "1px solid rgba(37,99,235,0.10)", paddingTop: "1.4rem" }}>
//               {[
//                 { val: "4", label: "Expert-led Modules" },
//                 { val: "5 hrs", label: "Total Live Duration" },
//                 { val: "1:1", label: "Personalised Feedback" },
//                 { val: "94%", label: "Placement Success" },
//               ].map((s) => (
//                 <div key={s.label} className="pa-stat">
//                   <p style={{ fontSize: "clamp(20px,2.4vw,30px)", fontWeight: 900, color: T.blue, letterSpacing: "-0.035em", lineHeight: 1 }}>{s.val}</p>
//                   <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginTop: 5 }}>{s.label}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ══════════════════════════════════════
//             TICKER
//         ══════════════════════════════════════ */}
//         <div style={{ background: T.blue, padding: "13px 0", overflow: "hidden" }}>
//           <div style={{ display: "flex", whiteSpace: "nowrap" }}>
//             <div className="pa-ticker" style={{ display: "flex", gap: 36, paddingRight: 36 }}>
//               {[
//                 "4 Modules", "✦", "5 Hours of Live Prep", "✦", "Resume + GD + Interview + Mock", "✦",
//                 "94% Success Rate", "✦", "1:1 Feedback", "✦", "Limited Seats",
//                 "4 Modules", "✦", "5 Hours of Live Prep", "✦", "Resume + GD + Interview + Mock", "✦",
//                 "94% Success Rate", "✦", "1:1 Feedback", "✦", "Limited Seats",
//               ].map((t, i) => (
//                 <span key={i} style={{ fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", flexShrink: 0, fontWeight: t === "✦" ? 300 : 700, color: t === "✦" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.88)" }}>
//                   {t}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ══════════════════════════════════════
//             MEET YOUR MENTOR
//         ══════════════════════════════════════ */}
//         <section style={{ background: "#f8f7f4", padding: "clamp(64px,8vw,100px) 0", position: "relative", overflow: "hidden" }}>
//           <div className="pa-blob" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 65%)", top: -120, right: -100 }} />
//           <div className="pa-wrap" style={{ position: "relative", zIndex: 2 }}>
//             <Reveal>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: "-80px" }}
//                 transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//                 style={{ textAlign: "center", maxWidth: 760, margin: "0 auto clamp(2.5rem,5vw,4rem)", fontFamily: "'DM Sans',system-ui,sans-serif" }}
//               >
//                 <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
//                   <span style={{ width: "clamp(24px,5vw,40px)", height: 1, background: "linear-gradient(90deg,transparent,#2563eb)" }} />
//                   <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 99, background: "#2563eb14", border: "1px solid #2563eb33" }}>
//                     <Sparkles size={11} style={{ color: "#2563eb" }} />
//                     <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", letterSpacing: "0.12em", textTransform: "uppercase" }}>Your Mentor</span>
//                   </div>
//                   <span style={{ width: "clamp(24px,5vw,40px)", height: 1, background: "linear-gradient(90deg,#2563eb,transparent)" }} />
//                 </div>
//                 <h2 style={{ margin: "0 0 14px", fontSize: "clamp(30px,4.5vw,56px)", lineHeight: 1.08, letterSpacing: "-0.035em", fontWeight: 700, color: "#0f172a" }}>
//                   Coached by someone who&apos;s{" "}
//                   <span style={{ position: "relative", display: "inline-block", color: "#2563eb" }}>
//                     been inside.
//                     <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ position: "absolute", left: 0, right: 0, bottom: "-3px", height: 3, borderRadius: 2, background: "linear-gradient(90deg,#2563eb,#1d4ed8)", transformOrigin: "left", display: "block" }} />
//                   </span>
//                 </h2>
//                 <p style={{ fontSize: "clamp(14px,1.4vw,16px)", color: "#64748b", lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
//                   Neel Aashish Seru has sat on both sides of the hiring table for 12+ years. He knows exactly what panels write after you leave the room.
//                 </p>
//               </motion.div>
//             </Reveal>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "clamp(2rem,5vw,5rem)", alignItems: "center", maxWidth: 1000, margin: "0 auto" }}
//               className="mentor-grid"
//             >
//               <style>{`@media(max-width:768px){.mentor-grid{grid-template-columns:1fr!important}}`}</style>

//               {/* Photo */}
//               <Reveal delay={0.1}>
//                 <div style={{ display: "flex", justifyContent: "center" }}>
//                   <div style={{ position: "relative", width: "100%", maxWidth: 340 }}>
//                     <div style={{ borderRadius: 28, overflow: "hidden", aspectRatio: "3/4", position: "relative", background: "linear-gradient(135deg,#dbeafe,#bfdbfe)", boxShadow: "0 32px 80px rgba(37,99,235,0.18)" }}>
//                       <Image src="/neel-aashish-seru.jpeg" alt="Neel Aashish Seru — Interview Coach" fill className="object-cover object-top" />
//                       <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: "linear-gradient(to top,rgba(15,23,42,0.3),transparent)" }} />
//                     </div>
//                     {/* Floating credential */}
//                     <div style={{ position: "absolute", bottom: -16, right: -16, background: "#fff", borderRadius: 16, padding: "12px 18px", boxShadow: "0 12px 40px rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.12)", display: "flex", alignItems: "center", gap: 10 }}>
//                       <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(37,99,235,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                         <BadgeCheck size={20} style={{ color: T.blue }} />
//                       </div>
//                       <div>
//                         <p style={{ fontSize: 13, fontWeight: 800, color: T.ink, lineHeight: 1 }}>94% Success</p>
//                         <p style={{ fontSize: 10, color: T.muted, fontWeight: 500, marginTop: 2 }}>Placement Rate</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Reveal>

//               {/* Bio */}
//               <Reveal delay={0.15}>
//                 <div>
//                   <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>
//                     12+ years · Both sides of the table
//                   </p>
//                   <h3 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 800, letterSpacing: "-0.03em", color: T.ink, lineHeight: 1.1, marginBottom: 16 }}>
//                     Neel Aashish Seru
//                   </h3>
//                   <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.78, marginBottom: 28, maxWidth: 440 }}>
//                     Most rejection emails look the same. But the notes inside that panel room are specific — and avoidable. Neel has 12+ years of experience across Tech Mahindra and IndiaMART, working alongside senior decision-makers and sitting on hiring panels. He knows exactly what interviewers note down when they decide to pass.
//                   </p>

//                   <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
//                     {[
//                       { icon: Award, text: "12+ years inside corporate hiring panels" },
//                       { icon: Users, text: "5,000+ candidates personally coached" },
//                       { icon: TrendingUp, text: "Tech Mahindra & IndiaMART — both sides of the table" },
//                       { icon: ShieldCheck, text: "No scripts, no fluff — only real frameworks" },
//                     ].map(({ icon: Icon, text }) => (
//                       <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                         <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                           <Icon size={14} style={{ color: T.blue }} />
//                         </div>
//                         <span style={{ fontSize: 14, color: T.soft, fontWeight: 500 }}>{text}</span>
//                       </div>
//                     ))}
//                   </div>

//                   <Link href="/about" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: T.blue, textDecoration: "none", letterSpacing: "0.01em" }}>
//                     Read the full story <ArrowRight size={13} />
//                   </Link>
//                 </div>
//               </Reveal>
//             </div>
//           </div>
//         </section>

//         {/* ══════════════════════════════════════
//             JOURNEY STRIP
//         ══════════════════════════════════════ */}
//         <section style={{ background: T.ink, padding: "clamp(28px,4vw,42px) 0", overflow: "hidden" }}>
//           <div className="pa-wrap">
//             <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", scrollbarWidth: "none", justifyContent: "center" }}>
//               {[
//                 { n: "01", label: "Resume", color: T.green },
//                 { n: "→", label: "", color: "#4b5563", isArrow: true },
//                 { n: "02", label: "GD", color: T.amber },
//                 { n: "→", label: "", color: "#4b5563", isArrow: true },
//                 { n: "03", label: "Interview Prep", color: T.blue },
//                 { n: "→", label: "", color: "#4b5563", isArrow: true },
//                 { n: "04", label: "Mock", color: T.purple },
//                 { n: "→", label: "", color: "#4b5563", isArrow: true },
//                 { n: "🏆", label: "Offer", color: "#f7c948" },
//               ].map((item, i) => (
//                 "isArrow" in item ? (
//                   <span key={i} style={{ fontSize: 18, color: "#374151", flexShrink: 0, padding: "0 10px" }}>→</span>
//                 ) : (
//                   <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0, padding: "0 clamp(12px,2vw,20px)" }}>
//                     <span style={{ fontSize: item.n === "🏆" ? 22 : 13, fontWeight: 800, color: item.color, letterSpacing: "-0.02em" }}>{item.n}</span>
//                     {item.label && (
//                       <span style={{ fontSize: 10, fontWeight: 600, color: "#6b7280", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
//                         {item.label}
//                       </span>
//                     )}
//                   </div>
//                 )
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ══════════════════════════════════════
//             MODULES
//         ══════════════════════════════════════ */}
//         <section id="modules" style={{ background: "#fff", padding: "clamp(60px,7vw,100px) 0 clamp(40px,5vw,64px)" }}>
//           <div className="pa-wrap">
//             <Reveal>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: "-80px" }}
//                 transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//                 style={{ textAlign: "center", maxWidth: 760, margin: "0 auto clamp(2.5rem,5vw,4rem)" }}
//               >
//                 <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
//                   <span style={{ width: "clamp(24px,5vw,40px)", height: 1, background: "linear-gradient(90deg,transparent,#2563eb)" }} />
//                   <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 99, background: "#2563eb14", border: "1px solid #2563eb33" }}>
//                     <Sparkles size={11} style={{ color: "#2563eb" }} />
//                     <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", letterSpacing: "0.12em", textTransform: "uppercase" }}>The Curriculum</span>
//                   </div>
//                   <span style={{ width: "clamp(24px,5vw,40px)", height: 1, background: "linear-gradient(90deg,#2563eb,transparent)" }} />
//                 </div>
//                 <h2 style={{ margin: "0 0 14px", fontSize: "clamp(30px,4.5vw,56px)", lineHeight: 1.08, letterSpacing: "-0.035em", fontWeight: 700, color: "#0f172a" }}>
//                   4 modules. 1 complete{" "}
//                   <span style={{ position: "relative", display: "inline-block", color: "#2563eb" }}>
//                     transformation.
//                     <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ position: "absolute", left: 0, right: 0, bottom: "-3px", height: 3, borderRadius: 2, background: "linear-gradient(90deg,#2563eb,#1d4ed8)", transformOrigin: "left", display: "block" }} />
//                   </span>
//                 </h2>
//                 <p style={{ fontSize: "clamp(14px,1.4vw,16px)", color: "#64748b", lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
//                   Every session builds on the last — structured so that by the end, you&apos;re interview-ready across every dimension.
//                 </p>
//               </motion.div>
//             </Reveal>

//             <Reveal delay={0.08}>
//               <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 48, paddingTop: 20, borderTop: "1px solid rgba(37,99,235,0.08)" }}>
//                 <Clock size={13} style={{ color: "#94a3b8" }} />
//                 <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>Total programme duration:</span>
//                 <span style={{ fontSize: 12, fontWeight: 800, color: T.ink }}>300 minutes of live, expert-led sessions</span>
//               </div>
//             </Reveal>

//             <div style={{ position: "relative" }}>
//               <div className="pa-spine" />
//               <div className="pa-modules-grid">
//                 {MODULES.map((mod, i) => (
//                   <ModuleCard key={mod.num} mod={mod} index={i} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ══════════════════════════════════════
//             MODULE 3 CALLOUT
//         ══════════════════════════════════════ */}
//         <section style={{ background: T.blue, padding: "clamp(48px,6vw,80px) 0", position: "relative", overflow: "hidden" }}>
//           <div className="pa-blob" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(255,255,255,0.06) 0%,transparent 65%)", top: -180, right: -100 }} />
//           <div className="pa-wrap" style={{ position: "relative", zIndex: 2 }}>
//             <Reveal>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "clamp(2rem,5vw,5rem)", alignItems: "center" }}>
//                 <div>
//                   <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 99, padding: "5px 13px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", marginBottom: 18 }}>
//                     <Star size={10} />
//                     Flagship session — 120 mins
//                   </div>
//                   <h2 style={{ fontSize: "clamp(26px,3.5vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.1, marginBottom: 14 }}>
//                     Module 03 is where most candidates<br />
//                     <span style={{ opacity: 0.7, fontWeight: 300 }}>finally click.</span>
//                   </h2>
//                   <p style={{ fontSize: "clamp(13.5px,1.3vw,15.5px)", color: "rgba(255,255,255,0.72)", lineHeight: 1.7, maxWidth: 500 }}>
//                     Our 2-hour Interview Preparation Core is the deepest session — covering introduction mastery, STAR-method answers, and live practice with real-time correction. Most students say this single module shifts their entire mindset.
//                   </p>
//                 </div>
//                 <div style={{ textAlign: "center", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 18, padding: "32px 36px", backdropFilter: "blur(12px)", minWidth: 180 }}>
//                   <p style={{ fontSize: "clamp(42px,5vw,64px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 8 }}>120</p>
//                   <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase" }}>minutes of live<br />deep-dive prep</p>
//                 </div>
//               </div>
//             </Reveal>
//           </div>
//         </section>

//         {/* ══════════════════════════════════════
//             DELIVERABLES
//         ══════════════════════════════════════ */}
//         <section style={{ background: "#f8f7f4", padding: "clamp(64px,8vw,100px) 0", position: "relative", overflow: "hidden" }}>
//           <div className="pa-wrap" style={{ position: "relative", zIndex: 2 }}>
//             <Reveal>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: "-80px" }}
//                 transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//                 style={{ textAlign: "center", maxWidth: 760, margin: "0 auto clamp(2.5rem,5vw,4rem)" }}
//               >
//                 <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
//                   <span style={{ width: "clamp(24px,5vw,40px)", height: 1, background: "linear-gradient(90deg,transparent,#2563eb)" }} />
//                   <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 99, background: "#2563eb14", border: "1px solid #2563eb33" }}>
//                     <Sparkles size={11} style={{ color: "#2563eb" }} />
//                     <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", letterSpacing: "0.12em", textTransform: "uppercase" }}>Final Deliverables</span>
//                   </div>
//                   <span style={{ width: "clamp(24px,5vw,40px)", height: 1, background: "linear-gradient(90deg,#2563eb,transparent)" }} />
//                 </div>
//                 <h2 style={{ margin: "0 0 14px", fontSize: "clamp(30px,4.5vw,56px)", lineHeight: 1.08, letterSpacing: "-0.035em", fontWeight: 700, color: "#0f172a" }}>
//                   You leave with{" "}
//                   <span style={{ position: "relative", display: "inline-block", color: "#2563eb" }}>
//                     everything.
//                     <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ position: "absolute", left: 0, right: 0, bottom: "-3px", height: 3, borderRadius: 2, background: "linear-gradient(90deg,#2563eb,#1d4ed8)", transformOrigin: "left", display: "block" }} />
//                   </span>
//                 </h2>
//                 <p style={{ fontSize: "clamp(14px,1.4vw,16px)", color: "#64748b", lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
//                   Not just skills — tangible, documented outputs that you can act on immediately after the programme ends.
//                 </p>
//               </motion.div>
//             </Reveal>

//             <div className="pa-deliv-grid">
//               {DELIVERABLES.map((d, i) => (
//                 <Reveal key={d.label} delay={i * 0.08}>
//                   <div
//                     style={{ background: "#fff", border: "1px solid rgba(37,99,235,0.10)", borderRadius: 18, padding: "26px 22px", height: "100%", boxShadow: "0 4px 20px rgba(37,99,235,0.06)", transition: "box-shadow 0.22s, transform 0.22s" }}
//                     onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 36px rgba(37,99,235,0.12)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
//                     onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(37,99,235,0.06)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
//                   >
//                     <span style={{ fontSize: 28, display: "block", marginBottom: 14 }}>{d.icon}</span>
//                     <p style={{ fontSize: 14, fontWeight: 700, color: T.ink, lineHeight: 1.3, marginBottom: 6 }}>{d.label}</p>
//                     <p style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 500 }}>{d.sub}</p>
//                   </div>
//                 </Reveal>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ══════════════════════════════════════
//             PRICING
//         ══════════════════════════════════════ */}
//         <section id="pricing" style={{ background: "#fff", padding: "clamp(64px,8vw,100px) 0" }}>
//           <div className="pa-wrap">
//             <Reveal>
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: "-80px" }}
//                 transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//                 style={{ textAlign: "center", maxWidth: 760, margin: "0 auto clamp(2.5rem,5vw,4rem)" }}
//               >
//                 <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
//                   <span style={{ width: "clamp(24px,5vw,40px)", height: 1, background: "linear-gradient(90deg,transparent,#2563eb)" }} />
//                   <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 99, background: "#2563eb14", border: "1px solid #2563eb33" }}>
//                     <Sparkles size={11} style={{ color: "#2563eb" }} />
//                     <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", letterSpacing: "0.12em", textTransform: "uppercase" }}>Pricing</span>
//                   </div>
//                   <span style={{ width: "clamp(24px,5vw,40px)", height: 1, background: "linear-gradient(90deg,#2563eb,transparent)" }} />
//                 </div>
//                 <h2 style={{ margin: "0 0 14px", fontSize: "clamp(30px,4.5vw,56px)", lineHeight: 1.08, letterSpacing: "-0.035em", fontWeight: 700, color: "#0f172a" }}>
//                   One investment.{" "}
//                   <span style={{ position: "relative", display: "inline-block", color: "#2563eb" }}>
//                     Career-long returns.
//                     <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ position: "absolute", left: 0, right: 0, bottom: "-3px", height: 3, borderRadius: 2, background: "linear-gradient(90deg,#2563eb,#1d4ed8)", transformOrigin: "left", display: "block" }} />
//                   </span>
//                 </h2>
//                 <p style={{ fontSize: "clamp(14px,1.4vw,16px)", color: "#64748b", lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
//                   5 hours of live, expert coaching across 4 modules — everything you need to walk into any interview with full confidence.
//                 </p>
//               </motion.div>
//             </Reveal>

//             <Reveal delay={0.1}>
//               <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="pricing-grid">
//                 <style>{`@media(max-width:640px){.pricing-grid{grid-template-columns:1fr!important}}`}</style>

//                 {/* Main pricing card */}
//                 <div style={{ borderRadius: 24, border: "2px solid rgba(37,99,235,0.25)", background: "#fff", overflow: "hidden", boxShadow: "0 20px 60px rgba(37,99,235,0.12)" }}>
//                   <div style={{ height: 5, background: "linear-gradient(90deg,#2563eb,#1d4ed8)" }} />
//                   <div style={{ padding: "28px 28px 32px" }}>
//                     <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 99, padding: "4px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.blue, marginBottom: 16 }}>
//                       <Zap size={10} />
//                       Most Popular
//                     </div>
//                     <h3 style={{ fontSize: 20, fontWeight: 800, color: T.ink, marginBottom: 6 }}>Placement Accelerator</h3>
//                     <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 20 }}>Complete 4-module programme with personalised 1:1 feedback from Neel.</p>
//                     <div style={{ marginBottom: 6 }}>
//                       <span style={{ fontSize: 42, fontWeight: 900, color: T.blue, letterSpacing: "-0.04em", lineHeight: 1 }}>₹4,999</span>
//                     </div>
//                     <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginBottom: 24 }}>excl. GST · +₹900 (18%)</p>
//                     <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
//                       {["4 live expert-led modules", "5 hours total programme duration", "1:1 personalised feedback", "Resume improvement document", "Interview introduction — finalized", "GD feedback report", "30-day improvement roadmap"].map((f) => (
//                         <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                           <div style={{ width: 18, height: 18, borderRadius: 5, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                             <Check size={10} style={{ color: T.blue }} strokeWidth={3} />
//                           </div>
//                           <span style={{ fontSize: 13, color: T.soft, fontWeight: 500 }}>{f}</span>
//                         </div>
//                       ))}
//                     </div>
//                     <Link href="/select-slot?serviceId=placementAccelerator" className="pa-cta-btn" style={{ width: "100%", justifyContent: "center" }}>
//                       Book My Seat <ArrowRight size={15} />
//                     </Link>
//                   </div>
//                 </div>

//                 {/* Why worth it card */}
//                 <div style={{ borderRadius: 24, border: "1.5px solid rgba(37,99,235,0.12)", background: "#f8f7f4", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
//                   <div style={{ padding: "28px 28px 0" }}>
//                     <h3 style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginBottom: 20, letterSpacing: "-0.015em" }}>Why it&apos;s worth it</h3>
//                     <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
//                       {[
//                         { stat: "94%", label: "of participants receive interview calls within 2 weeks" },
//                         { stat: "5,000+", label: "candidates guided to offers by Neel directly" },
//                         { stat: "★ 4.9", label: "average rating across all sessions" },
//                         { stat: "12+", label: "years of real hiring panel experience" },
//                       ].map(({ stat, label }) => (
//                         <div key={stat} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
//                           <span style={{ fontSize: 22, fontWeight: 900, color: T.blue, letterSpacing: "-0.03em", lineHeight: 1, flexShrink: 0, minWidth: 56 }}>{stat}</span>
//                           <span style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, paddingTop: 3 }}>{label}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   <div style={{ padding: "24px 28px 28px" }}>
//                     <div style={{ borderTop: "1px solid rgba(37,99,235,0.10)", paddingTop: 18 }}>
//                       <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.7, fontStyle: "italic" }}>
//                         &ldquo;The resume module alone got me 4 callbacks in 3 days. Module 3 changed my entire approach to interviews.&rdquo;
//                       </p>
//                       <p style={{ fontSize: 12, fontWeight: 700, color: T.ink, marginTop: 8 }}>— Priya M., Campus → TCS</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Reveal>
//           </div>
//         </section>

//         {/* ══════════════════════════════════════
//             TESTIMONIALS
//         ══════════════════════════════════════ */}
//         <section style={{ background: "#f8f7f4", borderTop: "1px solid rgba(37,99,235,0.08)", borderBottom: "1px solid rgba(37,99,235,0.08)", padding: "clamp(40px,5vw,64px) 0" }}>
//           <div className="pa-wrap">
//             <Reveal>
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 32, alignItems: "center" }}>
//                 {[
//                   { quote: "The resume module alone got me 4 callbacks in 3 days.", name: "Priya M.", role: "Campus → TCS" },
//                   { quote: "GD session was eye-opening. I used to freeze; now I initiate.", name: "Karan D.", role: "Campus → Infosys" },
//                   { quote: "Module 3 changed everything. My answers finally had structure.", name: "Sneha R.", role: "Campus → Wipro" },
//                 ].map((t, i) => (
//                   <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "24px 22px", border: "1px solid rgba(37,99,235,0.10)", boxShadow: "0 4px 20px rgba(37,99,235,0.06)" }}>
//                     <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
//                       {Array.from({ length: 5 }).map((_, si) => (
//                         <Star key={si} size={12} fill={T.amber} style={{ color: T.amber }} />
//                       ))}
//                     </div>
//                     <p style={{ fontSize: 14, color: T.soft, lineHeight: 1.65, fontStyle: "italic", marginBottom: 14 }}>
//                       &ldquo;{t.quote}&rdquo;
//                     </p>
//                     <p style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>{t.name}</p>
//                     <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{t.role}</p>
//                   </div>
//                 ))}
//               </div>
//             </Reveal>
//           </div>
//         </section>

//         {/* ══════════════════════════════════════
//             CTA FOOTER
//         ══════════════════════════════════════ */}
//         <section style={{ background: "#fff", padding: "clamp(72px,9vw,120px) 0", position: "relative", overflow: "hidden" }}>
//           <div className="pa-blob" style={{ width: 560, height: 560, background: "radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 65%)", top: -140, right: -80 }} />
//           <div className="pa-blob" style={{ width: 380, height: 380, background: "radial-gradient(circle,rgba(124,58,237,0.05) 0%,transparent 65%)", bottom: -80, left: -60 }} />
//           <div className="pa-grid-bg" />

//           <div className="pa-wrap" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
//             <Reveal>
//               <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 99, padding: "5px 14px", marginBottom: 24, fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: T.blue }}>
//                 <Award size={11} />
//                 Limited seats per cohort
//               </div>

//               <h2 style={{ fontSize: "clamp(34px,5.5vw,72px)", fontWeight: 900, letterSpacing: "-0.04em", color: T.ink, lineHeight: 1.04, marginBottom: 18 }}>
//                 5 hours now.<br />
//                 <span style={{ color: T.blue }}>A career, forever.</span>
//               </h2>

//               <p style={{ fontSize: "clamp(14px,1.4vw,17px)", color: T.muted, lineHeight: 1.7, maxWidth: 460, margin: "0 auto 40px" }}>
//                 Join the Placement Accelerator and walk out with a recruiter-ready resume, GD confidence, interview clarity, and a personalised roadmap — all in one intensive programme.
//               </p>

//               <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
//                 <Link href="/select-slot?serviceId=placementAccelerator" className="pa-cta-btn" style={{ fontSize: 15 }}>
//                   Secure my seat — ₹4,999
//                   <ArrowRight size={15} />
//                 </Link>
//                 <Link href="/contact" className="pa-ghost-btn">
//                   Talk to our team first
//                 </Link>
//               </div>

//               <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 28 }}>
//                 <TrendingUp size={12} style={{ color: "#94a3b8" }} />
//                 <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
//                   5,000+ students placed · 94% success rate · ★ 4.9 average rating
//                 </span>
//               </div>
//             </Reveal>
//           </div>
//         </section>

//         <StandardFooter />
//       </div>
//     </>
//   );
// }




"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FileText, Users, Mic2, Video,
  CheckCircle2, ArrowRight, Clock, Zap,
  ChevronDown, Star, TrendingUp, Award, Sparkles, Check,
  ShieldCheck, BadgeCheck, IndianRupee, Tag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────── */
const T = {
  blue:   "#2563eb",
  blueDk: "#1d4ed8",
  ink:    "#0f172a",
  soft:   "#334155",
  muted:  "#64748b",
  rule:   "rgba(37,99,235,0.10)",
  green:  "#059669",
  amber:  "#b45309",
  purple: "#7c3aed",
};

/* ─────────────────────────────────────────────────────────────
   MODULE DATA
───────────────────────────────────────────────────────────── */
const MODULES = [
  {
    num: "01",
    duration: "60 mins",
    Icon: FileText,
    accent: T.green,
    accentLight: "rgba(5,150,105,0.09)",
    accentXLight: "rgba(5,150,105,0.04)",
    label: "Resume Analysis & Positioning",
    objective: "Turn a basic resume into an interview-winning document",
    topics: [
      "Live resume audit — structure, keywords, impact",
      "Identifying gaps & weak areas at a glance",
      "Converting responsibilities → achievements",
      "Aligning resume with target roles precisely",
    ],
    outcomes: [
      "Refined, recruiter-ready resume",
      "Clear positioning of your profile",
    ],
    tag: "Foundation",
    valueNote: "Resume improvement doc included",
  },
  {
    num: "02",
    duration: "60 mins",
    Icon: Users,
    accent: T.amber,
    accentLight: "rgba(180,83,9,0.09)",
    accentXLight: "rgba(180,83,9,0.04)",
    label: "Group Discussion Mastery",
    objective: "Stand out in GDs without over-speaking",
    topics: [
      "Types of GDs — abstract, case-based, current affairs",
      "How to start, enter & conclude effectively",
      "Structuring thoughts quickly under pressure",
      "Common mistakes that eliminate candidates",
    ],
    outcomes: [
      "Structured thinking under pressure",
      "Confident participation strategy",
    ],
    activity: "Live mini GD simulation + real-time feedback",
    tag: "Group Skill",
    valueNote: "GD scored feedback report included",
  },
  {
    num: "03",
    duration: "120 mins",
    Icon: Mic2,
    accent: T.blue,
    accentLight: "rgba(37,99,235,0.09)",
    accentXLight: "rgba(37,99,235,0.04)",
    label: "Interview Preparation – Core",
    objective: "Build strong, structured, and confident responses",
    parts: [
      {
        label: "Part A — Introduction Mastery",
        items: [
          'Crafting a powerful "Tell Me About Yourself"',
          "Personal branding in 60–90 seconds",
        ],
      },
      {
        label: "Part B — Common Questions",
        items: [
          "STAR-method answers for behavioural questions",
          "Handling strengths, weaknesses & salary questions",
        ],
      },
      {
        label: "Part C — Live Practice",
        items: ["Real-time correction & improvement sessions"],
      },
    ],
    outcomes: [
      "Finalized, polished introduction",
      "Ready answers for most-asked questions",
      "Improved articulation & confidence",
    ],
    tag: "Core Module",
    featured: true,
    valueNote: "Finalized intro script + answer bank",
  },
  {
    num: "04",
    duration: "60 mins",
    Icon: Video,
    accent: T.purple,
    accentLight: "rgba(124,58,237,0.09)",
    accentXLight: "rgba(124,58,237,0.04)",
    label: "Mock Interview + Feedback",
    objective: "Simulate real interview pressure and get actionable clarity",
    topics: [
      "Short mock interview rounds — as real as it gets",
      "Personalised feedback on communication",
      "Assessment of confidence & content quality",
      "Key improvement pointers & next steps",
    ],
    outcomes: [
      "Real interview experience under pressure",
      "Clear action plan for improvement",
    ],
    tag: "Capstone",
    valueNote: "30-day personalised improvement roadmap",
  },
] as const;

const DELIVERABLES = [
  { icon: "📄", label: "Resume improvement suggestions", sub: "Documented & actionable" },
  { icon: "🎤", label: "Finalized interview introduction", sub: "Polished & personalised" },
  { icon: "💬", label: "GD performance feedback", sub: "Scored & detailed" },
  { icon: "🗺️", label: "Personalised improvement roadmap", sub: "Your next 30 days planned" },
] as const;

/* ─────────────────────────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─────────────────────────────────────────────────────────────
   REVEAL WRAPPER
───────────────────────────────────────────────────────────── */
function Reveal({
  children, delay = 0, className = "", style = {},
}: {
  children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(28px)",
        transition: `opacity 0.65s ${delay}s cubic-bezier(0.22,1,0.36,1), transform 0.65s ${delay}s cubic-bezier(0.22,1,0.36,1)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION HEADING — reusable
───────────────────────────────────────────────────────────── */
function SectionHeading({
  badge, title, highlight, subtitle,
}: {
  badge: string; title: string; highlight?: string; subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ textAlign: "center", maxWidth: 720, margin: "0 auto clamp(2.5rem,5vw,4rem)", fontFamily: "'DM Sans',system-ui,sans-serif" }}
    >
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <span style={{ width: 32, height: 1, background: "linear-gradient(90deg,transparent,#2563eb)" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 13px", borderRadius: 99, background: "#2563eb14", border: "1px solid #2563eb26" }}>
          <Sparkles size={10} style={{ color: "#2563eb" }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: "#2563eb", letterSpacing: "0.12em", textTransform: "uppercase" }}>{badge}</span>
        </div>
        <span style={{ width: 32, height: 1, background: "linear-gradient(90deg,#2563eb,transparent)" }} />
      </div>
      <h2 style={{ margin: "0 0 12px", fontSize: "clamp(28px,4.2vw,52px)", lineHeight: 1.1, letterSpacing: "-0.035em", fontWeight: 800, color: "#0f172a" }}>
        {title}{" "}
        {highlight && (
          <span style={{ position: "relative", display: "inline-block", color: "#2563eb" }}>
            {highlight}
            <motion.span
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "absolute", left: 0, right: 0, bottom: "-3px", height: 3, borderRadius: 2, background: "linear-gradient(90deg,#2563eb,#1d4ed8)", transformOrigin: "left", display: "block" }}
            />
          </span>
        )}
      </h2>
      {subtitle && (
        <p style={{ fontSize: "clamp(14px,1.35vw,16px)", color: "#64748b", lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MODULE CARD — refined with price inclusion footer
───────────────────────────────────────────────────────────── */
function ModuleCard({ mod, index }: { mod: typeof MODULES[number]; index: number }) {
  const { ref, visible } = useReveal(0.08);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : `translateX(${isEven ? -28 : 28}px)`,
        transition: `opacity 0.7s ${index * 0.1}s cubic-bezier(0.22,1,0.36,1), transform 0.7s ${index * 0.1}s cubic-bezier(0.22,1,0.36,1)`,
        height: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: 20,
          border: `1px solid ${"featured" in mod ? mod.accent + "40" : mod.accent + "22"}`,
          background: "#fff",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          boxShadow: "featured" in mod
            ? `0 20px 56px -8px ${mod.accent}20, 0 4px 12px rgba(15,23,42,0.05)`
            : `0 8px 32px -4px ${mod.accent}10, 0 2px 8px rgba(15,23,42,0.03)`,
          transition: "box-shadow 0.25s, transform 0.25s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = `0 24px 64px -8px ${mod.accent}28, 0 4px 12px rgba(15,23,42,0.06)`;
          el.style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = "featured" in mod
            ? `0 20px 56px -8px ${mod.accent}20, 0 4px 12px rgba(15,23,42,0.05)`
            : `0 8px 32px -4px ${mod.accent}10, 0 2px 8px rgba(15,23,42,0.03)`;
          el.style.transform = "none";
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: 4, background: mod.accent, width: "100%", flexShrink: 0 }} />

        {"featured" in mod && (
          <div style={{
            position: "absolute", top: 16, right: 16,
            background: mod.accent, color: "#fff", fontSize: 9,
            fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
            borderRadius: 6, padding: "4px 9px",
          }}>
            ★ Flagship
          </div>
        )}

        {/* Card Body */}
        <div style={{ padding: "24px 26px 0", flex: 1 }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 13,
              background: mod.accentLight, border: `1.5px solid ${mod.accent}28`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <mod.Icon size={22} style={{ color: mod.accent }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: mod.accent,
                }}>
                  Module {mod.num}
                </span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: mod.accent + "60" }} />
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: "0.06em",
                  textTransform: "uppercase", color: T.muted,
                }}>
                  {mod.tag}
                </span>
              </div>
              <h3 style={{
                fontSize: "clamp(16px,1.7vw,19px)", fontWeight: 800,
                color: T.ink, letterSpacing: "-0.025em", lineHeight: 1.25,
                paddingRight: "featured" in mod ? 60 : 0,
              }}>
                {mod.label}
              </h3>
            </div>
          </div>

          {/* Duration pill */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 18 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: mod.accentXLight, border: `1px solid ${mod.accent}20`,
              borderRadius: 99, padding: "4px 11px",
            }}>
              <Clock size={11} style={{ color: mod.accent }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: mod.accent }}>
                {mod.duration}
              </span>
            </div>
          </div>

          {/* Objective */}
          <div style={{
            background: mod.accentXLight,
            borderLeft: `3px solid ${mod.accent}`,
            borderRadius: "0 10px 10px 0",
            padding: "10px 14px",
            marginBottom: 20,
          }}>
            <p style={{ fontSize: 12.5, color: T.soft, lineHeight: 1.6, margin: 0 }}>
              <span style={{ fontWeight: 700, color: mod.accent }}>Goal:</span>{" "}
              {mod.objective}
            </p>
          </div>

          {/* Topics or Parts */}
          {"parts" in mod ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
              {mod.parts.map((part) => (
                <div key={part.label}>
                  <p style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
                    textTransform: "uppercase", color: mod.accent,
                    marginBottom: 7, display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span style={{ width: 12, height: 1, background: mod.accent, display: "inline-block", opacity: 0.4 }} />
                    {part.label}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingLeft: 8 }}>
                    {part.items.map((item) => (
                      <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ fontSize: 14, color: mod.accent, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>·</span>
                        <span style={{ fontSize: 13, color: T.soft, lineHeight: 1.55 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
              {mod.topics.map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: 5, background: mod.accentXLight,
                    border: `1px solid ${mod.accent}20`, display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0, marginTop: 1,
                  }}>
                    <span style={{ fontSize: 8, fontWeight: 900, color: mod.accent }}>✓</span>
                  </span>
                  <span style={{ fontSize: 13, color: T.soft, lineHeight: 1.55 }}>{t}</span>
                </div>
              ))}
            </div>
          )}

          {/* Activity badge */}
          {"activity" in mod && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: mod.accentLight, border: `1px solid ${mod.accent}22`,
              borderRadius: 10, padding: "9px 13px", marginBottom: 16,
            }}>
              <Zap size={12} style={{ color: mod.accent, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: mod.accent, lineHeight: 1.4 }}>
                {mod.activity}
              </span>
            </div>
          )}

          {/* Outcomes */}
          <div style={{ paddingTop: 16, borderTop: `1px dashed ${mod.accent}25`, marginTop: 4, paddingBottom: 16 }}>
            <p style={{
              fontSize: 10, fontWeight: 800, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#94a3b8", marginBottom: 10,
            }}>
              You walk away with
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {mod.outcomes.map((o) => (
                <div key={o} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                  <CheckCircle2 size={14} style={{ color: mod.accent, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.soft, lineHeight: 1.4 }}>{o}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Pricing inclusion footer — always at bottom ── */}
        <div style={{
          margin: "0 26px",
          borderTop: `1px solid ${mod.accent}18`,
          padding: "12px 0 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Tag size={11} style={{ color: mod.accent, flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: T.muted }}>{mod.valueNote}</span>
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            background: mod.accentXLight, border: `1px solid ${mod.accent}22`,
            borderRadius: 99, padding: "3px 10px", flexShrink: 0,
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: mod.accent, letterSpacing: "0.04em" }}>
              Included · ₹2,100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   POST-MODULES PRICING STRIP
───────────────────────────────────────────────────────────── */
function PricingContextStrip() {
  const { ref, visible } = useReveal(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: "opacity 0.6s 0.1s cubic-bezier(0.22,1,0.36,1), transform 0.6s 0.1s cubic-bezier(0.22,1,0.36,1)",
        marginTop: 40,
      }}
    >
      <div style={{
        borderRadius: 20,
        background: "linear-gradient(135deg, #f0f7ff 0%, #e8f2ff 100%)",
        border: "1px solid rgba(37,99,235,0.18)",
        padding: "clamp(20px,3vw,28px) clamp(20px,3vw,32px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap",
      }}>
        {/* Module pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {[
            { n: "01", label: "Resume", color: T.green },
            { n: "02", label: "GD Mastery", color: T.amber },
            { n: "03", label: "Interview Core", color: T.blue },
            { n: "04", label: "Mock Interview", color: T.purple },
          ].map((m, i, arr) => (
            <div key={m.n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#fff", border: `1.5px solid ${m.color}30`,
                borderRadius: 10, padding: "6px 12px",
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: m.color, flexShrink: 0,
                }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: T.soft, whiteSpace: "nowrap" }}>
                  {m.n}. {m.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <span style={{ fontSize: 14, color: "#c4d4e8", fontWeight: 300 }}>+</span>
              )}
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: T.muted, textDecoration: "line-through", letterSpacing: "-0.01em", lineHeight: 1, opacity: 0.7 }}>₹6,999</span>
              <span style={{ fontSize: 28, fontWeight: 900, color: T.blue, letterSpacing: "-0.04em", lineHeight: 1 }}>₹2,100</span>
              <span style={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>+ GST</span>
            </div>
            <p style={{ fontSize: 10.5, color: T.muted, marginTop: 2, fontWeight: 500 }}>All 4 modules · 5 hours live</p>
          </div>
          <Link href="/select-slot?serviceId=placementAccelerator" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: T.blue, color: "#fff", fontSize: 13.5, fontWeight: 700,
            borderRadius: 11, padding: "12px 22px", textDecoration: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 6px 20px rgba(37,99,235,0.28)",
            transition: "filter 0.18s, transform 0.14s",
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1.08)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.filter = "none"; (e.currentTarget as HTMLAnchorElement).style.transform = "none"; }}
          >
            Enroll Now <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function PlacementAccelerator() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        * { box-sizing: border-box; }
        .pa-root { font-family: 'DM Sans', system-ui, sans-serif; background: #fff; color: #0f172a; -webkit-font-smoothing: antialiased; }
        .pa-wrap { width: 100%; max-width: 1160px; margin: 0 auto; padding: 0 clamp(20px,4vw,56px); }

        .pa-modules-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
        @media (max-width: 820px) { .pa-modules-grid { grid-template-columns: 1fr; } }

        .pa-deliv-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 900px) { .pa-deliv-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .pa-deliv-grid { grid-template-columns: 1fr; } }

        .pa-stat-strip { display: flex; gap: 0; flex-wrap: wrap; }
        .pa-stat + .pa-stat { border-left: 1px solid rgba(37,99,235,0.12); padding-left: clamp(1.2rem,3vw,2.4rem); }
        .pa-stat { padding-right: clamp(1.2rem,3vw,2.4rem); }

        .pa-blob { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }

        .pa-cta-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 30px; border-radius: 11px; background: #2563eb; color: #fff; font-size: 15px; font-weight: 700; font-family: 'DM Sans', system-ui, sans-serif; border: none; cursor: pointer; text-decoration: none; transition: filter 0.18s, box-shadow 0.18s, transform 0.14s; }
        .pa-cta-btn:hover { filter: brightness(1.08); box-shadow: 0 12px 32px rgba(37,99,235,0.28); transform: translateY(-1px); }

        .pa-ghost-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: #64748b; background: none; border: 1px solid rgba(37,99,235,0.2); border-radius: 11px; cursor: pointer; text-decoration: none; padding: 13px 24px; font-family: 'DM Sans', system-ui, sans-serif; transition: color 0.18s, border-color 0.18s, background 0.18s; }
        .pa-ghost-btn:hover { color: #2563eb; border-color: rgba(37,99,235,0.4); background: rgba(37,99,235,0.04); }

        @keyframes heroFadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
        .pa-hero-anim { animation: heroFadeUp 0.72s cubic-bezier(0.22,1,0.36,1) both; }

        .pa-grid-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(37,99,235,0.035) 1px,transparent 1px), linear-gradient(90deg,rgba(37,99,235,0.035) 1px,transparent 1px); background-size: 72px 72px; }

        @keyframes tickerMove { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .pa-ticker { animation: tickerMove 28s linear infinite; }
        .pa-ticker:hover { animation-play-state: paused; }

        .mentor-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(3rem,5vw,5.5rem); align-items: center; max-width: 1060px; margin: 0 auto; padding: clamp(1rem,3vw,2.5rem) 0; }
        @media(max-width:820px) { .mentor-grid { grid-template-columns: 1fr !important; gap: clamp(3rem,7vw,4rem) !important; } }

        .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media(max-width:640px) { .pricing-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div className="pa-root" style={{ minHeight: "100vh" }}>
        <Navbar />

        {/* ══ HERO ══ */}
        <section style={{
          position: "relative", overflow: "hidden",
          paddingTop: "calc(var(--yic-header-h, 64px) + clamp(28px, 4vw, 52px))",
          paddingBottom: "clamp(60px,8vw,100px)",
          background: "#fff",
        }}>
          <div className="pa-grid-bg" />
          <div className="pa-blob" style={{ width: 640, height: 640, background: "radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 65%)", top: -200, right: -140 }} />
          <div className="pa-blob" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(5,150,105,0.06) 0%,transparent 70%)", bottom: -80, left: -80 }} />

          <div className="pa-wrap" style={{ position: "relative", zIndex: 2 }}>
            <div className="pa-hero-anim" style={{
              animationDelay: "0s",
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.18)",
              borderRadius: 99, padding: "5px 14px", marginBottom: 26,
              fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.blue,
            }}>
              <Sparkles size={10} />
              Placement Accelerator Program
            </div>

            <h1 className="pa-hero-anim" style={{
              animationDelay: "0.1s",
              fontSize: "clamp(40px,6.5vw,82px)", fontWeight: 900,
              letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: 22, maxWidth: 760,
            }}>
              <span style={{ display: "block", color: T.ink }}>Your entire</span>
              <span style={{ display: "block", color: T.blue }}>placement journey.</span>
              <span style={{ display: "block", color: T.muted, fontWeight: 300 }}>In 5 hours.</span>
            </h1>

            <p className="pa-hero-anim" style={{
              animationDelay: "0.2s",
              fontSize: "clamp(15px,1.5vw,18px)", color: T.muted,
              lineHeight: 1.72, maxWidth: 500, marginBottom: 36,
            }}>
              From a blank resume to a polished interview performance — 4 structured modules,
              live practice, and personalised feedback that gives you a clear edge over every
              other candidate in the room.
            </p>

            {/* Hero price callout */}
            <div className="pa-hero-anim" style={{
              animationDelay: "0.24s",
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.15)",
              borderRadius: 12, padding: "10px 18px", marginBottom: 30,
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.muted, textDecoration: "line-through", opacity: 0.7 }}>₹6,999</span>
              <IndianRupee size={14} style={{ color: T.blue }} />
              <span style={{ fontSize: 16, fontWeight: 900, color: T.blue, letterSpacing: "-0.02em" }}>2,100</span>
              <span style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>+ 18% GST</span>
              <span style={{ width: 1, height: 16, background: "rgba(37,99,235,0.2)" }} />
              <span style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>4 modules · 5 hrs · 1:1 feedback</span>
            </div>

            <div className="pa-hero-anim" style={{ animationDelay: "0.3s", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 50 }}>
              <a href="#pricing" className="pa-cta-btn">
                View Pricing & Enroll <ArrowRight size={15} />
              </a>
              <a href="#modules" className="pa-ghost-btn">
                Explore modules <ChevronDown size={14} />
              </a>
            </div>

            <div className="pa-hero-anim pa-stat-strip" style={{ animationDelay: "0.36s", borderTop: "1px solid rgba(37,99,235,0.10)", paddingTop: "1.4rem" }}>
              {[
                { val: "4", label: "Expert-led Modules" },
                { val: "5 hrs", label: "Total Live Duration" },
                { val: "1:1", label: "Personalised Feedback" },
                { val: "94%", label: "Placement Success" },
              ].map((s) => (
                <div key={s.label} className="pa-stat">
                  <p style={{ fontSize: "clamp(20px,2.4vw,28px)", fontWeight: 900, color: T.blue, letterSpacing: "-0.035em", lineHeight: 1 }}>{s.val}</p>
                  <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginTop: 5 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TICKER ══ */}
        <div style={{ background: T.blue, padding: "12px 0", overflow: "hidden" }}>
          <div style={{ display: "flex", whiteSpace: "nowrap" }}>
            <div className="pa-ticker" style={{ display: "flex", gap: 36, paddingRight: 36 }}>
              {[
                "4 Modules", "✦", "5 Hours of Live Prep", "✦", "Resume + GD + Interview + Mock", "✦",
                "₹2,100 Launch Price", "✦", "1:1 Feedback", "✦", "Limited Seats",
                "4 Modules", "✦", "5 Hours of Live Prep", "✦", "Resume + GD + Interview + Mock", "✦",
                "₹2,100 Launch Price", "✦", "1:1 Feedback", "✦", "Limited Seats",
              ].map((t, i) => (
                <span key={i} style={{
                  fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase",
                  flexShrink: 0, fontWeight: t === "✦" ? 300 : 700,
                  color: t === "✦" ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.88)",
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ══ MEET YOUR MENTOR ══ */}
        <section style={{ background: "#f8f7f4", padding: "clamp(64px,8vw,100px) 0", position: "relative", overflow: "hidden" }}>
          <div className="pa-blob" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(37,99,235,0.06) 0%,transparent 65%)", top: -120, right: -100 }} />
          <div className="pa-wrap" style={{ position: "relative", zIndex: 2 }}>
            <Reveal>
              <SectionHeading
                badge="Your Mentor"
                title="Coached by someone who's"
                highlight="been inside."
                subtitle="Neel Aashish Seru has sat on both sides of the hiring table for 12+ years. He knows exactly what panels write after you leave the room."
              />
            </Reveal>

            <div className="mentor-grid">
              {/* Photo */}
              <Reveal delay={0.1}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ position: "relative", width: "100%", maxWidth: 360 }}>
                    {/* Decorative offset frame behind photo */}
                    <div aria-hidden style={{
                      position: "absolute", inset: 0,
                      transform: "translate(14px,14px)",
                      borderRadius: 26,
                      border: `1.5px solid ${T.blue}`,
                      opacity: 0.55,
                      pointerEvents: "none",
                    }} />
                    <div aria-hidden style={{
                      position: "absolute", inset: 0,
                      transform: "translate(-10px,-10px)",
                      borderRadius: 26,
                      background: "linear-gradient(135deg,rgba(37,99,235,0.10),rgba(37,99,235,0.0))",
                      pointerEvents: "none",
                    }} />

                    {/* Main photo card */}
                    <div style={{
                      position: "relative",
                      borderRadius: 24, overflow: "hidden", aspectRatio: "4/5",
                      background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
                      boxShadow: "0 32px 80px rgba(37,99,235,0.22), 0 6px 18px rgba(15,23,42,0.08)",
                      border: "1px solid rgba(37,99,235,0.12)",
                    }}>
                      <Image
                        src="/neel-new.jpeg"
                        alt="Neel Aashish Seru — Interview Coach"
                        fill
                        className="object-cover object-center"
                        priority
                      />
                      {/* Top dark wash for the badge to read on */}
                      <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 110,
                        background: "linear-gradient(to bottom,rgba(15,23,42,0.45),transparent)",
                        pointerEvents: "none",
                      }} />
                      {/* Bottom dark wash */}
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0, height: 160,
                        background: "linear-gradient(to top,rgba(15,23,42,0.55),transparent)",
                        pointerEvents: "none",
                      }} />

                      {/* Bottom-overlay name plate */}
                      <div style={{
                        position: "absolute", left: 18, right: 18, bottom: 18,
                        color: "#fff",
                      }}>
                        <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.78)", marginBottom: 4 }}>
                          Your Mentor
                        </p>
                        <p style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.025em", lineHeight: 1.1 }}>
                          Neel Aashish Seru
                        </p>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.78)", fontWeight: 500, marginTop: 4 }}>
                          12+ yrs · Tech Mahindra · IndiaMART
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </Reveal>

              {/* Bio */}
              <Reveal delay={0.15}>
                <div>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "5px 12px", borderRadius: 99,
                    background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.18)",
                    marginBottom: 14,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.blue, display: "block" }} />
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.blue }}>
                      12+ years · Both sides of the table
                    </span>
                  </div>

                  <h3 style={{ fontSize: "clamp(28px,3.4vw,46px)", fontWeight: 800, letterSpacing: "-0.03em", color: T.ink, lineHeight: 1.05, marginBottom: 18 }}>
                    Neel Aashish Seru
                  </h3>

                  {/* Pull quote */}
                  <div style={{
                    position: "relative",
                    padding: "16px 20px",
                    borderLeft: `3px solid ${T.blue}`,
                    background: "linear-gradient(90deg,rgba(37,99,235,0.06),rgba(37,99,235,0))",
                    borderRadius: "0 12px 12px 0",
                    marginBottom: 22,
                  }}>
                    <p style={{ fontSize: 15, color: T.ink, lineHeight: 1.65, fontWeight: 500, fontStyle: "italic" }}>
                      &ldquo;Most rejection emails look the same. But the notes inside the panel room are specific — and avoidable.&rdquo;
                    </p>
                  </div>

                  <p style={{ fontSize: 14.5, color: T.muted, lineHeight: 1.78, marginBottom: 26, maxWidth: 460 }}>
                    Neel has 12+ years of experience across <strong style={{ color: T.soft, fontWeight: 700 }}>Tech Mahindra</strong> and <strong style={{ color: T.soft, fontWeight: 700 }}>IndiaMART</strong>, sitting on hiring panels alongside senior decision-makers. He knows exactly what interviewers note down when they decide to pass — and how to make sure they write something different about you.
                  </p>

                  {/* Credentials — 2x2 stat-card grid */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
                    marginBottom: 28,
                  }}>
                    {[
                      { icon: Award, text: "12+ years on hiring panels", sub: "Corporate experience" },
                      { icon: Users, text: "5,000+ candidates", sub: "Personally coached" },
                      { icon: TrendingUp, text: "Tech Mahindra · IndiaMART", sub: "Both sides of the table" },
                      { icon: ShieldCheck, text: "No scripts, no fluff", sub: "Only real frameworks" },
                    ].map(({ icon: Icon, text, sub }) => (
                      <div key={text} style={{
                        display: "flex", alignItems: "flex-start", gap: 11,
                        padding: "12px 14px",
                        borderRadius: 12,
                        background: "#fff",
                        border: "1px solid rgba(37,99,235,0.10)",
                        boxShadow: "0 2px 8px rgba(15,23,42,0.03)",
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 9,
                          background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.14)",
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          <Icon size={14} style={{ color: T.blue }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, color: T.ink, fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.01em" }}>{text}</p>
                          <p style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>{sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link href="/about" style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 13, fontWeight: 700, color: T.blue, textDecoration: "none",
                    padding: "10px 18px",
                    borderRadius: 10,
                    background: "rgba(37,99,235,0.06)",
                    border: "1px solid rgba(37,99,235,0.18)",
                  }}>
                    Read the full story <ArrowRight size={13} />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══ JOURNEY STRIP ══ */}
        <section style={{ background: T.ink, padding: "clamp(26px,3.5vw,38px) 0", overflow: "hidden" }}>
          <div className="pa-wrap">
            <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", scrollbarWidth: "none", justifyContent: "center" }}>
              {[
                { n: "01", label: "Resume", color: T.green },
                { n: "→", label: "", color: "#4b5563", isArrow: true },
                { n: "02", label: "GD", color: T.amber },
                { n: "→", label: "", color: "#4b5563", isArrow: true },
                { n: "03", label: "Interview", color: T.blue },
                { n: "→", label: "", color: "#4b5563", isArrow: true },
                { n: "04", label: "Mock", color: T.purple },
                { n: "→", label: "", color: "#4b5563", isArrow: true },
                { n: "🏆", label: "Offer", color: "#f7c948" },
              ].map((item, i) => (
                "isArrow" in item ? (
                  <span key={i} style={{ fontSize: 16, color: "#374151", flexShrink: 0, padding: "0 8px" }}>→</span>
                ) : (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0, padding: "0 clamp(10px,2vw,18px)" }}>
                    <span style={{ fontSize: item.n === "🏆" ? 22 : 13, fontWeight: 800, color: item.color, letterSpacing: "-0.02em" }}>{item.n}</span>
                    {item.label && (
                      <span style={{ fontSize: 9.5, fontWeight: 600, color: "#6b7280", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                        {item.label}
                      </span>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        </section>

        {/* ══ MODULES ══ */}
        <section id="modules" style={{ background: "#fff", padding: "clamp(60px,7vw,100px) 0 clamp(40px,5vw,64px)" }}>
          <div className="pa-wrap">
            <Reveal>
              <SectionHeading
                badge="The Curriculum"
                title="4 modules. 1 complete"
                highlight="transformation."
                subtitle="Every session builds on the last — structured so that by the end, you're interview-ready across every dimension."
              />
            </Reveal>

            {/* Duration note */}
            <Reveal delay={0.06}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 16, marginBottom: 36, flexWrap: "wrap",
                paddingTop: 18, paddingBottom: 18,
                borderTop: "1px solid rgba(37,99,235,0.08)",
                borderBottom: "1px solid rgba(37,99,235,0.08)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <Clock size={13} style={{ color: "#94a3b8" }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#94a3b8" }}>Total programme:</span>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: T.ink }}>300 minutes of live, expert-led sessions</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: T.muted }}>All 4 modules included at</span>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.18)",
                    borderRadius: 99, padding: "3px 11px",
                    fontSize: 13, fontWeight: 800, color: T.blue,
                  }}>
                    <span style={{ textDecoration: "line-through", fontWeight: 500, color: T.muted, fontSize: 11, opacity: 0.7 }}>₹6,999</span>
                    ₹2,100 total
                  </span>
                </div>
              </div>
            </Reveal>

            <div className="pa-modules-grid">
              {MODULES.map((mod, i) => (
                <ModuleCard key={mod.num} mod={mod} index={i} />
              ))}
            </div>

            {/* Pricing context strip after modules */}
            <PricingContextStrip />
          </div>
        </section>

        {/* ══ MODULE 03 CALLOUT ══ */}
        <section style={{ background: T.blue, padding: "clamp(48px,6vw,80px) 0", position: "relative", overflow: "hidden" }}>
          <div className="pa-blob" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(255,255,255,0.06) 0%,transparent 65%)", top: -180, right: -100 }} />
          <div className="pa-wrap" style={{ position: "relative", zIndex: 2 }}>
            <Reveal>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr auto",
                gap: "clamp(2rem,5vw,5rem)", alignItems: "center",
              }}>
                <div>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 99, padding: "5px 13px", fontSize: 10.5, fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.85)", marginBottom: 18,
                  }}>
                    <Star size={10} />
                    Flagship session — 120 mins
                  </div>
                  <h2 style={{
                    fontSize: "clamp(26px,3.5vw,48px)", fontWeight: 800,
                    letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.1, marginBottom: 14,
                  }}>
                    Module 03 is where most candidates<br />
                    <span style={{ opacity: 0.65, fontWeight: 300 }}>finally click.</span>
                  </h2>
                  <p style={{ fontSize: "clamp(13.5px,1.3vw,15.5px)", color: "rgba(255,255,255,0.72)", lineHeight: 1.7, maxWidth: 500 }}>
                    Our 2-hour Interview Preparation Core is the deepest session — covering introduction mastery, STAR-method answers, and live practice with real-time correction. Most students say this single module shifts their entire mindset.
                  </p>
                </div>
                <div style={{
                  textAlign: "center",
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 18, padding: "32px 36px",
                  backdropFilter: "blur(12px)", minWidth: 160,
                }}>
                  <p style={{ fontSize: "clamp(42px,5vw,64px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 8 }}>120</p>
                  <p style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase" }}>minutes of live<br />deep-dive prep</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ DELIVERABLES ══ */}
        <section style={{ background: "#f8f7f4", padding: "clamp(64px,8vw,100px) 0", position: "relative", overflow: "hidden" }}>
          <div className="pa-wrap" style={{ position: "relative", zIndex: 2 }}>
            <Reveal>
              <SectionHeading
                badge="Final Deliverables"
                title="You leave with"
                highlight="everything."
                subtitle="Not just skills — tangible, documented outputs that you can act on immediately after the programme ends."
              />
            </Reveal>

            <div className="pa-deliv-grid">
              {DELIVERABLES.map((d, i) => (
                <Reveal key={d.label} delay={i * 0.08}>
                  <div
                    style={{
                      background: "#fff", border: "1px solid rgba(37,99,235,0.10)",
                      borderRadius: 18, padding: "26px 22px", height: "100%",
                      boxShadow: "0 4px 20px rgba(37,99,235,0.05)",
                      transition: "box-shadow 0.22s, transform 0.22s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 36px rgba(37,99,235,0.11)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(37,99,235,0.05)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
                  >
                    <span style={{ fontSize: 28, display: "block", marginBottom: 14 }}>{d.icon}</span>
                    <p style={{ fontSize: 14, fontWeight: 700, color: T.ink, lineHeight: 1.3, marginBottom: 6 }}>{d.label}</p>
                    <p style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 500 }}>{d.sub}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING ══ */}
        <section id="pricing" style={{ background: "#fff", padding: "clamp(64px,8vw,100px) 0" }}>
          <div className="pa-wrap">
            <Reveal>
              <SectionHeading
                badge="Pricing"
                title="One investment."
                highlight="Career-long returns."
                subtitle="5 hours of live, expert coaching across 4 modules — everything you need to walk into any interview with full confidence."
              />
            </Reveal>

            <Reveal delay={0.1}>
              <div className="pricing-grid" style={{ maxWidth: 780, margin: "0 auto" }}>
                {/* Main pricing card */}
                <div style={{
                  borderRadius: 22, border: "2px solid rgba(37,99,235,0.24)",
                  background: "#fff", overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(37,99,235,0.11)",
                }}>
                  <div style={{ height: 5, background: "linear-gradient(90deg,#2563eb,#1d4ed8)" }} />
                  <div style={{ padding: "26px 28px 30px" }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.18)",
                      borderRadius: 99, padding: "4px 11px",
                      fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em",
                      textTransform: "uppercase", color: T.blue, marginBottom: 14,
                    }}>
                      <Zap size={9} />
                      Most Popular
                    </div>
                    <h3 style={{ fontSize: 19, fontWeight: 800, color: T.ink, marginBottom: 5, letterSpacing: "-0.02em" }}>
                      Placement Accelerator
                    </h3>
                    <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 22 }}>
                      Complete 4-module programme with personalised 1:1 feedback from Neel.
                    </p>

                    {/* Price display */}
                    <div style={{
                      background: "rgba(37,99,235,0.04)", border: "1px solid rgba(37,99,235,0.12)",
                      borderRadius: 14, padding: "16px 18px", marginBottom: 22,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: T.muted, textDecoration: "line-through", opacity: 0.6 }}>₹6,999</span>
                        <span style={{ fontSize: 10, fontWeight: 700, background: "#dcfce7", color: "#16a34a", borderRadius: 6, padding: "2px 7px", letterSpacing: "0.04em" }}>70% OFF</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                        <span style={{ fontSize: 40, fontWeight: 900, color: T.blue, letterSpacing: "-0.04em", lineHeight: 1 }}>₹2,100</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>+ ₹378 GST (18%)</span>
                        <span style={{ width: 1, height: 12, background: "rgba(37,99,235,0.15)" }} />
                        <span style={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>Total: ₹2,478</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                      {[
                        "4 live expert-led modules",
                        "5 hours total programme duration",
                        "1:1 personalised feedback",
                        "Resume improvement document",
                        "Interview introduction — finalized",
                        "GD feedback report",
                        "30-day improvement roadmap",
                      ].map((f) => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 18, height: 18, borderRadius: 5,
                            background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.18)",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          }}>
                            <Check size={10} style={{ color: T.blue }} strokeWidth={3} />
                          </div>
                          <span style={{ fontSize: 13, color: T.soft, fontWeight: 500 }}>{f}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/select-slot?serviceId=placementAccelerator"
                      className="pa-cta-btn"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      Book My Seat <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>

                {/* Why worth it card */}
                <div style={{
                  borderRadius: 22, border: "1.5px solid rgba(37,99,235,0.12)",
                  background: "#f8f7f4", overflow: "hidden",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                }}>
                  <div style={{ padding: "26px 26px 0" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 18, letterSpacing: "-0.015em" }}>
                      Why it&apos;s worth it
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {[
                        { stat: "94%", label: "of participants receive interview calls within 2 weeks" },
                        { stat: "5,000+", label: "candidates guided to offers by Neel directly" },
                        { stat: "★ 4.9", label: "average rating across all sessions" },
                        { stat: "12+", label: "years of real hiring panel experience" },
                      ].map(({ stat, label }) => (
                        <div key={stat} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                          <span style={{ fontSize: 20, fontWeight: 900, color: T.blue, letterSpacing: "-0.03em", lineHeight: 1.1, flexShrink: 0, minWidth: 54 }}>{stat}</span>
                          <span style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, paddingTop: 2 }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: "22px 26px 26px" }}>
                    <div style={{ borderTop: "1px solid rgba(37,99,235,0.10)", paddingTop: 16 }}>
                      <p style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.72, fontStyle: "italic", marginBottom: 8 }}>
                        &ldquo;The resume module alone got me 4 callbacks in 3 days. Module 3 changed my entire approach to interviews.&rdquo;
                      </p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>— Priya M., Campus → TCS</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ TESTIMONIALS ══ */}
        <section style={{
          background: "#f8f7f4",
          borderTop: "1px solid rgba(37,99,235,0.08)",
          borderBottom: "1px solid rgba(37,99,235,0.08)",
          padding: "clamp(40px,5vw,64px) 0",
        }}>
          <div className="pa-wrap">
            <Reveal>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, alignItems: "stretch" }}>
                {[
                  { quote: "The resume module alone got me 4 callbacks in 3 days.", name: "Priya M.", role: "Campus → TCS" },
                  { quote: "GD session was eye-opening. I used to freeze; now I initiate.", name: "Karan D.", role: "Campus → Infosys" },
                  { quote: "Module 3 changed everything. My answers finally had structure.", name: "Sneha R.", role: "Campus → Wipro" },
                ].map((t, i) => (
                  <div key={i} style={{
                    background: "#fff", borderRadius: 16,
                    padding: "22px 20px",
                    border: "1px solid rgba(37,99,235,0.09)",
                    boxShadow: "0 4px 18px rgba(37,99,235,0.05)",
                    display: "flex", flexDirection: "column", gap: 12,
                  }}>
                    <div style={{ display: "flex", gap: 2 }}>
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star key={si} size={12} fill={T.amber} style={{ color: T.amber }} />
                      ))}
                    </div>
                    <p style={{ fontSize: 14, color: T.soft, lineHeight: 1.65, fontStyle: "italic", flex: 1 }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>{t.name}</p>
                      <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>{t.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ CTA FOOTER ══ */}
        <section style={{ background: "#fff", padding: "clamp(72px,9vw,120px) 0", position: "relative", overflow: "hidden" }}>
          <div className="pa-blob" style={{ width: 560, height: 560, background: "radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 65%)", top: -140, right: -80 }} />
          <div className="pa-blob" style={{ width: 380, height: 380, background: "radial-gradient(circle,rgba(124,58,237,0.05) 0%,transparent 65%)", bottom: -80, left: -60 }} />
          <div className="pa-grid-bg" />

          <div className="pa-wrap" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
            <Reveal>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.18)",
                borderRadius: 99, padding: "5px 14px", marginBottom: 24,
                fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: T.blue,
              }}>
                <Award size={11} />
                Limited seats per cohort
              </div>

              <h2 style={{ fontSize: "clamp(34px,5.5vw,72px)", fontWeight: 900, letterSpacing: "-0.04em", color: T.ink, lineHeight: 1.04, marginBottom: 18 }}>
                5 hours now.<br />
                <span style={{ color: T.blue }}>A career, forever.</span>
              </h2>

              <p style={{ fontSize: "clamp(14px,1.4vw,17px)", color: T.muted, lineHeight: 1.7, maxWidth: 440, margin: "0 auto 36px" }}>
                Join the Placement Accelerator and walk out with a recruiter-ready resume, GD confidence, interview clarity, and a personalised roadmap — all in one intensive programme.
              </p>

              {/* Price reminder before CTA */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.14)",
                borderRadius: 14, padding: "10px 20px", marginBottom: 28,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.muted, textDecoration: "line-through", opacity: 0.6 }}>₹6,999</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: T.blue, letterSpacing: "-0.03em" }}>₹2,100</span>
                <span style={{ fontSize: 10, fontWeight: 700, background: "#dcfce7", color: "#16a34a", borderRadius: 6, padding: "2px 7px" }}>70% OFF</span>
                <span style={{ width: 1, height: 16, background: "rgba(37,99,235,0.2)" }} />
                <span style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>4 modules · 5 hrs · +18% GST</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
                <Link href="/select-slot?serviceId=placementAccelerator" className="pa-cta-btn" style={{ fontSize: 15 }}>
                  Secure my seat — ₹2,100
                  <ArrowRight size={15} />
                </Link>
                <Link href="/contact" className="pa-ghost-btn">
                  Talk to our team first
                </Link>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                <TrendingUp size={12} style={{ color: "#94a3b8" }} />
                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                  5,000+ students placed · 94% success rate · ★ 4.9 average rating
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        <StandardFooter />
      </div>
    </>
  );
}