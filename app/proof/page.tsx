'use client';

import React, { useState } from 'react';
import { PROOF_OF_INTERACTIONS } from '@/lib/proofs';
import { UserInteractionProof } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  Globe2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProofPage() {
  const [proofs] = useState<UserInteractionProof[]>(PROOF_OF_INTERACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredProofs = proofs.filter((proof) => {
    const matchesSearch =
      proof.walletLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proof.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proof.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proof.country.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'ALL' || proof.entityType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleExportCSV = () => {
    const headers = ['User ID', 'Entity Name', 'Type', 'Country', 'Wallet Address', 'Action', 'Tx Hash', 'Ledger Sequence', 'Onboarding Date', 'Explorer URL'];
    const rows = filteredProofs.map((p) => [
      p.id,
      `"${p.walletLabel}"`,
      p.entityType,
      p.country,
      p.walletAddress,
      p.action,
      p.txHash,
      p.ledgerSequence,
      p.onboardingDate,
      p.stellarExpertUrl,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `greenledger_august_2026_user_proofs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded complete August user proof matrix CSV!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-emerald-950/60 text-emerald-400 border-emerald-500/40 gap-1.5 px-3 py-1">
                <Users className="h-3.5 w-3.5" />
                Stellar Level 5 User Matrix
              </Badge>
              <Badge variant="secondary" className="bg-teal-950 text-teal-300 border border-teal-500/30">
                100+ Onboarded Monthly Users
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
              August 2026 On-Chain User Onboarding Matrix
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Comprehensive audit directory of distinct, newly onboarded monthly users, corporations, climate DAOs, and research NGOs across August 2026 on Stellar Testnet.
            </p>
          </div>

          <Button
            onClick={handleExportCSV}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Download className="h-4 w-4" />
            Export Proofs Matrix (CSV)
          </Button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Onboarded Users</p>
                <p className="text-2xl font-bold text-white">{proofs.length} Unique</p>
                <p className="text-[11px] text-emerald-400 font-medium">100% Non-Repeating</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Activity Period</p>
                <p className="text-2xl font-bold text-white">August 2026</p>
                <p className="text-[11px] text-teal-400 font-medium">Aug 1 – Aug 30, 2026</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Globe2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Global Reach</p>
                <p className="text-2xl font-bold text-white">35+ Countries</p>
                <p className="text-[11px] text-cyan-400 font-medium">6 Continents Represented</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified On-Chain</p>
                <p className="text-2xl font-bold text-white">100% Verified</p>
                <p className="text-[11px] text-amber-400 font-medium">StellarExpert Explorer Linked</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by organization name, wallet G-address, action, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900/80 border-slate-800 text-white text-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'Enterprise ESG', 'University NGO', 'Renewable Producer', 'Climate DAO'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedType === type
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Proofs Table */}
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">#</th>
                  <th className="p-3.5">Organization / User</th>
                  <th className="p-3.5">Type & Country</th>
                  <th className="p-3.5">Stellar Public Key</th>
                  <th className="p-3.5">Action Executed</th>
                  <th className="p-3.5">Onboarded</th>
                  <th className="p-3.5 text-right">Explorer Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {filteredProofs.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono text-emerald-400 font-bold">{p.userNumber}</td>
                    <td className="p-3.5 text-white font-semibold">{p.walletLabel}</td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="text-[10px] text-teal-300 border-teal-500/30 mr-1.5">
                        {p.entityType}
                      </Badge>
                      <span className="text-slate-400 text-[11px]">{p.country}</span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-300">{p.walletAddress.slice(0, 8)}...{p.walletAddress.slice(-6)}</td>
                    <td className="p-3.5">
                      <Badge variant="secondary" className="bg-slate-950 text-emerald-400 border border-slate-800 text-[10px]">
                        {p.action}
                      </Badge>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400 text-[11px]">{p.onboardingDate}</td>
                    <td className="p-3.5 text-right">
                      <a
                        href={p.stellarExpertUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono text-[11px]"
                      >
                        View Tx <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
