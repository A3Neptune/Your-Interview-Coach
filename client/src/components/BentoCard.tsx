'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BentoCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  gradient: string;
  children?: ReactNode;
  delay?: number;
}

const sizeClasses = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 md:col-span-2 row-span-1',
  large: 'col-span-1 md:col-span-2 md:row-span-2',
};

const sizeHeights = {
  small: 'min-h-[250px]',
  medium: 'min-h-[300px]',
  large: 'min-h-[500px] md:min-h-[600px]',
};

export default function BentoCard({
  title,
  description,
  icon,
  size = 'small',
  gradient,
  children,
  delay = 0,
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, margin: '-100px' }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/30 ${sizeClasses[size]} ${sizeHeights[size]}`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Content */}
      <div className="relative z-10 h-full p-8 md:p-10 flex flex-col justify-between">
        <div>
          {icon && (
            <motion.div
              whileHover={{ scale: 1.15, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors duration-300"
            >
              {icon}
            </motion.div>
          )}
          <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-white transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-400 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
            {description}
          </p>
        </div>

        {children && <div className="mt-6">{children}</div>}
      </div>

      {/* Animated Border Gradient */}
      <div className="absolute inset-0 rounded-3xl border border-white/5 group-hover:border-white/20 transition-all duration-500 pointer-events-none" />
    </motion.div>
  );
}
