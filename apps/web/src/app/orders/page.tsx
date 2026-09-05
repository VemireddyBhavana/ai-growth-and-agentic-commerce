'use client';
import React, { useState } from 'react';
import { useOrdersStore } from '@/stores/ordersStore';
import { OrdersStats } from '@/components/orders/OrdersStats';
import { OrdersFilterBar } from '@/components/orders/OrdersFilterBar';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { InvoiceModal } from '@/components/orders/InvoiceModal';
import { PackageSearch } from 'lucide-react';
import type { Order } from '@/types/orders';

export default function OrdersPage() {
  const fetchOrders = useOrdersStore((state) => state.fetchOrders);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  React.useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:space-x-3 mb-6 sm:mb-8">
          <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center shrink-0">
            <PackageSearch className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              Orders Management
            </h1>
            <p className="text-white/60 mt-0.5 text-sm sm:text-base">View, track, and manage all your orders in one place.</p>
          </div>
        </div>

        <OrdersStats />
        <OrdersFilterBar />
        <OrdersTable onInvoice={(order) => setInvoiceOrder(order)} />
      </div>

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
