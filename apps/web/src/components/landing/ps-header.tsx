'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { staggerContainerVariants, fadeInVariants } from '@/lib/animations';

export interface PSHeaderProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  className?: string;
}

export function PSHeader({
  eyebrow = 'The Challenge',
  heading = 'Running an Online Business Is Hard. Growing It Is Even Harder.',
  subheading = 'Merchants grapple with abandoned shopping carts, generic recommendation widgets, stagnant conversion rates, around-the-clock manual customer support, and fragmented business insights that leave growth on the table.',
  className = '',
}: PSHeaderProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={`text-center max-w-4xl mx-auto ${className}`}
    >
      <motion.div
        variants={fadeInVariants}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold uppercase tracking-[0.18em] mb-5"
      >
        <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
        {eyebrow}
      </motion.div>

      <motion.h2
        variants={fadeInVariants}
        className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground leading-[1.12] text-balance"
      >
        {heading}
      </motion.h2>

      <motion.p
        variants={fadeInVariants}
        className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance"
      >
        {subheading}
      </motion.p>
    </motion.div>
  );
}
