'use client';

import { useState, useEffect, useRef } from 'react';
import { Quote, Star } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';

const testimonialsRow1 = [
  {
    id: 1,
    name: 'Rahul M.',
    role: 'Software Developer',
    company: 'TCS',
    initials: 'RM',
    rating: 5,
    text: 'Honestly, I was super nervous about interviews. After 3 sessions with Neel, I felt so much more confident. Got placed in my dream company!',
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
  },
  {
    id: 2,
    name: 'Ananya K.',
    role: 'MBA Student',
    company: 'IIM Bangalore',
    initials: 'AK',
    rating: 5,
    text: "The mock interviews were a game changer. Neel pointed out things I never even noticed about my answers. Totally worth it.",
    gradient: 'from-blue-500 via-blue-600 to-blue-700',
  },
  {
    id: 3,
    name: 'Vikram S.',
    role: 'Data Analyst',
    company: 'Infosys',
    initials: 'VS',
    rating: 5,
    text: 'I was struggling with technical rounds. The way Neel explained concepts and helped me practice made such a difference. Highly recommend!',
    gradient: 'from-blue-400 via-blue-600 to-blue-700',
  },
];

const testimonialsRow2 = [
  {
    id: 4,
    name: 'Priya T.',
    role: 'HR Professional',
    company: 'Wipro',
    initials: 'PT',
    rating: 5,
    text: "Was clueless about how to answer behavioral questions. Neel's tips were so practical and easy to remember. Cleared 4 interviews back to back!",
    gradient: 'from-blue-500 via-blue-600 to-blue-800',
  },
  {
    id: 5,
    name: 'Arjun P.',
    role: 'Marketing Manager',
    company: 'Flipkart',
    initials: 'AP',
    rating: 5,
    text: 'Best decision ever! The resume review alone was worth it. Plus the interview prep helped me negotiate a better package. Thanks Neel!',
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
  },
  {
    id: 6,
    name: 'Sneha R.',
    role: 'Product Designer',
    company: 'Swiggy',
    initials: 'SR',
    rating: 5,
    text: 'I had zero confidence before starting. The way Neel breaks down each question type and gives real examples really helped me understand what interviewers want.',
    gradient: 'from-blue-500 via-blue-600 to-blue-700',
  },
];

export default function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonialsRow1[0] }) => (
    <div className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] mx-2 sm:mx-3 md:mx-4">
      <div className="group relative h-full">
        {/* Floating glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-blue-500/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Card */}
        <div className="relative bg-white/90  border-2 border-blue-200/60 rounded-3xl p-6 sm:p-7 transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">
          {/* Quote Icon */}
          <div className="absolute -top-3 -right-3 opacity-20 group-hover:opacity-30 transition-opacity">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500`}>
              <Quote className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>

          {/* Rating Stars */}
          <div className="flex gap-1 mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-blue-500 text-blue-500"
              />
            ))}
          </div>

          {/* Testimonial Text */}
          <blockquote className="flex-grow mb-5">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-body">
              "{testimonial.text}"
            </p>
          </blockquote>

          {/* Author Info */}
          <div className="flex items-center gap-3 pt-4 border-t border-blue-100">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
              {testimonial.initials}
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-0.5">
                {testimonial.name}
              </h4>
              <p className="text-xs sm:text-sm text-blue-600 font-semibold">
                {testimonial.role}
              </p>
              <p className="text-xs text-slate-500">{testimonial.company}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header using SectionHeader component */}
        <div className="mb-12 sm:mb-16">
          <SectionHeader
            badge="Success Stories"
            title="What Our Mentees Say"
            subtitle="Real stories from professionals who transformed their careers with our mentorship"
          />
        </div>

        {/* Infinite Scrolling Testimonials - Row 1 (Left to Right) */}
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden">
            <div className="flex animate-scroll-testimonials-left hover:pause-animation">
              {[...testimonialsRow1, ...testimonialsRow1].map((testimonial, i) => (
                <TestimonialCard key={`row1-${i}`} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </div>

        {/* Infinite Scrolling Testimonials - Row 2 (Right to Left) */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden">
            <div className="flex animate-scroll-testimonials-right hover:pause-animation">
              {[...testimonialsRow2, ...testimonialsRow2].map((testimonial, i) => (
                <TestimonialCard key={`row2-${i}`} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes scroll-testimonials-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-testimonials-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-testimonials-left {
          animation: scroll-testimonials-left 40s linear infinite;
        }
        .animate-scroll-testimonials-right {
          animation: scroll-testimonials-right 40s linear infinite;
        }
        .hover\\:pause-animation:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
