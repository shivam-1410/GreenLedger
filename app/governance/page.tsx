'use client';

import React, { useState } from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { useAppStore } from '@/store/useAppStore';
import { MOCK_VERIFIERS, STELLAR_CONFIG } from '@/lib/config';
import { INITIAL_DAO_PROPOSALS, createDAOProposal, evaluateProposalVote, DAOProposal } from '@/lib/governance';
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
  Vote,
  Users,
  Award,
} from 'lucide-react';
import { toast } from 'sonner';

export default function GovernancePage() {
  const { isConnected, publicKey } = useWalletStore();
  const { addTransaction, updateTransaction } = useAppStore();

  const [verifiers, setVerifiers] = useState<Verifier[]>(MOCK_VERIFIERS);
  const [proposals, setProposals] = useState<DAOProposal[]>(INITIAL_DAO_PROPOSALS);

  const [newAddress, setNewAddress] = useState('GBK11223344556677889900AABBCCDDEEFFGGHHIIJJKKLLMM');
  const [newName, setNewName] = useState('Clean Development Mechanism (CDM)');
  const [newUri, setNewUri] = useState('https://cdm.unfccc.int');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Proposal Creation Form
  const [propTitle, setPropTitle] = useState('Accredit Soil Carbon Alliance as Level-2 Verifier');
  const [propDesc, setPropDesc] = useState('Authorize Soil Carbon Alliance to issue accredited CO2 credits on Soroban contract');
  const [propVerifierAddr, setPropVerifierAddr] = useState('GDUQ3DXGSNRGPNNGHLKXLSVPRC3V2PAYMP6ITW3ICSRLF64KVOTPA6AT');

  // Inter-Contract Query Simulator State
  const [checkAddress, setCheckAddress] = useState('');
  const [checkResult, setCheckResult] = useState<{ checked: boolean; isApproved: boolean } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Connect your Stellar wallet to submit a DAO proposal.');
      return;
    }

    const newProp = createDAOProposal(
      propTitle,
      propDesc,
      publicKey || 'GAEQ5IUNQTW36XMQF6MR2VWKPG3JOF6IKEGAD2JQ6OUNKTUVBAIE5AO3',
      propVerifierAddr,
      'APPROVE'
    );
    setProposals([newProp, ...proposals]);
    toast.success(`DAO Governance Proposal "${propTitle.slice(0, 30)}..." Created!`);
  };

  const handleVoteProposal = (propId: string, support: boolean) => {
    setProposals(
      proposals.map((p) => {
        if (p.id === propId) {
          const votesFor = support ? p.votesFor + 15000 : p.votesFor;
          const votesAgainst = !support ? p.votesAgainst + 15000 : p.votesAgainst;
          const updated = { ...p, votesFor, votesAgainst };
          const evalRes = evaluateProposalVote(updated);
          if (evalRes.canExecute) {
            updated.status = 'PASSED';
          }
          return updated;
        }
        return p;
      })
    );
    toast.success(`Vote cast on proposal ${propId}!`);
  };

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
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
    await new Promise((r) => setTimeout(r, 800));

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
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-emerald-950/60 text-emerald-400 border-emerald-500/40 gap-1.5 px-3 py-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Stellar Level 5 Feature
            </Badge>
            <Badge variant="secondary" className="bg-teal-950 text-teal-300 border border-teal-500/30">
              Multi-Sig DAO Governance
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Decentralized Governance & Verifier Registry</h1>
          <p className="text-sm text-slate-400">
            Multi-signature proposal voting and cross-contract authorization checking between <span className="text-teal-300 font-mono">VerifierRegistry</span> and <span className="text-emerald-300 font-mono">GreenLedger</span>.
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

      {/* DAO Multi-Sig Proposals Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Vote className="h-5 w-5 text-emerald-400" /> Active Multi-Sig DAO Proposals ({proposals.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals.map((prop) => {
            const evalRes = evaluateProposalVote(prop);
            return (
              <div key={prop.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-400">{prop.id}</span>
                    <h3 className="text-base font-bold text-white mt-1">{prop.title}</h3>
                  </div>
                  <Badge variant={prop.status === 'PASSED' ? 'verified' : 'secondary'}>{prop.status}</Badge>
                </div>

                <p className="text-xs text-slate-400">{prop.description}</p>

                {/* Vote Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Approval Ratio: {evalRes.approvalPercent}%</span>
                    <span>Required: {prop.thresholdRequired}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${Math.min(100, evalRes.approvalPercent)}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div className="text-[11px] text-slate-500 font-mono">
                    Votes: {prop.votesFor.toLocaleString()} FOR / {prop.votesAgainst.toLocaleString()} AGAINST
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleVoteProposal(prop.id, true)} className="bg-emerald-600 hover:bg-emerald-500 text-xs">
                      Vote FOR
                    </Button>
                    <Button size="sm" onClick={() => handleVoteProposal(prop.id, false)} variant="outline" className="border-red-500/40 text-red-300 text-xs">
                      Vote AGAINST
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inter-Contract Query Simulator Box */}
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
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Verifier Address</label>
              <Input value={newAddress} onChange={(e) => setNewAddress(e.target.value)} className="font-mono" />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Organization Name</label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <Button variant="glow" onClick={handleApproveVerifier} disabled={isSubmitting || !isConnected} className="w-full h-10 gap-2 mt-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
              <span>Approve & Authorize Verifier</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
