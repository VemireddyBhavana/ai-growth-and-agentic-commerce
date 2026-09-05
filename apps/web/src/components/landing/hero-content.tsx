'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { staggerContainerVariants, fadeInVariants, springTransition } from '@/lib/animations';

export interface HeroContentProps {
  className?: string;
  primaryHref?: string;
  secondaryHref?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export function HeroContent({
  className = '',
  primaryHref = '/register',
  secondaryHref = '#demo',
  onPrimaryClick,
  onSecondaryClick,
}: HeroContentProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className={`relative z-10 flex flex-col items-start text-left ${className}`}
    >
      <motion.div
        variants={fadeInVariants}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 dark:bg-obsidian-850/90 border border-brand-500/20 shadow-sm backdrop-blur-md mb-7 group hover:border-brand-500/40 transition-colors"
      >
        <span className="flex h-2 w-2 rounded-full bg-ai-cyan animate-pulse" />
        <span className="text-xs font-semibold text-foreground tracking-wide flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-ai-violet" aria-hidden="true" />
          Autonomous Agentic Commerce Platform
        </span>
        <span className="hidden sm:inline text-xs text-muted-foreground font-mono">v1.0</span>
      </motion.div>

      <motion.h1
        variants={fadeInVariants}
        className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.08] tracking-tight text-foreground text-balance max-w-[18ch]"
      >
        Grow Merchant Revenue with{' '}
        <span className="aurora-gradient-text">AI-Powered Commerce</span>
      </motion.h1>

      <motion.p
        variants={fadeInVariants}
        className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed font-normal text-balance"
      >
        AI Sales Assistant helps merchants unlock revenue by turning passive browsers into buyers.
        It delivers natural conversational shopping, intelligent margin-aware product
        recommendations, and fully explainable AI decisions — all backed by secure, 1-click
        Razorpay-powered payments and PCI-grade tokenization.
      </motion.p>

      <motion.div
        variants={fadeInVariants}
        className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto"
      >
        <Link
          href={primaryHref}
          onClick={onPrimaryClick}
          aria-label="Start free trial"
          className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-semibold text-white overflow-hidden shadow-xl shadow-brand-600/30 transition-all duration-300 hover:shadow-brand-600/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 focus-visible:ring-offset-background"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-brand-600 via-ai-violet to-brand-600 bg-[length:200%_auto] transition-all duration-500 ease-out group-hover:bg-[position:100%_center]"
          />
          <span className="relative z-10 inline-flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-200" aria-hidden="true" />
            <span>Start Free</span>
            <ArrowRight
              className="w-4 h-4 ml-0.5 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </Link>

        <a
          href={secondaryHref}
          onClick={(e) => {
            if (secondaryHref.startsWith('#')) {
              e.preventDefault();
              const el = document.getElementById(secondaryHref.replace('#', ''));
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              window.history.pushState(null, '', secondaryHref);
            }
            onSecondaryClick?.();
          }}
          aria-label="Watch product demo"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-base font-medium text-foreground bg-secondary/80 dark:bg-obsidian-850 hover:bg-secondary dark:hover:bg-obsidian-800 border border-border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 focus-visible:ring-offset-background cursor-pointer"
        >
          <span className="relative inline-flex items-center justify-center">
            <Play
              className="w-4 h-4 text-ai-violet fill-ai-violet/30"
              aria-hidden="true"
            />
            <span className="absolute inset-0 rounded-full bg-ai-violet/30 blur-md animate-pulse-glow" aria-hidden="true" />
          </span>
          <span>Watch Demo</span>
        </a>
      </motion.div>

      <motion.div
        variants={fadeInVariants}
        transition={springTransition}
        className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-medium text-muted-foreground"
      >
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-ai-emerald" aria-hidden="true" />
          No credit card required
        </span>
        <span className="text-border/80 hidden sm:inline-block w-px h-4" aria-hidden="true" />
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-ai-emerald" aria-hidden="true" />
          Built for modern merchants
        </span>
      </motion.div>
    </motion.div>
  );
}
