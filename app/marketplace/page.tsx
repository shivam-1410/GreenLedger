'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useWalletStore } from '@/store/useWalletStore';
import { CreditCard } from '@/components/credit-card';
import { BuyDialog } from '@/components/buy-dialog';
import { RetireDialog } from '@/components/retire-dialog';
import { MintDialog } from '@/components/mint-dialog';
import { WalletModal } from '@/components/wallet-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { CarbonCredit, CreditType } from '@/types';
import { Search, PlusCircle, Filter, ShoppingBag, Trees, Sparkles } from 'lucide-react';

export default function MarketplacePage() {
  const { projects, userInventory } = useAppStore();
  const { isConnected } = useWalletStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('All');
  const [isMintOpen, setIsMintOpen] = useState(false);
  const [selectedBuyCredit, setSelectedBuyCredit] = useState<CarbonCredit | null>(null);
  const [selectedRetireCredit, setSelectedRetireCredit] = useState<CarbonCredit | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const categories = ['All', 'Reforestation', 'Solar Energy', 'Blue Carbon', 'Direct Air Capture'];

  const filteredProjects = projects.filter((p) => {
    const matchesTab = activeTab === 'All' || p.creditType === activeTab;
    const matchesSearch =
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.creditType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getOwnedAmount = (creditId: string) => {
    const inv = userInventory.find((i) => i.creditId === creditId);
    return inv ? inv.amount : 0;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShoppingBag className="h-4 w-4" /> Open Carbon Credit Marketplace
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Browse & Trade Carbon Credits</h1>
          <p className="text-sm text-slate-400">
            Verified climate projects backed by Soroban smart contract tokens on Stellar Testnet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="glow"
            onClick={() => {
              if (!isConnected) {
                setIsWalletModalOpen(true);
              } else {
                setIsMintOpen(true);
              }
            }}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Mint Credit Project</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search project name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Grid of Credit Cards */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((credit) => (
            <CreditCard
              key={credit.id}
              credit={credit}
              userOwnedAmount={getOwnedAmount(credit.id)}
              onBuy={(c) => setSelectedBuyCredit(c)}
              onRetire={(c) => setSelectedRetireCredit(c)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
          <Trees className="h-12 w-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">No Carbon Credit Projects Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No active project listings matched your search criteria. Try adjusting filters or minting a new project.
          </p>
        </div>
      )}

      {/* Modals */}
      <MintDialog isOpen={isMintOpen} onClose={() => setIsMintOpen(false)} />

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
