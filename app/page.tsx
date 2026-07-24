'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { useWalletStore } from '@/store/useWalletStore';
import { CreditCard } from '@/components/credit-card';
import { BuyDialog } from '@/components/buy-dialog';
import { RetireDialog } from '@/components/retire-dialog';
import { WalletModal } from '@/components/wallet-modal';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/utils';
import { CarbonCredit } from '@/types';
import {
  Leaf,
  ShieldCheck,
  Zap,
  Award,
  ArrowRight,
  TrendingUp,
  Globe,
  Trees,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const { projects, stats, userInventory } = useAppStore();
  const { isConnected } = useWalletStore();

  const [selectedBuyCredit, setSelectedBuyCredit] = useState<CarbonCredit | null>(null);
  const [selectedRetireCredit, setSelectedRetireCredit] = useState<CarbonCredit | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const getOwnedAmount = (creditId: string) => {
    const inv = userInventory.find((i) => i.creditId === creditId);
    return inv ? inv.amount : 0;
  };

  return (
    <div className="space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Glowing Orb Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-6 backdrop-blur-md shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Production-Ready Stellar Level 2 DApp</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
            Trade & Retire Verified Carbon Credits on{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              Stellar Soroban
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            GreenLedger brings transparent carbon offset trading, verified project minting, and tamper-proof retirement certificates to the open Stellar blockchain.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/marketplace">
              <Button variant="glow" size="lg" className="w-full sm:w-auto gap-2 text-base">
                <span>Explore Marketplace</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>

            {!isConnected && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWalletModalOpen(true)}
                className="w-full sm:w-auto text-base"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* DYNAMIC STATS COUNTER BAR */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-emerald-500/30 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total CO2 Offset</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              {formatNumber(stats.totalCo2OffsetTons)} Tons
            </div>
            <span className="text-[11px] text-slate-500">Verified Climate Impact</span>
          </div>

          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs text-slate-400 uppercase font-semibold">Minted Projects</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats.totalCreditsMinted} Projects
            </div>
            <span className="text-[11px] text-slate-500">On-Chain Smart Contracts</span>
          </div>

          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs text-slate-400 uppercase font-semibold">Active Listings</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono">
              {stats.totalActiveListings} Pools
            </div>
            <span className="text-[11px] text-slate-500">Peer-to-Peer Trading</span>
          </div>

          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs text-slate-400 uppercase font-semibold">Marketplace Volume</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">
              {formatNumber(stats.totalVolumeXlm)} XLM
            </div>
            <span className="text-[11px] text-slate-500">Sub-second Stellar Settlement</span>
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="container mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">Built for Next-Gen Climate Finance</h2>
          <p className="text-sm text-slate-400">
            Powered by high-performance Rust Soroban contracts and multi-wallet browser integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-emerald-500/20 bg-slate-900/60 backdrop-blur-md space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Soroban Smart Contracts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decentralized state storage for credits, listings, balances, and retirement records with instant confirmation times and near-zero gas fees.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-emerald-500/20 bg-slate-900/60 backdrop-blur-md space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Verified Environmental Assets</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every carbon credit project records vintage year, sector, IPFS registry certificate links, and total available supply on-chain.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-emerald-500/20 bg-slate-900/60 backdrop-blur-md space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Permanent Offset Certificates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Burn credits to offset emissions. Soroban emits cryptographic SHA-256 certificate hashes to prove irreversible CO2 retirement.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED MARKETPLACE TEASER */}
      <section className="container mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Active Marketplace Projects</h2>
            <p className="text-xs text-slate-400">Browse verified carbon offset pools available for trade</p>
          </div>
          <Link href="/marketplace">
            <Button variant="outline" size="sm" className="gap-1.5">
              <span>View All Projects</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((credit) => (
            <CreditCard
              key={credit.id}
              credit={credit}
              userOwnedAmount={getOwnedAmount(credit.id)}
              onBuy={(c) => setSelectedBuyCredit(c)}
              onRetire={(c) => setSelectedRetireCredit(c)}
            />
          ))}
        </div>
      </section>

      {/* MODALS */}
      <BuyDialog
        credit={selectedBuyCredit}
        isOpen={!!selectedBuyCredit}
        onClose={() => setSelectedBuyCredit(null)}
      />

      <RetireDialog
        credit={selectedRetireCredit}
        isOpen={!!selectedRetireCredit}
        onClose={() => setSelectedRetireCredit(null)}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  );
}
