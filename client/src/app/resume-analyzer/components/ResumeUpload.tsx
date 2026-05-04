"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  File,
  Loader,
  LogIn,
  CheckCircle2,
  Shield,
  Zap,
} from "lucide-react";

interface ResumeUploadProps {
  onAnalysis: (file: File) => void;
  loading: boolean;
  isLoggedIn: boolean;
}

export default function ResumeUpload({
  onAnalysis,
  loading,
  isLoggedIn,
}: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setSelectedFile(file);
      } else {
        alert("Please upload a PDF file");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleSubmit = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    if (selectedFile) {
      onAnalysis(selectedFile);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 cursor-pointer group ${
            isDragging
              ? "border-blue-500 bg-blue-100"
              : "border-blue-300 bg-white"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div
                className={`p-4 rounded-2xl transition-all duration-300 ${isDragging ? "bg-blue-200 scale-110" : "bg-gradient-to-br from-blue-100 to-purple-100"}`}
              >
                <Upload
                  className={`w-8 h-8 transition-all ${isDragging ? "text-blue-700" : "text-blue-600"}`}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Drop your resume here
              </h3>
              <p className="text-gray-600 text-sm">
                or click to browse (PDF format only)
              </p>
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 cursor-pointer rounded-3xl"
            disabled={loading}
          />
        </div>

        {/* Selected File */}
        {selectedFile && (
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-300 flex items-center justify-between group hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-200 rounded-lg">
                <File className="w-5 h-5 text-blue-700" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">Ready to analyze</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
              disabled={loading}
            >
              ✕
            </button>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || loading}
          className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-lg ${
            !selectedFile || loading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Analyzing your resume...
            </>
          ) : !isLoggedIn ? (
            <>
              <LogIn className="w-5 h-5" />
              Sign in to continue
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Get Your ATS Score
            </>
          )}
        </button>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
          {[
            { icon: Shield, label: "Secure" },
            { icon: Zap, label: "1 min." },
            { icon: CheckCircle2, label: "Free" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center gap-1 text-center"
              >
                <Icon className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600 font-medium">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm shadow-2xl border border-blue-200">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-2xl">
                  <LogIn className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Sign in Required
              </h3>
              <p className="text-gray-600 text-center text-sm mb-6">
                Create an account to get your personalized resume analysis
              </p>

              <div className="space-y-3">
                <Link
                  href="/login?redirect=/resume-analyzer"
                  className="block w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl text-center hover:shadow-lg hover:bg-blue-700 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block w-full py-3 px-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl text-center hover:bg-blue-50 transition-all"
                >
                  Create Account
                </Link>
              </div>

              <button
                onClick={() => setShowLoginPrompt(false)}
                className="w-full mt-4 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
