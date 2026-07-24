'use client';

import React, { useState } from 'react';
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CarbonCredit } from '@/types';
import { useWalletStore } from '@/store/useWalletStore';
import { useAppStore } from '@/store/useAppStore';
import { formatNumber } from '@/lib/utils';
import { ShoppingCart, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BuyDialogProps {
  credit: CarbonCredit | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BuyDialog({ credit, isOpen, onClose }: BuyDialogProps) {
  const { isConnected, publicKey, xlmBalance } = useWalletStore();
  const { buyCredits, addTransaction, updateTransaction } = useAppStore();

  const [amount, setAmount] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!credit) return null;

  const totalCostXlm = amount * credit.pricePerTon;
  const hasEnoughBalance = xlmBalance >= totalCostXlm;

  const handleBuy = async () => {
    if (!isConnected || !publicKey) {
      toast.error('Please connect your wallet first!');
      return;
    }

    if (amount <= 0 || amount > credit.availableSupply) {
      toast.error('Invalid purchase amount requested');
      return;
    }

    if (!hasEnoughBalance) {
      toast.error('Insufficient XLM balance in your wallet');
      return;
    }

    setIsSubmitting(true);
    const txId = addTransaction({
      title: `Buy ${amount} Tons of ${credit.projectName}`,
      status: 'pending',
    });

    try {
      // Simulate Soroban contract invocation & ledger processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockTxHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      buyCredits(credit.id, amount, publicKey);

      updateTransaction(txId, {
        status: 'success',
        hash: mockTxHash,
      });

      toast.success(`Successfully purchased ${amount} carbon credit tons!`);
      onClose();
    } catch (err: any) {
      updateTransaction(txId, {
        status: 'failed',
        error: err.message || 'Transaction execution failed',
      });
      toast.error(err.message || 'Failed to complete credit purchase');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Purchase Verified Carbon Credits"
      description={`Acquire verified carbon credit tokens directly on Stellar Soroban.`}
    >
      <div className="space-y-4 my-3 text-slate-200">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
          <div className="font-semibold text-emerald-400">{credit.projectName}</div>
          <div className="flex justify-between text-slate-400">
            <span>Credit Type: {credit.creditType}</span>
            <span>Vintage: {credit.vintageYear}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Quantity (CO2 Tons to Buy)
          </label>
          <Input
            type="number"
            min={1}
            max={credit.availableSupply}
            value={amount}
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
            placeholder="Enter tons amount"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            Available in pool: {formatNumber(credit.availableSupply)} Tons
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Price per Ton:</span>
            <span className="font-mono text-slate-200">{formatNumber(credit.pricePerTon, 2)} XLM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Network Gas Fee:</span>
            <span className="font-mono text-slate-200">0.0000100 XLM</span>
          </div>
          <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold">
            <span className="text-white">Total XLM Cost:</span>
            <span className="font-mono text-emerald-400">{formatNumber(totalCostXlm, 2)} XLM</span>
          </div>
        </div>

        {!isConnected && (
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Connect your wallet to sign & execute this purchase.</span>
          </div>
        )}

        {isConnected && !hasEnoughBalance && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Your wallet balance ({formatNumber(xlmBalance, 2)} XLM) is lower than required cost.</span>
          </div>
        )}

        <Button
          variant="glow"
          onClick={handleBuy}
          disabled={isSubmitting || !isConnected || !hasEnoughBalance}
          className="w-full h-11 text-base gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Signing & Confirming on Stellar...
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" /> Confirm Purchase ({formatNumber(totalCostXlm, 2)} XLM)
            </>
          )}
        </Button>
      </div>
    </Dialog>
  );
}
