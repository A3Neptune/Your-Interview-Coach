"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import StandardFooter from "@/components/StandardFooter";
import ResumeUpload from "./components/ResumeUpload";
import AnalysisResults from "./components/AnalysisResults";
import { useAuth } from "@/context/AuthContext";
import { Upload } from "lucide-react";

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
    try {
      return JSON.parse(value) as AnalysisData;
    } catch {
      return null;
    }
  };

  // 1) Direct JSON response
  const direct = tryParse(trimmed);
  if (direct) return direct;

  // 2) JSON wrapped in Markdown fences
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  const fromUnfenced = tryParse(unfenced);
  if (fromUnfenced) return fromUnfenced;

  // 3) Extract JSON from inside any fenced block
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    const fromFenceBlock = tryParse(fencedMatch[1].trim());
    if (fromFenceBlock) return fromFenceBlock;
  }

  // 4) Fallback: parse between first "{" and last "}"
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const fromBraces = tryParse(trimmed.slice(firstBrace, lastBrace + 1));
    if (fromBraces) return fromBraces;
  }

  throw new Error("Invalid analysis response format");
}

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

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-20 pb-12">
        {!analysisData ? (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
                  <Upload className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Resume Screening
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Get instant feedback on your resume with AI-powered analysis
              </p>
              <p className="text-gray-500">
                Upload your resume and receive detailed insights on ATS
                compatibility, keywords, and improvement suggestions
              </p>
            </div>

            {/* Upload Component */}
            <ResumeUpload
              onAnalysis={handleAnalysis}
              loading={loading}
              isLoggedIn={isLoggedIn}
            />

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">92+</div>
                <p className="text-slate-800 font-medium">ATS Score</p>
                <p className="text-gray-600 text-sm mt-2">
                  Get your ATS compatibility score
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  Instant
                </div>
                <p className="text-slate-800 font-medium">Analysis</p>
                <p className="text-gray-600 text-sm mt-2">
                  Get results in seconds
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  10+
                </div>
                <p className="text-slate-800 font-medium">Insights</p>
                <p className="text-gray-600 text-sm mt-2">
                  Detailed improvement suggestions
                </p>
              </div>
            </div>
          </div>
        ) : (
          <AnalysisResults
            data={analysisData}
            fileName={fileName}
            onNewAnalysis={() => setAnalysisData(null)}
          />
        )}
      </main>

      <StandardFooter />
    </div>
  );
}
