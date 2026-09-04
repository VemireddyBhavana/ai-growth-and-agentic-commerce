'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  ArrowRight,
  ShoppingBag,
  Search,
  Eye,
  MapPin,
  Smartphone,
  Monitor,
  Bot,
} from 'lucide-react';
import { GlassCard, CardHeader } from '../shared';
import { cn } from '@/lib/utils';
import { useDashboardSlice } from '@/lib/dashboard/hooks';
import type { LiveVisitor } from '@/lib/dashboard/types';

const activityIcons: Record<
  LiveVisitor['activityKind'],
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  view: Eye,
  ai: Bot,
  cart: ShoppingBag,
  search: Search,
  checkout: ArrowRight,
};

export function LiveVisitors() {
  const { data: visitors = [] } = useDashboardSlice('visitors');
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard glow="cyan">
        <CardHeader
          title="Live Visitors"
          subtitle="Real-time traffic and AI concierge interactions"
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute inset-0 rounded-full bg-ai-emerald/30 animate-ping" />
                <span className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-[0.14em] bg-ai-emerald/12 text-ai-emerald border border-ai-emerald/25">
                  <Globe className="w-3 h-3" strokeWidth={2.2} />
                  1,284 online
                </span>
              </div>
            </div>
          }
        />
        <div className="space-y-2 -mx-1">
          <AnimatePresence mode="popLayout">
            {visitors.map((v, i) => {
              const Device = v.device === 'mobile' ? Smartphone : Monitor;
              const ActIcon = activityIcons[v.activityKind];
              return (
                <motion.div
                  key={v.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-white/10 hover:bg-background/50 dark:hover:bg-obsidian-950/50 transition-all duration-200"
                >
                  <div className="relative shrink-0">
                    <div
                      className={cn(
                        'relative w-10 h-10 rounded-xl border bg-gradient-to-br flex items-center justify-center text-lg',
                        v.tone,
                      )}
                    >
                      <span>{v.flag}</span>
                    </div>
                    {v.aiActive && (
                      <div className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-gradient-to-br from-ai-violet to-brand-500 border-2 border-card dark:border-obsidian-900 flex items-center justify-center">
                        <Bot className="w-2.5 h-2.5 text-white" strokeWidth={2.6} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-foreground">
                        <MapPin className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
                        {v.location}
                        <span className="text-[10.5px] font-mono text-muted-foreground">{v.country}</span>
                      </span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-md border border-white/10 text-[9.5px] font-mono uppercase text-muted-foreground">
                        {v.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground truncate max-w-[180px]">
                        <ActIcon className="w-3 h-3 shrink-0" strokeWidth={2} />
                        <span className="truncate">{v.activity} · {v.page}</span>
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                      <Device className="w-3 h-3" strokeWidth={2} />
                      {v.duration}
                    </div>
                    {v.aiActive && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9.5px] font-mono font-bold uppercase bg-ai-violet/12 text-ai-violet border border-ai-violet/20">
                        AI
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </GlassCard>
    </motion.div>
  );
}
