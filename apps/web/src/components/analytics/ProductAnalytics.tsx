'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, TrendingDown, Package, AlertTriangle } from 'lucide-react';
import { GlassCard, CardHeader } from '@/components/dashboard/shared/glass-card';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import { cn } from '@/lib/utils';

const STOCK_STYLES: Record<string, { label: string; cls: string }> = {
  in_stock:     { label: 'In Stock',  cls: 'bg-ai-emerald/10 text-ai-emerald border-ai-emerald/20' },
  low_stock:    { label: 'Low Stock', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  out_of_stock: { label: 'Out',       cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

export function ProductAnalytics() {
  const products = useAnalyticsStore((s) => s.snapshot.topProducts);

  return (
    <GlassCard glow="violet" padded={false}>
      <div className="p-5 sm:p-6">
        <CardHeader title="Top Performing Products" subtitle="By revenue, AI recommendations & conversion" />

        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-left border-collapse mt-3">
            <thead>
              <tr className="text-[10.5px] font-mono uppercase tracking-wider text-muted-foreground border-b border-white/5">
                <th className="pb-3 pr-4 font-medium">#</th>
                <th className="pb-3 pr-4 font-medium">Product</th>
                <th className="pb-3 pr-4 font-medium text-right">Revenue</th>
                <th className="pb-3 pr-4 font-medium text-right hidden md:table-cell">Units</th>
                <th className="pb-3 pr-4 font-medium text-right hidden lg:table-cell">AI Recs</th>
                <th className="pb-3 pr-4 font-medium text-right hidden lg:table-cell">Conv.</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => {
                const stock = STOCK_STYLES[p.stock];
                const TrendIcon = p.trendUp ? TrendingUp : TrendingDown;
                return (
                  <motion.tr
                    key={p.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-3.5 pr-4 text-sm font-mono text-muted-foreground">{p.rank}</td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-obsidian-800/80 flex items-center justify-center shrink-0">
                          <Package className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] text-foreground font-medium truncate max-w-[160px]">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{p.category}</p>
                        </div>
                        {p.aiBoosted && (
                          <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-ai-violet/10 text-ai-violet border border-ai-violet/20 text-[9px] font-bold">
                            <Sparkles className="w-2.5 h-2.5" /> AI
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-right">
                      <span className="text-sm font-mono font-bold text-foreground">
                        ₹{(p.revenue / 100000).toFixed(1)}L
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-right hidden md:table-cell">
                      <span className="text-sm font-mono text-muted-foreground">{p.units.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="py-3.5 pr-4 text-right hidden lg:table-cell">
                      <span className="text-sm font-mono text-muted-foreground">{p.recommendations.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="py-3.5 pr-4 text-right hidden lg:table-cell">
                      <span className={cn('text-sm font-mono font-bold', p.conversionRate >= 70 ? 'text-ai-emerald' : 'text-muted-foreground')}>
                        {p.conversionRate}%
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <span className={cn('px-2 py-0.5 rounded-full border text-[10px] font-mono', stock.cls)}>
                        {stock.label}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </GlassCard>
  );
}
