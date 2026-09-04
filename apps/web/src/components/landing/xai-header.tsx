'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileSearch2 } from 'lucide-react';
import { staggerContainerVariants, fadeInVariants } from '@/lib/animations';

export interface XAIHeaderProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  className?: string;
}

export function XAIHeader({
  eyebrow = 'Explainable AI',
  heading = 'Every AI Decision Comes with an Explanation',
  subheading = 'Our AI never makes black-box decisions. Every recommendation includes customer intent, reasoning, confidence score, margin impact, inventory validation, and audit logs.',
  className = '',
}: XAIHeaderProps) {
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
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-ai-violet/12 dark:bg-ai-violet/16 border border-ai-violet/30 text-ai-violet text-[11px] font-mono font-bold uppercase tracking-[0.2em] mb-5 shadow-[0_0_35px_-10px_rgba(139,92,246,0.45)]"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-ai-violet/35 blur-sm animate-pulse" />
          <FileSearch2 className="relative w-4 h-4" strokeWidth={2.4} />
        </div>
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
