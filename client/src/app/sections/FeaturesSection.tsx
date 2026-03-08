'use client';

import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';

export default function FeaturesSection() {
  const features = [
    {
      title: 'Expert Mentorship',
      description: 'Learn directly from professionals at top tech companies with 10+ years of experience',
    },
    {
      title: 'Personalized Roadmap',
      description: 'AI-powered career paths designed specifically for your skills and aspirations',
    },
    {
      title: 'Real Projects',
      description: 'Work on real-world projects to build an impressive portfolio and gain hands-on experience',
    },
    {
      title: 'Job Placement',
      description: 'Direct support in landing interviews and negotiating offers at your dream companies',
    },
    {
      title: '24/7 Support',
      description: 'Access to mentors, resources, and community whenever you need guidance',
    },
    {
      title: 'Certifications',
      description: 'Earn industry-recognized credentials that validate your skills and boost your resume',
    },
  ];

  return (
    <section className="py-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Everything You Need</h2>
          <p className="text-xl text-gray-400">Complete tools for career transformation</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.08}>
              <motion.div
                whileHover={{ scale: 1.03, y: -8 }}
                className="relative p-8 rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/15 hover:border-white/40 transition-all overflow-hidden group"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 mb-6 group-hover:bg-blue-500/30 transition-colors" />
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
