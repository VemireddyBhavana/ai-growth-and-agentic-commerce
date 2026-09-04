import * as React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { TrustedBySection } from '../components/landing/TrustedBySection';
import { ProblemSolutionSection } from '../components/landing/ProblemSolutionSection';
import { CommerceFlowSection } from '../components/landing/CommerceFlowSection';
import { FeaturesGridSection } from '../components/landing/FeaturesGridSection';
import { InteractiveDemoSection } from '../components/landing/InteractiveDemoSection';
import { ExplainableAISection } from '../components/landing/ExplainableAISection';
import { MerchantDashboardPreviewSection } from '../components/landing/MerchantDashboardPreviewSection';
import { WhyRazorpaySection } from '../components/landing/WhyRazorpaySection';
import { ComparisonSection } from '../components/landing/ComparisonSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { FaqSection } from '../components/landing/FaqSection';
import { CtaSection } from '../components/landing/CtaSection';
import { FooterSection } from '../components/landing/FooterSection';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-brand-600 selection:text-white">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Main Landing Sections */}
      <main id="main-content" className="flex flex-col">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Trusted By Section */}
        <TrustedBySection />

        {/* 3. Problem + Solution Section */}
        <ProblemSolutionSection />

        {/* 4. AI Commerce Flow Section */}
        <CommerceFlowSection />

        {/* 5. Features Grid Bento Section */}
        <FeaturesGridSection />

        {/* 6. Interactive Live AI Demo Section */}
        <InteractiveDemoSection />

        {/* 7. Explainable AI & Audit Trail Section */}
        <ExplainableAISection />

        {/* 8. Merchant Dashboard Preview Section */}
        <MerchantDashboardPreviewSection />

        {/* 9. Why Razorpay (Deep Integration) Section */}
        <WhyRazorpaySection />

        {/* 10. Why Choose Us / Comparison Section */}
        <ComparisonSection />

        {/* 11. Customer Testimonials Section */}
        <TestimonialsSection />

        {/* 12. FAQ Accordion Section */}
        <FaqSection />

        {/* 13. Large Call To Action Section */}
        <CtaSection />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
