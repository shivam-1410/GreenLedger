import React from 'react';
import Link from 'next/link';
import { Leaf, ExternalLink, ShieldCheck } from 'lucide-react';
import { STELLAR_CONFIG } from '@/lib/config';

export function Footer() {
  return (
    <footer className="border-t border-emerald-500/20 bg-slate-950/90 text-slate-400 py-12 mt-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">GreenLedger</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decentralized carbon credit trading & retirement verification protocol on Stellar Soroban Smart Contracts.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Protocol Modules</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/marketplace" className="hover:text-emerald-400 transition-colors">
                  Carbon Credit Marketplace
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-emerald-400 transition-colors">
                  ESG Carbon Audit Calculator
                </Link>
              </li>
              <li>
                <Link href="/inspector" className="hover:text-emerald-400 transition-colors">
                  Soroban Contract Inspector
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-emerald-400 transition-colors">
                  Global ESG Impact Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Wallet Dashboard & Portfolio
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-emerald-400 transition-colors">
                  Product Analytics & SLA Telemetry
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-emerald-400 transition-colors">
                  User Feedback & CSAT Collector
                </Link>
              </li>
              <li>
                <Link href="/governance" className="hover:text-emerald-400 transition-colors">
                  Verifier Governance Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Stellar Ecosystem</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://developers.stellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  Stellar Developer Docs <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://soroban.stellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  Soroban Smart Contracts <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href={STELLAR_CONFIG.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  StellarExpert Testnet <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Network Info</h4>
            <div className="space-y-2 text-xs font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">Network:</span>
                <span className="text-emerald-400 font-semibold">Testnet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">RPC:</span>
                <span className="text-slate-300">soroban-testnet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contract ID:</span>
                <span className="text-emerald-300 truncate max-w-[100px]" title={STELLAR_CONFIG.contractId}>
                  {STELLAR_CONFIG.contractId.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 GreenLedger Protocol. Built with Next.js 15, StellarWalletsKit & Soroban SDK.</p>
          <div className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Stellar Level 4 Production MVP Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
