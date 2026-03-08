'use client';

import { useEffect, useRef, useState } from 'react';

interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={headerRef}
      className={`mb-16 lg:mb-20 ${centered ? 'text-center' : ''}`}
    >
      {/* Badge */}
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border-2 border-blue-200 mb-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        <span className="text-[11px] text-blue-600 uppercase tracking-widest font-body">
          {badge}
        </span>
      </div>

      {/* Title with underline */}
      <div
        className={`transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="relative inline-block text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 mb-5 font-heading">
          {title}
          <span
            className={`absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-blue-400 to-transparent transition-all duration-1000 ease-out rounded-full ${
              isVisible ? 'w-full' : 'w-0'
            }`}
            style={{ transitionDelay: '400ms' }}
          />
        </h2>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={`text-slate-600 max-w-md ${centered ? 'mx-auto' : ''} text-sm sm:text-base transition-all duration-700 delay-200 font-body ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
