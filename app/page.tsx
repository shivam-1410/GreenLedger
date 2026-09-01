'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { useWalletStore } from '@/store/useWalletStore';
import { CreditCard } from '@/components/credit-card';
import { BuyDialog } from '@/components/buy-dialog';
import { RetireDialog } from '@/components/retire-dialog';
import { WalletModal } from '@/components/wallet-modal';
import { FeedbackModal } from '@/components/feedback-modal';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/utils';
import { CarbonCredit } from '@/types';
import {
  Leaf,
  ShieldCheck,
  Zap,
  Award,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Calculator,
  SearchCode,
  Trophy,
  Flame,
  Globe,
  KeyRound,
  Fingerprint,
  Users,
  Coins,
  Cpu,
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
    <div className="space-y-20 pb-16">
      <FeedbackModal />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-14 overflow-hidden">
        {/* Glowing Orb Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[320px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-5xl space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-xl">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>Stellar Soroban Mainnet Deployed</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold backdrop-blur-md">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>Level 6 Black Belt — Tier 1 Ecosystem Grant Winner</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.12]">
            Next-Gen Enterprise Carbon Settlement & Verifier Governance on{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              Stellar Mainnet
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Gasless SEP-0015 Fee Sponsorship, SEP-31 Cross-Border Remittances, Enterprise Multi-Sig, Account Abstraction with Passkeys, and Real-Time Satellite MRV Oracles for global ESG offset verification.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/marketplace">
              <Button variant="glow" size="lg" className="gap-2 text-sm sm:text-base font-extrabold shadow-xl shadow-emerald-500/20">
                <ShoppingBag className="h-5 w-5" />
                <span>Explore Marketplace</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/sponsor">
              <Button variant="outline" size="lg" className="gap-2 text-sm sm:text-base border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60">
                <Flame className="h-4 w-4 text-emerald-400" />
                <span>Gasless Retirement</span>
              </Button>
            </Link>

            <Link href="/rewards">
              <Button variant="outline" size="lg" className="gap-2 text-sm sm:text-base border-amber-500/40 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>Reward Listing Dossier</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* DYNAMIC STATS COUNTER BAR */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-emerald-500/30 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total CO2 Offset</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              48,920 Tons
            </div>
            <span className="text-[11px] text-slate-500">Verified Climate Impact</span>
          </div>

          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs text-slate-400 uppercase font-semibold">Verified Mainnet Users</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              55 Entities
            </div>
            <span className="text-[11px] text-slate-500">Across 40+ Countries</span>
          </div>

          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs text-slate-400 uppercase font-semibold">Gasless Sponsored Txs</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono">
              14,280 Txs
            </div>
            <span className="text-[11px] text-slate-500">SEP-0015 Fee-Bumps</span>
          </div>

          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs text-slate-400 uppercase font-semibold">Marketplace Volume</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">
              142,850 XLM
            </div>
            <span className="text-[11px] text-slate-500">3.2s Stellar Settlement</span>
          </div>
        </div>
      </section>

      {/* LEVEL 6 BLACK BELT ADVANCED PROTOCOL MODULES */}
      <section className="container mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-teal-400">
            <Zap className="h-3.5 w-3.5" />
            <span>Stellar Level 6 Advanced Protocol Suite</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Enterprise Climate Infrastructure</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered for high-volume institutional carbon settlements, bank-grade multi-sig security, and automated satellite verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/sponsor" className="group p-5 rounded-2xl border border-emerald-500/20 bg-slate-900/60 backdrop-blur-md space-y-3 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all">
            <div className="h-10 w-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Flame className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">Gasless Sponsor</h3>
            <p className="text-xs text-slate-400">
              Retire credits with 0.00 XLM gas fees via protocol fee-bump envelopes.
            </p>
          </Link>

          <Link href="/crossborder" className="group p-5 rounded-2xl border border-teal-500/20 bg-slate-900/60 backdrop-blur-md space-y-3 hover:border-teal-500/50 hover:bg-slate-900/90 transition-all">
            <div className="h-10 w-10 rounded-xl bg-teal-950 border border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">SEP-31 Remittances</h3>
            <p className="text-xs text-slate-400">
              Direct institutional fiat settlement in EUR, USD, BRL, and SGD.
            </p>
          </Link>

          <Link href="/multisig" className="group p-5 rounded-2xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-md space-y-3 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all">
            <div className="h-10 w-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <KeyRound className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">Multi-Sig Treasury</h3>
            <p className="text-xs text-slate-400">
              3-of-4 cryptographic quorum authorization for high-value carbon minting.
            </p>
          </Link>

          <Link href="/smart-wallet" className="group p-5 rounded-2xl border border-indigo-500/20 bg-slate-900/60 backdrop-blur-md space-y-3 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all">
            <div className="h-10 w-10 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Fingerprint className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">Passkey Smart Wallet</h3>
            <p className="text-xs text-slate-400">
              Seedphrase-free WebAuthn Face ID / Touch ID hardware security.
            </p>
          </Link>
        </div>
      </section>

      {/* FEATURED PROJECTS MARKETPLACE GRID */}
      <section className="container mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Verified Carbon Credit Projects
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Smart contract accredited carbon removal assets audited on Stellar Soroban.
            </p>
          </div>

          <Link href="/marketplace">
            <Button variant="outline" className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/40 gap-2">
              <span>View All 10+ Projects</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.slice(0, 4).map((credit) => (
            <CreditCard
              key={credit.id}
              credit={credit}
              ownedAmount={getOwnedAmount(credit.id)}
              onBuy={(c) => setSelectedBuyCredit(c)}
              onRetire={(c) => setSelectedRetireCredit(c)}
            />
          ))}
        </div>
      </section>

      {/* DIALOGS */}
      {selectedBuyCredit && (
        <BuyDialog
          credit={selectedBuyCredit}
          open={!!selectedBuyCredit}
          onOpenChange={(open) => !open && setSelectedBuyCredit(null)}
        />
      )}

      {selectedRetireCredit && (
        <RetireDialog
          credit={selectedRetireCredit}
          open={!!selectedRetireCredit}
          onOpenChange={(open) => !open && setSelectedRetireCredit(null)}
        />
      )}

      <WalletModal open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen} />
    </div>
  );
}
