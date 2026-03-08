'use client';

import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps extends MotionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  fullWidth?: boolean;
}

const directionVariants = {
  up: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
  down: { initial: { opacity: 0, y: -40 }, animate: { opacity: 1, y: 0 } },
  left: { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
  right: { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
};

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  fullWidth = false,
  ...motionProps
}: ScrollRevealProps) {
  const variants = directionVariants[direction];

  return (
    <motion.div
      initial={variants.initial}
      whileInView={variants.animate}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      viewport={{ once: true, margin: '-100px' }}
      className={fullWidth ? 'w-full' : ''}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
