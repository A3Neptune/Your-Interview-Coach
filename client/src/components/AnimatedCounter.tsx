'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useTransform, motion } from 'framer-motion';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export default function AnimatedCounter({
  end,
  duration = 2.5,
  prefix = '',
  suffix = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const motionValue = useMotionValue(0);
  const roundedValue = useTransform(motionValue, (value) => {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      const animate = async () => {
        motionValue.set(0);
        await new Promise((resolve) => setTimeout(resolve, 0));
        motionValue.set(end);
      };
      animate();
    }
  }, [isVisible, end, motionValue]);

  return (
    <div ref={ref}>
      <motion.span>{roundedValue}</motion.span>
      <span>{suffix}</span>
    </div>
  );
}
