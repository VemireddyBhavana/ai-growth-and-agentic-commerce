'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, TrendingUp } from 'lucide-react';

export interface ConnectorFlowProps {
  className?: string;
}

export function ConnectorFlow({ className = '' }: ConnectorFlowProps) {
  return (
    <div className={`relative hidden lg:flex flex-col items-center justify-center w-20 xl:w-24 py-8 ${className}`} aria-hidden="true">
      <div className="relative flex flex-col items-center gap-6 h-full justify-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="px-2.5 py-1 rounded-full bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-[9px] font-mono font-bold uppercase tracking-[0.16em] whitespace-nowrap">
            Problems
          </span>
          <motion.div
            animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="text-rose-500/70 dark:text-rose-400/70"
          >
            <ArrowDown className="w-5 h-5" strokeWidth={2.5} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/30 via-ai-violet/30 to-ai-cyan/30 blur-xl opacity-60 animate-pulse" />
          <div className="relative flex flex-col items-center gap-1.5 px-3 py-3 rounded-2xl border border-brand-500/40 dark:border-brand-400/40 bg-gradient-to-br from-brand-500/15 via-ai-violet/15 to-ai-cyan/15 backdrop-blur-xl">
            <motion.div
              animate={{ rotate: [0, 8, -6, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="text-brand-600 dark:text-brand-400"
            >
              <Sparkles className="w-5 h-5" strokeWidth={2.2} />
            </motion.div>
            <span className="text-[9px] font-mono font-extrabold uppercase tracking-[0.1em] text-foreground leading-tight text-center whitespace-nowrap">
              AI Sales
            </span>
            <span className="text-[9px] font-mono font-extrabold uppercase tracking-[0.1em] text-foreground leading-tight text-center whitespace-nowrap">
              Assistant
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
            className="text-emerald-500/70 dark:text-emerald-400/70"
          >
            <ArrowDown className="w-5 h-5" strokeWidth={2.5} />
          </motion.div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[9px] font-mono font-bold uppercase tracking-[0.16em] whitespace-nowrap flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Growth
          </span>
        </motion.div>

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none -z-0"
          viewBox="0 0 96 500"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="connectorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(244 63 94)" stopOpacity="0.45" />
              <stop offset="45%" stopColor="rgb(14 165 233)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          <motion.line
            x1="48"
            y1="30"
            x2="48"
            y2="470"
            stroke="url(#connectorGrad)"
            strokeWidth="2"
            strokeDasharray="6 6"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.4, delay: 0.2, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="48"
            cy="30"
            r="3.5"
            fill="rgb(244 63 94)"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.85 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
          />
          <motion.circle
            cx="48"
            cy="470"
            r="3.5"
            fill="rgb(16 185 129)"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.85 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          />
        </svg>
      </div>
    </div>
  );
}
