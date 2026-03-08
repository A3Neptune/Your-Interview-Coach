'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, Moon, Sun } from 'lucide-react';

export default function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-6 right-6 z-50"
      >
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDark(!isDark)}
            className="p-3 rounded-full bg-white/10 border border-white/20 hover:border-white/40 transition-all backdrop-blur-sm"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>

          {/* Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-all"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </motion.div>

      {/* Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-6 z-40 bg-black/95 border border-white/20 rounded-2xl p-6 backdrop-blur-lg min-w-48"
          >
            <nav className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-300 hover:text-white transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <button className="w-full mt-6 px-4 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-all">
                Get Started
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo in top-left */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-6 left-6 z-50 flex items-center gap-2"
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
        <span className="font-bold text-xl hidden sm:block">CareerCoach</span>
      </motion.div>
    </>
  );
}
