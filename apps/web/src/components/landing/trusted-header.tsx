'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { staggerContainerVariants, fadeInVariants } from '@/lib/animations';

export interface TrustHeaderProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  className?: string;
}

export function TrustHeader({
  eyebrow = 'Ecosystem & Standards',
  heading = 'Trusted by Modern AI-Driven Businesses',
  subheading = 'Built with technologies and standards trusted by developers and merchants.',
  className = '',
}: TrustHeaderProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={`text-center max-w-3xl mx-auto ${className}`}
    >
      <motion.p
        variants={fadeInVariants}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/70 dark:bg-obsidian-900/80 border border-brand-500/20 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground mb-5"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-ai-cyan animate-pulse" />
        {eyebrow}
      </motion.p>

      <motion.h2
        variants={fadeInVariants}
        className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground leading-[1.15] text-balance"
      >
        {heading}
      </motion.h2>

      <motion.p
        variants={fadeInVariants}
        className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance"
      >
        {subheading}
      </motion.p>
    </motion.div>
  );
}
