'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface ScrollIndicatorProps {
  targetId?: string;
  label?: string;
  className?: string;
}

export function ScrollIndicator({
  targetId = 'features',
  label = 'Explore Platform',
  className = '',
}: ScrollIndicatorProps) {
  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
      return;
    }
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.button
      type="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
      aria-label={`Scroll to ${label}`}
      className={`group relative inline-flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 rounded-xl p-2 transition-colors ${className}`}
    >
      <span className="text-[11px] font-mono uppercase tracking-[0.18em]">{label}</span>
      <span className="relative flex h-7 w-[18px] justify-center rounded-full border border-border/80 overflow-hidden">
        <motion.span
          aria-hidden="true"
          animate={{ y: [-12, 12, -12] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 inline-block h-1.5 w-1 rounded-full bg-gradient-to-b from-brand-500 via-ai-violet to-ai-cyan mt-1.5"
        />
      </span>
      <ChevronDown
        className="w-4 h-4 opacity-70 group-hover:translate-y-0.5 transition-transform animate-bounce"
        aria-hidden="true"
      />
    </motion.button>
  );
}
