'use client';
import React from 'react';
import { Download, FileText, Printer } from 'lucide-react';

export const ExportControls: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    alert("Exporting CSV (Mocked)");
  };

  const handleExportPDF = () => {
    alert("Exporting PDF (Mocked)");
  };

  return (
    <div className="flex space-x-2">
      <button 
        onClick={handleExportCSV}
        className="flex items-center text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors text-white/80 hover:text-white"
        title="Export CSV"
      >
        <Download className="w-4 h-4 mr-1.5" />
        CSV
      </button>
      <button 
        onClick={handleExportPDF}
        className="flex items-center text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors text-white/80 hover:text-white"
        title="Export PDF"
      >
        <FileText className="w-4 h-4 mr-1.5" />
        PDF
      </button>
      <button 
        onClick={handlePrint}
        className="flex items-center text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors text-white/80 hover:text-white"
        title="Print Report"
      >
        <Printer className="w-4 h-4 mr-1.5" />
        Print
      </button>
    </div>
  );
};
