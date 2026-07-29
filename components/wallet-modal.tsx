'use client';

import React, { useState } from 'react';
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';
import { useWalletStore } from '@/store/useWalletStore';
import { FREIGHTER_ID, ALBEDO_ID, XBULL_ID } from '@/lib/wallet';
import { Wallet, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WALLET_OPTIONS = [
  {
    id: FREIGHTER_ID,
    name: 'Freighter Wallet',
    description: 'Popular official Stellar browser extension wallet',
    icon: '⚡',
    recommended: true,
  },
  {
    id: ALBEDO_ID,
    name: 'Albedo',
    description: 'Web-based webauthn wallet, no extension required',
    icon: '🌐',
    recommended: false,
  },
  {
    id: XBULL_ID,
    name: 'xBull Wallet',
    description: 'Feature-rich multi-platform wallet for Stellar',
    icon: '🐂',
    recommended: false,
  },
  {
    id: 'demo',
    name: 'Quick Connect (Testnet)',
    description: 'Instant 1-click Testnet account for fast testing & demoing',
    icon: '🚀',
    recommended: false,
  },
];

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect, isConnecting, error, clearError } = useWalletStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectWallet = async (walletId: string) => {
    setSelectedId(walletId);
    clearError();
    try {
      await connect(walletId);
      toast.success('Wallet connected successfully!');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Could not connect wallet');
    } finally {
      setSelectedId(null);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Connect Stellar Wallet"
      description="Choose your preferred wallet provider to interact with Soroban Smart Contracts on Stellar."
    >
      <div className="space-y-3 my-4">
        {WALLET_OPTIONS.map((w) => (
          <button
            key={w.id}
            disabled={isConnecting}
            onClick={() => handleSelectWallet(w.id)}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-700/60 bg-slate-850/60 hover:bg-emerald-950/40 hover:border-emerald-500/50 transition-all text-left group disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl p-2 rounded-lg bg-slate-800 border border-slate-700/50 group-hover:scale-110 transition-transform">
                {w.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-100 group-hover:text-emerald-300">
                    {w.name}
                  </span>
                  {w.recommended && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{w.description}</p>
              </div>
            </div>

            {isConnecting && selectedId === w.id ? (
              <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
            ) : (
              <Wallet className="h-5 w-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 my-3">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="pt-2 border-t border-slate-800/80 text-center">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Secure multi-wallet integration via StellarWalletsKit
        </p>
      </div>
    </Dialog>
  );
}
