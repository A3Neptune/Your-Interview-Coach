'use client';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import LogosSection from '@/components/sections/LogosSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import StatsSection from '@/components/sections/StatsSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import PricingSection from '@/components/sections/PricingSection';
import FAQSection from '@/components/sections/FAQSection';
import CTASectionPremium from '@/components/sections/CTASectionPremium';
import StandardFooter from '@/components/StandardFooter';
import LaunchNotificationToast from '@/components/LaunchNotificationToast';
import ServicesPopup from '@/components/ServicesPopup';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <LaunchNotificationToast />
      <HeroSection />
      <LogosSection />
      <TestimonialsSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <CTASectionPremium />
      <StandardFooter />
      <ServicesPopup />
    </main>
  );
}
