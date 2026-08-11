'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Sparkles, X, CheckCircle2, ArrowRight } from 'lucide-react';

export function OnboardingBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('green_ledger_onboarding_dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('green_ledger_onboarding_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="relative z-30 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border-b border-emerald-500/30 text-slate-200 px-4 py-2.5 text-xs">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <span className="font-semibold text-white">Stellar Level 4 Production MVP:</span>{' '}
            <span className="text-slate-300">
              Onboard your wallet in 5 guided steps, claim testnet XLM, and explore 10+ real user wallet proof records.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Launch Wizard</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/proof"
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 hover:bg-slate-800"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>10+ Proofs</span>
          </Link>
          <button
            onClick={handleDismiss}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            title="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
