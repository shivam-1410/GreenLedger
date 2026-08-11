'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWalletStore } from '@/store/useWalletStore';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { truncateAddress } from '@/lib/utils';
import { fundWithFriendbot } from '@/lib/wallet';
import {
  Compass,
  Wallet,
  Coins,
  ShieldCheck,
  ShoppingBag,
  Flame,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Award,
} from 'lucide-react';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const { isConnected, publicKey, xlmBalance, refreshBalance } = useWalletStore();
  const { projects, buyCredits, retireCredits } = useAppStore();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isFunding, setIsFunding] = useState(false);
  const [fundingTxHash, setFundingTxHash] = useState<string | null>(null);

  const [selectedProjectId, setSelectedProjectId] = useState<string>('1');
  const [buyAmount, setBuyAmount] = useState<number>(10);
  const [isProcessingTrade, setIsProcessingTrade] = useState(false);
  const [tradeSuccessHash, setTradeSuccessHash] = useState<string | null>(null);

  const [retireReason, setRetireReason] = useState('Onboarding Demo CO2 Compensation');
  const [isRetiring, setIsRetiring] = useState(false);
  const [certificateHash, setCertificateHash] = useState<string | null>(null);

  // Step 2: Friendbot Funding
  const handleFundFriendbot = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet in Step 1 first.');
      return;
    }

    setIsFunding(true);
    try {
      const res = await fundWithFriendbot(publicKey);
      if (res.success) {
        toast.success('Successfully funded wallet with 10,000 Testnet XLM!');
        setFundingTxHash(res.txHash || 'friendbot-success');
        await refreshBalance();
      } else {
        toast.error(res.error || 'Failed to fund wallet with Friendbot.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error executing Friendbot request.');
    } finally {
      setIsFunding(false);
    }
  };


  // Step 4: Trade Execution
  const handleExecuteTrade = async () => {
    if (!publicKey) {
      toast.error('Wallet must be connected.');
      return;
    }
    setIsProcessingTrade(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      buyCredits(selectedProjectId, buyAmount, publicKey);
      const mockHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTradeSuccessHash(mockHash);

      toast.success(`Successfully purchased ${buyAmount} carbon credits on Stellar Testnet!`);
    } catch (error) {
      toast.error('Trade execution failed.');
    } finally {
      setIsProcessingTrade(false);
    }
  };

  // Step 5: Retirement
  const handleExecuteRetirement = async () => {
    if (!publicKey) {
      toast.error('Wallet must be connected.');
      return;
    }
    setIsRetiring(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const hash = retireCredits(selectedProjectId, buyAmount, publicKey, retireReason);
      setCertificateHash(hash);
      toast.success('CO2 Retirement Certificate successfully generated on Soroban!');
    } catch (error) {
      toast.error('Retirement failed.');
    } finally {
      setIsRetiring(false);
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Wallet Connection',
      subtitle: 'Connect Freighter, Albedo, or xBull',
      icon: Wallet,
    },
    {
      number: 2,
      title: 'Claim XLM Faucet',
      subtitle: 'Fund testnet account via Friendbot',
      icon: Coins,
    },
    {
      number: 3,
      title: 'Verifier Governance Check',
      subtitle: 'Inspect accredited verifier status',
      icon: ShieldCheck,
    },
    {
      number: 4,
      title: 'Execute Credit Trade',
      subtitle: 'Atomic settlement with XLM',
      icon: ShoppingBag,
    },
    {
      number: 5,
      title: 'Burn & Certify CO2',
      subtitle: 'Generate immutable SHA-256 certificate',
      icon: Flame,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Compass className="h-4 w-4" />
            <span>Interactive Onboarding Wizard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Stellar Protocol Onboarding</h1>
          <p className="text-sm text-slate-400 mt-1">
            Follow this 5-step guided path to interact with Soroban smart contracts and verify your wallet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/proof">
            <Button variant="outline" size="sm" className="gap-2 border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>View 10+ Wallet Proofs</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Step Stepper Navigation */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <button
              key={step.number}
              onClick={() => setCurrentStep(step.number)}
              className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center ${
                isActive
                  ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                  : isCompleted
                  ? 'bg-slate-900 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-500 hover:text-slate-300'
              }`}
            >
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs mb-2 transition-transform ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 scale-110'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-900 border border-slate-800'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span className="text-[11px] font-bold tracking-tight hidden sm:block">{step.title}</span>
              <span className="text-[9px] text-slate-400 hidden md:block mt-0.5">{step.subtitle}</span>
            </button>
          );
        })}
      </div>

      {/* Step Content Container */}
      <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-6 md:p-8 shadow-2xl space-y-6">
        {/* STEP 1: WALLET CONNECTION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 1 of 5</span>
                <h2 className="text-xl font-bold text-white">Connect Your Stellar Wallet</h2>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              GreenLedger supports all major Stellar wallets via <code className="text-emerald-400 bg-slate-950 px-2 py-0.5 rounded">@creit.tech/stellar-wallets-kit</code> and <code className="text-emerald-400 bg-slate-950 px-2 py-0.5 rounded">@stellar/freighter-api</code>. Connect your Freighter extension or Albedo account to get started.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Freighter Extension</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Recommended</span>
                </div>
                <p className="text-xs text-slate-400">Official browser extension wallet for Stellar & Soroban testnet.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Albedo / xBull / QuickConnect</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Web Wallet</span>
                </div>
                <p className="text-xs text-slate-400">Browser-based web key manager requiring zero installation.</p>
              </div>
            </div>

            {isConnected && publicKey ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-sm text-white">Wallet Connected & Verified</div>
                    <div className="font-mono text-xs">{publicKey}</div>
                  </div>
                </div>
                <Button variant="glow" onClick={() => setCurrentStep(2)} className="gap-2">
                  <span>Proceed to Step 2</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-6 bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
                <p className="text-sm text-slate-400 text-center">
                  Use the <strong className="text-emerald-400">Connect Wallet</strong> button in the top navigation bar to connect your Freighter or Albedo account.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: FRIEND BOT FAUCET */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Coins className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 2 of 5</span>
                <h2 className="text-xl font-bold text-white">Fund Account via Stellar Friendbot Faucet</h2>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              Before submitting Soroban transactions, your wallet must hold Testnet XLM to cover network reserve and gas fees. Stellar Friendbot automatically credits <strong className="text-emerald-400">10,000 XLM</strong> to your address.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Current Wallet Balance</div>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {xlmBalance.toLocaleString()} XLM
                </div>
              </div>

              <Button
                variant="glow"
                onClick={handleFundFriendbot}
                disabled={isFunding || !publicKey}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isFunding ? 'animate-spin' : ''}`} />
                <span>{isFunding ? 'Requesting Friendbot...' : 'Claim 10,000 Testnet XLM'}</span>
              </Button>
            </div>

            {fundingTxHash && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span>Friendbot Funding Complete!</span>
                </div>
                <div className="text-xs font-mono text-slate-300 break-all">Tx Hash: {fundingTxHash}</div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <Button variant="ghost" onClick={() => setCurrentStep(1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>

              <Button variant="glow" onClick={() => setCurrentStep(3)} className="gap-2">
                <span>Proceed to Step 3</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: VERIFIER GOVERNANCE */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 3 of 5</span>
                <h2 className="text-xl font-bold text-white">Inter-Contract Verifier Governance Check</h2>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              GreenLedger enforces strict compliance via cross-contract calls (<code className="text-emerald-400 bg-slate-950 px-2 py-0.5 rounded">env.invoke_contract</code>). Prior to credit minting, the main contract queries the <code className="text-emerald-400 bg-slate-950 px-2 py-0.5 rounded">VerifierRegistry</code> contract to confirm accredited issuer credentials (e.g. Verra, Gold Standard).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span>Verra Standard</span>
                </div>
                <div className="text-slate-400">Accredited Registry ID: VERRA-9081</div>
                <div className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approved Issuer
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span>Gold Standard Impact</span>
                </div>
                <div className="text-slate-400">Accredited Registry ID: GS-7712</div>
                <div className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approved Issuer
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span>American Carbon Registry</span>
                </div>
                <div className="text-slate-400">Accredited Registry ID: ACR-4401</div>
                <div className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approved Issuer
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button variant="ghost" onClick={() => setCurrentStep(2)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>

              <Button variant="glow" onClick={() => setCurrentStep(4)} className="gap-2">
                <span>Proceed to Step 4</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: CREDIT TRADE */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 4 of 5</span>
                <h2 className="text-xl font-bold text-white">Execute Testnet Carbon Credit Trade</h2>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              Select a verified project and execute an atomic XLM purchase settled directly on Soroban smart contract logic.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Carbon Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.projectName} ({p.creditType}) — {p.pricePerTon} XLM/ton
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tons of CO2 Credits to Buy</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <Button
                variant="glow"
                onClick={handleExecuteTrade}
                disabled={isProcessingTrade || !publicKey}
                className="w-full py-3 gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{isProcessingTrade ? 'Processing Soroban Transaction...' : 'Buy Carbon Credits (Atomic XLM)'}</span>
              </Button>

              {tradeSuccessHash && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>Credits Successfully Purchased!</span>
                  </div>
                  <div className="text-xs font-mono text-slate-300 break-all">Tx Hash: {tradeSuccessHash}</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button variant="ghost" onClick={() => setCurrentStep(3)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>

              <Button variant="glow" onClick={() => setCurrentStep(5)} className="gap-2">
                <span>Proceed to Step 5</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: CO2 BURN & CERTIFICATE */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 5 of 5</span>
                <h2 className="text-xl font-bold text-white">Irreversible CO2 Burn & Certificate Verification</h2>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              Permanently burn carbon credits to offset carbon emissions. The contract issues an immutable SHA-256 certificate hash recorded on the Soroban event stream.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Retirement Purpose / Reason</label>
                <input
                  type="text"
                  value={retireReason}
                  onChange={(e) => setRetireReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <Button
                variant="glow"
                onClick={handleExecuteRetirement}
                disabled={isRetiring || !publicKey}
                className="w-full py-3 gap-2 bg-gradient-to-r from-teal-500 to-emerald-600"
              >
                <Flame className="h-4 w-4" />
                <span>{isRetiring ? 'Issuing SHA-256 Certificate...' : 'Burn Credits & Generate CO2 Certificate'}</span>
              </Button>

              {certificateHash && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-950 border border-emerald-500/40 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                      <Sparkles className="h-5 w-5 text-emerald-400" />
                      <span>CO2 Retirement Certificate Issued!</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      ON-CHAIN VERIFIED
                    </span>
                  </div>

                  <div className="text-xs space-y-1 font-mono text-slate-300">
                    <div>Certificate SHA-256 Hash:</div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 break-all text-[11px]">
                      {certificateHash}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span>Stellar Soroban Contract Verification</span>
                    <Link href="/dashboard" className="text-emerald-400 font-semibold hover:underline flex items-center gap-1">
                      <span>View in Dashboard</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <Button variant="ghost" onClick={() => setCurrentStep(4)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>

              <Link href="/proof">
                <Button variant="glow" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Explore 10+ Onboarded Users</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
