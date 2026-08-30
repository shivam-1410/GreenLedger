'use client';

import React, { useState } from 'react';
import { INITIAL_MULTISIG_TRANSACTIONS, signMultiSigTransaction, MultiSigTreasuryTransaction } from '@/lib/multisig';
import { useWalletStore } from '@/store/useWalletStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Lock,
  KeyRound,
  FileCheck2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function MultiSigPage() {
  const { isConnected, publicKey } = useWalletStore();
  const [transactions, setTransactions] = useState<MultiSigTreasuryTransaction[]>(INITIAL_MULTISIG_TRANSACTIONS);
  const [selectedTx, setSelectedTx] = useState<MultiSigTreasuryTransaction>(transactions[0]);
  const [isSigning, setIsSigning] = useState(false);

  const handleSignTransaction = () => {
    setIsSigning(true);
    setTimeout(() => {
      const signerAddr = publicKey || 'GCX9PW4M102L9R4GBV2X5Z6P7E5K3J7X9P02L9R4E91M822';
      const { updatedTx, isExecuted } = signMultiSigTransaction(selectedTx, signerAddr);

      setSelectedTx(updatedTx);
      setTransactions(transactions.map((t) => (t.txId === updatedTx.txId ? updatedTx : t)));
      setIsSigning(false);

      if (isExecuted) {
        toast.success(`Multi-Sig Threshold Reached (3/4)! Transaction ${updatedTx.txId} EXECUTED on Soroban contract.`);
      } else {
        toast.success(`Signature Appended to ${updatedTx.txId}. Current weight: ${updatedTx.currentWeight}/${updatedTx.thresholdRequired}`);
      }
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 border-b border-emerald-500/20 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-emerald-950/60 text-emerald-400 border-emerald-500/40 gap-1.5 px-3 py-1">
              <KeyRound className="h-3.5 w-3.5" />
              Stellar Level 6 Advanced Feature
            </Badge>
            <Badge variant="secondary" className="bg-teal-950 text-teal-300 border border-teal-500/30">
              Multi-Signature Governance
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
            Enterprise Multi-Signature Treasury & Minting
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Require multi-party cryptographic authorization (M-of-N threshold signatures) for high-value carbon credit mints, yield pool rebalancing, and treasury fund disbursements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Transaction Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30 font-mono">
                    {selectedTx.txId}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      selectedTx.status === 'EXECUTED'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-950 text-amber-300 border-amber-500/40'
                    }
                  >
                    {selectedTx.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-white font-bold mt-2">{selectedTx.title}</CardTitle>
                <CardDescription className="text-slate-400 text-xs">{selectedTx.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400">Disbursement Amount:</span>
                    <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{selectedTx.amountXlm.toLocaleString()} XLM</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Carbon Credits Backing:</span>
                    <p className="text-xl font-bold font-mono text-white mt-0.5">{selectedTx.carbonCreditsTons.toLocaleString()} Tons</p>
                  </div>
                </div>

                {/* Signers Progress Matrix */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-emerald-400" />
                    Signer Approval Quorum ({selectedTx.currentWeight} of {selectedTx.thresholdRequired} required)
                  </h3>

                  <div className="space-y-2">
                    {selectedTx.signers.map((signer, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{signer.name}</p>
                          <p className="font-mono text-[10px] text-slate-500">{signer.address.slice(0, 12)}...{signer.address.slice(-6)}</p>
                        </div>
                        {signer.hasSigned ? (
                          <Badge variant="verified" className="gap-1 text-[10px]">
                            <CheckCircle2 className="h-3 w-3" /> Signed
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] bg-slate-900 text-slate-400">
                            Awaiting Signature
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSignTransaction}
                  disabled={isSigning || selectedTx.status === 'EXECUTED'}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-6 gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <KeyRound className="h-5 w-5" />
                  {isSigning
                    ? 'Broadcasting Cryptographic Multi-Sig...'
                    : selectedTx.status === 'EXECUTED'
                    ? 'Transaction Fully Executed'
                    : 'Sign Multi-Sig Envelope with Connected Wallet'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right: Security Safeguards */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base text-white font-bold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-teal-400" />
                  Multi-Sig Invariants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-300">
                <p>• <strong>Timelock Guard:</strong> 24-hour veto delay for transfers &gt; 100k XLM.</p>
                <p>• <strong>Zero Single-Point-of-Failure:</strong> Contract requires at least 3 independent institutional keys.</p>
                <p>• <strong>Soroban Auth Trait:</strong> Employs native `Address::require_auth_for_args` for each signer.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
