'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  ChevronRight, Sparkles, Target, Heart, Zap,
  Users, Award, TrendingUp, Star, ArrowRight,
  Linkedin, Twitter, Globe
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import StandardFooter from '@/components/StandardFooter';

/* ─── Intersection observer hook ─── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Data ─── */
const stats = [
  { target: 12000, suffix: '+', label: 'Candidates Coached', icon: Users },
  { target: 94, suffix: '%', label: 'Interview Success Rate', icon: TrendingUp },
  { target: 340, suffix: '+', label: 'Partner Companies', icon: Award },
  { target: 4, suffix: '.9★', label: 'Average Rating', icon: Star },
];

const values = [
  {
    icon: Target,
    title: 'Precision Over Guesswork',
    desc: 'Every coaching session is built around data — real interview patterns, real feedback loops, real outcomes. We don\'t believe in generic prep.',
    accent: '#2563eb',
    bg: '#dbeafe',
  },
  {
    icon: Heart,
    title: 'Candidate-First Always',
    desc: 'Your anxiety is valid. Your timeline is real. We meet you where you are and build upward, not from a one-size-fits-all playbook.',
    accent: '#0891b2',
    bg: '#cffafe',
  },
  {
    icon: Zap,
    title: 'Speed Without Shortcuts',
    desc: 'Interview prep doesn\'t need to take months. Our AI-accelerated system gets you interview-ready in days without cutting corners.',
    accent: '#7c3aed',
    bg: '#ede9fe',
  },
];

const team = [
  {
    name: 'Arjun Mehra',
    role: 'Co-founder & CEO',
    prev: 'ex-Google, ex-McKinsey',
    bio: 'Led hiring for Google\'s APAC engineering division. Interviewed 400+ candidates. Knows exactly what the panel is thinking.',
    initials: 'AM',
    color: '#2563eb',
    links: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Priya Nair',
    role: 'Co-founder & Head of Coaching',
    prev: 'ex-Meta, ex-Bain',
    bio: 'Product manager turned career coach. Helped 2,000+ candidates land offers at FAANG, startups, and top consulting firms.',
    initials: 'PN',
    color: '#0891b2',
    links: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Rohan Kapoor',
    role: 'Head of AI & Product',
    prev: 'ex-OpenAI, ex-Flipkart',
    bio: 'Built the feedback engine that simulates how real interviewers evaluate answers — tone, structure, confidence, all of it.',
    initials: 'RK',
    color: '#7c3aed',
    links: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Sneha Iyer',
    role: 'Lead Mentor — Finance & Consulting',
    prev: 'ex-Goldman Sachs, ex-BCG',
    bio: 'Cracked 11 offers across investment banking and consulting. Now she teaches others to do the same with surgical precision.',
    initials: 'SI',
    color: '#059669',
    links: { linkedin: '#', twitter: '#' },
  },
];

const milestones = [
  { year: '2020', title: 'The Problem Spotted', desc: 'Arjun and Priya met at a Google careers panel and realised the same thing: most candidates were wildly underprepared, not because of ability — but because they had no real feedback.' },
  { year: '2021', title: 'Built in a Weekend', desc: 'First version: a Notion doc, a Calendly link, and two coaches. 40 beta users. 38 got offers. The waiting list grew before the product did.' },
  { year: '2022', title: 'AI Enters the Room', desc: 'Rohan joined to build the AI feedback engine. Practice sessions became available 24/7. Candidates could rehearse at 2am before a 9am interview.' },
  { year: '2023', title: 'Scale & Depth', desc: 'Crossed 5,000 coached candidates. Expanded into finance, consulting, and design tracks. Partnered with 100+ companies for referral pipelines.' },
  { year: '2024', title: 'The Platform', desc: 'Launched the full dashboard, analytics suite, and mentor marketplace. 12,000+ candidates. 94% success rate. Still improving.' },
];

/* ─── Section wrapper with fade-up ─── */
function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const [activeYear, setActiveYear] = useState(0);

  return (
    <main className="min-h-screen bg-[#F8F6F1] overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&display=swap');

        /* ─ globals ─ */
        * { box-sizing: border-box; }

        /* ─ hero ─ */
        @keyframes hero-enter {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -20px) scale(1.05); }
          66%       { transform: translate(-20px, 15px) scale(0.97); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes shimmer-badge {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes timeline-fill {
          from { height: 0; }
          to   { height: 100%; }
        }
        @keyframes card-glow {
          0%, 100% { box-shadow: 0 4px 24px rgba(37,99,235,0.08); }
          50%       { box-shadow: 0 8px 40px rgba(37,99,235,0.16); }
        }
        @keyframes count-up-flash {
          0%   { color: #1d4ed8; }
          100% { color: inherit; }
        }

        .hero-word {
          display: inline-block;
          animation: hero-enter 0.8s cubic-bezier(0.22,1,0.36,1) both;
        }
        .orb { animation: float-orb 12s ease-in-out infinite; will-change: transform; }
        .spin { animation: spin-slow 20s linear infinite; will-change: transform; }

        .stat-card:hover { animation: card-glow 2s ease-in-out infinite; }

        .team-card { transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease; }
        .team-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(37,99,235,0.14); }

        .value-card {
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease, border-color 0.3s ease;
        }
        .value-card:hover { transform: translateY(-4px); }

        .timeline-dot {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
        }
        .timeline-item:hover .timeline-dot {
          transform: scale(1.3);
          box-shadow: 0 0 0 6px rgba(37,99,235,0.15);
        }

        .cta-btn {
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(37,99,235,0.4); }
        .cta-btn:active { transform: translateY(0); }

        @media (prefers-reduced-motion: reduce) {
          .orb, .spin, .hero-word, .stat-card, .team-card, .value-card { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-[88vh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb absolute top-[10%] left-[8%] w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', animationDelay: '0s' }} />
          <div className="orb absolute bottom-[15%] right-[6%] w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(8,145,178,0.1) 0%, transparent 70%)', animationDelay: '-4s' }} />
          <div className="orb absolute top-[40%] right-[20%] w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', animationDelay: '-8s' }} />

          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

          {/* Rotating ring */}
          <div className="spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
            style={{ border: '1px dashed rgba(37,99,235,0.08)' }} />
          <div className="spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{ border: '1px dashed rgba(37,99,235,0.06)', animationDirection: 'reverse', animationDuration: '15s' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="sv-word inline-flex items-center gap-2 px-4 py-2 rounded-full mb-7" style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(147,197,253,0.6)', boxShadow: '0 2px 14px rgba(37,99,235,0.07)', animationDelay: '0ms' }}>
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-widest">Our Story</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6" style={{ fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.1 }}>
            {['We', 'built', 'the', 'coach', 'we', 'wish', 'we', 'had.'].map((word, i) => (
              <span
                key={i}
                className="hero-word"
                style={{
                  animationDelay: `${i * 60 + 100}ms`,
                  fontSize: 'clamp(40px, 7vw, 80px)',
                  fontWeight: i === 3 ? 600 : 300,
                  color: i === 3 ? '#1d4ed8' : '#0f172a',
                  fontStyle: i === 3 ? 'italic' : 'normal',
                  marginRight: '0.22em',
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Sub */}
          <p
            className="hero-word max-w-2xl mx-auto text-slate-500 leading-relaxed"
            style={{ fontSize: 'clamp(16px, 2vw, 19px)', animationDelay: '600ms', fontWeight: 400 }}
          >
            YourInterviewCoach was born from a simple frustration: talented people were failing interviews
            not because they weren't good enough — but because no one ever taught them how to show it.
          </p>

          {/* CTA row */}
          <div className="hero-word flex flex-col sm:flex-row items-center justify-center gap-3 mt-10" style={{ animationDelay: '750ms' }}>
            <Link href="/signup" className="cta-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)' }}>
              <span className="relative z-10 flex items-center gap-2">
                Start your journey
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium text-slate-600 text-sm border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
              Explore services
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #f8faff)' }} />
      </section>

      {/* ══════════════════════════════════════
          STATS
      ══════════════════════════════════════ */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="stat-card rounded-2xl p-6 text-center"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(12px)',
                      border: '1.5px solid rgba(219,234,254,0.8)',
                      boxShadow: '0 4px 24px rgba(37,99,235,0.06)',
                    }}>
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
                      style={{ background: 'rgba(37,99,235,0.08)' }}>
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1"
                      style={{ fontFamily: "'Fraunces', serif" }}>
                      <Counter target={s.target} suffix={s.suffix} />
                    </div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MISSION
      ══════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <FadeUp>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">
                <span className="w-6 h-px bg-blue-400 inline-block" />
                Our Mission
              </span>
              <h2 className="mb-6 text-slate-900" style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: 1.15, fontWeight: 600 }}>
                Democratise access to <em style={{ color: '#2563eb', fontStyle: 'italic' }}>world-class</em> interview prep.
              </h2>
              <p className="text-slate-500 leading-relaxed mb-5" style={{ fontSize: '17px' }}>
                Premium coaching used to be locked behind expensive bootcamps and who-you-know networks.
                A candidate in Mumbai or Pune shouldn't have less access to quality prep than someone whose
                university has alumni at every top firm.
              </p>
              <p className="text-slate-500 leading-relaxed" style={{ fontSize: '17px' }}>
                We combine AI that's available at 3am before your morning interview with human mentors who've
                sat on both sides of the table — and we make it accessible to anyone who's serious about their career.
              </p>
            </FadeUp>

            {/* Right — visual card */}
            <FadeUp delay={150}>
              <div className="relative">
                {/* Main card */}
                <div className="rounded-2xl p-8 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #3b82f6 100%)',
                    boxShadow: '0 24px 80px rgba(37,99,235,0.3)',
                  }}>
                  {/* Decorative */}
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <blockquote className="text-white/90 leading-relaxed mb-6"
                      style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontStyle: 'italic', fontWeight: 300 }}>
                      "The best interview is one where the panel forgets they're evaluating you —
                      because you made them want to work with you."
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">AM</div>
                      <div>
                        <div className="text-white font-semibold text-sm">Arjun Mehra</div>
                        <div className="text-white/60 text-xs">Co-founder, ex-Google</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-5 -left-5 rounded-xl px-5 py-4"
                  style={{
                    background: 'rgba(255,255,255,0.97)',
                    border: '1.5px solid rgba(219,234,254,0.9)',
                    boxShadow: '0 8px 32px rgba(37,99,235,0.12)',
                  }}>
                  <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>94%</div>
                  <div className="text-xs text-slate-500 font-medium">Success rate</div>
                </div>

                {/* Floating badge 2 */}
                <div className="absolute -top-5 -right-5 rounded-xl px-4 py-3"
                  style={{
                    background: 'rgba(255,255,255,0.97)',
                    border: '1.5px solid rgba(219,234,254,0.9)',
                    boxShadow: '0 8px 32px rgba(37,99,235,0.12)',
                  }}>
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-1">12,000+ coached</div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          VALUES
      ══════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">
              <span className="w-6 h-px bg-blue-400 inline-block" />
              What drives us
              <span className="w-6 h-px bg-blue-400 inline-block" />
            </span>
            <h2 className="text-slate-900" style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 46px)', lineHeight: 1.2, fontWeight: 600 }}>
              Principles we don't compromise on
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <FadeUp key={i} delay={i * 100}>
                  <div className="value-card rounded-2xl p-7 h-full"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      border: `1.5px solid rgba(219,234,254,0.7)`,
                      boxShadow: '0 4px 24px rgba(37,99,235,0.05)',
                    }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: v.bg }}>
                      <Icon className="w-6 h-6" style={{ color: v.accent }} />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-3" style={{ fontSize: '17px' }}>{v.title}</h3>
                    <p className="text-slate-500 leading-relaxed" style={{ fontSize: '14.5px' }}>{v.desc}</p>
                    {/* Accent line */}
                    <div className="mt-6 h-0.5 w-10 rounded-full" style={{ background: v.accent }} />
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">
              <span className="w-6 h-px bg-blue-400 inline-block" />
              Our journey
              <span className="w-6 h-px bg-blue-400 inline-block" />
            </span>
            <h2 className="text-slate-900" style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 46px)', lineHeight: 1.2, fontWeight: 600 }}>
              Five years of building something real
            </h2>
          </FadeUp>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-blue-300 to-transparent md:-translate-x-px" />

            <div className="space-y-10">
              {milestones.map((m, i) => {
                const isRight = i % 2 === 0;
                return (
                  <FadeUp key={i} delay={i * 80}>
                    <div
                      className={`timeline-item relative flex gap-6 md:gap-0 ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'
                        }`}
                      onClick={() => setActiveYear(i)}
                    >
                      {/* Content */}
                      <div className={`flex-1 pl-14 md:pl-0 ${isRight ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                        <div
                          className="inline-block rounded-xl px-5 py-4 cursor-pointer"
                          style={{
                            background: activeYear === i ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.7)',
                            border: activeYear === i ? '1.5px solid rgba(147,197,253,0.7)' : '1.5px solid rgba(219,234,254,0.5)',
                            boxShadow: activeYear === i ? '0 8px 32px rgba(37,99,235,0.12)' : '0 2px 12px rgba(37,99,235,0.04)',
                            transition: 'all 0.3s ease',
                            width: '100%',
                          }}
                        >
                          <div className="text-xs font-bold text-blue-500 mb-1 uppercase tracking-widest">{m.year}</div>
                          <div className="font-semibold text-slate-900 mb-1.5" style={{ fontSize: '16px' }}>{m.title}</div>
                          <div className="text-slate-500 leading-relaxed" style={{ fontSize: '13.5px' }}>{m.desc}</div>
                        </div>
                      </div>

                      {/* Dot — mobile: absolute left, desktop: center */}
                      <div className="absolute left-0 md:left-1/2 top-5 md:-translate-x-1/2 flex items-center justify-center">
                        <div className="timeline-dot w-5 h-5 rounded-full border-2 border-blue-400 bg-white flex items-center justify-center"
                          style={{ boxShadow: '0 0 0 3px rgba(37,99,235,0.1)' }}>
                          <div className="w-2 h-2 rounded-full" style={{ background: '#2563eb' }} />
                        </div>
                      </div>

                      {/* Spacer for opposite side */}
                      <div className="hidden md:block flex-1" />
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TEAM
      ══════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-widest mb-4">
              <span className="w-6 h-px bg-blue-400 inline-block" />
              The team
              <span className="w-6 h-px bg-blue-400 inline-block" />
            </span>
            <h2 className="text-slate-900 mb-3" style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 46px)', lineHeight: 1.2, fontWeight: 600 }}>
              Coaches who've been in the room
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto" style={{ fontSize: '16px' }}>
              Everyone on our team has either hired at a top company, cracked elite interviews themselves — or both.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <FadeUp key={i} delay={i * 80}>
                <div
                  className="team-card rounded-2xl p-6 h-full cursor-default"
                  style={{
                    background: hoveredMember === i
                      ? `linear-gradient(160deg, rgba(255,255,255,0.98), rgba(239,246,255,0.6))`
                      : 'rgba(255,255,255,0.85)',
                    border: hoveredMember === i
                      ? `1.5px solid rgba(147,197,253,0.7)`
                      : '1.5px solid rgba(219,234,254,0.6)',
                    boxShadow: '0 4px 24px rgba(37,99,235,0.05)',
                  }}
                  onMouseEnter={() => setHoveredMember(i)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg mb-4"
                    style={{ background: `linear-gradient(135deg, ${member.color}cc, ${member.color})` }}>
                    {member.initials}
                  </div>

                  <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: member.color }}>{member.prev}</div>
                  <h3 className="font-semibold text-slate-900 mb-0.5" style={{ fontSize: '16px' }}>{member.name}</h3>
                  <div className="text-xs text-slate-400 mb-3 font-medium">{member.role}</div>
                  <p className="text-slate-500 leading-relaxed mb-4" style={{ fontSize: '13px' }}>{member.bio}</p>

                  {/* Social */}
                  <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid rgba(219,234,254,0.6)' }}>
                    <a href={member.links.linkedin} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors duration-200">
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                    <a href={member.links.twitter} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors duration-200">
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="relative rounded-3xl p-12 text-center overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)' }}>
              {/* Orbs */}
              <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
              <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

              {/* Grid */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                  <span className="text-xs font-semibold text-blue-200 uppercase tracking-widest">Ready to start?</span>
                </div>

                <h2 className="text-white mb-4" style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 50px)', lineHeight: 1.15, fontWeight: 600 }}>
                  Your next offer starts <em style={{ fontStyle: 'italic', color: '#93c5fd' }}>here.</em>
                </h2>
                <p className="text-blue-200 mb-8 max-w-xl mx-auto leading-relaxed" style={{ fontSize: '16px' }}>
                  Join 12,000+ candidates who chose to walk into their interviews prepared, confident, and ready.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/signup"
                    className="cta-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-slate-900 text-sm bg-white">
                    Get started free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/services"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-white text-sm transition-all duration-200 hover:bg-white/10"
                    style={{ border: '1.5px solid rgba(255,255,255,0.25)' }}>
                    View services
                  </Link>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
      <StandardFooter />

      {/* Bottom padding */}
      <div className="h-12" />
    </main>
  );
}