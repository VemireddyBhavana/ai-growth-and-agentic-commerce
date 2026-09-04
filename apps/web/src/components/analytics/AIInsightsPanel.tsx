'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CreditCard, Users, ArrowUpRight, ArrowDownRight, ChevronRight, Check, Sparkles } from 'lucide-react';
import { GlassCard, CardHeader } from '@/components/dashboard/shared/glass-card';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  bundle: Package,
  time: Clock,
  payment: CreditCard,
  segment: Users,
};

export function AIInsightsPanel() {
  const insights = useAnalyticsStore((s) => s.snapshot.aiInsights);
  const [implemented, setImplemented] = React.useState<Set<string>>(new Set());

  const handleImplement = (id: string) => {
    setImplemented((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <GlassCard glow="brand" padded={false}>
      <div className="p-5 sm:p-6">
        <CardHeader title="AI Intelligent Insights" subtitle="Actionable recommendations based on real-time data" />

        <div className="space-y-4 mt-2">
          {insights.map((insight, idx) => {
            const Icon = ICON_MAP[insight.icon] || Sparkles;
            const ImpactIcon = insight.impactPositive ? ArrowUpRight : ArrowDownRight;
            const isImplemented = implemented.has(insight.id);

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  'relative rounded-xl border p-4 transition-all duration-300',
                  isImplemented
                    ? 'bg-ai-emerald/5 border-ai-emerald/20 opacity-70'
                    : 'bg-obsidian-800/40 border-white/5 hover:border-brand-500/30 hover:bg-obsidian-800/60'
                )}
              >
                <div className="flex gap-4">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1',
                    isImplemented ? 'bg-ai-emerald/20' : 'bg-brand-500/20'
                  )}>
                    {isImplemented ? (
                      <Check className="w-5 h-5 text-ai-emerald" />
                    ) : (
                      <Icon className="w-5 h-5 text-brand-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-semibold text-foreground">{insight.title}</h4>
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 self-start',
                        insight.impactPositive ? 'bg-ai-emerald/10 text-ai-emerald' : 'bg-amber-500/10 text-amber-500'
                      )}>
                        <ImpactIcon className="w-3 h-3" />
                        {insight.impact}
                      </span>
                    </div>
                    <p className="text-[13px] text-muted-foreground mb-3">{insight.detail}</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-black/20 rounded-lg border border-white/5">
                      <p className="text-[12px] text-foreground/90 font-medium">
                        <span className="text-brand-400 font-bold mr-1">Rec:</span>
                        {insight.recommendation}
                      </p>
                      <button
                        onClick={() => handleImplement(insight.id)}
                        disabled={isImplemented}
                        className={cn(
                          'flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all shrink-0',
                          isImplemented
                            ? 'bg-ai-emerald/20 text-ai-emerald cursor-not-allowed'
                            : 'bg-brand-600 hover:bg-brand-500 text-white'
                        )}
                      >
                        {isImplemented ? 'Implemented' : 'Apply Now'}
                        {!isImplemented && <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
