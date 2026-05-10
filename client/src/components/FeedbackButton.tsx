"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import FeedbackModal from "./FeedbackModal";

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="Send Feedback"
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 pl-3.5 pr-4 py-2.5 rounded-full text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all group"
        style={{
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          boxShadow: "0 8px 24px rgba(37,99,235,0.30)",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(37,99,235,0.38)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(37,99,235,0.30)";
        }}
      >
        <MessageSquarePlus size={18} className="shrink-0 group-hover:scale-110 transition-transform" />
        <span>Feedback</span>
      </button>

      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
