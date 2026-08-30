'use client';

import React, { useState } from 'react';
import { INITIAL_STAKING_POOLS, calculateStakingRewards, executeStakeTransaction } from '@/lib/staking';
import { StakingPool, UserStakeRecord } from '@/types';
import { useWalletStore } from '@/store/useWalletStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  Coins,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Calculator,
} from 'lucide-react';
import { toast } from 'sonner';

export default function StakingPage() {
  const { isConnected, publicKey } = useWalletStore();
  const [pools] = useState<StakingPool[]>(INITIAL_STAKING_POOLS);
  const [selectedPool, setSelectedPool] = useState<StakingPool>(pools[0]);
  const [stakeAmount, setStakeAmount] = useState<number>(50);
  const [userStakes, setUserStakes] = useState<Record<string, UserStakeRecord>>({});
  const [isStaking, setIsStaking] = useState(false);

  const rewardEstimates = calculateStakingRewards(stakeAmount, selectedPool.aprPercentage);

  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !publicKey) {
      toast.error('Please connect your Stellar wallet to stake carbon credits.');
      return;
    }

    if (stakeAmount < selectedPool.minStakeTons) {
      toast.error(`Minimum stake amount is ${selectedPool.minStakeTons} Tons.`);
      return;
    }

    setIsStaking(true);
    setTimeout(() => {
      const existing = userStakes[selectedPool.poolId];
      const { stake, txHash } = executeStakeTransaction(publicKey, selectedPool.poolId, stakeAmount, existing);

      setUserStakes((prev) => ({ ...prev, [selectedPool.poolId]: stake }));
      setIsStaking(false);
      toast.success(`Successfully staked ${stakeAmount} Tons in ${selectedPool.projectName}!`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 border-b border-emerald-500/20 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-emerald-950/60 text-emerald-400 border-emerald-500/40 gap-1.5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" />
              Stellar Level 5 Feature
            </Badge>
            <Badge variant="secondary" className="bg-teal-950 text-teal-300 border border-teal-500/30">
              DeFi Carbon Yield Farming
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
            Carbon Credit Staking & Liquidity Pools
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Deposit accredited carbon credits into Soroban staking pools to earn GREEN-YIELD governance tokens and automated offset liquidity yields.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Value Locked</p>
                <p className="text-2xl font-bold text-white">55,350 Tons</p>
                <p className="text-[11px] text-emerald-400 font-medium">≈ 830,250 XLM TVL</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Max Staking APY</p>
                <p className="text-2xl font-bold text-emerald-400">22.0% APR</p>
                <p className="text-[11px] text-teal-400 font-medium">Daily Auto-Compounding</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Coins className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rewards Distributed</p>
                <p className="text-2xl font-bold text-white">212,400 G-YIELD</p>
                <p className="text-[11px] text-cyan-400 font-medium">Real-Time Distribution</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Soroban Staking Vault</p>
                <p className="text-2xl font-bold text-white">Multi-Sig Locked</p>
                <p className="text-[11px] text-amber-400 font-medium">Audited Smart Contracts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Pool Selection List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Coins className="h-5 w-5 text-emerald-400" />
              Active Staking Liquidity Pools ({pools.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pools.map((pool) => {
                const isSelected = selectedPool.poolId === pool.poolId;
                const userStake = userStakes[pool.poolId];
                return (
                  <Card
                    key={pool.poolId}
                    onClick={() => setSelectedPool(pool)}
                    className={`cursor-pointer transition-all duration-200 bg-slate-900/80 hover:bg-slate-800/80 border ${
                      isSelected
                        ? 'border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/10'
                        : 'border-slate-800'
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
                          {pool.creditType}
                        </Badge>
                        <span className="text-xs font-mono font-bold text-emerald-400">{pool.aprPercentage}% APR</span>
                      </div>
                      <CardTitle className="text-base text-white font-bold mt-1">{pool.projectName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Total Pool Stake:</span>
                        <span className="font-bold text-white">{pool.totalStakedTons.toLocaleString()} Tons</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Daily Emission:</span>
                        <span className="font-mono text-teal-300">{pool.dailyRewardRate} {pool.rewardToken}/day</span>
                      </div>
                      {userStake && (
                        <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex justify-between items-center text-emerald-300 font-bold">
                          <span>Your Active Stake:</span>
                          <span>{userStake.stakedTons} Tons</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Right: Staking Action & APY Calculator */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                  <Lock className="h-5 w-5 text-emerald-400" />
                  Deposit Carbon Credits
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Stake into {selectedPool.projectName}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <form onSubmit={handleStake} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Stake Amount (Tons of CO2)
                    </label>
                    <Input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(Number(e.target.value))}
                      min={selectedPool.minStakeTons}
                      className="bg-slate-950 border-slate-800 text-white font-mono text-base focus:border-emerald-500"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Minimum Stake: {selectedPool.minStakeTons} Tons
                    </span>
                  </div>

                  {/* Rewards Breakdown Box */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Daily Return:</span>
                      <span className="font-mono text-emerald-400 font-bold">{rewardEstimates.dailyReward} G-YIELD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monthly Return:</span>
                      <span className="font-mono text-emerald-400 font-bold">{rewardEstimates.monthlyReward} G-YIELD</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1.5">
                      <span className="text-slate-400">Effective APY (Compounded):</span>
                      <span className="font-mono text-teal-300 font-bold">{rewardEstimates.compoundedApy}%</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isStaking}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-6 gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <Zap className="h-5 w-5" />
                    {isStaking ? 'Executing Soroban Staking Contract...' : `Stake ${stakeAmount} CO2 Credits`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
