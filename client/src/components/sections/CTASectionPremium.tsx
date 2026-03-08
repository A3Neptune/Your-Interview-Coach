'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';

export default function CTASectionPremium() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
        <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/50 to-white rounded-3xl sm:rounded-[2rem] border-2 border-blue-200"></div>
          <div className="absolute inset-0 rounded-3xl sm:rounded-[2rem] bg-gradient-to-r from-blue-100/30 via-transparent to-blue-100/30 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative p-6 sm:p-12 lg:p-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border-2 border-blue-200 mb-4 sm:mb-6">
              <Zap className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-blue-600 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-semibold text-blue-600 font-body">Ready to transform your career?</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight font-heading">
              Start your mentorship
              <span className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                journey today
              </span>
            </h2>

            <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mb-6 sm:mb-8 leading-relaxed font-body">
              Join hundreds of students and professionals already growing their careers with personalized mentorship. Get expert guidance, build confidence, and achieve your goals.
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 py-4 sm:py-6 border-y border-blue-200">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600 font-accent">500+</div>
                <div className="text-[10px] sm:text-xs text-slate-600 font-body">Active Mentors</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600 font-accent">10K+</div>
                <div className="text-[10px] sm:text-xs text-slate-600 font-body">Success Stories</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600 font-accent">98%</div>
                <div className="text-[10px] sm:text-xs text-slate-600 font-body">Satisfaction Rate</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/signup"
                className="group relative inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 font-heading text-sm sm:text-base"
              >
                <span className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-blue-50 text-blue-600 font-semibold rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 font-heading text-sm sm:text-base"
              >
                Learn More
              </Link>
            </div>

            <p className="text-[10px] sm:text-xs text-slate-500 mt-4 sm:mt-6 font-body">
              ✓ No credit card required • ✓ Free initial consultation • ✓ Cancel anytime
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-16">
          {[
            {
              icon: Target,
              title: 'Personalized Paths',
              description: 'Get a mentor matched to your specific career goals and aspirations.'
            },
            {
              icon: TrendingUp,
              title: 'Real Results',
              description: 'Track measurable progress with structured learning and guidance.'
            },
            {
              icon: Zap,
              title: 'Quick Start',
              description: 'Begin your first session within 48 hours of signing up.'
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="group relative">
                <div className="relative h-full p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1.5 sm:mb-2 font-heading">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-body">{feature.description}</p>
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
