'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrustedBackground } from './trusted-background';
import { TrustHeader } from './trusted-header';
import { TechLogoGrid, TECH_BADGES, type TechBadge } from './tech-logo-grid';
import { TrustPillars, TRUST_PILLARS, type TrustPillar } from './trust-pillars';

export interface TrustedBySectionProps {
  className?: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  techBadges?: TechBadge[];
  pillars?: TrustPillar[];
}

export function TrustedBySection({
  className = '',
  eyebrow,
  heading,
  subheading,
  techBadges = TECH_BADGES,
  pillars = TRUST_PILLARS,
}: TrustedBySectionProps) {
  return (
    <section
      id="trusted"
      aria-labelledby="trusted-heading"
      className={`relative py-16 sm:py-20 lg:py-24 border-y border-border/40 bg-secondary/10 dark:bg-obsidian-950/40 overflow-hidden ${className}`}
    >
      <TrustedBackground />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          id="trusted-heading"
        >
          <TrustHeader eyebrow={eyebrow} heading={heading} subheading={subheading} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="relative"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-28 bg-gradient-to-r from-background via-background/92 to-transparent z-10 hidden sm:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-28 bg-gradient-to-l from-background via-background/92 to-transparent z-10 hidden sm:block"
          />
          <TechLogoGrid badges={techBadges} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="pt-4 sm:pt-6 border-t border-border/40"
        >
          <TrustPillars pillars={pillars} />
        </motion.div>
      </div>
    </section>
  );
}

export { TrustedBackground, TrustHeader, TechLogoGrid, TrustPillars, TECH_BADGES, TRUST_PILLARS };
export type { TechBadge } from './tech-logo-grid';
export type { TrustPillar } from './trust-pillars';
export type { TrustHeaderProps } from './trusted-header';
export type { TechLogoGridProps } from './tech-logo-grid';
export type { TrustPillarsProps } from './trust-pillars';
