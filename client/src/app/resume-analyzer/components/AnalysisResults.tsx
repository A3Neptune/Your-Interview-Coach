"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Zap,
  ArrowLeft,
  Calendar,
} from "lucide-react";

interface AnalysisData {
  "ATS Score"?: number;
  Breakdown?: {
    structure: number;
    keywords: number;
    clarity: number;
    sections: number;
    relevance: number;
  };
  Explanation?: string;
  "Section Availability"?: Record<string, boolean>;
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

function ScoreCircle({ score }: { score: number }) {
  const isGood = score >= 80;
  const isOk = score >= 60;

  const getColor = () => {
    if (isGood) return "text-green-600";
    if (isOk) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradient = () => {
    if (isGood) return "from-green-500 to-green-600";
    if (isOk) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  return (
    <div className="relative w-32 h-32 mx-auto">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-50 to-white flex items-center justify-center border border-blue-200">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-blue-100"
          />
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeDasharray={`${(score / 100) * 364.42} 364.42`}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="gradient">
              <stop
                offset="0%"
                className={`stop-${getGradient().split(" ")[1]}`}
              />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-4xl font-bold ${getColor()}`}>{score}</span>
          <span className="text-sm text-gray-500">/ 100</span>
        </div>
      </div>
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
  const sectionAvailability = data["Section Availability"] || {};
  const issues = data["Issues List"] || [];
  const resumeSummary = data["Resume Summary"] || "";
  const improvements = data["Improvement Suggestions"] || [];
  const interviewQA = data["Interview Questions with Answers"] || [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={onNewAnalysis}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Run Resume Screening Again
      </button>

      {/* Main Results Card */}
      <div className="bg-white border border-blue-200 rounded-2xl p-8 mb-8">
        {/* Score Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col items-center justify-center">
            <ScoreCircle score={atsScore} />
            <p className="text-center text-gray-300 mt-6 text-sm">
              Your resume is <strong>ATS-friendly</strong> and ready for
              screening
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Score Breakdown
            </h2>
            <div className="space-y-3">
              {breakdownEntries.map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700 capitalize">{key}</span>
                    <span className={`font-semibold ${getScoreColor(value)}`}>
                      {value}/20
                    </span>
                  </div>
                  <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        value >= 16
                          ? "bg-green-500"
                          : value >= 12
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${value * 5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-gray-700">{explanation}</p>
        </div>
      </div>

      {/* Resume Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Resume Summary
        </h3>
        <p className="text-gray-700">{resumeSummary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Section Availability */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Section Availability
          </h3>
          <div className="space-y-3">
            {Object.entries(sectionAvailability).map(([section, available]) => (
              <div
                key={section}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
              >
                <span className="text-gray-700">{section}</span>
                {available ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Issues */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            Issues Found
          </h3>
          {issues.length > 0 ? (
            <ul className="space-y-2">
              {issues.map((issue, index) => (
                <li
                  key={index}
                  className="text-gray-700 flex items-start gap-2 p-2"
                >
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-green-600">No major issues found!</p>
          )}
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600" />
          Improvement Suggestions
        </h3>
        <div className="space-y-3">
          {improvements.map((suggestion, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border-l-4 border-purple-600"
            >
              <p className="text-gray-700">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Prep Section */}
      {interviewQA.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Interview Preparation
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Based on your resume, here are questions you might encounter:
          </p>
          <div className="space-y-3">
            {interviewQA.map((qa, index) => (
              <div
                key={index}
                className="border border-blue-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedQuestion(
                      expandedQuestion === index ? null : index,
                    )
                  }
                  className="w-full p-4 bg-white hover:bg-blue-50 transition-colors text-left flex items-start justify-between"
                >
                  <span className="text-slate-900 font-medium flex-1">
                    {qa.Question}
                  </span>
                  <span className="text-gray-500 ml-4">
                    {expandedQuestion === index ? "−" : "+"}
                  </span>
                </button>
                {expandedQuestion === index && (
                  <div className="p-4 bg-blue-50 border-t border-blue-200">
                    <p className="text-gray-700">{qa.Answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Improved Resume Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-center border border-blue-500/50">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-500/30 p-3 rounded-2xl">
              <BookOpen className="w-6 h-6 text-blue-200" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Optimize Your Resume
          </h3>
          <p className="text-blue-100 mb-6 text-sm">
            Get 1-on-1 guidance from career coaches to improve your resume based
            on this analysis
          </p>
          <Link
            href="https://www.yourinterviewcoach.in/select-slot?serviceId=resumeAnalysis"
            target="_blank"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            Book Optimization Session
          </Link>
        </div>

        {/* Interview Tips Card */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-8 text-center border border-purple-500/50">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-500/30 p-3 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-purple-200" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Interview Preparation
          </h3>
          <p className="text-purple-100 mb-6 text-sm">
            Practice with expert mentors and ace your interviews with confidence
          </p>
          <Link
            href="https://www.yourinterviewcoach.in/select-slot?serviceId=webinars"
            target="_blank"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            Book Interview Session
          </Link>
        </div>
      </div>

      {/* File Info */}
      <div className="text-center text-gray-600 pb-8">
        <p className="text-sm">Analyzed file: {fileName}</p>
      </div>
    </div>
  );
}
