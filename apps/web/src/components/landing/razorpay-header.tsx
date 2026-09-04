'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { staggerContainerVariants, fadeInVariants } from '@/lib/animations';

export interface RazorpayHeaderProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  className?: string;
}

export function RazorpayHeader({
  eyebrow = 'Powered By Razorpay',
  heading = 'Built Natively on Razorpay\'s Commerce Infrastructure',
  subheading = 'AI Sales Assistant leverages Razorpay APIs for secure tokenized checkout, instant payment processing, payment verification, webhook automation, audit logging, and merchant-grade reliability.',
  className = '',
}: RazorpayHeaderProps) {
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
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1366ef]/10 dark:bg-[#1366ef]/15 border border-[#1366ef]/30 text-[#0f54c8] dark:text-[#60a5fa] text-[11px] font-mono font-bold uppercase tracking-[0.2em] mb-5 shadow-[0_0_30px_-8px_rgba(19,102,239,0.35)]"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#1366ef]/30 blur-sm animate-pulse" />
          <CreditCard className="relative w-4 h-4" strokeWidth={2.5} />
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
