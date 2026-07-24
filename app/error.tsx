'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled App Router Error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-lg space-y-6">
      <div className="h-16 w-16 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
        <AlertCircle className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Something Went Wrong</h2>
        <p className="text-sm text-slate-400">
          {error?.message || 'An unexpected error occurred while interacting with the Stellar application.'}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button
          variant="glow"
          onClick={() => reset()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    </div>
  );
}
