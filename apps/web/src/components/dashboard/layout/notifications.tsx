'use client';

import * as React from 'react';
import { Bell, AlertTriangle, XCircle, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDashboardSlice } from '@/lib/dashboard/hooks';
import type { DashboardAlert } from '@/lib/dashboard/types';

const levelStyles: Record<
  DashboardAlert['level'],
  { icon: typeof AlertTriangle; tone: string; dot: string }
> = {
  critical: { icon: XCircle, tone: 'bg-red-500/12 text-red-500 border-red-500/25', dot: 'bg-red-500' },
  warning: { icon: AlertTriangle, tone: 'bg-amber-500/12 text-amber-400 border-amber-500/25', dot: 'bg-amber-500' },
  info: { icon: Info, tone: 'bg-brand-500/12 text-brand-500 dark:text-brand-400 border-brand-500/25', dot: 'bg-brand-500' },
  success: { icon: CheckCircle2, tone: 'bg-ai-emerald/12 text-ai-emerald border-ai-emerald/25', dot: 'bg-ai-emerald' },
};

export function NotificationBell() {
  const { data: notifications = [] } = useDashboardSlice('notifications');
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => n.unread).length;

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 dark:border-white/10 bg-background/60 dark:bg-obsidian-900/60 text-muted-foreground hover:text-foreground hover:border-brand-500/40 transition-colors"
      >
        <Bell className="w-[18px] h-[18px]" strokeWidth={2} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background dark:ring-obsidian-950 animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border/70 dark:border-white/10 bg-card/95 dark:bg-obsidian-900/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 dark:border-white/10">
              <div>
                <p className="text-[13px] font-semibold text-foreground">Notifications</p>
                <p className="text-[11px] text-muted-foreground">{unread} unread</p>
              </div>
              <button
                type="button"
                className="text-[11px] font-semibold text-brand-500 dark:text-brand-400 hover:underline"
              >
                Mark all read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-1.5">
              {notifications.map((item) => {
                const style = levelStyles[item.level];
                const Icon = style.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="w-full text-left flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className={cn('relative shrink-0 p-1.5 rounded-lg border', style.tone)}>
                      <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {item.unread && (
                          <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', style.dot)} />
                        )}
                        <p className="text-[12.5px] font-semibold text-foreground truncate">{item.title}</p>
                      </div>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5 leading-relaxed">{item.detail}</p>
                      <p className="text-[10.5px] font-mono text-muted-foreground mt-1">{item.time}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
