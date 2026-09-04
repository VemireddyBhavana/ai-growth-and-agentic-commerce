import React from 'react';
import { useAuditStore } from '@/stores/auditStore';
import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    success: 'bg-green-400/10 text-green-400 border-green-400/20',
    failed: 'bg-red-400/10 text-red-400 border-red-400/20',
    warning: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
  };

  const style = styles[status] || 'bg-white/10 text-white border-white/20';

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border capitalize ${style}`}>
      {status}
    </span>
  );
};

const RiskBadge: React.FC<{ level: string }> = ({ level }) => {
  const styles: Record<string, string> = {
    low: 'bg-green-400/10 text-green-400',
    medium: 'bg-orange-400/10 text-orange-400',
    high: 'bg-red-400/10 text-red-400',
  };

  const style = styles[level] || 'text-white/60';

  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded uppercase tracking-wider ${style}`}>
      {level}
    </span>
  );
};

export const AuditTable: React.FC = () => {
  const events = useAuditStore((state) => state.getFilteredEvents());

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileText className="w-16 h-16 text-white/20 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">No audit events found</h3>
        <p className="text-white/60">Adjust your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-white/60 text-sm">
            <th className="p-4 font-medium">Timestamp</th>
            <th className="p-4 font-medium">Event Type</th>
            <th className="p-4 font-medium">User</th>
            <th className="p-4 font-medium">Risk Level</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, idx) => (
            <motion.tr 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={event.id} 
              className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
            >
              <td className="p-4 text-sm text-white/70">
                {new Date(event.timestamp).toLocaleString()}
              </td>
              <td className="p-4 text-sm font-medium text-white">{event.eventType}</td>
              <td className="p-4 text-sm text-white/90">{event.user}</td>
              <td className="p-4 text-sm">
                <RiskBadge level={event.riskLevel} />
              </td>
              <td className="p-4 text-sm">
                <StatusBadge status={event.status} />
              </td>
              <td className="p-4 text-right">
                <Link href={`/audit/${event.id}`} className="text-violet-400 hover:text-violet-300 inline-flex items-center text-sm font-medium transition-colors opacity-0 group-hover:opacity-100">
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
