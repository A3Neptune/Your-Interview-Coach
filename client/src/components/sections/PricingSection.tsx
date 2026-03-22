// 'use client';

// import { useState, useEffect } from 'react';
// import useSWR from 'swr';
// import SectionHeader from '@/components/SectionHeader';
// import { Check, Zap, Clock, BarChart2, Layers, ChevronRight, Sparkles } from 'lucide-react';

// interface Service {
//   id: string;
//   name: string;
//   price: number;
//   duration: string;
//   title: string;
//   value: string;
//   points: string[];
//   level: string;
//   support: string;
//   access: string;
// }

// interface PricingData {
//   header: { badge: string; title: string; subtitle: string };
//   services: Service[];
//   stats: Array<{ stat: string; desc: string }>;
//   ctaButtonText: string;
//   autoPlayInterval: number;
//   showGridView: boolean;
//   showStats: boolean;
// }

// const fetcher = async (url: string) => {
//   const res = await fetch(url, { credentials: 'include' });
//   if (!res.ok) throw new Error('Failed to fetch pricing data');
//   return res.json();
// };

// // Info card icon map
// const infoIcons = [Clock, BarChart2, Zap, Layers];

// export default function PricingSection() {
//   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

//   const { data: pricingData, isLoading } = useSWR(
//     `${API_URL}/pricing-section/public`,
//     fetcher,
//     {
//       revalidateOnFocus: false,
//       revalidateOnReconnect: true,
//       dedupingInterval: 2000,
//       revalidateIfStale: true,
//       refreshInterval: 0,
//     }
//   );

//   const [activeTab, setActiveTab] = useState(0);
//   const [isAutoPlay, setIsAutoPlay] = useState(true);
//   const [animKey, setAnimKey] = useState(0);

//   useEffect(() => {
//     if (!isAutoPlay || isLoading || !pricingData || pricingData.services.length === 0) return;
//     const interval = setInterval(() => {
//       setActiveTab(prev => {
//         const next = (prev + 1) % pricingData.services.length;
//         setAnimKey(k => k + 1);
//         return next;
//       });
//     }, (pricingData.autoPlayInterval || 4) * 1000);
//     return () => clearInterval(interval);
//   }, [isAutoPlay, isLoading, pricingData]);

//   if (!pricingData) return null;

//   const currentService = pricingData.services[activeTab] as any;
//   const currentContent = currentService;

//   const hasDiscount =
//     currentService?.discount?.isActive &&
//     currentService?.discount?.type !== 'none';
//   const discountAmount = hasDiscount
//     ? currentService.discount.type === 'percentage'
//       ? (currentService.price * currentService.discount.value) / 100
//       : currentService.discount.value
//     : 0;
//   const finalPrice = Math.round(currentService?.price - discountAmount);

//   return (
//     <section
//       id="pricing"
//       className="py-20 sm:py-28 md:py-40 px-4 sm:px-6 relative overflow-hidden"
//       style={{ background: 'linear-gradient(180deg, #f8faff 0%, #eef4ff 50%, #f8faff 100%)' }}
//     >
//       <style jsx global>{`
//         /* ── GPU-only animations ── */
//         @keyframes prc-in {
//           from { opacity: 0; transform: translateY(10px) scale(0.985); }
//           to   { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes prc-price-pop {
//           from { opacity: 0; transform: translateY(6px) scale(0.92); }
//           to   { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes prc-item-in {
//           from { opacity: 0; transform: translateX(-6px); }
//           to   { opacity: 1; transform: translateX(0); }
//         }
//         @keyframes prc-badge-pulse {
//           0%, 100% { transform: scale(1); }
//           50%       { transform: scale(1.03); }
//         }
//         @keyframes prc-shimmer {
//           from { transform: translateX(-120%) skewX(-8deg); }
//           to   { transform: translateX(280%) skewX(-8deg); }
//         }
//         @keyframes prc-ping {
//           0%   { transform: scale(1); opacity: 0.7; }
//           70%  { transform: scale(2.2); opacity: 0; }
//           100% { transform: scale(2.2); opacity: 0; }
//         }
//         @keyframes prc-tab-progress {
//           from { width: 0%; }
//           to   { width: 100%; }
//         }

//         .prc-card-in  { animation: prc-in 0.38s cubic-bezier(0.22,1,0.36,1) both; will-change: transform, opacity; }
//         .prc-price-pop { animation: prc-price-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s both; will-change: transform, opacity; }
//         .prc-item-in  { animation: prc-item-in 0.3s cubic-bezier(0.22,1,0.36,1) both; will-change: transform, opacity; }
//         .prc-badge-pulse { animation: prc-badge-pulse 2.4s ease-in-out infinite; will-change: transform; }

//         .prc-grid-card {
//           transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease, border-color 0.2s ease;
//           will-change: transform;
//         }
//         .prc-grid-card:hover { transform: translateY(-3px); }

//         .prc-feature:hover .prc-feature-text { color: #1d4ed8; }
//         .prc-feature:hover .prc-dot { transform: scale(1.4); }

//         .prc-cta {
//           transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease;
//           will-change: transform;
//           overflow: hidden;
//           position: relative;
//         }
//         .prc-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,99,235,0.35); }
//         .prc-cta:hover .prc-cta-shimmer { animation: prc-shimmer 0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
//         .prc-cta-shimmer {
//           position: absolute; top: 0; bottom: 0; width: 45%;
//           background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
//           pointer-events: none;
//         }
//         .prc-info-card {
//           transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease, border-color 0.2s ease;
//           will-change: transform;
//         }
//         .prc-info-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,99,235,0.1); }

//         @media (prefers-reduced-motion: reduce) {
//           .prc-card-in, .prc-price-pop, .prc-item-in, .prc-badge-pulse { animation: none !important; }
//           .prc-grid-card, .prc-cta, .prc-info-card { transition: none !important; }
//         }
//       `}</style>

//       {/* Static background */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
//         <div style={{ position: 'absolute', top: '8%', right: '-3%', width: '420px', height: '420px', background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 68%)', borderRadius: '50%' }} />
//         <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 68%)', borderRadius: '50%' }} />
//         <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(37,99,235,0.065) 1px, transparent 1px)', backgroundSize: '36px 36px', WebkitMaskImage: 'radial-gradient(ellipse 60% 70% at 80% 50%, black 0%, transparent 100%)', maskImage: 'radial-gradient(ellipse 60% 70% at 80% 50%, black 0%, transparent 100%)' }} />
//       </div>

//       <div className="max-w-6xl mx-auto relative z-10">

//         {/* ── SECTION HEADER — untouched ── */}
//         <SectionHeader
//           badge={pricingData.header.badge}
//           title={pricingData.header.title}
//           subtitle={pricingData.header.subtitle}
//           centered
//         />

//         {/* ── TAB NAVIGATION ── */}
//         <div
//           className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-14 px-2"
//           onMouseEnter={() => setIsAutoPlay(false)}
//           onMouseLeave={() => setIsAutoPlay(true)}
//         >
//           {pricingData.services.map((service: Service, idx: number) => {
//             const isActive = activeTab === idx;
//             return (
//               <button
//                 key={service.id}
//                 onClick={() => { setActiveTab(idx); setAnimKey(k => k + 1); setIsAutoPlay(false); }}
//                 style={{
//                   position: 'relative',
//                   padding: '9px 20px',
//                   borderRadius: '12px',
//                   fontSize: '13px',
//                   fontWeight: 600,
//                   cursor: 'pointer',
//                   background: isActive ? 'linear-gradient(135deg, #1e40af, #2563eb)' : 'rgba(255,255,255,0.85)',
//                   color: isActive ? 'white' : '#64748b',
//                   border: isActive ? '1.5px solid rgba(37,99,235,0.5)' : '1.5px solid rgba(219,234,254,0.8)',
//                   boxShadow: isActive ? '0 4px 16px rgba(37,99,235,0.25)' : '0 1px 4px rgba(37,99,235,0.04)',
//                   transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
//                   transition: 'all 0.28s cubic-bezier(0.22,1,0.36,1)',
//                   backdropFilter: 'blur(8px)',
//                   overflow: 'hidden',
//                   outline: 'none',
//                 }}
//                 onMouseEnter={e => {
//                   setIsAutoPlay(false);
//                   if (!isActive) {
//                     (e.currentTarget as HTMLElement).style.borderColor = 'rgba(147,197,253,0.7)';
//                     (e.currentTarget as HTMLElement).style.color = '#2563eb';
//                     (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
//                   }
//                 }}
//                 onMouseLeave={e => {
//                   setIsAutoPlay(true);
//                   if (!isActive) {
//                     (e.currentTarget as HTMLElement).style.borderColor = 'rgba(219,234,254,0.8)';
//                     (e.currentTarget as HTMLElement).style.color = '#64748b';
//                     (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
//                   }
//                 }}
//               >
//                 {/* Auto-play progress line */}
//                 {isActive && isAutoPlay && (
//                   <span style={{
//                     position: 'absolute', bottom: 0, left: 0,
//                     height: '2px',
//                     background: 'rgba(255,255,255,0.5)',
//                     borderRadius: '2px',
//                     animation: `prc-tab-progress ${(pricingData.autoPlayInterval || 4)}s linear forwards`,
//                   }} />
//                 )}
//                 {service.name}
//               </button>
//             );
//           })}
//         </div>

//         {/* ── MAIN CONTENT ── */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">

//           {/* ── LEFT: Details ── */}
//           <div key={`left-${animKey}`} className="lg:col-span-1 prc-card-in flex flex-col gap-6">
//             {/* Title card */}
//             <div style={{
//               padding: '22px 24px',
//               borderRadius: '20px',
//               background: 'rgba(255,255,255,0.95)',
//               border: '1.5px solid rgba(219,234,254,0.7)',
//               boxShadow: '0 4px 20px rgba(37,99,235,0.06)',
//             }}>
//               {/* Top accent */}
//               <div style={{ height: '3px', background: 'linear-gradient(90deg, #2563eb, #2563eb55, transparent)', borderRadius: '2px', marginBottom: '16px' }} />
//               <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
//                 <div style={{
//                   width: '40px', height: '40px', borderRadius: '11px', flexShrink: 0,
//                   background: 'linear-gradient(135deg, #1e40af, #2563eb)',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
//                 }}>
//                   <Sparkles style={{ width: '18px', height: '18px', color: 'white' }} />
//                 </div>
//                 <div>
//                   <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', lineHeight: 1.25, marginBottom: '4px' }}>
//                     {currentContent?.title}
//                   </h3>
//                   <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
//                     {currentContent?.value}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Feature list */}
//             <div style={{
//               padding: '20px 22px',
//               borderRadius: '20px',
//               background: 'rgba(255,255,255,0.95)',
//               border: '1.5px solid rgba(219,234,254,0.7)',
//               boxShadow: '0 4px 20px rgba(37,99,235,0.06)',
//               flex: 1,
//             }}>
//               <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '14px' }}>
//                 What's included
//               </p>
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//                 {currentContent?.points.map((point: string, i: number) => (
//                   <div
//                     key={i}
//                     className="prc-feature prc-item-in"
//                     style={{
//                       display: 'flex', alignItems: 'flex-start', gap: '10px',
//                       animationDelay: `${i * 55 + 60}ms`,
//                       cursor: 'default',
//                     }}
//                   >
//                     <div style={{
//                       width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
//                       background: 'rgba(37,99,235,0.08)',
//                       border: '1px solid rgba(37,99,235,0.2)',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       marginTop: '1px',
//                     }}>
//                       <Check style={{ width: '11px', height: '11px', color: '#2563eb' }} strokeWidth={3} />
//                     </div>
//                     <span className="prc-feature-text" style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5, fontWeight: 500, transition: 'color 0.2s ease' }}>
//                       {point}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* CTA */}
//             <button
//               className="prc-cta"
//               onClick={() => { window.location.href = `/select-slot?serviceId=${currentService?.id}`; }}
//               style={{
//                 width: '100%', padding: '14px 20px',
//                 borderRadius: '14px',
//                 background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8, #2563eb)',
//                 color: 'white', fontSize: '14px', fontWeight: 700,
//                 border: 'none', cursor: 'pointer',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
//                 boxShadow: '0 4px 18px rgba(37,99,235,0.3)',
//               }}
//             >
//               <span className="prc-cta-shimmer" />
//               <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 Book Now
//                 <ChevronRight style={{ width: '16px', height: '16px' }} />
//               </span>
//             </button>
//           </div>

//           {/* ── RIGHT: Price + Info Grid ── */}
//           <div key={`right-${animKey}`} className="lg:col-span-2 prc-card-in grid grid-cols-2 gap-4" style={{ animationDelay: '60ms' }}>

//             {/* Price hero card */}
//             <div
//               className="col-span-2"
//               style={{
//                 padding: '24px 28px',
//                 borderRadius: '20px',
//                 background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #1d4ed8 100%)',
//                 position: 'relative', overflow: 'hidden',
//                 boxShadow: '0 12px 48px rgba(37,99,235,0.25)',
//               }}
//             >
//               {/* Decorative orb */}
//               <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
//               <div style={{ position: 'absolute', bottom: '-20px', left: '30%', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
//               {/* Grid texture */}
//               <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

//               <div style={{ position: 'relative', zIndex: 1 }}>
//                 <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
//                   <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(148,163,184,0.8)' }}>
//                     Starting Investment
//                   </p>

//                   {/* Discount badge */}
//                   {hasDiscount && (
//                     <div className="prc-badge-pulse" style={{
//                       padding: '4px 12px', borderRadius: '100px',
//                       background: 'rgba(96,165,250,0.15)',
//                       border: '1px solid rgba(96,165,250,0.35)',
//                     }}>
//                       <span style={{ fontSize: '10px', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
//                         {currentService?.discount?.type === 'percentage'
//                           ? `${currentService?.discount?.value}% OFF`
//                           : `Save ₹${currentService?.discount?.value}`}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Price display */}
//                 <div className="prc-price-pop" style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: hasDiscount ? '16px' : '0' }}>
//                   {hasDiscount ? (
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
//                       <span style={{ fontSize: '13px', color: 'rgba(148,163,184,0.6)', textDecoration: 'line-through', fontWeight: 500 }}>
//                         ₹{currentService?.price}
//                       </span>
//                       <span style={{ fontSize: 'clamp(38px, 6vw, 58px)', fontWeight: 800, color: 'white', lineHeight: 1, letterSpacing: '-0.02em' }}>
//                         ₹{finalPrice}
//                       </span>
//                     </div>
//                   ) : (
//                     <span style={{ fontSize: 'clamp(38px, 6vw, 58px)', fontWeight: 800, color: 'white', lineHeight: 1, letterSpacing: '-0.02em' }}>
//                       ₹{currentService?.price}
//                     </span>
//                   )}
//                   <span style={{ fontSize: '13px', color: 'rgba(148,163,184,0.7)', paddingBottom: '6px', fontWeight: 500 }}>/session</span>
//                 </div>

//                 {/* Savings row */}
//                 {hasDiscount && (
//                   <div style={{
//                     display: 'inline-flex', alignItems: 'center', gap: '7px',
//                     padding: '7px 14px', borderRadius: '10px',
//                     background: 'rgba(96,165,250,0.1)',
//                     border: '1px solid rgba(96,165,250,0.2)',
//                   }}>
//                     <Check style={{ width: '12px', height: '12px', color: '#60a5fa' }} strokeWidth={3} />
//                     <span style={{ fontSize: '12px', color: '#93c5fd', fontWeight: 600 }}>
//                       You save ₹{Math.round(discountAmount)} on this offer
//                     </span>
//                   </div>
//                 )}

//                 <p style={{ fontSize: '11px', color: 'rgba(148,163,184,0.55)', marginTop: '12px' }}>
//                   Flexible scheduling available for all services
//                 </p>
//               </div>
//             </div>

//             {/* Info cards */}
//             {[
//               { label: 'Duration', value: currentService?.duration, unit: 'min' },
//               { label: 'Level', value: currentService?.level },
//               { label: 'Support', value: currentService?.support },
//               { label: 'Access', value: currentService?.access, unit: 'sessions' },
//             ].map((item, i) => {
//               const Icon = infoIcons[i];
//               return (
//                 <div
//                   key={i}
//                   className="prc-info-card prc-item-in"
//                   style={{
//                     padding: '18px 20px',
//                     borderRadius: '18px',
//                     background: 'rgba(255,255,255,0.95)',
//                     border: '1.5px solid rgba(219,234,254,0.7)',
//                     boxShadow: '0 2px 10px rgba(37,99,235,0.04)',
//                     animationDelay: `${i * 50 + 120}ms`,
//                     position: 'relative', overflow: 'hidden',
//                   }}
//                 >
//                   {/* Top accent line */}
//                   <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, rgba(37,99,235,0.4), transparent)' }} />
//                   <div style={{
//                     width: '30px', height: '30px', borderRadius: '9px',
//                     background: 'rgba(37,99,235,0.08)',
//                     border: '1px solid rgba(37,99,235,0.15)',
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     marginBottom: '10px',
//                   }}>
//                     <Icon style={{ width: '14px', height: '14px', color: '#2563eb' }} />
//                   </div>
//                   <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '4px' }}>
//                     {item.label}
//                   </p>
//                   <p style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
//                     {item.value || '—'}
//                     {item.unit && <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500, marginLeft: '4px' }}>{item.unit}</span>}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ── GRID OVERVIEW ── */}
//         {pricingData.showGridView && (
//           <div style={{ marginBottom: '48px' }}>
//             <p style={{
//               textAlign: 'center', fontSize: '11px', fontWeight: 700,
//               textTransform: 'uppercase', letterSpacing: '0.14em',
//               color: '#94a3b8', marginBottom: '16px',
//             }}>
//               Quick Overview
//             </p>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
//               {pricingData.services.map((service: Service, idx: number) => {
//                 const svc = service as any;
//                 const hasDsc = svc?.discount?.isActive && svc?.discount?.type !== 'none';
//                 const dAmt = hasDsc
//                   ? svc.discount.type === 'percentage'
//                     ? (service.price * svc.discount.value) / 100
//                     : svc.discount.value
//                   : 0;
//                 const fp = Math.round(service.price - dAmt);
//                 const isActive = activeTab === idx;

//                 return (
//                   <div
//                     key={service.id}
//                     className="prc-grid-card"
//                     onClick={() => { setActiveTab(idx); setAnimKey(k => k + 1); setIsAutoPlay(false); }}
//                     style={{
//                       padding: '14px 16px',
//                       borderRadius: '16px',
//                       background: isActive ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.7)',
//                       border: isActive ? '1.5px solid rgba(37,99,235,0.45)' : '1.5px solid rgba(219,234,254,0.7)',
//                       boxShadow: isActive ? '0 4px 18px rgba(37,99,235,0.12)' : '0 1px 4px rgba(37,99,235,0.04)',
//                       cursor: 'pointer',
//                       position: 'relative', overflow: 'hidden',
//                     }}
//                   >
//                     {/* Active indicator */}
//                     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: isActive ? 'linear-gradient(90deg, #2563eb, transparent)' : 'transparent', transition: 'background 0.25s ease' }} />

//                     {hasDsc && (
//                       <div className="prc-badge-pulse" style={{
//                         display: 'inline-block',
//                         padding: '2px 7px', borderRadius: '100px',
//                         background: 'rgba(37,99,235,0.08)',
//                         border: '1px solid rgba(37,99,235,0.2)',
//                         marginBottom: '8px',
//                       }}>
//                         <span style={{ fontSize: '9px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
//                           {svc.discount.type === 'percentage' ? `${svc.discount.value}% OFF` : `Save ₹${svc.discount.value}`}
//                         </span>
//                       </div>
//                     )}

//                     <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#94a3b8', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                       {service.name}
//                     </p>

//                     {hasDsc ? (
//                       <div>
//                         <p style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through', lineHeight: 1 }}>₹{service.price}</p>
//                         <p style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', lineHeight: 1.2 }}>₹{fp}</p>
//                         <p style={{ fontSize: '10px', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>Save ₹{Math.round(dAmt)}</p>
//                       </div>
//                     ) : (
//                       <p style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>₹{service.price}</p>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* ── STATS ── */}
//         {pricingData.showStats && (
//           <div style={{
//             paddingTop: '32px',
//             borderTop: '1px solid rgba(219,234,254,0.7)',
//           }}>
//             <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginBottom: '28px', maxWidth: '540px', margin: '0 auto 28px', lineHeight: 1.6 }}>
//               Join thousands of professionals who have transformed their careers with our expert guidance
//             </p>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
//               {pricingData.stats.map((item: { stat: string; desc: string }, i: number) => (
//                 <div
//                   key={i}
//                   style={{
//                     textAlign: 'center',
//                     padding: '20px 16px',
//                     borderRadius: '18px',
//                     background: 'rgba(255,255,255,0.85)',
//                     border: '1.5px solid rgba(219,234,254,0.6)',
//                     boxShadow: '0 2px 12px rgba(37,99,235,0.04)',
//                   }}
//                 >
//                   <p style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#2563eb', lineHeight: 1, marginBottom: '6px' }}>
//                     {item.stat}
//                   </p>
//                   <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8' }}>
//                     {item.desc}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Check, Zap, Clock, BarChart2, Layers, ChevronRight, Sparkles } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  title: string;
  value: string;
  points: string[];
  level: string;
  support: string;
  access: string;
}

interface PricingData {
  header: { badge: string; title: string; subtitle: string };
  services: Service[];
  stats: Array<{ stat: string; desc: string }>;
  ctaButtonText: string;
  autoPlayInterval: number;
  showGridView: boolean;
  showStats: boolean;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch pricing data');
  return res.json();
};

const infoIcons = [Clock, BarChart2, Zap, Layers];

export default function PricingSection() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const { data: pricingData } = useSWR(`${API_URL}/pricing-section/public`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
    revalidateIfStale: true,
    refreshInterval: 0,
  });

  const [activeTab, setActiveTab]   = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [animKey, setAnimKey]       = useState(0);

  useEffect(() => {
    if (!isAutoPlay || !pricingData?.services?.length) return;
    const iv = setInterval(() => {
      setActiveTab(p => (p + 1) % pricingData.services.length);
      setAnimKey(k => k + 1);
    }, (pricingData.autoPlayInterval || 4) * 1000);
    return () => clearInterval(iv);
  }, [isAutoPlay, pricingData]);

  if (!pricingData) return null;

  const currentService  = pricingData.services[activeTab] as any;
  const hasDiscount     = currentService?.discount?.isActive && currentService?.discount?.type !== 'none';
  const discountAmount  = hasDiscount
    ? currentService.discount.type === 'percentage'
      ? (currentService.price * currentService.discount.value) / 100
      : currentService.discount.value
    : 0;
  const finalPrice = Math.round(currentService?.price - discountAmount);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .prc-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes prc-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes prc-item-in {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes prc-price-pop {
          from { opacity: 0; transform: translateY(6px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes prc-tab-prog {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes prc-badge-pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.04); }
        }
        @keyframes prc-shimmer {
          from { transform: translateX(-120%) skewX(-8deg); }
          to   { transform: translateX(280%) skewX(-8deg); }
        }

        .prc-card-in   { animation: prc-in 0.38s cubic-bezier(.23,1,.32,1) both; }
        .prc-item-in   { animation: prc-item-in 0.3s cubic-bezier(.23,1,.32,1) both; }
        .prc-price-pop { animation: prc-price-pop 0.4s cubic-bezier(.34,1.56,.64,1) 0.1s both; }
        .prc-badge-pulse { animation: prc-badge-pulse 2.4s ease-in-out infinite; }

        .prc-tab-btn {
          transition: all 0.28s cubic-bezier(.23,1,.32,1);
        }
        .prc-tab-btn:not(.active):hover {
          border-color: rgba(29,78,216,0.25) !important;
          color: #1d4ed8 !important;
          transform: translateY(-1px);
          background: rgba(255,255,255,0.95) !important;
        }

        .prc-cta {
          position: relative; overflow: hidden;
          transition: transform 0.28s cubic-bezier(.23,1,.32,1), box-shadow 0.28s ease;
        }
        .prc-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(29,78,216,0.35) !important; }
        .prc-cta:hover .prc-shimmer { animation: prc-shimmer 0.65s cubic-bezier(.23,1,.32,1) forwards; }
        .prc-shimmer {
          position: absolute; top: 0; bottom: 0; width: 45%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          pointer-events: none;
        }

        .prc-info-card {
          transition: transform 0.28s cubic-bezier(.23,1,.32,1), box-shadow 0.28s ease, border-color 0.2s ease;
        }
        .prc-info-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(29,78,216,0.10) !important;
          border-color: rgba(29,78,216,0.18) !important;
        }
        .prc-info-card:hover .prc-info-icon {
          background: linear-gradient(135deg,#1e3a8a,#1d4ed8) !important;
        }
        .prc-info-card:hover .prc-info-icon svg { color: #fff !important; }

        .prc-grid-card {
          transition: transform 0.25s cubic-bezier(.23,1,.32,1), box-shadow 0.25s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .prc-grid-card:hover { transform: translateY(-2px); }

        .prc-feat-row { transition: background 0.2s ease; border-radius: 8px; }
        .prc-feat-row:hover { background: rgba(29,78,216,0.04); }
        .prc-feat-row:hover .prc-feat-text { color: #1d4ed8 !important; }

        @media (prefers-reduced-motion: reduce) {
          .prc-card-in, .prc-item-in, .prc-price-pop, .prc-badge-pulse { animation: none !important; }
          .prc-cta, .prc-info-card, .prc-grid-card { transition: none !important; }
        }
      `}</style>

      <section
        id="pricing"
        className="prc-grain relative py-20 lg:py-32 px-4 sm:px-6 overflow-hidden"
        style={{ background: '#f8f6f1', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        {/* Ambient blobs — no grid */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
          <div style={{ position:'absolute', top:'5%', right:'-2%', width:440, height:440, borderRadius:'50%', background:'radial-gradient(circle,rgba(29,78,216,0.07) 0%,transparent 70%)', filter:'blur(90px)' }} />
          <div style={{ position:'absolute', bottom:'8%', left:'-2%', width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle,rgba(8,145,178,0.05) 0%,transparent 70%)', filter:'blur(90px)' }} />
          <div style={{ position:'absolute', top:'50%', left:'40%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(29,78,216,0.04) 0%,transparent 70%)', filter:'blur(80px)', transform:'translate(-50%,-50%)' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">

          {/* ── Section header ── */}
          <div className="text-center mb-10 lg:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 border"
              style={{ background:'rgba(29,78,216,0.05)', borderColor:'rgba(29,78,216,0.15)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              <span style={{ fontSize:11, fontWeight:600, color:'#1d40b0', letterSpacing:'0.10em', textTransform:'uppercase' }}>
                {pricingData.header.badge}
              </span>
            </div>
            <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:300, letterSpacing:'-0.025em', lineHeight:1.1, color:'#0f172a', marginBottom:14 }}>
              {pricingData.header.title.split(' ').slice(0,-1).join(' ')}{' '}
              <span style={{ fontWeight:600, color:'#1d4ed8', fontStyle:'italic' }}>
                {pricingData.header.title.split(' ').slice(-1)}
              </span>
            </h2>
            <p style={{ fontSize:16, color:'#64748b', maxWidth:460, margin:'0 auto', lineHeight:1.7 }}>
              {pricingData.header.subtitle}
            </p>
          </div>

          {/* ── Tab nav ── */}
          <div
            className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-14 px-2"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            {pricingData.services.map((svc: Service, idx: number) => {
              const isAct = activeTab === idx;
              return (
                <button
                  key={svc.id}
                  onClick={() => { setActiveTab(idx); setAnimKey(k=>k+1); setIsAutoPlay(false); }}
                  className={`prc-tab-btn ${isAct ? 'active' : ''}`}
                  style={{
                    position:'relative', padding:'9px 20px', borderRadius:12, fontSize:13, fontWeight:600,
                    background: isAct ? 'linear-gradient(135deg,#1e3a8a,#1d4ed8)' : 'rgba(255,255,255,0.85)',
                    color: isAct ? '#fff' : '#64748b',
                    border: isAct ? '1px solid rgba(29,78,216,0.4)' : '1px solid rgba(29,78,216,0.12)',
                    boxShadow: isAct ? '0 4px 16px rgba(29,78,216,0.25)' : '0 1px 4px rgba(29,78,216,0.04)',
                    transform: isAct ? 'translateY(-1px)' : 'translateY(0)',
                    backdropFilter:'blur(8px)',
                    overflow:'hidden', cursor:'pointer', outline:'none',
                  }}
                >
                  {isAct && isAutoPlay && (
                    <span style={{
                      position:'absolute', bottom:0, left:0, height:'2px',
                      background:'rgba(255,255,255,0.45)', borderRadius:2,
                      animation:`prc-tab-prog ${(pricingData.autoPlayInterval||4)}s linear forwards`,
                    }} />
                  )}
                  {svc.name}
                </button>
              );
            })}
          </div>

          {/* ── Main content ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 mb-12">

            {/* LEFT — details */}
            <div key={`left-${animKey}`} className="lg:col-span-1 prc-card-in flex flex-col gap-4">

              {/* Title card */}
              <div className="bg-white rounded-2xl border p-5 sm:p-6"
                style={{ borderColor:'rgba(29,78,216,0.10)', boxShadow:'0 2px 16px rgba(29,78,216,0.06)' }}>
                <div className="h-0.5 rounded-full mb-5 w-9"
                  style={{ background:'linear-gradient(90deg,#1d4ed8,rgba(29,78,216,0.3))' }} />
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background:'linear-gradient(135deg,#1e3a8a,#1d4ed8)', boxShadow:'0 4px 14px rgba(29,78,216,0.28)' }}>
                    <Sparkles style={{ width:17, height:17, color:'#fff' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize:17, fontWeight:600, color:'#0f172a', lineHeight:1.3, letterSpacing:'-0.01em', marginBottom:4 }}>
                      {currentService?.title}
                    </h3>
                    <p style={{ fontSize:13, color:'#64748b', lineHeight:1.65 }}>
                      {currentService?.value}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl border p-5 sm:p-6 flex-1"
                style={{ borderColor:'rgba(29,78,216,0.10)', boxShadow:'0 2px 16px rgba(29,78,216,0.06)' }}>
                <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'#94a3b8', marginBottom:12 }}>
                  What's included
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {currentService?.points.map((point: string, i: number) => (
                    <div key={i} className="prc-feat-row prc-item-in flex items-start gap-3 p-1.5"
                      style={{ animationDelay:`${i*50+60}ms` }}>
                      <span className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background:'rgba(29,78,216,0.08)', border:'1px solid rgba(29,78,216,0.16)' }}>
                        <Check style={{ width:11, height:11, color:'#1d4ed8' }} strokeWidth={3} />
                      </span>
                      <span className="prc-feat-text text-sm text-slate-600 leading-relaxed font-medium transition-colors duration-200">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                className="prc-cta w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
                onClick={() => { window.location.href = `/select-slot?serviceId=${currentService?.id}`; }}
                style={{ background:'linear-gradient(135deg,#1e3a8a,#1d4ed8)', boxShadow:'0 4px 18px rgba(29,78,216,0.28)', border:'none', cursor:'pointer' }}
              >
                <span className="prc-shimmer" />
                <span style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', gap:8 }}>
                  {pricingData.ctaButtonText || 'Book Now'}
                  <ChevronRight style={{ width:16, height:16 }} />
                </span>
              </button>
            </div>

            {/* RIGHT — price + info */}
            <div key={`right-${animKey}`} className="lg:col-span-2 prc-card-in grid grid-cols-2 gap-4" style={{ animationDelay:'60ms' }}>

              {/* Price hero */}
              <div className="col-span-2 rounded-2xl overflow-hidden relative"
                style={{ background:'linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#1d4ed8 100%)', boxShadow:'0 12px 48px rgba(29,78,216,0.25)' }}>
                {/* decorative orbs */}
                <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(96,165,250,0.18) 0%,transparent 70%)', pointerEvents:'none' }} />
                <div style={{ position:'absolute', bottom:-20, left:'35%', width:120, height:120, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 70%)', pointerEvents:'none' }} />

                <div className="relative z-10 p-6 sm:p-8">
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                    <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.16em', color:'rgba(148,163,184,0.75)' }}>
                      Starting Investment
                    </p>
                    {hasDiscount && (
                      <div className="prc-badge-pulse px-3 py-1 rounded-full"
                        style={{ background:'rgba(96,165,250,0.14)', border:'1px solid rgba(96,165,250,0.32)' }}>
                        <span style={{ fontSize:10, fontWeight:700, color:'#93c5fd', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                          {currentService?.discount?.type === 'percentage'
                            ? `${currentService?.discount?.value}% OFF`
                            : `Save ₹${currentService?.discount?.value}`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="prc-price-pop flex items-end gap-3 mb-4">
                    {hasDiscount ? (
                      <div>
                        <p style={{ fontSize:13, color:'rgba(148,163,184,0.55)', textDecoration:'line-through', fontWeight:500, marginBottom:2 }}>
                          ₹{currentService?.price}
                        </p>
                        <p style={{ fontSize:'clamp(38px,6vw,58px)', fontWeight:300, color:'#fff', lineHeight:1, letterSpacing:'-0.03em' }}>
                          <span style={{ fontWeight:600 }}>₹{finalPrice}</span>
                        </p>
                      </div>
                    ) : (
                      <p style={{ fontSize:'clamp(38px,6vw,58px)', fontWeight:300, color:'#fff', lineHeight:1, letterSpacing:'-0.03em' }}>
                        <span style={{ fontWeight:600 }}>₹{currentService?.price}</span>
                      </p>
                    )}
                    <span style={{ fontSize:13, color:'rgba(148,163,184,0.65)', paddingBottom:6, fontWeight:500 }}>/session</span>
                  </div>

                  {hasDiscount && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl"
                      style={{ background:'rgba(96,165,250,0.10)', border:'1px solid rgba(96,165,250,0.18)' }}>
                      <Check style={{ width:11, height:11, color:'#60a5fa' }} strokeWidth={3} />
                      <span style={{ fontSize:12, color:'#93c5fd', fontWeight:600 }}>
                        You save ₹{Math.round(discountAmount)} on this offer
                      </span>
                    </div>
                  )}

                  <p style={{ fontSize:11, color:'rgba(148,163,184,0.45)', marginTop:12 }}>
                    Flexible scheduling available for all services
                  </p>
                </div>
              </div>

              {/* Info cards */}
              {[
                { label:'Duration',  value: currentService?.duration, unit:'min' },
                { label:'Level',     value: currentService?.level },
                { label:'Support',   value: currentService?.support },
                { label:'Access',    value: currentService?.access,   unit:'sessions' },
              ].map((item, i) => {
                const Icon = infoIcons[i];
                return (
                  <div key={i} className="prc-info-card prc-item-in bg-white rounded-2xl border p-4 sm:p-5 relative overflow-hidden"
                    style={{ borderColor:'rgba(29,78,216,0.10)', boxShadow:'0 2px 10px rgba(29,78,216,0.04)', animationDelay:`${i*50+120}ms` }}>
                    <div className="absolute top-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background:'linear-gradient(90deg,rgba(29,78,216,0.35),transparent)' }} />
                    <div className="prc-info-icon w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                      style={{ background:'rgba(29,78,216,0.08)', transition:'background 0.3s ease' }}>
                      <Icon style={{ width:14, height:14, color:'#1d4ed8', transition:'color 0.3s ease' }} />
                    </div>
                    <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.10em', color:'#94a3b8', marginBottom:4 }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize:'clamp(16px,2.2vw,22px)', fontWeight:600, color:'#0f172a', lineHeight:1, letterSpacing:'-0.01em' }}>
                      {item.value || '—'}
                      {item.unit && <span style={{ fontSize:10, color:'#94a3b8', fontWeight:500, marginLeft:4 }}>{item.unit}</span>}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Grid overview ── */}
          {pricingData.showGridView && (
            <div className="mb-12">
              <p style={{ textAlign:'center', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.14em', color:'#94a3b8', marginBottom:14 }}>
                Quick Overview
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10 }}>
                {pricingData.services.map((svc: Service, idx: number) => {
                  const s = svc as any;
                  const hasDsc = s?.discount?.isActive && s?.discount?.type !== 'none';
                  const dAmt  = hasDsc ? (s.discount.type === 'percentage' ? (svc.price * s.discount.value) / 100 : s.discount.value) : 0;
                  const fp    = Math.round(svc.price - dAmt);
                  const isAct = activeTab === idx;

                  return (
                    <div key={svc.id} className="prc-grid-card bg-white rounded-2xl border p-4 relative overflow-hidden"
                      onClick={() => { setActiveTab(idx); setAnimKey(k=>k+1); setIsAutoPlay(false); }}
                      style={{
                        borderColor: isAct ? 'rgba(29,78,216,0.28)' : 'rgba(29,78,216,0.10)',
                        boxShadow:   isAct ? '0 4px 18px rgba(29,78,216,0.12)' : '0 1px 6px rgba(29,78,216,0.04)',
                      }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-0.5"
                        style={{ background: isAct ? 'linear-gradient(90deg,#1d4ed8,rgba(29,78,216,0.3))' : 'transparent', transition:'background 0.25s ease' }} />
                      {hasDsc && (
                        <div className="prc-badge-pulse inline-block px-2 py-0.5 rounded-full mb-2"
                          style={{ background:'rgba(29,78,216,0.07)', border:'1px solid rgba(29,78,216,0.18)' }}>
                          <span style={{ fontSize:9, fontWeight:700, color:'#1d4ed8', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                            {s.discount.type === 'percentage' ? `${s.discount.value}% OFF` : `Save ₹${s.discount.value}`}
                          </span>
                        </div>
                      )}
                      <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.09em', color:'#94a3b8', marginBottom:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {svc.name}
                      </p>
                      {hasDsc ? (
                        <div>
                          <p style={{ fontSize:11, color:'#94a3b8', textDecoration:'line-through', lineHeight:1 }}>₹{svc.price}</p>
                          <p style={{ fontSize:20, fontWeight:700, color:'#1d4ed8', lineHeight:1.2, letterSpacing:'-0.02em' }}>₹{fp}</p>
                          <p style={{ fontSize:10, color:'#1d4ed8', fontWeight:600, marginTop:2 }}>Save ₹{Math.round(dAmt)}</p>
                        </div>
                      ) : (
                        <p style={{ fontSize:20, fontWeight:700, color:'#0f172a', lineHeight:1.2, letterSpacing:'-0.02em' }}>₹{svc.price}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Stats strip ── */}
          {pricingData.showStats && (
            <div className="pt-8" style={{ borderTop:'1px solid rgba(29,78,216,0.08)' }}>
              <p style={{ textAlign:'center', fontSize:14, color:'#64748b', maxWidth:520, margin:'0 auto 24px', lineHeight:1.7 }}>
                Join thousands of professionals who have transformed their careers with expert guidance.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12 }}>
                {pricingData.stats.map((item: { stat: string; desc: string }, i: number) => (
                  <div key={i} className="bg-white rounded-2xl border p-5 text-center"
                    style={{ borderColor:'rgba(29,78,216,0.10)', boxShadow:'0 2px 12px rgba(29,78,216,0.05)' }}>
                    <div className="h-0.5 w-8 rounded-full mx-auto mb-4"
                      style={{ background:'linear-gradient(90deg,#1d4ed8,rgba(29,78,216,0.3))' }} />
                    <p style={{ fontSize:'clamp(24px,3vw,32px)', fontWeight:300, letterSpacing:'-0.03em', color:'#0f172a', lineHeight:1, marginBottom:6 }}>
                      <span style={{ fontWeight:600, color:'#1d4ed8' }}>{item.stat}</span>
                    </p>
                    <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'#94a3b8' }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  );
}