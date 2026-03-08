'use client';

import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 10, suffix: '+', label: 'Years Experience' },
  { value: 10, suffix: 'k+', label: 'Happy Mentees' },
  { value: 95, suffix: '%', label: 'Success rate' },
  { value: 50, suffix: '+', label: 'Countries Reached' },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let current = 0;
          const step = value / 40;
          const timer = setInterval(() => {
            current += step;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 30);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-blue-600 font-accent">
      {count}{suffix}
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 border-y border-blue-100 bg-gradient-to-r from-blue-50/50 via-white to-blue-50/50 overflow-hidden">
      {/* Background Elements - Left Side */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="p-6 rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-300 hover:scale-105 transition-all duration-300">
                <Counter value={stat.value} suffix={stat.suffix} />
                <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 font-body">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
