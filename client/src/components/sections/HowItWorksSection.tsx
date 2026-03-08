'use client';

import { useEffect, useRef, useState } from 'react';
import { UserPlus, Search, Video, TrendingUp, Check } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';

const steps = [
  {
    id: 1,
    icon: UserPlus,
    title: 'Create Profile',
    description: 'Set up your profile in minutes. Tell us about your background, skills, and career goals.',
    highlight: '5 min setup',
  },
  {
    id: 2,
    icon: Search,
    title: 'Get Matched',
    description: 'Our algorithm finds mentors who match your industry, experience level, and learning style.',
    highlight: 'AI-powered',
  },
  {
    id: 3,
    icon: Video,
    title: 'Start Sessions',
    description: 'Book 1-on-1 video calls at times that work for you. Get personalized advice and feedback.',
    highlight: 'Flexible times',
  },
  {
    id: 4,
    icon: TrendingUp,
    title: 'Grow Career',
    description: 'Follow your roadmap, complete milestones, and land your dream job with confidence.',
    highlight: 'Track progress',
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      const sectionStart = sectionTop - windowHeight * 0.5;
      const sectionEnd = sectionTop + sectionHeight - windowHeight * 0.5;
      const scrollProgress = (scrollY - sectionStart) / (sectionEnd - sectionStart);

      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      setProgress(clampedProgress);

      const newActiveStep = Math.min(
        steps.length - 1,
        Math.floor(clampedProgress * steps.length)
      );
      setActiveStep(newActiveStep);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="how-it-works" className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 overflow-hidden" ref={sectionRef}>
      {/* Background Elements - Left Side */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <SectionHeader
          badge="Process"
          title="How it works"
          subtitle="Your journey to career success in four simple steps"
        />

        <div className="relative">
          {/* Center line - Desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div className="absolute inset-0 bg-blue-200" />
            <div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-blue-500 via-blue-400 to-transparent transition-all duration-300 ease-out"
              style={{ height: `${progress * 100}%` }}
            />
          </div>

          <div className="space-y-6 sm:space-y-8 lg:space-y-0">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx <= activeStep;
              const isCurrent = idx === activeStep;
              const isCompleted = idx < activeStep;
              const isLeft = idx % 2 === 0;

              return (
                <div key={step.id} className="relative lg:min-h-[200px]">
                  {/* Desktop Layout */}
                  <div className="hidden lg:block">
                    <div className="absolute left-1/2 top-8 -translate-x-1/2 z-10">
                      <div
                        className={`relative w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ease-out border-2 ${
                          isCurrent
                            ? 'bg-blue-600 text-white border-blue-700 rotate-0 scale-100'
                            : isCompleted
                            ? 'bg-blue-200 text-blue-600 border-blue-300 rotate-0 scale-95'
                            : 'bg-blue-50 text-blue-300 border-blue-200 rotate-3 scale-90'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" strokeWidth={2.5} />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                        <div className={`absolute -top-2 -right-2 w-5 sm:w-6 h-5 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-semibold transition-all duration-300 font-accent ${
                          isCurrent
                            ? 'bg-white text-blue-600'
                            : isCompleted
                            ? 'bg-blue-400 text-white'
                            : 'bg-blue-200 text-blue-500'
                        }`}>
                          {step.id}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`absolute top-0 w-[calc(50%-60px)] transition-all duration-700 ease-out ${
                        isLeft ? 'left-0 pr-8' : 'right-0 pl-8'
                      }`}
                      style={{
                        opacity: isActive ? 1 : 0.3,
                        transform: `translateX(${isActive ? '0' : isLeft ? '-20px' : '20px'}) translateY(${isActive ? '0' : '10px'})`,
                      }}
                    >
                      <div
                        className={`p-5 sm:p-6 rounded-2xl border-2 transition-all duration-500 ${
                          isCurrent
                            ? 'bg-blue-50 border-blue-300'
                            : 'bg-white border-blue-100'
                        } ${isLeft ? 'text-right' : 'text-left'}`}
                      >
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3 sm:mb-4 transition-colors duration-300 ${
                          isCurrent ? 'bg-blue-100' : 'bg-blue-50'
                        } ${isLeft ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                            isCurrent ? 'bg-blue-500' : 'bg-blue-300'
                          }`} />
                          <span className={`text-[9px] sm:text-[10px] uppercase tracking-wider transition-colors duration-300 font-body ${
                            isCurrent ? 'text-blue-600' : 'text-blue-400'
                          }`}>
                            {step.highlight}
                          </span>
                        </div>

                        <h3 className={`text-lg sm:text-xl font-semibold mb-2 transition-colors duration-300 font-heading ${
                          isCurrent ? 'text-blue-600' : 'text-slate-500'
                        }`}>
                          {step.title}
                        </h3>

                        <p className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 font-body ${
                          isCurrent ? 'text-slate-700' : 'text-slate-500'
                        }`}>
                          {step.description}
                        </p>

                        <div
                          className={`absolute top-10 w-8 h-px transition-all duration-500 ${
                            isLeft ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'
                          } ${isActive ? 'opacity-100' : 'opacity-30'}`}
                        >
                          <div className={`h-full transition-colors duration-300 ${
                            isCurrent ? 'bg-blue-400' : 'bg-blue-200'
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="lg:hidden">
                    <div
                      className={`flex gap-3 sm:gap-4 transition-all duration-500 ease-out`}
                      style={{
                        opacity: isActive ? 1 : 0.4,
                        transform: `translateX(${isActive ? '0' : '-8px'})`,
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`relative w-10 sm:w-12 h-10 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 border-2 ${
                            isCurrent
                              ? 'bg-blue-600 text-white border-blue-700'
                              : isCompleted
                              ? 'bg-blue-200 text-blue-600 border-blue-300'
                              : 'bg-blue-50 text-blue-300 border-blue-200'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4" strokeWidth={2.5} />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                          <div className={`absolute -top-1.5 -right-1.5 w-4 sm:w-5 h-4 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-semibold font-accent ${
                            isCurrent
                              ? 'bg-white text-blue-600'
                              : 'bg-blue-200 text-blue-500'
                          }`}>
                            {step.id}
                          </div>
                        </div>

                        {idx < steps.length - 1 && (
                          <div className="w-px flex-1 my-2 sm:my-3 relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-200" />
                            <div
                              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-blue-500 to-transparent transition-all duration-500"
                              style={{ height: isActive ? '100%' : '0%' }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 pb-6 sm:pb-8">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mb-2 sm:mb-3 transition-colors duration-300 ${
                          isCurrent ? 'bg-blue-100' : 'bg-blue-50'
                        }`}>
                          <div className={`w-1 h-1 rounded-full ${isCurrent ? 'bg-blue-500' : 'bg-blue-300'}`} />
                          <span className={`text-[8px] sm:text-[9px] uppercase tracking-wider font-body ${
                            isCurrent ? 'text-blue-600' : 'text-blue-400'
                          }`}>
                            {step.highlight}
                          </span>
                        </div>

                        <h3 className={`text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 transition-colors duration-300 font-heading ${
                          isCurrent ? 'text-blue-600' : 'text-slate-500'
                        }`}>
                          {step.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={`mt-8 sm:mt-12 lg:mt-8 flex justify-center transition-all duration-700 ease-out ${
              activeStep >= steps.length - 1
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-blue-50 border-2 border-blue-200">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs sm:text-sm text-blue-600 font-body">Ready to start your journey</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
