'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  CreditCard,
  FileJson,
  DatabaseZap,
  Boxes,
  FileCode2,
} from 'lucide-react';

export interface TechBadge {
  name: string;
  description?: string;
  Icon: React.ComponentType<{ className?: string }>;
  tone: 'openai' | 'razorpay' | 'nextjs' | 'postgres' | 'prisma' | 'typescript';
  tagline?: string;
}

export const TECH_BADGES: TechBadge[] = [
  {
    name: 'OpenAI',
    Icon: BrainCircuit,
    tone: 'openai',
    description: 'GPT reasoning + embeddings',
    tagline: 'REASONING ENGINE',
  },
  {
    name: 'Razorpay',
    Icon: CreditCard,
    tone: 'razorpay',
    description: 'PCI-grade 1-click payments',
    tagline: 'PAYMENTS RAIL',
  },
  {
    name: 'Next.js',
    Icon: FileJson,
    tone: 'nextjs',
    description: 'App Router + Edge Runtime',
    tagline: 'FRAMEWORK',
  },
  {
    name: 'PostgreSQL',
    Icon: DatabaseZap,
    tone: 'postgres',
    description: 'pgvector + ACID foundation',
    tagline: 'VECTOR DB',
  },
  {
    name: 'Prisma',
    Icon: Boxes,
    tone: 'prisma',
    description: 'Type-safe ORM + migrations',
    tagline: 'DATA LAYER',
  },
  {
    name: 'TypeScript',
    Icon: FileCode2,
    tone: 'typescript',
    description: 'Strict mode end-to-end',
    tagline: 'LANGUAGE',
  },
];

const toneClassMap: Record<TechBadge['tone'], string> = {
  openai:
    'from-[#10a37f]/20 via-[#10a37f]/5 to-transparent text-[#0d8f6d] dark:text-[#34d399] border-[#10a37f]/30 hover:shadow-[#10a37f]/20',
  razorpay:
    'from-[#1366ef]/20 via-[#1366ef]/5 to-transparent text-[#0f54c8] dark:text-[#60a5fa] border-[#1366ef]/30 hover:shadow-[#1366ef]/20',
  nextjs:
    'from-slate-900/15 via-slate-900/5 to-transparent text-foreground dark:text-white border-slate-500/30 hover:shadow-slate-500/15',
  postgres:
    'from-[#336791]/20 via-[#336791]/5 to-transparent text-[#2a5578] dark:text-[#60a5fa] border-[#336791]/30 hover:shadow-[#336791]/20',
  prisma:
    'from-[#2d3748]/20 via-[#2d3748]/5 to-transparent text-[#1a202c] dark:text-[#a78bfa] border-[#2d3748]/30 hover:shadow-[#7c3aed]/15',
  typescript:
    'from-[#3178c6]/20 via-[#3178c6]/5 to-transparent text-[#235a97] dark:text-[#93c5fd] border-[#3178c6]/30 hover:shadow-[#3178c6]/20',
};

export interface TechLogoGridProps {
  badges?: TechBadge[];
  className?: string;
}

function TechBadgeCard({ badge, idx }: { badge: TechBadge; idx: number }) {
  const Icon = badge.Icon;
  const toneClasses = toneClassMap[badge.tone];
  return (
    <motion.div
      role="listitem"
      key={badge.name}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.5,
        delay: idx * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`group relative shrink-0 flex flex-col items-center justify-center w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] lg:w-[160px] xl:w-[170px] px-3 py-5 sm:px-4 sm:py-6 rounded-2xl border border-border/70 dark:border-white/10 bg-card/70 dark:bg-obsidian-900/70 backdrop-blur-xl bg-gradient-to-br ${toneClasses} shadow-[0_10px_30px_-20px_rgba(15,23,42,0.4)] hover:shadow-xl transition-all duration-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-500/50 focus-within:ring-offset-2 focus-within:ring-offset-background`}
      tabIndex={0}
      aria-label={`${badge.name} — ${badge.description ?? badge.tagline}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-white/40 via-transparent to-transparent dark:from-white/[0.04] opacity-50 mix-blend-overlay"
      />
      <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-background/70 dark:bg-obsidian-850/70 border border-border/60 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-5.5 h-5.5 sm:w-6 sm:h-6" aria-hidden="true" />
      </div>

      <div className="relative mt-3.5 text-center">
        <div className="font-heading font-extrabold text-base sm:text-lg tracking-wide text-foreground leading-none">
          {badge.name}
        </div>
        {badge.tagline && (
          <div className="mt-1.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/80">
            {badge.tagline}
          </div>
        )}
        {badge.description && (
          <div className="mt-2 text-[11px] sm:text-xs text-muted-foreground leading-snug">
            {badge.description}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function TechLogoGrid({ badges = TECH_BADGES, className = '' }: TechLogoGridProps) {
  const duplicatedBadges = React.useMemo(() => [...badges, ...badges], [badges]);

  return (
    <div className={`${className}`} role="list" aria-label="Technology partners and standards">
      <div className="flex flex-wrap gap-4 sm:gap-5 items-stretch justify-center lg:hidden">
        {badges.map((badge, idx) => (
          <div
            key={badge.name}
            className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)]"
          >
            <TechBadgeCard badge={badge} idx={idx} />
          </div>
        ))}
      </div>

      <div className="relative hidden lg:block overflow-hidden" aria-hidden="false">
        <motion.div
          className="flex gap-5 items-stretch"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 42,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ width: 'max-content' }}
          role="list"
        >
          {duplicatedBadges.map((badge, idx) => (
            <TechBadgeCard key={`${badge.name}-${idx}`} badge={badge} idx={idx} />
          ))}
        </motion.div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background via-background/95 to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background via-background/95 to-transparent z-10"
        />
      </div>
    </div>
  );
}
