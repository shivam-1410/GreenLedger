'use client';

import React, { useState } from 'react';
import { SAMPLE_ESG_ENTITIES, runAIEmissionAuditScan } from '@/lib/ai_auditor';
import { AIAuditScanResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  Cpu,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Search,
  Zap,
  Activity,
  FileCheck2,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AIAuditorPage() {
  const [entities] = useState(SAMPLE_ESG_ENTITIES);
  const [selectedEntity, setSelectedEntity] = useState(entities[0]);
  const [reportedEmissions, setReportedEmissions] = useState<number>(entities[0].reportedScope123);
  const [satelliteEmissions, setSatelliteEmissions] = useState<number>(entities[0].satelliteBaseline);
  const [scanResult, setScanResult] = useState<AIAuditScanResult>(
    runAIEmissionAuditScan(entities[0].name, entities[0].sector, entities[0].reportedScope123, entities[0].satelliteBaseline)
  );
  const [isScanning, setIsScanning] = useState(false);

  const handleSelectEntity = (ent: typeof SAMPLE_ESG_ENTITIES[0]) => {
    setSelectedEntity(ent);
    setReportedEmissions(ent.reportedScope123);
    setSatelliteEmissions(ent.satelliteBaseline);
    setScanResult(runAIEmissionAuditScan(ent.name, ent.sector, ent.reportedScope123, ent.satelliteBaseline));
  };

  const handleRunScan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setTimeout(() => {
      const res = runAIEmissionAuditScan(selectedEntity.name, selectedEntity.sector, reportedEmissions, satelliteEmissions);
      setScanResult(res);
      setIsScanning(false);
      toast.success(`AI Audit Scan Complete for ${selectedEntity.name}! Risk: ${res.riskLevel}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 border-b border-emerald-500/20 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-emerald-950/60 text-emerald-400 border-emerald-500/40 gap-1.5 px-3 py-1">
              <Cpu className="h-3.5 w-3.5" />
              Stellar Level 5 Feature
            </Badge>
            <Badge variant="secondary" className="bg-teal-950 text-teal-300 border border-teal-500/30">
              Real-Time AI Carbon Auditor
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
            AI Carbon Auditor & ESG Emission Anomaly Detector
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Automated neural network scanner comparing self-reported corporate ESG emissions against live satellite spectral thermography and EPA greenhouse gas benchmark models.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Entity Selector & Parameters */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base text-white font-bold flex items-center gap-2">
                  <Search className="h-4 w-4 text-emerald-400" />
                  Select Audited Corporation
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Choose an enterprise dataset to audit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {entities.map((ent) => {
                  const isSelected = selectedEntity.name === ent.name;
                  return (
                    <div
                      key={ent.name}
                      onClick={() => handleSelectEntity(ent)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500/50'
                          : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900'
                      }`}
                    >
                      <p className="font-bold text-white text-xs">{ent.name}</p>
                      <p className="text-[11px] text-slate-400">{ent.sector}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base text-white font-bold">Audit Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRunScan} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Reported Emissions (Tons CO2)</label>
                    <Input
                      type="number"
                      value={reportedEmissions}
                      onChange={(e) => setReportedEmissions(Number(e.target.value))}
                      className="bg-slate-950 border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Satellite Estimated Baseline (Tons)</label>
                    <Input
                      type="number"
                      value={satelliteEmissions}
                      onChange={(e) => setSatelliteEmissions(Number(e.target.value))}
                      className="bg-slate-950 border-slate-800 text-white font-mono"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isScanning}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold gap-2 py-5"
                  >
                    <Zap className="h-4 w-4" />
                    {isScanning ? 'Executing AI Model Scan...' : 'Trigger AI Discrepancy Audit'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right: Scan Results & Risk Matrix */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
              <CardHeader className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-white font-bold flex items-center gap-2">
                      <FileCheck2 className="h-5 w-5 text-emerald-400" />
                      AI Audit Verdict: {scanResult.entityName}
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs mt-1">
                      Scan ID: {scanResult.scanId} | Sector: {scanResult.sector}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={`font-bold px-3 py-1 ${
                      scanResult.riskLevel === 'LOW'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        : scanResult.riskLevel === 'MEDIUM'
                        ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                        : 'bg-red-950 text-red-300 border-red-500/40'
                    }`}
                  >
                    Risk Level: {scanResult.riskLevel}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Metric Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-xs">Reported Disclosures</span>
                    <p className="text-2xl font-bold text-white font-mono mt-1">
                      {scanResult.reportedEmissionsTons.toLocaleString()} <span className="text-xs text-slate-500 font-normal">Tons</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-xs">Satellite Detected</span>
                    <p className="text-2xl font-bold text-teal-400 font-mono mt-1">
                      {scanResult.satelliteEstimatedEmissionsTons.toLocaleString()} <span className="text-xs text-slate-500 font-normal">Tons</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-xs">Discrepancy Gap</span>
                    <p
                      className={`text-2xl font-bold font-mono mt-1 ${
                        scanResult.discrepancyPercentage > 10 ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {scanResult.discrepancyPercentage > 0 ? `+${scanResult.discrepancyPercentage}%` : `${scanResult.discrepancyPercentage}%`}
                    </p>
                  </div>
                </div>

                {/* Audit Finding & Recommendation Box */}
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    AI Model Recommendation
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{scanResult.recommendation}</p>

                  <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row justify-between gap-2">
                    <span>Neural Confidence Score: <strong className="text-emerald-300">{scanResult.confidenceScore}%</strong></span>
                    <span className="font-mono text-slate-500 truncate max-w-xs">Hash: {scanResult.auditHash}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
