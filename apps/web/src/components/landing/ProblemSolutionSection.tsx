'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { PSHeader, type PSHeaderProps } from './ps-header';
import { ProblemCard, PROBLEM_CARDS, type ProblemCardData } from './problem-card';
import { SolutionCard, SOLUTION_CARDS, type SolutionCardData } from './solution-card';
import { ConnectorFlow } from './connector-flow';
import { StatsRow, DEFAULT_STATS, type StatMetric } from './ps-stats-row';

export interface ProblemSolutionSectionProps {
  className?: string;
  eyebrow?: PSHeaderProps['eyebrow'];
  heading?: PSHeaderProps['heading'];
  subheading?: PSHeaderProps['subheading'];
  problems?: ProblemCardData[];
  solutions?: SolutionCardData[];
  stats?: StatMetric[];
}

function PSBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ x: [0, 18, -14, 0], y: [0, -12, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[8%] -left-32 w-[520px] h-[460px] rounded-full bg-rose-500/12 dark:bg-rose-500/16 blur-[140px] opacity-75"
      />
      <motion.div
        animate={{ x: [0, -16, 12, 0], y: [0, 10, -14, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="absolute top-[12%] -right-28 w-[540px] h-[480px] rounded-full bg-emerald-500/12 dark:bg-emerald-500/16 blur-[140px] opacity-75"
      />
      <motion.div
        animate={{ x: [0, 14, -10, 0], y: [0, -8, 12, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
        className="absolute bottom-[8%] left-1/3 w-[420px] h-[380px] rounded-full bg-brand-600/12 dark:bg-brand-600/16 blur-[130px] opacity-65"
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-[42%] right-[30%] w-[260px] h-[260px] rounded-full bg-ai-violet/10 dark:bg-ai-violet/14 blur-[120px] opacity-55"
      />

      <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.22] dark:opacity-[0.18] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_42%,#000_58%,transparent_100%)]" />

      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/50 pointer-events-none" />
    </div>
  );
}

function MobileConnector() {
  return (
    <div className="lg:hidden flex flex-col items-center justify-center py-6" aria-hidden="true">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/30 via-ai-violet/30 to-ai-cyan/30 blur-xl opacity-55 animate-pulse" />
        <div className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-brand-500/40 dark:border-brand-400/40 bg-gradient-to-br from-brand-500/15 via-ai-violet/15 to-ai-cyan/15 backdrop-blur-xl">
          <div className="text-brand-600 dark:text-brand-400">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <span className="text-[11px] font-mono font-extrabold uppercase tracking-[0.1em] text-foreground whitespace-nowrap">
            AI Sales Assistant Resolves
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export function ProblemSolutionSection({
  className = '',
  eyebrow,
  heading,
  subheading,
  problems = PROBLEM_CARDS,
  solutions = SOLUTION_CARDS,
  stats = DEFAULT_STATS,
}: ProblemSolutionSectionProps) {
  return (
    <section
      id="problem-solution"
      aria-labelledby="ps-heading"
      className={`relative py-16 sm:py-20 lg:py-28 overflow-hidden bg-secondary/10 dark:bg-obsidian-950/30 border-y border-border/40 ${className}`}
    >
      <PSBackground />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-16 lg:space-y-20">
        <motion.div
          id="ps-heading"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <PSHeader eyebrow={eyebrow} heading={heading} subheading={subheading} />
        </motion.div>

        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-start xl:gap-2 gap-6 sm:gap-8 lg:gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="order-1 lg:order-1"
          >
            <div className="flex items-center gap-2 mb-5 sm:mb-6">
              <span className="inline-flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-400">
                Challenges Merchants Face
              </h3>
            </div>
            <div className="flex flex-col gap-4 sm:gap-5" role="list" aria-label="Merchant pain points">
              {problems.map((p, idx) => (
                <ProblemCard key={p.id} problem={p} index={idx} />
              ))}
            </div>
          </motion.div>

          <div className="order-2 lg:order-2">
            <MobileConnector />
            <ConnectorFlow />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-3 lg:order-3"
          >
            <div className="flex items-center gap-2 mb-5 sm:mb-6 lg:justify-end">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                How We Solve Each One
              </h3>
            </div>
            <div className="flex flex-col gap-4 sm:gap-5" role="list" aria-label="AI Sales Assistant solutions">
              {solutions.map((s, idx) => (
                <SolutionCard key={s.id} solution={s} index={idx} />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative pt-4 sm:pt-6 border-t border-border/40"
        >
          <div className="flex flex-col items-center gap-3 mb-6 sm:mb-8 text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/25 text-brand-600 dark:text-brand-400 text-[11px] font-mono font-bold uppercase tracking-[0.18em]">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M7 14l4-4 4 4 5-5" />
              </svg>
              Real Results After Integration
            </span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-foreground tracking-tight text-balance">
              Impact across every growth metric.
            </h3>
          </div>
          <StatsRow stats={stats} />
        </motion.div>
      </div>
    </section>
  );
}

export { PSHeader, ProblemCard, SolutionCard, ConnectorFlow, StatsRow };
export { PROBLEM_CARDS, SOLUTION_CARDS, DEFAULT_STATS };
export type { PSHeaderProps } from './ps-header';
export type { ProblemCardData, ProblemCardProps } from './problem-card';
export type { SolutionCardData, SolutionCardProps } from './solution-card';
export type { ConnectorFlowProps } from './connector-flow';
export type { StatMetric, StatsRowProps } from './ps-stats-row';
