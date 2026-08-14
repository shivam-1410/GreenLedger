'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWalletStore } from '@/store/useWalletStore';
import { WalletModal } from './wallet-modal';
import { Button } from './ui/button';
import { truncateAddress, formatNumber } from '@/lib/utils';
import {
  Leaf,
  Wallet,
  Activity,
  ShoppingBag,
  History,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Compass,
  BarChart3,
  MessageSquare,
  CheckCircle2,
  Calculator,
  SearchCode,
  Trophy,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { isConnected, publicKey, xlmBalance, disconnect, network } = useWalletStore();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: Leaf },
    { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/calculator', label: 'Calculator', icon: Calculator },
    { href: '/inspector', label: 'Inspector', icon: SearchCode },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/governance', label: 'Governance', icon: ShieldCheck },
    { href: '/onboarding', label: 'Onboarding', icon: Compass },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/feedback', label: 'Feedback', icon: MessageSquare },
    { href: '/proof', label: 'Proof 10+', icon: CheckCircle2 },
    { href: '/activity', label: 'Activity', icon: Activity },
    { href: '/transactions', label: 'Tx History', icon: History },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-emerald-500/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="h-6 w-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                GreenLedger
              </span>
              <span className="text-[10px] font-semibold text-emerald-400/90 -mt-1 tracking-wider uppercase">
                Soroban Protocol
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80 overflow-x-auto max-w-2xl">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Area: Network Pill + Wallet Connect */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{network}</span>
            </div>

            {isConnected && publicKey ? (
              <div className="flex items-center gap-2">
                <div className="hidden xl:flex flex-col items-end px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Balance</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {formatNumber(xlmBalance, 2)} XLM
                  </span>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-emerald-500/30">
                  <div className="px-2.5 py-1 text-xs font-mono font-semibold text-emerald-300">
                    {truncateAddress(publicKey, 4)}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={disconnect}
                    className="h-7 w-7 p-0 text-slate-400 hover:text-red-400 hover:bg-red-950/40"
                    title="Disconnect Wallet"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="glow"
                size="sm"
                onClick={() => setIsWalletModalOpen(true)}
                className="gap-2"
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Connect Wallet</span>
              </Button>
            )}

            {/* Mobile Drawer Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden p-4 border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl space-y-2 animate-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
}
