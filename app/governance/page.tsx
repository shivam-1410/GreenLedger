'use client';

import React, { useState } from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { useAppStore } from '@/store/useAppStore';
import { MOCK_VERIFIERS, STELLAR_CONFIG } from '@/lib/config';
import { Verifier } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatTimestamp, truncateAddress } from '@/lib/utils';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Cpu,
  ExternalLink,
  Search,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function GovernancePage() {
  const { isConnected, publicKey } = useWalletStore();
  const { addTransaction, updateTransaction } = useAppStore();

  const [verifiers, setVerifiers] = useState<Verifier[]>(MOCK_VERIFIERS);
  const [newAddress, setNewAddress] = useState('GBK11223344556677889900AABBCCDDEEFFGGHHIIJJKKLLMM');
  const [newName, setNewName] = useState('Clean Development Mechanism (CDM)');
  const [newUri, setNewUri] = useState('https://cdm.unfccc.int');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inter-Contract Query Simulator State
  const [checkAddress, setCheckAddress] = useState('');
  const [checkResult, setCheckResult] = useState<{ checked: boolean; isApproved: boolean } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleApproveVerifier = async () => {
    if (!isConnected || !publicKey) {
      toast.error('Please connect your wallet to submit governance proposal!');
      return;
    }

    if (!newAddress.trim() || !newName.trim()) {
      toast.error('Please complete verifier address and organization name.');
      return;
    }

    setIsSubmitting(true);
    const txId = addTransaction({
      title: `Approve Verifier: ${newName}`,
      status: 'pending',
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newV: Verifier = {
        address: newAddress,
        name: newName,
        accreditationUri: newUri,
        active: true,
        approvedAt: Date.now(),
      };

      setVerifiers([newV, ...verifiers]);

      const mockTxHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      updateTransaction(txId, {
        status: 'success',
        hash: mockTxHash,
      });

      toast.success(`Verifier "${newName}" registered in VerifierRegistry contract!`);
      setNewAddress('');
      setNewName('');
    } catch (err: any) {
      updateTransaction(txId, {
        status: 'failed',
        error: err.message || 'Governance transaction failed',
      });
      toast.error('Failed to approve verifier');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInterContractCheck = async () => {
    if (!checkAddress.trim()) {
      toast.error('Enter an address to perform inter-contract verification check.');
      return;
    }

    setIsChecking(true);
    await new Promise((r) => setTimeout(r, 1000));

    const cleanInput = checkAddress.trim().toLowerCase();
    const found = verifiers.some(
      (v) =>
        v.active &&
        (v.address.toLowerCase() === cleanInput ||
          v.address.toLowerCase().startsWith(cleanInput) ||
          cleanInput.startsWith(v.address.toLowerCase().slice(0, 10)))
    );

    setCheckResult({ checked: true, isApproved: found });
    setIsChecking(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header & Inter-Contract Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Cpu className="h-4 w-4" /> Soroban Inter-Contract Governance
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Verifier Registry Governance</h1>
          <p className="text-sm text-slate-400">
            Cross-contract authorization checking between <span className="text-teal-300 font-mono">VerifierRegistry</span> and <span className="text-emerald-300 font-mono">GreenLedger</span> contracts.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-teal-500/30 text-xs font-mono space-y-1">
          <div className="flex items-center justify-between gap-4 text-slate-400">
            <span>VerifierRegistry Contract:</span>
            <span className="text-teal-300">{STELLAR_CONFIG.verifierRegistryContractId.slice(0, 10)}...</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-400">
            <span>GreenLedger Contract:</span>
            <span className="text-emerald-300">{STELLAR_CONFIG.contractId.slice(0, 10)}...</span>
          </div>
        </div>
      </div>

      {/* Inter-Contract Call Demonstration Box */}
      <div className="p-6 rounded-2xl border border-teal-500/30 bg-gradient-to-r from-slate-900/90 to-slate-950/90 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-teal-400" />
            <h2 className="text-lg font-bold text-white">Live Inter-Contract Verification Query</h2>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          When a credit issuer attempts to mint carbon credits, the <span className="text-emerald-300 font-mono">GreenLedger</span> contract executes an on-chain cross-contract call (`env.invoke_contract`) to <span className="text-teal-300 font-mono">VerifierRegistry.is_approved_verifier(issuer)</span>.
        </p>

        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Input
              value={checkAddress}
              onChange={(e) => setCheckAddress(e.target.value)}
              placeholder="Enter Address e.g. GBV2X5Z6P7E5K3J7X9P02L9R4E91M822GBC4M822GDA7KL9P0"
              className="flex-1 text-xs font-mono"
            />
            <Button variant="glow" onClick={handleInterContractCheck} disabled={isChecking} className="gap-2 shrink-0">
              {isChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span>Query Cross-Contract State</span>
            </Button>
          </div>

          {/* Quick Test Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span>Quick Test Inputs:</span>
            <button
              onClick={() => setCheckAddress(MOCK_VERIFIERS[0].address)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 font-mono"
            >
              Verra Address (Approved)
            </button>
            <button
              onClick={() => setCheckAddress(MOCK_VERIFIERS[1].address)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 font-mono"
            >
              Gold Standard (Approved)
            </button>
            <button
              onClick={() => setCheckAddress('GUNKNOWN999999999999999999999999')}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-red-300 font-mono"
            >
              Unknown Address (Not Registered)
            </button>
          </div>
        </div>

        {checkResult?.checked && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs animate-in fade-in-0 ${
              checkResult.isApproved
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/60 border-red-500/40 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {checkResult.isApproved ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
              <span>
                Inter-Contract Result: Address is{' '}
                <strong>{checkResult.isApproved ? 'APPROVED & ACCREDITED' : 'NOT REGISTERED'}</strong> in Verifier Registry.
              </span>
            </div>
            <span className="font-mono text-[10px] opacity-80">Call: verifier_registry.is_approved_verifier()</span>
          </div>
        )}
      </div>

      {/* Grid: Approved Verifiers List & Register Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Verifiers List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-teal-400" /> Accredited Climate Verifiers
          </h2>

          <div className="space-y-3">
            {verifiers.map((v, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{v.name}</h3>
                    <Badge variant="verified">
                      <ShieldCheck className="h-3.5 w-3.5" /> Approved Verifier
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Address: <span className="text-teal-300">{truncateAddress(v.address, 6)}</span>
                  </p>
                  <span className="text-[11px] text-slate-500 block">
                    Accredited: {formatTimestamp(v.approvedAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCheckAddress(v.address);
                      toast.info(`Address copied to query input! Click "Query Cross-Contract State".`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-teal-300 font-mono"
                  >
                    Test Query
                  </button>
                  <a
                    href={v.accreditationUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
                  >
                    Registry URI <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Register New Verifier Form */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md space-y-4 h-fit">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-emerald-400" /> Register Verifier
          </h2>
          <p className="text-xs text-slate-400">
            Submit governance transaction to register an accredited carbon verifier in the registry contract.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Verifier Address</label>
              <Input
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="G... Public Key"
                className="font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Organization Name</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Gold Standard"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Accreditation URI</label>
              <Input
                value={newUri}
                onChange={(e) => setNewUri(e.target.value)}
                placeholder="https://registry.org/accreditation"
              />
            </div>

            <Button
              variant="glow"
              onClick={handleApproveVerifier}
              disabled={isSubmitting || !isConnected}
              className="w-full h-10 gap-2 mt-2"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
              <span>Approve & Authorize Verifier</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
