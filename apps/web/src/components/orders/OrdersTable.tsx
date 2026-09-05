import React from 'react';
import { useOrdersStore } from '@/stores/ordersStore';
import type { Order } from '@/types/orders';
import Link from 'next/link';
import { Download, ChevronRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    processing: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    shipped: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/20',
    delivered: 'bg-green-400/10 text-green-400 border-green-400/20',
    cancelled: 'bg-red-400/10 text-red-400 border-red-400/20',
    refunded: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
    completed: 'bg-green-400/10 text-green-400 border-green-400/20',
  };

  const style = styles[status] || 'bg-white/10 text-white border-white/20';

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border capitalize ${style}`}>
      {status}
    </span>
  );
};

interface OrdersTableProps {
  onInvoice?: (order: Order) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ onInvoice }) => {
  const orders = useOrdersStore((state) => state.orders);
  const searchQuery = useOrdersStore((state) => state.searchQuery);
  const statusFilter = useOrdersStore((state) => state.statusFilter);
  const dateFilter = useOrdersStore((state) => state.dateFilter);
  const sortBy = useOrdersStore((state) => state.sortBy);

  const filteredOrders = React.useMemo(() => {
    let filtered = [...orders];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.items.some((i) => i.name.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }
    const now = Date.now();
    if (dateFilter === 'today')
      filtered = filtered.filter((o) => now - new Date(o.date).getTime() <= 86400000);
    else if (dateFilter === '7days')
      filtered = filtered.filter((o) => now - new Date(o.date).getTime() <= 7 * 86400000);
    else if (dateFilter === '30days')
      filtered = filtered.filter((o) => now - new Date(o.date).getTime() <= 30 * 86400000);
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest_amount':
          return b.total - a.total;
        case 'lowest_amount':
          return a.total - b.total;
        case 'newest':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
    return filtered;
  }, [orders, searchQuery, statusFilter, dateFilter, sortBy]);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileText className="w-16 h-16 text-white/20 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">No orders found</h3>
        <p className="text-white/60 mb-6">Try adjusting your filters or search query.</p>
        <Link
          href="/"
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
      <table className="w-full text-left border-collapse min-w-[640px]">
        <thead>
          <tr className="border-b border-white/10 text-white/60 text-sm">
            <th className="p-4 font-medium">Order ID</th>
            <th className="p-4 font-medium hidden sm:table-cell">Date</th>
            <th className="p-4 font-medium">Customer</th>
            <th className="p-4 font-medium">Amount</th>
            <th className="p-4 font-medium hidden md:table-cell">Payment</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <motion.tr
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={order.id}
              className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
            >
              <td className="p-4 text-sm font-medium text-white font-mono">{order.id}</td>
              <td className="p-4 text-sm text-white/70 hidden sm:table-cell">
                {new Date(order.date).toLocaleDateString()}
              </td>
              <td className="p-4 text-sm text-white/90">{order.customerName}</td>
              <td className="p-4 text-sm font-medium text-white">
                ₹{order.total.toLocaleString()}
              </td>
              <td className="p-4 text-sm hidden md:table-cell">
                <StatusBadge status={order.paymentDetails.status} />
              </td>
              <td className="p-4 text-sm">
                <StatusBadge status={order.status} />
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {onInvoice && (
                    <button
                      onClick={() => onInvoice(order)}
                      className="text-white/40 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
                      title="Download Invoice"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-violet-400 hover:text-violet-300 flex items-center text-sm font-medium transition-colors px-2 py-1 hover:bg-violet-500/10 rounded-lg"
                  >
                    <span className="hidden sm:inline">Details</span>
                    <ChevronRight className="w-4 h-4 ml-0 sm:ml-1" />
                  </Link>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
