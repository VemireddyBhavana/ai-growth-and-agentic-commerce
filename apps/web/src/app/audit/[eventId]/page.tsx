'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuditStore } from '@/stores/auditStore';
import Link from 'next/link';
import { ChevronLeft, FileText, AlertTriangle } from 'lucide-react';
import { AuditTimeline } from '@/components/audit/AuditTimeline';
import { AIExplainabilityPanel } from '@/components/audit/AIExplainabilityPanel';
import { SecurityPanel } from '@/components/audit/SecurityPanel';
import { PaymentDetailsPanel } from '@/components/audit/PaymentDetailsPanel';
import { ExportControls } from '@/components/audit/ExportControls';
import { motion } from 'framer-motion';

export default function AuditDetailsPage() {
  const { eventId } = useParams();
  const router = useRouter();
  const events = useAuditStore((state) => state.events);
  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
        <FileText className="w-16 h-16 text-white/20 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
        <p className="text-white/60 mb-6">The audit event you are looking for does not exist.</p>
        <button onClick={() => router.back()} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  const isFailed = event.status === 'failed';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <Link href="/audit" className="flex items-center text-white/60 hover:text-white transition-colors mb-4 md:mb-0">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Audit Trail
          </Link>
          <ExportControls />
        </div>

        {isFailed && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 flex items-start space-x-3"
          >
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-400">Critical Failure Detected</h3>
              <p className="text-sm text-red-300">This transaction failed at the payment gateway level and was automatically escalated. See the timeline for the exact failure point.</p>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-8 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">
              Trace: {event.id}
            </h1>
            <p className="text-white/60">
              Initiated on {new Date(event.timestamp).toLocaleString()} by <span className="text-white">{event.user}</span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right">
            <div className="space-y-1">
              <p className="text-sm text-white/50 uppercase tracking-wider">Linked Entities</p>
              {event.orderId && <p className="font-mono text-sm text-violet-400">Order: {event.orderId}</p>}
              {event.paymentId && <p className="font-mono text-sm text-blue-400">Payment: {event.paymentId}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Timeline */}
          <div className="lg:col-span-5">
            <AuditTimeline timeline={event.timeline} />
          </div>

          {/* Right Column: Deep Dives */}
          <div className="lg:col-span-7 space-y-8">
            {event.aiReasoning && (
              <AIExplainabilityPanel reasoning={event.aiReasoning} />
            )}
            
            {event.securityDetails && (
              <SecurityPanel security={event.securityDetails} />
            )}
            
            {event.paymentDetails && (
              <PaymentDetailsPanel payment={event.paymentDetails} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
