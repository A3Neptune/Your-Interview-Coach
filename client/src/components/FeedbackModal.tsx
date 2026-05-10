"use client";

import { X, MessageSquarePlus } from "lucide-react";
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal — bottom sheet on mobile, centered on sm+ */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-50 w-full sm:max-w-md
                       bottom-0 left-0 right-0 rounded-t-2xl
                       sm:bottom-auto sm:top-1/2 sm:left-1/2
                       sm:-translate-x-1/2 sm:-translate-y-1/2
                       sm:rounded-2xl
                       max-h-[90dvh] overflow-y-auto"
            style={{
              background: "#F8F6F1",
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow: "0 24px 60px -12px rgba(15,23,42,0.22), 0 4px 16px rgba(15,23,42,0.08)",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            {/* Drag handle (mobile only) */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "rgba(15,23,42,0.08)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <MessageSquarePlus className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 leading-tight">Send Feedback</h2>
                  <p className="text-[11px] text-slate-400 font-medium">Help us improve</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <div className="px-5 py-5">
              <FeedbackForm onClose={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
