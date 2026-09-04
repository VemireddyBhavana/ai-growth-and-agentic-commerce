'use client';
import React from 'react';
import { AuditStats } from '@/components/audit/AuditStats';
import { AuditFilterBar } from '@/components/audit/AuditFilterBar';
import { AuditTable } from '@/components/audit/AuditTable';
import { ExportControls } from '@/components/audit/ExportControls';
import { ShieldAlert } from 'lucide-react';

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                AI Audit Trail
              </h1>
              <p className="text-white/60 mt-1">Trace, verify, and explain every system action securely.</p>
            </div>
          </div>
          <ExportControls />
        </div>

        <AuditStats />
        <AuditFilterBar />
        <AuditTable />
      </div>
    </div>
  );
}
