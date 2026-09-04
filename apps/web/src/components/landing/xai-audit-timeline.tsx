'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquareText,
  BrainCircuit,
  ListOrdered,
  Store,
  CreditCard,
  CheckCircle2,
  FileDigit,
  ArrowDown,
  type LucideIcon,
} from 'lucide-react';

export interface AuditEvent {
  id: string;
  icon: LucideIcon;
  title: string;
  timestamp: string;
  status: string;
  eventId: string;
  tone: 'violet' | 'cyan' | 'indigo' | 'amber' | 'razorpay' | 'emerald' | 'brand';
  statusTone: 'info' | 'pending' | 'success' | 'done';
}

export const AUDIT_TIMELINE: AuditEvent[] = [
  {
    id: 'user-prompt',
    icon: MessageSquareText,
    title: 'User Prompt Captured',
    timestamp: '14:32:08.104',
    status: 'Captured',
    eventId: 'evt_2hXa7pQ9m…c8F',
    tone: 'violet',
    statusTone: 'success',
  },
  {
    id: 'ai-reasoning',
    icon: BrainCircuit,
    title: 'AI Reasoning Executed',
    timestamp: '14:32:08.446',
    status: 'Reasoned',
    eventId: 'evt_2hXa7pRa…k2M',
    tone: 'cyan',
    statusTone: 'success',
  },
  {
    id: 'product-rank',
    icon: ListOrdered,
    title: 'Product Ranking Stored',
    timestamp: '14:32:08.519',
    status: 'Ranked',
    eventId: 'evt_2hXa7pSb…t4P',
    tone: 'indigo',
    statusTone: 'success',
  },
  {
    id: 'merchant-approval',
    icon: Store,
    title: 'Merchant Rules Applied',
    timestamp: '14:32:08.583',
    status: 'Approved',
    eventId: 'evt_2hXa7pT9…q7V',
    tone: 'amber',
    statusTone: 'success',
  },
  {
    id: 'payment-request',
    icon: CreditCard,
    title: 'Razorpay Payment Request',
    timestamp: '14:32:08.697',
    status: 'Requested',
    eventId: 'order_Na9f7Kh…xGz',
    tone: 'razorpay',
    statusTone: 'pending',
  },
  {
    id: 'payment-success',
    icon: CheckCircle2,
    title: 'Payment Success (UPI)',
    timestamp: '14:32:17.214',
    status: 'Settled',
    eventId: 'pay_Nb1qM3z…p9A',
    tone: 'emerald',
    statusTone: 'success',
  },
  {
    id: 'ledger',
    icon: FileDigit,
    title: 'Audit Ledger Written',
    timestamp: '14:32:17.231',
    status: 'Immutable',
    eventId: 'log_Xai_sha256…e89',
    tone: 'brand',
    statusTone: 'done',
  },
];

const toneMap: Record<
  AuditEvent['tone'],
  { iconBg: string; iconText: string; dot: string; connector: string; glow: string }
> = {
  violet: {
    iconBg: 'bg-ai-violet/14 dark:bg-ai-violet/22 border-ai-violet/35',
    iconText: 'text-ai-violet',
    dot: 'bg-ai-violet',
    connector: 'from-ai-violet/80 to-ai-cyan/60',
    glow: 'shadow-[0_0_22px_-6px_rgba(139,92,246,0.5)]',
  },
  cyan: {
    iconBg: 'bg-ai-cyan/14 dark:bg-ai-cyan/22 border-ai-cyan/35',
    iconText: 'text-ai-cyan',
    dot: 'bg-ai-cyan',
    connector: 'from-ai-cyan/80 to-indigo-500/60',
    glow: 'shadow-[0_0_22px_-6px_rgba(6,182,212,0.5)]',
  },
  indigo: {
    iconBg: 'bg-indigo-500/14 dark:bg-indigo-500/22 border-indigo-500/35',
    iconText: 'text-indigo-600 dark:text-indigo-400',
    dot: 'bg-indigo-500',
    connector: 'from-indigo-500/80 to-amber-500/60',
    glow: 'shadow-[0_0_22px_-6px_rgba(99,102,241,0.5)]',
  },
  amber: {
    iconBg: 'bg-amber-500/14 dark:bg-amber-500/22 border-amber-500/35',
    iconText: 'text-amber-500 dark:text-amber-400',
    dot: 'bg-amber-500',
    connector: 'from-amber-500/80 to-[#1366ef]/60',
    glow: 'shadow-[0_0_22px_-6px_rgba(245,158,11,0.5)]',
  },
  razorpay: {
    iconBg: 'bg-[#1366ef]/14 dark:bg-[#1366ef]/22 border-[#1366ef]/35',
    iconText: 'text-[#0f54c8] dark:text-[#60a5fa]',
    dot: 'bg-[#1366ef]',
    connector: 'from-[#1366ef]/80 to-emerald-500/60',
    glow: 'shadow-[0_0_22px_-6px_rgba(19,102,239,0.5)]',
  },
  emerald: {
    iconBg: 'bg-emerald-500/14 dark:bg-emerald-500/22 border-emerald-500/35',
    iconText: 'text-emerald-500',
    dot: 'bg-emerald-500',
    connector: 'from-emerald-500/80 to-brand-500/60',
    glow: 'shadow-[0_0_22px_-6px_rgba(16,185,129,0.5)]',
  },
  brand: {
    iconBg: 'bg-brand-500/14 dark:bg-brand-500/22 border-brand-500/35',
    iconText: 'text-brand-600 dark:text-brand-400',
    dot: 'bg-brand-500',
    connector: 'from-brand-500/80 to-brand-500/20',
    glow: 'shadow-[0_0_22px_-6px_rgba(14,165,233,0.5)]',
  },
};

const statusToneMap: Record<AuditEvent['statusTone'], string> = {
  info: 'bg-secondary/70 border-border text-muted-foreground',
  pending: 'bg-amber-500/12 border-amber-500/30 text-amber-600 dark:text-amber-400',
  success: 'bg-emerald-500/12 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
  done: 'bg-brand-500/12 border-brand-500/30 text-brand-600 dark:text-brand-400',
};

export interface XAIAuditTimelineProps {
  events?: AuditEvent[];
  className?: string;
}

export function XAIAuditTimeline({
  events = AUDIT_TIMELINE,
  className = '',
}: XAIAuditTimelineProps) {
  return (
    <div
      className={`group relative w-full rounded-3xl border border-border/70 dark:border-white/10 bg-card/65 dark:bg-obsidian-900/65 backdrop-blur-2xl shadow-[0_22px_65px_-32px_rgba(15,23,42,0.75)] overflow-hidden ${className}`}
      role="region"
      aria-label="Audit event timeline"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-brand-500/[0.04] dark:from-emerald-500/[0.06] dark:to-brand-500/[0.06]"
      />

      <header className="relative flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border/60 bg-secondary/25 dark:bg-obsidian-950/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-emerald-500/40 blur-md animate-pulse opacity-70" />
            <div className="relative w-9 h-9 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/25 border border-emerald-500/40 flex items-center justify-center text-emerald-500">
              <FileDigit className="w-4.5 h-4.5" strokeWidth={2.3} />
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-muted-foreground mb-0.5">
              Event Log &bull; Immutable
            </div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-foreground leading-tight">
              Audit Trail Timeline
            </h3>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-500/30 bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Ledger
        </div>
      </header>

      <div className="relative px-4 sm:px-6 py-5 sm:py-6">
        <ol className="relative" role="list">
          <div
            aria-hidden="true"
            className="absolute left-[1.375rem] sm:left-[1.4rem] top-2 bottom-2 w-px bg-gradient-to-b from-ai-violet/60 via-[#1366ef]/50 to-brand-500/60"
          />

          {events.map((event, idx) => {
            const Icon = event.icon;
            const tone = toneMap[event.tone];
            const statusTone = statusToneMap[event.statusTone];
            return (
              <motion.li
                key={event.id}
                role="listitem"
                initial={{ opacity: 0, x: 8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className="relative mb-4 last:mb-0"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="relative shrink-0 pt-0.5 z-10">
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.06 + 0.04, type: 'spring', stiffness: 260, damping: 20 }}
                      whileHover={{ scale: 1.1 }}
                      className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${tone.iconBg} flex items-center justify-center shadow-inner ${tone.iconText} ${tone.glow}`}
                    >
                      <Icon className="w-5.5 h-5.5 sm:w-6 sm:h-6" strokeWidth={2.2} aria-hidden="true" />
                      <span className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full ${tone.dot} ring-2 ring-background dark:ring-obsidian-900`} />
                    </motion.div>
                  </div>

                  <motion.div
                    whileHover={{ x: 2 }}
                    className="group/card relative min-w-0 flex-1 p-3.5 sm:p-4 rounded-2xl bg-white/40 dark:bg-obsidian-850/45 border border-border/60 hover:border-border transition-all duration-300 hover:bg-white/60 dark:hover:bg-obsidian-850/65"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 via-transparent to-transparent dark:from-white/[0.04] opacity-55 mix-blend-overlay"
                    />

                    <div className="relative flex flex-wrap items-center gap-2 justify-between mb-2">
                      <h4 className="font-heading font-semibold text-sm sm:text-[15px] text-foreground leading-tight">
                        {event.title}
                      </h4>
                      <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-[0.15em] border ${statusTone}`}>
                        {event.status}
                      </span>
                    </div>

                    <div className="relative flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-[11px] font-mono">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="text-muted-foreground/60">TS:</span>
                        <span className="text-foreground/90">{event.timestamp}</span>
                      </div>
                      <div className="hidden sm:block text-border/70">•</div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="text-muted-foreground/60">ID:</span>
                        <span className={`text-foreground/85 ${tone.iconText}`}>{event.eventId}</span>
                      </div>
                    </div>

                    {idx < events.length - 1 && (
                      <div className="absolute -left-[1.9rem] sm:-left-[1.95rem] top-1/2 -translate-y-1/2" aria-hidden="true">
                        <motion.div
                          animate={{ y: [0, 3, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.15 }}
                          className="text-muted-foreground/50"
                        >
                          <ArrowDown className="w-3.5 h-3.5 rotate-90 hidden sm:block" strokeWidth={2.4} />
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
