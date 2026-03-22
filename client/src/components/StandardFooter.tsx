// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from 'lucide-react';
// import { usePathname } from 'next/navigation';

// const footerLinks = {
//   Product: [
//     { label: 'Features', href: '/#features' },
//     { label: 'Pricing', href: '/#pricing' },
//     { label: 'How it works', href: '/#how-it-works' },
//     { label: 'Dashboard', href: '/user-dashboard' },
//   ],
//   Company: [
//     { label: 'About', href: '#about' },
//     { label: 'Blog', href: '#blog' },
//     { label: 'Careers', href: '#careers' },
//     { label: 'Contact', href: '#contact' },
//   ],
//   Legal: [
//     { label: 'Privacy', href: '/privacy' },
//     { label: 'Terms', href: '/terms' },
//     { label: 'Cookie Policy', href: '/cookies' },
//     { label: 'Status', href: '#status' },
//   ],
// };

// const socialLinks = [
//   { icon: Twitter, href: '#twitter', label: 'Twitter' },
//   { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
//   { icon: Github, href: '#github', label: 'GitHub' },
//   { icon: Mail, href: 'mailto:hello@yourinterviewcoach.com', label: 'Email' },
// ];

// interface StandardFooterProps {
//   dark?: boolean;
// }

// export default function StandardFooter({ dark = false }: StandardFooterProps) {
//   const pathname = usePathname();
//   const [isDark, setIsDark] = useState(dark);

//   useEffect(() => {
//     // Always use light theme now
//     setIsDark(false);
//   }, [dark, pathname]);

//   return (
//     <footer className={`relative bg-gradient-to-br from-blue-50 via-white to-blue-50 border-t-2 border-blue-200 overflow-hidden`}>
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-12 mb-10 sm:mb-16">
//           <div className="col-span-2">
//             <Link href="/" className="inline-flex items-center gap-2 sm:gap-2.5 mb-4 sm:mb-6 group">
//               <div className={`w-8 sm:w-9 h-8 sm:h-9 rounded-lg ${isDark ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-blue-600'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
//                 <span className="text-white font-bold text-xs sm:text-sm font-heading">Y</span>
//               </div>
//               <div>
//                 <div className={`font-semibold text-sm sm:text-base font-heading ${isDark ? 'text-white' : 'text-slate-900'}`}>yourinterviewcoach</div>
//                 <div className={`text-[10px] sm:text-xs font-body ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Mentorship Platform</div>
//               </div>
//             </Link>
//             <p className={`text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 max-w-sm font-body ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
//               Connect with industry experts and mentors to accelerate your career growth. Learn, practice, and succeed together.
//             </p>
//             <div className="flex gap-2 sm:gap-3">
//               {socialLinks.map((social) => {
//                 const Icon = social.icon;
//                 return (
//                   <a
//                     key={social.label}
//                     href={social.href}
//                     aria-label={social.label}
//                     className={`w-9 sm:w-10 h-9 sm:h-10 rounded-lg transition-all duration-300 flex items-center justify-center group ${
//                       isDark
//                         ? 'bg-white/5 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white'
//                         : 'bg-blue-50 border border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700'
//                     }`}
//                   >
//                     <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:scale-110 transition-transform" />
//                   </a>
//                 );
//               })}
//             </div>
//           </div>

//           {Object.entries(footerLinks).map(([category, links]) => (
//             <div key={category}>
//               <h4 className={`text-xs sm:text-sm font-semibold mb-4 sm:mb-6 font-heading ${isDark ? 'text-white' : 'text-slate-900'}`}>{category}</h4>
//               <ul className="space-y-2 sm:space-y-3">
//                 {links.map((link) => (
//                   <li key={link.label}>
//                     <Link
//                       href={link.href}
//                       className={`text-xs sm:text-sm transition-colors duration-300 inline-flex items-center gap-1 group font-body ${
//                         isDark
//                           ? 'text-zinc-400 hover:text-blue-400'
//                           : 'text-slate-600 hover:text-blue-600'
//                       }`}
//                     >
//                       {link.label}
//                       <ArrowUpRight className="w-2.5 sm:w-3 h-2.5 sm:h-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         <div className={`h-px bg-gradient-to-r from-transparent to-transparent mb-6 sm:mb-8 ${isDark ? 'via-zinc-800' : 'via-blue-200'}`}></div>

//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
//           <p className={`text-[10px] sm:text-xs font-body text-center sm:text-left ${isDark ? 'text-zinc-500' : 'text-slate-600'}`}>
//             © 2026 yourinterviewcoach. All rights reserved. | Built with care for career growth.
//           </p>
//           <div className="flex items-center justify-center gap-1">
//             <span className={`text-[10px] sm:text-xs font-body flex items-center gap-1 ${isDark ? 'text-zinc-500' : 'text-slate-600'}`}>
//               Made with <span className="text-red-500">❤️</span> in Bangalore by <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>A3Neptune</span>
//             </span>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }


'use client';

import Link from 'next/link';
import { Linkedin, Twitter, Mail, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features',     href: '/#features'     },
    { label: 'Pricing',      href: '/#pricing'      },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Dashboard',    href: '/dashboard'     },
  ],
  Company: [
    { label: 'About',   href: '/about'   },
    { label: 'Blog',    href: '#blog'    },
    { label: 'Careers', href: '#careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy',       href: '/privacy'  },
    { label: 'Terms',         href: '/terms'    },
    { label: 'Cookie Policy', href: '/cookies'  },
    { label: 'Status',        href: '#status'   },
  ],
};

const socialLinks = [
  { icon: Twitter,  href: '#twitter',                            label: 'Twitter'  },
  { icon: Linkedin, href: '#linkedin',                           label: 'LinkedIn' },
  { icon: Mail,     href: 'mailto:hello@yourinterviewcoach.com', label: 'Email'    },
];

interface StandardFooterProps {
  dark?: boolean;
}

export default function StandardFooter({ dark = false }: StandardFooterProps) {

  /* ── token maps ── */
  const bg          = dark ? '#0d1117'                         : '#f8f6f1';
  const borderTop   = dark ? '1px solid rgba(255,255,255,0.06)': '1px solid rgba(29,78,216,0.10)';
  const blob1       = dark ? 'rgba(29,78,216,0.12)'            : 'rgba(29,78,216,0.05)';
  const blob2       = dark ? 'rgba(8,145,178,0.08)'            : 'rgba(8,145,178,0.04)';
  const logoText    = dark ? '#fff'                            : '#0f172a';
  const logoSub     = dark ? 'rgba(255,255,255,0.35)'          : '#94a3b8';
  const tagline     = dark ? 'rgba(255,255,255,0.45)'          : '#64748b';
  const socialBg    = dark ? 'rgba(255,255,255,0.06)'          : 'rgba(255,255,255,0.7)';
  const socialBdr   = dark ? 'rgba(255,255,255,0.10)'          : 'rgba(29,78,216,0.14)';
  const socialHBg   = dark ? 'rgba(29,78,216,0.25)'            : 'rgba(29,78,216,0.12)';
  const socialHBdr  = dark ? 'rgba(29,78,216,0.5)'             : 'rgba(29,78,216,0.28)';
  const catLabel    = dark ? 'rgba(255,255,255,0.25)'          : '#94a3b8';
  const linkColor   = dark ? 'rgba(255,255,255,0.5)'           : '#475569';
  const linkHover   = dark ? '#60a5fa'                         : '#1d4ed8';
  const divider     = dark ? 'rgba(255,255,255,0.06)'          : 'rgba(29,78,216,0.08)';
  const bottomText  = dark ? 'rgba(255,255,255,0.28)'          : '#94a3b8';
  const creditName  = dark ? '#60a5fa'                         : '#1d4ed8';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .footer-grain::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.028;
          pointer-events: none;
          z-index: 0;
        }

        .footer-social {
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.2s ease;
        }

        .footer-link {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          transition: color 0.2s ease;
        }
        .footer-link .link-arrow {
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
          transform: translate(-2px, 2px);
        }
        .footer-link:hover .link-arrow {
          opacity: 1;
          transform: translate(0, 0);
        }
      `}</style>

      <footer
        className="footer-grain relative overflow-hidden"
        style={{ background: bg, fontFamily:"'DM Sans', system-ui, sans-serif", borderTop }}
      >
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
          <div style={{ position:'absolute', top:0, left:'20%', width:340, height:200, borderRadius:'50%', background:`radial-gradient(circle,${blob1} 0%,transparent 70%)`, filter:'blur(70px)', transform:'translateY(-40%)' }} />
          <div style={{ position:'absolute', bottom:0, right:'15%', width:280, height:180, borderRadius:'50%', background:`radial-gradient(circle,${blob2} 0%,transparent 70%)`, filter:'blur(70px)', transform:'translateY(30%)' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

          {/* ── Main grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12 lg:mb-16">

            {/* Brand column */}
            <div className="col-span-2">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
                  style={{ background:'linear-gradient(135deg,#1e3a8a,#1d4ed8)', boxShadow:'0 2px 12px rgba(29,78,216,0.25)' }}
                >
                  <span className="text-white font-bold text-sm">YC</span>
                </div>
                <div>
                  <p className="font-semibold leading-tight group-hover:text-blue-500 transition-colors"
                    style={{ fontSize:14.5, letterSpacing:'-0.01em', color: logoText }}>
                    YourInterviewCoach
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] leading-none mt-0.5"
                    style={{ color: logoSub }}>
                    Mentorship Platform
                  </p>
                </div>
              </Link>

              <p style={{ fontSize:13.5, color: tagline, lineHeight:1.75, maxWidth:300, marginBottom:20 }}>
                Connect with Neel Aashish Seru and accelerate your career with expert,
                personalised interview coaching.
              </p>

              <div className="flex gap-2">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="footer-social w-9 h-9 rounded-xl flex items-center justify-center border"
                    style={{ background: socialBg, borderColor: socialBdr }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background    = socialHBg;
                      (e.currentTarget as HTMLElement).style.borderColor   = socialHBdr;
                      (e.currentTarget as HTMLElement).style.transform     = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background    = socialBg;
                      (e.currentTarget as HTMLElement).style.borderColor   = socialBdr;
                      (e.currentTarget as HTMLElement).style.transform     = 'translateY(0)';
                    }}
                  >
                    <Icon style={{ width:15, height:15, color: dark ? '#60a5fa' : '#1d4ed8' }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color: catLabel, marginBottom:16 }}>
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="footer-link"
                        style={{ fontSize:13.5, color: linkColor, fontWeight:400 }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = linkHover; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = linkColor; }}
                      >
                        {label}
                        <ArrowUpRight className="link-arrow" style={{ width:12, height:12, color: linkHover }} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height:1, background: divider, marginBottom:24 }} />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p style={{ fontSize:12, color: bottomText, fontWeight:400 }}>
              © 2026 YourInterviewCoach. All rights reserved.
            </p>
            <p style={{ fontSize:12, color: bottomText, fontWeight:400, display:'flex', alignItems:'center', gap:4 }}>
              Made with <span style={{ color:'#f43f5e' }}>♥</span> in Bangalore by{' '}
              <span style={{ fontWeight:600, color: creditName }}>A3Neptune</span>
            </p>
          </div>

        </div>
      </footer>
    </>
  );
}