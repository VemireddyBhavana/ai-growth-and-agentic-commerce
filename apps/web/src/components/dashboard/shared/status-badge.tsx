'use client';

import * as React from 'react';
import { CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/lib/dashboard/types';

const statusMeta: Record<
  OrderStatus,
  { icon: typeof CheckCircle2; tone: string; label: string }
> = {
  paid: {
    icon: CheckCircle2,
    tone: 'bg-ai-emerald/12 text-ai-emerald border border-ai-emerald/25',
    label: 'Paid',
  },
  pending: {
    icon: Clock,
    tone: 'bg-amber-500/12 text-amber-400 border border-amber-500/25',
    label: 'Pending',
  },
  refunded: {
    icon: RotateCcw,
    tone: 'bg-red-500/12 text-red-500 border border-red-500/25',
    label: 'Refunded',
  },
};

type StatusBadgeProps = {
  status: OrderStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold',
        meta.tone,
        className,
      )}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
      {meta.label}
    </span>
  );
}
