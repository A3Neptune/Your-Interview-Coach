'use client';

import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';

export default function FeaturesAlt() {
  const features = [
    { title: 'Expert Mentorship', desc: 'Direct access to industry veterans' },
    { title: 'Career Roadmaps', desc: 'Personalized guidance for your goals' },
    { title: 'Job Placement', desc: 'Support landing your dream role' },
    { title: 'Skill Development', desc: 'Curated courses and resources' },
    { title: 'Interview Prep', desc: 'Master technical and behavioral' },
    { title: '24/7 Community', desc: 'Support when you need it' },
  ];

  return (
    <section id="features" className="py-32 px-4 md:px-8 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-20">What You Get</h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -8 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all"
              >
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
