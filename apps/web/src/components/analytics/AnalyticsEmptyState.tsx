'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  WifiOff,
  RefreshCw,
  Rocket,
  ServerCrash,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Empty State ──────────────────────────────────

type AnalyticsEmptyStateProps = {
  className?: string;
  onStartSelling?: () => void;
};

export function AnalyticsEmptyState({
  className,
  onStartSelling,
}: AnalyticsEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'flex flex-col items-center justify-center text-center py-24 px-6',
        className,
      )}
    >
      {/* Illustration */}
      <div className="relative mb-8">
        {/* Ambient glow */}
        <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-brand-500/15 blur-3xl" />

        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 1, -1, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-brand-600/15 to-ai-violet/15 border border-brand-500/20 flex items-center justify-center shadow-2xl">
            <BarChart3 className="w-12 h-12 text-brand-400/60" strokeWidth={1.5} />
          </div>
          {/* Floating dots */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-ai-violet/40"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-ai-cyan/40"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="absolute top-1/2 -right-5 w-2.5 h-2.5 rounded-full bg-ai-emerald/40"
          />
        </motion.div>
      </div>

      <h3 className="font-heading font-bold text-xl text-foreground mb-2">
        No analytics available yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">
        Start selling products through the AI Shopping Assistant to see revenue trends,
        customer insights, and AI performance metrics here.
      </p>

      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStartSelling}
        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-ai-violet text-white font-semibold text-sm shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 transition-shadow"
      >
        <Rocket className="w-4 h-4" />
        Start Selling
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}

// ── Error State ──────────────────────────────────

type AnalyticsErrorStateProps = {
  error?: string;
  onRetry?: () => void;
  variant?: 'network' | 'generic';
  className?: string;
};

export function AnalyticsErrorState({
  error,
  onRetry,
  variant = 'generic',
  className,
}: AnalyticsErrorStateProps) {
  const isNetwork = variant === 'network';
  const Icon = isNetwork ? WifiOff : ServerCrash;
  const title = isNetwork ? 'Network Error' : 'Something went wrong';
  const description =
    error ??
    (isNetwork
      ? 'Unable to connect to the analytics server. Please check your internet connection and try again.'
      : 'An unexpected error occurred while loading your analytics data. Please try again.');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'flex flex-col items-center justify-center text-center py-24 px-6',
        className,
      )}
    >
      {/* Error icon */}
      <motion.div
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 w-24 h-24 rounded-full bg-red-500/10 blur-2xl" />
        <div className="relative w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <Icon className="w-9 h-9 text-red-400" strokeWidth={1.5} />
        </div>
      </motion.div>

      <h3 className="font-heading font-bold text-xl text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">
        {description}
      </p>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-obsidian-800/60 border border-white/10 text-foreground font-semibold text-sm hover:border-brand-500/30 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </motion.button>
      )}
    </motion.div>
  );
}
