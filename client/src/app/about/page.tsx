"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  Sparkles,
  Target,
  MessageSquare,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";

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

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

const stats = [
  { value: "12+", label: "Years corporate experience", icon: Award },
  { value: "5,000+", label: "Candidates trained", icon: Users },
  { value: "94%", label: "Interview success rate", icon: TrendingUp },
];

const focusAreas = [
  { icon: Target,        title: "Structure your answers",      desc: "Crisp, logical responses that stick.",          accent: "#2563eb", bg: "#dbeafe" },
  { icon: MessageSquare, title: "Communicate with confidence", desc: "Turn nerves into clarity under pressure.",       accent: "#0891b2", bg: "#cffafe" },
  { icon: BrainCircuit,  title: "Think on your feet",          desc: "Handle curveballs without losing your thread.", accent: "#7c3aed", bg: "#ede9fe" },
];

const differentiators = [
  "Real corporate exposure from Tech Mahindra & IndiaMART",
  "Worked directly alongside business leaders",
  "Understands exactly what hiring panels look for",
  "No scripted answers. No generic tips.",
];

export default function WhyMePage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,400&display=swap");
        * { box-sizing: border-box; }
        @keyframes fade-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float-orb { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-14px)} }
        .orb { animation: float-orb 10s ease-in-out infinite; }
        .hero-in { animation: fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .value-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .value-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(37,99,235,0.1); }
        .cta-btn { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,0.35); }
      `}</style>

      {/* ── HERO ── */}
      <section className="relative flex items-center justify-center pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb absolute top-[12%] left-[10%] w-72 h-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)" }} />
          <div className="orb absolute bottom-[10%] right-[8%] w-80 h-80 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(8,145,178,0.08) 0%, transparent 70%)", animationDelay: "-4s" }} />
          <div className="absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: "linear-gradient(#2563eb 1px,transparent 1px),linear-gradient(90deg,#2563eb 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="hero-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{ background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(147,197,253,0.5)", animationDelay: "0ms" }}>
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-widest">Why Me?</span>
          </div>

          <h1 className="hero-in mb-5" style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(36px, 6vw, 70px)", lineHeight: 1.1, animationDelay: "80ms" }}>
            <span style={{ fontWeight: 300, color: "#0f172a" }}>I've been </span>
            <em style={{ fontWeight: 600, color: "#1d4ed8", fontStyle: "italic" }}>inside</em>
            <span style={{ fontWeight: 300, color: "#0f172a" }}> the room<br />you're preparing for.</span>
          </h1>

          <p className="hero-in text-slate-500 max-w-xl mx-auto leading-relaxed mb-10"
            style={{ fontSize: "17px", animationDelay: "180ms" }}>
            12+ years of real corporate experience. 5,000+ candidates trained. One truth I keep seeing: most people don't fail because they're unqualified — they fail because they don't know how to present what they know.
          </p>

          <div className="hero-in flex flex-col sm:flex-row items-center justify-center gap-3" style={{ animationDelay: "280ms" }}>
            <Link href="/signup" className="cta-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb)" }}>
              Start preparing <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium text-slate-600 text-sm border border-blue-200 hover:bg-blue-50 transition-all duration-200">
              Explore services
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #F8F6F1)" }} />
      </section>

      {/* ── STATS ── */}
      <section className="py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="rounded-2xl p-6 text-center"
                    style={{ background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(219,234,254,0.7)", boxShadow: "0 2px 16px rgba(37,99,235,0.05)" }}>
                    <Icon className="w-4 h-4 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-900 mb-0.5" style={{ fontFamily: "'Fraunces', serif" }}>{s.value}</div>
                    <div className="text-xs text-slate-400 font-medium leading-snug">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FOCUS AREAS ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="mb-10">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
              <span className="w-5 h-px bg-blue-400 inline-block" /> Where I help you
            </span>
            <h2 className="text-slate-900" style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 600, lineHeight: 1.2 }}>
              Three things that change outcomes.
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-4">
            {focusAreas.map((v, i) => {
              const Icon = v.icon;
              return (
                <FadeUp key={i} delay={i * 80}>
                  <div className="value-card rounded-2xl p-6 h-full"
                    style={{ background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(219,234,254,0.6)", boxShadow: "0 2px 16px rgba(37,99,235,0.04)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: v.bg }}>
                      <Icon className="w-5 h-5" style={{ color: v.accent }} />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1.5 text-sm">{v.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES ME DIFFERENT ── */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="rounded-2xl p-8 relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid rgba(219,234,254,0.7)", boxShadow: "0 4px 24px rgba(37,99,235,0.06)" }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ background: "linear-gradient(90deg, #1d4ed8, #0891b2, #7c3aed)" }} />

              <div className="grid md:grid-cols-2 gap-8 items-center pt-2">
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3 block">Background</span>
                  <h3 className="text-slate-900 mb-3" style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 600, lineHeight: 1.3 }}>
                    Corporate experience,<br />
                    <em style={{ color: "#2563eb", fontStyle: "italic" }}>not</em> classroom theory.
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Trained at Tech Mahindra and IndiaMART. Worked alongside business leaders. Seen what panels actually look for — and what consistently makes candidates miss the mark.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {differentiators.map((point, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="relative rounded-2xl p-10 text-center overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" }}>
              <div className="absolute top-0 left-0 w-56 h-56 rounded-full opacity-15 pointer-events-none"
                style={{ background: "radial-gradient(circle, #60a5fa 0%, transparent 70%)", transform: "translate(-30%,-30%)" }} />
              <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full opacity-10 pointer-events-none"
                style={{ background: "radial-gradient(circle, #818cf8 0%, transparent 70%)", transform: "translate(30%,30%)" }} />

              <div className="relative z-10">
                <h2 className="text-white mb-3"
                  style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 600, lineHeight: 1.2 }}>
                  Your next offer starts{" "}
                  <em style={{ fontStyle: "italic", color: "#93c5fd" }}>here.</em>
                </h2>
                <p className="text-blue-200 mb-7 max-w-md mx-auto text-sm leading-relaxed">
                  Practical prep. Real techniques. No fluff.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/signup" className="cta-btn inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-slate-900 text-sm bg-white">
                    Get started free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/services" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-medium text-white text-sm hover:bg-white/10 transition-all duration-200"
                    style={{ border: "1.5px solid rgba(255,255,255,0.2)" }}>
                    View services
                  </Link>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <StandardFooter />
    </main>
  );
}