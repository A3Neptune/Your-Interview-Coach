// 'use client';

// import Image from 'next/image';

// const companies = [
//   { name: 'Google', logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png' },
//   { name: 'Microsoft', logo: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31' },
//   { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
//   { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
//   { name: 'Apple', logo: 'https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png' },
//   { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
//   { name: 'Spotify', logo: 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png' },
//   { name: 'Uber', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' },
//   { name: 'Stripe', logo: 'https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg' },
//   { name: 'Airbnb', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg' },
//   { name: 'LinkedIn', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png' },
//   { name: 'Salesforce', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' },
//   { name: 'Adobe', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png' },
//   { name: 'Oracle', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg' },
//   { name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
//   { name: 'Tesla', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg' },
//   { name: 'Nvidia', logo: 'https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg' },
//   { name: 'Intel', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg' },
//   { name: 'Goldman Sachs', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg' },
//   { name: 'JP Morgan', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/JP_Morgan_Logo_2008.svg' }
// ];

// export default function LogosSection() {
//   return (
//     <section className="relative py-16 sm:py-20 lg:py-24 border-y border-blue-100/50 overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-white">
//       {/* Background Elements - Center */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
//       </div>

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
//         <div className="text-center">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border-2 border-blue-300 mb-4">
//             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
//             <span className="text-xs sm:text-sm text-blue-600 font-semibold uppercase tracking-wider">Trusted By Top Companies</span>
//           </div>
//           <p className="text-sm sm:text-base text-slate-600 font-body max-w-2xl mx-auto">
//             Our mentees have successfully landed roles at the world's leading tech companies
//           </p>
//         </div>
//       </div>

//       <div className="relative">
//         <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-40 lg:w-48 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
//         <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-40 lg:w-48 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />

//         <div className="flex overflow-hidden">
//           <div className="flex animate-scroll-slow">
//             {[...companies, ...companies].map((company, i) => (
//               <div
//                 key={`logo-${i}`}
//                 className="flex-shrink-0 px-4 sm:px-8 md:px-12 lg:px-16 py-3 sm:py-4 group"
//               >
//                 <div className="relative flex items-center justify-center h-8 sm:h-12 md:h-16">
//                   <img
//                     src={company.logo}
//                     alt={company.name}
//                     className="h-6 sm:h-8 md:h-10 w-auto object-contain opacity-40 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0"
//                   />
//                   <div className="absolute -inset-2 bg-blue-50/0 group-hover:bg-blue-50/50 rounded-lg transition-all duration-500 -z-10 blur-sm" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes scroll-slow {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         .animate-scroll-slow {
//           animation: scroll-slow 60s linear infinite;
//         }
//         .animate-scroll-slow:hover {
//           animation-play-state: paused;
//         }
//       `}</style>
//     </section>
//   );
// }




'use client';

import { useState } from 'react';

const companies = [
  { name: 'Google',       logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png' },
  { name: 'Microsoft',    logo: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31' },
  { name: 'Amazon',       logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { name: 'Meta',         logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
  { name: 'Apple',        logo: 'https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png' },
  { name: 'Netflix',      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { name: 'Spotify',      logo: 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png' },
  { name: 'Uber',         logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' },
  { name: 'Airbnb',       logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg' },
  { name: 'LinkedIn',     logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png' },
  { name: 'Salesforce',   logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' },
  { name: 'Adobe',        logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png' },
  { name: 'Oracle',       logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg' },
  { name: 'IBM',          logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
  { name: 'Tesla',        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg' },
  { name: 'Nvidia',       logo: 'https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg' },
  { name: 'Goldman Sachs',logo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg' },
  { name: 'JP Morgan',    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/JP_Morgan_Logo_2008.svg' },
];

/* split into two rows */
const row1 = companies.slice(0, Math.ceil(companies.length / 2));
const row2 = companies.slice(Math.ceil(companies.length / 2));

function LogoStrip({ items, reverse = false, duration = 55 }: {
  items: typeof companies; reverse?: boolean; duration?: number;
}) {
  const [paused, setPaused] = useState(false);
  const cloned = [...items, ...items, ...items];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          animation: `logos-${reverse ? 'rev' : 'fwd'} ${duration}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {cloned.map((co, i) => (
          <LogoItem key={`${co.name}-${i}`} co={co} />
        ))}
      </div>
    </div>
  );
}

function LogoItem({ co }: { co: typeof companies[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex-shrink-0 px-6 sm:px-10 py-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 18px',
          borderRadius: 12,
          background: hovered ? 'rgba(255,255,255,0.95)' : 'transparent',
          border: hovered ? '1px solid rgba(29,78,216,0.12)' : '1px solid transparent',
          boxShadow: hovered ? '0 4px 18px rgba(29,78,216,0.08)' : 'none',
          transition: 'all 0.3s cubic-bezier(.23,1,.32,1)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        <img
          src={co.logo}
          alt={co.name}
          style={{
            height: 'clamp(20px, 2.2vw, 28px)',
            width: 'auto',
            maxWidth: 110,
            objectFit: 'contain',
            opacity: hovered ? 0.85 : 0.32,
            filter: hovered ? 'grayscale(0%)' : 'grayscale(100%)',
            transition: 'opacity 0.35s ease, filter 0.35s ease',
          }}
        />
      </div>
    </div>
  );
}

export default function LogosSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .logos-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes logos-fwd {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes logos-rev {
          from { transform: translateX(-33.333%); }
          to   { transform: translateX(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          [style*="logos-fwd"], [style*="logos-rev"] { animation: none !important; }
        }
      `}</style>

      <section
        className="logos-grain relative py-16 lg:py-24 overflow-hidden"
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
            position: 'absolute', top: '50%', left: '50%',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(29,78,216,0.05) 0%,transparent 70%)',
            filter: 'blur(80px)',
            transform: 'translate(-50%,-50%)',
          }} />
        </div>

        <div className="relative z-10">

          {/* Header */}
          <div className="text-center px-4 mb-10 lg:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 border"
              style={{ background: 'rgba(29,78,216,0.05)', borderColor: 'rgba(29,78,216,0.15)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#1d40b0', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                Trusted by top companies
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(24px,3.5vw,42px)',
              fontWeight: 300,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              color: '#0f172a',
              marginBottom: 12,
            }}>
              Our mentees work at the{' '}
              <span style={{ fontWeight: 600, color: '#1d4ed8', fontStyle: 'italic' }}>world's best</span>
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 400, margin: '0 auto', lineHeight: 1.7 }}>
              From FAANG to fintech — graduates of Neel's coaching land roles everywhere.
            </p>
          </div>

          {/* Row 1 */}
          <div className="relative mb-3 mx-4 sm:mx-8 lg:mx-20">
            {/* edge fades */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 10, pointerEvents: 'none',
              width: 'clamp(40px,7vw,100px)',
              background: 'linear-gradient(90deg,#f8f6f1 0%,transparent 100%)',
            }} />
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 10, pointerEvents: 'none',
              width: 'clamp(40px,7vw,100px)',
              background: 'linear-gradient(270deg,#f8f6f1 0%,transparent 100%)',
            }} />
            <LogoStrip items={row1} reverse={false} duration={52} />
          </div>

          {/* Row 2 */}
          <div className="relative mx-4 sm:mx-8 lg:mx-20">
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 10, pointerEvents: 'none',
              width: 'clamp(40px,7vw,100px)',
              background: 'linear-gradient(90deg,#f8f6f1 0%,transparent 100%)',
            }} />
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 10, pointerEvents: 'none',
              width: 'clamp(40px,7vw,100px)',
              background: 'linear-gradient(270deg,#f8f6f1 0%,transparent 100%)',
            }} />
            <LogoStrip items={row2} reverse={true} duration={44} />
          </div>

          {/* Bottom note */}
          <div className="flex justify-center mt-10 px-4">
            <p style={{
              fontSize: 12.5,
              color: '#94a3b8',
              fontWeight: 500,
              letterSpacing: '0.02em',
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>
              and 300+ more companies worldwide
            </p>
          </div>
        </div>
      </section>
    </>
  );
}