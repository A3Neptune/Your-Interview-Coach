// 'use client';

// import { useState, useEffect } from 'react';
// import { Users, Map, MessageSquare, TrendingUp } from 'lucide-react';
// import SectionHeader from '@/components/SectionHeader';

// const features = [
//   {
//     icon: Users,
//     title: 'Expert Mentorship',
//     subtitle: 'Learn from the best',
//     description: 'Get personalized guidance from Neel Ashish Seru, an expert with 10+ years of experience from Google, Meta, and Amazon. Tailored mentorship for your unique career path.',
//     highlights: ['10+ years experience', 'Industry expertise', 'Personalized guidance'],
//   },
//   {
//     icon: Map,
//     title: 'Smart Roadmaps',
//     subtitle: 'Your personalized path',
//     description: 'AI-powered career roadmaps that adapt to your goals. Get step-by-step guidance with milestones, resources, and progress tracking.',
//     highlights: ['Custom learning paths', 'Progress tracking', 'Adaptive goals'],
//   },
//   {
//     icon: MessageSquare,
//     title: 'Live Sessions',
//     subtitle: 'Real-time guidance',
//     description: 'Book 1-on-1 video calls, join group workshops, and attend live Q&A sessions. Learn at your pace with on-demand recordings.',
//     highlights: ['1-on-1 video calls', 'Group workshops', 'Session recordings'],
//   },
//   {
//     icon: TrendingUp,
//     title: 'Career Analytics',
//     subtitle: 'Track your progress',
//     description: 'Monitor your growth with detailed analytics. See skill improvements, milestone completions, and get AI-powered recommendations.',
//     highlights: ['Skill tracking', 'Goal completion', 'AI insights'],
//   },
// ];

// const INTERVAL = 4000;

// export default function FeaturesSection() {
//   const [current, setCurrent] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const [key, setKey] = useState(0); // For resetting animation

//   // Auto-rotate: 0 -> 1 -> 2 -> 3 -> 0 -> ...
//   useEffect(() => {
//     if (paused) return;

//     const timer = setTimeout(() => {
//       setCurrent((prev) => {
//         const next = prev + 1;
//         return next >= features.length ? 0 : next;
//       });
//       setKey((k) => k + 1); // Reset animation
//     }, INTERVAL);

//     return () => clearTimeout(timer);
//   }, [current, paused]);

//   const handleSelect = (idx: number) => {
//     setCurrent(idx);
//     setKey((k) => k + 1);
//   };

//   const active = features[current];
//   const ActiveIcon = active.icon;

//   return (
//     <section
//       id="features"
//       className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden"
//       onMouseEnter={() => setPaused(true)}
//       onMouseLeave={() => setPaused(false)}
//     >
//       {/* Background Elements - Right Side */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
//         <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
//       </div>

//       <div className="relative max-w-6xl mx-auto">
//         <SectionHeader
//           badge="Platform"
//           title="Built for career growth"
//           subtitle="Everything you need to accelerate your professional journey, all in one place."
//         />

//         <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
//           {/* Left - Navigation */}
//           <div className="space-y-2 sm:space-y-3">
//             {features.map((feature, idx) => {
//               const Icon = feature.icon;
//               const isActive = current === idx;

//               return (
//                 <button
//                   key={idx}
//                   onClick={() => handleSelect(idx)}
//                   className={`w-full text-left p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
//                     isActive
//                       ? 'bg-blue-50 border-blue-300'
//                       : 'bg-transparent border-transparent hover:bg-blue-50/50 hover:border-blue-200'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3 sm:gap-4">
//                     <div
//                       className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center transition-all duration-300 ${
//                         isActive
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-blue-100 text-blue-500'
//                       }`}
//                     >
//                       <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
//                     </div>
//                     <div className="flex-1">
//                       <div className={`text-sm sm:text-base font-medium transition-colors duration-300 font-heading ${isActive ? 'text-blue-600' : 'text-slate-600'}`}>
//                         {feature.title}
//                       </div>
//                       <div className="text-xs sm:text-sm text-slate-500 font-body">{feature.subtitle}</div>
//                     </div>
//                     {/* Progress ring */}
//                     {isActive && !paused && (
//                       <div className="w-7 h-7 sm:w-8 sm:h-8 hidden sm:block">
//                         <svg key={key} className="w-7 h-7 sm:w-8 sm:h-8 -rotate-90" viewBox="0 0 32 32">
//                           <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="2" />
//                           <circle
//                             cx="16"
//                             cy="16"
//                             r="12"
//                             fill="none"
//                             stroke="rgba(59, 130, 246, 0.8)"
//                             strokeWidth="2"
//                             strokeDasharray="75.4"
//                             strokeDashoffset="75.4"
//                             strokeLinecap="round"
//                             className="animate-progress"
//                           />
//                         </svg>
//                       </div>
//                     )}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* Right - Content */}
//           <div className="lg:sticky lg:top-24">
//             <div className="p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 min-h-[360px] sm:min-h-[420px]">
//               <div key={current} className="animate-fadeIn">
//                 <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
//                   <ActiveIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
//                 </div>

//                 <h3 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-2 sm:mb-3 font-heading">{active.title}</h3>
//                 <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 sm:mb-8 font-body">{active.description}</p>

//                 <div className="space-y-2 sm:space-y-3">
//                   {active.highlights.map((h, i) => (
//                     <div key={i} className="flex items-center gap-2 sm:gap-3">
//                       <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
//                       <span className="text-xs sm:text-sm text-slate-600 font-body">{h}</span>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-blue-200">
//                   <div className="flex items-center gap-3 sm:gap-4">
//                     <div className="flex -space-x-2">
//                       {['A', 'B', 'C'].map((l, i) => (
//                         <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-xs text-blue-600 font-body">
//                           {l}
//                         </div>
//                       ))}
//                     </div>
//                     <span className="text-xs sm:text-sm text-slate-600 font-body">Join 10k+ professionals</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile dots */}
//         <div className="flex justify-center gap-2 mt-6 sm:mt-8 lg:hidden">
//           {features.map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => handleSelect(idx)}
//               className={`h-2 rounded-full transition-all duration-300 ${
//                 current === idx ? 'bg-blue-600 w-8' : 'bg-blue-300 w-2'
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       <style jsx global>{`
//         @keyframes progress {
//           from { stroke-dashoffset: 75.4; }
//           to { stroke-dashoffset: 0; }
//         }
//         .animate-progress {
//           animation: progress 4s linear forwards;
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.35s ease-out;
//         }
//       `}</style>
//     </section>
//   );
// }




'use client';

import { useState, useEffect } from 'react';
import { Users, Map, MessageSquare, TrendingUp, Check } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Expert Mentorship',
    subtitle: 'Learn from the best',
    description: 'Get personalized guidance from Neel Aashish Seru — an expert with 10+ years of experience. Tailored coaching for your unique career path and target role.',
    highlights: ['10+ years of experience', 'Industry-specific coaching', 'Personalised every session'],
  },
  {
    icon: Map,
    title: 'Smart Roadmaps',
    subtitle: 'Your personalised path',
    description: 'AI-powered career roadmaps that adapt to your goals. Step-by-step guidance with milestones, curated resources, and real progress tracking.',
    highlights: ['Custom learning paths', 'Progress milestones', 'Adaptive goal-setting'],
  },
  {
    icon: MessageSquare,
    title: 'Live Sessions',
    subtitle: 'Real-time guidance',
    description: 'Book 1-on-1 video calls, join group workshops, and attend live Q&As. Learn at your own pace with on-demand session recordings.',
    highlights: ['1-on-1 video calls', 'Group workshops', 'On-demand recordings'],
  },
  {
    icon: TrendingUp,
    title: 'Career Analytics',
    subtitle: 'Track your growth',
    description: 'Monitor your improvement with detailed analytics. See skill gains, milestone completions, and get AI-powered recommendations for what to work on next.',
    highlights: ['Skill progression charts', 'Goal completion tracking', 'AI-powered insights'],
  },
];

const INTERVAL = 4000;

export default function FeaturesSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => {
      setCurrent(p => (p + 1) % features.length);
      setAnimKey(k => k + 1);
    }, INTERVAL);
    return () => clearTimeout(t);
  }, [current, paused]);

  const handleSelect = (idx: number) => {
    setCurrent(idx);
    setAnimKey(k => k + 1);
  };

  const active     = features[current];
  const ActiveIcon = active.icon;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .feat-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes feat-fade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .feat-fade { animation: feat-fade 0.35s cubic-bezier(.23,1,.32,1) both; }

        @keyframes progress-ring {
          from { stroke-dashoffset: 75.4; }
          to   { stroke-dashoffset: 0; }
        }
        .ring-anim { animation: progress-ring 4s linear forwards; }

        .feat-nav-btn {
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.2s ease;
        }
        .feat-nav-btn:hover { transform: translateX(2px); }

        .feat-card-shadow {
          box-shadow: 0 4px 32px rgba(29,78,216,0.08), 0 1px 4px rgba(29,78,216,0.04);
        }
      `}</style>

      <section
        id="features"
        className="feat-grain relative py-20 lg:py-32 px-4 sm:px-6 overflow-hidden"
        style={{ background: '#f8f6f1', fontFamily: "'DM Sans', system-ui, sans-serif" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Ambient blobs — no grid, just soft light */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.06) 0%, transparent 70%)', filter: 'blur(90px)', transform: 'translate(25%,-25%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(8,145,178,0.05) 0%, transparent 70%)', filter: 'blur(90px)', transform: 'translate(-25%,25%)' }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.04) 0%, transparent 70%)', filter: 'blur(80px)', transform: 'translate(-50%,-50%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-14 lg:mb-18">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 border"
              style={{ background: 'rgba(29,78,216,0.05)', borderColor: 'rgba(29,78,216,0.15)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              <span className="text-[11px] font-semibold text-blue-700 tracking-[0.10em] uppercase">Platform</span>
            </div>
            <h2 className="text-slate-900 mb-4"
              style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 300, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
              Built for <span style={{ fontWeight: 600, color: '#1d4ed8', fontStyle: 'italic' }}>career growth</span>
            </h2>
            <p className="text-slate-500 max-w-md mx-auto" style={{ fontSize: 16, lineHeight: 1.7 }}>
              Everything you need to accelerate your professional journey — all in one place.
            </p>
          </div>

          {/* Main grid */}
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-10 items-start">

            {/* ── LEFT: feature nav ── */}
            <div className="space-y-2">
              {features.map((feat, idx) => {
                const Icon  = feat.icon;
                const isAct = current === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`feat-nav-btn w-full text-left rounded-2xl border transition-all duration-300 ${
                      isAct
                        ? 'border-blue-200 bg-white'
                        : 'border-transparent bg-transparent hover:bg-white/60 hover:border-slate-200'
                    }`}
                    style={{
                      padding: '14px 16px',
                      boxShadow: isAct ? '0 4px 20px rgba(29,78,216,0.08)' : 'none',
                    }}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* icon */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                        style={{
                          background: isAct ? 'linear-gradient(135deg,#1e3a8a,#1d4ed8)' : 'rgba(29,78,216,0.07)',
                          boxShadow: isAct ? '0 4px 14px rgba(29,78,216,0.28)' : 'none',
                        }}
                      >
                        <Icon className="w-4.5 h-4.5" style={{ color: isAct ? '#fff' : 'rgba(29,78,216,0.55)', width: 18, height: 18 }} />
                      </div>

                      {/* text */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm leading-tight transition-colors duration-200"
                          style={{ color: isAct ? '#0f172a' : '#64748b' }}>
                          {feat.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{feat.subtitle}</p>
                      </div>

                      {/* progress ring */}
                      {isAct && !paused && (
                        <div className="shrink-0 hidden sm:block">
                          <svg key={animKey} className="-rotate-90" width="28" height="28" viewBox="0 0 32 32">
                            <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(29,78,216,0.12)" strokeWidth="2.5" />
                            <circle cx="16" cy="16" r="12" fill="none" stroke="#1d4ed8" strokeWidth="2.5"
                              strokeDasharray="75.4" strokeDashoffset="75.4" strokeLinecap="round"
                              className="ring-anim" />
                          </svg>
                        </div>
                      )}
                      {/* static dot when paused/inactive */}
                      {isAct && paused && (
                        <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 hidden sm:block" />
                      )}
                    </div>
                  </button>
                );
              })}

              {/* mobile dots */}
              <div className="flex justify-center gap-2 pt-4 lg:hidden">
                {features.map((_, idx) => (
                  <button key={idx} onClick={() => handleSelect(idx)}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: current === idx ? 28 : 8,
                      background: current === idx ? '#1d4ed8' : 'rgba(29,78,216,0.25)',
                    }} />
                ))}
              </div>
            </div>

            {/* ── RIGHT: content card ── */}
            <div className="lg:sticky lg:top-28">
              <div
                className="feat-card-shadow rounded-3xl overflow-hidden border"
                style={{ borderColor: 'rgba(29,78,216,0.12)', background: '#fff' }}
              >
                {/* Top accent */}
                <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#1e3a8a,#1d4ed8,#3b82f6)' }} />

                <div key={current} className="feat-fade p-7 sm:p-8">
                  {/* Icon */}
                  <div className="w-13 h-13 rounded-2xl flex items-center justify-center mb-6"
                    style={{
                      width: 52, height: 52,
                      background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)',
                      boxShadow: '0 6px 20px rgba(29,78,216,0.28)',
                    }}>
                    <ActiveIcon className="text-white" style={{ width: 22, height: 22 }} />
                  </div>

                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-4 border"
                    style={{ background: 'rgba(29,78,216,0.05)', borderColor: 'rgba(29,78,216,0.14)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                    <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">{active.subtitle}</span>
                  </div>

                  <h3 className="mb-3 text-slate-900"
                    style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    {active.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed mb-7" style={{ fontSize: 15 }}>
                    {active.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2.5 mb-7">
                    {active.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(29,78,216,0.09)' }}>
                          <Check className="text-blue-600" style={{ width: 11, height: 11 }} strokeWidth={3} />
                        </span>
                        <span className="text-sm text-slate-600">{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer strip */}
                  <div
                    className="flex items-center justify-between pt-5"
                    style={{ borderTop: '1px solid rgba(29,78,216,0.08)' }}
                  >
                    <div className="flex items-center gap-3">
                      {/* avatar stack */}
                      <div className="flex -space-x-2">
                        {['NK', 'SR', 'AM'].map((init, i) => (
                          <div key={i}
                            className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold"
                            style={{ background: ['rgba(29,78,216,0.15)','rgba(29,78,216,0.22)','rgba(29,78,216,0.10)'][i], color: '#1d4ed8' }}>
                            {init}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 font-medium">Join 12,000+ professionals</p>
                    </div>

                    {/* active step indicator */}
                    <div className="flex items-center gap-1">
                      {features.map((_, i) => (
                        <div key={i} className="rounded-full transition-all duration-300"
                          style={{
                            width: current === i ? 18 : 5,
                            height: 5,
                            background: current === i ? '#1d4ed8' : 'rgba(29,78,216,0.18)',
                          }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}