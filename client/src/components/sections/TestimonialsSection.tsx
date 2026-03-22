// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { Star } from 'lucide-react';
// import SectionHeader from '@/components/SectionHeader';

// const testimonialsRow1 = [
//   {
//     id: 1,
//     name: 'Rahul M.',
//     role: 'Software Developer',
//     company: 'TCS',
//     initials: 'RM',
//     rating: 5,
//     text: 'Honestly, I was super nervous about interviews. After 3 sessions with Neel, I felt so much more confident. Got placed in my dream company!',
//     color: '#2563eb',
//   },
//   {
//     id: 2,
//     name: 'Ananya K.',
//     role: 'MBA Student',
//     company: 'IIM Bangalore',
//     initials: 'AK',
//     rating: 5,
//     text: "The mock interviews were a game changer. Neel pointed out things I never even noticed about my answers. Totally worth it.",
//     color: '#0891b2',
//   },
//   {
//     id: 3,
//     name: 'Vikram S.',
//     role: 'Data Analyst',
//     company: 'Infosys',
//     initials: 'VS',
//     rating: 5,
//     text: 'I was struggling with technical rounds. The way Neel explained concepts and helped me practice made such a difference. Highly recommend!',
//     color: '#7c3aed',
//   },
// ];

// const testimonialsRow2 = [
//   {
//     id: 4,
//     name: 'Priya T.',
//     role: 'HR Professional',
//     company: 'Wipro',
//     initials: 'PT',
//     rating: 5,
//     text: "Was clueless about how to answer behavioral questions. Neel's tips were so practical and easy to remember. Cleared 4 interviews back to back!",
//     color: '#059669',
//   },
//   {
//     id: 5,
//     name: 'Arjun P.',
//     role: 'Marketing Manager',
//     company: 'Flipkart',
//     initials: 'AP',
//     rating: 5,
//     text: 'Best decision ever! The resume review alone was worth it. Plus the interview prep helped me negotiate a better package. Thanks Neel!',
//     color: '#2563eb',
//   },
//   {
//     id: 6,
//     name: 'Sneha R.',
//     role: 'Product Designer',
//     company: 'Swiggy',
//     initials: 'SR',
//     rating: 5,
//     text: 'I had zero confidence before starting. The way Neel breaks down each question type and gives real examples really helped me understand what interviewers want.',
//     color: '#0891b2',
//   },
// ];

// /* ── Testimonial card ── */
// function TestimonialCard({ t }: { t: typeof testimonialsRow1[0] }) {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <div
//       className="t-card flex-shrink-0 mx-2.5"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{ width: 'clamp(280px, 28vw, 360px)' }}
//     >
//       <div
//         style={{
//           position: 'relative',
//           height: '100%',
//           padding: '22px 22px 20px',
//           borderRadius: '22px',
//           background: hovered ? '#ffffff' : 'rgba(255,255,255,0.78)',
//           border: hovered
//             ? `1.5px solid rgba(${t.color === '#2563eb' ? '37,99,235' : t.color === '#0891b2' ? '8,145,178' : t.color === '#7c3aed' ? '124,58,237' : '5,150,105'},0.35)`
//             : '1.5px solid rgba(219,234,254,0.7)',
//           boxShadow: hovered
//             ? `0 12px 40px rgba(${t.color === '#2563eb' ? '37,99,235' : t.color === '#0891b2' ? '8,145,178' : t.color === '#7c3aed' ? '124,58,237' : '5,150,105'},0.12), 0 2px 8px rgba(0,0,0,0.04)`
//             : '0 2px 10px rgba(37,99,235,0.04)',
//           transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
//           transition: 'all 0.36s cubic-bezier(0.22,1,0.36,1)',
//           backdropFilter: 'blur(8px)',
//           WebkitBackdropFilter: 'blur(8px)',
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '14px',
//           cursor: 'default',
//         }}
//       >
//         {/* Top accent line */}
//         <div style={{
//           position: 'absolute', top: 0, left: '18px', right: '18px', height: '2px',
//           background: hovered
//             ? `linear-gradient(90deg, ${t.color}, ${t.color}44, transparent)`
//             : 'transparent',
//           borderRadius: '2px',
//           transition: 'background 0.35s ease',
//         }} />

//         {/* Stars + rating chip */}
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <div style={{ display: 'flex', gap: '3px' }}>
//             {[...Array(t.rating)].map((_, i) => (
//               <Star
//                 key={i}
//                 style={{
//                   width: '13px', height: '13px',
//                   fill: '#f59e0b', color: '#f59e0b',
//                   transition: `transform 0.2s ease ${i * 30}ms`,
//                   transform: hovered ? 'scale(1.15)' : 'scale(1)',
//                 }}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Quote text */}
//         <p style={{
//           fontSize: '13.5px',
//           color: '#374151',
//           lineHeight: 1.7,
//           fontWeight: 400,
//           flex: 1,
//           fontStyle: 'normal',
//           letterSpacing: '0.01em',
//         }}>
//           "{t.text}"
//         </p>

//         {/* Divider */}
//         <div style={{
//           height: '1px',
//           background: `linear-gradient(90deg, ${t.color}22, rgba(219,234,254,0.4), transparent)`,
//         }} />

//         {/* Author */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
//           {/* Avatar */}
//           <div style={{
//             width: '40px', height: '40px',
//             borderRadius: '12px',
//             background: `linear-gradient(135deg, ${t.color}cc, ${t.color})`,
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '13px', fontWeight: 700, color: 'white',
//             flexShrink: 0,
//             boxShadow: `0 3px 10px ${t.color}30`,
//             transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
//             transform: hovered ? 'scale(1.08) rotate(2deg)' : 'scale(1) rotate(0deg)',
//           }}>
//             {t.initials}
//           </div>

//           <div>
//             <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
//               {t.name}
//             </div>
//             <div style={{ fontSize: '11.5px', color: t.color, fontWeight: 600, marginTop: '1px' }}>
//               {t.role}
//             </div>
//             <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>
//               {t.company}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ── Marquee row ── */
// function MarqueeRow({
//   items,
//   reverse = false,
//   duration = 42,
// }: {
//   items: typeof testimonialsRow1;
//   reverse?: boolean;
//   duration?: number;
// }) {
//   const [paused, setPaused] = useState(false);
//   const cloned = [...items, ...items, ...items];

//   return (
//     <div
//       style={{ position: 'relative', display: 'flex', overflow: 'hidden' }}
//       onMouseEnter={() => setPaused(true)}
//       onMouseLeave={() => setPaused(false)}
//     >
//       <div
//         style={{
//           display: 'flex',
//           alignItems: 'stretch',
//           animation: `t-marquee-${reverse ? 'rev' : 'fwd'} ${duration}s linear infinite`,
//           animationPlayState: paused ? 'paused' : 'running',
//           willChange: 'transform',
//         }}
//       >
//         {cloned.map((t, i) => (
//           <TestimonialCard key={`${t.id}-${i}`} t={t} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function TestimonialsSection() {
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const el = sectionRef.current;
//     if (!el) return;
//     const obs = new IntersectionObserver(
//       ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
//       { threshold: 0.1 }
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, []);

//   return (
//     <section
//       ref={sectionRef}
//       className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
//       style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f0f6ff 50%, #ffffff 100%)' }}
//     >
//       <style jsx global>{`
//         @keyframes t-marquee-fwd {
//           from { transform: translateX(0); }
//           to   { transform: translateX(-33.333%); }
//         }
//         @keyframes t-marquee-rev {
//           from { transform: translateX(-33.333%); }
//           to   { transform: translateX(0); }
//         }
//         @keyframes t-section-in {
//           from { opacity: 0; transform: translateY(16px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           [style*="t-marquee"] { animation: none !important; }
//           .t-card > div { transition: none !important; }
//         }
//       `}</style>

//       {/* ── Static background ── */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
//         <div style={{
//           position: 'absolute', top: '5%', left: '20%',
//           width: '360px', height: '360px',
//           background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 68%)',
//           borderRadius: '50%',
//         }} />
//         <div style={{
//           position: 'absolute', bottom: '5%', right: '20%',
//           width: '300px', height: '300px',
//           background: 'radial-gradient(circle, rgba(8,145,178,0.06) 0%, transparent 68%)',
//           borderRadius: '50%',
//         }} />
//         {/* Dot grid — centre */}
//         <div style={{
//           position: 'absolute', inset: 0,
//           backgroundImage: 'radial-gradient(rgba(37,99,235,0.065) 1px, transparent 1px)',
//           backgroundSize: '36px 36px',
//           WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%)',
//           maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%)',
//         }} />
//       </div>

//       <div
//         className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
//         style={{
//           opacity: visible ? 1 : 0,
//           transform: visible ? 'translateY(0)' : 'translateY(16px)',
//           transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
//         }}
//       >
//         {/* ── SECTION HEADER — untouched ── */}
//         <div className="mb-12 sm:mb-16">
//           <SectionHeader
//             badge="Success Stories"
//             title="What Our Mentees Say"
//             subtitle="Real stories from professionals who transformed their careers with our mentorship"
//           />
//         </div>

//         {/* ── Row 1: left → ── */}
//         <div className="relative mb-4">
//           {/* Edge fades */}
//           <div style={{
//             position: 'absolute', left: 0, top: 0, bottom: 0,
//             width: 'clamp(48px, 8vw, 120px)',
//             background: 'linear-gradient(90deg, #f0f6ff 0%, rgba(240,246,255,0.85) 40%, transparent 100%)',
//             zIndex: 10, pointerEvents: 'none',
//           }} />
//           <div style={{
//             position: 'absolute', right: 0, top: 0, bottom: 0,
//             width: 'clamp(48px, 8vw, 120px)',
//             background: 'linear-gradient(270deg, #f0f6ff 0%, rgba(240,246,255,0.85) 40%, transparent 100%)',
//             zIndex: 10, pointerEvents: 'none',
//           }} />
//           <MarqueeRow items={testimonialsRow1} reverse={false} duration={44} />
//         </div>

//         {/* ── Row 2: ← right ── */}
//         <div className="relative">
//           <div style={{
//             position: 'absolute', left: 0, top: 0, bottom: 0,
//             width: 'clamp(48px, 8vw, 120px)',
//             background: 'linear-gradient(90deg, #f0f6ff 0%, rgba(240,246,255,0.85) 40%, transparent 100%)',
//             zIndex: 10, pointerEvents: 'none',
//           }} />
//           <div style={{
//             position: 'absolute', right: 0, top: 0, bottom: 0,
//             width: 'clamp(48px, 8vw, 120px)',
//             background: 'linear-gradient(270deg, #f0f6ff 0%, rgba(240,246,255,0.85) 40%, transparent 100%)',
//             zIndex: 10, pointerEvents: 'none',
//           }} />
//           <MarqueeRow items={testimonialsRow2} reverse={true} duration={38} />
//         </div>

//         {/* ── Trust strip ── */}
//         <div style={{
//           marginTop: '40px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           flexWrap: 'wrap',
//           gap: '10px',
//         }}>
//           {/* Avatars cluster */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//             <div style={{ display: 'flex' }}>
//               {[
//                 { initials: 'RM', color: '#2563eb' },
//                 { initials: 'AK', color: '#0891b2' },
//                 { initials: 'VS', color: '#7c3aed' },
//                 { initials: 'PT', color: '#059669' },
//               ].map((a, i) => (
//                 <div key={i} style={{
//                   width: '30px', height: '30px',
//                   borderRadius: '50%',
//                   background: `linear-gradient(135deg, ${a.color}88, ${a.color})`,
//                   border: '2px solid white',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   fontSize: '9px', fontWeight: 700, color: 'white',
//                   marginLeft: i === 0 ? 0 : '-8px',
//                   boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
//                 }}>
//                   {a.initials}
//                 </div>
//               ))}
//             </div>
//             <div style={{
//               width: '30px', height: '30px', borderRadius: '50%',
//               background: 'rgba(37,99,235,0.08)',
//               border: '2px solid rgba(219,234,254,0.8)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               marginLeft: '-8px',
//               fontSize: '9px', fontWeight: 700, color: '#2563eb',
//             }}>
//               +2k
//             </div>
//           </div>

//           {/* Divider */}
//           <div style={{ width: '1px', height: '20px', background: 'rgba(219,234,254,0.8)', display: 'none' }} className="sm:block" />

//           {/* Stars + text */}
//           <div style={{
//             display: 'flex', alignItems: 'center', gap: '8px',
//             padding: '8px 16px', borderRadius: '100px',
//             background: 'rgba(255,255,255,0.9)',
//             border: '1.5px solid rgba(219,234,254,0.8)',
//             boxShadow: '0 2px 12px rgba(37,99,235,0.06)',
//           }}>
//             <div style={{ display: 'flex', gap: '2px' }}>
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} style={{ width: '12px', height: '12px', fill: '#f59e0b', color: '#f59e0b' }} />
//               ))}
//             </div>
//             <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>4.4</span>
//             <span style={{ width: '1px', height: '12px', background: 'rgba(219,234,254,0.8)', display: 'inline-block' }} />
//             <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
//               from 2,000+ mentees
//             </span>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



'use client';

import { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';

const testimonialsRow1 = [
  {
    id: 1,
    name: 'Rahul M.',
    role: 'Software Developer',
    company: 'TCS',
    initials: 'RM',
    rating: 5,
    text: 'Honestly, I was super nervous about interviews. After 3 sessions with Neel, I felt so much more confident. Got placed in my dream company!',
  },
  {
    id: 2,
    name: 'Ananya K.',
    role: 'MBA Student',
    company: 'IIM Bangalore',
    initials: 'AK',
    rating: 5,
    text: "The mock interviews were a game changer. Neel pointed out things I never even noticed about my answers. Totally worth it.",
  },
  {
    id: 3,
    name: 'Vikram S.',
    role: 'Data Analyst',
    company: 'Infosys',
    initials: 'VS',
    rating: 5,
    text: 'I was struggling with technical rounds. The way Neel explained concepts and helped me practice made such a difference. Highly recommend!',
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
  },
  {
    id: 5,
    name: 'Arjun P.',
    role: 'Marketing Manager',
    company: 'Flipkart',
    initials: 'AP',
    rating: 5,
    text: 'Best decision ever! The resume review alone was worth it. Plus the interview prep helped me negotiate a better package. Thanks Neel!',
  },
  {
    id: 6,
    name: 'Sneha R.',
    role: 'Product Designer',
    company: 'Swiggy',
    initials: 'SR',
    rating: 5,
    text: 'I had zero confidence before starting. The way Neel breaks down each question type and gives real examples really helped me understand what interviewers want.',
  },
];

/* avatar bg shades — all blue toned to match site palette */
const avatarBg = [
  'linear-gradient(135deg,#1e3a8a,#1d4ed8)',
  'linear-gradient(135deg,#0369a1,#0891b2)',
  'linear-gradient(135deg,#3730a3,#4f46e5)',
  'linear-gradient(135deg,#065f46,#059669)',
  'linear-gradient(135deg,#1e3a8a,#2563eb)',
  'linear-gradient(135deg,#0369a1,#38bdf8)',
];

/* ── Single card ── */
function TestimonialCard({ t, bgIdx }: { t: typeof testimonialsRow1[0]; bgIdx: number }) {
  const [hovered, setHovered] = useState(false);
  const bg = avatarBg[bgIdx % avatarBg.length];

  return (
    <div
      className="flex-shrink-0 mx-2.5"
      style={{ width: 'clamp(270px, 26vw, 340px)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          padding: '22px',
          borderRadius: '20px',
          background: hovered ? '#ffffff' : 'rgba(255,255,255,0.72)',
          border: hovered ? '1px solid rgba(29,78,216,0.20)' : '1px solid rgba(29,78,216,0.09)',
          boxShadow: hovered
            ? '0 12px 40px rgba(29,78,216,0.10), 0 2px 8px rgba(29,78,216,0.04)'
            : '0 2px 10px rgba(29,78,216,0.04)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'all 0.35s cubic-bezier(.23,1,.32,1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '14px',
        }}
      >
        {/* Top accent line on hover */}
        <div style={{
          height: '2px',
          borderRadius: '2px',
          background: hovered
            ? 'linear-gradient(90deg,#1e3a8a,rgba(29,78,216,0.3),transparent)'
            : 'transparent',
          transition: 'background 0.35s ease',
          marginTop: '-6px',
          marginLeft: '-4px',
          marginRight: '-4px',
        }} />

        {/* Stars */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {[...Array(t.rating)].map((_, i) => (
            <Star key={i} style={{
              width: 12, height: 12,
              fill: '#f59e0b', color: '#f59e0b',
              transition: `transform 0.2s ease ${i * 25}ms`,
              transform: hovered ? 'scale(1.15)' : 'scale(1)',
            }} />
          ))}
        </div>

        {/* Quote */}
        <p style={{
          fontSize: 13.5,
          color: '#475569',
          lineHeight: 1.75,
          fontWeight: 400,
          flex: 1,
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>
          "{t.text}"
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(29,78,216,0.07)' }} />

        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{
            width: 38, height: 38,
            borderRadius: 11,
            background: bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff',
            flexShrink: 0,
            boxShadow: '0 3px 10px rgba(29,78,216,0.22)',
            transform: hovered ? 'scale(1.06) rotate(2deg)' : 'scale(1) rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(.34,1.56,.64,1)',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}>
            {t.initials}
          </div>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a', lineHeight: 1.2, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              {t.name}
            </p>
            <p style={{ fontSize: 11.5, color: '#1d4ed8', fontWeight: 600, marginTop: 2, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              {t.role}
            </p>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 1, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              {t.company}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Marquee row ── */
function MarqueeRow({ items, reverse = false, duration = 42 }: {
  items: typeof testimonialsRow1; reverse?: boolean; duration?: number;
}) {
  const [paused, setPaused] = useState(false);
  const cloned = [...items, ...items, ...items];

  return (
    <div
      style={{ position: 'relative', display: 'flex', overflow: 'hidden' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        animation: `t-${reverse ? 'rev' : 'fwd'} ${duration}s linear infinite`,
        animationPlayState: paused ? 'paused' : 'running',
        willChange: 'transform',
      }}>
        {cloned.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} t={t} bgIdx={i % avatarBg.length} />
        ))}
      </div>
    </div>
  );
}

/* ── Edge fade mask ── */
function EdgeFade({ bg }: { bg: string }) {
  return (
    <>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 10, pointerEvents: 'none',
        width: 'clamp(48px,8vw,110px)',
        background: `linear-gradient(90deg,${bg} 0%,transparent 100%)`,
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 10, pointerEvents: 'none',
        width: 'clamp(48px,8vw,110px)',
        background: `linear-gradient(270deg,${bg} 0%,transparent 100%)`,
      }} />
    </>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .test-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes t-fwd {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes t-rev {
          from { transform: translateX(-33.333%); }
          to   { transform: translateX(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          [style*="t-fwd"], [style*="t-rev"] { animation: none !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="test-grain relative py-20 lg:py-32 overflow-hidden"
        style={{ background: '#f8f6f1', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        {/* Ambient blobs — warm, no grid */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
          <div style={{
            position: 'absolute', top: '10%', left: '15%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(29,78,216,0.06) 0%,transparent 70%)',
            filter: 'blur(80px)',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', right: '15%',
            width: 340, height: 340, borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(8,145,178,0.05) 0%,transparent 70%)',
            filter: 'blur(80px)',
          }} />
        </div>

        <div
          className="relative z-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(.23,1,.32,1)',
          }}
        >
          {/* ── Section header ── */}
          <div className="text-center px-4 mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 border"
              style={{ background: 'rgba(29,78,216,0.05)', borderColor: 'rgba(29,78,216,0.15)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#1d40b0', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                Success Stories
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(28px,4vw,48px)',
              fontWeight: 300,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              color: '#0f172a',
              marginBottom: 14,
            }}>
              What our{' '}
              <span style={{ fontWeight: 600, color: '#1d4ed8', fontStyle: 'italic' }}>mentees say</span>
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 420, margin: '0 auto', lineHeight: 1.7 }}>
              Real stories from professionals who transformed their careers with Neel's mentorship.
            </p>
          </div>

          {/* ── Row 1 ── */}
          <div className="relative mb-3.5 mx-4 sm:mx-8 lg:mx-20 rounded-2xl overflow-hidden">
            <EdgeFade bg="#f8f6f1" />
            <MarqueeRow items={testimonialsRow1} reverse={false} duration={46} />
          </div>

          {/* ── Row 2 ── */}
          <div className="relative mx-4 sm:mx-8 lg:mx-20 rounded-2xl overflow-hidden">
            <EdgeFade bg="#f8f6f1" />
            <MarqueeRow items={testimonialsRow2} reverse={true} duration={38} />
          </div>

          {/* ── Trust strip ── */}
          <div className="flex items-center justify-center flex-wrap gap-3 mt-12 px-4">

            {/* Avatar cluster */}
            <div className="flex items-center gap-2">
              <div style={{ display: 'flex' }}>
                {[
                  { init: 'RM', bg: avatarBg[0] },
                  { init: 'AK', bg: avatarBg[1] },
                  { init: 'VS', bg: avatarBg[2] },
                  { init: 'PT', bg: avatarBg[3] },
                ].map((a, i) => (
                  <div key={i} style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: a.bg,
                    border: '2px solid #f8f6f1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: '#fff',
                    marginLeft: i === 0 ? 0 : -8,
                    boxShadow: '0 2px 6px rgba(29,78,216,0.18)',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}>{a.init}</div>
                ))}
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  border: '2px solid rgba(29,78,216,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginLeft: -8,
                  fontSize: 8, fontWeight: 700, color: '#1d4ed8',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}>+2k</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 24, background: 'rgba(29,78,216,0.12)' }} className="hidden sm:block" />

            {/* Stars pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 100,
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(29,78,216,0.12)',
              boxShadow: '0 2px 12px rgba(29,78,216,0.06)',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{ width: 12, height: 12, fill: '#f59e0b', color: '#f59e0b' }} />
                ))}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', fontFamily: "'DM Sans', system-ui, sans-serif" }}>4.4</span>
              <div style={{ width: 1, height: 14, background: 'rgba(29,78,216,0.12)' }} />
              <span style={{ fontSize: 12.5, color: '#64748b', fontWeight: 500, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                from 2,000+ mentees
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}