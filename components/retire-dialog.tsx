'use client';

import React, { useState } from 'react';
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CarbonCredit } from '@/types';
import { useWalletStore } from '@/store/useWalletStore';
import { useAppStore } from '@/store/useAppStore';
import { Flame, Award, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RetireDialogProps {
  credit: CarbonCredit | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RetireDialog({ credit, isOpen, onClose }: RetireDialogProps) {
  const { isConnected, publicKey } = useWalletStore();
  const { retireCredits, addTransaction, updateTransaction, userInventory } = useAppStore();

  const [amount, setAmount] = useState<number>(5);
  const [reason, setReason] = useState<string>('Annual Enterprise Carbon Neutrality Offset');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!credit) return null;

  const invItem = userInventory.find((i) => i.creditId === credit.id);
  const ownedTons = invItem ? invItem.amount : 0;

  const handleRetire = async () => {
    if (!isConnected || !publicKey) {
      toast.error('Please connect your wallet first!');
      return;
    }

    if (amount <= 0 || amount > ownedTons) {
      toast.error(`You can only retire up to ${ownedTons} owned carbon credit tons.`);
      return;
    }

    if (!reason.trim()) {
      toast.error('Please specify a retirement reason / certificate notes.');
      return;
    }

    setIsSubmitting(true);
    const txId = addTransaction({
      title: `Retire ${amount} CO2 Tons (${credit.projectName})`,
      status: 'pending',
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2200));

      const certHash = retireCredits(credit.id, amount, publicKey, reason);

      updateTransaction(txId, {
        status: 'success',
        hash: certHash,
      });

      toast.success(`Carbon credits retired! Certificate generated.`);
      onClose();
    } catch (err: any) {
      updateTransaction(txId, {
        status: 'failed',
        error: err.message || 'Retirement execution failed',
      });
      toast.error(err.message || 'Failed to retire carbon credits');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Retire Carbon Credits (Burn & Offset)"
      description="Permanently retire carbon credit tokens on-chain to offset carbon emissions and issue a tamper-proof certificate."
    >
      <div className="space-y-4 my-3 text-slate-200">
        <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 text-xs space-y-1">
          <div className="font-semibold text-amber-400 flex items-center gap-1.5">
            <Flame className="h-4 w-4" /> {credit.projectName}
          </div>
          <div className="text-slate-400">
            Owned Inventory: <span className="text-emerald-400 font-bold">{ownedTons} Tons</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Tons to Permanently Burn & Offset
          </label>
          <Input
            type="number"
            min={1}
            max={ownedTons || 100}
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
            placeholder="Tons to burn"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Retirement Reason / Certificate Note
          </label>
          <Input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Scope 1 & 2 Emissions Offset 2024"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 space-y-1">
          <div className="font-semibold flex items-center gap-1">
            <Award className="h-4 w-4 text-amber-400" /> Irreversible Burn Notice
          </div>
          <p className="text-[11px] text-amber-300/80">
            Retiring carbon credits permanently removes them from circulation. A cryptographically verifiable SHA-256 certificate hash will be recorded in the Soroban ledger.
          </p>
        </div>

        {!isConnected && (
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Connect your wallet to sign & execute credit retirement.</span>
          </div>
        )}

        <Button
          variant="default"
          onClick={handleRetire}
          disabled={isSubmitting || !isConnected || ownedTons === 0}
          className="w-full h-11 text-base bg-amber-600 hover:bg-amber-500 text-white gap-2 shadow-amber-950/50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Burning & Generating Certificate...
            </>
          ) : (
            <>
              <Flame className="h-5 w-5" /> Execute Permanent Retirement
            </>
          )}
        </Button>
      </div>
    </Dialog>
  );
}
