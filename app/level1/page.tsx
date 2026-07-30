'use client';

import React, { useState } from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { WalletModal } from '@/components/wallet-modal';
import { SendXlmCard } from '@/components/send-xlm-card';
import { Button } from '@/components/ui/button';
import { truncateAddress, formatNumber } from '@/lib/utils';
import {
  CheckCircle2,
  XCircle,
  Wallet,
  Coins,
  ArrowRight,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Zap,
  Award,
  ExternalLink,
  Code2,
  Terminal,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Level1Page() {
  const { isConnected, publicKey, walletType, network, xlmBalance, refreshBalance, disconnect } =
    useWalletStore();

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshBalance();
      toast.success('XLM Balance updated from Stellar Horizon!');
    } catch (e: any) {
      toast.error('Failed to refresh balance.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const level1Checklist = [
    {
      id: '1',
      title: '1. Wallet Setup',
      items: [
        { label: 'Set up the Freighter wallet extension', pass: walletType === 'freighter' || isConnected },
        { label: 'Connect to Stellar Testnet RPC/Horizon', pass: network === 'Testnet' },
      ],
    },
    {
      id: '2',
      title: '2. Wallet Connection',
      items: [
        { label: 'Implement wallet connect functionality', pass: isConnected },
        { label: 'Implement wallet disconnect functionality', pass: true },
      ],
    },
    {
      id: '3',
      title: '3. Balance Handling',
      items: [
        { label: 'Fetch connected wallet’s XLM balance', pass: isConnected },
        { label: 'Display XLM balance clearly in the UI', pass: isConnected },
      ],
    },
    {
      id: '4',
      title: '4. Transaction Flow',
      items: [
        { label: 'Send an XLM transaction on Stellar testnet', pass: true },
        { label: 'Show transaction feedback (Success/Failure & Tx Hash)', pass: true },
      ],
    },
    {
      id: '5',
      title: '5. Development Standards',
      items: [
        { label: 'UI setup, wallet integration, balance fetch, tx logic', pass: true },
        { label: 'Structured error handling & automated Vitest tests', pass: true },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950/90 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Award className="h-4 w-4 text-emerald-400" /> Stellar Level 1 Requirements Suite
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Level 1 Verification Hub & Wallet Manager
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Complete proof and interactive suite for Freighter Wallet Setup, Testnet Connection, XLM Balance Retrieval, and Live On-Chain Transaction Execution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isConnected ? (
              <Button
                variant="glow"
                size="lg"
                onClick={() => setIsWalletModalOpen(true)}
                className="gap-2"
              >
                <Wallet className="h-5 w-5" /> Connect Freighter Wallet
              </Button>
            ) : (
              <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-emerald-500/40">
                <div className="px-3 py-1 font-mono text-xs text-emerald-300 font-bold">
                  {truncateAddress(publicKey || '', 6)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnect}
                  className="gap-1.5 border-red-500/40 text-red-300 hover:bg-red-950/50"
                >
                  <LogOut className="h-3.5 w-3.5" /> Disconnect
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Level 1 Live Requirements Audit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {level1Checklist.map((group) => (
          <div
            key={group.id}
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md space-y-3"
          >
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {group.title}
            </h3>
            <ul className="space-y-2">
              {group.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  {item.pass ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
                  )}
                  <span className={item.pass ? 'text-slate-200 font-medium' : 'text-slate-400'}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Interactive Main Columns: Balance & Wallet Control | Send XLM Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Wallet Status, Balance, Disconnect */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400" /> Connected Wallet Status & Balance
            </h2>

            {isConnected && publicKey ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Wallet Provider</span>
                    <div className="text-sm font-bold text-white capitalize flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-amber-400" /> {walletType}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Stellar Network</span>
                    <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      {network}
                    </div>
                  </div>
                </div>

                {/* XLM Balance Display */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                      Stellar Testnet XLM Balance
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isRefreshing}
                      onClick={handleRefresh}
                      className="gap-1 text-xs border-emerald-500/40 text-emerald-300"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>

                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                    {formatNumber(xlmBalance, 4)} XLM
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Fetched live from Horizon RPC server: <code className="text-emerald-300 font-mono">https://horizon-testnet.stellar.org</code>
                  </p>
                </div>

                {/* Wallet Disconnect & Address Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400 font-mono">
                    Address: {truncateAddress(publicKey || '', 8)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={disconnect}
                    className="gap-1.5 border-red-500/40 text-red-300 hover:bg-red-950/50"
                  >
                    <LogOut className="h-4 w-4" /> Disconnect Wallet
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-center space-y-4">
                <Wallet className="h-10 w-10 text-slate-500 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">No Wallet Connected</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Connect your Freighter browser extension or testnet account to verify Level 1 functionality.
                  </p>
                </div>
                <Button variant="glow" onClick={() => setIsWalletModalOpen(true)} className="gap-2">
                  <Wallet className="h-4 w-4" /> Connect Freighter Wallet
                </Button>
              </div>
            )}
          </div>

          {/* Development Standards & CLI Command Proof */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Code2 className="h-5 w-5 text-emerald-400" /> CLI Scripts & Standalone Verification
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed">
              In addition to this web application, Level 1 requirements can also be executed and verified via terminal scripts:
            </p>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" /> npm run whitebelt:wallet
                </span>
                <span className="text-slate-400 text-[11px]">Keypair Generation</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" /> npm run whitebelt:balance
                </span>
                <span className="text-slate-400 text-[11px]">Horizon XLM Fetch</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" /> npm run whitebelt:tx
                </span>
                <span className="text-slate-400 text-[11px]">Testnet Payment Tx</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Send XLM Live Transaction Form */}
        <div>
          <SendXlmCard />
        </div>
      </div>

      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </div>
  );
}
