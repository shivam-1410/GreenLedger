'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useWalletStore } from '@/store/useWalletStore';
import { MarketplaceCarousel } from '@/components/marketplace-carousel';
import { BuyDialog } from '@/components/buy-dialog';
import { RetireDialog } from '@/components/retire-dialog';
import { MintDialog } from '@/components/mint-dialog';
import { WalletModal } from '@/components/wallet-modal';
import { Button } from '@/components/ui/button';
import { CarbonCredit } from '@/types';
import { PlusCircle, ShoppingBag } from 'lucide-react';

export default function MarketplacePage() {
  const { projects, userInventory } = useAppStore();
  const { isConnected } = useWalletStore();

  const [isMintOpen, setIsMintOpen] = useState(false);
  const [selectedBuyCredit, setSelectedBuyCredit] = useState<CarbonCredit | null>(null);
  const [selectedRetireCredit, setSelectedRetireCredit] = useState<CarbonCredit | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

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

      {/* Swipeable Carousel & Filter Component */}
      <MarketplaceCarousel
        projects={projects}
        userInventory={userInventory}
        onBuy={(c) => setSelectedBuyCredit(c)}
        onRetire={(c) => setSelectedRetireCredit(c)}
      />

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
