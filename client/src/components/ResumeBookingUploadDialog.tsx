"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Upload, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

type UploadedResume = {
  url: string;
  publicId: string;
  originalName: string;
  format?: string;
  bytes?: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function ResumeBookingUploadDialog({ isOpen, onClose }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (selectedFile?: File) => {
    if (!selectedFile) return;
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      toast.error("Please upload a PDF, DOC, or DOCX resume.");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("Resume file must be 10MB or smaller.");
      return;
    }
    setFile(selectedFile);
  };

  const handleUploadAndContinue = async () => {
    if (!file) {
      toast.error("Please select your resume file first.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      const redirect = encodeURIComponent("/services");
      router.push(`/login?redirect=${redirect}`);
      return;
    }

    try {
      setIsUploading(true);
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${API_URL}/upload/resume`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const uploaded: UploadedResume = res.data.data;
      localStorage.setItem(
        "resume_analysis_file",
        JSON.stringify({ ...uploaded, uploadedAt: Date.now() }),
      );
      toast.success("Resume uploaded. Choose your slot now.");
      onClose();
      router.push("/select-slot?serviceId=resumeAnalysis");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to upload resume.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => !isUploading && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 text-slate-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black">Upload your resume</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Add your resume first, then select a slot for the analysis session.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="mb-4 flex min-h-[132px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 px-4 py-5 text-center transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-60"
        >
          <Upload className="mb-3 h-7 w-7 text-blue-600" />
          <span className="text-sm font-bold text-slate-800">
            {file ? file.name : "Select resume file"}
          </span>
          <span className="mt-1 text-xs text-slate-500">
            PDF, DOC, or DOCX up to 10MB
          </span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(event) => handleFileChange(event.target.files?.[0])}
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUploadAndContinue}
            disabled={!file || isUploading}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isUploading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading
              </span>
            ) : (
              "Proceed"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
