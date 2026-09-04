'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  RefreshCw,
  Download,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import type { DateRange } from '@/types/analytics';
import { cn } from '@/lib/utils';

// ── Date Range Picker ────────────────────────────

const RANGES: { label: string; value: DateRange; description: string }[] = [
  { label: '7D', value: '7d', description: 'Last 7 days' },
  { label: '30D', value: '30d', description: 'Last 30 days' },
  { label: '90D', value: '90d', description: 'Last 90 days' },
  { label: '1Y', value: '1y', description: 'Last year' },
];

// ── Export Options ───────────────────────────────

type ExportOption = {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: string;
};

const EXPORT_OPTIONS: ExportOption[] = [
  { label: 'Export CSV', description: 'Spreadsheet format', icon: FileSpreadsheet, action: 'csv' },
  { label: 'Export PDF', description: 'Print-ready report', icon: FileText, action: 'pdf' },
  { label: 'Download Report', description: 'Full analytics package', icon: Download, action: 'report' },
];

export function AnalyticsHeader() {
  const { dateRange, setDateRange } = useAnalyticsStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);
  const exportRef = React.useRef<HTMLDivElement>(null);

  // Close export dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Re-generate data for current range
    setDateRange(dateRange);
    setTimeout(() => setRefreshing(false), 1200);
  }, [dateRange, setDateRange]);

  const handleExport = React.useCallback((action: string) => {
    setExportOpen(false);
    // In production, this would trigger actual export logic
    const messages: Record<string, string> = {
      csv: 'CSV export started…',
      pdf: 'Generating PDF report…',
      report: 'Preparing full analytics report…',
    };
    // Show a brief visual feedback
    console.info(`[Analytics Export] ${messages[action] ?? action}`);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Ambient glow behind header */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/4 w-[600px] h-[200px] rounded-full bg-brand-500/8 blur-[120px] opacity-60"
      />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        {/* ── Title Block ── */}
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative shrink-0"
          >
            <div className="absolute inset-0 rounded-2xl bg-brand-500/30 blur-xl opacity-60" />
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600/25 to-ai-violet/20 border border-brand-500/30 flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-brand-400" strokeWidth={2} />
            </div>
          </motion.div>

          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground">
              Business Analytics
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Monitor your AI-powered commerce performance in real time.
            </p>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Picker */}
          <div className="flex items-center gap-1.5 bg-obsidian-800/60 p-1 rounded-xl border border-white/5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground ml-2 shrink-0" />
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setDateRange(r.value)}
                title={r.description}
                aria-label={`Show ${r.description}`}
                aria-pressed={dateRange === r.value}
                className={cn(
                  'px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all duration-200',
                  dateRange === r.value
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Export Dropdown */}
          <div ref={exportRef} className="relative">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setExportOpen((v) => !v)}
              aria-expanded={exportOpen}
              aria-haspopup="listbox"
              aria-label="Export report"
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200',
                'bg-obsidian-800/60 border border-white/5 text-muted-foreground hover:text-foreground hover:border-brand-500/30',
                exportOpen && 'border-brand-500/40 text-foreground bg-obsidian-800/80',
              )}
            >
              <Download className="w-3.5 h-3.5" />
              Export
              <ChevronDown
                className={cn(
                  'w-3 h-3 transition-transform duration-200',
                  exportOpen && 'rotate-180',
                )}
              />
            </motion.button>

            {/* Dropdown */}
            {exportOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                role="listbox"
                aria-label="Export options"
                className="absolute right-0 top-full mt-2 z-50 w-60 rounded-xl glass-panel border border-white/10 shadow-2xl overflow-hidden"
              >
                {EXPORT_OPTIONS.map((opt, idx) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.action}
                      role="option"
                      aria-selected={false}
                      onClick={() => handleExport(opt.action)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5',
                        idx < EXPORT_OPTIONS.length - 1 && 'border-b border-white/5',
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-brand-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{opt.label}</p>
                        <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh analytics data"
            className={cn(
              'inline-flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200',
              'bg-obsidian-800/60 border border-white/5 text-muted-foreground hover:text-foreground hover:border-brand-500/30',
              refreshing && 'pointer-events-none',
            )}
          >
            <RefreshCw
              className={cn('w-4 h-4', refreshing && 'animate-spin')}
            />
          </motion.button>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </motion.header>
  );
}
