'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  Sparkles,
} from 'lucide-react';
import { GlassCard, CardHeader } from '../shared';
import { cn } from '@/lib/utils';
import { useDashboardSlice } from '@/lib/dashboard/hooks';

export function TopProducts() {
  const { data: topProducts = [] } = useDashboardSlice('topProducts');
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard>
        <CardHeader
          title="Top Products"
          subtitle="Best performing SKUs with AI conversion lift"
        />
        <div className="space-y-3 -mx-1">
          {topProducts.map((p, idx) => {
            const Trend = p.trendUp ? TrendingUp : TrendingDown;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.36 + idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-white/10 hover:bg-background/50 dark:hover:bg-obsidian-950/50 transition-all duration-200"
              >
                <div
                  className={cn(
                    'relative shrink-0 w-11 h-11 rounded-xl border bg-gradient-to-br flex items-center justify-center overflow-hidden',
                    p.tone,
                  )}
                >
                  <Package className="w-5 h-5" strokeWidth={2.1} />
                  {p.aiBoosted && (
                    <div className="absolute -right-1 -top-1">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-ai-violet to-brand-500 border-2 border-card dark:border-obsidian-900 flex items-center justify-center">
                        <Sparkles className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13px] font-semibold text-foreground truncate">{p.name}</p>
                    {p.aiBoosted && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9.5px] font-mono font-bold uppercase bg-ai-violet/15 text-ai-violet border border-ai-violet/25">
                        AI
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                      {p.sku}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Eye className="w-3 h-3" strokeWidth={2} />
                      {p.views.toLocaleString('en-IN')}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      {p.conversion.toFixed(2)}% conv
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13.5px] font-extrabold text-foreground tabular-nums">
                    ₹ {(p.revenue / 1000).toFixed(1)}K
                  </p>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <span className="text-[11px] text-muted-foreground">{p.units}u</span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-0.5 text-[10.5px] font-mono font-bold',
                        p.trendUp ? 'text-ai-emerald' : 'text-red-500',
                      )}
                    >
                      <Trend className="w-3 h-3" strokeWidth={2.4} />
                      {p.trend}%
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </motion.div>
  );
}
