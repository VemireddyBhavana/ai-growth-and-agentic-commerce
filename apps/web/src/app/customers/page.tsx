'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardShell, SectionHeader, GlassCard, StatusBadge } from '@/components/dashboard';
import { apiClient } from '@/lib/api-client';
import { Search, Users, ShoppingBag, IndianRupee, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

type CustomerRow = {
  id: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  totalSpent?: number | string;
  orderCount?: number;
  lastOrderAt?: string | null;
  tags?: string[];
  createdAt?: string;
};

const STORE_ID =
  (typeof process !== 'undefined' ? (process.env as any)?.NEXT_PUBLIC_STORE_ID : undefined) ||
  'acme-retail';

function formatName(c: CustomerRow): string {
  if (c.name) return c.name;
  if (c.firstName || c.lastName) return [c.firstName, c.lastName].filter(Boolean).join(' ').trim();
  return 'Unknown Customer';
}

function tierOf(totalSpent: number): {
  label: string;
  variant: 'active' | 'pending' | 'cancelled';
} {
  if (totalSpent >= 25000) return { label: 'VIP', variant: 'active' };
  if (totalSpent >= 5000) return { label: 'Regular', variant: 'pending' };
  return { label: 'New', variant: 'cancelled' };
}

function CustomersContent() {
  const [search, setSearch] = React.useState('');
  const [tier, setTier] = React.useState<'ALL' | 'VIP' | 'Regular' | 'New'>('ALL');

  const query = useQuery({
    queryKey: ['customers', 'list'],
    queryFn: async () => {
      const res = await apiClient.get('/customers', {
        params: { limit: 100, page: 1 },
        headers: { 'x-store-id': STORE_ID },
      });
      const payload = res?.data?.data ?? res?.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload?.customers)
            ? payload.customers
            : [];
      return list as CustomerRow[];
    },
    staleTime: 30_000,
    retry: 1,
  });

  const enhanced = React.useMemo(
    () =>
      (query.data ?? []).map((c) => ({
        ...c,
        _displayName: formatName(c),
        _totalSpent: Number(c.totalSpent ?? 0),
        _orders: Number(c.orderCount ?? 0),
        _tier: tierOf(Number(c.totalSpent ?? 0)),
      })),
    [query.data]
  );

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return enhanced.filter((c) => {
      if (tier !== 'ALL' && c._tier.label !== tier) return false;
      if (!q) return true;
      return (
        c._displayName.toLowerCase().includes(q) ||
        (c.email ?? '').toLowerCase().includes(q) ||
        (c.phone ?? '').toLowerCase().includes(q) ||
        (c.tags ?? []).join(' ').toLowerCase().includes(q)
      );
    });
  }, [enhanced, search, tier]);

  const stats = React.useMemo(() => {
    const total = enhanced.length;
    const revenue = enhanced.reduce((s, c) => s + c._totalSpent, 0);
    const orders = enhanced.reduce((s, c) => s + c._orders, 0);
    const vip = enhanced.filter((c) => c._tier.label === 'VIP').length;
    return { total, revenue, orders, vip };
  }, [enhanced]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <SectionHeader
        eyebrow="Workspace"
        title="Customers"
        subtitle="Customer relationships, segments, and purchase history"
        action={
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => toast.info('Add customer — wire your import/modal here')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-ai-emerald/80 to-ai-cyan/70 text-white text-[12px] font-semibold border border-white/10 shadow-[0_0_20px_-4px_rgba(16,185,129,0.45)] hover:brightness-110 active:scale-95 transition-all"
          >
            <UserPlus className="w-4 h-4" strokeWidth={2.2} />
            Add Customer
          </motion.button>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard glow="emerald" padded>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Customers
              </p>
              <p className="font-heading font-extrabold text-2xl mt-1">
                {query.isLoading ? '—' : stats.total}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-ai-emerald/15 border border-ai-emerald/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-ai-emerald" />
            </div>
          </div>
        </GlassCard>
        <GlassCard glow="cyan" padded>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Total Orders
              </p>
              <p className="font-heading font-extrabold text-2xl mt-1">
                {query.isLoading ? '—' : stats.orders}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-ai-cyan/15 border border-ai-cyan/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-ai-cyan" />
            </div>
          </div>
        </GlassCard>
        <GlassCard glow="brand" padded>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Total Revenue
              </p>
              <p className="font-heading font-extrabold text-2xl mt-1">
                {query.isLoading ? '—' : '₹ ' + stats.revenue.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-brand-500" />
            </div>
          </div>
        </GlassCard>
        <GlassCard glow="violet" padded>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                VIP Members
              </p>
              <p className="font-heading font-extrabold text-2xl mt-1">
                {query.isLoading ? '—' : stats.vip}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-ai-violet/15 border border-ai-violet/20 flex items-center justify-center">
              <span className="w-5 h-5 rounded-full bg-gradient-to-br from-ai-violet to-ai-cyan flex items-center justify-center text-[9px] font-black text-white">
                ★
              </span>
            </div>
          </div>
        </GlassCard>
      </section>

      <GlassCard padded={false} glow="emerald">
        <div className="p-5 border-b border-white/10 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              strokeWidth={2}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, tags…"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[13px] placeholder:text-muted-foreground focus:border-brand-500/40 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
            />
          </div>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[13px] focus:border-brand-500/40 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
          >
            <option value="ALL">All tiers</option>
            <option value="VIP">VIP</option>
            <option value="Regular">Regular</option>
            <option value="New">New</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Tier</th>
                <th className="px-5 py-3 text-right">Orders</th>
                <th className="px-5 py-3 text-right">Total Spent</th>
                <th className="px-5 py-3">Last Order</th>
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
                      ? 'Database unavailable — connect PostgreSQL + seed customers to see records.'
                      : 'No customers match your filters.'}
                  </td>
                </tr>
              )}
              {filtered.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ai-emerald/25 to-ai-cyan/20 border border-white/10 flex items-center justify-center text-[12px] font-bold text-foreground">
                        {c._displayName ? c._displayName.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{c._displayName}</p>
                        {c.tags && c.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {c.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/10"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {c.email && <p className="text-[12px]">{c.email}</p>}
                    {c.phone && <p className="text-[12px] font-mono">{c.phone}</p>}
                    {!c.email && !c.phone && <span className="text-[12px]">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge variant={c._tier.variant}>{c._tier.label}</StatusBadge>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">{c._orders}</td>
                  <td className="px-5 py-3 text-right font-semibold">
                    ₹ {c._totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-[12px]">
                    {c.lastOrderAt
                      ? new Date(c.lastOrderAt).toLocaleDateString('en-IN')
                      : c.createdAt
                        ? 'Joined ' + new Date(c.createdAt).toLocaleDateString('en-IN')
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

export default function CustomersPage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <CustomersContent />
      </DashboardShell>
    </ProtectedRoute>
  );
}
