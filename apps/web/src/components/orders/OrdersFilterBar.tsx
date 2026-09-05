import React from 'react';
import { useOrdersStore } from '@/stores/ordersStore';
import { Search, Filter, SortDesc } from 'lucide-react';
import type { OrderStatus } from '@/types/orders';

type DateFilter = 'today' | '7days' | '30days' | 'all';
type SortBy = 'newest' | 'oldest' | 'highest_amount' | 'lowest_amount';

const selectClass =
  'appearance-none bg-white/5 border border-white/10 text-white rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:border-violet-500 transition-colors text-sm w-full';

export const OrdersFilterBar: React.FC = () => {
  const {
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    dateFilter, setDateFilter,
    sortBy, setSortBy,
  } = useOrdersStore();

  return (
    <div className="flex flex-col gap-3 mb-6 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-white/40" />
        </div>
        <input
          type="text"
          id="orders-search"
          className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-white/5 text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-violet-500 transition-colors text-sm"
          placeholder="Search by Order ID, Product, or Customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Status Filter */}
        <div className="relative">
          <select
            id="orders-status-filter"
            className={selectClass}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <select
            id="orders-date-filter"
            className={selectClass}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            id="orders-sort"
            className={selectClass}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_amount">Highest Amount</option>
            <option value="lowest_amount">Lowest Amount</option>
          </select>
          <SortDesc className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
