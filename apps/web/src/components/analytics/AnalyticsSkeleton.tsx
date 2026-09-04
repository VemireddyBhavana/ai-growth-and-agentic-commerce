'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ── Shimmer Base ─────────────────────────────────

function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-gradient-to-r from-obsidian-800/60 via-obsidian-700/40 to-obsidian-800/60 bg-[length:400%_100%] animate-shimmer',
        className,
      )}
      style={style}
    />
  );
}

// ── KPI Skeleton ─────────────────────────────────

export function KpiSkeleton() {
  return (
    <section
      aria-label="Loading KPI cards"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4"
    >
      {Array.from({ length: 8 }).map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.04 }}
          className="rounded-3xl border border-white/5 bg-obsidian-900/50 p-5 space-y-3"
        >
          <div className="flex items-start justify-between">
            <Shimmer className="w-9 h-9 rounded-2xl" />
            <Shimmer className="w-14 h-5 rounded-full" />
          </div>
          <div className="space-y-1.5">
            <Shimmer className="w-16 h-3 rounded-md" />
            <Shimmer className="w-24 h-6 rounded-md" />
          </div>
          <Shimmer className="w-full h-10 rounded-lg" />
        </motion.div>
      ))}
    </section>
  );
}

// ── Chart Skeleton ───────────────────────────────

export function ChartSkeleton({ height = 320 }: { height?: number }) {
  return (
    <div
      aria-label="Loading chart"
      className="rounded-3xl border border-white/5 bg-obsidian-900/50 p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Shimmer className="w-36 h-5 rounded-md" />
          <Shimmer className="w-52 h-3 rounded-md" />
        </div>
        <Shimmer className="w-48 h-9 rounded-xl" />
      </div>
      <Shimmer className="w-full rounded-xl" style={{ height }} />
    </div>
  );
}

// ── Table Skeleton ───────────────────────────────

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      aria-label="Loading table"
      className="rounded-3xl border border-white/5 bg-obsidian-900/50 p-5 sm:p-6"
    >
      <div className="space-y-2 mb-6">
        <Shimmer className="w-48 h-5 rounded-md" />
        <Shimmer className="w-64 h-3 rounded-md" />
      </div>
      {/* Header row */}
      <div className="flex gap-4 mb-4 px-1">
        {[20, 120, 60, 50, 50, 40, 50].map((w, i) => (
          <Shimmer key={i} className="h-3 rounded-sm" style={{ width: w }} />
        ))}
      </div>
      {/* Data rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="flex gap-4 items-center px-1 py-3 border-b border-white/5"
          >
            <Shimmer className="w-5 h-4 rounded-sm" />
            <div className="flex items-center gap-2.5 flex-1">
              <Shimmer className="w-7 h-7 rounded-lg shrink-0" />
              <div className="space-y-1 flex-1">
                <Shimmer className="w-32 h-3.5 rounded-sm" />
                <Shimmer className="w-16 h-2.5 rounded-sm" />
              </div>
            </div>
            <Shimmer className="w-16 h-4 rounded-sm" />
            <Shimmer className="w-12 h-4 rounded-sm hidden md:block" />
            <Shimmer className="w-12 h-4 rounded-sm hidden lg:block" />
            <Shimmer className="w-10 h-4 rounded-sm hidden lg:block" />
            <Shimmer className="w-16 h-5 rounded-full" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Panel Skeleton ───────────────────────────────

function PanelSkeleton({ height = 340 }: { height?: number }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-obsidian-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <Shimmer className="w-9 h-9 rounded-xl" />
        <div className="space-y-1.5">
          <Shimmer className="w-32 h-4 rounded-md" />
          <Shimmer className="w-48 h-3 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-obsidian-800/30 rounded-xl p-3 flex flex-col items-center gap-1.5"
          >
            <Shimmer className="w-2 h-2 rounded-full" />
            <Shimmer className="w-12 h-5 rounded-md" />
            <Shimmer className="w-20 h-2.5 rounded-sm" />
          </div>
        ))}
      </div>
      <Shimmer className="w-full rounded-xl" style={{ height: height - 180 }} />
    </div>
  );
}

// ── Full Page Skeleton ───────────────────────────

export function AnalyticsPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading analytics dashboard" className="space-y-6 sm:space-y-8">
      {/* Header skeleton */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
      >
        <div className="flex items-start gap-4">
          <Shimmer className="w-12 h-12 rounded-2xl shrink-0" />
          <div className="space-y-2">
            <Shimmer className="w-56 h-8 rounded-lg" />
            <Shimmer className="w-72 h-4 rounded-md" />
          </div>
        </div>
        <div className="flex gap-3">
          <Shimmer className="w-52 h-10 rounded-xl" />
          <Shimmer className="w-24 h-10 rounded-xl" />
          <Shimmer className="w-9 h-9 rounded-xl" />
        </div>
      </motion.div>

      <Shimmer className="w-full h-px" />

      {/* KPI skeleton */}
      <KpiSkeleton />

      {/* Revenue chart skeleton */}
      <ChartSkeleton height={320} />

      {/* 3-col panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PanelSkeleton height={450} />
        <PanelSkeleton height={450} />
        <PanelSkeleton height={450} />
      </div>

      {/* Product table + panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TableSkeleton rows={5} />
        </div>
        <PanelSkeleton height={380} />
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PanelSkeleton height={420} />
        <PanelSkeleton height={420} />
      </div>
    </div>
  );
}
