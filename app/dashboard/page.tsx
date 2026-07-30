'use client';

import React, { useState } from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { useAppStore } from '@/store/useAppStore';
import { WalletModal } from '@/components/wallet-modal';
import { RetireDialog } from '@/components/retire-dialog';
import { SendXlmCard } from '@/components/send-xlm-card';
import { Button } from '@/components/ui/button';
import { formatNumber, truncateAddress, formatTimestamp, getExplorerAccountUrl } from '@/lib/utils';
import { CarbonCredit } from '@/types';
import {
  Wallet,
  Award,
  Trees,
  Flame,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { isConnected, publicKey, xlmBalance, network, refreshBalance } = useWalletStore();
  const { userInventory, projects, retirements } = useAppStore();

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [selectedRetireCredit, setSelectedRetireCredit] = useState<CarbonCredit | null>(null);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      toast.success('Address copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const userPortfolio = userInventory
    .map((inv) => {
      const project = projects.find((p) => p.id === inv.creditId);
      return {
        ...inv,
        project,
      };
    })
    .filter((item) => item.project !== undefined);

  const totalOwnedTons = userInventory.reduce((acc, i) => acc + i.amount, 0);
  const totalRetiredTons = retirements.reduce((acc, r) => acc + r.amount, 0);

  if (!isConnected || !publicKey) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6">
        <div className="h-16 w-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
          <Wallet className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Wallet Dashboard</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Connect your Stellar wallet (Freighter, Albedo, xBull) to view your carbon credit portfolio and retirement badges.
        </p>
        <Button variant="glow" onClick={() => setIsWalletModalOpen(true)} className="gap-2">
          <Wallet className="h-4 w-4" /> Connect Wallet
        </Button>
        <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Widget */}
      <div className="p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950/90 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg">
              ST
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg font-mono">
                  {truncateAddress(publicKey, 6)}
                </span>
                <button
                  onClick={copyAddress}
                  className="text-slate-400 hover:text-emerald-300 transition-colors p-1"
                  title="Copy address"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
                <a
                  href={getExplorerAccountUrl(publicKey)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-emerald-300 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Network: {network}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshBalance()}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh Balance
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">XLM Balance</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
              {formatNumber(xlmBalance, 2)} XLM
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">Owned Credit Tokens</span>
            <div className="text-2xl font-bold text-white font-mono mt-1">
              {formatNumber(totalOwnedTons)} Tons
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30">
            <span className="text-xs text-amber-400 uppercase font-semibold">Retired CO2 Offset</span>
            <div className="text-2xl font-bold text-amber-300 font-mono mt-1">
              {formatNumber(totalRetiredTons)} Tons
            </div>
          </div>
        </div>
      </div>

      {/* Level 1 Direct XLM Payment Section */}
      <SendXlmCard />

      {/* Owned Credit Inventory */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Trees className="h-5 w-5 text-emerald-400" /> Active Carbon Credit Inventory
        </h2>

        {userPortfolio.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userPortfolio.map((item) => (
              <div
                key={item.creditId}
                className="p-5 rounded-xl border border-emerald-500/30 bg-slate-900/80 backdrop-blur-md flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-emerald-400 uppercase">
                    {item.project?.creditType}
                  </span>
                  <h3 className="font-bold text-white text-base">{item.project?.projectName}</h3>
                  <p className="text-xs text-slate-400">
                    Owned Balance:{' '}
                    <span className="font-mono font-bold text-emerald-300 text-sm">{item.amount} Tons</span>
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRetireCredit(item.project!)}
                  className="gap-1.5 border-amber-500/40 text-amber-300 hover:bg-amber-950/50"
                >
                  <Flame className="h-4 w-4" /> Retire Tons
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 text-center text-xs text-slate-400">
            No carbon credit tokens in your wallet. Purchase credits from the Marketplace.
          </div>
        )}
      </div>

      {/* Retirement Certificates */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-400" /> Cryptographic Retirement Certificates
        </h2>

        {retirements.length > 0 ? (
          <div className="space-y-3">
            {retirements.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-xl border border-amber-500/30 bg-slate-900/90 backdrop-blur-md space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Certificate #{cert.id}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{cert.projectName}</h3>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-mono font-bold text-amber-400">
                      {cert.amount} Tons CO2 Offset
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      {formatTimestamp(cert.timestamp)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-slate-400 block font-semibold">Retirement Note / Reason:</span>
                  <p className="text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-sans">
                    "{cert.reason}"
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span className="truncate max-w-[280px]">Hash: {cert.certificateHash}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified Soroban Event
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 text-center text-xs text-slate-400">
            No retirement certificates issued yet. Retire carbon credits to generate offset certificates.
          </div>
        )}
      </div>

      <RetireDialog
        credit={selectedRetireCredit}
        isOpen={!!selectedRetireCredit}
        onClose={() => setSelectedRetireCredit(null)}
      />
    </div>
  );
}
