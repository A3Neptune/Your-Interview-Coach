"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackForm from "./FeedbackForm";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(13,17,23,0.4)" }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-xl z-50 w-full max-w-md mx-4 overflow-hidden"
            style={{
              background: "#f7f4ef",
              border: "1px solid rgba(13,17,23,0.09)"
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "rgba(13,17,23,0.09)" }}>
              <h2 className="text-lg font-semibold" style={{ color: "#0d1117" }}>Send Feedback</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg transition-colors"
                style={{
                  color: "#374151",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(13,17,23,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <FeedbackForm onClose={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
