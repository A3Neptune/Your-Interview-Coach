"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import GroupDiscussionSection from "@/components/sections/GroupDiscussionSection";
import LogosSection from "@/components/sections/LogosSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CoursesSection from "@/components/sections/CoursesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASectionPremium from "@/components/sections/CTASectionPremium";
import StandardFooter from "@/components/StandardFooter";
import ServicesPopup from "@/components/ServicesPopup";
import HomePageTracker from "@/components/HomePageTracker";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <HomePageTracker />
      <Navbar />
      <HeroSection />
      <GroupDiscussionSection />
      <LogosSection />
      <TestimonialsSection />
      <CoursesSection />
      <PricingSection />
      <HowItWorksSection />
      <FAQSection />
      <CTASectionPremium />
      <StandardFooter />
      <ServicesPopup />
    </main>
  );
}
