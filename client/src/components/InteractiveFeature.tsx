'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface InteractiveFeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
  index?: number;
}

export default function InteractiveFeature({
  icon,
  title,
  description,
  gradient,
  index = 0,
}: InteractiveFeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{
        y: -12,
        transition: { duration: 0.3 },
      }}
      className="group"
    >
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-8 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 h-full`}>
        {/* Hover Effect Background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/10 to-transparent" />

        {/* Icon Container */}
        <motion.div
          whileHover={{ scale: 1.2, rotate: 8 }}
          transition={{ type: 'spring', stiffness: 400 }}
          className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-5 text-2xl group-hover:bg-white/20 transition-colors duration-300"
        >
          {icon}
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-100 transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-white via-transparent to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}
