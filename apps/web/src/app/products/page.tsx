'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardShell, SectionHeader, GlassCard, StatusBadge } from '@/components/dashboard';
import { apiClient } from '@/lib/api-client';
import { Search, Plus, Package, AlertTriangle, Filter, Database } from 'lucide-react';
import { toast } from 'sonner';

type ProductRow = {
  id: string;
  name: string;
  sku: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED' | string;
  price: number;
  stock: number;
  lowStock: number;
  currency: string;
  category?: string;
  brand?: string;
  createdAt?: string;
};

const STORE_ID =
  (typeof process !== 'undefined' ? (process.env as any)?.NEXT_PUBLIC_STORE_ID : undefined) ||
  'acme-retail';

const statusMap: Record<string, 'active' | 'pending' | 'cancelled'> = {
  ACTIVE: 'active',
  INACTIVE: 'cancelled',
  DRAFT: 'pending',
  ARCHIVED: 'cancelled',
};

function ProductsContent() {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<'ALL' | ProductRow['status']>('ALL');

  const query = useQuery({
    queryKey: ['products', 'list'],
    queryFn: async () => {
      const res = await apiClient.get('/products', {
        params: { limit: 100, page: 1 },
        headers: { 'x-store-id': STORE_ID },
      });
      const payload = res?.data?.data ?? res?.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload?.products)
            ? payload.products
            : [];
      return list as ProductRow[];
    },
    staleTime: 30_000,
    retry: 1,
  });

  const filtered = React.useMemo(() => {
    const data = query.data ?? [];
    const q = search.trim().toLowerCase();
    return data.filter((p) => {
      if (status !== 'ALL' && p.status !== status) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.brand ?? '').toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q)
      );
    });
  }, [query.data, search, status]);

  const lowStock = (query.data ?? []).filter((p) => p.stock <= (p.lowStock ?? 10)).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <SectionHeader
        eyebrow="Workspace"
        title="Products"
        subtitle="Manage your product catalog, inventory, and pricing"
        action={
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => toast.info('Create product — wire your modal here')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-600 to-ai-violet text-white text-[12px] font-semibold border border-white/10 shadow-[0_0_20px_-4px_rgba(99,102,241,0.5)] hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" strokeWidth={2.2} />
            Add Product
          </motion.button>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard glow="brand" padded>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Total Products
              </p>
              <p className="font-heading font-extrabold text-2xl mt-1">
                {query.isLoading ? '—' : (query.data?.length ?? 0)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-brand-500" />
            </div>
          </div>
        </GlassCard>

        <GlassCard glow="emerald" padded>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Active
              </p>
              <p className="font-heading font-extrabold text-2xl mt-1">
                {query.isLoading
                  ? '—'
                  : (query.data?.filter((p) => p.status === 'ACTIVE').length ?? 0)}
              </p>
            </div>
            <StatusBadge variant="active" />
          </div>
        </GlassCard>

        <GlassCard glow="cyan" padded>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Low Stock
              </p>
              <p className="font-heading font-extrabold text-2xl mt-1">
                {query.isLoading ? '—' : lowStock}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-ai-cyan/15 border border-ai-cyan/20 flex items-center justify-center">
              <Filter className="w-5 h-5 text-ai-cyan" />
            </div>
          </div>
        </GlassCard>

        <GlassCard glow="violet" padded>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                Catalog Value
              </p>
              <p className="font-heading font-extrabold text-2xl mt-1">
                {query.isLoading
                  ? '—'
                  : '₹ ' +
                    (
                      query.data?.reduce((s, p) => s + Number(p.price) * Number(p.stock || 0), 0) ??
                      0
                    ).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-ai-violet/15 border border-ai-violet/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-ai-violet" />
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
              placeholder="Search by name, SKU, brand, category…"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[13px] placeholder:text-muted-foreground focus:border-brand-500/40 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[13px] focus:border-brand-500/40 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-right">Stock</th>
                <th className="px-5 py-3">Created</th>
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
                    {query.error ? (
                      <span className="inline-flex items-center gap-2 text-amber-400">
                        <AlertTriangle className="w-4 h-4" />
                        Connect database + seed data to see products
                      </span>
                    ) : (
                      'No products match your filters.'
                    )}
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
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500/15 to-ai-violet/15 border border-white/10 flex items-center justify-center">
                        <Package className="w-4 h-4 text-brand-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-[13px] text-foreground">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {p.category ?? p.brand ?? 'Uncategorized'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-[11px] text-muted-foreground">{p.sku}</td>
                  <td className="px-5 py-3">
                    <StatusBadge variant={statusMap[p.status] ?? 'pending'}>
                      {typeof p.status === 'string'
                        ? p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase()
                        : p.status}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">
                    ₹ {Number(p.price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={
                        p.stock <= (p.lowStock ?? 10)
                          ? 'text-amber-400 font-semibold'
                          : 'text-foreground'
                      }
                    >
                      {p.stock}
                      {p.stock <= (p.lowStock ?? 10) && (
                        <span className="ml-1 text-[10px]">LOW</span>
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-[12px]">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : '—'}
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

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <ProductsContent />
      </DashboardShell>
    </ProtectedRoute>
  );
}
