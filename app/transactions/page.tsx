'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { truncateAddress, formatTimestamp, getExplorerTxUrl } from '@/lib/utils';
import { History, ExternalLink, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function TransactionsPage() {
  const { transactions } = useAppStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTxs = transactions.filter((tx) => {
    if (statusFilter === 'all') return true;
    return tx.status === statusFilter;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <History className="h-4 w-4" /> Transaction Tracking
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">On-Chain Transaction Log</h1>
          <p className="text-sm text-slate-400">
            Track pending, successful, and failed Stellar Soroban smart contract transactions.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['all', 'success', 'pending', 'failed'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              statusFilter === st
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Transactions Table / List */}
      {filteredTxs.length > 0 ? (
        <div className="space-y-3">
          {filteredTxs.map((tx) => (
            <div
              key={tx.id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {tx.status === 'pending' || tx.status === 'building' || tx.status === 'signing' ? (
                    <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                  ) : tx.status === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{tx.title}</h3>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        tx.status === 'success'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : tx.status === 'failed'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">{formatTimestamp(tx.timestamp)}</p>
                  {tx.error && <p className="text-xs text-red-400 mt-1">{tx.error}</p>}
                </div>
              </div>

              {tx.hash && (
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
                  <span>Tx: {truncateAddress(tx.hash, 6)}</span>
                  <a
                    href={getExplorerTxUrl(tx.hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 text-xs text-slate-400">
          No transactions recorded in this session yet. Interact with the Marketplace to launch smart contract transactions.
        </div>
      )}
    </div>
  );
}
