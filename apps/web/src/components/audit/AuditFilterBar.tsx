import React from 'react';
import { useAuditStore } from '@/stores/auditStore';
import { Search, Filter } from 'lucide-react';
import type { AuditEventStatus, RiskLevel } from '@/types/audit';

export const AuditFilterBar: React.FC = () => {
  const { 
    searchQuery, setSearchQuery, 
    statusFilter, setStatusFilter,
    riskFilter, setRiskFilter
  } = useAuditStore();

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/10 backdrop-blur-sm">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-white/40" />
        </div>
        <input
          id="audit-search-input"
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg leading-5 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-violet-500 transition-colors sm:text-sm text-base"
          placeholder="Search by ID, User, Order, or Payment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full md:w-auto">
        <div className="relative">
          <select 
            id="audit-status-select"
            aria-label="Filter by Status"
            className="w-full appearance-none bg-slate-900 border border-white/10 text-white rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:border-violet-500 transition-colors sm:text-sm text-base"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AuditEventStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
            <option value="warning">Warning</option>
          </select>
          <Filter className="absolute right-3 top-2.5 h-4 w-4 text-white/40 pointer-events-none" />
        </div>

        <div className="relative">
          <select 
            id="audit-risk-select"
            aria-label="Filter by Risk Level"
            className="w-full appearance-none bg-slate-900 border border-white/10 text-white rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:border-violet-500 transition-colors sm:text-sm text-base"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'all')}
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
          <Filter className="absolute right-3 top-2.5 h-4 w-4 text-white/40 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
