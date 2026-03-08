'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import SectionHeader from '@/components/SectionHeader';

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
  header: {
    badge: string;
    title: string;
    subtitle: string;
  };
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

export default function PricingSection() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Use SWR for automatic data fetching and real-time updates
  const { data: pricingData, isLoading, error, mutate } = useSWR(
    `${API_URL}/pricing-section/public`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
      revalidateIfStale: true,
      refreshInterval: 0, // Disable auto-refresh (pricing data doesn't change frequently)
    }
  );

  const [activeTab, setActiveTab] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const loading = isLoading;

  useEffect(() => {
    if (!isAutoPlay || loading || !pricingData || pricingData.services.length === 0) return;

    const interval = setInterval(() => {
      setActiveTab(prev => (prev + 1) % pricingData.services.length);
    }, (pricingData.autoPlayInterval || 4) * 1000);

    return () => clearInterval(interval);
  }, [isAutoPlay, loading, pricingData]);

  if (!pricingData) return null;

  const currentService = pricingData.services[activeTab];
  const currentContent = pricingData.services[activeTab];

  return (
    <section className="py-20 sm:py-28 md:py-40 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-white via-blue-50/20 to-white" id="pricing">
      {/* Background Elements - Right Side */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/5 rounded-full blur-3xl" />
      </div>

      <style>{`
        @keyframes subtle-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .discount-badge {
          animation: subtle-pulse 2.5s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .shimmer-effect {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }

        @keyframes gentle-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        .float-animation {
          animation: gentle-float 3s ease-in-out infinite;
        }

        .tab-button {
          transition: all 0.3s ease;
          position: relative;
          padding: 12px 24px;
          border-radius: 12px;
          border: 2px solid rgba(59, 130, 246, 0.2);
          background: white;
          color: rgb(100, 116, 139);
          font-weight: 600;
          cursor: pointer;
        }

        .tab-button.active {
          color: rgb(255, 255, 255);
          background: linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235));
          border-color: rgb(59, 130, 246);
        }

        .tab-button:not(.active) {
          color: rgb(100, 116, 139);
          border-color: rgba(59, 130, 246, 0.2);
          background: white;
        }

        .tab-button:hover:not(.active) {
          color: rgb(59, 130, 246);
          border-color: rgba(59, 130, 246, 0.4);
          background: rgba(59, 130, 246, 0.03);
          transform: translateY(-2px);
        }

        .tab-container {
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          padding: 0 16px;
        }

        @media (max-width: 768px) {
          .tab-container {
            gap: 6px;
            padding: 0 8px;
          }

          .tab-button {
            padding: 6px 12px;
            font-size: 13px;
          }
        }

        .price-card-main {
          animation: slideInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .price-info-grid {
          animation: slideInRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .feature-item {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .feature-item:hover {
          transform: translateX(12px);
          color: rgba(255, 255, 255, 1);
        }

        .price-display {
          font-variant-numeric: tabular-nums;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .grid-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .grid-card:hover {
          transform: translateY(-3px);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .grid-card.active {
          border-color: rgb(59, 130, 246);
          background: rgba(59, 130, 246, 0.05);
          transform: translateY(-3px);
        }

        @media (max-width: 1024px) {
          .main-content-grid {
            gap: 8px;
          }
        }

        @media (max-width: 768px) {
          .main-content-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .price-grid {
            grid-template-columns: 1fr 1fr;
          }

          .price-grid-full {
            grid-column: 1 / -1;
          }
        }

        button.cta-btn {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        button.cta-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
          transition: left 0.6s cubic-bezier(0.15, 0.83, 0.66, 1);
          pointer-events: none;
        }

        button.cta-btn:hover {
          transform: translateY(-2px);
        }

        button.cta-btn:hover::before {
          left: 100%;
        }

        @media (max-width: 640px) {
          .tab-button {
            font-size: 12px;
            padding: 5px 10px;
          }

          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <SectionHeader
          badge={pricingData.header.badge}
          title={pricingData.header.title}
          subtitle={pricingData.header.subtitle}
          centered
        />

        {/* Tab Navigation */}
        <div
          className="tab-container mb-10 sm:mb-12 md:mb-16"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {pricingData.services.map((service: Service, idx: number) => (
            <button
              key={service.id}
              onClick={() => {
                setActiveTab(idx);
                setIsAutoPlay(false);
              }}
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
              className={`tab-button font-semibold ${
                activeTab === idx ? 'active' : ''
              }`}
            >
              {service.name}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="main-content-grid grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16 md:mb-20">
          {/* Left: Service Details */}
          <div className="lg:col-span-1 price-card-main">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  {currentContent?.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {currentContent?.value}
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {currentContent?.points.map((point: string, i: number) => (
                  <div key={i} className="feature-item flex items-center gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-700">{point}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  window.location.href = `/select-slot?serviceId=${currentService?.id}`;
                }}
                className="cta-btn w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105">
                Book Now
              </button>
            </div>
          </div>

          {/* Right: Price & Info Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4 sm:gap-6">
            {/* Price Box */}
            <div className="col-span-2 p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-50/50 relative overflow-hidden">
              {/* Subtle Discount Badge */}
              {(currentService as any)?.discount?.isActive && (currentService as any)?.discount?.type !== 'none' && (
                <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10">
                  <div className="discount-badge px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg bg-gradient-to-r from-blue-500/40 to-blue-600/40 border border-blue-400/40 ">
                    <span className="text-[10px] sm:text-xs font-bold text-blue-700 uppercase tracking-wide">
                      {(currentService as any)?.discount?.type === 'percentage'
                        ? `${(currentService as any)?.discount?.value}% OFF`
                        : `Save ₹${(currentService as any)?.discount?.value}`}
                    </span>
                  </div>
                </div>
              )}

              <p className="text-[10px] sm:text-xs text-slate-600 uppercase tracking-widest mb-2 sm:mb-3 font-semibold">
                Starting Investment
              </p>

              <div className="flex items-end gap-2 sm:gap-3 mb-4 sm:mb-6">
                {(currentService as any)?.discount?.isActive && (currentService as any)?.discount?.type !== 'none' ? (
                  <>
                    <div className="flex flex-col gap-0.5 sm:gap-1">
                      <span className="text-xs sm:text-sm text-slate-500 line-through">₹{currentService?.price}</span>
                      <span className="price-display text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600">
                        ₹{Math.round(currentService?.price - ((currentService as any)?.discount?.type === 'percentage'
                          ? (currentService?.price * (currentService as any)?.discount?.value) / 100
                          : (currentService as any)?.discount?.value))}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="price-display text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900">
                    ₹{currentService?.price}
                  </span>
                )}
                <span className="text-slate-500 text-xs sm:text-sm mb-1 sm:mb-2">/session</span>
              </div>

              {(currentService as any)?.discount?.isActive && (currentService as any)?.discount?.type !== 'none' && (
                <div className="float-animation p-2 sm:p-3 bg-blue-500/15 border border-blue-500/30 rounded-lg ">
                  <p className="text-[10px] sm:text-xs text-blue-700 font-semibold">
                    ✓ You save ₹{Math.round((currentService as any)?.discount?.type === 'percentage'
                      ? (currentService?.price * (currentService as any)?.discount?.value) / 100
                      : (currentService as any)?.discount?.value)} on this offer!
                  </p>
                </div>
              )}

              <p className="text-[10px] sm:text-xs text-slate-600 mt-3 sm:mt-4">
                Flexible scheduling available for all services
              </p>
            </div>

            {/* Info Cards - Using actual data from API */}
            {[
              { label: 'Duration', value: currentService?.duration, unit: 'min' },
              { label: 'Level', value: currentService?.level },
              { label: 'Support', value: currentService?.support },
              { label: 'Access', value: currentService?.access, unit: 'sessions' },
            ].map((item, i) => (
              <div key={i} className="p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border border-blue-200 bg-white hover:bg-blue-50 transition-all">
                <p className="text-[10px] sm:text-xs text-slate-600 uppercase tracking-widest mb-1 sm:mb-2 font-semibold">
                  {item.label}
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                  {item.value || '-'}
                  {item.unit && <span className="text-[10px] sm:text-xs text-slate-500 ml-1">{item.unit}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Grid View - All Services */}
        {pricingData.showGridView && (
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h3 className="text-center text-lg sm:text-xl font-bold text-slate-900 mb-6 sm:mb-8">
            Quick Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {pricingData.services.map((service: Service, idx: number) => {
              const serviceWithDiscount = service as any;
              const hasDiscount = serviceWithDiscount?.discount?.isActive && serviceWithDiscount?.discount?.type !== 'none';
              const discountAmount = hasDiscount
                ? serviceWithDiscount.discount.type === 'percentage'
                  ? (service.price * serviceWithDiscount.discount.value) / 100
                  : serviceWithDiscount.discount.value
                : 0;
              const finalPrice = Math.round(service.price - discountAmount);

              return (
                <div
                  key={service.id}
                  onClick={() => setActiveTab(idx)}
                  className={`grid-card ${activeTab === idx ? 'active' : ''} p-3 sm:p-4 rounded-lg sm:rounded-xl border ${hasDiscount ? 'border-blue-300 bg-blue-50' : 'border-blue-200 bg-white'} relative overflow-hidden cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50`}
                >
                  {hasDiscount && (
                    <div className="discount-badge absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 sm:px-2 rounded-full bg-blue-500/30 border border-blue-400/40">
                      <span className="text-[9px] sm:text-xs font-bold text-blue-700">
                        {serviceWithDiscount.discount.type === 'percentage'
                          ? `${serviceWithDiscount.discount.value}% OFF`
                          : `Save ₹${serviceWithDiscount.discount.value}`}
                      </span>
                    </div>
                  )}

                  <p className="text-[10px] sm:text-xs text-slate-600 uppercase tracking-widest mb-1.5 sm:mb-2 font-semibold truncate">
                    {service.name}
                  </p>

                  {hasDiscount ? (
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-xs sm:text-sm text-slate-500 line-through">₹{service.price}</p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">₹{finalPrice}</p>
                      <p className="text-[10px] sm:text-xs text-blue-700 font-semibold">Save ₹{Math.round(discountAmount)}</p>
                    </div>
                  ) : (
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">₹{service.price}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* Bottom Stats */}
        {pricingData.showStats && (
        <div className="text-center pt-8 sm:pt-10 md:pt-12 border-t border-blue-200">
          <p className="text-xs sm:text-sm text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of professionals who have transformed their careers with our expert guidance
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {pricingData.stats.map((item: { stat: string; desc: string }, i: number) => (
              <div key={i}>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{item.stat}</p>
                <p className="text-[10px] sm:text-xs text-slate-600 uppercase tracking-wider">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
