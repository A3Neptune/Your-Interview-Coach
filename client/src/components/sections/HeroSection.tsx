'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const px = (mousePos.x - 0.5) * 30;
  const py = (mousePos.y - 0.5) * 20;

  // Framer Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(8px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
    },
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <>
      {/* ── Minimal global styles for things Tailwind can't express ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

        /* Grain texture */
        .grain::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.035;
          pointer-events: none;
          z-index: 100;
        }

        /* Outlined text (no Tailwind equivalent for webkit-text-stroke) */
        .text-stroke-ink {
          -webkit-text-stroke: 2px #0a0a0f;
          color: transparent;
        }
        .text-stroke-ghost {
          -webkit-text-stroke: 1.5px rgba(26,86,219,0.10);
          color: transparent;
        }


        /* Rotated photo frames */
        .frame-a {
          position: absolute; inset: -14px;
          border: 1.5px solid rgba(26,86,219,0.25);
          border-radius: 12px;
          transform: rotate(2.5deg);
          transition: transform 0.5s ease;
          pointer-events: none;
        }
        .frame-b {
          position: absolute; inset: -8px;
          border: 1px solid rgba(26,86,219,0.12);
          border-radius: 10px;
          transform: rotate(-1deg);
          transition: transform 0.5s ease;
          pointer-events: none;
        }
        .stage:hover .frame-a { transform: rotate(0deg); }
        .stage:hover .frame-b { transform: rotate(0deg); }
        .stage:hover .photo   { transform: scale(1.03);  }

        /* Scroll cue animation */
        @keyframes scrollLine {
          0%   { transform: scaleY(0); transform-origin: top;    }
          50%  { transform: scaleY(1); transform-origin: top;    }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        .anim-scroll { animation: scrollLine 1.8s ease-in-out infinite; }
      `}</style>

      <section
        ref={sectionRef}
        className="grain relative min-h-svh overflow-hidden flex flex-col bg-[#f8f6f1] font-sans"
      >
        {/* ── Grid lines ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(26,86,219,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,219,0.04) 1px,transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* ── Ghost "01" watermark ── */}
        <div
          className="text-stroke-ghost font-display absolute right-[-2vw] top-1/2 pointer-events-none select-none z-0 leading-[0.85] tracking-[-0.05em] hidden lg:block"
          style={{
            fontSize: 'clamp(180px,28vw,380px)',
            transform: `translateY(-50%) translate(${px * 0.3}px,${py * 0.3}px)`,
            transition: 'transform 0.8s cubic-bezier(.23,1,.32,1)',
          }}
          aria-hidden="true"
        >
          01
        </div>

        {/* ── Cursor-tracked spotlight ── */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 600, height: 600,
            background: 'radial-gradient(circle,rgba(26,86,219,0.12) 0%,transparent 70%)',
            filter: 'blur(90px)',
            left: `calc(${mousePos.x * 100}% - 300px)`,
            top: `calc(${mousePos.y * 100}% - 300px)`,
            transition: 'left 0.4s ease, top 0.4s ease',
          }}
        />
        {/* Ambient bottom-right blob */}
        <div
          className="absolute bottom-[10%] right-[10%] rounded-full pointer-events-none"
          style={{
            width: 400, height: 400,
            background: 'radial-gradient(circle,rgba(26,86,219,0.07) 0%,transparent 70%)',
            filter: 'blur(90px)',
          }}
        />

        {/* ══════════════════════ MAIN GRID ══════════════════════ */}
        <div className="relative z-10 flex-1 w-full max-w-[1320px] mx-auto px-6 pt-[88px] pb-20 lg:pt-0 lg:pb-0 grid grid-cols-1 lg:grid-cols-[52%_48%] items-center">

          {/* ──────── LEFT ──────── */}
          <div className="flex flex-col text-center lg:text-left">

            {/* Headline with Framer Motion Animation */}
            <motion.div
              className="mb-8"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <span
                className="block font-heading"
                style={{
                  fontSize: 'clamp(36px,5vw,64px)',
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                  fontWeight: 800,
                }}
              >
                {['Be', 'interview'].map((word, idx) => (
                  <motion.span
                    key={idx}
                    variants={wordVariants}
                    transition={{
                      type: 'spring',
                      damping: 12,
                      stiffness: 100,
                    }}
                    className={word === 'interview' ? 'text-blue-600' : 'text-slate-900'}
                    style={{ display: 'inline-block', marginRight: '0.3em' }}
                  >
                    {word}
                  </motion.span>
                ))}
                <br />
                {['ready.'].map((word, idx) => (
                  <motion.span
                    key={`line2-${idx}`}
                    variants={wordVariants}
                    transition={{
                      type: 'spring',
                      damping: 12,
                      stiffness: 100,
                    }}
                    className="text-slate-900"
                    style={{ display: 'inline-block' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </motion.div>

            {/* Body copy */}
            <motion.p
              className="text-slate-600 max-w-[460px] mx-auto lg:mx-0 mb-11 leading-relaxed font-body"
              style={{
                fontSize: 'clamp(15px,1.6vw,18px)'
              }}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              transition={{ delay: 0.5 }}
            >
              Master your interviews with one-on-one expert mentorship. Practice real scenarios, get precision feedback, and walk into every room with unshakeable confidence.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-wrap gap-3.5 items-center justify-center lg:justify-start"
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              transition={{ delay: 0.7 }}
            >
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#0a0a0f] text-white text-[13px] font-semibold tracking-[0.04em] uppercase rounded-[4px] border-[1.5px] border-[#0a0a0f] no-underline transition-all duration-300 hover:bg-blue-600 hover:border-blue-600 hover:-translate-y-0.5"
              >
                Start free
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <button
                onClick={scrollToFeatures}
                className="group inline-flex items-center gap-2.5 px-7 py-4 bg-transparent text-[#0a0a0f] text-[13px] font-medium tracking-[0.04em] uppercase rounded-[4px] border-[1.5px] border-black/20 transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:-translate-y-0.5"
              >
                Learn more
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-10 mt-14 pt-8 border-t border-slate-200 justify-center lg:justify-start"
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              transition={{ delay: 0.9 }}
            >
              {[
                { num: '10+',  label: 'Years Experience' },
                { num: '500+', label: 'Students Placed'  },
                { num: '98%',  label: 'Success Rate'     },
              ].map(({ num, label }) => (
                <div key={label}>
                  <p className="text-4xl font-heading font-bold leading-none text-slate-900">
                    {num}
                  </p>
                  <p className="text-[11px] font-body font-medium tracking-wider uppercase text-slate-500 mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ──────── RIGHT ──────── */}
          <div className="flex items-center justify-center lg:justify-end pt-10 lg:pt-0">
            <motion.div
              className="stage relative"
              style={{
                width: 'clamp(280px,42vw,520px)',
              }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Rotated border frames */}
              <div className="frame-a" />
              <div className="frame-b" />

              {/* Image */}
              <div className="relative rounded-lg overflow-hidden bg-neutral-200 aspect-[4/5]">
                <img
                  src="/IMG-20241116-WA0012(1).jpg.jpeg"
                  alt="Neel Aashish Seru – Interview Coach"
                  className="photo w-full h-full object-cover object-top block transition-transform duration-700 ease-[cubic-bezier(.23,1,.32,1)]"
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(160deg,transparent 40%,rgba(10,10,15,0.35) 100%)' }}
                />

                {/* Name plate */}
                <motion.div
                  className="absolute bottom-6 left-5 right-5 rounded-lg px-5 py-4 border border-white/[0.08]"
                  style={{ background: 'rgba(10,10,15,0.82)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <p className="font-heading text-xl text-white leading-tight font-semibold">Neel Aashish Seru</p>
                  <p className="text-[11px] font-body font-medium tracking-wider uppercase text-white/40 mt-1">Your Interview Coach</p>
                  <div className="w-7 h-0.5 bg-blue-600 rounded-full mt-2.5" />
                </motion.div>
              </div>

              {/* Float card — Years exp (bottom-right) */}
              <motion.div
                className="absolute bottom-10 -right-[50px] max-lg:-right-2.5 text-center min-w-[90px] bg-white rounded-[10px] px-[18px] py-3.5 shadow-[0_8px_40px_rgba(10,10,15,0.12)]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <p className="font-heading text-4xl font-bold leading-none text-blue-600">10+</p>
                <p className="text-[9px] font-body font-semibold tracking-widest uppercase text-slate-400 mt-0.5">Yrs Exp</p>
              </motion.div>

              {/* Vertical side text — xl screens only */}
              <div
                className="absolute top-1/2 -right-[60px] hidden xl:block text-[9px] font-body font-semibold tracking-[0.25em] uppercase text-blue-600/35 whitespace-nowrap"
                style={{ transform: 'translateY(-50%) rotate(90deg)' }}
              >
                Interview Mentorship · 2026
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Scroll cue ── */}
        <motion.div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#aaa]">Scroll</span>
          <div
            className="anim-scroll w-px h-10"
            style={{ background: 'linear-gradient(to bottom,rgba(26,86,219,0.5),transparent)' }}
          />
        </motion.div>
      </section>
    </>
  );
}