'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowUpRight,
} from 'lucide-react';
import { GlassCard } from '../shared';
import { useSupabase } from '@/lib/auth/supabase/client';
import { cn } from '@/lib/utils';

export function DashboardWelcome() {
  const router = useRouter();
  const { session } = useSupabase();
  const user = session?.user;
  const firstName = React.useMemo(() => {
    const n = (user?.user_metadata?.name as string) || 'Merchant';
    return n.split(' ')[0];
  }, [user]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-4"
    >
      <div className="lg:col-span-2">
        <GlassCard padded={false} className="relative">
          <div className="absolute -top-24 -right-16 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-brand-500/20 via-ai-violet/15 to-transparent blur-3xl pointer-events-none" />
          <div className="relative p-6 sm:p-7 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <div className="space-y-3 max-w-xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10.5px] font-mono font-bold uppercase tracking-[0.18em] bg-ai-violet/12 text-ai-violet border border-ai-violet/30 shadow-sm">
                <Zap className="w-3 h-3" strokeWidth={2.4} />
                Live · AI Concierge Enabled
              </span>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl leading-[1.1] tracking-tight text-balance">
                Welcome back, {firstName}
                <span className="bg-gradient-to-r from-brand-500 via-ai-violet to-ai-cyan bg-clip-text text-transparent">.</span>
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                Your AI sales assistant closed{' '}
                <span className="font-semibold text-foreground">128 deals</span> worth{' '}
                <span className="font-semibold text-ai-emerald">₹3.84L</span> in the last 24 hours.
                Bundle attachment is trending{' '}
                <span className="font-semibold text-brand-500 dark:text-brand-400">+24.8%</span> week-over-week.
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => router.push('/assistant')}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-600 via-brand-500 to-ai-violet text-white shadow-lg shadow-brand-500/20 hover:opacity-95 transition-opacity cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" strokeWidth={2.1} />
                  Open AI Concierge
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/analytics')}
                  className={cn(
                    'inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-sm font-semibold cursor-pointer active:scale-95',
                    'border border-border/70 dark:border-white/10 bg-background/50 dark:bg-obsidian-900/50',
                    'hover:border-brand-500/40 text-foreground transition-colors',
                  )}
                >
                  <TrendingUp className="w-4 h-4" strokeWidth={2} />
                  View Full Report
                  <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
            <div className="relative shrink-0 self-start">
              <div className="absolute inset-0 rounded-3xl bg-ai-emerald/30 blur-xl opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-ai-emerald via-emerald-500 to-emerald-600 border border-ai-emerald/40 flex items-center justify-center shadow-inner shadow-ai-emerald/20">
                <TrendingUp className="w-9 h-9 sm:w-11 sm:h-11 text-white" strokeWidth={2.4} />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard padded={false} className="relative">
        <div className="absolute -bottom-20 -left-10 w-[240px] h-[240px] rounded-full bg-ai-cyan/15 blur-3xl pointer-events-none" />
        <div className="relative p-6 flex flex-col gap-4 h-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-muted-foreground">
                AI Health Score
              </p>
              <h3 className="font-heading font-extrabold text-2xl mt-0.5">
                94.2<span className="text-muted-foreground text-lg"> / 100</span>
              </h3>
            </div>
            <div className="relative p-2 rounded-xl bg-ai-cyan/15 text-ai-cyan border border-ai-cyan/30">
              <Zap className="w-5 h-5" strokeWidth={2.2} />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            {[
              { label: 'Explainability', value: 98, color: '#6366F1' },
              { label: 'Conversion rate', value: 89, color: '#8B5CF6' },
              { label: 'Checkout SLA', value: 96, color: '#06B6D4' },
            ].map((m, i) => (
              <div key={m.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-mono font-semibold text-foreground">{m.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-border/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${m.color} 0%, ${m.color}cc 100%)`,
                      boxShadow: `0 0 0 1px ${m.color}22`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ai-emerald pt-1">
            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.2} />
            SOC 2 Type II · 99.99% uptime SLA
          </div>
        </div>
      </GlassCard>
    </motion.section>
  );
}
