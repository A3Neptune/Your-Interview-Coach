// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import { ChevronRight, MessageCircle, Mail, ArrowUpRight } from 'lucide-react';
// import SectionHeader from '@/components/SectionHeader';

// const faqs = [
//   {
//     question: 'How does mentor matching work?',
//     answer: 'Our AI-powered system analyzes your career goals, industry preferences, experience level, and learning style to find the perfect mentor match. You can also browse and select mentors manually.',
//     category: 'Getting Started',
//   },
//   {
//     question: 'Can I switch mentors?',
//     answer: 'Yes, you can request a mentor change at any time. We understand finding the right fit is important, and our team will help you find a better match at no extra cost.',
//     category: 'Mentorship',
//   },
//   {
//     question: 'What happens in a mentorship session?',
//     answer: 'Sessions are 45-60 minutes and tailored to your needs - career guidance, resume reviews, mock interviews, skill development, or industry insights. You set the agenda.',
//     category: 'Mentorship',
//   },
//   {
//     question: 'Is there a free trial?',
//     answer: 'Yes! Start with our free plan to access community forums and group sessions. Pro plan also offers a 14-day free trial for 1-on-1 mentorship.',
//     category: 'Pricing',
//   },
//   {
//     question: "What if I'm not satisfied?",
//     answer: "We offer a 14-day money-back guarantee for all paid plans. If you're not happy, contact support for a full refund, no questions asked.",
//     category: 'Pricing',
//   },
//   {
//     question: 'How do I prepare for sessions?',
//     answer: 'Before each session, jot down your goals and questions. Your mentor will guide the conversation, but coming prepared helps maximize value from each meeting.',
//     category: 'Getting Started',
//   },
// ];

// export default function FAQSection() {
//   const [activeIndex, setActiveIndex] = useState<number | null>(0);
//   const [isVisible, setIsVisible] = useState(false);
//   const sectionRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//         }
//       },
//       { threshold: 0.2 }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <section className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 overflow-hidden" id="faq" ref={sectionRef}>
//       {/* Background Elements - Left Side */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
//         <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
//       </div>

//       <div className="relative max-w-6xl mx-auto">
//         <SectionHeader
//           badge="FAQ"
//           title="Common questions"
//           subtitle="Everything you need to know about CareerCoach"
//         />

//         <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
//           {/* Left - FAQ List */}
//           <div className="lg:col-span-3 space-y-2 sm:space-y-3">
//             {faqs.map((faq, index) => {
//               const isActive = activeIndex === index;
//               return (
//                 <div
//                   key={index}
//                   className={`group rounded-2xl sm:rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
//                     isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
//                   } ${
//                     isActive
//                       ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-300'
//                       : 'bg-white border-blue-100 hover:bg-blue-50/50 hover:border-blue-200'
//                   }`}
//                   style={{ transitionDelay: `${index * 50}ms` }}
//                 >
//                   <button
//                     onClick={() => setActiveIndex(isActive ? null : index)}
//                     className="w-full flex items-start gap-3 sm:gap-4 p-4 sm:p-5 text-left"
//                   >
//                     <div
//                       className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] sm:text-xs font-medium transition-all duration-300 font-accent ${
//                         isActive
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
//                       }`}
//                     >
//                       {String(index + 1).padStart(2, '0')}
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <span
//                         className={`inline-block text-[9px] sm:text-[10px] uppercase tracking-wider mb-1.5 sm:mb-2 transition-colors duration-300 font-body ${
//                           isActive ? 'text-blue-600' : 'text-slate-500'
//                         }`}
//                       >
//                         {faq.category}
//                       </span>
//                       <h3
//                         className={`text-sm sm:text-base font-medium transition-colors duration-300 font-heading ${
//                           isActive ? 'text-blue-600' : 'text-slate-700'
//                         }`}
//                       >
//                         {faq.question}
//                       </h3>
//                     </div>

//                     <ChevronRight
//                       className={`w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0 transition-all duration-300 ${
//                         isActive
//                           ? 'rotate-90 text-blue-600'
//                           : 'text-slate-400 group-hover:text-blue-500'
//                       }`}
//                     />
//                   </button>

//                   <div
//                     className={`grid transition-all duration-500 ease-out ${
//                       isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
//                     }`}
//                   >
//                     <div className="overflow-hidden">
//                       <p className="px-4 sm:px-5 pb-4 sm:pb-5 pl-[52px] sm:pl-[68px] text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
//                         {faq.answer}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Right - Contact Card */}
//           <div className="lg:col-span-2">
//             <div
//               className={`sticky top-24 sm:top-28 transition-all duration-700 delay-300 ${
//                 isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
//               }`}
//             >
//               <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 mb-3 sm:mb-4 hover:scale-105 transition-all duration-300">
//                 <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4 sm:mb-5">
//                   <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
//                 </div>
//                 <h4 className="text-base sm:text-lg font-semibold text-blue-600 mb-1.5 sm:mb-2 font-heading">
//                   Still have questions?
//                 </h4>
//                 <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-5 leading-relaxed font-body">
//                   Can&apos;t find what you&apos;re looking for? Our support team is here to help.
//                 </p>
//                 <a
//                   href="/contact"
//                   className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group font-heading"
//                 >
//                   Contact support
//                   <ArrowUpRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//                 </a>
//               </div>

//               <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border-2 border-blue-100 hover:border-blue-200 hover:scale-105 transition-all duration-300">
//                 <div className="flex items-start gap-3 sm:gap-4">
//                   <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
//                     <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
//                   </div>
//                   <div>
//                     <h4 className="text-xs sm:text-sm font-medium text-slate-900 mb-0.5 sm:mb-1 font-heading">Email us directly</h4>
//                     <a
//                       href="mailto:support@careercoach.app"
//                       className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition-colors font-body"
//                     >
//                       support@careercoach.app
//                     </a>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-3 sm:mt-4 flex items-center gap-2 px-1">
//                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
//                 <span className="text-[10px] sm:text-xs text-slate-600 font-body">Usually responds within 2 hours</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight, MessageCircle, Mail, ArrowUpRight } from 'lucide-react';

const faqs = [
  {
    question: 'How does mentor matching work?',
    answer: 'You are directly paired with Neel Aashish Seru — a seasoned interview coach with 10+ years of experience. No algorithm, no guesswork. Just expert, personalised coaching from day one.',
    category: 'Getting Started',
  },
  {
    question: 'Can I switch mentors?',
    answer: 'Yes, you can request a mentor change at any time. We understand finding the right fit is important, and our team will help you find a better match at no extra cost.',
    category: 'Mentorship',
  },
  {
    question: 'What happens in a mentorship session?',
    answer: 'Sessions are 45–60 minutes and tailored to your needs — career guidance, resume reviews, mock interviews, skill development, or industry insights. You set the agenda.',
    category: 'Mentorship',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! Start with our free plan to access community forums and group sessions. Pro plan also offers a 14-day free trial for 1-on-1 mentorship.',
    category: 'Pricing',
  },
  {
    question: "What if I'm not satisfied?",
    answer: "We offer a 14-day money-back guarantee for all paid plans. If you're not happy, contact support for a full refund — no questions asked.",
    category: 'Pricing',
  },
  {
    question: 'How do I prepare for sessions?',
    answer: 'Before each session, jot down your goals and questions. Neel will guide the conversation, but coming prepared helps maximise the value from every meeting.',
    category: 'Getting Started',
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [visible, setVisible]         = useState(false);
  const sectionRef                    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .faq-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        .faq-item {
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, opacity 0.55s ease, transform 0.55s cubic-bezier(.23,1,.32,1);
        }
        .faq-item:not(.faq-active):hover {
          border-color: rgba(29,78,216,0.20) !important;
          background: rgba(255,255,255,0.95) !important;
          box-shadow: 0 4px 18px rgba(29,78,216,0.07) !important;
        }
        .faq-active {
          border-color: rgba(29,78,216,0.25) !important;
          background: #fff !important;
          box-shadow: 0 6px 28px rgba(29,78,216,0.10) !important;
        }

        .faq-answer {
          display: grid;
          transition: grid-template-rows 0.42s cubic-bezier(.23,1,.32,1);
        }

        .side-card {
          transition: transform 0.3s cubic-bezier(.23,1,.32,1), box-shadow 0.3s ease, border-color 0.25s ease;
        }
        .side-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(29,78,216,0.11) !important;
          border-color: rgba(29,78,216,0.22) !important;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(1.2); }
        }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
      `}</style>

      <section
        id="faq"
        ref={sectionRef}
        className="faq-grain relative py-20 lg:py-32 px-4 sm:px-6 overflow-hidden"
        style={{ background: '#f8f6f1', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
          <div style={{ position:'absolute', top:'8%', left:'-3%', width:420, height:420, borderRadius:'50%', background:'radial-gradient(circle,rgba(29,78,216,0.06) 0%,transparent 70%)', filter:'blur(90px)' }} />
          <div style={{ position:'absolute', bottom:'10%', left:'20%', width:340, height:340, borderRadius:'50%', background:'radial-gradient(circle,rgba(8,145,178,0.05) 0%,transparent 70%)', filter:'blur(90px)' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 border"
              style={{ background:'rgba(29,78,216,0.05)', borderColor:'rgba(29,78,216,0.15)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              <span style={{ fontSize:11, fontWeight:600, color:'#1d40b0', letterSpacing:'0.10em', textTransform:'uppercase' }}>FAQ</span>
            </div>
            <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:300, letterSpacing:'-0.025em', lineHeight:1.1, color:'#0f172a', marginBottom:14 }}>
              Common{' '}
              <span style={{ fontWeight:600, color:'#1d4ed8', fontStyle:'italic' }}>questions</span>
            </h2>
            <p style={{ fontSize:16, color:'#64748b', maxWidth:420, margin:'0 auto', lineHeight:1.7 }}>
              Everything you need to know before booking your first session.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 lg:gap-12">

            {/* ── LEFT: FAQ accordion ── */}
            <div className="lg:col-span-3 space-y-2.5">
              {faqs.map((faq, i) => {
                const isActive = activeIndex === i;
                return (
                  <div
                    key={i}
                    className={`faq-item rounded-2xl border overflow-hidden ${isActive ? 'faq-active' : ''}`}
                    style={{
                      background: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                      borderColor: 'rgba(29,78,216,0.10)',
                      boxShadow: '0 1px 6px rgba(29,78,216,0.04)',
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateY(0)' : 'translateY(14px)',
                      transitionDelay: `${i * 45}ms`,
                    }}
                  >
                    <button
                      onClick={() => setActiveIndex(isActive ? null : i)}
                      className="w-full flex items-start gap-3.5 p-4 sm:p-5 text-left"
                    >
                      {/* Number badge */}
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-[11px] font-bold transition-all duration-300"
                        style={{
                          background: isActive
                            ? 'linear-gradient(135deg,#1e3a8a,#1d4ed8)'
                            : 'rgba(29,78,216,0.07)',
                          color: isActive ? '#fff' : '#1d4ed8',
                          boxShadow: isActive ? '0 4px 12px rgba(29,78,216,0.25)' : 'none',
                          transition: 'background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </div>

                      <div className="flex-1 min-w-0 pt-0.5">
                        <span style={{
                          display: 'block',
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.10em',
                          color: isActive ? '#1d4ed8' : '#94a3b8',
                          marginBottom: 5,
                          transition: 'color 0.25s ease',
                        }}>
                          {faq.category}
                        </span>
                        <h3 style={{
                          fontSize: 'clamp(13.5px,1.4vw,15px)',
                          fontWeight: 600,
                          color: isActive ? '#0f172a' : '#475569',
                          lineHeight: 1.45,
                          letterSpacing: '-0.01em',
                          transition: 'color 0.25s ease',
                        }}>
                          {faq.question}
                        </h3>
                      </div>

                      <div
                        className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center mt-0.5"
                        style={{
                          background: isActive ? 'rgba(29,78,216,0.09)' : 'transparent',
                          transition: 'background 0.25s ease',
                        }}
                      >
                        <ChevronRight
                          style={{
                            width: 15, height: 15,
                            color: isActive ? '#1d4ed8' : '#94a3b8',
                            transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s cubic-bezier(.23,1,.32,1), color 0.25s ease',
                          }}
                        />
                      </div>
                    </button>

                    {/* Answer */}
                    <div
                      className="faq-answer"
                      style={{ gridTemplateRows: isActive ? '1fr' : '0fr' }}
                    >
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{
                          padding: '0 20px 18px 60px',
                          borderTop: isActive ? '1px solid rgba(29,78,216,0.07)' : 'none',
                          paddingTop: isActive ? 14 : 0,
                        }}>
                          <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.75, fontWeight: 400 }}>
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── RIGHT: contact cards ── */}
            <div className="lg:col-span-2">
              <div
                className="sticky top-28 space-y-3"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.6s ease 0.3s, transform 0.6s cubic-bezier(.23,1,.32,1) 0.3s',
                }}
              >
                {/* Still have questions */}
                <div
                  className="side-card bg-white rounded-2xl border p-5 sm:p-6"
                  style={{ borderColor:'rgba(29,78,216,0.12)', boxShadow:'0 2px 16px rgba(29,78,216,0.06)' }}
                >
                  {/* top accent */}
                  <div className="h-0.5 w-9 rounded-full mb-5"
                    style={{ background:'linear-gradient(90deg,#1d4ed8,rgba(29,78,216,0.3))' }} />

                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background:'linear-gradient(135deg,#1e3a8a,#1d4ed8)', boxShadow:'0 4px 14px rgba(29,78,216,0.28)' }}>
                    <MessageCircle style={{ width:18, height:18, color:'#fff' }} />
                  </div>

                  <h4 style={{ fontSize:16, fontWeight:600, color:'#0f172a', marginBottom:8, letterSpacing:'-0.01em' }}>
                    Still have questions?
                  </h4>
                  <p style={{ fontSize:13.5, color:'#64748b', lineHeight:1.7, marginBottom:18 }}>
                    Can't find what you're looking for? Our support team usually responds within 2 hours.
                  </p>

                  <a
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold group"
                    style={{ color:'#1d4ed8' }}
                  >
                    Contact support
                    <ArrowUpRight
                      style={{ width:15, height:15, transition:'transform 0.2s ease' }}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </div>

                {/* Email card */}
                <div
                  className="side-card bg-white rounded-2xl border p-5"
                  style={{ borderColor:'rgba(29,78,216,0.10)', boxShadow:'0 2px 12px rgba(29,78,216,0.05)' }}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background:'rgba(29,78,216,0.08)' }}>
                      <Mail style={{ width:16, height:16, color:'#1d4ed8' }} />
                    </div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:600, color:'#0f172a', marginBottom:3 }}>Email us directly</p>
                      <a
                        href="mailto:support@careercoach.app"
                        style={{ fontSize:13, color:'#1d4ed8', fontWeight:500 }}
                        className="hover:underline underline-offset-2 transition-all"
                      >
                        support@careercoach.app
                      </a>
                    </div>
                  </div>
                </div>

                {/* Status chip */}
                <div className="flex items-center gap-2 px-1 pt-1">
                  <span className="pulse-dot w-2 h-2 rounded-full inline-block" style={{ background:'#1d4ed8' }} />
                  <span style={{ fontSize:12, color:'#94a3b8', fontWeight:500 }}>
                    Usually responds within 2 hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}