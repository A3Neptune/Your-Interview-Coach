"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";
import ResumeUpload from "./components/ResumeUpload";
import AnalysisResults from "./components/AnalysisResults";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  Zap,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Shield,
  Target,
  CalendarDays,
  AlertTriangle,
  Sparkles,
  Lock,
  Rocket,
  Lightbulb,
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
    impact?: number;
  };
  scoreLevel?: string;
  strictEvaluation?: {
    topMncReadiness?: string;
    scoreReason?: string;
    strongSignals?: string[];
    weakSignals?: string[];
  };
  Explanation?: string;
  "Section Availability"?: Record<string, string | boolean>;
  "Issues List"?: string[];
  "Resume Summary"?: string;
  "Improvement Suggestions"?: string[];
  "Interview Questions with Answers"?: Array<{
    Question: string;
    Answer: string;
  }>;
}

/* ─── Intersection observer hook ─────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
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
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Coaching Banner ─────────────────────────────────────── */
function CoachingBanner({ score }: { score: number }) {
  const isLow = score < 60;
  const isMid = score >= 60 && score < 80;
  if (!isLow && !isMid) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 mb-10 mt-12">
      <div
        className={`relative overflow-hidden rounded-3xl border ${
          isLow ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 p-8 lg:p-10">
          <div className="flex items-center gap-4 flex-shrink-0">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isLow ? "bg-red-100" : "bg-blue-100"}`}
            >
              {isLow ? (
                <AlertTriangle className="w-8 h-8 text-red-600" />
              ) : (
                <Sparkles className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <div>
              <p
                className={`text-sm font-bold tracking-wider uppercase mb-1 ${isLow ? "text-red-600" : "text-blue-600"}`}
              >
                Your Score
              </p>
              <p
                className={`text-4xl font-bold leading-none ${isLow ? "text-red-700" : "text-blue-700"}`}
              >
                {score}
                <span className="text-lg font-semibold">/100</span>
              </p>
            </div>
          </div>
          <div className="flex-1">
            <h3
              className={`text-2xl font-bold mb-2 leading-tight ${isLow ? "text-red-900" : "text-blue-900"}`}
            >
              {isLow
                ? "This score needs attention"
                : "Great effort — get over the 80 line"}
            </h3>
            <p
              className={`text-base leading-relaxed mb-4 ${isLow ? "text-red-700" : "text-blue-700"}`}
            >
              {isLow
                ? "With expert guidance, we can transform your resume and unlock the right opportunities."
                : 'A few targeted improvements can push you into the "no-filter" zone with top companies.'}
            </p>
            <div className="flex gap-3">
              <Link
                href="/services"
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 ${
                  isLow
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <CalendarDays className="w-5 h-5" />
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      const response = await fetch(
        "https://kp-resume-screening-service.vercel.app/",
        {
          method: "POST",
          body: formData,
        },
      );
      if (!response.ok) throw new Error("Failed to analyze resume");
      
      const jsonResponse = await response.json();
      const data: AnalysisData = {
        "ATS Score": jsonResponse.atsScore,
        scoreLevel: jsonResponse.scoreLevel,
        Breakdown: jsonResponse.breakdown,
        strictEvaluation: jsonResponse.strictEvaluation,
        Explanation: jsonResponse.strictEvaluation?.scoreReason || "",
        "Section Availability": jsonResponse.sectionAvailability,
        "Issues List": jsonResponse.issues || [],
        "Resume Summary": jsonResponse.resumeSummary || "",
        "Improvement Suggestions": jsonResponse.improvementSuggestions || [],
        "Interview Questions with Answers": (jsonResponse.interviewQuestionsWithAnswers || []).map((q: any) => ({
          Question: q.question,
          Answer: q.answer
        }))
      };
      
      setAnalysisData(data);
      
      // Save the analysis to the backend so the admin can see it
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("authToken");
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      fetch(`${API_URL}/resume-analysis/public/record`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          atsScore: jsonResponse.atsScore,
          publicUrl: jsonResponse.publicUrl || jsonResponse.uploadedFile?.url,
          fileName: file.name
        }),
      }).catch(err => console.error("Failed to save analysis to backend:", err));
      
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
    <div className="font-sans min-h-screen overflow-x-hidden">
      <Navbar />

      <style jsx global>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-slide {
          animation: fadeSlide 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      {analysisData ? (
        /* ── RESULTS VIEW ────────────────────────────────────── */
        <main>
          <CoachingBanner score={resolvedScore} />
          <AnalysisResults
            data={analysisData}
            fileName={fileName}
            onNewAnalysis={() => setAnalysisData(null)}
          />
        </main>
      ) : (
        <>
          {/* ══════════════════════════════════════════════════════
              PREMIUM UPLOAD SECTION - WHITE & BLUE THEME
          ══════════════════════════════════════════════════════ */}
          <section className="relative min-h-[calc(100vh-80px)] bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center py-20 px-4 overflow-hidden">
            {/* Premium background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Gradient orbs */}
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-blue-200/50 to-transparent rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-blue-100/40 to-transparent rounded-full blur-3xl" />

              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(59,130,246,1) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            <div className="relative z-10 w-full max-w-3xl">
              {/* Premium container with card effect */}
              <div className="rounded-3xl bg-white shadow-2xl overflow-hidden border border-blue-100">
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400" />

                <div className="p-8 md:p-12 space-y-8">
                  {/* Content section */}
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-600">
                        AI-Powered Resume Analysis
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mx-auto">
                      Upload your resume and get instant AI-powered ATS
                      analysis. See your score, identify weak areas, and get
                      actionable recommendations to land your dream job.
                    </p>
                  </div>

                  {/* Upload Component */}
                  <div>
                    <ResumeUpload
                      onAnalysis={handleAnalysis}
                      loading={loading}
                      isLoggedIn={isLoggedIn}
                    />
                  </div>

                  {/* Features Grid */}
                  <div className="pt-6 border-t border-blue-100">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        {
                          icon: Zap,
                          label: "1 min.",
                          desc: "Instant analysis",
                        },
                        {
                          icon: Target,
                          label: "ATS Score",
                          desc: "Know your ranking",
                        },
                        {
                          icon: CheckCircle2,
                          label: "100% Free",
                          desc: "",
                        },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={i} className="text-center py-2">
                            <Icon className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                            <p className="font-semibold text-gray-900 text-sm">
                              {item.label}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {item.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust indicators below card */}
              <div className="mt-8 flex items-center justify-center gap-6 text-center text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Secure & Private</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>5000+ Analyzed</span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <StandardFooter />
    </div>
  );
}
