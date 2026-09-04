import React from 'react';
import { SecurityDetails } from '@/types/audit';
import { Shield, ShieldCheck, ShieldAlert, Activity } from 'lucide-react';

export const SecurityPanel: React.FC<{ security: SecurityDetails }> = ({ security }) => {
  const isHighRisk = security.riskScore > 30;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isHighRisk ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
          {isHighRisk ? (
            <ShieldAlert className="w-5 h-5 text-red-400" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-green-400" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Security & Risk Analysis</h3>
          <p className={`text-sm ${isHighRisk ? 'text-red-400' : 'text-green-400'}`}>
            Risk Score: {security.riskScore}/100
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Fraud Check</p>
          <p className="font-medium text-white capitalize">{security.fraudCheckStatus}</p>
        </div>
        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Rule Engine Decision</p>
          <p className="font-medium text-white truncate" title={security.ruleEngineDecision}>{security.ruleEngineDecision}</p>
        </div>
        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Merchant Approval</p>
          <p className="font-medium text-white">
            {security.merchantApprovalRequired ? 'Required (Pending)' : 'Auto-Approved'}
          </p>
        </div>
        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
          <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1 flex items-center">
            <Activity className="w-3 h-3 mr-1" /> System Health
          </p>
          <p className="font-medium text-green-400">{security.systemHealth}</p>
        </div>
      </div>
    </div>
  );
};
