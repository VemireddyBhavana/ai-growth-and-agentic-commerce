'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { RazorpayHeader, type RazorpayHeaderProps } from './razorpay-header';
import {
  RazorpayFeatureCard,
  RAZORPAY_FEATURES,
  type RazorpayFeatureData,
} from './razorpay-feature-card';
import {
  RazorpayComparison,
  RAZORPAY_COMPARISON,
  type RazorpayComparisonData,
} from './razorpay-comparison';

export interface WhyRazorpaySectionProps {
  className?: string;
  eyebrow?: RazorpayHeaderProps['eyebrow'];
  heading?: RazorpayHeaderProps['heading'];
  subheading?: RazorpayHeaderProps['subheading'];
  features?: RazorpayFeatureData[];
  comparison?: RazorpayComparisonData;
}

function WhyRazorpayBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ x: [0, 16, -12, 0], y: [0, -10, 8, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[6%] -left-28 w-[520px] h-[460px] rounded-full bg-[#1366ef]/14 dark:bg-[#1366ef]/18 blur-[140px] opacity-80"
      />
      <motion.div
        animate={{ x: [0, -14, 10, 0], y: [0, 10, -12, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="absolute top-[14%] -right-24 w-[500px] h-[440px] rounded-full bg-brand-600/12 dark:bg-brand-600/16 blur-[130px] opacity-75"
      />
      <motion.div
        animate={{ x: [0, 12, -9, 0], y: [0, -8, 10, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
        className="absolute bottom-[10%] left-[26%] w-[420px] h-[380px] rounded-full bg-ai-emerald/11 dark:bg-ai-emerald/15 blur-[130px] opacity-65"
      />
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-[44%] right-[24%] w-[260px] h-[260px] rounded-full bg-ai-violet/10 dark:bg-ai-violet/14 blur-[120px] opacity-55"
      />

      <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.2] dark:opacity-[0.16] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_42%,#000_58%,transparent_100%)]" />

      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/55 pointer-events-none" />
    </div>
  );
}

export function WhyRazorpaySection({
  className = '',
  eyebrow,
  heading,
  subheading,
  features = RAZORPAY_FEATURES,
  comparison = RAZORPAY_COMPARISON,
}: WhyRazorpaySectionProps) {
  return (
    <section
      id="why-razorpay"
      aria-labelledby="razorpay-heading"
      className={`relative py-16 sm:py-20 lg:py-28 overflow-hidden bg-secondary/8 dark:bg-obsidian-950/25 border-y border-border/40 ${className}`}
    >
      <WhyRazorpayBackground />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-16 lg:space-y-20">
        <motion.div
          id="razorpay-heading"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <RazorpayHeader eyebrow={eyebrow} heading={heading} subheading={subheading} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.06 }}
        >
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch"
            role="list"
            aria-label="Razorpay native integration capabilities"
          >
            {features.map((f, idx) => (
              <RazorpayFeatureCard key={f.id} feature={f} index={idx} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="flex flex-col items-center gap-3 mb-6 sm:mb-8 text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1366ef]/10 dark:bg-[#1366ef]/15 border border-[#1366ef]/30 text-[#0f54c8] dark:text-[#60a5fa] text-[11px] font-mono font-bold uppercase tracking-[0.18em]">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M7 14l4-4 4 4 5-5" />
              </svg>
              Side-by-Side Impact
            </span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-foreground tracking-tight text-balance">
              A native payment stack is a growth multiplier.
            </h3>
          </div>
          <RazorpayComparison data={comparison} />
        </motion.div>
      </div>
    </section>
  );
}

export { RazorpayHeader, RazorpayFeatureCard, RazorpayComparison };
export { RAZORPAY_FEATURES, RAZORPAY_COMPARISON };
export type { RazorpayHeaderProps } from './razorpay-header';
export type { RazorpayFeatureData, RazorpayFeatureCardProps } from './razorpay-feature-card';
export type { RazorpayComparisonData, ComparisonSide, RazorpayComparisonProps } from './razorpay-comparison';
