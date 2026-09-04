'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  BrainCircuit,
  Gauge,
  FileSearch2,
  type LucideIcon,
} from 'lucide-react';

export interface TrustPillar {
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
  tone: 'emerald' | 'violet' | 'cyan' | 'brand';
}

export const TRUST_PILLARS: TrustPillar[] = [
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description:
      'Razorpay-native PCI-DSS Level 1 tokenization, UPI 1-click checkout, HMAC-timing-safe webhook verification.',
    badge: 'PCI-DSS',
    tone: 'emerald',
  },
  {
    icon: BrainCircuit,
    title: 'AI Powered',
    description:
      'OpenAI GPT reasoning engine with margin-aware product ranking, vector retrieval, and structured agent outputs.',
    badge: 'GPT + pgvector',
    tone: 'violet',
  },
  {
    icon: Gauge,
    title: 'Fast Performance',
    description:
      'Next.js edge runtime, sub-100ms LLM-first-byte streaming, Prisma connection pooling, and 99.99% uptime SLA.',
    badge: '≤ 100ms p95',
    tone: 'cyan',
  },
  {
    icon: FileSearch2,
    title: 'Explainable AI',
    description:
      'Every recommendation ships with a human-readable reasoning trace, confidence score, and full auditable telemetry.',
    badge: 'XAI',
    tone: 'brand',
  },
];

const toneMap: Record<TrustPillar['tone'], string> = {
  emerald:
    'from-ai-emerald/20 via-ai-emerald/5 to-transparent text-ai-emerald border-ai-emerald/30 group-hover:border-ai-emerald/50',
  violet:
    'from-ai-violet/20 via-ai-violet/5 to-transparent text-ai-violet border-ai-violet/30 group-hover:border-ai-violet/50',
  cyan: 'from-ai-cyan/20 via-ai-cyan/5 to-transparent text-ai-cyan border-ai-cyan/30 group-hover:border-ai-cyan/50',
  brand:
    'from-brand-500/20 via-brand-500/5 to-transparent text-brand-600 dark:text-brand-400 border-brand-500/30 group-hover:border-brand-500/50',
};

const toneGlowMap: Record<TrustPillar['tone'], string> = {
  emerald: 'hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.35)]',
  violet: 'hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.35)]',
  cyan: 'hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.35)]',
  brand: 'hover:shadow-[0_0_40px_-10px_rgba(14,165,233,0.35)]',
};

export interface TrustPillarsProps {
  pillars?: TrustPillar[];
  className?: string;
}

export function TrustPillars({ pillars = TRUST_PILLARS, className = '' }: TrustPillarsProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch ${className}`}
      role="list"
      aria-label="Trust pillars and platform guarantees"
    >
      {pillars.map((pillar, idx) => {
        const Icon = pillar.icon;
        const toneClasses = toneMap[pillar.tone];
        const glowClass = toneGlowMap[pillar.tone];
        return (
          <motion.article
            role="listitem"
            key={pillar.title}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.55,
              delay: idx * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -5, scale: 1.01 }}
            className={`group relative flex flex-col gap-4 p-5 sm:p-6 rounded-2xl border border-border/70 dark:border-white/10 bg-card/70 dark:bg-obsidian-900/70 backdrop-blur-xl bg-gradient-to-br ${toneClasses} shadow-[0_14px_40px_-24px_rgba(15,23,42,0.5)] hover:shadow-2xl hover:shadow-brand-500/10 ${glowClass} transition-all duration-300 ease-out focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-500/50 focus-within:ring-offset-2 focus-within:ring-offset-background`}
            tabIndex={0}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-white/40 via-transparent to-transparent dark:from-white/[0.05] opacity-60 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-80"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/10 via-transparent to-white/5 dark:from-white/[0.08]"
              style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '1px' }}
            />

            <header className="relative flex items-start justify-between gap-3">
              <div className="relative w-11 h-11 rounded-2xl bg-background/80 dark:bg-obsidian-850/80 border border-border/60 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-[-2deg] transition-all duration-300 ease-out">
                <Icon className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider border border-inherit bg-background/60 dark:bg-obsidian-950/60 transition-all duration-300 group-hover:bg-background/80">
                {pillar.badge}
              </span>
            </header>

            <div className="relative space-y-2">
              <h3 className="font-heading font-bold text-lg leading-tight text-foreground transition-colors duration-300 group-hover:text-foreground/95">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-muted-foreground/95">
                {pillar.description}
              </p>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
