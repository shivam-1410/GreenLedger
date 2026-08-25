'use client';

import React, { useState } from 'react';
import { MOCK_MRV_SENSORS, verifyMRVOracleTelemetry, MRVSensorData, MRVOracleVerificationResult } from '@/lib/oracle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  Radio,
  Satellite,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Activity,
  Cpu,
  Globe,
  Database,
  ExternalLink,
  Layers,
} from 'lucide-react';

export default function OraclePage() {
  const [sensors] = useState<MRVSensorData[]>(MOCK_MRV_SENSORS);
  const [selectedSensor, setSelectedSensor] = useState<MRVSensorData>(sensors[0]);
  const [verificationResult, setVerificationResult] = useState<MRVOracleVerificationResult>(
    verifyMRVOracleTelemetry(sensors[0])
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelectSensor = (sensor: MRVSensorData) => {
    setSelectedSensor(sensor);
    setVerificationResult(verifyMRVOracleTelemetry(sensor));
  };

  const handleTriggerOracleAudit = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const res = verifyMRVOracleTelemetry(selectedSensor);
      setVerificationResult(res);
      setIsVerifying(false);
      setToastMessage(`Oracle Verification Executed! CO2 Capacity: ${res.calculatedCO2Tons} Tons (${res.confidenceScore}% Confidence)`);
      setTimeout(() => setToastMessage(null), 5000);
    }, 800);
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
                <Satellite className="h-3.5 w-3.5 animate-pulse" />
                Stellar Level 5 Feature
              </Badge>
              <Badge variant="secondary" className="bg-teal-950 text-teal-300 border border-teal-500/30">
                MRV Oracle Network
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
              Satellite & IoT MRV Telemetry Inspector
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Automated Measurement, Reporting, and Verification (MRV) feed powered by satellite spectral imagery, NDVI index scoring, and IoT soil carbon sensor telemetries.
            </p>
          </div>

          <Button
            onClick={handleTriggerOracleAudit}
            disabled={isVerifying}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Zap className="h-4 w-4" />
            {isVerifying ? 'Querying Oracle Network...' : 'Run Live Oracle Audit'}
          </Button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Satellite className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Satellites</p>
                <p className="text-2xl font-bold text-white">4 Constellations</p>
                <p className="text-[11px] text-emerald-400 font-medium">Sentinel-2 & Landsat-9</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">IoT Sensor Nodes</p>
                <p className="text-2xl font-bold text-white">1,240 Telemetries</p>
                <p className="text-[11px] text-teal-400 font-medium">99.98% Telemetry Uptime</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Soil Carbon</p>
                <p className="text-2xl font-bold text-white">64.1 kg/m² Avg</p>
                <p className="text-[11px] text-cyan-400 font-medium">Calibrated Real-Time</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Soroban Oracle Hash</p>
                <p className="text-2xl font-bold text-white">SHA-256 Valid</p>
                <p className="text-[11px] text-amber-400 font-medium">Zero-Tamper Attestation</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Sensor List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Radio className="h-5 w-5 text-emerald-400" />
              Live Telemetry Feeds ({sensors.length})
            </h2>

            <div className="space-y-3">
              {sensors.map((sensor) => {
                const isSelected = selectedSensor.sensorId === sensor.sensorId;
                return (
                  <Card
                    key={sensor.sensorId}
                    onClick={() => handleSelectSensor(sensor)}
                    className={`cursor-pointer transition-all duration-200 bg-slate-900/80 hover:bg-slate-800/80 border ${
                      isSelected
                        ? 'border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                        : 'border-slate-800'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-emerald-400">{sensor.sensorId}</span>
                        <Badge
                          variant="secondary"
                          className="bg-emerald-950 text-emerald-300 border-emerald-500/30 text-[10px]"
                        >
                          {sensor.status}
                        </Badge>
                      </div>
                      <h3 className="text-sm font-semibold text-white">{sensor.location}</h3>
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-400">
                        <div>
                          <span className="block text-[10px] text-slate-500">NDVI Index</span>
                          <span className="font-bold text-slate-200">{sensor.ndviIndex}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500">Biomass (t/ha)</span>
                          <span className="font-bold text-slate-200">{sensor.biomassTonsPerHectare}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Sensor Inspector */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
              <CardHeader className="border-b border-slate-800 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 mb-1">
                      Sensor Deep-Dive
                    </Badge>
                    <CardTitle className="text-xl text-white font-bold">{selectedSensor.location}</CardTitle>
                    <CardDescription className="text-slate-400 font-mono text-xs mt-1">
                      ID: {selectedSensor.sensorId} | Lat: {selectedSensor.coordinates.lat}, Lng: {selectedSensor.coordinates.lng}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-slate-800 text-slate-300 self-start sm:self-auto">
                    Verified Oracle Feed
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Telemetry Gauge Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-xs text-slate-400 font-medium">NDVI Spectral Score</span>
                    <p className="text-3xl font-extrabold text-emerald-400 mt-1">{selectedSensor.ndviIndex}</p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{ width: `${selectedSensor.ndviIndex * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-xs text-slate-400 font-medium">Soil Carbon Density</span>
                    <p className="text-3xl font-extrabold text-teal-400 mt-1">
                      {selectedSensor.soilCarbonDensityKgM2} <span className="text-xs text-slate-500 font-normal">kg/m²</span>
                    </p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-teal-400 h-full rounded-full"
                        style={{ width: `${Math.min(100, (selectedSensor.soilCarbonDensityKgM2 / 30) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-xs text-slate-400 font-medium">Biomass Density</span>
                    <p className="text-3xl font-extrabold text-cyan-400 mt-1">
                      {selectedSensor.biomassTonsPerHectare} <span className="text-xs text-slate-500 font-normal">t/ha</span>
                    </p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full rounded-full"
                        style={{ width: `${Math.min(100, (selectedSensor.biomassTonsPerHectare / 500) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Oracle Verification Result Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                      <span className="font-bold text-white text-sm">Soroban Smart Contract Mint Eligibility</span>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/50">
                      Eligible: {verificationResult.isEligibleForMinting ? 'YES' : 'NO'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Calculated CO2 Ton Capacity</span>
                      <span className="text-xl font-bold text-white font-mono">{verificationResult.calculatedCO2Tons} Tons</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Oracle Recommended Price</span>
                      <span className="text-xl font-bold text-emerald-400 font-mono">
                        {verificationResult.recommendedCreditPriceXlm} XLM / Ton
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">Cryptographic Telemetry Proof Hash</span>
                    <p className="font-mono text-[11px] text-emerald-300/90 break-all bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      {verificationResult.cryptographicProofHash}
                    </p>
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
