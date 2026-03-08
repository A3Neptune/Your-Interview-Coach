'use client';

import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';

export default function TestimonialsAlt() {
  const testimonials = [
    { name: 'Sarah Chen', role: 'PM at Google', quote: 'Landed my PM role in 4 months. Best decision ever!', img: '👩‍💼' },
    { name: 'James Wilson', role: 'Engineer at Meta', quote: 'Expert guidance transformed my career trajectory.', img: '👨‍💻' },
    { name: 'Priya Patel', role: 'Data Scientist at Amazon', quote: 'From search to offer in just 6 weeks. Amazing!', img: '👩‍🔬' },
  ];

  return (
    <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-20">Success Stories</h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all"
              >
                <div className="text-4xl text-blue-400/30 mb-4">"</div>
                <p className="text-gray-300 mb-6 italic">{t.quote}</p>
                <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                  <span className="text-2xl">{t.img}</span>
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-xs text-blue-400">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
