'use client';

import { useState, useEffect } from 'react';
import { Users, Map, MessageSquare, TrendingUp } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';

const features = [
  {
    icon: Users,
    title: 'Expert Mentorship',
    subtitle: 'Learn from the best',
    description: 'Get personalized guidance from Neel Ashish Seru, an expert with 10+ years of experience from Google, Meta, and Amazon. Tailored mentorship for your unique career path.',
    highlights: ['10+ years experience', 'Industry expertise', 'Personalized guidance'],
  },
  {
    icon: Map,
    title: 'Smart Roadmaps',
    subtitle: 'Your personalized path',
    description: 'AI-powered career roadmaps that adapt to your goals. Get step-by-step guidance with milestones, resources, and progress tracking.',
    highlights: ['Custom learning paths', 'Progress tracking', 'Adaptive goals'],
  },
  {
    icon: MessageSquare,
    title: 'Live Sessions',
    subtitle: 'Real-time guidance',
    description: 'Book 1-on-1 video calls, join group workshops, and attend live Q&A sessions. Learn at your pace with on-demand recordings.',
    highlights: ['1-on-1 video calls', 'Group workshops', 'Session recordings'],
  },
  {
    icon: TrendingUp,
    title: 'Career Analytics',
    subtitle: 'Track your progress',
    description: 'Monitor your growth with detailed analytics. See skill improvements, milestone completions, and get AI-powered recommendations.',
    highlights: ['Skill tracking', 'Goal completion', 'AI insights'],
  },
];

const INTERVAL = 4000;

export default function FeaturesSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [key, setKey] = useState(0); // For resetting animation

  // Auto-rotate: 0 -> 1 -> 2 -> 3 -> 0 -> ...
  useEffect(() => {
    if (paused) return;

    const timer = setTimeout(() => {
      setCurrent((prev) => {
        const next = prev + 1;
        return next >= features.length ? 0 : next;
      });
      setKey((k) => k + 1); // Reset animation
    }, INTERVAL);

    return () => clearTimeout(timer);
  }, [current, paused]);

  const handleSelect = (idx: number) => {
    setCurrent(idx);
    setKey((k) => k + 1);
  };

  const active = features[current];
  const ActiveIcon = active.icon;

  return (
    <section
      id="features"
      className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Elements - Right Side */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <SectionHeader
          badge="Platform"
          title="Built for career growth"
          subtitle="Everything you need to accelerate your professional journey, all in one place."
        />

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left - Navigation */}
          <div className="space-y-2 sm:space-y-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const isActive = current === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-transparent border-transparent hover:bg-blue-50/50 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-500'
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm sm:text-base font-medium transition-colors duration-300 font-heading ${isActive ? 'text-blue-600' : 'text-slate-600'}`}>
                        {feature.title}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-500 font-body">{feature.subtitle}</div>
                    </div>
                    {/* Progress ring */}
                    {isActive && !paused && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 hidden sm:block">
                        <svg key={key} className="w-7 h-7 sm:w-8 sm:h-8 -rotate-90" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="2" />
                          <circle
                            cx="16"
                            cy="16"
                            r="12"
                            fill="none"
                            stroke="rgba(59, 130, 246, 0.8)"
                            strokeWidth="2"
                            strokeDasharray="75.4"
                            strokeDashoffset="75.4"
                            strokeLinecap="round"
                            className="animate-progress"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right - Content */}
          <div className="lg:sticky lg:top-24">
            <div className="p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 min-h-[360px] sm:min-h-[420px]">
              <div key={current} className="animate-fadeIn">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
                  <ActiveIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-2 sm:mb-3 font-heading">{active.title}</h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 sm:mb-8 font-body">{active.description}</p>

                <div className="space-y-2 sm:space-y-3">
                  {active.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span className="text-xs sm:text-sm text-slate-600 font-body">{h}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-blue-200">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex -space-x-2">
                      {['A', 'B', 'C'].map((l, i) => (
                        <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-xs text-blue-600 font-body">
                          {l}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-slate-600 font-body">Join 10k+ professionals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile dots */}
        <div className="flex justify-center gap-2 mt-6 sm:mt-8 lg:hidden">
          {features.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === idx ? 'bg-blue-600 w-8' : 'bg-blue-300 w-2'
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes progress {
          from { stroke-dashoffset: 75.4; }
          to { stroke-dashoffset: 0; }
        }
        .animate-progress {
          animation: progress 4s linear forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out;
        }
      `}</style>
    </section>
  );
}
