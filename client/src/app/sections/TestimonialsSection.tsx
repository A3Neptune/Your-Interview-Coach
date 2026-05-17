"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

export default function TestimonialsSection() {
  const testimonials = [
    { title: "Arpit", src: "https://www.youtube.com/embed/SvP6McXPCXw" },
    { title: "Kinshuk", src: "https://www.youtube.com/embed/_2wnxSrAJe8" },
    { title: "Chawi", src: "https://www.youtube.com/embed/TmABADPK-Pw" },
    // { title: 'Pranay', src: 'https://www.youtube.com/embed/L3qG3_7CZwc' },
    { title: "Shrutika", src: "https://www.youtube.com/embed/14LgWpMO4Bk" },
    { title: "Shubhi", src: "https://www.youtube.com/embed/uB-Z4J7QBgM" },
    { title: "Anushka", src: "https://www.youtube.com/embed/zC8eFR-ZAWU" },
    { title: "Bhaanvi", src: "https://www.youtube.com/embed/Dd53s0OyVJg" },
    { title: "Shiv", src: "https://www.youtube.com/embed/7pB04N8KO6I" },
  ];

  return (
    <section className="py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-gray-400">
            Real results from real professionals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 hover:border-white/30 transition-all overflow-hidden p-4 group"
              >
                <div className="relative z-10 w-full rounded-xl overflow-hidden aspect-[9/16]">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={testimonial.src}
                    title={testimonial.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-white">
                    {testimonial.title}
                  </h3>
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
