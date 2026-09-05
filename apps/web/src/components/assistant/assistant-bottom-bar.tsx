'use client';

import React from 'react';
import { Lock, Check, Shield, FileText } from 'lucide-react';

export const AssistantBottomBar: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 px-4 py-2 flex items-center justify-center gap-6 sm:gap-10 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 select-none shrink-0 shadow-2xs">
      <div className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
        <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span className="font-semibold">Bounded</span>
      </div>

      <div className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
        <span className="font-semibold">Explainable</span>
      </div>

      <div className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
        <Shield className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
        <span className="font-semibold">Gated</span>
      </div>

      <div className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
        <FileText className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
        <span className="font-semibold">Audit Trail</span>
      </div>
    </footer>
  );
};
