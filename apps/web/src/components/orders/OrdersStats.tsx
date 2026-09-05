import React from 'react';
import { useOrdersStore } from '@/stores/ordersStore';
import { Package, CheckCircle, Clock, XCircle, RefreshCcw, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export const OrdersStats: React.FC = () => {
  const orders = useOrdersStore((state) => state.orders);
  const stats = React.useMemo(() => {
    const s = {
      total: orders.length,
      completed: 0,
      pending: 0,
      cancelled: 0,
      refunded: 0,
      revenue: 0,
    };
    orders.forEach((o) => {
      if (o.status === 'delivered') s.completed++;
      else if (o.status === 'processing' || o.status === 'shipped' || o.status === 'pending')
        s.pending++;
      if (o.status === 'cancelled') s.cancelled++;
      if (o.status === 'refunded') s.refunded++;
      if (o.status !== 'cancelled' && o.status !== 'refunded') s.revenue += o.total;
    });
    return s;
  }, [orders]);

  const statCards = [
    {
      label: 'Total Orders',
      value: stats.total,
      icon: Package,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    {
      label: 'Refunded',
      value: stats.refunded,
      icon: RefreshCcw,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10',
    },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
    },
    {
      label: 'Total Revenue',
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-violet-400',
      bg: 'bg-violet-400/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-sm"
          >
            <div
              className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center mb-3`}
            >
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs text-white/60 font-medium uppercase tracking-wider">
              {stat.label}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};
