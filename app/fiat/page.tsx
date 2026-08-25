'use client';

import React, { useState } from 'react';
import { SUPPORTED_FIAT_ANCHORS, initiateSEP24Transaction, FiatAnchorInfo, SEP24TransactionResponse } from '@/lib/sep24';
import { useWalletStore } from '@/store/useWalletStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  Banknote,
  ArrowRightLeft,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  DollarSign,
  Euro,
  Building2,
  Lock,
  Wallet,
} from 'lucide-react';

export default function FiatPage() {
  const { isConnected, publicKey } = useWalletStore();
  const [anchors] = useState<FiatAnchorInfo[]>(SUPPORTED_FIAT_ANCHORS);
  const [selectedAnchor, setSelectedAnchor] = useState<FiatAnchorInfo>(anchors[0]);
  const [transType, setTransType] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState<number>(100);
  const [activeTx, setActiveTx] = useState<SEP24TransactionResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInitiateRamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey && !isConnected) {
      alert('Please connect your Stellar wallet first to use SEP-24 Anchor integration.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      try {
        const tx = initiateSEP24Transaction(
          selectedAnchor.id,
          transType,
          amount,
          publicKey || 'GAEQ5IUNQTW36XMQF6MR2VWKPG3JOF6IKEGAD2JQ6OUNKTUVBAIE5AO3'
        );
        setActiveTx(tx);
      } catch (err: any) {
        alert(err.message || 'Transaction initiation failed');
      } finally {
        setIsProcessing(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8 border-b border-emerald-500/20 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-emerald-950/60 text-emerald-400 border-emerald-500/40 gap-1.5 px-3 py-1">
              <Banknote className="h-3.5 w-3.5" />
              Stellar SEP-24 Protocol
            </Badge>
            <Badge variant="secondary" className="bg-teal-950 text-teal-300 border border-teal-500/30">
              Fiat On/Off Ramp
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
            Enterprise SEP-24 Fiat Anchor Gateway
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Seamlessly convert USD, EUR, and BRL bank transfers into Stellar stablecoins (USDC, EURC, BRLA) and Carbon-backed tokens via regulated SEP-24 anchors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Anchor Selector & Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl text-white font-bold flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5 text-emerald-400" />
                  Select SEP-24 Anchor Provider
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Choose a regulated fiat anchor provider on Stellar testnet/mainnet.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Anchor Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {anchors.map((anchor) => {
                    const isSelected = selectedAnchor.id === anchor.id;
                    return (
                      <div
                        key={anchor.id}
                        onClick={() => setSelectedAnchor(anchor)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/50'
                            : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white text-xs">{anchor.assetCode}</span>
                          <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                            {anchor.fiatCurrency}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-300 font-medium truncate">{anchor.name}</p>
                        <p className="text-[10px] text-slate-500 mt-2">
                          Fee: {anchor.depositFeePercent}% | Min ${anchor.minAmount}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Form */}
                <form onSubmit={handleInitiateRamp} className="space-y-5 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setTransType('deposit')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        transType === 'deposit'
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Deposit Fiat → Get {selectedAnchor.assetCode}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransType('withdraw')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        transType === 'withdraw'
                          ? 'bg-teal-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Withdraw {selectedAnchor.assetCode} → Get Fiat
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {transType === 'deposit' ? `Amount to Deposit (${selectedAnchor.fiatCurrency})` : `Amount to Withdraw (${selectedAnchor.assetCode})`}
                    </label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      min={selectedAnchor.minAmount}
                      max={selectedAnchor.maxAmount}
                      className="bg-slate-950 border-slate-800 text-white font-mono text-base focus:border-emerald-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Min: {selectedAnchor.minAmount} {selectedAnchor.fiatCurrency} | Max: {selectedAnchor.maxAmount} {selectedAnchor.fiatCurrency}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-6 gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <Banknote className="h-5 w-5" />
                    {isProcessing
                      ? 'Contacting SEP-24 Anchor Gateway...'
                      : `Initiate Interactive SEP-24 ${transType === 'deposit' ? 'Deposit' : 'Withdrawal'}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right: Active Transaction Interactive Webview Simulator */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-teal-400" />
                  SEP-24 Interactive Webview
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Simulated Stellar Anchor webview session response.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4">
                {activeTx ? (
                  <div className="space-y-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/40 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/50">
                        {activeTx.status.toUpperCase()}
                      </Badge>
                      <span className="font-mono text-[10px] text-slate-500">{activeTx.id}</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">You Send:</span>
                        <span className="font-mono font-bold text-white">{activeTx.amountIn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">You Receive:</span>
                        <span className="font-mono font-bold text-emerald-400">{activeTx.amountOut}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Stellar Hash:</span>
                        <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">{activeTx.stellarTxHash}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800">
                      <a
                        href={activeTx.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
                      >
                        Launch Anchor Interactive Webview
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
                    <Lock className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400 font-medium">No active SEP-24 transaction</p>
                    <p className="text-[11px] text-slate-500 mt-1">Initiate a deposit or withdrawal above to view interactive anchor session.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
