"use client";

import { useState } from "react";
import { Send, Star, Check } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

type FeedbackType = "bug" | "feature-request" | "general" | "other";

interface FeedbackFormProps {
  onClose?: () => void;
}

export default function FeedbackForm({ onClose }: FeedbackFormProps) {
  const [type, setType] = useState<FeedbackType>("general");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const response = await axios.post(`${API_URL}/feedback`, {
        type,
        message: message.trim(),
        rating: rating || null,
        page: typeof window !== "undefined" ? window.location.pathname : "/",
        email: email.trim(),
      });

      if (response.data.success) {
        toast.success("Thank you for your feedback! We'll review it shortly.");
        setSubmitted(true);
        setTimeout(() => {
          setMessage("");
          setRating(0);
          setEmail("");
          setType("general");
          setSubmitted(false);
          onClose?.();
        }, 2000);
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(26,59,204,0.1)" }}>
          <Check className="w-7 h-7" style={{ color: "#1a3bcc" }} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: "#0d1117" }}>Thank You!</h3>
        <p className="text-sm" style={{ color: "#374151" }}>Your feedback has been received and will be reviewed by our team.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type Selection */}
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: "#0d1117" }}>
          Feedback Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["general", "bug", "feature-request", "other"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className="py-2 px-3 rounded-lg text-xs font-medium transition-all border"
              style={{
                color: type === t ? "#1a3bcc" : "#374151",
                background: type === t ? "rgba(26,59,204,0.08)" : "transparent",
                borderColor: type === t ? "rgba(26,59,204,0.2)" : "rgba(13,17,23,0.09)",
              }}
            >
              {t === "feature-request" ? "Feature Request" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold mb-3" style={{ color: "#0d1117" }}>
          Rating (Optional)
        </label>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRating(r)}
              className="transition-transform hover:scale-125"
            >
              <Star
                size={20}
                fill={r <= rating ? "#c9a84c" : "none"}
                color={r <= rating ? "#c9a84c" : "rgba(13,17,23,0.15)"}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: "#0d1117" }}>
          Email <span style={{ color: "#1a3bcc" }}>*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-3 py-2 rounded-lg text-sm border transition-all focus:outline-none"
          style={{
            background: "rgba(13,17,23,0.02)",
            color: "#0d1117",
            borderColor: "rgba(13,17,23,0.09)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#1a3bcc";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,59,204,0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(13,17,23,0.09)";
            e.currentTarget.style.boxShadow = "none";
          }}
          required
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: "#0d1117" }}>
          Your Feedback <span style={{ color: "#1a3bcc" }}>*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you think..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg text-sm border transition-all focus:outline-none resize-none"
          style={{
            background: "rgba(13,17,23,0.02)",
            color: "#0d1117",
            borderColor: "rgba(13,17,23,0.09)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#1a3bcc";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,59,204,0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(13,17,23,0.09)";
            e.currentTarget.style.boxShadow = "none";
          }}
          required
        />
        <p className="text-xs mt-2" style={{ color: "#374151" }}>
          {message.length}/500 characters
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 font-medium rounded-lg transition-all text-sm"
            style={{ color: "#374151" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(13,17,23,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2"
          style={{
            background: "#1a3bcc",
            color: "#fff",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0f2799";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(26,59,204,0.28)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#1a3bcc";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Send
            </>
          )}
        </button>
      </div>
    </form>
  );
}
