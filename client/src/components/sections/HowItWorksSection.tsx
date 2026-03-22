// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { UserPlus, Search, Video, TrendingUp, Check } from 'lucide-react';
// import SectionHeader from '@/components/SectionHeader';

// const steps = [
//   {
//     id: 1,
//     icon: UserPlus,
//     title: 'Create Profile',
//     description: 'Set up your profile in minutes. Tell us about your background, skills, and career goals.',
//     highlight: '5 min setup',
//   },
//   {
//     id: 2,
//     icon: Search,
//     title: 'Get Matched',
//     description: 'Our algorithm finds mentors who match your industry, experience level, and learning style.',
//     highlight: 'AI-powered',
//   },
//   {
//     id: 3,
//     icon: Video,
//     title: 'Start Sessions',
//     description: 'Book 1-on-1 video calls at times that work for you. Get personalized advice and feedback.',
//     highlight: 'Flexible times',
//   },
//   {
//     id: 4,
//     icon: TrendingUp,
//     title: 'Grow Career',
//     description: 'Follow your roadmap, complete milestones, and land your dream job with confidence.',
//     highlight: 'Track progress',
//   },
// ];

// export default function HowItWorksSection() {
//   const [activeStep, setActiveStep] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const sectionRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (!sectionRef.current) return;

//       const sectionTop = sectionRef.current.offsetTop;
//       const sectionHeight = sectionRef.current.offsetHeight;
//       const scrollY = window.scrollY;
//       const windowHeight = window.innerHeight;

//       const sectionStart = sectionTop - windowHeight * 0.5;
//       const sectionEnd = sectionTop + sectionHeight - windowHeight * 0.5;
//       const scrollProgress = (scrollY - sectionStart) / (sectionEnd - sectionStart);

//       const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
//       setProgress(clampedProgress);

//       const newActiveStep = Math.min(
//         steps.length - 1,
//         Math.floor(clampedProgress * steps.length)
//       );
//       setActiveStep(newActiveStep);
//     };

//     window.addEventListener('scroll', handleScroll, { passive: true });
//     handleScroll();

//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <section id="how-it-works" className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 overflow-hidden" ref={sectionRef}>
//       {/* Background Elements - Left Side */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
//         <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
//       </div>

//       <div className="relative max-w-5xl mx-auto">
//         <SectionHeader
//           badge="Process"
//           title="How it works"
//           subtitle="Your journey to career success in four simple steps"
//         />

//         <div className="relative">
//           {/* Center line - Desktop */}
//           <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
//             <div className="absolute inset-0 bg-blue-200" />
//             <div
//               className="absolute top-0 left-0 right-0 bg-gradient-to-b from-blue-500 via-blue-400 to-transparent transition-all duration-300 ease-out"
//               style={{ height: `${progress * 100}%` }}
//             />
//           </div>

//           <div className="space-y-6 sm:space-y-8 lg:space-y-0">
//             {steps.map((step, idx) => {
//               const Icon = step.icon;
//               const isActive = idx <= activeStep;
//               const isCurrent = idx === activeStep;
//               const isCompleted = idx < activeStep;
//               const isLeft = idx % 2 === 0;

//               return (
//                 <div key={step.id} className="relative lg:min-h-[200px]">
//                   {/* Desktop Layout */}
//                   <div className="hidden lg:block">
//                     <div className="absolute left-1/2 top-8 -translate-x-1/2 z-10">
//                       <div
//                         className={`relative w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ease-out border-2 ${
//                           isCurrent
//                             ? 'bg-blue-600 text-white border-blue-700 rotate-0 scale-100'
//                             : isCompleted
//                             ? 'bg-blue-200 text-blue-600 border-blue-300 rotate-0 scale-95'
//                             : 'bg-blue-50 text-blue-300 border-blue-200 rotate-3 scale-90'
//                         }`}
//                       >
//                         {isCompleted ? (
//                           <Check className="w-5 h-5" strokeWidth={2.5} />
//                         ) : (
//                           <Icon className="w-5 h-5" />
//                         )}
//                         <div className={`absolute -top-2 -right-2 w-5 sm:w-6 h-5 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-semibold transition-all duration-300 font-accent ${
//                           isCurrent
//                             ? 'bg-white text-blue-600'
//                             : isCompleted
//                             ? 'bg-blue-400 text-white'
//                             : 'bg-blue-200 text-blue-500'
//                         }`}>
//                           {step.id}
//                         </div>
//                       </div>
//                     </div>

//                     <div
//                       className={`absolute top-0 w-[calc(50%-60px)] transition-all duration-700 ease-out ${
//                         isLeft ? 'left-0 pr-8' : 'right-0 pl-8'
//                       }`}
//                       style={{
//                         opacity: isActive ? 1 : 0.3,
//                         transform: `translateX(${isActive ? '0' : isLeft ? '-20px' : '20px'}) translateY(${isActive ? '0' : '10px'})`,
//                       }}
//                     >
//                       <div
//                         className={`p-5 sm:p-6 rounded-2xl border-2 transition-all duration-500 ${
//                           isCurrent
//                             ? 'bg-blue-50 border-blue-300'
//                             : 'bg-white border-blue-100'
//                         } ${isLeft ? 'text-right' : 'text-left'}`}
//                       >
//                         <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3 sm:mb-4 transition-colors duration-300 ${
//                           isCurrent ? 'bg-blue-100' : 'bg-blue-50'
//                         } ${isLeft ? 'flex-row-reverse' : ''}`}>
//                           <div className={`w-1 h-1 rounded-full transition-colors duration-300 ${
//                             isCurrent ? 'bg-blue-500' : 'bg-blue-300'
//                           }`} />
//                           <span className={`text-[9px] sm:text-[10px] uppercase tracking-wider transition-colors duration-300 font-body ${
//                             isCurrent ? 'text-blue-600' : 'text-blue-400'
//                           }`}>
//                             {step.highlight}
//                           </span>
//                         </div>

//                         <h3 className={`text-lg sm:text-xl font-semibold mb-2 transition-colors duration-300 font-heading ${
//                           isCurrent ? 'text-blue-600' : 'text-slate-500'
//                         }`}>
//                           {step.title}
//                         </h3>

//                         <p className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 font-body ${
//                           isCurrent ? 'text-slate-700' : 'text-slate-500'
//                         }`}>
//                           {step.description}
//                         </p>

//                         <div
//                           className={`absolute top-10 w-8 h-px transition-all duration-500 ${
//                             isLeft ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'
//                           } ${isActive ? 'opacity-100' : 'opacity-30'}`}
//                         >
//                           <div className={`h-full transition-colors duration-300 ${
//                             isCurrent ? 'bg-blue-400' : 'bg-blue-200'
//                           }`} />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Mobile Layout */}
//                   <div className="lg:hidden">
//                     <div
//                       className={`flex gap-3 sm:gap-4 transition-all duration-500 ease-out`}
//                       style={{
//                         opacity: isActive ? 1 : 0.4,
//                         transform: `translateX(${isActive ? '0' : '-8px'})`,
//                       }}
//                     >
//                       <div className="flex flex-col items-center">
//                         <div
//                           className={`relative w-10 sm:w-12 h-10 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 border-2 ${
//                             isCurrent
//                               ? 'bg-blue-600 text-white border-blue-700'
//                               : isCompleted
//                               ? 'bg-blue-200 text-blue-600 border-blue-300'
//                               : 'bg-blue-50 text-blue-300 border-blue-200'
//                           }`}
//                         >
//                           {isCompleted ? (
//                             <Check className="w-4 h-4" strokeWidth={2.5} />
//                           ) : (
//                             <Icon className="w-4 h-4" />
//                           )}
//                           <div className={`absolute -top-1.5 -right-1.5 w-4 sm:w-5 h-4 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-semibold font-accent ${
//                             isCurrent
//                               ? 'bg-white text-blue-600'
//                               : 'bg-blue-200 text-blue-500'
//                           }`}>
//                             {step.id}
//                           </div>
//                         </div>

//                         {idx < steps.length - 1 && (
//                           <div className="w-px flex-1 my-2 sm:my-3 relative overflow-hidden">
//                             <div className="absolute inset-0 bg-blue-200" />
//                             <div
//                               className="absolute top-0 left-0 right-0 bg-gradient-to-b from-blue-500 to-transparent transition-all duration-500"
//                               style={{ height: isActive ? '100%' : '0%' }}
//                             />
//                           </div>
//                         )}
//                       </div>

//                       <div className="flex-1 pb-6 sm:pb-8">
//                         <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mb-2 sm:mb-3 transition-colors duration-300 ${
//                           isCurrent ? 'bg-blue-100' : 'bg-blue-50'
//                         }`}>
//                           <div className={`w-1 h-1 rounded-full ${isCurrent ? 'bg-blue-500' : 'bg-blue-300'}`} />
//                           <span className={`text-[8px] sm:text-[9px] uppercase tracking-wider font-body ${
//                             isCurrent ? 'text-blue-600' : 'text-blue-400'
//                           }`}>
//                             {step.highlight}
//                           </span>
//                         </div>

//                         <h3 className={`text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 transition-colors duration-300 font-heading ${
//                           isCurrent ? 'text-blue-600' : 'text-slate-500'
//                         }`}>
//                           {step.title}
//                         </h3>

//                         <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-body">
//                           {step.description}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div
//             className={`mt-8 sm:mt-12 lg:mt-8 flex justify-center transition-all duration-700 ease-out ${
//               activeStep >= steps.length - 1
//                 ? 'opacity-100 translate-y-0'
//                 : 'opacity-0 translate-y-6 pointer-events-none'
//             }`}
//           >
//             <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-blue-50 border-2 border-blue-200">
//               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
//               <span className="text-xs sm:text-sm text-blue-600 font-body">Ready to start your journey</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


'use client';

import { useEffect, useRef, useState } from 'react';
import { UserPlus, Video, TrendingUp, Check, Star, Award, MessageSquare } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Set up your profile in minutes. Share your background, target role, and career goals so we can personalise every session for you.',
    highlight: '5 min setup',
    detail: 'No lengthy forms. Just the essentials.',
  },
  {
    id: 2,
    icon: MessageSquare,
    title: 'Meet Your Mentor',
    description: 'Get paired directly with Neel Aashish Seru — a seasoned interview coach with 10+ years of experience helping candidates land top roles across industries.',
    highlight: 'Expert mentor',
    detail: null,
    isMentorStep: true,
  },
  {
    id: 3,
    icon: Video,
    title: 'Start Sessions',
    description: 'Book 1-on-1 video calls at times that work for you. Every session is tailored — real mock interviews, live feedback, and actionable improvement plans.',
    highlight: 'Flexible times',
    detail: 'Morning, evening, weekends — your schedule.',
  },
  {
    id: 4,
    icon: TrendingUp,
    title: 'Land Your Offer',
    description: 'Walk into every interview prepared and confident. Track your growth, complete milestones, and join the 94% of candidates who get their dream role.',
    highlight: '94% success rate',
    detail: 'Real results, not just practice.',
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionStart = sectionTop - windowHeight * 0.5;
      const sectionEnd = sectionTop + sectionHeight - windowHeight * 0.5;
      const scrollProgress = (scrollY - sectionStart) / (sectionEnd - sectionStart);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      setProgress(clampedProgress);
      setActiveStep(Math.min(steps.length - 1, Math.floor(clampedProgress * steps.length)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .hiw-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        .step-card {
          transition: opacity 0.6s cubic-bezier(.23,1,.32,1), transform 0.6s cubic-bezier(.23,1,.32,1), border-color 0.4s ease, background 0.4s ease, box-shadow 0.4s ease;
        }

        .step-icon {
          transition: background 0.4s ease, color 0.4s ease, transform 0.4s cubic-bezier(.23,1,.32,1), box-shadow 0.4s ease;
        }

        .connector-line {
          transition: height 0.5s ease;
        }

        .mentor-card-inner {
          background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #3b82f6 100%);
        }

        @keyframes subtle-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.15); }
        }
        .pulse-dot { animation: subtle-pulse 2s ease-in-out infinite; }

        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        .float-card { animation: float-card 4s ease-in-out infinite; }

        .ready-badge {
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(.23,1,.32,1);
        }
      `}</style>

      <section
        id="how-it-works"
        ref={sectionRef}
        className="hiw-grain relative py-20 lg:py-32 px-4 sm:px-6 overflow-hidden"
        style={{ background: '#f8f6f1', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        {/* Grid lines */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(29,78,216,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(29,78,216,0.03) 1px,transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Ambient blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.06) 0%, transparent 70%)', filter: 'blur(80px)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(8,145,178,0.05) 0%, transparent 70%)', filter: 'blur(80px)', transform: 'translate(-30%,30%)' }} />

        <div className="relative z-10 max-w-5xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 border"
              style={{ background: 'rgba(29,78,216,0.05)', borderColor: 'rgba(29,78,216,0.15)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              <span className="text-[11px] font-semibold text-blue-700 tracking-[0.10em] uppercase">The Process</span>
            </div>
            <h2 className="text-slate-900 mb-4"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
              How it <span style={{ fontWeight: 600, color: '#1d4ed8', fontStyle: 'italic' }}>works</span>
            </h2>
            <p className="text-slate-500 max-w-md mx-auto" style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7 }}>
              Four steps from sign-up to offer letter
            </p>
          </div>

          {/* Steps */}
          <div className="relative">

            {/* ── DESKTOP: center vertical line ── */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-px" style={{ width: 1 }}>
              <div className="absolute inset-0" style={{ background: 'rgba(29,78,216,0.12)' }} />
              <div
                className="absolute top-0 left-0 right-0 connector-line"
                style={{
                  height: `${progress * 100}%`,
                  background: 'linear-gradient(to bottom, #1d4ed8, rgba(29,78,216,0.3))',
                }}
              />
            </div>

            <div className="space-y-6 lg:space-y-0">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx <= activeStep;
                const isCurrent = idx === activeStep;
                const isCompleted = idx < activeStep;
                const isLeft = idx % 2 === 0;

                return (
                  <div key={step.id} className="relative lg:min-h-[220px]">

                    {/* ── DESKTOP ── */}
                    <div className="hidden lg:block">

                      {/* Center icon node */}
                      <div className="absolute left-1/2 top-8 -translate-x-1/2 z-10">
                        <div
                          className="step-icon relative w-14 h-14 rounded-2xl flex items-center justify-center border-2"
                          style={{
                            background: isCurrent ? '#1e3a8a' : isCompleted ? 'rgba(29,78,216,0.15)' : 'rgba(255,255,255,0.8)',
                            borderColor: isCurrent ? '#1d4ed8' : isCompleted ? 'rgba(29,78,216,0.3)' : 'rgba(29,78,216,0.15)',
                            color: isCurrent ? '#fff' : isCompleted ? '#1d4ed8' : 'rgba(29,78,216,0.35)',
                            transform: isCurrent ? 'scale(1.08)' : isCompleted ? 'scale(1)' : 'scale(0.92)',
                            boxShadow: isCurrent ? '0 8px 28px rgba(29,78,216,0.30)' : 'none',
                          }}
                        >
                          {isCompleted
                            ? <Check className="w-5 h-5" strokeWidth={2.5} />
                            : <Icon className="w-5 h-5" />
                          }

                          {/* Step number badge */}
                          <div
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                            style={{
                              background: isCurrent ? '#fff' : isCompleted ? '#1d4ed8' : 'rgba(29,78,216,0.15)',
                              color: isCurrent ? '#1d4ed8' : isCompleted ? '#fff' : 'rgba(29,78,216,0.5)',
                            }}
                          >
                            {step.id}
                          </div>
                        </div>
                      </div>

                      {/* Card */}
                      <div
                        className={`absolute top-0 w-[calc(50%-68px)] ${isLeft ? 'left-0 pr-6' : 'right-0 pl-6'}`}
                        style={{
                          opacity: isActive ? 1 : 0.28,
                          transform: `translateX(${isActive ? 0 : isLeft ? -16 : 16}px) translateY(${isActive ? 0 : 8}px)`,
                          transition: 'opacity 0.6s cubic-bezier(.23,1,.32,1), transform 0.6s cubic-bezier(.23,1,.32,1)',
                        }}
                      >
                        {/* MENTOR STEP — special card */}
                        {step.isMentorStep ? (
                          <div className={`rounded-2xl overflow-hidden border-2 ${isCurrent ? 'border-blue-300' : 'border-blue-100'}`}
                            style={{ boxShadow: isCurrent ? '0 12px 40px rgba(29,78,216,0.18)' : '0 2px 12px rgba(29,78,216,0.06)' }}>

                            {/* Dark gradient top */}
                            <div className="mentor-card-inner p-5 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
                                style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />
                              <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                  {/* Avatar */}
                                  <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white/20 shrink-0">
                                    <img
                                      src="/IMG-20241116-WA0012(1).jpg.jpeg"
                                      alt="Neel Aashish Seru"
                                      className="w-full h-full object-cover object-top"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-white font-semibold text-sm leading-tight">Neel Aashish Seru</p>
                                    <p className="text-white/50 text-[10px] tracking-wider uppercase mt-0.5">Your Interview Coach</p>
                                  </div>
                                  {/* Stars */}
                                  <div className="ml-auto flex gap-0.5">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                                  </div>
                                </div>

                                <div className="flex gap-4">
                                  <div className="text-center">
                                    <p className="text-white font-bold text-lg leading-none">10+</p>
                                    <p className="text-white/40 text-[9px] uppercase tracking-widest mt-0.5">Yrs Exp</p>
                                  </div>
                                  <div className="w-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
                                  <div className="text-center">
                                    <p className="text-white font-bold text-lg leading-none">500+</p>
                                    <p className="text-white/40 text-[9px] uppercase tracking-widest mt-0.5">Placed</p>
                                  </div>
                                  <div className="w-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
                                  <div className="text-center">
                                    <p className="text-white font-bold text-lg leading-none">94%</p>
                                    <p className="text-white/40 text-[9px] uppercase tracking-widest mt-0.5">Success</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* White bottom */}
                            <div className="bg-white p-4">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2"
                                style={{ background: 'rgba(29,78,216,0.08)' }}>
                                <Award className="w-3 h-3 text-blue-600" />
                                <span className="text-[9px] font-semibold text-blue-600 uppercase tracking-wider">{step.highlight}</span>
                              </div>
                              <h3 className="font-semibold text-slate-800 mb-1.5" style={{ fontSize: 16 }}>{step.title}</h3>
                              <p className="text-slate-500 leading-relaxed" style={{ fontSize: 13 }}>{step.description}</p>
                            </div>
                          </div>
                        ) : (
                          /* Regular step card */
                          <div
                            className="step-card p-5 rounded-2xl border-2"
                            style={{
                              background: isCurrent ? '#fff' : 'rgba(255,255,255,0.65)',
                              borderColor: isCurrent ? 'rgba(29,78,216,0.28)' : 'rgba(29,78,216,0.10)',
                              boxShadow: isCurrent ? '0 8px 32px rgba(29,78,216,0.12)' : '0 2px 8px rgba(29,78,216,0.04)',
                              textAlign: isLeft ? 'right' : 'left',
                            }}
                          >
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3 ${isLeft ? 'flex-row-reverse' : ''}`}
                              style={{ background: isCurrent ? 'rgba(29,78,216,0.08)' : 'rgba(29,78,216,0.04)' }}>
                              <span className="w-1.5 h-1.5 rounded-full inline-block"
                                style={{ background: isCurrent ? '#1d4ed8' : 'rgba(29,78,216,0.3)' }} />
                              <span className="text-[9px] font-semibold uppercase tracking-wider"
                                style={{ color: isCurrent ? '#1d4ed8' : 'rgba(29,78,216,0.45)' }}>
                                {step.highlight}
                              </span>
                            </div>

                            <h3 className="font-semibold mb-2 transition-colors duration-300"
                              style={{ fontSize: 17, color: isCurrent ? '#0f172a' : '#94a3b8', letterSpacing: '-0.01em' }}>
                              {step.title}
                            </h3>
                            <p className="leading-relaxed mb-3" style={{ fontSize: 13, color: isCurrent ? '#64748b' : '#94a3b8' }}>
                              {step.description}
                            </p>
                            {step.detail && (
                              <p className="text-[11px] font-semibold"
                                style={{ color: isCurrent ? 'rgba(29,78,216,0.6)' : 'rgba(29,78,216,0.2)' }}>
                                {step.detail}
                              </p>
                            )}

                            {/* Connector arm */}
                            <div
                              className={`absolute top-10 w-7 h-px ${isLeft ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'}`}
                              style={{ background: isCurrent ? 'rgba(29,78,216,0.35)' : 'rgba(29,78,216,0.12)', opacity: isActive ? 1 : 0.3 }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ── MOBILE ── */}
                    <div className="lg:hidden">
                      <div
                        className="flex gap-4"
                        style={{
                          opacity: isActive ? 1 : 0.3,
                          transform: `translateX(${isActive ? 0 : -10}px)`,
                          transition: 'opacity 0.5s ease, transform 0.5s ease',
                        }}
                      >
                        {/* Left: icon + line */}
                        <div className="flex flex-col items-center shrink-0">
                          <div
                            className="step-icon w-11 h-11 rounded-xl flex items-center justify-center border-2 shrink-0"
                            style={{
                              background: isCurrent ? '#1e3a8a' : isCompleted ? 'rgba(29,78,216,0.12)' : 'rgba(255,255,255,0.8)',
                              borderColor: isCurrent ? '#1d4ed8' : isCompleted ? 'rgba(29,78,216,0.25)' : 'rgba(29,78,216,0.12)',
                              color: isCurrent ? '#fff' : isCompleted ? '#1d4ed8' : 'rgba(29,78,216,0.3)',
                            }}
                          >
                            {isCompleted ? <Check className="w-4 h-4" strokeWidth={2.5} /> : <Icon className="w-4 h-4" />}
                          </div>
                          {idx < steps.length - 1 && (
                            <div className="w-px flex-1 my-2 relative overflow-hidden" style={{ minHeight: 32 }}>
                              <div className="absolute inset-0" style={{ background: 'rgba(29,78,216,0.12)' }} />
                              <div className="absolute top-0 left-0 right-0 connector-line"
                                style={{ height: isActive ? '100%' : '0%', background: 'linear-gradient(to bottom,#1d4ed8,rgba(29,78,216,0.2))' }} />
                            </div>
                          )}
                        </div>

                        {/* Right: content */}
                        <div className="flex-1 pb-7">
                          {step.isMentorStep ? (
                            /* Mobile mentor card */
                            <div className="rounded-2xl overflow-hidden border-2 mb-1"
                              style={{ borderColor: isCurrent ? 'rgba(29,78,216,0.28)' : 'rgba(29,78,216,0.10)' }}>
                              <div className="mentor-card-inner p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/20 shrink-0">
                                    <img src="/IMG-20241116-WA0012(1).jpg.jpeg" alt="Neel" className="w-full h-full object-cover object-top" />
                                  </div>
                                  <div>
                                    <p className="text-white font-semibold text-sm">Neel Aashish Seru</p>
                                    <div className="flex gap-0.5 mt-0.5">
                                      {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />)}
                                    </div>
                                  </div>
                                  <div className="ml-auto text-right">
                                    <p className="text-white font-bold">10+</p>
                                    <p className="text-white/40 text-[9px] uppercase">Yrs Exp</p>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-white p-3.5">
                                <h3 className="font-semibold text-slate-800 mb-1" style={{ fontSize: 15 }}>{step.title}</h3>
                                <p className="text-slate-500" style={{ fontSize: 12, lineHeight: 1.65 }}>{step.description}</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full mb-2"
                                style={{ background: isCurrent ? 'rgba(29,78,216,0.08)' : 'rgba(29,78,216,0.04)' }}>
                                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: isCurrent ? '#1d4ed8' : 'rgba(29,78,216,0.3)' }} />
                                <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: isCurrent ? '#1d4ed8' : 'rgba(29,78,216,0.45)' }}>
                                  {step.highlight}
                                </span>
                              </div>
                              <h3 className="font-semibold mb-1.5" style={{ fontSize: 15, color: isCurrent ? '#0f172a' : '#94a3b8' }}>
                                {step.title}
                              </h3>
                              <p className="leading-relaxed" style={{ fontSize: 13, color: isCurrent ? '#64748b' : '#94a3b8' }}>
                                {step.description}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Ready badge */}
            <div
              className="ready-badge mt-10 lg:mt-6 flex justify-center"
              style={{
                opacity: activeStep >= steps.length - 1 ? 1 : 0,
                transform: activeStep >= steps.length - 1 ? 'translateY(0)' : 'translateY(14px)',
                pointerEvents: activeStep >= steps.length - 1 ? 'auto' : 'none',
              }}
            >
              <div className="flex items-center gap-3 px-5 py-3 rounded-full border"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  borderColor: 'rgba(29,78,216,0.20)',
                  boxShadow: '0 4px 20px rgba(29,78,216,0.08)',
                }}>
                <div className="pulse-dot w-2 h-2 rounded-full" style={{ background: '#1d4ed8' }} />
                <span className="text-sm font-medium text-slate-700">Ready to start your journey?</span>
                <a href="/signup" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors underline-offset-2 hover:underline">
                  Book a session →
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}