'use client';
import React from 'react';
import { OrdersStats } from '@/components/orders/OrdersStats';
import { OrdersFilterBar } from '@/components/orders/OrdersFilterBar';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { PackageSearch } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
            <PackageSearch className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              Orders Management
            </h1>
            <p className="text-white/60 mt-1">View, track, and manage all your orders in one place.</p>
          </div>
        </div>

        <OrdersStats />
        <OrdersFilterBar />
        <OrdersTable />
      </div>
    </div>
  );
}
