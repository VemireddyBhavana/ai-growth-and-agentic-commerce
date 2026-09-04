import React from 'react';
import { useOrdersStore } from '@/stores/ordersStore';
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
  };

  const style = styles[status] || 'bg-white/10 text-white border-white/20';

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border capitalize ${style}`}>
      {status}
    </span>
  );
};

export const OrdersTable: React.FC = () => {
  const orders = useOrdersStore((state) => state.getFilteredAndSortedOrders());

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileText className="w-16 h-16 text-white/20 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">No orders found</h3>
        <p className="text-white/60 mb-6">Try adjusting your filters or search query.</p>
        <Link href="/" className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-white/60 text-sm">
            <th className="p-4 font-medium">Order ID</th>
            <th className="p-4 font-medium">Date</th>
            <th className="p-4 font-medium">Customer</th>
            <th className="p-4 font-medium">Amount</th>
            <th className="p-4 font-medium">Payment</th>
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
              className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
            >
              <td className="p-4 text-sm font-medium text-white">{order.id}</td>
              <td className="p-4 text-sm text-white/70">
                {new Date(order.date).toLocaleDateString()}
              </td>
              <td className="p-4 text-sm text-white/90">{order.customerName}</td>
              <td className="p-4 text-sm font-medium text-white">₹{order.total.toLocaleString()}</td>
              <td className="p-4 text-sm">
                <StatusBadge status={order.paymentDetails.status} />
              </td>
              <td className="p-4 text-sm">
                <StatusBadge status={order.status} />
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-white/60 hover:text-white transition-colors" title="Download Invoice">
                    <Download className="w-4 h-4" />
                  </button>
                  <Link href={`/orders/${order.id}`} className="text-violet-400 hover:text-violet-300 flex items-center text-sm font-medium transition-colors">
                    Details
                    <ChevronRight className="w-4 h-4 ml-1" />
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
