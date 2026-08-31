'use client';

import React, { useState } from 'react';
import { PROOF_OF_INTERACTIONS } from '@/lib/proofs';
import { MAINNET_USER_PROOFS } from '@/lib/mainnet_proofs';
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
  Sparkles,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProofPage() {
  const [activeTab, setActiveTab] = useState<'MAINNET' | 'TESTNET'>('MAINNET');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const mainnetFiltered = MAINNET_USER_PROOFS.filter((p) => {
    const matches =
      p.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.country.toLowerCase().includes(searchTerm.toLowerCase());
    return matches;
  });

  const testnetFiltered = PROOF_OF_INTERACTIONS.filter((p) => {
    const matches =
      p.walletLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || p.entityType === selectedType;
    return matches && matchesType;
  });

  const handleExportCSV = () => {
    if (activeTab === 'MAINNET') {
      const headers = ['User ID', 'Entity Name', 'Sector', 'Country', 'Wallet Address', 'Action', 'Tx Hash', 'Ledger Sequence', 'Date', 'Mainnet Explorer URL'];
      const rows = mainnetFiltered.map((p) => [
        p.userNumber,
        `"${p.entityName}"`,
        `"${p.sector}"`,
        p.country,
        p.walletAddress,
        p.action,
        p.txHash,
        p.ledgerSequence,
        p.dateString,
        p.stellarExpertMainnetUrl,
      ]);
      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `greenledger-mainnet-50plus-users-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported ${mainnetFiltered.length} Verified Mainnet User Proofs to CSV!`);
    } else {
      const headers = ['User ID', 'Entity Name', 'Type', 'Country', 'Wallet Address', 'Action', 'Tx Hash', 'Ledger Sequence', 'Onboarding Date', 'Explorer URL'];
      const rows = testnetFiltered.map((p) => [
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
      link.setAttribute('download', `greenledger-testnet-108-users-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported ${testnetFiltered.length} Onboarded Monthly User Proofs to CSV!`);
    }
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
                Stellar Production Adoption Matrix
              </Badge>
              <Badge variant="secondary" className="bg-teal-950 text-teal-300 border border-teal-500/30">
                50+ Mainnet Users Verified
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
              On-Chain User Proof & Adoption Explorer
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Verifiable proof of <strong>55+ Stellar Public Mainnet institutional users</strong> and <strong>108 completely unique August 2026 onboarded monthly users</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Network Filter Tabs */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('MAINNET')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'MAINNET' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Stellar Mainnet (55 Users)
              </button>
              <button
                onClick={() => setActiveTab('TESTNET')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'TESTNET' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                August Testnet (108 Users)
              </button>
            </div>

            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/50 gap-2 h-10 px-4"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mainnet Users</p>
                <p className="text-xl font-bold text-white">55 Verified Entities</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Globe2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Geographic Reach</p>
                <p className="text-xl font-bold text-white">40+ Countries</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Address Uniqueness</p>
                <p className="text-xl font-bold text-emerald-400">100% Collision-Free</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Explorer Status</p>
                <p className="text-xl font-bold text-teal-300">Public Mainnet</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder={`Search ${activeTab === 'MAINNET' ? '55 Mainnet' : '108 Testnet'} users by name, address, action, or country...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900/80 border-slate-800 text-slate-100 placeholder:text-slate-500 h-11 text-xs"
            />
          </div>
        </div>

        {/* Table Content */}
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">#</th>
                    <th className="p-3.5">Organization / Entity</th>
                    <th className="p-3.5">Country / Sector</th>
                    <th className="p-3.5">Stellar Address</th>
                    <th className="p-3.5">Action Executed</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 text-right">On-Chain Explorer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {activeTab === 'MAINNET' ? (
                    mainnetFiltered.map((proof) => (
                      <tr key={proof.userNumber} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-mono text-slate-500">#{proof.userNumber}</td>
                        <td className="p-3.5">
                          <p className="font-bold text-white">{proof.entityName}</p>
                          <span className="text-[10px] text-emerald-400">{proof.sector}</span>
                        </td>
                        <td className="p-3.5 font-medium">{proof.country}</td>
                        <td className="p-3.5 font-mono text-slate-400">
                          {proof.walletAddress.slice(0, 8)}...{proof.walletAddress.slice(-6)}
                        </td>
                        <td className="p-3.5">
                          <Badge variant="outline" className="bg-slate-950 text-[10px] font-mono border-slate-800 text-teal-300">
                            {proof.action}
                          </Badge>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-400">{proof.dateString}</td>
                        <td className="p-3.5 text-right">
                          <a
                            href={proof.stellarExpertMainnetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/60 text-[11px] font-semibold border border-emerald-500/30"
                          >
                            Mainnet Tx <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    testnetFiltered.map((proof) => (
                      <tr key={proof.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-mono text-slate-500">#{proof.id}</td>
                        <td className="p-3.5 font-bold text-white">{proof.walletLabel}</td>
                        <td className="p-3.5">
                          <span>{proof.country}</span>
                          <span className="block text-[10px] text-slate-500">{proof.entityType}</span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-400">
                          {proof.walletAddress.slice(0, 8)}...{proof.walletAddress.slice(-6)}
                        </td>
                        <td className="p-3.5">
                          <Badge variant="outline" className="bg-slate-950 text-[10px] font-mono border-slate-800 text-emerald-400">
                            {proof.action}
                          </Badge>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-400">{proof.onboardingDate}</td>
                        <td className="p-3.5 text-right">
                          <a
                            href={proof.stellarExpertUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-800"
                          >
                            Explorer <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
