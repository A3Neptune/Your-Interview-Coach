// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { ArrowRight } from 'lucide-react';
// import Link from 'next/link';

// export default function HeroSection() {
//   const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
//   const sectionRef = useRef<HTMLElement>(null);

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   const scrollToFeatures = () => {
//     document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const px = (mousePos.x - 0.5) * 30;
//   const py = (mousePos.y - 0.5) * 20;

//   // Framer Motion animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.08,
//         delayChildren: 0.3,
//       },
//     },
//   };

//   const wordVariants = {
//     hidden: {
//       opacity: 0,
//       y: 20,
//       filter: 'blur(8px)'
//     },
//     visible: {
//       opacity: 1,
//       y: 0,
//       filter: 'blur(0px)',
//     },
//   };

//   const fadeInVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//     },
//   };

//   return (
//     <>
//       {/* ── Minimal global styles for things Tailwind can't express ── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

//         /* Grain texture */
//         .grain::before {
//           content: '';
//           position: fixed;
//           inset: 0;
//           background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
//           opacity: 0.035;
//           pointer-events: none;
//           z-index: 100;
//         }

//         /* Outlined text (no Tailwind equivalent for webkit-text-stroke) */
//         .text-stroke-ink {
//           -webkit-text-stroke: 2px #0a0a0f;
//           color: transparent;
//         }
//         .text-stroke-ghost {
//           -webkit-text-stroke: 1.5px rgba(26,86,219,0.10);
//           color: transparent;
//         }

//         /* Rotated photo frames */
//         .frame-a {
//           position: absolute; inset: -14px;
//           border: 1.5px solid rgba(26,86,219,0.25);
//           border-radius: 12px;
//           transform: rotate(2.5deg);
//           transition: transform 0.5s ease;
//           pointer-events: none;
//         }
//         .frame-b {
//           position: absolute; inset: -8px;
//           border: 1px solid rgba(26,86,219,0.12);
//           border-radius: 10px;
//           transform: rotate(-1deg);
//           transition: transform 0.5s ease;
//           pointer-events: none;
//         }
//         .stage:hover .frame-a { transform: rotate(0deg); }
//         .stage:hover .frame-b { transform: rotate(0deg); }
//         .stage:hover .photo   { transform: scale(1.03);  }

//         /* Scroll cue animation */
//         @keyframes scrollLine {
//           0%   { transform: scaleY(0); transform-origin: top;    }
//           50%  { transform: scaleY(1); transform-origin: top;    }
//           51%  { transform: scaleY(1); transform-origin: bottom; }
//           100% { transform: scaleY(0); transform-origin: bottom; }
//         }
//         .anim-scroll { animation: scrollLine 1.8s ease-in-out infinite; }
//       `}</style>

//       <section
//         ref={sectionRef}
//         className="grain relative min-h-svh overflow-hidden flex flex-col bg-[#f8f6f1] font-sans"
//       >
//         {/* ── Grid lines ── */}
//         <div
//           className="absolute inset-0 pointer-events-none"
//           style={{
//             backgroundImage:
//               'linear-gradient(rgba(26,86,219,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,219,0.04) 1px,transparent 1px)',
//             backgroundSize: '80px 80px',
//           }}
//         />

//         {/* ── Ghost "01" watermark ── */}
//         <div
//           className="text-stroke-ghost font-display absolute right-[-2vw] top-1/2 pointer-events-none select-none z-0 leading-[0.85] tracking-[-0.05em] hidden lg:block"
//           style={{
//             fontSize: 'clamp(180px,28vw,380px)',
//             transform: `translateY(-50%) translate(${px * 0.3}px,${py * 0.3}px)`,
//             transition: 'transform 0.8s cubic-bezier(.23,1,.32,1)',
//           }}
//           aria-hidden="true"
//         >
//           01
//         </div>

//         {/* ── Cursor-tracked spotlight ── */}
//         <div
//           className="absolute rounded-full pointer-events-none"
//           style={{
//             width: 600, height: 600,
//             background: 'radial-gradient(circle,rgba(26,86,219,0.12) 0%,transparent 70%)',
//             filter: 'blur(90px)',
//             left: `calc(${mousePos.x * 100}% - 300px)`,
//             top: `calc(${mousePos.y * 100}% - 300px)`,
//             transition: 'left 0.4s ease, top 0.4s ease',
//           }}
//         />
//         {/* Ambient bottom-right blob */}
//         <div
//           className="absolute bottom-[10%] right-[10%] rounded-full pointer-events-none"
//           style={{
//             width: 400, height: 400,
//             background: 'radial-gradient(circle,rgba(26,86,219,0.07) 0%,transparent 70%)',
//             filter: 'blur(90px)',
//           }}
//         />

//         {/* ══════════════════════ MAIN GRID ══════════════════════ */}
//         <div className="relative z-10 flex-1 w-full max-w-[1320px] mx-auto px-6 pt-[88px] pb-20 lg:pt-0 lg:pb-0 grid grid-cols-1 lg:grid-cols-[52%_48%] items-center">

//           {/* ──────── LEFT ──────── */}
//           <div className="flex flex-col text-center lg:text-left">

//             {/* Headline with Framer Motion Animation */}
//             <motion.div
//               className="mb-8"
//               initial="hidden"
//               animate="visible"
//               variants={containerVariants}
//             >
//               <span
//                 className="block font-heading"
//                 style={{
//                   fontSize: 'clamp(36px,5vw,64px)',
//                   lineHeight: 1.3,
//                   letterSpacing: '-0.02em',
//                   fontWeight: 800,
//                 }}
//               >
//                 {['Be', 'interview'].map((word, idx) => (
//                   <motion.span
//                     key={idx}
//                     variants={wordVariants}
//                     transition={{
//                       type: 'spring',
//                       damping: 12,
//                       stiffness: 100,
//                     }}
//                     className={word === 'interview' ? 'text-blue-600' : 'text-slate-900'}
//                     style={{ display: 'inline-block', marginRight: '0.3em' }}
//                   >
//                     {word}
//                   </motion.span>
//                 ))}
//                 <br />
//                 {['ready.'].map((word, idx) => (
//                   <motion.span
//                     key={`line2-${idx}`}
//                     variants={wordVariants}
//                     transition={{
//                       type: 'spring',
//                       damping: 12,
//                       stiffness: 100,
//                     }}
//                     className="text-slate-900"
//                     style={{ display: 'inline-block' }}
//                   >
//                     {word}
//                   </motion.span>
//                 ))}
//               </span>
//             </motion.div>

//             {/* Body copy */}
//             <motion.p
//               className="text-slate-600 max-w-[460px] mx-auto lg:mx-0 mb-11 leading-relaxed font-body"
//               style={{
//                 fontSize: 'clamp(15px,1.6vw,18px)'
//               }}
//               initial="hidden"
//               animate="visible"
//               variants={fadeInVariants}
//               transition={{ delay: 0.5 }}
//             >
//               Master your interviews with one-on-one expert mentorship. Practice real scenarios, get precision feedback, and walk into every room with unshakeable confidence.
//             </motion.p>

//             {/* CTA buttons */}
//             <motion.div
//               className="flex flex-wrap gap-3.5 items-center justify-center lg:justify-start"
//               initial="hidden"
//               animate="visible"
//               variants={fadeInVariants}
//               transition={{ delay: 0.7 }}
//             >
//               <Link
//                 href="/signup"
//                 className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#0a0a0f] text-white text-[13px] font-semibold tracking-[0.04em] uppercase rounded-[4px] border-[1.5px] border-[#0a0a0f] no-underline transition-all duration-300 hover:bg-blue-600 hover:border-blue-600 hover:-translate-y-0.5"
//               >
//                 Start free
//                 <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
//               </Link>

//               <button
//                 onClick={scrollToFeatures}
//                 className="group inline-flex items-center gap-2.5 px-7 py-4 bg-transparent text-[#0a0a0f] text-[13px] font-medium tracking-[0.04em] uppercase rounded-[4px] border-[1.5px] border-black/20 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:-translate-y-0.5"
//               >
//                 Learn more
//                 <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
//               </button>
//             </motion.div>

//             {/* Stats */}
//             <motion.div
//               className="flex gap-10 mt-14 pt-8 border-t border-slate-200 justify-center lg:justify-start"
//               initial="hidden"
//               animate="visible"
//               variants={fadeInVariants}
//               transition={{ delay: 0.9 }}
//             >
//               {[
//                 { num: '10+',  label: 'Years Experience' },
//                 { num: '500+', label: 'Students Placed'  },
//                 { num: '98%',  label: 'Success Rate'     },
//               ].map(({ num, label }) => (
//                 <div key={label}>
//                   <p className="text-4xl font-heading font-bold leading-none text-slate-900">
//                     {num}
//                   </p>
//                   <p className="text-[11px] font-body font-medium tracking-wider uppercase text-slate-500 mt-1">
//                     {label}
//                   </p>
//                 </div>
//               ))}
//             </motion.div>
//           </div>

//           {/* ──────── RIGHT ──────── */}
//           <div className="flex items-center justify-center lg:justify-end pt-10 lg:pt-0">
//             <motion.div
//               className="stage relative"
//               style={{
//                 width: 'clamp(280px,42vw,520px)',
//               }}
//               initial={{ opacity: 0, x: 40 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.9, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
//             >
//               {/* Rotated border frames */}
//               <div className="frame-a" />
//               <div className="frame-b" />

//               {/* Image */}
//               <div className="relative rounded-lg overflow-hidden bg-neutral-200 aspect-[4/5]">
//                 <img
//                   src="/neel-aashish-seru.jpeg"
//                   alt="Neel Aashish Seru – Interview Coach"
//                   className="photo w-full h-full object-cover object-top block transition-transform duration-700 ease-[cubic-bezier(.23,1,.32,1)]"
//                 />

//                 {/* Gradient overlay */}
//                 <div
//                   className="absolute inset-0"
//                   style={{ background: 'linear-gradient(160deg,transparent 40%,rgba(10,10,15,0.35) 100%)' }}
//                 />

//                 {/* Name plate */}
//                 <motion.div
//                   className="absolute bottom-6 left-5 right-5 rounded-lg px-5 py-4 border border-white/[0.08]"
//                   style={{ background: 'rgba(10,10,15,0.82)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 1.1 }}
//                 >
//                   <p className="font-heading text-xl text-white leading-tight font-semibold">Neel Aashish Seru</p>
//                   <p className="text-[11px] font-body font-medium tracking-wider uppercase text-white/40 mt-1">Your Interview Coach</p>
//                   <div className="w-7 h-0.5 bg-blue-600 rounded-full mt-2.5" />
//                 </motion.div>
//               </div>

//               {/* Float card — Years exp (bottom-right) */}
//               <motion.div
//                 className="absolute bottom-10 -right-[50px] max-lg:-right-2.5 text-center min-w-[90px] bg-white rounded-[10px] px-[18px] py-3.5 shadow-[0_8px_40px_rgba(10,10,15,0.12)]"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5, delay: 0.9 }}
//               >
//                 <p className="font-heading text-4xl font-bold leading-none text-blue-600">10+</p>
//                 <p className="text-[9px] font-body font-semibold tracking-widest uppercase text-slate-400 mt-0.5">Yrs Exp</p>
//               </motion.div>

//               {/* Vertical side text — xl screens only */}
//               <div
//                 className="absolute top-1/2 -right-[60px] hidden xl:block text-[9px] font-body font-semibold tracking-[0.25em] uppercase text-blue-600/35 whitespace-nowrap"
//                 style={{ transform: 'translateY(-50%) rotate(90deg)' }}
//               >
//                 Interview Mentorship · 2026
//               </div>
//             </motion.div>
//           </div>
//         </div>

//         {/* ── Scroll cue ── */}
//         <motion.div
//           className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 1.5 }}
//         >
//           <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#aaa]">Scroll</span>
//           <div
//             className="anim-scroll w-px h-10"
//             style={{ background: 'linear-gradient(to bottom,rgba(26,86,219,0.5),transparent)' }}
//           />
//         </motion.div>
//       </section>
//     </>
//   );
// }

"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const FADE_UP = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');


        :root {
          --cream: #f7f4ef;
          --ink: #0d1117;
          --ink-soft: #374151;
          --blue: #1a3bcc;
          --blue-light: #dce7ff;
          --gold: #c9a84c;
          --rule: rgba(13,17,23,0.10);
        }

        /* ── Noise overlay ── */
        .h-noise::after {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.030;
        }

        /* ── Diagonal rule behind headline ── */
        .diag-rule {
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: 1px;
          background: var(--rule);
        }

        /* ── Photo frame border trick ── */
        .photo-wrap::before {
          content: '';
          position: absolute;
          inset: -14px -10px -10px -14px;
          border: 1px solid rgba(26,59,204,0.18);
          border-radius: 20px;
          z-index: 0;
          pointer-events: none;
        }
        .photo-wrap::after {
          content: '';
          position: absolute;
          inset: -28px -22px -22px -28px;
          border: 1px dashed rgba(201,168,76,0.20);
          border-radius: 26px;
          z-index: 0;
          pointer-events: none;
        }

        /* ── Buttons ── */
        .btn-primary {
          background: var(--blue);
          color: #fff;
          border: 1.5px solid var(--blue);
          transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
        }
        .btn-primary:hover {
          background: #0f2799;
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(26,59,204,0.28);
        }
        .btn-outline {
          background: transparent;
          color: var(--ink-soft);
          border: 1.5px solid var(--rule);
          transition: border-color 0.22s, color 0.22s, transform 0.22s;
        }
        .btn-outline:hover {
          border-color: rgba(26,59,204,0.35);
          color: var(--blue);
          transform: translateY(-2px);
        }

        /* ── Scroll indicator ── */
        @keyframes scrollPulse {
          0%, 100% { transform: scaleY(0); transform-origin: top; opacity: 0.6; }
          50%       { transform: scaleY(1); transform-origin: top; opacity: 1; }
        }
        .scroll-line { animation: scrollPulse 2.4s ease-in-out infinite; }

        /* ── Highlight span ── */
        .hl {
          position: relative;
          display: inline-block;
        }
        .hl::after {
          content: '';
          position: absolute;
          left: 0; bottom: 0.04em;
          width: 100%; height: 0.18em;
          background: linear-gradient(90deg, var(--gold) 0%, rgba(201,168,76,0.3) 100%);
          border-radius: 2px;
          z-index: -1;
        }

        /* ── Badge pill ── */
        .eyebrow-pill {
          background: rgba(26,59,204,0.06);
          border: 1px solid rgba(26,59,204,0.18);
        }

        /* ── Stat dividers ── */
        .stat-block + .stat-block {
          padding-left: 2rem;
          border-left: 1px solid var(--rule);
        }

        /* ── Trust badges ── */
        .trust-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: var(--ink-soft); font-weight: 500;
        }

        /* ── Gradient mesh blobs ── */
        .blob {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none; z-index: 0;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="h-noise relative min-h-svh overflow-hidden flex flex-col"
        style={{
          background: "var(--cream)",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        {/* ── Subtle mesh blobs (static) ── */}
        <div
          className="blob"
          style={{
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(26,59,204,0.06) 0%, transparent 70%)",
            top: "-120px",
            right: "-80px",
          }}
        />
        <div
          className="blob"
          style={{
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
            bottom: "60px",
            left: "-60px",
          }}
        />

        {/* ── Fine grid ── */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(13,17,23,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(13,17,23,0.03) 1px,transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* ── Main content ── */}
        <div className="relative z-10 flex-1 w-full max-w-[1280px] mx-auto px-6 lg:px-12 pt-[100px] pb-20 lg:pt-[118px] lg:pb-0 grid grid-cols-1 lg:grid-cols-[55%_45%] items-center gap-16 lg:gap-0">
          {/* ════ LEFT ════ */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:pr-16">
            {/* Eyebrow */}
            <motion.div
              {...FADE_UP(0.05)}
              className="eyebrow-pill inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#1a3bcc",
                }}
              >
                Interview Mentorship · 2026
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.23, 1, 0.32, 1] as const,
              }}
              className="mb-6"
              style={{
                fontSize: "clamp(40px, 5.5vw, 72px)",
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                fontWeight: 300,
                color: "#0f172a",
              }}
            >
              Be{" "}
              <span
                style={{
                  fontWeight: 600,
                  color: "#1d4ed8",
                  fontStyle: "italic",
                }}
              >
                interview
              </span>
              <br />
              ready.
            </motion.h1>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.35,
                ease: [0.23, 1, 0.32, 1] as const,
              }}
              className="mb-9 leading-relaxed max-w-[440px] mx-auto lg:mx-0"
              style={{
                fontSize: "clamp(15px, 1.5vw, 17px)",
                color: "#64748b",
                fontWeight: 400,
              }}
            >
              Master your interviews with one-on-one expert mentorship. Practice
              real scenarios, get precision feedback, and walk into every room
              with unshakeable confidence.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...FADE_UP(0.4)}
              className="flex flex-wrap gap-3 items-center justify-center lg:justify-start mb-12"
            >
              <Link
                href="/signup"
                className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-lg no-underline"
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Start your journey
                <ArrowRight size={14} />
              </Link>

              <button
                onClick={scrollToFeatures}
                className="btn-outline inline-flex items-center gap-2 px-6 py-3.5 rounded-lg"
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Explore services
                <ArrowRight size={14} />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              {...FADE_UP(0.5)}
              className="flex gap-0 items-center"
              style={{
                borderTop: "1px solid var(--rule)",
                paddingTop: "1.6rem",
              }}
            >
              {[
                { num: "12,000+", label: "Students Coached" },
                { num: "94%", label: "Success Rate" },
              ].map(({ num, label }) => (
                <div
                  key={label}
                  className="stat-block"
                  style={{ paddingRight: "2rem" }}
                >
                  <p
                    style={{
                      fontSize: "clamp(24px, 2.8vw, 34px)",
                      fontWeight: 600,
                      color: "var(--ink)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {num}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.13em",
                      textTransform: "uppercase",
                      color: "#9ca3af",
                      marginTop: "5px",
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ════ RIGHT — Photo ════ */}
          <div className="flex items-center justify-center lg:justify-end pt-6 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="photo-wrap relative w-full"
              style={{ maxWidth: "clamp(280px, 38vw, 480px)" }}
            >
              {/* Image card */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  boxShadow:
                    "0 30px 70px -10px rgba(13,17,23,0.18), 0 4px 16px rgba(13,17,23,0.08)",
                  border: "1px solid rgba(13,17,23,0.07)",
                }}
              >
                {/* Aspect ratio box */}
                <div className="relative" style={{ aspectRatio: "4/5" }}>
                  <img
                    src="/neel-aashish-seru.jpeg"
                    alt="Neel Aashish Seru — Interview & Career Mentor"
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top",
                      display: "block",
                    }}
                  />

                  {/* Bottom gradient scrim */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(10,14,26,0.72) 0%, rgba(10,14,26,0.15) 44%, transparent 68%)",
                    }}
                  />

                  {/* Glass name card */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 20,
                      left: 20,
                      right: 20,
                      background: "rgba(255,255,255,0.10)",
                      backdropFilter: "blur(18px)",
                      WebkitBackdropFilter: "blur(18px)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      borderRadius: 14,
                      padding: "18px 22px",
                    }}
                  >
                    <p
                      style={{
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 22,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.1,
                      }}
                    >
                      Neel Aashish Seru
                    </p>
                    <p
                      style={{
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 500,
                        marginTop: 5,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      10+ Years Experience
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        >
          <span
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              color: "#c4bfb5",
            }}
          >
            Scroll
          </span>
          <div
            className="scroll-line"
            style={{
              width: 1,
              height: 38,
              background:
                "linear-gradient(to bottom, var(--blue), transparent)",
            }}
          />
        </motion.div>
        <div />
      </section>
    </>
  );
}
