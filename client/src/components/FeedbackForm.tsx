"use client";

import { useState } from "react";
import { Send, Star, Check, Bug, Lightbulb, MessageSquare, HelpCircle, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

type FeedbackType = "bug" | "feature-request" | "general" | "other";

const TYPES: { value: FeedbackType; label: string; Icon: LucideIcon }[] = [
  { value: "general",         label: "General",    Icon: MessageSquare },
  { value: "bug",             label: "Bug Report",  Icon: Bug           },
  { value: "feature-request", label: "Feature Req", Icon: Lightbulb     },
  { value: "other",           label: "Other",       Icon: HelpCircle    },
];

interface FeedbackFormProps {
  onClose?: () => void;
}

export default function FeedbackForm({ onClose }: FeedbackFormProps) {
  const [type, setType]         = useState<FeedbackType>("general");
  const [message, setMessage]   = useState("");
  const [rating, setRating]     = useState(0);
  const [hover, setHover]       = useState(0);
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) { toast.error("Please enter your feedback"); return; }
    if (!email.trim())   { toast.error("Please enter your email");    return; }

    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await axios.post(`${API_URL}/feedback`, {
        type,
        message: message.trim(),
        rating: rating || null,
        page: typeof window !== "undefined" ? window.location.pathname : "/",
        email: email.trim(),
      });
      if (res.data.success) {
        toast.success("Feedback received — thank you!");
        setSubmitted(true);
        setTimeout(() => {
          setMessage(""); setRating(0); setEmail(""); setType("general");
          setSubmitted(false);
          onClose?.();
        }, 2000);
      }
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
          <Check className="w-7 h-7 text-blue-600" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-base font-bold text-slate-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>Thank you!</p>
          <p className="text-sm text-slate-500 mt-1">We&apos;ll review your feedback shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Type */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2.5">Type</p>
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                type === value
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2.5">
          Rating <span className="normal-case font-normal text-slate-400">(optional)</span>
        </p>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRating(r)}
              onMouseEnter={() => setHover(r)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                size={22}
                fill={(hover || rating) >= r ? "#f59e0b" : "none"}
                className={(hover || rating) >= r ? "text-amber-400" : "text-slate-200"}
                strokeWidth={1.8}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">
          Email <span className="text-blue-500 normal-case font-bold">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 transition-all outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
        />
      </div>

      {/* Message */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">
          Message <span className="text-blue-500 normal-case font-bold">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 500))}
          placeholder="Tell us what you think…"
          rows={3}
          required
          className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 transition-all outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 resize-none"
        />
        <p className="text-xs text-slate-400 mt-1 text-right">{message.length}/500</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2.5 pt-1">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</>
          ) : (
            <><Send size={14} /> Send Feedback</>
          )}
        </button>
      </div>
    </form>
  );
}
