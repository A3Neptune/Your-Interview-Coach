"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Upload, File, Loader, LogIn } from "lucide-react";

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
    <div className="max-w-2xl mx-auto">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${
          isDragging ? "border-blue-400 bg-blue-50" : "border-blue-200 bg-white"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div
              className={`p-4 rounded-full transition-colors ${
                isDragging
                  ? "bg-blue-100 text-blue-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <Upload className="w-8 h-8" />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Drop your resume here
          </h3>
          <p className="text-gray-600 mb-4">
            or click below to browse your computer
          </p>
          <p className="text-sm text-gray-500">
            Supported format: PDF (Max 10MB)
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 cursor-pointer"
          disabled={loading}
        />
      </div>

      {/* Selected File Display */}
      {selectedFile && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <File className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-slate-900 font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-600">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedFile(null)}
            className="text-gray-500 hover:text-slate-900 transition-colors"
            disabled={loading}
          >
            ✕
          </button>
        </div>
      )}

      {/* Analyze Button */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || loading}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            !selectedFile || loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50"
          }`}
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Screening your resume...
              <span>Please wait 1–2 minutes</span>
            </>
          ) : !isLoggedIn ? (
            "Login to start screening"
          ) : (
            "Start Resume Screening"
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Make sure your resume includes relevant
          keywords, clear section headings, and quantifiable achievements for
          the best analysis results.
        </p>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-2xl">
                <LogIn className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">
              Sign in to Continue
            </h3>
            <p className="text-gray-600 text-center mb-6">
              You need to be logged in to analyze your resume and get
              personalized feedback.
            </p>

            <div className="space-y-3">
              <Link
                href="/login?redirect=/resume-analyzer"
                className="block w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg text-center hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                Sign In
              </Link>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="block w-full py-3 px-4 border border-gray-300 text-slate-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                Continue as Guest
              </button>
            </div>

            <p className="text-center text-gray-600 text-sm mt-4">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
