'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, ArrowUpRight } from 'lucide-react';
import { GlassCard, CardHeader } from '../shared';
import { useDashboardSlice } from '@/lib/dashboard/hooks';
import { cn } from '@/lib/utils';

export function SuggestedCampaigns() {
  const { data: campaigns = [] } = useDashboardSlice('campaigns');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard>
        <CardHeader
          title="Suggested Campaigns"
          subtitle="Ready-to-launch plays from the AI growth engine"
          action={
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.14em] bg-brand-500/12 text-brand-400 border border-brand-500/25">
              <Megaphone className="w-3 h-3" strokeWidth={2.2} />
              {campaigns.filter((c) => c.status === 'ready').length} ready
            </span>
          }
        />
        <div className="space-y-2.5">
          {campaigns.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.26 + idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/10 bg-background/50 dark:bg-obsidian-950/50 p-3.5 hover:border-brand-500/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13px] font-bold text-foreground">{c.name}</p>
                    <span
                      className={cn(
                        'inline-flex px-1.5 py-0.5 rounded-md text-[9.5px] font-mono font-bold uppercase border',
                        c.status === 'ready'
                          ? 'bg-ai-emerald/12 text-ai-emerald border-ai-emerald/25'
                          : 'bg-white/5 text-muted-foreground border-white/10',
                      )}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-muted-foreground mt-1">{c.audience}</p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{c.channel}</p>
                </div>
                <span className="shrink-0 text-[11px] font-mono font-bold text-ai-emerald">{c.predictedLift}</span>
              </div>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand-500 dark:text-brand-400"
              >
                Launch campaign
                <ArrowUpRight className="w-3 h-3" strokeWidth={2.2} />
              </button>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
