// 'use client';

// import Link from 'next/link';
// import { ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';

// export default function CTASectionPremium() {
//   return (
//     <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute inset-0 opacity-[0.02]" style={{
//           backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
//           backgroundSize: '40px 40px'
//         }}></div>
//         <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="relative">
//           <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/50 to-white rounded-3xl sm:rounded-[2rem] border-2 border-blue-200"></div>
//           <div className="absolute inset-0 rounded-3xl sm:rounded-[2rem] bg-gradient-to-r from-blue-100/30 via-transparent to-blue-100/30 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

//           <div className="relative p-6 sm:p-12 lg:p-16">
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border-2 border-blue-200 mb-4 sm:mb-6">
//               <Zap className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-blue-600 animate-pulse" />
//               <span className="text-[10px] sm:text-xs font-semibold text-blue-600 font-body">Ready to transform your career?</span>
//             </div>

//             <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight font-heading">
//               Start your mentorship
//               <span className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
//                 journey today
//               </span>
//             </h2>

//             <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mb-6 sm:mb-8 leading-relaxed font-body">
//               Join hundreds of students and professionals already growing their careers with personalized mentorship. Get expert guidance, build confidence, and achieve your goals.
//             </p>

//             <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 py-4 sm:py-6 border-y border-blue-200">
//               <div>
//                 <div className="text-xl sm:text-2xl font-bold text-blue-600 font-accent">500+</div>
//                 <div className="text-[10px] sm:text-xs text-slate-600 font-body">Active Mentors</div>
//               </div>
//               <div>
//                 <div className="text-xl sm:text-2xl font-bold text-blue-600 font-accent">10K+</div>
//                 <div className="text-[10px] sm:text-xs text-slate-600 font-body">Success Stories</div>
//               </div>
//               <div>
//                 <div className="text-xl sm:text-2xl font-bold text-blue-600 font-accent">98%</div>
//                 <div className="text-[10px] sm:text-xs text-slate-600 font-body">Satisfaction Rate</div>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//               <Link
//                 href="/signup"
//                 className="group relative inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 font-heading text-sm sm:text-base"
//               >
//                 <span className="flex items-center gap-2">
//                   Get Started
//                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                 </span>
//               </Link>

//               <Link
//                 href="#how-it-works"
//                 className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-blue-50 text-blue-600 font-semibold rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 font-heading text-sm sm:text-base"
//               >
//                 Learn More
//               </Link>
//             </div>

//             <p className="text-[10px] sm:text-xs text-slate-500 mt-4 sm:mt-6 font-body">
//               ✓ No credit card required • ✓ Free initial consultation • ✓ Cancel anytime
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-16">
//           {[
//             {
//               icon: Target,
//               title: 'Personalized Paths',
//               description: 'Get a mentor matched to your specific career goals and aspirations.'
//             },
//             {
//               icon: TrendingUp,
//               title: 'Real Results',
//               description: 'Track measurable progress with structured learning and guidance.'
//             },
//             {
//               icon: Zap,
//               title: 'Quick Start',
//               description: 'Begin your first session within 48 hours of signing up.'
//             }
//           ].map((feature, idx) => {
//             const Icon = feature.icon;
//             return (
//               <div key={idx} className="group relative">
//                 <div className="relative h-full p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-105">
//                   <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
//                     <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
//                   </div>
//                   <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1.5 sm:mb-2 font-heading">{feature.title}</h3>
//                   <p className="text-xs sm:text-sm text-slate-600 font-body">{feature.description}</p>
//                   <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }



'use client';

import Link from 'next/link';
import { ArrowRight, Target, TrendingUp, Zap, Check } from 'lucide-react';

const featureCards = [
  {
    icon: Target,
    title: 'Personalised coaching',
    description: 'Every session is built around your specific role, industry, and interview challenges.',
  },
  {
    icon: TrendingUp,
    title: 'Real, measurable results',
    description: 'Track your growth across mock sessions with structured feedback and improvement plans.',
  },
  {
    icon: Zap,
    title: 'Start within 48 hours',
    description: 'Book your first session and begin preparing before your next opportunity arrives.',
  },
];

const perks = [
  'No credit card required',
  'Free initial consultation',
  'Cancel anytime',
];

export default function CTASectionPremium() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .cta-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        .cta-primary {
          background: linear-gradient(135deg, #1e3a8a, #1d4ed8);
          transition: transform 0.25s cubic-bezier(.23,1,.32,1), box-shadow 0.25s ease;
        }
        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(29,78,216,0.35);
        }
        .cta-primary:active { transform: translateY(0); }

        .cta-secondary {
          transition: transform 0.25s cubic-bezier(.23,1,.32,1), border-color 0.2s ease, background 0.2s ease;
        }
        .cta-secondary:hover {
          transform: translateY(-2px);
          border-color: rgba(29,78,216,0.30) !important;
          background: rgba(255,255,255,0.95) !important;
        }

        .feat-card {
          transition: transform 0.3s cubic-bezier(.23,1,.32,1), box-shadow 0.3s ease, border-color 0.25s ease;
        }
        .feat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 40px rgba(29,78,216,0.11);
          border-color: rgba(29,78,216,0.22) !important;
        }
        .feat-card:hover .feat-icon {
          background: linear-gradient(135deg, #1e3a8a, #1d4ed8) !important;
          box-shadow: 0 6px 18px rgba(29,78,216,0.28) !important;
        }
        .feat-card:hover .feat-icon svg { color: #fff !important; }
      `}</style>

      <section
        className="cta-grain relative py-20 lg:py-32 px-4 sm:px-6 overflow-hidden"
        style={{ background: '#f8f6f1', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
          <div style={{ position:'absolute', top:'-5%', right:'-3%', width:460, height:460, borderRadius:'50%', background:'radial-gradient(circle,rgba(29,78,216,0.07) 0%,transparent 70%)', filter:'blur(90px)' }} />
          <div style={{ position:'absolute', bottom:'-5%', left:'-3%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(8,145,178,0.05) 0%,transparent 70%)', filter:'blur(90px)' }} />
          <div style={{ position:'absolute', top:'40%', left:'35%', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(29,78,216,0.04) 0%,transparent 70%)', filter:'blur(80px)', transform:'translate(-50%,-50%)' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">

          {/* ── Main CTA card ── */}
          <div
            className="bg-white rounded-3xl border overflow-hidden mb-6"
            style={{ borderColor:'rgba(29,78,216,0.12)', boxShadow:'0 4px 40px rgba(29,78,216,0.08), 0 1px 4px rgba(29,78,216,0.04)' }}
          >
            {/* top accent bar */}
            <div className="h-1" style={{ background:'linear-gradient(90deg,#1e3a8a,#1d4ed8,#3b82f6)' }} />

            <div className="p-7 sm:p-10 lg:p-14">

              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 border"
                style={{ background:'rgba(29,78,216,0.05)', borderColor:'rgba(29,78,216,0.15)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                <span style={{ fontSize:11, fontWeight:600, color:'#1d40b0', letterSpacing:'0.10em', textTransform:'uppercase' }}>
                  Ready to transform your career?
                </span>
              </div>

              <div className="grid lg:grid-cols-2 gap-10 items-center">

                {/* Left copy */}
                <div>
                  <h2 style={{ fontSize:'clamp(28px,4.5vw,52px)', fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.08, color:'#0f172a', marginBottom:16 }}>
                    Start your{' '}
                    <span style={{ fontWeight:600, color:'#1d4ed8', fontStyle:'italic' }}>mentorship</span>
                    <br />journey today
                  </h2>

                  <p style={{ fontSize:15.5, color:'#64748b', lineHeight:1.75, marginBottom:28, maxWidth:440 }}>
                    Join thousands of students and professionals growing their careers with
                    personalised coaching from Neel. Get expert guidance, build confidence,
                    and land your next role.
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-3 mb-7">
                    <Link
                      href="/signup"
                      className="cta-primary inline-flex items-center gap-2 px-7 py-3.5 text-white text-sm font-semibold rounded-xl no-underline"
                    >
                      Get started free
                      <ArrowRight style={{ width:15, height:15 }} />
                    </Link>
                    <Link
                      href="#how-it-works"
                      className="cta-secondary inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl no-underline"
                      style={{
                        background:'rgba(255,255,255,0.8)',
                        border:'1px solid rgba(29,78,216,0.16)',
                        color:'#475569',
                      }}
                    >
                      See how it works
                    </Link>
                  </div>

                  {/* Perks */}
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                    {perks.map(p => (
                      <span key={p} className="flex items-center gap-1.5" style={{ fontSize:12, color:'#94a3b8', fontWeight:500 }}>
                        <Check style={{ width:12, height:12, color:'#1d4ed8' }} strokeWidth={3} />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right stats */}
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                  {[
                    { num:'10+',  label:'Years coaching' },
                    { num:'10k+', label:'Success stories' },
                    { num:'94%',  label:'Interview success rate' },
                  ].map(({ num, label }) => (
                    <div key={label} className="rounded-2xl border p-4 sm:p-5"
                      style={{ background:'rgba(29,78,216,0.03)', borderColor:'rgba(29,78,216,0.10)' }}>
                      <p style={{ fontSize:'clamp(22px,3vw,34px)', fontWeight:300, letterSpacing:'-0.03em', color:'#0f172a', lineHeight:1, marginBottom:4 }}>
                        <span style={{ fontWeight:600, color:'#1d4ed8' }}>{num}</span>
                      </p>
                      <p style={{ fontSize:11.5, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.09em', color:'#94a3b8' }}>
                        {label}
                      </p>
                      <div className="mt-3 h-0.5 rounded-full w-8"
                        style={{ background:'linear-gradient(90deg,rgba(29,78,216,0.3),transparent)' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Feature cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featureCards.map(({ icon: Icon, title, description }, i) => (
              <div key={i} className="feat-card bg-white rounded-2xl border p-5 sm:p-6"
                style={{ borderColor:'rgba(29,78,216,0.10)', boxShadow:'0 2px 12px rgba(29,78,216,0.05)' }}>
                <div className="h-0.5 rounded-full mb-5 w-8"
                  style={{ background:'linear-gradient(90deg,rgba(29,78,216,0.3),transparent)' }} />
                <div
                  className="feat-icon w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background:'rgba(29,78,216,0.08)', transition:'background 0.3s ease, box-shadow 0.3s ease' }}
                >
                  <Icon style={{ width:18, height:18, color:'#1d4ed8', transition:'color 0.3s ease' }} />
                </div>
                <h3 style={{ fontSize:15, fontWeight:600, color:'#0f172a', marginBottom:8, letterSpacing:'-0.01em' }}>
                  {title}
                </h3>
                <p style={{ fontSize:13.5, color:'#64748b', lineHeight:1.7 }}>
                  {description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}