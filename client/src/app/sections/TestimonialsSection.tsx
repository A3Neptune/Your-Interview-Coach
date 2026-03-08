'use client';

import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager at Google',
      quote: 'The mentorship transformed my career. I landed a PM role at Google within 4 months.',
      image: '👩‍💼',
    },
    {
      name: 'James Wilson',
      role: 'Senior Engineer at Meta',
      quote: 'Best investment in my career. The guidance I received was invaluable.',
      image: '👨‍💻',
    },
    {
      name: 'Priya Patel',
      role: 'Data Scientist at Amazon',
      quote: 'From job search to offer in just 6 weeks. Incredible experience!',
      image: '👩‍🔬',
    },
  ];

  return (
    <section className="py-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Success Stories</h2>
          <p className="text-xl text-gray-400">Real results from real professionals</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 hover:border-white/30 transition-all group"
              >
                <div className="relative z-10">
                  {/* Quote Mark */}
                  <div className="text-5xl text-blue-400/20 mb-4">"</div>

                  {/* Quote */}
                  <p className="text-gray-300 mb-8 leading-relaxed">{testimonial.quote}</p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-8 border-t border-white/10">
                    <div className="text-3xl">{testimonial.image}</div>
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-xs text-blue-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-blue-500/20 transition-all" />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
