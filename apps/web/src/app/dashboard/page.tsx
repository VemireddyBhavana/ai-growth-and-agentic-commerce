'use client';

import * as React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import {
  DashboardShell,
  DashboardWelcome,
  KpiStats,
  QuickActions,
  RevenueChart,
  OrdersChart,
  SalesFunnel,
  AiConversationAnalytics,
  TopProducts,
  LiveVisitors,
  AiInsights,
  SmartRecommendations,
  SuggestedCampaigns,
  AiAlerts,
  RecentOrders,
  AiPerformance,
} from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  return (
    <DashboardShell merchantName="Acme Retail">
      <div className="space-y-6 sm:space-y-8">
        <DashboardWelcome />

        <KpiStats />

        <QuickActions />

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RevenueChart />
          <OrdersChart />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
            <SalesFunnel />
            <AiConversationAnalytics />
            <TopProducts />
            <LiveVisitors />
          </div>
          <div className="space-y-4">
            <AiInsights />
            <SmartRecommendations />
            <SuggestedCampaigns />
            <AiAlerts />
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <RecentOrders />
          <AiPerformance />
        </section>
      </div>
    </DashboardShell>
  );
}
