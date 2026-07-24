'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-lg space-y-6">
      <div className="h-16 w-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
        <FileQuestion className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">404 - Page Not Found</h1>
        <p className="text-sm text-slate-400">
          The page or contract view you are looking for does not exist on GreenLedger Protocol.
        </p>
      </div>

      <Link href="/">
        <Button variant="glow" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>
      </Link>
    </div>
  );
}
