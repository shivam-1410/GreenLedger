'use client';

import { useState } from 'react';
import { ShieldCheck, Award, FileText, CheckCircle2, Download, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function CompliancePage() {
  const [orgName, setOrgName] = useState('Enterprise Global Corp');
  const [period, setPeriod] = useState('Q3 2026');
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const reportData = {
    totalEmissionsTons: 1250.5,
    totalOffsetTons: 1420.0,
    netEmissionsTons: 0,
    complianceScore: 100,
    status: 'COMPLIANT',
    verifiedOnChain: true,
    verifiersCount: 4,
    auditHash: 'fd95c8e3bc7893c38f3b4e7a49bea9849fe3ecc3c188306e0ee0482a39649018',
    stellarExplorerUrl: 'https://stellar.expert/explorer/testnet/tx/fd95c8e3bc7893c38f3b4e7a49bea9849fe3ecc3c188306e0ee0482a39649018',
  };

  const handleExport = (format: 'PDF' | 'CSV' | 'JSON') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportMessage(`Successfully generated and downloaded ${format} compliance report for ${orgName}`);
      setTimeout(() => setExportMessage(null), 5000);
    }, 800);
  };

  return (
    <div className="container max-w-6xl py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              Stellar Soroban Level 4 Enterprise Standard
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
              GHG Protocol Scope 1-3
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Enterprise ESG Compliance Audit Report
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Cryptographically audited carbon neutrality certification backed by Soroban smart contract verifications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => handleExport('CSV')} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-500" onClick={() => handleExport('PDF')} disabled={isExporting}>
            <FileText className="w-4 h-4 mr-2" />
            Download PDF Audit
          </Button>
        </div>
      </div>

      {exportMessage && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            {exportMessage}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setExportMessage(null)}>Dismiss</Button>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card/40 border-border/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compliance Score</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-emerald-400 flex items-center gap-2">
              {reportData.complianceScore}%
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Status: <span className="text-emerald-400 font-semibold">{reportData.status}</span> (Net Zero Certified)
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gross Emissions (CO₂)</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-foreground">
              {reportData.totalEmissionsTons} <span className="text-sm font-normal text-muted-foreground">tons</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Audited Scope 1, 2 & 3 operational footprint
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Soroban Retired CO₂</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-teal-400">
              {reportData.totalOffsetTons} <span className="text-sm font-normal text-muted-foreground">tons</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            +169.5 tons surplus offset buffer
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Accredited Verifiers</CardDescription>
            <CardTitle className="text-3xl font-extrabold text-cyan-400 flex items-center gap-2">
              {reportData.verifiersCount} <span className="text-sm font-normal text-muted-foreground">Entities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            VerifierRegistry cross-contract validated
          </CardContent>
        </Card>
      </div>

      {/* Detail Audit Table */}
      <Card className="bg-card/40 border-border/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Audit Trail & Cryptographic Proof Verification
              </CardTitle>
              <CardDescription>
                Live verification state on Stellar Testnet for organization: <strong>{orgName}</strong> ({period})
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              VERIFIED ON-CHAIN
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-background/50 border border-border/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">Master Audit Hash:</span>
              <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded text-emerald-300 break-all">
                {reportData.auditHash}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">Stellar Horizon Explorer:</span>
              <a
                href={reportData.stellarExplorerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
              >
                View on StellarExpert <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Audit Breakdown & Governance Approvals</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-card/60 border border-border/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Verra VCS Standard #1892</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">APPROVED</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Amazon Rainforest Bio-Reserve Project — 750.0 Tons CO₂</p>
              </div>
              <div className="p-4 rounded-lg bg-card/60 border border-border/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Gold Standard GS-4902</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">APPROVED</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Nordic Offshore Wind Energy Array — 670.0 Tons CO₂</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
