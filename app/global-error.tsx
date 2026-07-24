'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md space-y-6">
          <div className="h-16 w-16 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
            <AlertCircle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Application Error</h1>
            <p className="text-sm text-slate-400">
              {error?.message || 'A global error occurred on GreenLedger.'}
            </p>
          </div>

          <Button variant="glow" onClick={() => reset()} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Reset Application
          </Button>
        </div>
      </body>
    </html>
  );
}
