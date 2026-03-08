'use client';

import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import { ArrowRight, Check } from 'lucide-react';

export default function PricingAlt() {
  const plans = [
    { name: 'Starter', price: 'Free', features: ['1 consultation/mo', 'Career assessment', 'Community access'] },
    { name: 'Pro', price: '$99', features: ['4 consultations/mo', 'Career roadmap', 'Resume review', 'Interview prep', 'Priority support'], highlight: true },
    { name: 'Elite', price: '$199', features: ['Unlimited access', 'Dedicated coach', 'Job placement', 'Salary negotiation', '24/7 support'] },
  ];

  return (
    <section id="pricing" className="py-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-6">Simple Pricing</h2>
          <p className="text-gray-400 text-center mb-20">Choose the plan that fits your needs</p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -12 }}
                className={`relative p-8 rounded-2xl transition-all ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/20 border-2 border-blue-500 scale-105'
                    : 'bg-white/5 border border-white/10 hover:border-white/30'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">{plan.price}/mo</div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className={`w-full py-3 rounded-lg font-bold mb-8 transition-all ${
                    plan.highlight
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'border border-white/20 hover:bg-white/5'
                  }`}
                >
                  Get Started <ArrowRight className="w-4 h-4 inline ml-2" />
                </motion.button>
                <div className="space-y-3">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
