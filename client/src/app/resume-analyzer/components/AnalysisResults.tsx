"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  AlertCircle,
  Zap,
  ArrowLeft,
  Calendar,
  BarChart3,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface AnalysisData {
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

interface AnalysisResultsProps {
  data: AnalysisData;
  fileName: string;
  onNewAnalysis: () => void;
}

function ScoreGauge({
  score,
  scoreLevel,
}: {
  score: number;
  scoreLevel?: string;
}) {
  const getStatus = () => {
    if (score >= 85)
      return {
        label: scoreLevel || "Excellent",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
      };
    if (score >= 75)
      return {
        label: scoreLevel || "Great",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
      };
    if (score >= 65)
      return {
        label: scoreLevel || "Good",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    return {
      label: scoreLevel || "Needs Work",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    };
  };

  const status = getStatus();
  const percentage = (score / 100) * 360;

  return (
    <div
      className={`${status.bg} border ${status.border} rounded-3xl p-8 text-center`}
    >
      <div className="relative w-40 h-40 mx-auto mb-6">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeDasharray={`${percentage * 2.51} 565`}
            transform="rotate(-90 100 100)"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-5xl font-bold ${status.color}`}>{score}</div>
          <div className="text-sm text-gray-600">/ 100</div>
        </div>
      </div>
      <h3 className={`text-2xl font-bold ${status.color}`}>{status.label}</h3>
      <p className="text-gray-600 text-sm mt-2">ATS Compatibility Score</p>
    </div>
  );
}

export default function AnalysisResults({
  data,
  fileName,
  onNewAnalysis,
}: AnalysisResultsProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const atsScore = data["ATS Score"] ?? 92;
  const breakdown: NonNullable<AnalysisData["Breakdown"]> = data.Breakdown ?? {
    structure: 0,
    keywords: 0,
    clarity: 0,
    sections: 0,
    relevance: 0,
  };
  const breakdownEntries = Object.entries(breakdown) as Array<[string, number]>;
  const explanation = data.Explanation || "";
  const strictEvaluation = data.strictEvaluation;
  const sectionAvailability = data["Section Availability"] || {};
  const issues = data["Issues List"] || [];
  const resumeSummary = data["Resume Summary"] || "";
  const improvements = data["Improvement Suggestions"] || [];
  const interviewQA = data["Interview Questions with Answers"] || [];

  const mncReadinessColor =
    strictEvaluation?.topMncReadiness === "High"
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : strictEvaluation?.topMncReadiness === "Medium"
        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
        : "bg-red-500/20 text-red-400 border-red-500/30";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={onNewAnalysis}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors font-medium group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Analyze Another Resume
        </button>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Score Card */}
          <div className="lg:col-span-1">
            <ScoreGauge score={atsScore} scoreLevel={data.scoreLevel} />
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analysis Summary */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 border border-slate-600 shadow-xl">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  Analysis Summary
                </h2>
                {strictEvaluation?.topMncReadiness && (
                  <div
                    className={`px-4 py-1.5 rounded-full border text-sm font-bold shadow-sm flex items-center gap-2 ${mncReadinessColor}`}
                  >
                    MNC Readiness: {strictEvaluation.topMncReadiness}
                  </div>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                {explanation}
              </p>
              <p className="text-gray-500 text-sm mt-6 pt-6 border-t border-slate-600">
                📄 File:{" "}
                <span className="text-gray-300 font-medium">{fileName}</span>
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 border border-slate-600 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                Score Breakdown
              </h3>
              <div className="space-y-5">
                {breakdownEntries.map(([key, value]) => {
                  const isImpact = key.toLowerCase() === "impact";
                  const max = isImpact ? 10 : 20;
                  const percentage = (value / max) * 100;
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 capitalize font-medium">
                          {key}
                        </span>
                        <span className="text-lg font-bold text-blue-400">
                          {value}/{max}
                        </span>
                      </div>
                      <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 rounded-full ${
                            percentage >= 80
                              ? "bg-gradient-to-r from-green-500 to-emerald-400"
                              : percentage >= 60
                                ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                                : "bg-gradient-to-r from-red-500 to-pink-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Resume Summary */}
        {resumeSummary && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 border border-slate-600 shadow-xl mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Resume Summary
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              {resumeSummary}
            </p>
          </div>
        )}

        {/* Evaluation Signals */}
        {strictEvaluation &&
          ((strictEvaluation.strongSignals?.length ?? 0) > 0 ||
            (strictEvaluation.weakSignals?.length ?? 0) > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {strictEvaluation.strongSignals &&
                strictEvaluation.strongSignals.length > 0 && (
                  <div className="bg-gradient-to-br from-emerald-950/60 to-emerald-900/30 border border-emerald-500/30 rounded-3xl p-8 shadow-xl">
                    <h3 className="text-xl font-bold text-emerald-300 mb-5 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6" />
                      Strong Signals
                    </h3>
                    <ul className="space-y-4">
                      {strictEvaluation.strongSignals.map((signal, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-gray-100"
                        >
                          <span className="text-emerald-300 mt-1 bg-emerald-500/20 p-1 rounded-full">
                            <Zap className="w-3 h-3" />
                          </span>
                          <span className="leading-relaxed">{signal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {strictEvaluation.weakSignals &&
                strictEvaluation.weakSignals.length > 0 && (
                  <div className="bg-gradient-to-br from-rose-950/60 to-rose-900/30 border border-rose-500/30 rounded-3xl p-8 shadow-xl">
                    <h3 className="text-xl font-bold text-rose-300 mb-5 flex items-center gap-2">
                      <AlertCircle className="w-6 h-6" />
                      Weak Signals
                    </h3>
                    <ul className="space-y-4">
                      {strictEvaluation.weakSignals.map((signal, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-gray-100"
                        >
                          <span className="text-rose-300 mt-1 bg-rose-500/20 p-1 rounded-full">
                            <AlertCircle className="w-3 h-3" />
                          </span>
                          <span className="leading-relaxed">{signal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}

        {/* Section Availability */}
        {Object.keys(sectionAvailability).length > 0 && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 border border-slate-600 shadow-xl mb-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-blue-400" />
              Section Check
            </h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(sectionAvailability).map(([key, val]) => {
                const isPresent = val === "Yes" || val === true;
                return (
                  <div
                    key={key}
                    className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-semibold transition-all ${isPresent ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"}`}
                  >
                    {isPresent ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span className="capitalize">{key}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Issues and Wins */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Issues */}
          {issues.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-red-700 mb-5 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                Areas to Fix
              </h3>
              <ul className="space-y-3">
                {issues.slice(0, 4).map((issue, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <span className="text-red-600 font-bold mt-1">✕</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Wins */}
          {improvements.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-green-700 mb-5 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Quick Wins
              </h3>
              <ul className="space-y-3">
                {improvements.slice(0, 4).map((sug, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Interview Questions */}
        {interviewQA.length > 0 && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 border border-slate-600 shadow-xl mb-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              Interview Preparation
            </h3>
            <div className="space-y-3">
              {interviewQA.slice(0, 5).map((qa, i) => (
                <div
                  key={i}
                  className="border border-slate-600 rounded-2xl overflow-hidden hover:border-slate-500 transition-colors"
                >
                  <button
                    onClick={() =>
                      setExpandedQuestion(expandedQuestion === i ? null : i)
                    }
                    className="w-full p-5 hover:bg-slate-700/50 transition-colors text-left flex items-center justify-between"
                  >
                    <span className="text-gray-200 font-medium flex-1 pr-3">
                      {qa.Question}
                    </span>
                    <span className="text-blue-400 flex-shrink-0 text-xl">
                      {expandedQuestion === i ? "−" : "+"}
                    </span>
                  </button>
                  {expandedQuestion === i && (
                    <div className="p-5 bg-slate-700/30 border-t border-slate-600">
                      <p className="text-gray-300">{qa.Answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="https://www.yourinterviewcoach.in/select-slot?serviceId=resumeAnalysis"
            target="_blank"
            className="group relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white text-center hover:shadow-2xl hover:shadow-blue-500/20 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent group-hover:from-blue-400/20 transition-all" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3">Optimize Your Resume</h3>
              <p className="text-blue-100 text-sm mb-6">
                1-on-1 guidance from career experts to maximize your ATS score
              </p>
              <button className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors group-hover:scale-105 transform">
                <Calendar className="w-5 h-5" />
                Book Optimization
              </button>
            </div>
          </Link>

          <Link
            href="https://www.yourinterviewcoach.in/select-slot?serviceId=webinars"
            target="_blank"
            className="group relative bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-8 text-white text-center hover:shadow-2xl hover:shadow-purple-500/20 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent group-hover:from-purple-400/20 transition-all" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3">Interview Mastery</h3>
              <p className="text-purple-100 text-sm mb-6">
                Practice with mentors and ace your next interview with
                confidence
              </p>
              <button className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors group-hover:scale-105 transform">
                <Calendar className="w-5 h-5" />
                Book Interview Prep
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
