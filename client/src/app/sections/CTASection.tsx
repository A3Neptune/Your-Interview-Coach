'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function CTASection() {
  return (
    <section className="py-24 px-4 md:px-6 section-contain">
      <ScrollReveal fullWidth>
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-sm p-12 md:p-20">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 -z-10" />

            <div className="relative z-10 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                Ready to Transform Your Career?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                Join thousands of professionals who have successfully transformed their careers through personalized mentorship and strategic guidance.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <button className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover-lift">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="w-full sm:w-auto px-8 py-4 border border-white/20 rounded-xl font-semibold hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm hover-lift">
                  <Mail className="w-5 h-5" />
                  Get Early Access
                </button>
              </motion.div>

              {/* Trust Badge */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-sm text-gray-500 mt-8"
              >
                ✓ No credit card required • ✓ 14-day free trial • ✓ Cancel anytime
              </motion.p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
