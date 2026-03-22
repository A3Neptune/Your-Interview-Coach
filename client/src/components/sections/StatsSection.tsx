// 'use client';

// import { useEffect, useRef, useState } from 'react';

// const stats = [
//   { value: 10, suffix: '+', label: 'Years Experience' },
//   { value: 10, suffix: 'k+', label: 'Happy Mentees' },
//   { value: 94, suffix: '%', label: 'Success rate' },
//   { value: 50, suffix: '+', label: 'Countries Reached' },
// ];

// function Counter({ value, suffix }: { value: number; suffix: string }) {
//   const [count, setCount] = useState(0);
//   const ref = useRef<HTMLDivElement>(null);
//   const hasAnimated = useRef(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && !hasAnimated.current) {
//           hasAnimated.current = true;
//           let current = 0;
//           const step = value / 40;
//           const timer = setInterval(() => {
//             current += step;
//             if (current >= value) {
//               setCount(value);
//               clearInterval(timer);
//             } else {
//               setCount(Math.floor(current));
//             }
//           }, 30);
//         }
//       },
//       { threshold: 0.5 }
//     );
//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [value]);

//   return (
//     <div ref={ref} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-blue-600 font-accent">
//       {count}{suffix}
//     </div>
//   );
// }

// export default function StatsSection() {
//   return (
//     <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 border-y border-blue-100 bg-gradient-to-r from-blue-50/50 via-white to-blue-50/50 overflow-hidden">
//       {/* Background Elements - Left Side */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
//         <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
//       </div>

//       <div className="relative max-w-6xl mx-auto">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
//           {stats.map((stat, i) => (
//             <div key={i} className="text-center group">
//               <div className="p-6 rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-300 hover:scale-105 transition-all duration-300">
//                 <Counter value={stat.value} suffix={stat.suffix} />
//                 <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 font-body">{stat.label}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }



'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingUp, Users, Globe, Award } from 'lucide-react';

const stats = [
  {
    value: 10, suffix: '+', label: 'Years Experience',
    sub: 'Coaching professionals since 2014',
    icon: Award,
  },
  {
    value: 10, suffix: 'k+', label: 'Happy Mentees',
    sub: 'Across all industries and roles',
    icon: Users,
  },
  {
    value: 94, suffix: '%', label: 'Success Rate',
    sub: 'Candidates who land their target role',
    icon: TrendingUp,
  },
  {
    value: 50, suffix: '+', label: 'Countries Reached',
    sub: 'Global coaching, zero boundaries',
    icon: Globe,
  },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated.current) {
        animated.current = true;
        let current = 0;
        const step = value / 48;
        const timer = setInterval(() => {
          current += step;
          if (current >= value) { setCount(value); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, 28);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .stats-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        .stat-card {
          transition: transform 0.3s cubic-bezier(.23,1,.32,1), box-shadow 0.3s ease, border-color 0.25s ease, background 0.25s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(29,78,216,0.12), 0 2px 8px rgba(29,78,216,0.06);
          border-color: rgba(29,78,216,0.22) !important;
        }
        .stat-card:hover .stat-icon {
          background: linear-gradient(135deg,#1e3a8a,#1d4ed8) !important;
          box-shadow: 0 6px 18px rgba(29,78,216,0.28) !important;
        }
        .stat-card:hover .stat-icon svg {
          color: #fff !important;
        }
      `}</style>

      <section
        className="stats-grain relative py-16 lg:py-24 px-4 sm:px-6 overflow-hidden"
        style={{
          background: '#f8f6f1',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          borderTop: '1px solid rgba(29,78,216,0.07)',
          borderBottom: '1px solid rgba(29,78,216,0.07)',
        }}
      >
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
          <div style={{
            position: 'absolute', top: '10%', left: '5%',
            width: 360, height: 360, borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(29,78,216,0.06) 0%,transparent 70%)',
            filter: 'blur(80px)',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', right: '5%',
            width: 320, height: 320, borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(8,145,178,0.05) 0%,transparent 70%)',
            filter: 'blur(80px)',
          }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">

          {/* Section label */}
          <div className="text-center mb-10 lg:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border"
              style={{ background: 'rgba(29,78,216,0.05)', borderColor: 'rgba(29,78,216,0.15)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#1d40b0', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                By the numbers
              </span>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="stat-card rounded-2xl border bg-white p-6 sm:p-7"
                  style={{
                    borderColor: 'rgba(29,78,216,0.10)',
                    boxShadow: '0 2px 12px rgba(29,78,216,0.05)',
                  }}
                >
                  {/* Icon */}
                  <div
                    className="stat-icon w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                    style={{
                      background: 'rgba(29,78,216,0.08)',
                      transition: 'background 0.3s ease, box-shadow 0.3s ease',
                    }}
                  >
                    <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18, color: '#1d4ed8', transition: 'color 0.3s ease' }} />
                  </div>

                  {/* Number */}
                  <div style={{
                    fontSize: 'clamp(32px,4vw,48px)',
                    fontWeight: 300,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: '#0f172a',
                    marginBottom: 6,
                  }}>
                    <span style={{ fontWeight: 600, color: '#1d4ed8' }}>
                      <Counter value={stat.value} suffix={stat.suffix} />
                    </span>
                  </div>

                  {/* Label */}
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 5, letterSpacing: '-0.01em' }}>
                    {stat.label}
                  </p>

                  {/* Sub */}
                  <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.55, fontWeight: 400 }}>
                    {stat.sub}
                  </p>

                  {/* Bottom accent line */}
                  <div className="mt-5 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(90deg,rgba(29,78,216,0.25),transparent)', width: 36 }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}