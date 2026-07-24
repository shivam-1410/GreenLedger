'use client';

import React from 'react';
import { CarbonCredit } from '@/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { formatNumber, truncateAddress } from '@/lib/utils';
import { CheckCircle2, ShieldCheck, MapPin, Calendar, Trees, Flame, ShoppingCart, ExternalLink } from 'lucide-react';

interface CreditCardProps {
  credit: CarbonCredit;
  onBuy: (credit: CarbonCredit) => void;
  onRetire: (credit: CarbonCredit) => void;
  userOwnedAmount?: number;
}

export function CreditCard({ credit, onBuy, onRetire, userOwnedAmount = 0 }: CreditCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Reforestation':
        return 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300';
      case 'Solar Energy':
        return 'border-amber-500/40 bg-amber-950/60 text-amber-300';
      case 'Blue Carbon':
        return 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300';
      case 'Direct Air Capture':
        return 'border-purple-500/40 bg-purple-950/60 text-purple-300';
      default:
        return 'border-slate-700 bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="group relative rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-md overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/50 transition-all duration-300 flex flex-col">
      {/* Background Image / Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        {credit.image ? (
          <img
            src={credit.image}
            alt={credit.projectName}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-emerald-900/40 to-slate-900 flex items-center justify-center">
            <Trees className="h-16 w-16 text-emerald-500/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border backdrop-blur-md ${getTypeColor(credit.creditType)}`}>
            {credit.creditType}
          </span>
          {credit.isVerified && (
            <Badge variant="verified">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-400" /> Verra Verified
            </Badge>
          )}
        </div>

        {userOwnedAmount > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg">
            Owned: {userOwnedAmount} Tons
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            {credit.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" /> {credit.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-emerald-400" /> Vintage {credit.vintageYear}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
            {credit.projectName}
          </h3>
        </div>

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Available Supply</span>
            <span className="font-mono font-bold text-slate-200">
              {formatNumber(credit.availableSupply)} / {formatNumber(credit.totalSupply)} Tons
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Price per Ton</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {formatNumber(credit.pricePerTon, 2)} XLM
            </span>
          </div>
        </div>

        {/* Issuer Footer */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-800/80">
          <span>Issuer: {truncateAddress(credit.issuer)}</span>
          <a
            href={credit.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline flex items-center gap-0.5"
          >
            Certificate <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onBuy(credit)}
            disabled={credit.availableSupply <= 0}
            className="gap-1.5"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Buy Credits</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onRetire(credit)}
            className="gap-1.5"
          >
            <Flame className="h-4 w-4 text-amber-400" />
            <span>Retire CO2</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
