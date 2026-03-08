'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
];

interface NavbarProps {
  bannerHeight?: number;
}

export default function Navbar({ bannerHeight = 0 }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main navbar */}
      <nav
        className="fixed left-0 right-0 z-50 flex justify-center px-4 pt-4 transition-all duration-300"
        style={{ top: `${bannerHeight}px` }}
      >
        <div
          className={`transition-all duration-700 ease-out rounded-2xl ${
            isScrolled
              ? 'w-full max-w-3xl bg-white/90 border-2 border-blue-200'
              : 'w-full max-w-6xl bg-white/80 border-2 border-blue-100'
          }`}
        >
          <div className={`transition-all duration-700 ${isScrolled ? 'px-4 sm:px-5' : 'px-4 sm:px-8'}`}>
            <div className={`flex items-center justify-between transition-all duration-700 ${isScrolled ? 'h-12' : 'h-16'}`}>
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative">
                  <div className={`rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                    isScrolled ? 'w-8 h-8' : 'w-9 h-9'
                  }`}>
                    <span className={`text-white font-bold transition-all duration-500 ${isScrolled ? 'text-xs' : 'text-sm'}`}>C</span>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-blue-400/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="flex flex-col">
                  <span className={`font-semibold text-slate-900 leading-tight transition-all duration-500 ${isScrolled ? 'text-sm' : 'text-[15px]'}`}>
                    YourInterviewCoach
                  </span>
                  <span className={`text-slate-500 uppercase tracking-widest leading-tight hidden sm:block transition-all duration-500 ${
                    isScrolled ? 'text-[8px]' : 'text-[9px]'
                  }`}>
                    Mentorship
                  </span>
                </div>
              </Link>

              {/* Desktop Nav - Centered pill */}
              <div className="hidden md:flex items-center">
                <div className={`flex items-center gap-0.5 rounded-xl bg-blue-50 transition-all duration-500 ${
                  isScrolled ? 'p-0.5' : 'p-1'
                }`}>
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`relative rounded-lg transition-all duration-300 ${
                          isScrolled ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
                        } ${
                          isActive
                            ? 'text-blue-600'
                            : 'text-slate-600 hover:text-blue-600'
                        }`}
                      >
                        {isActive && (
                          <span className="absolute inset-0 bg-blue-100 rounded-lg" />
                        )}
                        <span className="relative">{link.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Desktop CTA */}
              <div className="hidden md:flex items-center gap-2">
                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/dashboard"
                      className={`text-slate-600 hover:text-blue-600 transition-all duration-300 ${
                        isScrolled ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <ProfileDropdown />
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={`text-slate-600 hover:text-blue-600 transition-all duration-300 ${
                        isScrolled ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
                      }`}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      className={`group relative font-medium rounded-xl overflow-hidden transition-all duration-500 ${
                        isScrolled ? 'px-4 py-1.5 text-xs' : 'px-5 py-2 text-sm'
                      }`}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transition-transform duration-300 group-hover:scale-105" />
                      <span className="relative text-white flex items-center gap-1">
                        Get started
                        <ChevronRight className={`group-hover:translate-x-0.5 transition-all duration-300 ${
                          isScrolled ? 'w-3 h-3' : 'w-3.5 h-3.5'
                        }`} />
                      </span>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden relative flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-500 ${
                  isScrolled ? 'w-9 h-9' : 'w-10 h-10'
                }`}
              >
                <div className="relative w-5 h-5">
                  <span
                    className={`absolute left-0 w-5 h-0.5 bg-blue-600 transition-all duration-300 ${
                      isMobileMenuOpen ? 'top-[9px] rotate-45' : 'top-[4px] rotate-0'
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-[9px] w-5 h-0.5 bg-blue-600 transition-all duration-300 ${
                      isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                    }`}
                  />
                  <span
                    className={`absolute left-0 w-5 h-0.5 bg-blue-600 transition-all duration-300 ${
                      isMobileMenuOpen ? 'top-[9px] -rotate-45' : 'top-[14px] rotate-0'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-24 left-4 right-4 bg-white/95 border-2 border-blue-200 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
        >
          <div className="p-2">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-4 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
                style={{
                  transitionDelay: isMobileMenuOpen ? `${idx * 50}ms` : '0ms',
                }}
              >
                <span className="text-[15px]">{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-blue-100 space-y-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-center text-sm text-slate-600 hover:text-blue-600 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard?tab=profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-center text-sm text-slate-600 hover:text-blue-600 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                >
                  Profile Settings
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-center text-sm text-slate-600 hover:text-blue-600 rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                >
                  Get started free
                </Link>
              </>
            )}
          </div>

          {/* Decorative gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-50/50 to-transparent pointer-events-none" />
        </div>
      </div>
    </>
  );
}
