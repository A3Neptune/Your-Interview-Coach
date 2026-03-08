'use client';

import { motion } from 'framer-motion';
import SectionBadge from '@/components/SectionBadge';
import ScrollReveal from '@/components/ScrollReveal';
import { Star, MessageSquare } from 'lucide-react';

export default function ProveSection() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager @ Google',
      quote: 'Within 3 months, I landed a PM role at Google. The mentorship was invaluable.',
      rating: 5,
      image: '👩‍💼',
    },
    {
      name: 'James Wilson',
      role: 'Senior Developer @ Meta',
      quote: 'Best career investment I ever made. The network alone is worth it.',
      rating: 5,
      image: '👨‍💻',
    },
    {
      name: 'Priya Patel',
      role: 'Data Scientist @ Amazon',
      quote: 'From job search to offer in 6 weeks. Amazing journey!',
      rating: 5,
      image: '👩‍🔬',
    },
    {
      name: 'Michael Johnson',
      role: 'Design Lead @ Stripe',
      quote: 'The personalized guidance transformed my career trajectory completely.',
      rating: 5,
      image: '👨‍🎨',
    },
  ];

  return (
    <section className="py-32 px-4 md:px-6 section-contain">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <SectionBadge text="Real Results" icon={<Star className="w-4 h-4" />} />
          <h2 className="text-5xl md:text-6xl font-bold mt-8 mb-6">Trusted by Thousands</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Success stories from professionals like you</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 backdrop-blur-sm hover:border-white/30 transition-all"
              >
                {/* Quote Icon */}
                <MessageSquare className="w-8 h-8 text-blue-400/30 mb-4" />

                {/* Quote */}
                <p className="text-gray-300 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{testimonial.image}</div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-xs text-blue-400">{testimonial.role}</div>
                  </div>
                </div>

                {/* Bg Gradient */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-blue-500/20 transition-all" />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
