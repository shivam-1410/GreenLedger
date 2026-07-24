'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getExplorerTxUrl, truncateAddress } from '@/lib/utils';
import { ExternalLink, CheckCircle2, XCircle, Loader2, Sparkles, X } from 'lucide-react';
import { Button } from './ui/button';

export function TransactionTracker() {
  const { transactions } = useAppStore();
  const activeTxs = transactions.slice(0, 3); // Show top 3 recent transactions

  if (activeTxs.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-md w-full space-y-2.5 px-4 pointer-events-auto">
      {activeTxs.map((tx) => (
        <div
          key={tx.id}
          className={`p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-5 ${
            tx.status === 'pending' || tx.status === 'building' || tx.status === 'signing'
              ? 'bg-slate-900/90 border-emerald-500/50 text-slate-100 shadow-emerald-950/40'
              : tx.status === 'success'
              ? 'bg-emerald-950/90 border-emerald-400/60 text-emerald-100 shadow-emerald-950/60'
              : 'bg-red-950/90 border-red-500/60 text-red-100 shadow-red-950/60'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
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
                  <h4 className="text-sm font-semibold text-white">{tx.title}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300">
                    {tx.status}
                  </span>
                </div>

                {tx.hash && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-300/90 font-mono">
                    <span>Tx Hash: {truncateAddress(tx.hash, 6)}</span>
                    <a
                      href={getExplorerTxUrl(tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 hover:underline text-emerald-400"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {tx.error && (
                  <p className="text-xs text-red-300 mt-1 font-sans">{tx.error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
