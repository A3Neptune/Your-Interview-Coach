// "use client";

// import { useState } from "react";
// import Navbar from "@/components/Navbar";
// import StandardFooter from "@/components/StandardFooter";
// import ResumeUpload from "./components/ResumeUpload";
// import AnalysisResults from "./components/AnalysisResults";
// import { useAuth } from "@/context/AuthContext";
// import { Upload } from "lucide-react";

// interface AnalysisData {
//   ATS_Score?: number;
//   "ATS Score"?: number;
//   Breakdown?: {
//     structure: number;
//     keywords: number;
//     clarity: number;
//     sections: number;
//     relevance: number;
//   };
//   Explanation?: string;
//   "Section Availability"?: {
//     "Professional Summary": boolean;
//     "Technical Skills": boolean;
//     "Work Experience": boolean;
//     Projects: boolean;
//     "Achievements & Leadership": boolean;
//     Education: boolean;
//   };
//   "Issues List"?: string[];
//   "Resume Summary"?: string;
//   "Improvement Suggestions"?: string[];
//   "Interview Questions with Answers"?: Array<{
//     Question: string;
//     Answer: string;
//   }>;
// }

// function parseAnalysisResponse(rawText: string): AnalysisData {
//   const trimmed = rawText.trim();

//   const tryParse = (value: string) => {
//     try {
//       return JSON.parse(value) as AnalysisData;
//     } catch {
//       return null;
//     }
//   };

//   // 1) Direct JSON response
//   const direct = tryParse(trimmed);
//   if (direct) return direct;

//   // 2) JSON wrapped in Markdown fences
//   const unfenced = trimmed
//     .replace(/^```(?:json)?\s*/i, "")
//     .replace(/\s*```$/, "")
//     .trim();
//   const fromUnfenced = tryParse(unfenced);
//   if (fromUnfenced) return fromUnfenced;

//   // 3) Extract JSON from inside any fenced block
//   const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
//   if (fencedMatch?.[1]) {
//     const fromFenceBlock = tryParse(fencedMatch[1].trim());
//     if (fromFenceBlock) return fromFenceBlock;
//   }

//   // 4) Fallback: parse between first "{" and last "}"
//   const firstBrace = trimmed.indexOf("{");
//   const lastBrace = trimmed.lastIndexOf("}");
//   if (firstBrace !== -1 && lastBrace > firstBrace) {
//     const fromBraces = tryParse(trimmed.slice(firstBrace, lastBrace + 1));
//     if (fromBraces) return fromBraces;
//   }

//   throw new Error("Invalid analysis response format");
// }

// export default function ResumeAnalyzerPage() {
//   const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [fileName, setFileName] = useState("");
//   const { isLoggedIn } = useAuth();

//   const handleAnalysis = async (file: File) => {
//     setLoading(true);
//     setFileName(file.name);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("https://kpeduresumeapi.vercel.app/", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to analyze resume");
//       }

//       const rawText = await response.text();
//       const data = parseAnalysisResponse(rawText);
//       setAnalysisData(data);
//     } catch (error) {
//       console.error("Error analyzing resume:", error);
//       alert("Failed to analyze resume. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <Navbar />

//       <main className="pt-20 pb-12">
//         {!analysisData ? (
//           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//             {/* Header Section */}
//             <div className="text-center mb-12">
//               <div className="flex justify-center mb-6">
//                 <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
//                   <Upload className="w-10 h-10 text-white" />
//                 </div>
//               </div>
//               <h1 className="text-4xl font-bold text-slate-900 mb-4">
//                 Resume Screening
//               </h1>
//               <p className="text-lg text-gray-600 mb-2">
//                 Get instant feedback on your resume with AI-powered analysis
//               </p>
//               <p className="text-gray-500">
//                 Upload your resume and receive detailed insights on ATS
//                 compatibility, keywords, and improvement suggestions
//               </p>
//             </div>

//             {/* Upload Component */}
//             <ResumeUpload
//               onAnalysis={handleAnalysis}
//               loading={loading}
//               isLoggedIn={isLoggedIn}
//             />

//             {/* Features Section */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
//               <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
//                 <div className="text-3xl font-bold text-blue-600 mb-2">92+</div>
//                 <p className="text-slate-800 font-medium">ATS Score</p>
//                 <p className="text-gray-600 text-sm mt-2">
//                   Get your ATS compatibility score
//                 </p>
//               </div>
//               <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
//                 <div className="text-3xl font-bold text-purple-600 mb-2">
//                   Instant
//                 </div>
//                 <p className="text-slate-800 font-medium">Analysis</p>
//                 <p className="text-gray-600 text-sm mt-2">
//                   Get results in seconds
//                 </p>
//               </div>
//               <div className="bg-green-50 border border-green-200 rounded-xl p-6">
//                 <div className="text-3xl font-bold text-green-600 mb-2">
//                   10+
//                 </div>
//                 <p className="text-slate-800 font-medium">Insights</p>
//                 <p className="text-gray-600 text-sm mt-2">
//                   Detailed improvement suggestions
//                 </p>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <AnalysisResults
//             data={analysisData}
//             fileName={fileName}
//             onNewAnalysis={() => setAnalysisData(null)}
//           />
//         )}
//       </main>

//       <StandardFooter />
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";
import ResumeUpload from "./components/ResumeUpload";
import AnalysisResults from "./components/AnalysisResults";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  FileText, ScanSearch, Zap, TrendingUp, CheckCircle2,
  ArrowRight, ChevronRight, Shield, Target, BarChart3,
  CalendarDays, AlertTriangle, Sparkles, Lock,
} from "lucide-react";

interface AnalysisData {
  ATS_Score?: number;
  "ATS Score"?: number;
  Breakdown?: {
    structure: number;
    keywords: number;
    clarity: number;
    sections: number;
    relevance: number;
  };
  Explanation?: string;
  "Section Availability"?: {
    "Professional Summary": boolean;
    "Technical Skills": boolean;
    "Work Experience": boolean;
    Projects: boolean;
    "Achievements & Leadership": boolean;
    Education: boolean;
  };
  "Issues List"?: string[];
  "Resume Summary"?: string;
  "Improvement Suggestions"?: string[];
  "Interview Questions with Answers"?: Array<{
    Question: string;
    Answer: string;
  }>;
}

function parseAnalysisResponse(rawText: string): AnalysisData {
  const trimmed = rawText.trim();
  const tryParse = (value: string) => {
    try { return JSON.parse(value) as AnalysisData; } catch { return null; }
  };
  const direct = tryParse(trimmed);
  if (direct) return direct;
  const unfenced = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  const fromUnfenced = tryParse(unfenced);
  if (fromUnfenced) return fromUnfenced;
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    const fromFenceBlock = tryParse(fencedMatch[1].trim());
    if (fromFenceBlock) return fromFenceBlock;
  }
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const fromBraces = tryParse(trimmed.slice(firstBrace, lastBrace + 1));
    if (fromBraces) return fromBraces;
  }
  throw new Error("Invalid analysis response format");
}

/* ─── Intersection observer hook ─────────────────────────── */
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

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function useCounter(target: number, duration = 1400, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let v = 0;
    const step = Math.ceil(target / (duration / 16));
    const id = setInterval(() => {
      v = Math.min(v + step, target);
      setCount(v);
      if (v >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [active, target, duration]);
  return count;
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const { ref, inView } = useInView(0.4);
  const n = useCounter(target, 1400, inView);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

/* ─── Coaching Banner ─────────────────────────────────────── */
function CoachingBanner({ score }: { score: number }) {
  const isLow = score < 60;
  const isMid = score >= 60 && score < 80;
  if (!isLow && !isMid) return null;

  return (
    <div className="max-w-[1120px] mx-auto px-6 mb-10">
      <div
        className={`relative overflow-hidden rounded-2xl border ${
          isLow ? "bg-[#0F172A] border-[#1A3BCC]/30" : "bg-white border-[#1A3BCC]/20"
        }`}
      >
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute -top-16 -right-16 w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${isLow ? "rgba(26,59,204,0.28)" : "rgba(26,59,204,0.07)"} 0%, transparent 70%)` }}
        />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 p-6 lg:p-8">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isLow ? "bg-red-500/15 border border-red-500/25" : "bg-amber-500/10 border border-amber-500/20"}`}>
              {isLow ? <AlertTriangle className="w-6 h-6 text-red-400" /> : <Sparkles className="w-6 h-6 text-amber-500" />}
            </div>
            <div className={`px-3 py-2 rounded-xl border ${isLow ? "bg-red-500/10 border-red-500/20" : "bg-amber-500/10 border-amber-500/20"}`}>
              <p className={`text-[10px] font-extrabold tracking-[0.08em] uppercase mb-0.5 ${isLow ? "text-red-400" : "text-amber-600"}`}>Your Score</p>
              <p className={`text-2xl font-black leading-none ${isLow ? "text-red-400" : "text-amber-500"}`}>
                {score}<span className="text-sm font-bold">/100</span>
              </p>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isLow ? "bg-red-400" : "bg-amber-500"}`} />
              <p className={`text-[11px] font-extrabold tracking-[0.1em] uppercase ${isLow ? "text-red-400" : "text-amber-500"}`}>
                {isLow ? "Neel can fix this — one session" : "Neel can push you over the line"}
              </p>
            </div>
            <h3 className={`text-lg lg:text-xl font-extrabold tracking-[-0.02em] mb-2 leading-snug ${isLow ? "text-white" : "text-[#0F172A]"}`}>
              {isLow ? "A score this low gets auto-rejected before any human sees your name." : "Good foundation — but competitive firms filter at 80+."}
            </h3>
            <p className={`text-[13.5px] leading-[1.65] max-w-[520px] ${isLow ? "text-white/50" : "text-slate-500"}`}>
              {isLow
                ? "Neel has 12+ years inside hiring rooms. He knows exactly which fixes move the needle — and in one session, you'll know too."
                : "Neel has sat in the debrief rooms where panels compare candidates. He knows what separates a 74 from a 91 — and it's always fixable."
              }
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 flex-shrink-0 w-full md:w-auto">
            <Link
              href="/services"
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-[13px] no-underline transition-all duration-200 hover:-translate-y-0.5 ${
                isLow ? "text-[#0F172A] bg-white hover:shadow-[0_8px_24px_rgba(26,59,204,0.28)]" : "text-white bg-[#1A3BCC] hover:shadow-[0_8px_24px_rgba(26,59,204,0.35)]"
              }`}
            >
              <CalendarDays className="w-4 h-4 flex-shrink-0" />
              Book a session
            </Link>
            <Link
              href="/services"
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-[13px] no-underline transition-colors duration-200 ${
                isLow ? "text-white/70 border border-white/15 hover:bg-white/[0.06]" : "text-[#1A3BCC] border border-[#1A3BCC]/25 hover:bg-[#1A3BCC]/5"
              }`}
            >
              View services <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        <div className={`border-t px-6 lg:px-8 py-3.5 flex items-center gap-6 flex-wrap ${isLow ? "border-white/[0.06]" : "border-[#1A3BCC]/[0.08]"}`}>
          {[
            { label: "12+ years inside hiring panels", icon: Shield },
            { label: "5,000+ candidates coached", icon: TrendingUp },
            { label: "94% interview-to-offer rate", icon: Target },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${isLow ? "text-[#1A3BCC]" : "text-[#1A3BCC]/60"}`} />
                <span className={`text-[12px] font-semibold ${isLow ? "text-white/40" : "text-slate-400"}`}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Static data ─────────────────────────────────────────── */
const HOW_STEPS = [
  {
    num: "01", icon: FileText, title: "Upload your resume",
    desc: "Drop in your PDF or DOCX. We read every line — just like a real ATS system would.",
    color: "text-[#1A3BCC]", bg: "bg-[#1A3BCC]/10", bar: "bg-[#1A3BCC]",
  },
  {
    num: "02", icon: ScanSearch, title: "AI scans it cold",
    desc: "No assumptions. The engine parses structure, keywords, clarity, and section completeness.",
    color: "text-violet-600", bg: "bg-violet-600/10", bar: "bg-violet-600",
  },
  {
    num: "03", icon: BarChart3, title: "Get your score & fixes",
    desc: "Receive a ranked breakdown with specific, actionable improvements — not vague advice.",
    color: "text-cyan-600", bg: "bg-cyan-600/10", bar: "bg-cyan-600",
  },
];

const CHECK_ITEMS = [
  { label: "ATS compatibility score", icon: Target },
  { label: "Keyword density & relevance", icon: ScanSearch },
  { label: "Section completeness", icon: CheckCircle2 },
  { label: "Clarity & readability", icon: FileText },
  { label: "Structure & formatting", icon: BarChart3 },
  { label: "10+ improvement suggestions", icon: TrendingUp },
  { label: "Interview question prep", icon: Zap },
  { label: "Resume summary audit", icon: Shield },
];

const TICKER = [
  "ATS Score Analysis", "✦", "Keyword Matching", "✦",
  "Section Audit", "✦", "Instant Results", "✦",
  "Improvement Suggestions", "✦", "Interview Question Prep", "✦",
  "Clarity Score", "✦",
];

/* ─── Page ────────────────────────────────────────────────── */
export default function ResumeAnalyzerPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const { isLoggedIn } = useAuth();

  const handleAnalysis = async (file: File) => {
    setLoading(true);
    setFileName(file.name);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("https://kpeduresumeapi.vercel.app/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to analyze resume");
      const rawText = await response.text();
      const data = parseAnalysisResponse(rawText);
      setAnalysisData(data);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resolvedScore = analysisData
    ? (analysisData.ATS_Score ?? analysisData["ATS Score"] ?? 0)
    : 0;

  return (
    <div className="font-[DM_Sans,sans-serif] bg-[#F8F7F3] min-h-screen overflow-x-hidden text-[#0F172A]">
      <Navbar />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400;1,9..40,700&display=swap");

        @keyframes tickerMove {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-scroll { animation: tickerMove 28s linear infinite; }
        .ticker-scroll:hover { animation-play-state: paused; }

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-in { animation: fadeSlide 0.75s cubic-bezier(0.22,1,0.36,1) both; }

        @keyframes floatDot {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .float-a { animation: floatDot 4s ease-in-out infinite; }

        @keyframes pulsering {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(26,59,204,0.3); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 14px rgba(26,59,204,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(26,59,204,0); }
        }
        .pulse-ring { animation: pulsering 2.5s infinite; }

        @keyframes bannerIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .banner-in { animation: bannerIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.35s both; }

        @keyframes shimmer {
          from { background-position: -200% 0; }
          to   { background-position: 200% 0; }
        }
        .upload-card {
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .upload-card:hover {
          border-color: rgba(26,59,204,0.3);
          box-shadow: 0 8px 40px rgba(26,59,204,0.08);
        }
      `}</style>

      {analysisData ? (
        /* ── RESULTS VIEW ────────────────────────────────────── */
        <main className="pt-20 pb-12 bg-[#F8F7F3]">
          <div className="banner-in">
            <CoachingBanner score={resolvedScore} />
          </div>
          <AnalysisResults
            data={analysisData}
            fileName={fileName}
            onNewAnalysis={() => setAnalysisData(null)}
          />
        </main>
      ) : (
        <>
          {/* ── HERO + UPLOAD (combined at the top) ────────────── */}
          <section className="pt-[90px] pb-0 px-6 relative overflow-hidden bg-[#F8F7F3]">
            {/* Dot grid */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(rgba(26,59,204,0.1) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div
              className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
              style={{ background: "linear-gradient(225deg, rgba(26,59,204,0.07) 0%, transparent 60%)" }}
            />
            <div
              className="absolute bottom-0 left-0 w-[300px] h-[300px] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)" }}
            />

            <div className="max-w-[1120px] mx-auto w-full relative z-10">

              {/* ── Eyebrow ───────────────────────────────────── */}
              <div
                className="hero-in inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#1A3BCC]/25 bg-[#1A3BCC]/5 mb-8"
                style={{ animationDelay: "0ms" }}
              >
                <ScanSearch className="w-3 h-3 text-[#1A3BCC]" />
                <span className="text-[11px] font-extrabold text-[#1A3BCC] tracking-[0.12em] uppercase">
                  AI-Powered Resume Screening
                </span>
              </div>

              {/* ── Two-column: headline left, upload right ────── */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start pb-16">

                {/* LEFT — headline copy */}
                <div>
                  <div className="hero-in" style={{ animationDelay: "60ms" }}>
                    <p className="text-sm font-semibold text-slate-500 tracking-[0.04em] uppercase mb-3">
                      What the ATS sees before any human does.
                    </p>
                  </div>

                  <div className="hero-in" style={{ animationDelay: "120ms" }}>
                    <div className="text-[clamp(52px,8vw,96px)] font-black leading-none tracking-[-0.04em] text-[#0F172A] mb-6">
                      <span className="block">Know</span>
                      <span className="block text-[#1A3BCC]">your score</span>
                      <span
                        className="block font-light text-slate-400 italic tracking-[-0.02em]"
                        style={{ fontSize: "clamp(36px,5.5vw,62px)" }}
                      >
                        before they do.
                      </span>
                    </div>
                  </div>

                  <div className="hero-in" style={{ animationDelay: "200ms" }}>
                    <p className="text-[15px] text-slate-600 leading-[1.8] max-w-[420px] mb-8">
                      Upload your resume and get a detailed ATS compatibility score, keyword analysis, section audit, and 10+ specific improvements — in seconds.
                    </p>

                    {/* Trust badges */}
                    <div className="flex flex-wrap gap-4 mb-8">
                      {[
                        { icon: Shield, text: "Secure upload" },
                        { icon: Zap,    text: "Results in ~10s" },
                        { icon: Lock,   text: "No account needed" },
                      ].map(({ icon: Icon, text }, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-[#1A3BCC]/50" />
                          <span className="text-[13px] font-medium text-slate-500">{text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Mini score preview pills */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "ATS Score", color: "bg-[#1A3BCC]/10 text-[#1A3BCC] border-[#1A3BCC]/20" },
                        { label: "Keywords",  color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
                        { label: "Structure", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
                        { label: "Sections",  color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
                      ].map(({ label, color }, i) => (
                        <span key={i} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-[0.05em] ${color}`}>
                          <CheckCircle2 className="w-3 h-3" />
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stat strip */}
                  <div
                    className="hero-in flex gap-6 pt-6 mt-6 flex-wrap"
                    style={{
                      animationDelay: "300ms",
                      borderTop: "1px solid rgba(26,59,204,0.1)",
                    }}
                  >
                    {[
                      { val: "92+", label: "Avg score after fixes" },
                      { val: "10+", label: "Improvements per scan" },
                      { val: "10s", label: "Time to results" },
                    ].map(({ val, label }, i) => (
                      <div key={i}>
                        <p className="text-[clamp(22px,2.8vw,30px)] font-black text-[#0F172A] leading-none tracking-[-0.04em]">{val}</p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.1em] mt-1.5">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT — Upload card (the star of the show) */}
                <div className="hero-in" style={{ animationDelay: "260ms" }}>
                  {/* Upload label */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#1A3BCC] animate-pulse" />
                      <span className="text-[11px] font-extrabold text-[#1A3BCC] tracking-[0.1em] uppercase">
                        Upload &amp; Analyze
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400">PDF or DOCX</span>
                  </div>

                  {/* Upload component wrapper */}
                  <div
                    className="upload-card bg-white border border-[#1A3BCC]/[0.12] rounded-2xl overflow-hidden"
                    style={{ boxShadow: "0 4px 40px rgba(26,59,204,0.07), 0 1px 4px rgba(0,0,0,0.04)" }}
                  >
                    <div className="p-6">
                      <ResumeUpload onAnalysis={handleAnalysis} loading={loading} isLoggedIn={isLoggedIn} />
                    </div>

                    {/* Bottom trust strip inside card */}
                    <div
                      className="px-6 py-3.5 flex items-center justify-between flex-wrap gap-3"
                      style={{ borderTop: "1px solid rgba(26,59,204,0.07)", background: "rgba(26,59,204,0.02)" }}
                    >
                      {[
                        { icon: Shield,       label: "Encrypted" },
                        { icon: Zap,          label: "~10s results" },
                        { icon: CheckCircle2, label: "Free to use" },
                      ].map(({ icon: Icon, label }, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Icon className="w-3 h-3 text-[#1A3BCC]/50" />
                          <span className="text-[11px] font-semibold text-slate-400">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What you'll get below the card */}
                  <div className="mt-4 p-4 rounded-xl bg-[#0F172A]/[0.03] border border-[#1A3BCC]/[0.08]">
                    <p className="text-[11px] font-extrabold text-[#1A3BCC] tracking-[0.1em] uppercase mb-3">What you'll get</p>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      {[
                        "ATS compatibility score",
                        "Keyword density audit",
                        "Section completeness",
                        "10+ specific fixes",
                        "Clarity & structure score",
                        "Interview question prep",
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-[#1A3BCC] flex-shrink-0" />
                          <span className="text-[12px] text-slate-500 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── TICKER ─────────────────────────────────────────── */}
          <div className="bg-[#1A3BCC] py-3.5 overflow-hidden">
            <div className="flex whitespace-nowrap">
              <div className="ticker-scroll flex gap-9 pr-9">
                {[...TICKER, ...TICKER].map((t, i) => (
                  <span
                    key={i}
                    className={`text-[12px] tracking-[0.06em] uppercase flex-shrink-0 ${t === "✦" ? "font-normal text-white/30" : "font-bold text-white/[0.88]"}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── STATS ──────────────────────────────────────────── */}
          <section className="py-20 px-6 bg-white">
            <div className="max-w-[1120px] mx-auto">
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-[#1A3BCC]/[0.08]"
                style={{ background: "rgba(26,59,204,0.08)" }}
              >
                {[
                  { n: 92, suf: "+", label: "Avg ATS score after fixes", icon: Target, color: "text-[#1A3BCC]", bg: "bg-[#1A3BCC]/10" },
                  { n: 10, suf: "+", label: "Specific improvements per scan", icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-600/10" },
                  { n: 10, suf: "s", label: "Average time to results", icon: Zap, color: "text-cyan-600", bg: "bg-cyan-600/10" },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="bg-white p-10 lg:p-[48px_36px]">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${s.bg} mb-4`}>
                        <Icon className={`w-3 h-3 ${s.color}`} />
                        <span className={`text-[10px] font-extrabold ${s.color} uppercase tracking-[0.08em]`}>{s.label}</span>
                      </div>
                      <div className="text-[clamp(48px,7vw,80px)] font-black text-[#0F172A] leading-none tracking-[-0.04em]">
                        <Counter target={s.n} suffix={s.suf} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ───────────────────────────────────── */}
          <section id="how" className="py-24 px-6 bg-[#F8F7F3]">
            <div className="max-w-[1120px] mx-auto">
              <Reveal>
                <p className="text-[11px] font-extrabold text-[#1A3BCC] tracking-[0.1em] uppercase mb-2.5">Process</p>
                <div className="flex items-end justify-between mb-14 gap-6 flex-wrap">
                  <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold text-[#0F172A] leading-[1.1] tracking-[-0.03em] max-w-[520px]">
                    Three steps.<br />
                    <span className="font-light text-slate-500 text-[clamp(22px,3vw,38px)] italic">Brutal clarity.</span>
                  </h2>
                  <p className="text-sm text-slate-400 max-w-[280px] leading-[1.75]">
                    No signup forms. No waiting. Upload and get the unfiltered truth about your resume.
                  </p>
                </div>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {HOW_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <Reveal key={i} delay={i * 90}>
                      <div className="bg-white border border-[#1A3BCC]/[0.09] rounded-2xl p-8 h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-[#1A3BCC]/25 cursor-default">
                        <div className="absolute top-5 right-5 text-[11px] font-extrabold text-[#1A3BCC]/20 tracking-[0.08em]">{step.num}</div>
                        <div className={`w-9 h-[3px] ${step.bar} rounded-full mb-6`} />
                        <div className={`w-11 h-11 rounded-xl ${step.bg} flex items-center justify-center mb-5`}>
                          <Icon className={`w-5 h-5 ${step.color}`} />
                        </div>
                        <h3 className="text-lg font-extrabold text-[#0F172A] tracking-[-0.02em] mb-3 leading-snug">{step.title}</h3>
                        <p className="text-[13.5px] text-slate-500 leading-[1.7]">{step.desc}</p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── WHAT WE CHECK ──────────────────────────────────── */}
          <section className="py-24 px-6 bg-[#0F172A] relative overflow-hidden">
            <div
              className="absolute -top-24 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(26,59,204,0.18) 0%, transparent 70%)" }}
            />
            <div
              className="absolute -bottom-20 -left-16 w-[380px] h-[380px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,0.13) 0%, transparent 70%)" }}
            />
            <div className="max-w-[1120px] mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-16 items-center">
                <div>
                  <Reveal>
                    <p className="text-[11px] font-extrabold text-blue-400/70 tracking-[0.1em] uppercase mb-2.5">What We Audit</p>
                    <h2 className="text-[clamp(26px,3.5vw,44px)] font-extrabold text-white leading-[1.15] tracking-[-0.025em] mb-4">
                      Everything the panel.<br />
                      <span className="font-light text-white/45 italic">never tells you they checked.</span>
                    </h2>
                    <p className="text-sm text-white/40 mb-10 leading-[1.7] max-w-[440px]">
                      ATS systems are ruthless filters. Most candidates don't know what they're measuring. We do — and we'll show you exactly where you stand.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {CHECK_ITEMS.map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <Reveal key={i} delay={i * 50}>
                            <div className="group flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] hover:border-[#1A3BCC]/30 transition-all duration-200">
                              <div className="w-7 h-7 rounded-lg bg-[#1A3BCC]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1A3BCC]/30 transition-colors duration-200">
                                <Icon className="w-3.5 h-3.5 text-[#60a5fa]" />
                              </div>
                              <span className="text-[13px] font-medium text-white/75">{item.label}</span>
                            </div>
                          </Reveal>
                        );
                      })}
                    </div>
                  </Reveal>
                </div>
                <Reveal delay={80}>
                  <div className="border-l-2 border-white/[0.08] pl-8 pt-2">
                    {[
                      { num: "01", text: "ATS systems reject 75% of resumes before a human sees them" },
                      { num: "02", text: "Most rejections are for formatting issues, not qualification gaps" },
                      { num: "03", text: "Keyword matching is the single highest-weighted factor" },
                      { num: "04", text: "Our engine replicates the exact logic these systems use" },
                    ].map((pt, i) => (
                      <div key={i} className={`flex gap-4 py-5 ${i < 3 ? "border-b border-white/[0.06]" : ""}`}>
                        <span className="text-[11px] font-extrabold text-white/20 tracking-[0.06em] min-w-[22px] pt-0.5">{pt.num}</span>
                        <p className="text-sm font-medium text-white/65 leading-[1.65]">{pt.text}</p>
                      </div>
                    ))}
                    <div className="mt-6 p-5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                      <p className="text-sm font-bold text-white mb-1">Ready to find out where you stand?</p>
                      <p className="text-[13px] text-white/40 mb-4">Upload takes 10 seconds. Results take less.</p>
                      <a
                        href="#"
                        onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] font-bold text-[13px] text-[#1A3BCC] bg-white no-underline hover:bg-slate-100 transition-colors duration-200"
                      >
                        Check my resume <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ── PULL QUOTE ─────────────────────────────────────── */}
          <section className="py-20 px-6 bg-[#F8F7F3]">
            <div className="max-w-[820px] mx-auto text-center">
              <Reveal>
                <div className="w-10 h-[3px] bg-[#1A3BCC] rounded-full mx-auto mb-8" />
                <p className="text-[clamp(20px,3.5vw,36px)] font-bold text-[#0F172A] leading-[1.3] tracking-[-0.025em] mb-5">
                  "Your resume is being read by a machine first. Make sure it passes."
                </p>
                <p className="text-[13px] font-semibold text-slate-400 tracking-[0.04em] uppercase">
                  AI analysis · Instant results · Actionable fixes
                </p>
              </Reveal>
            </div>
          </section>

          {/* ── CTA ────────────────────────────────────────────── */}
          <section className="pt-[72px] pb-28 px-6 bg-[#F8F7F3]">
            <div className="max-w-[900px] mx-auto">
              <Reveal>
                <div className="rounded-[28px] p-12 lg:p-[72px_64px] bg-[#0F172A] relative overflow-hidden text-center">
                  <div
                    className="absolute inset-0 rounded-[28px] pointer-events-none"
                    style={{
                      backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                      backgroundSize: "36px 36px",
                    }}
                  />
                  <div
                    className="absolute -top-20 -left-20 w-[340px] h-[340px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(26,59,204,0.35) 0%, transparent 65%)" }}
                  />
                  <div
                    className="absolute -bottom-16 -right-16 w-[260px] h-[260px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 65%)" }}
                  />
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] mb-7">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                      <span className="text-[11px] font-extrabold text-white/70 uppercase tracking-[0.1em]">Free to use</span>
                    </div>
                    <h2 className="text-[clamp(26px,5vw,52px)] font-extrabold text-white leading-[1.1] tracking-[-0.03em] mb-3.5">
                      Stop guessing. Start knowing.
                    </h2>
                    <p className="text-[15px] text-white/45 leading-[1.7] max-w-[400px] mx-auto mb-11">
                      Upload your resume and get an honest, detailed ATS score in seconds.
                    </p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <a
                        href="#"
                        onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-extrabold text-sm text-[#0F172A] bg-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(26,59,204,0.35)]"
                      >
                        Analyze my resume <ArrowRight className="w-4 h-4" />
                      </a>
                      <a
                        href="#how"
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white/80 border border-white/[0.18] no-underline hover:bg-white/[0.06] transition-colors duration-200"
                      >
                        See how it works
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </>
      )}

      <StandardFooter />
    </div>
  );
}