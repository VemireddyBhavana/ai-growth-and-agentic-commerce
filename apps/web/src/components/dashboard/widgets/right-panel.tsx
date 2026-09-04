'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  ShoppingBag,
  ShoppingCart,
  Lightbulb,
  ArrowUpRight,
  Target,
  Volume2,
  Gift,
  AlertTriangle,
  Zap,
  CheckCircle2,
  XCircle,
  Info,
  Clock,
  Flame,
} from 'lucide-react';
import { GlassCard, CardHeader } from '../shared';
import { cn } from '@/lib/utils';
import { useDashboardSlice } from '@/lib/dashboard/hooks';
import type { Insight, Recommendation, DashboardAlert } from '@/lib/dashboard/types';

const insightIcons: Record<
  Insight['icon'],
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  bag: ShoppingBag,
  target: Target,
  cart: ShoppingCart,
};

const recIcons: Record<
  Recommendation['icon'],
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  volume: Volume2,
  gift: Gift,
  bulb: Lightbulb,
};

function PremiumInsightCard({ insight, idx }: { insight: Insight; idx: number }) {
  const Icon = insightIcons[insight.icon];
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      key={insight.id}
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.22 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl border border-white/10 dark:border-white/10 bg-background/50 dark:bg-obsidian-950/50 p-4 hover:border-brand-500/30 transition-all duration-300 overflow-hidden"
    >
      {/* Premium hover effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-ai-violet/5 to-transparent opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative flex items-start gap-3">
        <motion.div
          className={cn(
            'relative shrink-0 p-2 rounded-xl border bg-gradient-to-br',
            insight.tone,
          )}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 rounded-xl bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <Icon className="w-4 h-4 relative z-10" strokeWidth={2.1} />
        </motion.div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9.5px] font-mono font-bold uppercase bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 text-muted-foreground"
            >
              {insight.tag}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + idx * 0.05 }}
              className={cn(
                'inline-flex items-center gap-1 text-[11px] font-mono font-bold',
                insight.impactTone === 'positive' ? 'text-ai-emerald' : 'text-muted-foreground',
              )}
            >
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
              >
                <TrendingUp className="w-3 h-3" strokeWidth={2.4} />
              </motion.div>
              {insight.impact}
            </motion.span>
          </div>
          <h4 className="text-[13px] font-bold text-foreground leading-snug">
            {insight.title}
          </h4>
          <p className="text-[12px] text-muted-foreground leading-relaxed">{insight.detail}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10 dark:border-white/10 flex items-center justify-between relative">
        <motion.button
          type="button"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand-500 dark:text-brand-400 hover:text-brand-600 transition-colors"
        >
          View details
          <ArrowUpRight className="w-3 h-3" strokeWidth={2.2} />
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] bg-gradient-to-r from-brand-600 to-ai-violet text-white hover:opacity-95 transition-opacity shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30"
        >
          Apply
        </motion.button>
      </div>
    </motion.div>
  );
}

export function AiInsights() {
  const { data: insights = [] } = useDashboardSlice('insights');
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard glow="violet">
        <CardHeader
          title="AI Insights"
          subtitle="Automated patterns surfaced from your store data"
          action={
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-mono font-bold uppercase tracking-[0.14em] bg-ai-violet/12 text-ai-violet border border-ai-violet/25 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3" strokeWidth={2.2} />
              </motion.div>
              Auto · Updated 2m
            </motion.div>
          }
        />
        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <PremiumInsightCard key={insight.id} insight={insight} idx={idx} />
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

function PremiumRecommendationCard({ recommendation, idx }: { recommendation: Recommendation; idx: number }) {
  const Icon = recIcons[recommendation.icon];
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      key={recommendation.id}
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.26 + idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex items-start gap-3 p-3 rounded-2xl border border-transparent hover:border-white/10 hover:bg-background/50 dark:hover:bg-obsidian-950/50 transition-all duration-300 overflow-hidden relative"
    >
      {/* Subtle background glow on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-ai-emerald/5 via-ai-cyan/5 to-transparent opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className={cn(
          'relative shrink-0 p-2 rounded-xl border bg-gradient-to-br',
          recommendation.tone,
        )}
        whileHover={{ scale: 1.1, rotate: -5 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 rounded-xl bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"
        />
        <Icon className="w-4 h-4 relative z-10" strokeWidth={2.1} />
      </motion.div>

      <div className="flex-1 min-w-0 relative">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[12.5px] font-bold text-foreground leading-snug">{recommendation.title}</p>
        </div>
        <p className="text-[11.5px] text-muted-foreground mt-0.5 leading-relaxed">{recommendation.subtitle}</p>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9.5px] font-mono font-bold uppercase bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 text-muted-foreground capitalize"
          >
            {recommendation.kind}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + idx * 0.05 }}
            className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-ai-emerald"
          >
            <Flame className="w-3 h-3" strokeWidth={2} />
            {recommendation.roi}
          </motion.span>
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded-md text-[9.5px] font-mono font-bold uppercase',
              recommendation.effort === 'Low' && 'bg-ai-emerald/10 text-ai-emerald border border-ai-emerald/20',
              recommendation.effort === 'Medium' && 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
              recommendation.effort === 'High' && 'bg-red-500/10 text-red-500 border border-red-500/20',
            )}
          >
            {recommendation.effort} effort
          </span>
        </div>
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="shrink-0 inline-flex h-8 px-3 items-center gap-1 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] bg-gradient-to-r from-brand-600 to-ai-violet text-white hover:opacity-95 transition-opacity shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30"
      >
        Launch
      </motion.button>
    </motion.div>
  );
}

export function SmartRecommendations() {
  const { data: recommendations = [] } = useDashboardSlice('recommendations');
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard>
        <CardHeader
          title="Smart Recommendations"
          subtitle="Suggested campaigns with predicted ROI"
          action={
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-ai-emerald"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-3 h-3" strokeWidth={2.2} />
              </motion.div>
              3 ready
            </motion.div>
          }
        />
        <div className="space-y-3">
          {recommendations.map((recommendation, idx) => (
            <PremiumRecommendationCard key={recommendation.id} recommendation={recommendation} idx={idx} />
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

const alertStyles: Record<DashboardAlert['level'], { icon: typeof AlertTriangle; tone: string; dot: string }> = {
  critical: {
    icon: XCircle,
    tone: 'bg-red-500/12 text-red-500 border-red-500/25',
    dot: 'bg-red-500',
  },
  warning: {
    icon: AlertTriangle,
    tone: 'bg-amber-500/12 text-amber-400 border-amber-500/25',
    dot: 'bg-amber-500',
  },
  info: {
    icon: Info,
    tone: 'bg-brand-500/12 text-brand-500 dark:text-brand-400 border-brand-500/25',
    dot: 'bg-brand-500',
  },
  success: {
    icon: CheckCircle2,
    tone: 'bg-ai-emerald/12 text-ai-emerald border-ai-emerald/25',
    dot: 'bg-ai-emerald',
  },
};

function PremiumAlertCard({ alert, idx }: { alert: DashboardAlert; idx: number }) {
  const s = alertStyles[alert.level];
  const Icon = s.icon;

  return (
    <motion.div
      key={alert.id}
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 + idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex items-start gap-3 p-3 rounded-xl hover:bg-background/50 dark:hover:bg-obsidian-950/50 transition-all duration-300 overflow-hidden"
    >
      {/* Alert level indicator border */}
      <motion.div
        className={cn('absolute left-0 top-0 bottom-0 w-1',
          alert.level === 'critical' && 'bg-red-500',
          alert.level === 'warning' && 'bg-amber-500',
          alert.level === 'info' && 'bg-brand-500',
          alert.level === 'success' && 'bg-ai-emerald'
        )}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.3 + idx * 0.05 }}
      />

      <motion.div
        className={cn('relative shrink-0 p-1.5 rounded-lg border', s.tone)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="w-4 h-4" strokeWidth={2.2} />
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
          >
            <motion.span
              className={cn('inline-block w-1.5 h-1.5 rounded-full', s.dot, alert.level === 'critical' && 'animate-pulse')}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
            />
            <p className="text-[12.5px] font-semibold text-foreground truncate">{alert.title}</p>
          </motion.div>
        </div>
        <p className="text-[11.5px] text-muted-foreground mt-0.5 leading-relaxed">{alert.detail}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Clock className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
        <span className="text-[10.5px] font-mono text-muted-foreground whitespace-nowrap pt-0.5">
          {alert.time}
        </span>
      </div>
    </motion.div>
  );
}

export function AiAlerts() {
  const { data: alerts = [] } = useDashboardSlice('alerts');
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard>
        <CardHeader
          title="AI Alerts"
          subtitle="Priority notifications from your system"
          action={
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border border-border/60 dark:border-white/10 bg-background/60 dark:bg-obsidian-950/60 text-muted-foreground hover:text-foreground hover:border-brand-500/40 transition-all"
            >
              Mark all read
            </motion.button>
          }
        />
        <div className="space-y-2.5">
          {alerts.map((alert, idx) => (
            <PremiumAlertCard key={alert.id} alert={alert} idx={idx} />
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
