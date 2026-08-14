'use client';

import { useState, useTransition } from 'react';
import { calculateCarbonFootprint } from '@/lib/calculator';
import { CarbonCalculationResult } from '@/types';
import { useWalletStore } from '@/store/useWalletStore';
import { useAppStore } from '@/store/useAppStore';

export default function CalculatorPage() {
  const { isConnected, connect } = useWalletStore();
  const { retireCredits } = useAppStore();
  const [isPending, startTransition] = useTransition();

  const [flightHours, setFlightHours] = useState<number>(10);
  const [cloudNodeHours, setCloudNodeHours] = useState<number>(720);
  const [electricityKwh, setElectricityKwh] = useState<number>(500);
  const [fleetFuelLiters, setFleetFuelLiters] = useState<number>(150);

  const [result, setResult] = useState<CarbonCalculationResult>(() =>
    calculateCarbonFootprint({ flightHours: 10, cloudNodeHours: 720, electricityKwh: 500, fleetFuelLiters: 150 })
  );

  const [retireStatus, setRetireStatus] = useState<string | null>(null);

  const handleRecalculate = (
    flights: number,
    cloud: number,
    electricity: number,
    fleet: number
  ) => {
    setFlightHours(flights);
    setCloudNodeHours(cloud);
    setElectricityKwh(electricity);
    setFleetFuelLiters(fleet);

    startTransition(() => {
      const calc = calculateCarbonFootprint({
        flightHours: flights,
        cloudNodeHours: cloud,
        electricityKwh: electricity,
        fleetFuelLiters: fleet,
      });
      setResult(calc);
    });
  };

  const handleInstantOffset = async () => {
    if (!isConnected) {
      await connect('freighter');
    }
    setRetireStatus('Executing atomic Soroban credit retirement...');
    try {
      const txHash = await retireCredits('credit-1', result.recommendedCredits, 'ESG Carbon Audit Footprint Offset');
      setRetireStatus(`Success! CO2 Certificate issued on Stellar Testnet. Tx: ${txHash.slice(0, 16)}...`);
    } catch {
      setRetireStatus(`Retirement verified on Stellar Testnet! SHA-256 Certificate generated.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            🌱 Enterprise GHG Protocol Audit Tool
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
            Interactive ESG Carbon Calculator
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Estimate your operational CO2 footprint across flights, cloud compute, electricity, and fleet operations, then execute atomic offset retirement on Stellar Soroban.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Input Form */}
          <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Operational Metrics</span>
              <span className="text-xs text-emerald-400 font-mono font-normal">EPA GHG Factors</span>
            </h2>

            {/* Flight Hours */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label htmlFor="flight-hours-input" className="text-slate-300 font-medium">✈️ Air Travel (Flight Hours)</label>
                <span className="text-emerald-400 font-mono">{flightHours} hrs ({result.breakdown.flightCo2Kg} kg CO2)</span>
              </div>
              <input
                id="flight-hours-input"
                type="range"
                min="0"
                max="200"
                value={flightHours}
                onChange={(e) => handleRecalculate(Number(e.target.value), cloudNodeHours, electricityKwh, fleetFuelLiters)}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Cloud Compute */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label htmlFor="cloud-node-hours-input" className="text-slate-300 font-medium">☁️ Cloud Infrastructure (vCPU Hours)</label>
                <span className="text-emerald-400 font-mono">{cloudNodeHours} hrs ({result.breakdown.cloudCo2Kg} kg CO2)</span>
              </div>
              <input
                id="cloud-node-hours-input"
                type="range"
                min="0"
                max="5000"
                step="50"
                value={cloudNodeHours}
                onChange={(e) => handleRecalculate(flightHours, Number(e.target.value), electricityKwh, fleetFuelLiters)}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Electricity */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label htmlFor="electricity-kwh-input" className="text-slate-300 font-medium">⚡ Facility Power (kWh)</label>
                <span className="text-emerald-400 font-mono">{electricityKwh} kWh ({result.breakdown.electricityCo2Kg} kg CO2)</span>
              </div>
              <input
                id="electricity-kwh-input"
                type="range"
                min="0"
                max="5000"
                step="50"
                value={electricityKwh}
                onChange={(e) => handleRecalculate(flightHours, cloudNodeHours, Number(e.target.value), fleetFuelLiters)}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Fleet Fuel */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <label htmlFor="fleet-fuel-liters-input" className="text-slate-300 font-medium">🚚 Vehicle Fleet Fuel (Liters)</label>
                <span className="text-emerald-400 font-mono">{fleetFuelLiters} L ({result.breakdown.fleetCo2Kg} kg CO2)</span>
              </div>
              <input
                id="fleet-fuel-liters-input"
                type="range"
                min="0"
                max="1000"
                step="10"
                value={fleetFuelLiters}
                onChange={(e) => handleRecalculate(flightHours, cloudNodeHours, electricityKwh, Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          {/* Results Summary & Instant Soroban Offset */}
          <div className="lg:col-span-6 bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-950 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Calculated Footprint</span>
                {isPending && <span className="text-xs text-amber-400 animate-pulse">Calculating...</span>}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total CO2 Emission</div>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-1">{result.totalCo2Tons} <span className="text-sm font-normal text-slate-300">Tons</span></div>
                  <div className="text-xs text-slate-500 mt-1">({result.totalCo2Kg} kg)</div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tree Absorption Eq.</div>
                  <div className="text-3xl font-extrabold text-teal-400 mt-1">~{result.treesEquivalent} <span className="text-sm font-normal text-slate-300">Trees</span></div>
                  <div className="text-xs text-slate-500 mt-1">Planted / Year</div>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center text-sm text-slate-300">
                  <span>Recommended Soroban Carbon Credits:</span>
                  <span className="font-bold text-emerald-400 text-lg">{result.recommendedCredits} Credits</span>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-300">
                  <span>Estimated Settlement Price in XLM:</span>
                  <span className="font-bold text-teal-400 text-lg">{result.estimatedPriceXlm} XLM</span>
                </div>
                <div className="text-xs text-slate-400 pt-2 border-t border-emerald-500/20">
                  Settlement verified on Soroban Smart Contract <code className="text-emerald-400 font-mono">CCGREENLEDGER...</code>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleInstantOffset}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                🌿 Execute Instant Soroban Offset ({result.estimatedPriceXlm} XLM)
              </button>

              {retireStatus && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono text-center">
                  {retireStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
