'use client';

import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Check } from 'lucide-react';
import { toast } from 'sonner';

interface AuditItem {
  id: string;
  time: string;
  text: string;
  subtext?: string;
  isSuccess?: boolean;
}

const DEFAULT_AUDIT_EVENTS: AuditItem[] = [
  { id: '1', time: '10:30 AM', text: 'User asked for gaming laptop under ₹70,000' },
  { id: '2', time: '10:30 AM', text: 'AI searched in product catalog' },
  { id: '3', time: '10:30 AM', text: 'AI recommended 3 laptops' },
  { id: '4', time: '10:31 AM', text: 'User selected HP Victus' },
  { id: '5', time: '10:31 AM', text: 'AI suggested Logitech G102 Mouse' },
  { id: '6', time: '10:31 AM', text: 'User added mouse to cart' },
  { id: '7', time: '10:32 AM', text: 'Cart total calculated ₹71,298' },
  { id: '8', time: '10:32 AM', text: 'Razorpay Order Created', subtext: 'Order ID: order_KjU98X...' },
  { id: '9', time: '10:32 AM', text: 'Payment Initiated' },
  { id: '10', time: '10:33 AM', text: 'Payment Successful', subtext: 'Payment ID: pay_KjU9Zm...', isSuccess: true },
];

export const AuditTrailColumn: React.FC = () => {
  const [events, setEvents] = useState<AuditItem[]>(DEFAULT_AUDIT_EVENTS);

  const handleClear = () => {
    setEvents([]);
    toast.info('Audit trail cleared');
  };

  const handleReset = () => {
    setEvents(DEFAULT_AUDIT_EVENTS);
    toast.success('Audit trail refreshed');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800/80 p-4 select-none overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 pb-3">
          <h3 className="font-heading font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Audit Trail</span>
          </h3>
          {events.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
            >
              Clear
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* Timeline List */}
        <div className="relative pl-5 space-y-3.5 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-emerald-500/30">
          {events.map((item) => (
            <div key={item.id} className="relative group">
              {/* Dot */}
              <div
                className={`absolute -left-5 top-1 w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                  item.isSuccess
                    ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/50 ring-2 ring-emerald-100 dark:ring-emerald-950'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>

              {/* Timestamp */}
              <span className="text-[10px] font-mono font-medium text-zinc-500 dark:text-zinc-400 block">
                {item.time}
              </span>

              {/* Event Text */}
              <p
                className={`text-xs leading-snug font-medium ${
                  item.isSuccess
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-zinc-800 dark:text-zinc-200'
                }`}
              >
                {item.text}
              </p>

              {item.subtext && (
                <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                  {item.subtext}
                </p>
              )}
            </div>
          ))}

          {events.length === 0 && (
            <p className="text-xs text-zinc-400 py-4 italic">No audit events recorded.</p>
          )}
        </div>
      </div>

      {/* Payment Summary Box */}
      <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 shadow-2xs space-y-2">
          <h4 className="font-heading font-semibold text-xs text-zinc-900 dark:text-zinc-100">
            Payment Summary
          </h4>

          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">Amount</span>
            <span className="font-heading font-bold text-zinc-900 dark:text-white">₹71,298</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">Status</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
              Paid
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">Method</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">UPI (Test Mode)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
