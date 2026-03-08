'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight, MessageCircle, Mail, ArrowUpRight } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';

const faqs = [
  {
    question: 'How does mentor matching work?',
    answer: 'Our AI-powered system analyzes your career goals, industry preferences, experience level, and learning style to find the perfect mentor match. You can also browse and select mentors manually.',
    category: 'Getting Started',
  },
  {
    question: 'Can I switch mentors?',
    answer: 'Yes, you can request a mentor change at any time. We understand finding the right fit is important, and our team will help you find a better match at no extra cost.',
    category: 'Mentorship',
  },
  {
    question: 'What happens in a mentorship session?',
    answer: 'Sessions are 45-60 minutes and tailored to your needs - career guidance, resume reviews, mock interviews, skill development, or industry insights. You set the agenda.',
    category: 'Mentorship',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! Start with our free plan to access community forums and group sessions. Pro plan also offers a 14-day free trial for 1-on-1 mentorship.',
    category: 'Pricing',
  },
  {
    question: "What if I'm not satisfied?",
    answer: "We offer a 14-day money-back guarantee for all paid plans. If you're not happy, contact support for a full refund, no questions asked.",
    category: 'Pricing',
  },
  {
    question: 'How do I prepare for sessions?',
    answer: 'Before each session, jot down your goals and questions. Your mentor will guide the conversation, but coming prepared helps maximize value from each meeting.',
    category: 'Getting Started',
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 overflow-hidden" id="faq" ref={sectionRef}>
      {/* Background Elements - Left Side */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <SectionHeader
          badge="FAQ"
          title="Common questions"
          subtitle="Everything you need to know about CareerCoach"
        />

        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
          {/* Left - FAQ List */}
          <div className="lg:col-span-3 space-y-2 sm:space-y-3">
            {faqs.map((faq, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={index}
                  className={`group rounded-2xl sm:rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  } ${
                    isActive
                      ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-300'
                      : 'bg-white border-blue-100 hover:bg-blue-50/50 hover:border-blue-200'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <button
                    onClick={() => setActiveIndex(isActive ? null : index)}
                    className="w-full flex items-start gap-3 sm:gap-4 p-4 sm:p-5 text-left"
                  >
                    <div
                      className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] sm:text-xs font-medium transition-all duration-300 font-accent ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span
                        className={`inline-block text-[9px] sm:text-[10px] uppercase tracking-wider mb-1.5 sm:mb-2 transition-colors duration-300 font-body ${
                          isActive ? 'text-blue-600' : 'text-slate-500'
                        }`}
                      >
                        {faq.category}
                      </span>
                      <h3
                        className={`text-sm sm:text-base font-medium transition-colors duration-300 font-heading ${
                          isActive ? 'text-blue-600' : 'text-slate-700'
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>

                    <ChevronRight
                      className={`w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0 transition-all duration-300 ${
                        isActive
                          ? 'rotate-90 text-blue-600'
                          : 'text-slate-400 group-hover:text-blue-500'
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-500 ease-out ${
                      isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-4 sm:px-5 pb-4 sm:pb-5 pl-[52px] sm:pl-[68px] text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right - Contact Card */}
          <div className="lg:col-span-2">
            <div
              className={`sticky top-24 sm:top-28 transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 mb-3 sm:mb-4 hover:scale-105 transition-all duration-300">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4 sm:mb-5">
                  <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-blue-600 mb-1.5 sm:mb-2 font-heading">
                  Still have questions?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-5 leading-relaxed font-body">
                  Can&apos;t find what you&apos;re looking for? Our support team is here to help.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group font-heading"
                >
                  Contact support
                  <ArrowUpRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border-2 border-blue-100 hover:border-blue-200 hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-slate-900 mb-0.5 sm:mb-1 font-heading">Email us directly</h4>
                    <a
                      href="mailto:support@careercoach.app"
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition-colors font-body"
                    >
                      support@careercoach.app
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 flex items-center gap-2 px-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] sm:text-xs text-slate-600 font-body">Usually responds within 2 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
