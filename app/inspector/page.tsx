'use client';

import { useState } from 'react';
import { INSPECTOR_CONTRACTS } from '@/lib/inspector';
import { getExplorerTxUrl } from '@/lib/utils';

export default function InspectorPage() {
  const [selectedContract, setSelectedContract] = useState(INSPECTOR_CONTRACTS[0]);
  const [activeTab, setActiveTab] = useState<'functions' | 'state' | 'events'>('functions');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
            🔍 On-Chain Soroban Contract Inspector
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
            Smart Contract State & XDR Decoder
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Inspect live Soroban contract WASM bytecode hashes, public entrypoints, state storage keys, and verifier governance registrations.
          </p>
        </div>

        {/* Contract Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INSPECTOR_CONTRACTS.map((contract) => (
            <button
              key={contract.contractId}
              onClick={() => setSelectedContract(contract)}
              className={`p-6 rounded-2xl text-left border transition-all duration-200 backdrop-blur-xl ${
                selectedContract.contractId === contract.contractId
                  ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
                  {contract.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">Ledger #{contract.deployedLedger}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">{contract.contractName}</h2>
              <p className="text-xs text-cyan-400/80 font-mono mt-2 truncate">{contract.contractId}</p>
            </button>
          ))}
        </div>

        {/* Selected Contract Details */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">{selectedContract.contractName}</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">Contract ID: {selectedContract.contractId}</p>
            </div>
            <a
              href={getExplorerTxUrl('fd95c8e3bc7893c38f3b4e7a49bea9849fe3ecc3c188306e0ee0482a39649018')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/20 transition-colors"
            >
              View on StellarExpert ↗
            </a>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium uppercase">WASM Bytecode Hash</div>
              <div className="text-xs text-cyan-400 font-mono mt-1 truncate">{selectedContract.wasmHash}</div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium uppercase">Deployment Ledger</div>
              <div className="text-lg font-bold text-slate-200 mt-1">#{selectedContract.deployedLedger}</div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium uppercase">Total Executions</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">{selectedContract.totalEvents} Calls</div>
            </div>
          </div>

          {/* Inspection Tabs */}
          <div className="space-y-4">
            <div className="flex gap-2 border-b border-slate-800 pb-2">
              {(['functions', 'state', 'events'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'functions' && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-300">Exported Soroban Entrypoints</h3>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 font-mono text-xs text-cyan-300">
                  {selectedContract.functions.map((fn, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded bg-slate-900/50 border border-slate-800/50">
                      <span className="text-slate-500">pub fn</span>
                      <span>{fn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'state' && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 space-y-2">
                <div>// Soroban Contract Instance Storage</div>
                <div>{"{"}</div>
                <div className="pl-4">"admin": "GAEQ5IUNQTW36XMQF6MR2VWKPG3JOF6IKEGAD2JQ6OUNKTUVBAIE5AO3",</div>
                <div className="pl-4">"total_minted_credits": 12500,</div>
                <div className="pl-4">"total_co2_retired": 4890,</div>
                <div className="pl-4">"verifier_registry_status": "ACTIVE_GOVERNANCE"</div>
                <div>{"}"}</div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-emerald-400">[EVENT] Minted credit #credit-1 by Verra Authority (100 Tons CO2)</div>
                <div className="text-cyan-400">[EVENT] Verifier registry approved issuer Gold Standard</div>
                <div className="text-teal-400">[EVENT] Retired 50 Tons CO2 credit #credit-1 with SHA-256 certificate</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
