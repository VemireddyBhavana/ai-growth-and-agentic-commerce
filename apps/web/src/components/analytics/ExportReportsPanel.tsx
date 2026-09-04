'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileArchive,
  Check,
  Loader2,
  X,
} from 'lucide-react';
import { GlassCard, CardHeader } from '@/components/dashboard/shared/glass-card';
import { cn } from '@/lib/utils';

// ── Types ────────────────────────────────────────

type ExportFormat = 'csv' | 'pdf' | 'report';

type ExportStatus = 'idle' | 'exporting' | 'done' | 'error';

type ExportItem = {
  format: ExportFormat;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  bg: string;
};

const EXPORTS: ExportItem[] = [
  {
    format: 'csv',
    label: 'Export CSV',
    description: 'Spreadsheet-ready data export with all metrics and time series',
    icon: FileSpreadsheet,
    color: '#10B981',
    bg: 'from-ai-emerald/15 to-ai-emerald/5',
  },
  {
    format: 'pdf',
    label: 'Export PDF',
    description: 'Formatted print-ready report with charts and insights',
    icon: FileText,
    color: '#6366F1',
    bg: 'from-brand-500/15 to-brand-500/5',
  },
  {
    format: 'report',
    label: 'Download Full Report',
    description: 'Complete analytics package with raw data, visuals, and AI insights',
    icon: FileArchive,
    color: '#8B5CF6',
    bg: 'from-ai-violet/15 to-ai-violet/5',
  },
];

// ── Export Reports Panel ─────────────────────────

export function ExportReportsPanel() {
  const [statuses, setStatuses] = React.useState<Record<ExportFormat, ExportStatus>>({
    csv: 'idle',
    pdf: 'idle',
    report: 'idle',
  });

  const handleExport = React.useCallback((format: ExportFormat) => {
    setStatuses((prev) => ({ ...prev, [format]: 'exporting' }));

    // Simulate export process
    setTimeout(() => {
      setStatuses((prev) => ({ ...prev, [format]: 'done' }));
      // Reset after showing success
      setTimeout(() => {
        setStatuses((prev) => ({ ...prev, [format]: 'idle' }));
      }, 2500);
    }, 1800);
  }, []);

  return (
    <GlassCard glow="brand" padded={false}>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-brand-500/15 flex items-center justify-center">
            <Download className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-foreground">
              Export Reports
            </h3>
            <p className="text-[12px] text-muted-foreground">
              Download analytics data in various formats
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {EXPORTS.map((exp, idx) => {
            const Icon = exp.icon;
            const status = statuses[exp.format];

            return (
              <motion.div
                key={exp.format}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={cn(
                  'relative rounded-xl border p-4 transition-all duration-300 overflow-hidden',
                  'bg-obsidian-800/30 border-white/5 hover:border-white/10',
                  status === 'done' && 'border-ai-emerald/30 bg-ai-emerald/5',
                )}
              >
                {/* Progress shimmer during export */}
                <AnimatePresence>
                  {status === 'exporting' && (
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                <div className="relative flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0',
                      exp.bg,
                    )}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: exp.color }}
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {exp.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                      {exp.description}
                    </p>
                  </div>

                  {/* Action */}
                  <motion.button
                    whileHover={status === 'idle' ? { scale: 1.05 } : {}}
                    whileTap={status === 'idle' ? { scale: 0.95 } : {}}
                    onClick={() => {
                      if (status === 'idle') handleExport(exp.format);
                    }}
                    disabled={status !== 'idle'}
                    aria-label={`${exp.label}`}
                    className={cn(
                      'shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all',
                      status === 'idle' &&
                        'bg-white/5 border border-white/10 text-foreground hover:border-brand-500/30 hover:bg-brand-500/10',
                      status === 'exporting' &&
                        'bg-white/5 border border-white/10 text-muted-foreground cursor-wait',
                      status === 'done' &&
                        'bg-ai-emerald/15 border border-ai-emerald/30 text-ai-emerald cursor-default',
                      status === 'error' &&
                        'bg-red-500/15 border border-red-500/30 text-red-400 cursor-default',
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {status === 'idle' && (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Export
                        </motion.span>
                      )}
                      {status === 'exporting' && (
                        <motion.span
                          key="exporting"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-1.5"
                        >
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Exporting…
                        </motion.span>
                      )}
                      {status === 'done' && (
                        <motion.span
                          key="done"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Done
                        </motion.span>
                      )}
                      {status === 'error' && (
                        <motion.span
                          key="error"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          Failed
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
