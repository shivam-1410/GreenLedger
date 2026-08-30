'use client';

import React, { useState } from 'react';
import { buildFeeSponsoredTransaction, FeeSponsorshipResult, PROTOCOL_FEE_SPONSOR_ACCOUNT } from '@/lib/fee_bump';
import { useWalletStore } from '@/store/useWalletStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  Flame,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Wallet,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SponsorPage() {
  const { isConnected, publicKey } = useWalletStore();
  const [retireTons, setRetireTons] = useState<number>(25);
  const [targetProject, setTargetProject] = useState('Amazon Biochar High-Density Reforestation (Project #1)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sponsorshipResult, setSponsorshipResult] = useState<FeeSponsorshipResult | null>(null);

  const handleExecuteSponsoredRetirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !publicKey) {
      toast.error('Please connect your Stellar wallet to execute gasless retirement.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const res = buildFeeSponsoredTransaction({
        innerTxXdr: `AAAAAInnerTxRetire${retireTons}TonsFor${publicKey.slice(0, 10)}`,
        userPublicKey: publicKey,
        operationType: 'RETIRE_CREDIT',
        baseFeeStroops: 100,
      });

      setSponsorshipResult(res);
      setIsProcessing(false);
      toast.success(`Gasless Fee-Bump Sponsored! ${retireTons} Tons of CO2 retired with 0.00 XLM gas fees paid by user.`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 border-b border-emerald-500/20 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-emerald-950/60 text-emerald-400 border-emerald-500/40 gap-1.5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" />
              Stellar Level 6 Advanced Feature
            </Badge>
            <Badge variant="secondary" className="bg-teal-950 text-teal-300 border border-teal-500/30">
              SEP-0015 Fee Sponsorship
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
            Gasless Carbon Retirement (Fee Sponsorship)
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Retire verified carbon credits and mint immutable cryptographic certificates with <strong>zero gas fees</strong>. The GreenLedger Protocol Fee Sponsor Account pays all on-chain Soroban fees via Stellar Fee-Bump envelopes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Interactive Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl text-white font-bold flex items-center gap-2">
                  <Flame className="h-5 w-5 text-emerald-400" />
                  Gasless Carbon Retirement Engine
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Zero XLM required in user wallet for transaction execution fees.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleExecuteSponsoredRetirement} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Target Project</label>
                    <Input
                      value={targetProject}
                      onChange={(e) => setTargetProject(e.target.value)}
                      className="bg-slate-950 border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tons of CO2 to Retire</label>
                    <Input
                      type="number"
                      value={retireTons}
                      onChange={(e) => setRetireTons(Number(e.target.value))}
                      min={1}
                      className="bg-slate-950 border-slate-800 text-white font-mono text-base focus:border-emerald-500"
                    />
                  </div>

                  {/* Gas Fee Sponsorship Comparison */}
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500 block">Standard User Gas Fee:</span>
                      <span className="font-mono text-red-400 line-through">0.0000200 XLM</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Your Net Gas Cost:</span>
                      <span className="font-mono text-emerald-400 font-bold text-base">0.0000000 XLM (FREE)</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-6 gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <Zap className="h-5 w-5" />
                    {isProcessing ? 'Generating Sponsored Fee-Bump Envelope...' : `Execute Gasless ${retireTons} Tons Retirement`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right: Fee Sponsor Account Telemetry */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-teal-400" />
                  Protocol Sponsor Vault
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs font-mono">
                  Sponsor Account: {PROTOCOL_FEE_SPONSOR_ACCOUNT.slice(0, 10)}...{PROTOCOL_FEE_SPONSOR_ACCOUNT.slice(-6)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sponsor Vault Balance:</span>
                    <span className="font-mono font-bold text-white">48,920.50 XLM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Sponsored Txs:</span>
                    <span className="font-mono text-emerald-400 font-bold">14,280 Transactions</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Settlement Time:</span>
                    <span className="font-mono text-teal-300 font-bold">3.2 Seconds</span>
                  </div>
                </div>

                {sponsorshipResult && (
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 space-y-2 text-emerald-200 animate-in fade-in">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      Fee-Bump Envelope Broadcasted
                    </div>
                    <p className="font-mono text-[10px] break-all bg-slate-950 p-2 rounded border border-emerald-500/20 text-emerald-300">
                      Hash: {sponsorshipResult.sponsorshipHash}
                    </p>
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
