'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Bot, MessageSquare, ThumbsUp, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { GlassCard, CardHeader } from '../shared';
import { AnimatedCounter } from '../shared/animated-counter';
import { cn } from '@/lib/utils';
import { useDashboardSlice } from '@/lib/dashboard/hooks';
import type { ConversationStat } from '@/lib/dashboard/types';

const statIcons: Record<
  ConversationStat['icon'],
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  sessions: MessageSquare,
  shown: Sparkles,
  accepted: ThumbsUp,
  assisted: ShoppingBag,
};

export function AiConversationAnalytics() {
  const { data: conversationData = [] } = useDashboardSlice('conversations');
  const { data: aiStatPills = [] } = useDashboardSlice('conversationStats');
  const gradientId = React.useId().replace(/:/g, '');
  const gradientId2 = React.useId().replace(/:/g, '');
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard glow="violet">
        <CardHeader
          title="AI Conversation Analytics"
          subtitle="Real-time performance of your AI sales concierge"
          action={
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-ai-violet/12 border border-ai-violet/25">
              <span className="inline-flex h-2 w-2 rounded-full bg-ai-violet animate-pulse shadow-[0_0_0_4px_rgba(139,92,246,0.15)]" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-ai-violet">
                Live · 128 talking
              </span>
            </div>
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          {aiStatPills.map((s, i) => {
            const Icon = statIcons[s.icon];
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-2xl border border-white/10 dark:border-white/10 bg-background/50 dark:bg-obsidian-950/50 p-3 hover:border-brand-500/30 transition-colors"
              >
                <div className={cn('inline-flex p-1.5 rounded-lg border mb-2', s.tone)}>
                  <Icon className="w-3.5 h-3.5" strokeWidth={2.1} />
                </div>
                <p className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
                  {s.label}
                </p>
                <p className="font-heading font-extrabold text-lg tracking-tight text-foreground mt-0.5">
                  <AnimatedCounter value={s.value} />
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="h-[220px] -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={conversationData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id={gradientId2} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 5" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="hr"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 10, fontFamily: 'monospace' }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(148,163,184,0.6)', fontSize: 10, fontFamily: 'monospace' }}
                width={32}
              />
              <Tooltip
                cursor={{ stroke: 'rgba(139,92,246,0.25)', strokeWidth: 1, strokeDasharray: '3 3' }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-xl border border-white/10 bg-obsidian-900/95 backdrop-blur-xl px-3.5 py-2.5 shadow-2xl">
                      <p className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
                        {label}:00
                      </p>
                      {payload.map((p) => (
                        <div key={String(p.dataKey)} className="flex items-center justify-between gap-5">
                          <span className="text-[11.5px] text-muted-foreground capitalize">{p.dataKey === 'sessions' ? 'Sessions' : 'Conversions'}</span>
                          <span className="text-[11.5px] font-semibold text-foreground tabular-nums">{Number(p.value)}</span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#8B5CF6"
                strokeWidth={2.4}
                fill={`url(#${gradientId})`}
                isAnimationActive
                animationDuration={1200}
              />
              <Area
                type="monotone"
                dataKey="conversions"
                stroke="#06B6D4"
                strokeWidth={2}
                fill={`url(#${gradientId2})`}
                isAnimationActive
                animationDuration={1400}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-ai-violet" />
              <span className="text-[12px] text-muted-foreground">Sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-ai-cyan" />
              <span className="text-[12px] text-muted-foreground">Conversions</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <Bot className="w-3.5 h-3.5 text-ai-violet" strokeWidth={2.1} />
            <span className="text-muted-foreground">Avg Response</span>
            <span className="font-bold text-foreground tabular-nums">2.4s</span>
            <ArrowRight className="w-3.5 h-3.5 text-ai-emerald" strokeWidth={2.1} />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
