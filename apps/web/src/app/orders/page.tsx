'use client';
import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardShell, SectionHeader } from '@/components/dashboard';
import { useOrdersStore } from '@/stores/ordersStore';
import { OrdersStats } from '@/components/orders/OrdersStats';
import { OrdersFilterBar } from '@/components/orders/OrdersFilterBar';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { InvoiceModal } from '@/components/orders/InvoiceModal';
import { motion } from 'framer-motion';
import { PackageSearch } from 'lucide-react';
import type { Order } from '@/types/orders';

function OrdersContent() {
  const fetchOrders = useOrdersStore((state) => state.fetchOrders);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  React.useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <SectionHeader
        eyebrow="Workspace"
        title="Orders Management"
        subtitle="View, track, and manage all your orders in one place"
        action={
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-brand-600 to-ai-violet text-white text-[12px] font-semibold border border-white/10 shadow-[0_0_20px_-4px_rgba(99,102,241,0.5)] hover:brightness-110 active:scale-95 transition-all"
          >
            <PackageSearch className="w-4 h-4" strokeWidth={2.1} />
            Export Orders
          </motion.button>
        }
      />
      <OrdersStats />
      <OrdersFilterBar />
      <OrdersTable onInvoice={(order) => setInvoiceOrder(order)} />

      {invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          isOpen={!!invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <OrdersContent />
      </DashboardShell>
    </ProtectedRoute>
  );
}
