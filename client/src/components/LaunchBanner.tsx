'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Sparkles, ArrowRight, Clock, Zap } from 'lucide-react';
import Link from 'next/link';

interface LaunchBannerProps {
  onVisibilityChange?: (isVisible: boolean) => void;
}

interface BannerData {
  isActive: boolean;
  message: string;
  originalPrice: number;
  discountedPrice: number;
  ctaText: string;
  ctaLink: string;
  countdownHours: number;
  showCountdown: boolean;
  badgeText: string;
  savePercentage: number;
}

export default function LaunchBanner({ onVisibilityChange }: LaunchBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [bannerHeight, setBannerHeight] = useState(0);

  // Fetch banner data from API with auto-refresh
  const fetchBannerData = useCallback(async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/launch-banner/active`, {
        cache: 'no-store',
      });
      const data = await response.json();

      if (data.success && data.data) {
        setBannerData(data.data);

        // If banner is not active, hide it
        if (!data.data.isActive) {
          setIsVisible(false);
          onVisibilityChange?.(false);
        }
      }
    } catch (error) {
      console.error('Failed to fetch banner data:', error);
    }
  }, [onVisibilityChange]);

  // Initial fetch and auto-refresh every 30 seconds
  useEffect(() => {
    fetchBannerData();
    const refreshInterval = setInterval(fetchBannerData, 30000);
    return () => clearInterval(refreshInterval);
  }, [fetchBannerData]);

  // Countdown timer - fixed to show remaining time correctly
  useEffect(() => {
    if (!bannerData?.showCountdown) return;

    // Store start time in localStorage or use current time
    const storageKey = 'bannerCountdownStart';
    let startTime = localStorage.getItem(storageKey);

    if (!startTime) {
      startTime = new Date().getTime().toString();
      localStorage.setItem(storageKey, startTime);
    }

    const calculateTimeLeft = () => {
      const start = parseInt(startTime!);
      const endTime = start + ((bannerData?.countdownHours || 48) * 60 * 60 * 1000);
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const totalHours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          hours: totalHours,
          minutes: minutes,
          seconds: seconds,
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [bannerData]);

  const handleClose = () => {
    setIsVisible(false);
    onVisibilityChange?.(false);
    localStorage.setItem('launchBannerDismissed', 'true');
  };

  // Check if user already dismissed the banner
  useEffect(() => {
    const dismissed = localStorage.getItem('launchBannerDismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
      onVisibilityChange?.(false);
    }
  }, [onVisibilityChange]);

  // Update banner height for navbar positioning
  useEffect(() => {
    const updateBannerHeight = () => {
      const bannerElement = document.getElementById('launch-banner');
      if (bannerElement) {
        const height = bannerElement.offsetHeight;
        setBannerHeight(height);
      }
    };

    updateBannerHeight();
    window.addEventListener('resize', updateBannerHeight);
    return () => window.removeEventListener('resize', updateBannerHeight);
  }, [isVisible, bannerData]);

  if (!isVisible || !bannerData || !bannerData.isActive) return null;

  return (
    <div id="launch-banner" className="hidden sm:block fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border-b border-blue-400/30 shadow-lg mb-8">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse" />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Tablet Layout - Simplified for smaller screens */}
        <div className="flex md:hidden flex-col py-2.5 gap-2">
          <div className="flex items-center justify-between gap-2">
            {/* Tablet Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full border border-white/30 ">
              <div className="relative">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-wide whitespace-nowrap">
                {bannerData.badgeText}
              </span>
            </div>

            {/* Close on tablet */}
            <button
              onClick={handleClose}
              className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              aria-label="Close banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <p className="text-sm text-white font-semibold">
                {bannerData.message}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-white/50 line-through">₹{bannerData.originalPrice}</span>
                <span className="text-xl font-bold text-white">₹{bannerData.discountedPrice}</span>
              </div>
              <div className="px-2 py-0.5 bg-white/90 rounded text-xs font-extrabold text-blue-600 whitespace-nowrap">
                {bannerData.savePercentage}% OFF
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bannerData.showCountdown && (
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/20 rounded-lg border border-white/30 ">
                <Clock className="w-3.5 h-3.5 text-white" />
                <span className="font-mono text-xs font-medium text-white">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            )}
            <Link
              href={bannerData.ctaLink}
              className="flex-1 text-center px-5 py-2 bg-white hover:bg-white/90 text-blue-600 text-sm font-bold rounded-lg transition-all"
            >
              {bannerData.ctaText}
            </Link>
          </div>
        </div>

        {/* Tablet/Desktop Layout */}
        <div className="hidden md:flex items-center justify-between py-3 gap-4">
          {/* Left Section: Message & Pricing */}
          <div className="flex items-center gap-3 lg:gap-6 flex-1 min-w-0">
            {/* Launch Badge - Enhanced */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full border-2 border-white/30 ">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                {bannerData.badgeText}
              </span>
            </div>

            {/* Message & Price - Enhanced */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 min-w-0">
              <p className="text-sm lg:text-base text-white font-semibold whitespace-nowrap ">
                {bannerData.message}
              </p>

              <div className="flex items-center gap-2 lg:gap-3">
                {/* Price */}
                <div className="flex items-baseline gap-1.5 lg:gap-2">
                  <span className="text-xs lg:text-sm text-white/50 line-through">₹{bannerData.originalPrice}</span>
                  <span className="text-lg lg:text-2xl font-bold text-white">₹{bannerData.discountedPrice}</span>
                </div>

                {/* Discount Badge - Enhanced */}
                <div className="px-2 lg:px-2.5 py-0.5 lg:py-1 bg-white/90 rounded-md text-[10px] lg:text-xs font-extrabold text-blue-600 animate-pulse">
                  SAVE {bannerData.savePercentage}%
                </div>
              </div>
            </div>

            {/* Timer - Desktop */}
            {bannerData.showCountdown && (
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg border border-white/30 ">
                <Clock className="w-4 h-4 text-white" />
                <div className="flex items-center gap-1 font-mono text-sm font-medium text-white">
                  <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-white/50">:</span>
                  <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-white/50">:</span>
                  <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Section: CTA & Close */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Timer - Tablet */}
            {bannerData.showCountdown && (
              <div className="flex xl:hidden items-center gap-1.5 px-2.5 py-1.5 bg-white/20 rounded-lg border border-white/30 ">
                <Clock className="w-3.5 h-3.5 text-white" />
                <span className="font-mono text-xs font-medium text-white whitespace-nowrap">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            )}

            {/* CTA Button - Enhanced */}
            <Link
              href={bannerData.ctaLink}
              className="group relative px-4 lg:px-6 py-2 lg:py-2.5 bg-white hover:bg-white/90 text-blue-600 text-xs lg:text-sm font-bold rounded-lg transition-all duration-300 overflow-hidden whitespace-nowrap hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-1.5 lg:gap-2">
                {bannerData.ctaText}
                <ArrowRight className="w-3.5 lg:w-4 h-3.5 lg:h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              aria-label="Close banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
