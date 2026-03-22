// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { X, Zap, Target, FileText, Users } from 'lucide-react';

// const services = [
//   {
//     icon: Target,
//     title: 'Mock Interview',
//     desc: 'Get expert feedback on your interview skills and presentation',
//     color: '#2563eb',
//   },
//   {
//     icon: Zap,
//     title: 'Career Roadmap',
//     desc: 'Build your personalized career path with clear milestones',
//     color: '#0891b2',
//   },
//   {
//     icon: FileText,
//     title: 'Resume Review',
//     desc: 'Optimize your resume and LinkedIn for better opportunities',
//     color: '#7c3aed',
//   },
//   {
//     icon: Users,
//     title: 'Group Workshop',
//     desc: 'Learn with peers and practice interview patterns together',
//     color: '#059669',
//   },
// ];

// const iconComponents: Record<number, React.ReactNode> = {
//   0: <Target size={32} />,
//   1: <Zap size={32} />,
//   2: <FileText size={32} />,
//   3: <Users size={32} />,
// };

// export default function ServicesPopup() {
//   const [isVisible, setIsVisible] = useState(false);
//   const [hasScrolled, setHasScrolled] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (!hasScrolled) setIsVisible(true);
//     }, 12000);

//     const handleScroll = () => {
//       if (window.scrollY > 300 && !hasScrolled && !isVisible) {
//         setHasScrolled(true);
//         setIsVisible(true);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       clearTimeout(timer);
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, [hasScrolled, isVisible]);

//   if (!isVisible) return null;

//   return (
//     <>
//       <div
//         onClick={() => setIsVisible(false)}
//         className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
//         style={{ animation: 'fadeIn 0.3s ease-out' }}
//       />

//       <div
//         className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 pointer-events-none overflow-y-auto"
//         style={{ animation: 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1)' }}
//       >
//         <div
//           className="bg-white rounded-3xl w-full max-w-4xl pointer-events-auto overflow-hidden my-auto max-h-[90vh] flex flex-col"
//           style={{
//             boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
//             fontFamily: "'DM Sans', sans-serif",
//           }}
//         >
//           {/* Header */}
//           <div
//             className="flex items-center justify-between p-5 sm:p-7 md:p-8 border-b border-slate-100 flex-shrink-0"
//             style={{ background: 'linear-gradient(135deg, #f8faff 0%, #faf8ff 100%)' }}
//           >
//             <div className="flex-1">
//               <h2
//                 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2"
//                 style={{
//                   fontFamily: "'Fraunces', serif",
//                 }}
//               >
//                 Ready to Transform Your Career?
//               </h2>
//               <p className="text-sm sm:text-base text-slate-600">
//                 Choose a session that fits your goals
//               </p>
//             </div>
//             <button
//               onClick={() => setIsVisible(false)}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0 ml-4"
//             >
//               <X size={24} className="text-slate-600" />
//             </button>
//           </div>

//           {/* Services Grid - Scrollable */}
//           <div className="p-5 sm:p-7 md:p-8 overflow-y-auto flex-1">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//               {services.map((service, idx) => (
//                 <div
//                   key={idx}
//                   className="group"
//                 >
//                   <div
//                     className="p-6 sm:p-7 md:p-8 rounded-2xl h-full transition-all duration-300 cursor-pointer hover:shadow-xl"
//                     style={{
//                       background: `${service.color}08`,
//                       border: `2px solid ${service.color}20`,
//                       display: 'flex',
//                       flexDirection: 'column',
//                     }}
//                     onMouseEnter={(e) => {
//                       (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
//                       (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 40px ${service.color}20`;
//                     }}
//                     onMouseLeave={(e) => {
//                       (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
//                       (e.currentTarget as HTMLElement).style.boxShadow = 'none';
//                     }}
//                   >
//                     {/* Icon */}
//                     <div
//                       style={{
//                         width: '50px',
//                         height: '50px',
//                         borderRadius: '12px',
//                         background: `${service.color}15`,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         marginBottom: '12px',
//                         color: service.color,
//                         transition: 'all 0.3s ease',
//                       }}
//                       className="group-hover:scale-110 group-hover:bg-opacity-30"
//                     >
//                       {iconComponents[idx]}
//                     </div>

//                     {/* Title */}
//                     <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
//                       {service.title}
//                     </h3>

//                     {/* Description */}
//                     <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed flex-1">
//                       {service.desc}
//                     </p>

//                     {/* Book Now Button */}
//                     <Link
//                       href="/login"
//                       onClick={(e) => e.stopPropagation()}
//                       className="w-full py-2.5 sm:py-3 px-4 rounded-lg font-600 text-white text-center transition-all hover:scale-105 hover:shadow-lg text-sm sm:text-base"
//                       style={{
//                         background: service.color,
//                       }}
//                     >
//                       Book Now
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Footer CTA & Auth */}
//           <div
//             className="p-5 sm:p-7 md:p-8 border-t border-slate-100 flex-shrink-0"
//             style={{ background: '#f9fafb' }}
//           >
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               <div className="flex-1 text-center sm:text-left">
//                 <p className="text-sm sm:text-base text-slate-600 mb-2">
//                   Want to explore all options?
//                 </p>
//                 <Link
//                   href="/services"
//                   onClick={(e) => e.stopPropagation()}
//                   className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-600 text-white transition-all hover:shadow-lg hover:scale-105 text-sm sm:text-base"
//                   style={{ background: '#2563eb' }}
//                 >
//                   View All Services
//                 </Link>
//               </div>

//               <div className="flex items-center gap-3 w-full sm:w-auto">
//                 <Link
//                   href="/login"
//                   onClick={(e) => e.stopPropagation()}
//                   className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-600 text-center transition-all border-2 border-slate-200 hover:bg-slate-50 text-slate-700 text-sm sm:text-base"
//                 >
//                   Log in
//                 </Link>
//                 <Link
//                   href="/signup"
//                   onClick={(e) => e.stopPropagation()}
//                   className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-600 text-center text-white transition-all hover:scale-105 hover:shadow-lg text-sm sm:text-base"
//                   style={{ background: '#2563eb' }}
//                 >
//                   Sign up
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slideUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @media (max-width: 640px) {
//           .text-2xl { font-size: 1.5rem; }
//           .text-3xl { font-size: 1.875rem; }
//           .text-4xl { font-size: 2.25rem; }
//         }
//       `}</style>
//     </>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Zap, Target, FileText, Users, ArrowRight, Check } from 'lucide-react';

const services = [
  {
    icon: Target,
    title: 'Mock Interview',
    desc: 'Get expert feedback on your interview skills, structure, and confidence.',
    highlight: 'Most popular',
  },
  {
    icon: Zap,
    title: 'Career Roadmap',
    desc: 'Build your personalised career path with clear milestones and guidance.',
    highlight: 'AI-powered',
  },
  {
    icon: FileText,
    title: 'Resume Review',
    desc: 'Optimise your resume and LinkedIn profile for better opportunities.',
    highlight: '48hr turnaround',
  },
  {
    icon: Users,
    title: 'Group Workshop',
    desc: 'Learn with peers and practise real interview patterns together.',
    highlight: 'Live sessions',
  },
];

const perks = ['No credit card required', 'Free initial consultation', 'Cancel anytime'];

export default function ServicesPopup() {
  const [isVisible, setIsVisible]   = useState(false);
  const [hasShown, setHasShown]     = useState(false);
  const [animIn, setAnimIn]         = useState(false);

  useEffect(() => {
    const show = () => {
      if (hasShown) return;
      setHasShown(true);
      setIsVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    };

    const timer = setTimeout(show, 12000);

    const onScroll = () => { if (window.scrollY > 300) show(); };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll); };
  }, [hasShown]);

  const close = () => {
    setAnimIn(false);
    setTimeout(() => setIsVisible(false), 350);
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .popup-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.022;
          pointer-events: none;
          z-index: 0;
        }

        .popup-svc-card {
          transition: transform 0.3s cubic-bezier(.23,1,.32,1), box-shadow 0.3s ease, border-color 0.25s ease;
        }
        .popup-svc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 40px rgba(29,78,216,0.12) !important;
          border-color: rgba(29,78,216,0.24) !important;
        }
        .popup-svc-card:hover .svc-icon {
          background: linear-gradient(135deg,#1e3a8a,#1d4ed8) !important;
          box-shadow: 0 6px 18px rgba(29,78,216,0.28) !important;
        }
        .popup-svc-card:hover .svc-icon svg { color: #fff !important; }

        .popup-cta-primary {
          background: linear-gradient(135deg,#1e3a8a,#1d4ed8);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .popup-cta-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(29,78,216,0.32); }

        .popup-cta-ghost {
          transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
        }
        .popup-cta-ghost:hover { border-color: rgba(29,78,216,0.28) !important; color: #1d4ed8 !important; background: rgba(29,78,216,0.04) !important; }

        .popup-close {
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .popup-close:hover { background: rgba(29,78,216,0.07); transform: rotate(90deg); }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={close}
        className="fixed inset-0 z-40"
        style={{
          background: 'rgba(15,23,42,0.35)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          opacity: animIn ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 pointer-events-none overflow-y-auto"
        style={{ fontFamily:"'DM Sans', system-ui, sans-serif" }}
      >
        <div
          className="popup-grain relative bg-white w-full max-w-4xl pointer-events-auto rounded-3xl overflow-hidden flex flex-col my-auto"
          style={{
            maxHeight: '92vh',
            boxShadow: '0 32px 80px rgba(15,23,42,0.22), 0 2px 8px rgba(29,78,216,0.06)',
            border: '1px solid rgba(29,78,216,0.10)',
            opacity: animIn ? 1 : 0,
            transform: animIn ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
            transition: 'opacity 0.38s cubic-bezier(.23,1,.32,1), transform 0.38s cubic-bezier(.23,1,.32,1)',
          }}
        >
          {/* Top accent */}
          <div className="h-1 shrink-0" style={{ background:'linear-gradient(90deg,#1e3a8a,#1d4ed8,#3b82f6)' }} />

          {/* ── Header ── */}
          <div className="relative z-10 flex items-start justify-between px-6 sm:px-8 pt-6 sm:pt-8 pb-5 shrink-0"
            style={{ borderBottom:'1px solid rgba(29,78,216,0.07)' }}>

            <div className="flex-1 pr-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 border"
                style={{ background:'rgba(29,78,216,0.05)', borderColor:'rgba(29,78,216,0.15)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                <span style={{ fontSize:11, fontWeight:600, color:'#1d40b0', letterSpacing:'0.10em', textTransform:'uppercase' }}>
                  Choose a session
                </span>
              </div>

              <h2 style={{ fontSize:'clamp(22px,3.5vw,36px)', fontWeight:300, letterSpacing:'-0.025em', lineHeight:1.1, color:'#0f172a', marginBottom:8 }}>
                Ready to{' '}
                <span style={{ fontWeight:600, color:'#1d4ed8', fontStyle:'italic' }}>transform</span>
                {' '}your career?
              </h2>
              <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>
                Pick the session type that fits your goals — and book a time with Neel.
              </p>
            </div>

            <button
              onClick={close}
              className="popup-close w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background:'rgba(29,78,216,0.05)', border:'1px solid rgba(29,78,216,0.10)' }}
            >
              <X style={{ width:16, height:16, color:'#475569' }} />
            </button>
          </div>

          {/* ── Services grid — scrollable ── */}
          <div className="relative z-10 flex-1 overflow-y-auto px-6 sm:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {services.map(({ icon: Icon, title, desc, highlight }, i) => (
                <div key={i} className="popup-svc-card bg-white rounded-2xl border p-5 flex flex-col"
                  style={{ borderColor:'rgba(29,78,216,0.10)', boxShadow:'0 2px 10px rgba(29,78,216,0.05)' }}>

                  {/* Highlight pill */}
                  <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full mb-4 border"
                    style={{ background:'rgba(29,78,216,0.05)', borderColor:'rgba(29,78,216,0.12)' }}>
                    <span style={{ fontSize:9, fontWeight:700, color:'#1d4ed8', textTransform:'uppercase', letterSpacing:'0.10em' }}>
                      {highlight}
                    </span>
                  </div>

                  {/* Icon */}
                  <div
                    className="svc-icon w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background:'rgba(29,78,216,0.08)', transition:'background 0.3s ease, box-shadow 0.3s ease' }}
                  >
                    <Icon style={{ width:18, height:18, color:'#1d4ed8', transition:'color 0.3s ease' }} />
                  </div>

                  {/* Short accent */}
                  <div className="h-0.5 w-7 rounded-full mb-3"
                    style={{ background:'linear-gradient(90deg,rgba(29,78,216,0.3),transparent)' }} />

                  <h3 style={{ fontSize:15, fontWeight:600, color:'#0f172a', letterSpacing:'-0.01em', marginBottom:8 }}>
                    {title}
                  </h3>
                  <p style={{ fontSize:13, color:'#64748b', lineHeight:1.7, flex:1, marginBottom:16 }}>
                    {desc}
                  </p>

                  <Link
                    href="/login"
                    onClick={e => e.stopPropagation()}
                    className="popup-cta-primary inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-white font-semibold text-[13px]"
                    style={{ textDecoration:'none' }}
                  >
                    Book now
                    <ArrowRight style={{ width:13, height:13 }} />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="relative z-10 shrink-0 px-6 sm:px-8 py-5"
            style={{ borderTop:'1px solid rgba(29,78,216,0.07)', background:'rgba(248,246,241,0.6)' }}>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

              {/* Left: explore + perks */}
              <div>
                <p style={{ fontSize:13, color:'#64748b', marginBottom:10 }}>
                  Want to explore all options?
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/services"
                    onClick={e => e.stopPropagation()}
                    className="popup-cta-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
                    style={{ textDecoration:'none' }}
                  >
                    View all services
                    <ArrowRight style={{ width:14, height:14 }} />
                  </Link>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {perks.map(p => (
                      <span key={p} className="flex items-center gap-1.5" style={{ fontSize:11.5, color:'#94a3b8', fontWeight:500 }}>
                        <Check style={{ width:11, height:11, color:'#1d4ed8' }} strokeWidth={3} />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: auth */}
              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  href="/login"
                  onClick={e => e.stopPropagation()}
                  className="popup-cta-ghost px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border"
                  style={{ borderColor:'rgba(29,78,216,0.14)', background:'rgba(255,255,255,0.8)', textDecoration:'none' }}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={e => e.stopPropagation()}
                  className="popup-cta-primary inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
                  style={{ textDecoration:'none' }}
                >
                  Sign up free
                  <ArrowRight style={{ width:13, height:13 }} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}