'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardShell, SectionHeader, GlassCard, StatusBadge } from '@/components/dashboard';
import { apiClient } from '@/lib/api-client';
import { Search, CreditCard, IndianRupee, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

type PaymentRow = {
  id: string;
  orderId: string;
  orderNumber?: string;
  customer?: { name?: string | null; email?: string | null; phone?: string | null };
  amount: number;
  currency?: string;
  status: 'PENDING' | 'CAPTURED' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'AUTHORIZED' | string;
  method: string;
  providerOrderId?: string;
  providerPaymentId?: string;
  verifiedAt?: string | null;
  createdAt?: string;
};

type Summary = {
  totalVolume: number;
  totalCount: number;
  byStatus?: Record<string, number>;
};

const STORE_ID =
  (typeof process !== 'undefined' ? (process.env as any)?.NEXT_PUBLIC_STORE_ID : undefined) ||
  'acme-retail';

const statusBadgeVariant = (s: string): 'active' | 'pending' | 'cancelled' => {
  const u = s.toUpperCase();
  if (['CAPTURED', 'COMPLETED', 'AUTHORIZED'].includes(u)) return 'active';
  if (['PENDING', 'PROCESSING'].includes(u)) return 'pending';
  return 'cancelled';
};

function statusIcon(s: string) {
  const u = s.toUpperCase();
  if (['CAPTURED', 'COMPLETED'].includes(u))
    return <CheckCircle2 className="w-4 h-4 text-ai-emerald" />;
  if (['FAILED', 'REFUNDED'].includes(u)) return <XCircle className="w-4 h-4 text-red-400" />;
  return <Clock className="w-4 h-4 text-amber-400" />;
}

function PaymentsContent() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'ALL' | PaymentRow['status']>('ALL');
  const query = useQuery({
    queryKey: ['payments', 'list'],
    queryFn: async () => {
      const res = await apiClient.get('/payments', {
        params: { page: 1, limit: 100 },
        headers: { 'x-store-id': STORE_ID },
      });
      const payload = res?.data?.data ?? res?.data;
      const items = Array.isArray(payload?.items)
        ? (payload.items as PaymentRow[])
        : Array.isArray(payload)
          ? (payload as PaymentRow[])
          : [];
      const summary =
        payload?.summary ??
        (payload as any)?.summary ??
        ({ totalVolume: 0, totalCount: 0 } as Summary);
      return { items, summary: summary as Summary };
    },
    staleTime: 30_000,
    retry: 1,
  });

  const items = query.data?.items ?? [];
  const summary = query.data?.summary;
  const byStatus = summary?.byStatus ?? {};

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((p) => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (!q) return true;
      return (
        (p.orderNumber ?? '').toLowerCase().includes(q) ||
        (p.providerOrderId ?? '').toLowerCase().includes(q) ||
        (p.providerPaymentId ?? '').toLowerCase().includes(q) ||
        (p.customer?.name ?? '').toLowerCase().includes(q) ||
        (p.customer?.email ?? '').toLowerCase().includes(q)
      );
    });
  }, [items, search, statusFilter]);

  const totals = React.useMemo(() => {
    const captured = filtered
      .filter((p) => ['CAPTURED', 'COMPLETED', 'AUTHORIZED'].includes(p.status.toUpperCase()))
      .reduce((s, p) => s + Number(p.amount || 0), 0);
    const failed = filtered
      .filter((p) => p.status.toUpperCase() === 'FAILED')
      .reduce((s, p) => s + Number(p.amount || 0), 0);
    const refunded = filtered
      .filter((p) => p.status.toUpperCase() === 'REFUNDED')
      .reduce((s, p) => s + Number(p.amount || 0), 0);
    return { captured, failed, refunded };
  }, [filtered]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <SectionHeader
        eyebrow="Workspace"
        title="Payments"
        subtitle="Transactions, settlements, and payment method performance"
        action={
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => toast.info('Export — wire export CSV/XLSX here')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-600 to-ai-violet text-white text-[12px] font-semibold border border-white/10 shadow-[0_0_20px_-4px_rgba(99,102,241,0.5)] hover:brightness-110 active:scale-95 transition-all"
          >
            <CreditCard className="w-4 h-4" strokeWidth={2.2} />
            Export
          </motion.button>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard glow="brand" padded>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Total Volume
              </p>
              <p className="font-heading font-extrabold text-2xl mt-1">
                ₹ {(summary?.totalVolume ?? 0).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {summary?.totalCount ?? 0} transactions
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-brand-500" />
            </div>
          </div>
        </GlassCard>
        <GlassCard glow="emerald" padded>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Captured
              </p>
              <p className="font-heading font-extrabold text-2xl mt-1">
                ₹ {totals.captured.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {byStatus?.CAPTURED ?? byStatus?.COMPLETED ?? 0} txns
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-ai-emerald/15 border border-ai-emerald/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-ai-emerald" />
            </div>
          </div>
        </GlassCard>
        <GlassCard padded>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Failed
              </p>
              <p className="font-heading font-extrabold text-2xl mt-1 text-red-400">
                ₹ {totals.failed.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">{byStatus?.FAILED ?? 0} txns</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </GlassCard>
        <GlassCard glow="cyan" padded>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Refunded
              </p>
              <p className="font-heading font-extrabold text-2xl mt-1">
                ₹ {totals.refunded.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {byStatus?.REFUNDED ?? 0} txns
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-ai-cyan/15 border border-ai-cyan/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-ai-cyan" />
            </div>
          </div>
        </GlassCard>
      </section>

      <GlassCard padded={false} glow="brand">
        <div className="p-5 border-b border-white/10 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              strokeWidth={2}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, Razorpay ID, customer…"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[13px] placeholder:text-muted-foreground focus:border-brand-500/40 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[13px] focus:border-brand-500/40 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="AUTHORIZED">Authorized</option>
            <option value="CAPTURED">Captured</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {query.isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-4 rounded bg-white/5 animate-pulse" />
                    </td>
                  </tr>
                ))}
              {!query.isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    {query.error
                      ? 'Database unavailable — payments will appear once PostgreSQL is reachable and data is seeded.'
                      : 'No payments match your filters.'}
                  </td>
                </tr>
              )}
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {statusIcon(p.status)}
                      <div>
                        <p className="font-semibold text-foreground">
                          {p.orderNumber ?? p.orderId}
                        </p>
                        {p.providerPaymentId && (
                          <p className="text-[10.5px] font-mono text-muted-foreground">
                            {p.providerPaymentId}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium">{p.customer?.name ?? '—'}</p>
                    <p className="text-[12px] text-muted-foreground">
                      {p.customer?.email ?? p.customer?.phone ?? '—'}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[12px] font-medium text-foreground">{p.method}</span>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge variant={statusBadgeVariant(p.status)}>
                      {p.status.toUpperCase()}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">
                    ₹ {Number(p.amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-[12px]">
                    {p.verifiedAt
                      ? 'Paid ' + new Date(p.verifiedAt).toLocaleDateString('en-IN')
                      : p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString('en-IN')
                        : '—'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <PaymentsContent />
      </DashboardShell>
    </ProtectedRoute>
  );
}
