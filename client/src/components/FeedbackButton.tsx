"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquarePlus } from "lucide-react";
import { motion } from "framer-motion";
import FeedbackModal from "./FeedbackModal";

const SIZE = 42;            // collapsed: perfect circle
const EXPANDED_W = 132;     // expanded: pill width
const ICON_PAD = (SIZE - 18) / 2; // centers icon inside collapsed circle

const SPRING = { type: "spring" as const, stiffness: 400, damping: 34 };

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const curr = window.scrollY;
        if (curr > lastScrollY.current + 6 && curr > 80) setExpanded(false);
        else if (curr < lastScrollY.current - 6) setExpanded(true);
        lastScrollY.current = curr;
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        title="Send Feedback"
        animate={{ width: expanded ? EXPANDED_W : SIZE }}
        transition={SPRING}
        whileHover={{ y: -3, boxShadow: "0 14px 36px rgba(37,99,235,0.42)" }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-30 rounded-full text-white text-sm font-semibold cursor-pointer overflow-hidden"
        style={{
          height: SIZE,
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          boxShadow: "0 8px 24px rgba(37,99,235,0.30)",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          padding: 0,
        }}
      >
        {/*
          Inner row is always EXPANDED_W wide — the button clips it.
          Icon padding = ICON_PAD so the icon is pixel-perfect centered
          when the button is collapsed to SIZE width.
        */}
        <div
          style={{
            width: EXPANDED_W,
            height: SIZE,
            display: "flex",
            alignItems: "center",
            paddingLeft: ICON_PAD,
            gap: 7,
          }}
        >
          <MessageSquarePlus size={18} strokeWidth={2} style={{ flexShrink: 0 }} />

          <motion.span
            animate={{ opacity: expanded ? 1 : 0 }}
            transition={{ duration: 0.16, delay: expanded ? 0.13 : 0 }}
            style={{ whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none" }}
          >
            Feedback
          </motion.span>
        </div>
      </motion.button>

      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
