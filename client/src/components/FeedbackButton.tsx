"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import FeedbackModal from "./FeedbackModal";

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-30 group"
        style={{
          background: "#1a3bcc",
          boxShadow: "0 6px 20px rgba(26,59,204,0.28)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#0f2799";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,59,204,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#1a3bcc";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(26,59,204,0.28)";
        }}
        title="Send Feedback"
      >
        <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
      </button>
      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
