'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardShell } from '@/components/dashboard/layout/shell';
import {
  AnalyticsHeader,
  AnalyticsKpiGrid,
  RevenueChart,
  AIPerformancePanel,
  ConversionFunnel,
  CustomerInsightsChart,
  PaymentAnalytics,
  ProductAnalytics,
  AIInsightsPanel,
  GeographicAnalytics,
  ExportReportsPanel,
  AnalyticsPageSkeleton,
} from '@/components/analytics';

// ── Section Wrapper ──────────────────────────────

function SectionReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Section Header ───────────────────────────────

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="font-heading font-bold text-lg text-foreground">
        {title}
      </h2>
      <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
    </div>
  );
}

// ── Analytics Content ────────────────────────────

function AnalyticsContent() {
  const [isReady, setIsReady] = React.useState(false);

  // Simulate initial data load
  React.useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <AnalyticsPageSkeleton />;
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* ── Header ── */}
      <AnalyticsHeader />

      {/* ── KPI Cards ── */}
      <SectionReveal delay={0.05}>
        <AnalyticsKpiGrid />
      </SectionReveal>

      {/* ── Revenue Analytics ── */}
      <SectionReveal delay={0.08}>
        <RevenueChart />
      </SectionReveal>

      {/* ── AI Performance + Conversion Funnel + Customer Insights ── */}
      <SectionReveal delay={0.1}>
        <section
          aria-label="AI performance, conversion funnel, and customer insights"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          <AIPerformancePanel />
          <ConversionFunnel />
          <CustomerInsightsChart />
        </section>
      </SectionReveal>

      {/* ── Product Analytics + Payment Analytics ── */}
      <SectionReveal delay={0.12}>
        <section
          aria-label="Product and payment analytics"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          <div className="lg:col-span-2">
            <ProductAnalytics />
          </div>
          <PaymentAnalytics />
        </section>
      </SectionReveal>

      {/* ── Geographic + Export Reports ── */}
      <SectionReveal delay={0.14}>
        <section
          aria-label="Geographic analytics and export reports"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          <div className="lg:col-span-2">
            <GeographicAnalytics />
          </div>
          <ExportReportsPanel />
        </section>
      </SectionReveal>

      {/* ── AI Insights ── */}
      <SectionReveal delay={0.16}>
        <SectionTitle
          title="AI Intelligent Insights"
          subtitle="Actionable AI-generated recommendations to grow revenue"
        />
        <AIInsightsPanel />
      </SectionReveal>

      {/* ── Footer ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="pt-4 pb-2 text-center"
      >
        <p className="text-[11px] font-mono text-muted-foreground/50 tracking-wider">
          AI SALES ASSISTANT · BUSINESS INTELLIGENCE · REAL-TIME ANALYTICS
        </p>
      </motion.footer>
    </div>
  );
}

// ── Analytics Page ───────────────────────────────

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <DashboardShell merchantName="Acme Retail">
        <AnalyticsContent />
      </DashboardShell>
    </ProtectedRoute>
  );
}
