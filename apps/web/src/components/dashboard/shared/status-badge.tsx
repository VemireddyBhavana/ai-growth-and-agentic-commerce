'use client';

import * as React from 'react';
import { CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/lib/dashboard/types';

const statusMeta: Record<string, { icon: typeof CheckCircle2; tone: string; label: string }> = {
  paid: {
    icon: CheckCircle2,
    tone: 'bg-ai-emerald/12 text-ai-emerald border border-ai-emerald/25',
    label: 'Paid',
  },
  confirmed: {
    icon: CheckCircle2,
    tone: 'bg-ai-emerald/12 text-ai-emerald border border-ai-emerald/25',
    label: 'Confirmed',
  },
  completed: {
    icon: CheckCircle2,
    tone: 'bg-ai-emerald/12 text-ai-emerald border border-ai-emerald/25',
    label: 'Completed',
  },
  delivered: {
    icon: CheckCircle2,
    tone: 'bg-ai-emerald/12 text-ai-emerald border border-ai-emerald/25',
    label: 'Delivered',
  },
  active: {
    icon: CheckCircle2,
    tone: 'bg-ai-emerald/12 text-ai-emerald border border-ai-emerald/25',
    label: 'Active',
  },
  pending: {
    icon: Clock,
    tone: 'bg-amber-500/12 text-amber-400 border border-amber-500/25',
    label: 'Pending',
  },
  processing: {
    icon: Clock,
    tone: 'bg-ai-cyan/12 text-ai-cyan border border-ai-cyan/25',
    label: 'Processing',
  },
  refunded: {
    icon: RotateCcw,
    tone: 'bg-red-500/12 text-red-500 border border-red-500/25',
    label: 'Refunded',
  },
  cancelled: {
    icon: RotateCcw,
    tone: 'bg-red-500/12 text-red-500 border border-red-500/25',
    label: 'Cancelled',
  },
  inactive: {
    icon: Clock,
    tone: 'bg-zinc-500/12 text-zinc-400 border border-zinc-500/25',
    label: 'Inactive',
  },
  vip: {
    icon: CheckCircle2,
    tone: 'bg-purple-500/12 text-purple-400 border border-purple-500/25',
    label: 'VIP',
  },
  regular: {
    icon: CheckCircle2,
    tone: 'bg-blue-500/12 text-blue-400 border border-blue-500/25',
    label: 'Regular',
  },
  new: {
    icon: CheckCircle2,
    tone: 'bg-emerald-500/12 text-emerald-400 border border-emerald-500/25',
    label: 'New',
  },
};

export type StatusBadgeProps = {
  status?: OrderStatus | string;
  variant?: string;
  className?: string;
  children?: React.ReactNode;
};

export function StatusBadge({ status, variant, className, children }: StatusBadgeProps) {
  const norm = (status || variant || '').toLowerCase().trim();
  const meta = statusMeta[norm] || statusMeta.pending;
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold',
        meta.tone,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
      {children ?? meta.label}
    </span>
  );
}
