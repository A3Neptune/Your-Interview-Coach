'use client';

import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import { ArrowRight } from 'lucide-react';

export default function CTAFinal() {
  return (
    <section className="py-32 px-4 md:px-8">
      <ScrollReveal fullWidth>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative p-12 md:p-20 rounded-3xl overflow-hidden"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/15 to-pink-600/10" />

            {/* Content */}
            <div className="relative z-10 text-center">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">Ready to Elevate Your Career?</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                Join thousands of professionals who've successfully transformed their careers. Your mentor is waiting.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-600/50 transition-all"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <p className="text-gray-500 text-sm mt-8">No credit card required • 14-day free trial • Cancel anytime</p>
            </div>

            {/* Border Animation */}
            <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
          </motion.div>
        </div>
      </ScrollReveal>
    </section>
  );
}
