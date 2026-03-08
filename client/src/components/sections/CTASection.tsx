'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, Users, Star, Zap } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-28 px-4 sm:px-6" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-white/[0.08]">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/[0.015] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left content */}
              <div>
                {/* Badge */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] mb-6 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-zinc-300">Start your journey today</span>
                </div>

                {/* Heading */}
                <h2
                  className={`text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-5 leading-tight transition-all duration-700 delay-100 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  Ready to accelerate
                  <br />
                  <span className="text-zinc-400">your career?</span>
                </h2>

                {/* Description */}
                <p
                  className={`text-zinc-500 mb-8 max-w-md leading-relaxed transition-all duration-700 delay-200 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  Join thousands of professionals who transformed their careers with personalized mentorship and guidance.
                </p>

                {/* CTAs */}
                <div
                  className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-300 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <Link
                    href="/signup"
                    className="group px-6 py-3.5 rounded-xl font-medium bg-white text-zinc-900 hover:bg-zinc-50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Get started free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/demo"
                    className="px-6 py-3.5 rounded-xl font-medium text-zinc-300 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.15] hover:text-zinc-200 transition-all duration-300 flex items-center justify-center"
                  >
                    Schedule a demo
                  </Link>
                </div>

                {/* Trust indicators */}
                <div
                  className={`mt-8 flex items-center gap-6 transition-all duration-700 delay-400 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {['J', 'S', 'M', 'A'].map((letter, i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] text-zinc-400"
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-zinc-500">10k+ mentees</span>
                  </div>
                  <div className="h-4 w-px bg-zinc-800" />
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-zinc-300 font-medium">4.9</span>
                    <span className="text-xs text-zinc-600">rating</span>
                  </div>
                </div>
              </div>

              {/* Right - Stats cards */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, value: '1', label: 'Expert Mentor', delay: 100 },
                    { icon: Star, value: '50k+', label: 'Sessions Completed', delay: 200 },
                    { icon: Zap, value: '95%', label: 'Success Rate', delay: 300 },
                    { icon: Sparkles, value: '24h', label: 'Avg Response Time', delay: 400 },
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-500 group ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                        style={{ transitionDelay: `${stat.delay}ms` }}
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center mb-4 group-hover:bg-white/[0.08] transition-colors">
                          <Icon className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div className="text-2xl font-semibold text-white mb-1">
                          {stat.value}
                        </div>
                        <div className="text-xs text-zinc-500">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative z-10 px-8 sm:px-12 lg:px-16 py-5 border-t border-white/[0.05] bg-white/[0.01]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-zinc-600 text-center sm:text-left">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
              <div className="flex items-center gap-4">
                {['Google', 'Meta', 'Amazon'].map((company) => (
                  <span key={company} className="text-xs text-zinc-600">
                    {company}
                  </span>
                ))}
                <span className="text-xs text-zinc-500">+100 more</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
