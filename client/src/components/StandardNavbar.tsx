'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import NotificationBell from './NotificationBell';

const navLinks = [
  { name: 'Features', href: '/#features' },
  { name: 'How it works', href: '/#how-it-works' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'FAQ', href: '/#faq' },
];

const footerLinks = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Blog', href: '/blog' },
];

interface StandardNavbarProps {
  variant?: 'landing' | 'dashboard';
}

export default function StandardNavbar({ variant = 'landing' }: StandardNavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const { isLoggedIn, user, isLoading } = useAuth();

  // Check if on dashboard page
  const isOnDashboard = pathname.includes('/dashboard') || pathname.includes('/user-dashboard') || pathname.includes('/mentor-dashboard');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active link based on scroll position
      if (variant === 'landing') {
        const sections = navLinks.map(link => link.href.slice(1));
        for (const section of sections.reverse()) {
          const element = document.getElementById(section);
          if (element && window.scrollY >= element.offsetTop - 200) {
            setActiveLink(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  return (
    <>
      {/* Main navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <div
          className={`transition-all duration-700 ease-out rounded-2xl ${
            isScrolled
              ? 'w-full max-w-3xl bg-white/90 backdrop-blur-2xl border-2 border-blue-200 shadow-lg'
              : 'w-full max-w-6xl bg-white/80 backdrop-blur-md border-2 border-blue-100'
          }`}
        >
          <div className={`transition-all duration-700 ${isScrolled ? 'px-4 sm:px-5' : 'px-4 sm:px-8'}`}>
            <div className={`flex items-center justify-between transition-all duration-700 ${isScrolled ? 'h-12' : 'h-16'}`}>
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative">
                  <div className={`rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-md ${
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
                  {variant === 'landing' ? (
                    <>
                      {navLinks.map((link) => {
                        const isActive = activeLink === link.href;
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
                      {footerLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={`relative rounded-lg transition-all duration-300 ${
                            isScrolled ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
                          } text-slate-600 hover:text-blue-600`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <>
                      {!isOnDashboard && (
                        <Link
                          href="/user-dashboard"
                          className={`relative rounded-lg transition-all duration-300 ${
                            isScrolled ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
                          } text-slate-600 hover:text-blue-600`}
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link
                        href="/"
                        className={`relative rounded-lg transition-all duration-300 ${
                          isScrolled ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
                        } text-slate-600 hover:text-blue-600`}
                      >
                        Home
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Right side: Auth/Profile */}
              <div className="hidden md:flex items-center gap-2">
                {!isLoading && isLoggedIn ? (
                  <>
                    {!isOnDashboard && (
                      <Link
                        href="/user-dashboard"
                        className={`text-slate-600 hover:text-blue-600 transition-colors ${
                          isScrolled ? 'text-xs px-3 py-1' : 'text-sm px-4 py-1.5'
                        }`}
                      >
                        Dashboard
                      </Link>
                    )}
                    {isOnDashboard && <NotificationBell />}
                    <ProfileDropdown />
                  </>
                ) : !isLoading ? (
                  <>
                    <Link
                      href="/login"
                      className={`text-slate-600 hover:text-blue-600 transition-colors ${
                        isScrolled ? 'text-xs px-3 py-1' : 'text-sm px-4 py-1.5'
                      }`}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className={`rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors shadow-md ${
                        isScrolled ? 'text-xs px-4 py-1.5' : 'text-sm px-5 py-2'
                      }`}
                    >
                      Get started
                    </Link>
                  </>
                ) : null}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden pb-4 space-y-2 border-t-2 border-blue-200 mt-2 pt-2">
                {variant === 'landing' ? (
                  <>
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="block px-4 py-2 rounded-lg text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                    <hr className="border-blue-200 my-2" />
                    {footerLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="block px-4 py-2 rounded-lg text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </>
                ) : (
                  <>
                    {!isOnDashboard && (
                      <Link
                        href="/user-dashboard"
                        className="block px-4 py-2 rounded-lg text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    {isOnDashboard && (
                      <Link
                        href="/dashboard/gd-invitations"
                        className="block px-4 py-2 rounded-lg text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        GD Invitations
                      </Link>
                    )}
                    <Link
                      href="/"
                      className="block px-4 py-2 rounded-lg text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </>
                )}
                <hr className="border-blue-200 my-2" />
                {!isLoggedIn && (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2 rounded-lg text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get started free
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
