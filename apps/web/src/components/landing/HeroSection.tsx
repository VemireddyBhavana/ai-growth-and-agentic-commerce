'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { HeroBackground } from './hero-background';
import { HeroContent, type HeroContentProps } from './hero-content';
import { HeroVisual } from './hero-visual';
import { ScrollIndicator } from './scroll-indicator';

export interface HeroSectionProps extends Pick<HeroContentProps, 'primaryHref' | 'secondaryHref'> {
  className?: string;
  scrollTargetId?: string;
}

export function HeroSection({
  className = '',
  primaryHref,
  secondaryHref,
  scrollTargetId = 'features',
}: HeroSectionProps) {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className={`relative min-h-[92vh] pt-28 sm:pt-32 pb-12 sm:pb-16 lg:pt-36 lg:pb-20 overflow-hidden ${className}`}
    >
      <HeroBackground />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-8 xl:gap-12">
          <div
            id="hero-heading"
            className="lg:col-span-6 xl:col-span-6 flex justify-start"
          >
            <HeroContent primaryHref={primaryHref} secondaryHref={secondaryHref} />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-6 xl:col-span-6 flex items-center justify-center lg:justify-end order-first lg:order-last"
          >
            <HeroVisual />
          </motion.div>
        </div>

        <div className="mt-14 sm:mt-20 lg:mt-24 flex justify-center">
          <ScrollIndicator targetId={scrollTargetId} />
        </div>
      </div>
    </section>
  );
}

export { HeroBackground, HeroContent, HeroVisual, ScrollIndicator };
export type { HeroContentProps } from './hero-content';
export type { HeroVisualProps } from './hero-visual';
export type { ScrollIndicatorProps } from './scroll-indicator';
