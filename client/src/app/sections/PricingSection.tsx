'use client';

import { motion } from 'framer-motion';
import SectionBadge from '@/components/SectionBadge';
import ScrollReveal from '@/components/ScrollReveal';
import { Check, ArrowRight } from 'lucide-react';

export default function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Get started on your journey',
      features: [
        '1 mentor consultation/month',
        'Career assessment test',
        'Resource library access',
        'Community forum',
        'Email support',
      ],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$99',
      period: '/month',
      description: 'Accelerate your growth',
      features: [
        '4 mentor consultations/month',
        'Career roadmap creation',
        'Resume optimization',
        'Interview preparation',
        'Priority support',
        'Portfolio reviews',
        'Exclusive webinars',
      ],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      name: 'Elite',
      price: '$199',
      period: '/month',
      description: 'Premium career transformation',
      features: [
        'Unlimited mentor access',
        'Dedicated career coach',
        'Job placement assistance',
        'Salary negotiation prep',
        '24/7 support',
        'Priority networking events',
        'Custom learning path',
        'Lifetime access',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
  ];

  return (
    <section className="py-32 px-4 md:px-6 section-contain">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <SectionBadge text="Simple Pricing" icon={<Check className="w-4 h-4" />} />
          <h2 className="text-5xl md:text-6xl font-bold mt-8 mb-6">Choose Your Path</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">No hidden fees. Cancel anytime.</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <motion.div
                whileHover={{ y: -12 }}
                className={`relative group rounded-2xl transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/20 border-2 border-blue-500/50 scale-105 md:scale-110'
                    : 'bg-white/5 border border-white/10 hover:border-white/30'
                }`}
              >
                {/* Badge */}
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8 md:p-10">
                  {/* Header */}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="text-4xl md:text-5xl font-bold">
                      {plan.price}
                      <span className="text-lg text-gray-400 font-normal">{plan.period}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 mb-8 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:shadow-blue-600/40'
                        : 'border border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  {/* Features */}
                  <div className="space-y-4">
                    {plan.features.map((feature, fidx) => (
                      <motion.div
                        key={fidx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: fidx * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3"
                      >
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-blue-500/20 transition-all" />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="text-gray-400 text-sm mb-4">Questions? Check our <span className="text-blue-400 cursor-pointer hover:underline">FAQ</span> or <span className="text-blue-400 cursor-pointer hover:underline">contact us</span></p>
          <p className="text-xs text-gray-600">All plans include 14-day free trial. No credit card required.</p>
        </motion.div>
      </div>
    </section>
  );
}
