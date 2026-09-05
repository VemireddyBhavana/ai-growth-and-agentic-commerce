'use client';
import React from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import { useAuditStore } from '@/stores/auditStore';
import { toast } from 'sonner';

export const ExportControls: React.FC = () => {
  const events = useAuditStore((state) => state.getFilteredEvents());

  const handlePrint = () => {
    toast.info('Preparing print document...');
    window.print();
  };

  const handleExportCSV = () => {
    if (!events || events.length === 0) {
      toast.error('No audit records to export');
      return;
    }

    const headers = [
      'ID',
      'Timestamp',
      'Event Type',
      'User',
      'Order ID',
      'Payment ID',
      'Status',
      'Risk Level',
      'Confidence Score'
    ];

    const rows = events.map((e) => [
      `"${e.id}"`,
      `"${new Date(e.timestamp).toISOString()}"`,
      `"${e.eventType}"`,
      `"${e.user}"`,
      `"${e.orderId || ''}"`,
      `"${e.paymentId || ''}"`,
      `"${e.status}"`,
      `"${e.riskLevel}"`,
      `"${e.confidenceScore}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit-trail-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${events.length} audit records to CSV`);
  };

  const handleExportPDF = () => {
    toast.info('Opening print dialog for PDF export (Choose "Save as PDF")...');
    window.print();
  };

  return (
    <div className="flex space-x-2">
      <button 
        onClick={handleExportCSV}
        className="flex items-center text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors text-white/80 hover:text-white active:scale-95 cursor-pointer"
        title="Export CSV"
      >
        <Download className="w-4 h-4 mr-1.5" />
        CSV
      </button>
      <button 
        onClick={handleExportPDF}
        className="flex items-center text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors text-white/80 hover:text-white active:scale-95 cursor-pointer"
        title="Export PDF"
      >
        <FileText className="w-4 h-4 mr-1.5" />
        PDF
      </button>
      <button 
        onClick={handlePrint}
        className="flex items-center text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors text-white/80 hover:text-white active:scale-95 cursor-pointer"
        title="Print Report"
      >
        <Printer className="w-4 h-4 mr-1.5" />
        Print
      </button>
    </div>
  );
};
