'use client';

import React, { useState } from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { useAppStore } from '@/store/useAppStore';
import { Button } from './ui/button';
import { buildXlmPaymentTxXdr, submitHorizonTransaction, fundAccountWithFriendbot } from '@/lib/stellar';
import { truncateAddress, getExplorerTxUrl, formatNumber } from '@/lib/utils';
import {
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Coins,
  Sparkles,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

export function SendXlmCard() {
  const { isConnected, publicKey, walletType, xlmBalance, refreshBalance, signTx } = useWalletStore();
  const { addTransaction, updateTransaction } = useAppStore();

  const [destination, setDestination] = useState('GBV2X5Z6P7E5K3J7X9P02L9R4E91M822GBC4M822GDA7KL9P0');
  const [amount, setAmount] = useState('10');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [lastResult, setLastResult] = useState<{
    status: 'success' | 'failed';
    hash?: string;
    error?: string;
  } | null>(null);

  const handleFundFriendbot = async () => {
    if (!publicKey) return;
    setIsFunding(true);
    try {
      const ok = await fundAccountWithFriendbot(publicKey);
      if (ok) {
        toast.success('Successfully requested 10,000 Testnet XLM from Friendbot!');
        await refreshBalance();
      } else {
        toast.error('Friendbot request failed. Account may already be funded.');
      }
    } catch (err: any) {
      toast.error('Friendbot request error: ' + (err.message || 'Unknown error'));
    } finally {
      setIsFunding(false);
    }
  };

  const handleSendXlm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !publicKey) {
      toast.error('Please connect your Freighter wallet first.');
      return;
    }

    if (!destination || destination.trim().length < 50 || !destination.startsWith('G')) {
      toast.error('Please enter a valid Stellar G... public key address.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid XLM amount greater than 0.');
      return;
    }

    setIsSubmitting(true);
    setLastResult(null);

    const txId = addTransaction({
      title: `Send ${amount} XLM to ${truncateAddress(destination, 4)}`,
      status: 'pending',
    });

    try {
      // 1. Build payment transaction XDR
      toast.info('Building payment transaction XDR...');
      const xdr = await buildXlmPaymentTxXdr(publicKey, destination.trim(), amount);

      // 2. Sign transaction via Freighter / connected wallet
      updateTransaction(txId, { status: 'signing' });
      toast.info(`Please approve transaction in your ${walletType === 'freighter' ? 'Freighter' : walletType} wallet...`);
      const signedXdr = await signTx(xdr);

      // 3. Submit transaction to Stellar Testnet Horizon RPC
      updateTransaction(txId, { status: 'pending' });
      toast.info('Submitting signed transaction to Stellar Testnet Horizon...');
      const result = await submitHorizonTransaction(signedXdr);

      if (result.status === 'SUCCESS') {
        updateTransaction(txId, { status: 'success', hash: result.hash });
        setLastResult({
          status: 'success',
          hash: result.hash,
        });
        toast.success(`Transaction confirmed! Hash: ${truncateAddress(result.hash, 6)}`);
        await refreshBalance();
      } else {
        const errorMsg = result.error || 'Transaction failed on Stellar network';
        updateTransaction(txId, { status: 'failed', error: errorMsg });
        setLastResult({
          status: 'failed',
          error: errorMsg,
        });
        toast.error(`Transaction failed: ${errorMsg}`);
      }
    } catch (err: any) {
      console.error('Send XLM Error:', err);
      const errorMsg = err.message || 'Payment transaction aborted or failed';
      updateTransaction(txId, { status: 'failed', error: errorMsg });
      setLastResult({
        status: 'failed',
        error: errorMsg,
      });
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-emerald-500/30 bg-slate-900/90 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
            <Coins className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Send XLM Transaction <Sparkles className="h-4 w-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Level 1 Requirement: Execute native XLM payment on Stellar Testnet
            </p>
          </div>
        </div>

        {isConnected && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isFunding}
            onClick={handleFundFriendbot}
            className="gap-1.5 text-xs border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60"
            title="Fund wallet with 10,000 Testnet XLM via Friendbot"
          >
            {isFunding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />}
            Fund Friendbot
          </Button>
        )}
      </div>

      {!isConnected ? (
        <div className="p-6 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-center space-y-3">
          <Coins className="h-8 w-8 text-slate-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Wallet Not Connected</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Connect your Freighter wallet to execute native XLM testnet transactions and view live feedback.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSendXlm} className="space-y-4">
          {/* Current Balance Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Connected Address:</span>
              <span className="font-mono font-bold text-slate-200">{truncateAddress(publicKey || '', 6)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400">
                {formatNumber(xlmBalance, 2)} XLM
              </span>
              <button
                type="button"
                onClick={() => refreshBalance()}
                className="text-slate-400 hover:text-emerald-300 p-1"
                title="Refresh balance"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Destination Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Recipient Stellar Address (Public Key)
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="G..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Amount & Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Amount (XLM)
              </label>
              <div className="flex items-center gap-1.5">
                {['5', '10', '25', '50'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      amount === preset
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {preset} XLM
                  </button>
                ))}
              </div>
            </div>

            <input
              type="number"
              step="0.0000001"
              min="0.1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="glow"
            className="w-full gap-2 py-3 text-sm font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                <span>Signing & Submitting Tx...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send {amount} XLM on Stellar Testnet</span>
              </>
            )}
          </Button>

          {/* Transaction Feedback Banner */}
          {lastResult && (
            <div
              className={`p-4 rounded-xl border backdrop-blur-md space-y-2 animate-in fade-in slide-in-from-top-2 ${
                lastResult.status === 'success'
                  ? 'bg-emerald-950/90 border-emerald-400/60 text-emerald-100'
                  : 'bg-red-950/90 border-red-500/60 text-red-100'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {lastResult.status === 'success' ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span>Transaction Confirmed Successfully!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                    <span>Transaction Failed</span>
                  </>
                )}
              </div>

              {lastResult.hash && (
                <div className="flex items-center justify-between pt-1 border-t border-emerald-500/30 text-xs font-mono">
                  <span className="text-emerald-300">Tx Hash: {truncateAddress(lastResult.hash, 8)}</span>
                  <a
                    href={getExplorerTxUrl(lastResult.hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
                  >
                    View on StellarExpert <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              {lastResult.error && (
                <p className="text-xs text-red-300 pt-1 font-sans">{lastResult.error}</p>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
