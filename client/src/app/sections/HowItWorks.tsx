'use client';

import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';

export default function HowItWorks() {
  const steps = [
    { num: '01', title: 'Create Profile', desc: 'Tell us your goals and background' },
    { num: '02', title: 'Get Matched', desc: 'AI pairs you with perfect mentor' },
    { num: '03', title: 'Start Learning', desc: 'Begin your personalized journey' },
    { num: '04', title: 'Land Opportunity', desc: 'Secure your dream role' },
  ];

  return (
    <section id="how" className="py-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-20">How It Works</h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-white/10 hover:border-white/30 transition-all"
              >
                <div className="text-5xl font-bold text-blue-400/30 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
                )}
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
