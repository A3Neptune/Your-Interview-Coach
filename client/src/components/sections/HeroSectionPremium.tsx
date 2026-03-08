'use client';

import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import Image from 'next/image';

export default function HeroSectionPremium() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-black">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        {/* Ambient light effects */}
        <div className="absolute -top-96 -right-96 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -left-80 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl opacity-10"></div>

        {/* Gradient line accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/40 border border-zinc-800/80  w-fit">
              <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse"></div>
              <span className="text-xs font-medium text-zinc-300">Now Open to All • Limited Slots Available</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-white">
                Your Career
                <span className="block">
                  <span className="relative">
                    <span className="relative z-10 bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 bg-clip-text text-transparent">
                      Transformation
                    </span>
                    <span className="absolute -inset-x-2 -inset-y-1 bg-gradient-to-r from-white/20 to-transparent rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </span>
                </span>
                Starts Here
              </h1>
              <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-xl">
                Connect with industry mentors who've been where you want to go. Get personalized guidance, interview prep, and career strategy.
              </p>
            </div>

            {/* Highlight Stats */}
            <div className="flex flex-wrap gap-6 py-6 border-t border-b border-zinc-800/50">
              {[
                { value: '1:1', label: 'Personalized Mentoring' },
                { value: '24h', label: 'Response Time' },
                { value: '100%', label: 'Satisfaction' },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* Primary CTA */}
              <Link
                href="/signup"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-zinc-50 text-black font-semibold rounded-xl transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              {/* Secondary CTA - Video */}
              <button className="group inline-flex items-center justify-center px-8 py-4 rounded-xl border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-semibold transition-all duration-300 hover:bg-zinc-900/50">
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="space-y-2 text-xs text-zinc-500 pt-2">
              <p>✓ No credit card required</p>
              <p>✓ Free 30-minute consultation included</p>
            </div>
          </div>

          {/* Right: Visual Element */}
          <div className="relative hidden lg:block h-[600px]">
            {/* Animated card */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/40 via-black to-zinc-900/40 border border-zinc-800/50"></div>

              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-[0.05]" style={{
                backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }}></div>

              {/* Content showcase */}
              <div className="relative h-full flex flex-col justify-center items-center p-8 space-y-6">
                {/* Mentor cards preview */}
                <div className="space-y-4 w-full">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-zinc-800/30 hover:border-zinc-700/50 transition-all">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800"></div>
                      <div className="flex-1">
                        <div className="h-2 w-24 rounded bg-zinc-700/50"></div>
                        <div className="h-1.5 w-16 rounded bg-zinc-800/50 mt-2"></div>
                      </div>
                      <div className="text-xs text-zinc-600">Available</div>
                    </div>
                  ))}
                </div>

                {/* Floating elements */}
                <div className="absolute top-8 right-8 w-12 h-12 rounded-lg border border-zinc-700/30 flex items-center justify-center text-xs font-semibold text-zinc-600">
                  ✓
                </div>
                <div className="absolute bottom-8 left-8 w-8 h-8 rounded-full border border-zinc-700/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-zinc-700/40"></div>
                </div>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-white/10 via-transparent to-white/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
