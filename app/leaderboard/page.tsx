'use client';

import { LEADERBOARD_DATA } from '@/lib/leaderboard';

export default function LeaderboardPage() {
  const totalOffsetTons = LEADERBOARD_DATA.reduce((acc, curr) => acc + curr.totalRetiredTons, 0);
  const totalXlmSpent = LEADERBOARD_DATA.reduce((acc, curr) => acc + curr.totalXlmSpent, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
            🏆 Global Climate Impact Rankings
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-amber-400 bg-clip-text text-transparent">
            ESG Leaderboard & Top Offsetters
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Honoring accredited climate contributors, enterprise ESG leaders, and community members retiring CO2 offset certificates on Stellar.
          </p>
        </div>

        {/* Global Impact Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl text-center">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total CO2 Retired</div>
            <div className="text-3xl font-extrabold text-amber-400 mt-2">{totalOffsetTons.toLocaleString()} <span className="text-base font-normal text-slate-300">Tons</span></div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl text-center">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total XLM Committed</div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-2">{totalXlmSpent.toLocaleString()} <span className="text-base font-normal text-slate-300">XLM</span></div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl text-center">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Verified Organizations</div>
            <div className="text-3xl font-extrabold text-teal-400 mt-2">{LEADERBOARD_DATA.filter((i) => i.verifiedOrg).length} <span className="text-base font-normal text-slate-300">Entities</span></div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-100">Top Climate Contributors</h2>
            <span className="text-xs text-emerald-400 font-mono">Live Soroban State</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="py-4 px-6">Rank</th>
                  <th className="py-4 px-6">Contributor / Organization</th>
                  <th className="py-4 px-6">CO2 Offset</th>
                  <th className="py-4 px-6">XLM Volume</th>
                  <th className="py-4 px-6">Impact Badges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {LEADERBOARD_DATA.map((entry) => (
                  <tr key={entry.walletAddress} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold font-mono">
                      {entry.rank === 1 ? '🥇 #1' : entry.rank === 2 ? '🥈 #2' : entry.rank === 3 ? '🥉 #3' : `#${entry.rank}`}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-200 flex items-center gap-2">
                        <span>{entry.displayName}</span>
                        {entry.verifiedOrg && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30">
                            Verified Org
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {entry.walletAddress.slice(0, 10)}...{entry.walletAddress.slice(-8)}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-amber-400">
                      {entry.totalRetiredTons} Tons
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-400">
                      {entry.totalXlmSpent.toLocaleString()} XLM
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {entry.badges.map((badge, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs border border-slate-700">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
