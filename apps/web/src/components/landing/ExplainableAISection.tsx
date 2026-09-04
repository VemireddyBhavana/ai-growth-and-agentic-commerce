'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { XAIHeader, type XAIHeaderProps } from './xai-header';
import {
  XAIDecisionCard,
  DECISION_PIPELINE,
  type DecisionStep,
} from './xai-decision-card';
import {
  XAIAuditTimeline,
  AUDIT_TIMELINE,
  type AuditEvent,
} from './xai-audit-timeline';
import {
  XAIConfidenceIndicators,
  CONFIDENCE_METRICS,
  type ConfidenceMetric,
} from './xai-confidence-indicators';

export interface ExplainableAISectionProps {
  className?: string;
  eyebrow?: XAIHeaderProps['eyebrow'];
  heading?: XAIHeaderProps['heading'];
  subheading?: XAIHeaderProps['subheading'];
  pipeline?: DecisionStep[];
  timeline?: AuditEvent[];
  metrics?: ConfidenceMetric[];
}

function XAIBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ x: [0, 18, -14, 0], y: [0, -12, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[6%] -left-32 w-[520px] h-[460px] rounded-full bg-ai-violet/14 dark:bg-ai-violet/18 blur-[140px] opacity-80"
      />
      <motion.div
        animate={{ x: [0, -16, 12, 0], y: [0, 10, -14, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="absolute top-[16%] -right-28 w-[540px] h-[480px] rounded-full bg-brand-600/12 dark:bg-brand-600/16 blur-[140px] opacity-75"
      />
      <motion.div
        animate={{ x: [0, 14, -10, 0], y: [0, -8, 12, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
        className="absolute bottom-[12%] left-1/3 w-[420px] h-[380px] rounded-full bg-ai-emerald/11 dark:bg-ai-emerald/15 blur-[130px] opacity-65"
      />
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-[44%] right-[24%] w-[280px] h-[280px] rounded-full bg-[#1366ef]/10 dark:bg-[#1366ef]/14 blur-[120px] opacity-55"
      />

      <div className="absolute inset-0 bg-grid-black dark:bg-grid-white opacity-[0.19] dark:opacity-[0.15] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_42%,#000_58%,transparent_100%)]" />

      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/55 pointer-events-none" />
    </div>
  );
}

export function ExplainableAISection({
  className = '',
  eyebrow,
  heading,
  subheading,
  pipeline = DECISION_PIPELINE,
  timeline = AUDIT_TIMELINE,
  metrics = CONFIDENCE_METRICS,
}: ExplainableAISectionProps) {
  return (
    <section
      id="explainable-ai"
      aria-labelledby="xai-heading"
      className={`relative py-16 sm:py-20 lg:py-28 overflow-hidden bg-secondary/8 dark:bg-obsidian-950/25 border-y border-border/40 ${className}`}
    >
      <XAIBackground />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-16 lg:space-y-20">
        <motion.div
          id="xai-heading"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <XAIHeader eyebrow={eyebrow} heading={heading} subheading={subheading} />
        </motion.div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 items-start gap-6 sm:gap-8 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <span className="inline-flex h-2 w-2 rounded-full bg-ai-violet animate-pulse" />
              <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.18em] text-ai-violet">
                Reasoning Pipeline
              </h3>
            </div>
            <XAIDecisionCard steps={pipeline} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-5 lg:justify-end">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                Immutable Audit Trail
              </h3>
            </div>
            <XAIAuditTimeline events={timeline} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="flex flex-col items-center gap-3 mb-6 sm:mb-8 text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ai-violet/12 dark:bg-ai-violet/16 border border-ai-violet/30 text-ai-violet text-[11px] font-mono font-bold uppercase tracking-[0.18em]">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="m9 11 3 3L22 4" />
              </svg>
              Confidence Scores
            </span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-foreground tracking-tight text-balance">
              Every signal audited. Every decision scored.
            </h3>
          </div>
          <XAIConfidenceIndicators metrics={metrics} />
        </motion.div>
      </div>
    </section>
  );
}

export { XAIHeader, XAIDecisionCard, XAIAuditTimeline, XAIConfidenceIndicators };
export { DECISION_PIPELINE, AUDIT_TIMELINE, CONFIDENCE_METRICS };
export type { XAIHeaderProps } from './xai-header';
export type { DecisionStep, XAIDecisionCardProps } from './xai-decision-card';
export type { AuditEvent, XAIAuditTimelineProps } from './xai-audit-timeline';
export type { ConfidenceMetric, XAIConfidenceIndicatorsProps } from './xai-confidence-indicators';
