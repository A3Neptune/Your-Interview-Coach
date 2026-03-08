'use client';

import { motion } from 'framer-motion';

interface SectionBadgeProps {
  text: string;
  icon?: React.ReactNode;
}

export default function SectionBadge({ text, icon }: SectionBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-3"
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-blue-400">{icon}</span>}
        <span className="text-sm md:text-base font-semibold text-blue-400 uppercase tracking-widest">
          {text}
        </span>
      </div>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 24 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="h-0.5 bg-gradient-to-r from-blue-400 to-transparent"
      />
    </motion.div>
  );
}
