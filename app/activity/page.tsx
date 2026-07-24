'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { truncateAddress, formatTimestamp, getExplorerTxUrl } from '@/lib/utils';
import { Activity, ExternalLink, PlusCircle, ShoppingCart, Flame, Tag, Radio } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ActivityPage() {
  const { events } = useAppStore();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredEvents = events.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'mint':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
            <PlusCircle className="h-3.5 w-3.5" /> Minted Credit
          </span>
        );
      case 'buy':
        return (
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1">
            <ShoppingCart className="h-3.5 w-3.5" /> Bought Credit
          </span>
        );
      case 'retire':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" /> Retired CO2
          </span>
        );
      case 'list':
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1">
            <Tag className="h-3.5 w-3.5" /> Listed on Market
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Activity className="h-4 w-4" /> Contract Event Stream
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Real-Time Event Stream</h1>
          <p className="text-sm text-slate-400">
            Live event logs queried directly from Soroban contract interactions on Stellar.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
          <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span>Live Polling Active</span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'mint', 'buy', 'retire', 'list'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filterType === type
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Event Feed List */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getEventBadge(evt.type)}</div>
              <div>
                <h3 className="text-sm font-bold text-white">{evt.projectName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Wallet: <span className="font-mono text-emerald-300">{truncateAddress(evt.walletAddress)}</span>
                  {evt.amount && <span> • Quantity: {evt.amount} Tons</span>}
                  {evt.priceXlm && <span> • Price: {evt.priceXlm} XLM/Ton</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
              <span className="text-slate-500">{formatTimestamp(evt.timestamp)}</span>
              <a
                href={getExplorerTxUrl(evt.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
              >
                <span>{truncateAddress(evt.txHash, 4)}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
