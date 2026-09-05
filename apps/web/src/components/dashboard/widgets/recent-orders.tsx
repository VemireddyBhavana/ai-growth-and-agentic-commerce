'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Filter,
  Download,
  Search,
  Bot,
  CreditCard,
  Eye,
  MoreVertical,
} from 'lucide-react';
import { GlassCard, CardHeader, StatusBadge } from '../shared';
import { cn } from '@/lib/utils';
import { useDashboardSlice } from '@/lib/dashboard/hooks';
import type { PaymentMethod, RecentOrder } from '@/lib/dashboard/types';

const paymentIcons: Record<string, { icon: string; tone: string }> = {
  UPI: { icon: 'UPI', tone: 'bg-brand-500/10 text-brand-500 border-brand-500/20' },
  Card: { icon: '💳', tone: 'bg-ai-violet/10 text-ai-violet border-ai-violet/20' },
  CARD: { icon: '💳', tone: 'bg-ai-violet/10 text-ai-violet border-ai-violet/20' },
  'Net Banking': { icon: '🏦', tone: 'bg-ai-cyan/10 text-ai-cyan border-ai-cyan/20' },
  NET_BANKING: { icon: '🏦', tone: 'bg-ai-cyan/10 text-ai-cyan border-ai-cyan/20' },
  'Razorpay Wallet': { icon: 'W', tone: 'bg-ai-emerald/10 text-ai-emerald border-ai-emerald/20' },
  WALLET: { icon: 'W', tone: 'bg-ai-emerald/10 text-ai-emerald border-ai-emerald/20' },
  CASH_ON_DELIVERY: { icon: '💵', tone: 'bg-amber-500/10 text-amber-500 border-amber-500/25' },
};

function getPaymentInfo(payment?: string) {
  if (!payment) return { icon: '💳', tone: 'bg-ai-violet/10 text-ai-violet border-ai-violet/20' };
  const key = payment.trim();
  if (paymentIcons[key]) return paymentIcons[key];
  const upper = key.toUpperCase();
  if (upper.includes('UPI')) return paymentIcons.UPI;
  if (upper.includes('CARD')) return paymentIcons.Card;
  if (upper.includes('NET') || upper.includes('BANK')) return paymentIcons['Net Banking'];
  if (upper.includes('WALLET')) return paymentIcons['Razorpay Wallet'];
  return { icon: '💳', tone: 'bg-ai-violet/10 text-ai-violet border-ai-violet/20' };
}

function PremiumOrderRow({ order, idx }: { order: RecentOrder; idx: number }) {
  const router = useRouter();
  const pay = getPaymentInfo(order?.payment);
  const customerName = order?.customer || 'Guest Customer';
  const initials = customerName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s2: string) => s2[0]?.toUpperCase() ?? '')
    .join('') || 'G';
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.tr
      key={order.id}
      onClick={() => router.push('/orders')}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.44 + idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative hover:bg-background/40 dark:hover:bg-obsidian-950/40 transition-all duration-300 cursor-pointer"
    >
      <td className="px-5 sm:px-6 py-3.5 whitespace-nowrap relative">
        <div className="flex items-center gap-3">
          <motion.div
            className="relative h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-brand-500/80 to-ai-violet/80 grid place-items-center text-white text-[11px] font-bold font-heading shadow-inner"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {initials}
          </motion.div>
          <div>
            <p className="font-heading font-bold text-[13px] text-foreground group-hover:text-brand-500 transition-colors">
              {order.customer}
            </p>
            <p className="text-[11px] font-mono text-muted-foreground">{order.id}</p>
          </div>
        </div>
      </td>
      <td className="px-5 sm:px-6 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {order.aiAssisted && (
            <motion.div
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-ai-violet/10 text-ai-violet border border-ai-violet/20 text-[9px] font-mono font-bold"
              whileHover={{ scale: 1.05 }}
            >
              <Bot className="w-2.5 h-2.5" strokeWidth={2.4} />
              AI
            </motion.div>
          )}
          <span className="text-[12.5px] text-foreground font-medium">{order.product}</span>
        </div>
      </td>
      <td className="px-5 sm:px-6 py-3.5 whitespace-nowrap">
        <motion.p
          className="font-mono text-[12.5px] font-semibold text-foreground"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          ₹ {Number(order?.amount || 0).toLocaleString('en-IN')}
        </motion.p>
      </td>
      <td className="px-5 sm:px-6 py-3.5 whitespace-nowrap">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-5 sm:px-6 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <motion.span
            className={cn(
              'inline-flex items-center w-6 h-6 rounded-md border text-[9.5px] font-mono font-bold',
              pay.tone,
            )}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {pay.icon === '💳' ? (
              <CreditCard className="w-3 h-3 mx-auto" strokeWidth={2.2} />
            ) : (
              <span className="mx-auto">{pay.icon}</span>
            )}
          </motion.span>
          <span className="text-[12px] text-muted-foreground">{order.payment}</span>
        </div>
      </td>
      <td className="px-5 sm:px-6 py-3.5 whitespace-nowrap text-[11.5px] font-mono text-muted-foreground">
        {order.time}
      </td>
      <td className="px-5 sm:px-6 py-3.5 whitespace-nowrap pr-6">
        <div className="flex items-center gap-1">
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push('/orders');
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5 transition-all"
            aria-label="View order"
          >
            <Eye className="w-4 h-4" strokeWidth={2} />
          </motion.button>
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push('/orders');
            }}
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5 transition-all"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" strokeWidth={2} />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
}

export function RecentOrders() {
  const router = useRouter();
  const { data: recentOrders = [] } = useDashboardSlice('recentOrders');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredOrders = React.useMemo(() => {
    if (!searchTerm) return recentOrders;
    const q = searchTerm.toLowerCase();
    return recentOrders.filter(
      (o) =>
        o.customer.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
    );
  }, [recentOrders, searchTerm]);

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Payment', 'Time'];
    const rows = filteredOrders.map((o) => [
      o.id,
      `"${o.customer.replace(/"/g, '""')}"`,
      `"${o.product.replace(/"/g, '""')}"`,
      o.amount,
      o.status,
      o.payment,
      o.time,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `recent-orders-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className="lg:col-span-3 xl:col-span-2"
    >
      <GlassCard padded={false}>
        <div className="p-5 sm:p-6">
          <CardHeader
            title="Recent Orders"
            subtitle="Latest transactions with AI-assisted flags"
            action={
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/70" strokeWidth={2} />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search orders…"
                    className="h-8 w-40 rounded-xl border border-border/70 dark:border-white/10 bg-background/60 dark:bg-obsidian-950/60 pl-8 pr-3 text-[11.5px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/40 transition-all focus:shadow-lg focus:shadow-brand-500/10"
                  />
                </div>
                <motion.button
                  type="button"
                  onClick={() => router.push('/orders')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-xl text-[11.5px] font-semibold border border-border/60 dark:border-white/10 bg-background/60 dark:bg-obsidian-950/60 text-foreground hover:border-brand-500/40 transition-all hover:shadow-lg hover:shadow-brand-500/10"
                >
                  <Filter className="w-3.5 h-3.5" strokeWidth={2} />
                  Filter
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleExportCSV}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-xl text-[11.5px] font-semibold border border-border/60 dark:border-white/10 bg-background/60 dark:bg-obsidian-950/60 text-foreground hover:border-brand-500/40 transition-all hover:shadow-lg hover:shadow-brand-500/10"
                >
                  <Download className="w-3.5 h-3.5" strokeWidth={2} />
                  CSV
                </motion.button>
              </div>
            }
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-y border-white/10 dark:border-white/10 bg-background/30 dark:bg-obsidian-950/30">
                {['Customer', 'Product', 'Amount', 'Status', 'Payment', 'Time', ''].map((h, idx) => (
                  <motion.th
                    key={h}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    className="px-5 sm:px-6 py-3 text-[10.5px] font-mono font-bold uppercase tracking-[0.14em] text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </motion.th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 dark:divide-white/5">
              {filteredOrders.map((order, idx) => (
                <PremiumOrderRow key={order.id} order={order} idx={idx} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-t border-white/10 dark:border-white/10">
          <p className="text-[11.5px] text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredOrders.length}</span> of{' '}
            <span className="font-semibold text-foreground">1,328</span> orders today
          </p>
          <div className="flex items-center gap-1.5">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-8 px-3 items-center rounded-lg text-[11.5px] font-semibold border border-border/60 dark:border-white/10 text-muted-foreground hover:text-foreground hover:border-brand-500/40 transition-all disabled:opacity-50"
              disabled
            >
              Previous
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[11.5px] font-bold bg-gradient-to-r from-brand-600 to-ai-violet text-white shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30 transition-all"
            >
              1
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[11.5px] font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5 transition-all"
            >
              2
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-8 px-3 items-center rounded-lg text-[11.5px] font-semibold border border-border/60 dark:border-white/10 text-foreground hover:border-brand-500/40 transition-all"
            >
              Next
            </motion.button>
          </div>
        </div>
      </GlassCard>
    </motion.section>
  );
}
