// 'use client';

// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { usePathname } from 'next/navigation';
// import { ChevronRight } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';
// import ProfileDropdown from './ProfileDropdown';

// const navLinks = [
//   { name: 'Home', href: '/' },
//   { name: 'About', href: '/about' },
//   { name: 'Services', href: '/services' },
//   { name: 'Contact', href: '/contact' },
// ];

// interface NavbarProps {
//   bannerHeight?: number;
// }

// export default function Navbar({ bannerHeight = 0 }: NavbarProps) {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const pathname = usePathname();
//   const { isLoggedIn, user } = useAuth();

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);
//     };

//     window.addEventListener('scroll', handleScroll, { passive: true });
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <>
//       {/* Main navbar */}
//       <nav
//         className="fixed left-0 right-0 z-50 flex justify-center px-4 pt-4 transition-all duration-300"
//         style={{ top: `${bannerHeight}px` }}
//       >
//         <div
//           className={`transition-all duration-700 ease-out rounded-2xl ${
//             isScrolled
//               ? 'w-full max-w-3xl bg-white/90 border-2 border-blue-200'
//               : 'w-full max-w-6xl bg-white/80 border-2 border-blue-100'
//           }`}
//         >
//           <div className={`transition-all duration-700 ${isScrolled ? 'px-4 sm:px-5' : 'px-4 sm:px-8'}`}>
//             <div className={`flex items-center justify-between transition-all duration-700 ${isScrolled ? 'h-12' : 'h-16'}`}>
//               {/* Logo */}
//               <Link href="/" className="flex items-center gap-2.5 group">
//                 <div className="relative">
//                   <div className={`rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
//                     isScrolled ? 'w-8 h-8' : 'w-9 h-9'
//                   }`}>
//                     <span className={`text-white font-bold transition-all duration-500 ${isScrolled ? 'text-xs' : 'text-sm'}`}>C</span>
//                   </div>
//                   <div className="absolute inset-0 rounded-xl bg-blue-400/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                 </div>
//                 <div className="flex flex-col">
//                   <span className={`font-semibold text-slate-900 leading-tight transition-all duration-500 ${isScrolled ? 'text-sm' : 'text-[15px]'}`}>
//                     YourInterviewCoach
//                   </span>
//                   <span className={`text-slate-500 uppercase tracking-widest leading-tight hidden sm:block transition-all duration-500 ${
//                     isScrolled ? 'text-[8px]' : 'text-[9px]'
//                   }`}>
//                     Mentorship
//                   </span>
//                 </div>
//               </Link>

//               {/* Desktop Nav - Centered pill */}
//               <div className="hidden md:flex items-center">
//                 <div className={`flex items-center gap-0.5 rounded-xl bg-blue-50 transition-all duration-500 ${
//                   isScrolled ? 'p-0.5' : 'p-1'
//                 }`}>
//                   {navLinks.map((link) => {
//                     const isActive = pathname === link.href;
//                     return (
//                       <Link
//                         key={link.name}
//                         href={link.href}
//                         className={`relative rounded-lg transition-all duration-300 ${
//                           isScrolled ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
//                         } ${
//                           isActive
//                             ? 'text-blue-600'
//                             : 'text-slate-600 hover:text-blue-600'
//                         }`}
//                       >
//                         {isActive && (
//                           <span className="absolute inset-0 bg-blue-100 rounded-lg" />
//                         )}
//                         <span className="relative">{link.name}</span>
//                       </Link>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Desktop CTA */}
//               <div className="hidden md:flex items-center gap-2">
//                 {isLoggedIn ? (
//                   <div className="flex items-center gap-2">
//                     <Link
//                       href="/dashboard"
//                       className={`text-slate-600 hover:text-blue-600 transition-all duration-300 ${
//                         isScrolled ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
//                       }`}
//                     >
//                       Dashboard
//                     </Link>
//                     <ProfileDropdown />
//                   </div>
//                 ) : (
//                   <>
//                     <Link
//                       href="/login"
//                       className={`text-slate-600 hover:text-blue-600 transition-all duration-300 ${
//                         isScrolled ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
//                       }`}
//                     >
//                       Sign in
//                     </Link>
//                     <Link
//                       href="/signup"
//                       className={`group relative font-medium rounded-xl overflow-hidden transition-all duration-500 ${
//                         isScrolled ? 'px-4 py-1.5 text-xs' : 'px-5 py-2 text-sm'
//                       }`}
//                     >
//                       <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transition-transform duration-300 group-hover:scale-105" />
//                       <span className="relative text-white flex items-center gap-1">
//                         Get started
//                         <ChevronRight className={`group-hover:translate-x-0.5 transition-all duration-300 ${
//                           isScrolled ? 'w-3 h-3' : 'w-3.5 h-3.5'
//                         }`} />
//                       </span>
//                     </Link>
//                   </>
//                 )}
//               </div>

//               {/* Mobile Menu Button */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className={`md:hidden relative flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-500 ${
//                   isScrolled ? 'w-9 h-9' : 'w-10 h-10'
//                 }`}
//               >
//                 <div className="relative w-5 h-5">
//                   <span
//                     className={`absolute left-0 w-5 h-0.5 bg-blue-600 transition-all duration-300 ${
//                       isMobileMenuOpen ? 'top-[9px] rotate-45' : 'top-[4px] rotate-0'
//                     }`}
//                   />
//                   <span
//                     className={`absolute left-0 top-[9px] w-5 h-0.5 bg-blue-600 transition-all duration-300 ${
//                       isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
//                     }`}
//                   />
//                   <span
//                     className={`absolute left-0 w-5 h-0.5 bg-blue-600 transition-all duration-300 ${
//                       isMobileMenuOpen ? 'top-[9px] -rotate-45' : 'top-[14px] rotate-0'
//                     }`}
//                   />
//                 </div>
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu Overlay */}
//       <div
//         className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
//           isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         {/* Backdrop */}
//         <div
//           className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />

//         {/* Menu Content */}
//         <div
//           className={`absolute top-24 left-4 right-4 bg-white/95 border-2 border-blue-200 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ${
//             isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
//           }`}
//         >
//           <div className="p-2">
//             {navLinks.map((link, idx) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="flex items-center justify-between px-4 py-4 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
//                 style={{
//                   transitionDelay: isMobileMenuOpen ? `${idx * 50}ms` : '0ms',
//                 }}
//               >
//                 <span className="text-[15px]">{link.name}</span>
//                 <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
//               </Link>
//             ))}
//           </div>

//           <div className="p-4 border-t border-blue-100 space-y-3">
//             {isLoggedIn ? (
//               <>
//                 <Link
//                   href="/dashboard"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="block w-full px-4 py-3 text-center text-sm text-slate-600 hover:text-blue-600 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
//                 >
//                   Dashboard
//                 </Link>
//                 <Link
//                   href="/dashboard?tab=profile"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="block w-full px-4 py-3 text-center text-sm text-slate-600 hover:text-blue-600 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
//                 >
//                   Profile Settings
//                 </Link>
//               </>
//             ) : (
//               <>
//                 <Link
//                   href="/login"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="block w-full px-4 py-3 text-center text-sm text-slate-600 hover:text-blue-600 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
//                 >
//                   Sign in
//                 </Link>
//                 <Link
//                   href="/signup"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="block w-full px-4 py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
//                 >
//                   Get started free
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Decorative gradient */}
//           <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-50/50 to-transparent pointer-events-none" />
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

interface NavbarProps {
  bannerHeight?: number;
}

export default function Navbar({ bannerHeight = 0 }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenu] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close mobile menu on route change */
  useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        .nav-root {
          font-family: 'DM Sans', system-ui, sans-serif;
        }
      `}</style>

      {/* ── NAV SHELL ── */}
      <nav
        className="nav-root fixed left-0 right-0 z-50 w-full"
        style={{
          top: 0,
          background: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* ── LOGO ── */}
            <Link href="/" className="flex items-center shrink-0">
              <img
                src="/yourinterviewcoach-logo1.png"
                alt="YourInterviewCoach"
                className="w-[60px] sm:w-[80px] md:w-[95px] h-auto"
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.16))" }}
              />
            </Link>

            {/* ── DESKTOP LINKS ── */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative px-3.5 py-1.5 rounded-lg text-[13px] font-medium"
                    style={{ color: active ? "#1d4ed8" : "#475569" }}
                  >
                    {active && (
                      <span
                        className="absolute inset-0 rounded-lg"
                        style={{ background: "rgba(29,78,216,0.08)" }}
                      />
                    )}
                    <span className="relative">{link.name}</span>
                    {active && (
                      <span
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full"
                        style={{ background: "#1d4ed8", opacity: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── DESKTOP CTA ── */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-3.5 py-1.5 text-[13px] font-medium text-slate-600 rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <ProfileDropdown />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3.5 py-1.5 text-[13px] font-medium text-slate-600 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-1.5 text-white text-[13px] font-semibold rounded-xl"
                    style={{ padding: "8px 16px", background: "#1d4ed8" }}
                  >
                    Sign up
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>

            {/* ── HAMBURGER ── */}
            <button
              onClick={() => setMobileMenu((p) => !p)}
              className="md:hidden flex flex-col items-center justify-center gap-[5px] w-9 h-9 rounded-xl"
              aria-label="Toggle menu"
            >
              <span
                className="block w-5 h-0.5 rounded-sm"
                style={{ background: "#1e3a8a" }}
              />
              <span
                className="block w-5 h-0.5 rounded-sm"
                style={{ background: "#1e3a8a" }}
              />
              <span
                className="block w-5 h-0.5 rounded-sm"
                style={{ background: "#1e3a8a" }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div
        className="fixed inset-0 z-40 md:hidden"
        style={{
          display: isMobileMenuOpen ? "block" : "none",
        }}
      >
        {/* backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(15,23,42,0.15)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setMobileMenu(false)}
        />

        {/* panel */}
        <div
          className="absolute left-4 right-4 overflow-hidden"
          style={{
            top: `calc(${bannerHeight}px + 76px)`,
            background: "rgba(255, 255, 255, 0.97)",
            border: "1px solid rgba(29, 78, 216, 0.14)",
            borderRadius: 18,
            boxShadow:
              "0 12px 48px rgba(29,78,216,0.12), 0 2px 8px rgba(29,78,216,0.06)",
          }}
        >
          {/* nav links */}
          <div className="p-2 pb-1">
            {navLinks.map((link, idx) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl"
                  style={{
                    background: active ? "rgba(29,78,216,0.07)" : "transparent",
                  }}
                >
                  <span
                    className="text-[15px] font-medium"
                    style={{ color: active ? "#1d4ed8" : "#475569" }}
                  >
                    {link.name}
                  </span>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: active
                        ? "rgba(29,78,216,0.10)"
                        : "transparent",
                    }}
                  >
                    <ArrowRight
                      className="w-3 h-3"
                      style={{ color: active ? "#1d4ed8" : "#94a3b8" }}
                    />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* divider */}
          <div
            className="mx-4 my-1 h-px"
            style={{ background: "rgba(29,78,216,0.08)" }}
          />

          {/* auth buttons */}
          <div className="p-3 space-y-2">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-600 rounded-xl border hover:bg-blue-50"
                  style={{ borderColor: "rgba(29,78,216,0.12)" }}
                >
                  Dashboard <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  href="/dashboard?tab=profile"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-600 rounded-xl border hover:bg-blue-50"
                  style={{ borderColor: "rgba(29,78,216,0.12)" }}
                >
                  Profile Settings{" "}
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-slate-700 rounded-xl border hover:bg-blue-50 hover:text-blue-600"
                  style={{ borderColor: "rgba(29,78,216,0.14)" }}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-white rounded-xl"
                  style={{ background: "#1d4ed8" }}
                >
                  Get started free <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* bottom links */}
          <div
            className="flex items-center justify-center gap-5 px-4 py-3 border-t"
            style={{ borderColor: "rgba(29,78,216,0.06)" }}
          >
            {[
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileMenu(false)}
                className="text-[11px] font-medium text-slate-400 hover:text-blue-500"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
