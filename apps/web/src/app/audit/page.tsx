'use client';
import React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardShell, SectionHeader } from '@/components/dashboard';
import { AuditStats } from '@/components/audit/AuditStats';
import { AuditFilterBar } from '@/components/audit/AuditFilterBar';
import { AuditTable } from '@/components/audit/AuditTable';
import { ExportControls } from '@/components/audit/ExportControls';
import { useAuditStore } from '@/stores/auditStore';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

function AuditContent() {
  const fetchEvents = useAuditStore((state) => state.fetchEvents);

  React.useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <SectionHeader
        eyebrow="Security & Compliance"
        title="AI Audit Trail"
        subtitle="Trace, verify, and explain every AI decision and payment action securely."
        action={
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <ExportControls />
          </motion.div>
        }
      />

      <AuditStats />
      <AuditFilterBar />
      <AuditTable />
    </div>
  );
}

export default function AuditPage() {
  return (
    <ProtectedRoute>
      <DashboardShell merchantName="Acme Retail">
        <AuditContent />
      </DashboardShell>
    </ProtectedRoute>
  );
}
