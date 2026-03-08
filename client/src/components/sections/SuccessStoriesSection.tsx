'use client';

import { useEffect, useRef, useState } from 'react';
import { Star, ArrowRight, Zap } from 'lucide-react';

const stories = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer → Senior Engineer',
    company: 'Google',
    image: '👩‍💻',
    story: 'Went from mid-level to senior within 8 months with personalized guidance on system design and leadership skills.',
    result: '45% salary increase',
    color: 'from-blue-500/10 to-purple-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager → Director',
    company: 'Meta',
    image: '👨‍💼',
    story: 'Learned how to lead cross-functional teams and navigate corporate politics. Now managing 15+ engineers.',
    result: 'Leadership promotion',
    color: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    name: 'Priya Sharma',
    role: 'Data Analyst → Data Scientist',
    company: 'Amazon',
    image: '👩‍🔬',
    story: 'Transitioned to ML with structured learning path. Got promoted and now leads analytics initiatives.',
    result: 'Career pivot + 35% raise',
    color: 'from-pink-500/10 to-rose-500/10',
    borderColor: 'border-pink-500/20',
  },
];

export default function SuccessStoriesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-28 px-4 sm:px-6" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div
          className={`mb-20 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Zap className="w-3.5 h-3.5 text-white/60" />
            <span className="text-xs text-zinc-400 uppercase tracking-widest">Real Results</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Career transformations that speak volumes
          </h2>

          <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Join thousands of professionals who've accelerated their careers with personalized mentorship and strategic guidance.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, idx) => (
            <div
              key={idx}
              className={`group relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(idx + 1) * 100}ms` }}
            >
              {/* Card */}
              <div
                className={`relative p-8 rounded-2xl  border ${story.borderColor}
                  bg-gradient-to-br ${story.color} hover:border-white/40 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5
                  transition-all duration-500 overflow-hidden h-full flex flex-col`}
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Avatar and Name */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-5xl mb-4">{story.image}</div>
                      <h3 className="text-xl font-bold text-white mb-1">{story.name}</h3>
                      <p className="text-sm text-zinc-400">{story.role}</p>
                      <p className="text-xs text-zinc-500 mt-1">@ {story.company}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Story */}
                  <p className="text-zinc-300 leading-relaxed mb-6 text-sm">
                    "{story.story}"
                  </p>

                  {/* Result Badge */}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 mb-4">
                    <Zap className="w-4 h-4 text-white/60" />
                    <span className="text-sm font-semibold text-white">{story.result}</span>
                  </div>

                  {/* CTA */}
                  <button className="w-full mt-auto py-3 rounded-lg bg-white/10 border border-white/20 text-white font-medium
                    hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                    Read full story
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className={`mt-16 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          <p className="text-zinc-400 mb-6">
            Your success story could be next
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-zinc-900 font-semibold
            hover:bg-zinc-50 transition-all duration-300">
            Start your journey
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
