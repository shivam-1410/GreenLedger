import { describe, it, expect } from 'vitest';
import { calculateStakingRewards, executeStakeTransaction, INITIAL_STAKING_POOLS } from '../lib/staking';

describe('Carbon Credit Staking & Liquidity Yield Test Suite', () => {
  it('should calculate accurate daily, monthly, and compounded annual staking rewards', () => {
    const rewards = calculateStakingRewards(100, 12); // 100 Tons at 12% APR

    expect(rewards.annualReward).toBe(12);
    expect(rewards.monthlyReward).toBe(1.0);
    expect(rewards.dailyReward).toBeCloseTo(0.0329, 3);
    expect(rewards.compoundedApy).toBeGreaterThan(12.0);
    expect(rewards.compoundedApy).toBeCloseTo(12.75, 1);
  });

  it('should execute stake transaction and generate valid cryptographic transaction receipt', () => {
    const pubKey = 'GAEQ5IUNQTW36XMQF6MR2VWKPG3JOF6IKEGAD2JQ6OUNKTUVBAIE5AO3';
    const pool = INITIAL_STAKING_POOLS[0];

    const { stake, txHash } = executeStakeTransaction(pubKey, pool.poolId, 50);

    expect(stake.walletAddress).toBe(pubKey);
    expect(stake.poolId).toBe(pool.poolId);
    expect(stake.stakedTons).toBe(50);
    expect(txHash).toMatch(/^0x[a-f0-9]+$/i);
  });

  it('should correctly accumulate staked balances on consecutive stake deposits', () => {
    const pubKey = 'GAEQ5IUNQTW36XMQF6MR2VWKPG3JOF6IKEGAD2JQ6OUNKTUVBAIE5AO3';
    const pool = INITIAL_STAKING_POOLS[1];

    const first = executeStakeTransaction(pubKey, pool.poolId, 30);
    const second = executeStakeTransaction(pubKey, pool.poolId, 45, first.stake);

    expect(second.stake.stakedTons).toBe(75);
  });
});
