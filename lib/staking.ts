import { StakingPool, UserStakeRecord } from '@/types';

export const INITIAL_STAKING_POOLS: StakingPool[] = [
  {
    poolId: 'pool-amazon-reforest',
    creditId: '1',
    projectName: 'Amazon Basin High-Biochar Reforestation',
    creditType: 'Reforestation',
    aprPercentage: 14.8,
    totalStakedTons: 12450,
    rewardToken: 'GREEN-YIELD',
    dailyRewardRate: 48.5,
    status: 'ACTIVE',
    minStakeTons: 10,
  },
  {
    poolId: 'pool-nordic-wind',
    creditId: '2',
    projectName: 'Nordic Deep Offshore Wind Array',
    creditType: 'Wind Farm',
    aprPercentage: 11.2,
    totalStakedTons: 28900,
    rewardToken: 'GREEN-YIELD',
    dailyRewardRate: 88.0,
    status: 'ACTIVE',
    minStakeTons: 25,
  },
  {
    poolId: 'pool-sundarbans-mangrove',
    creditId: '3',
    projectName: 'Sundarbans Coastal Mangrove Blue Carbon',
    creditType: 'Blue Carbon',
    aprPercentage: 18.5,
    totalStakedTons: 8400,
    rewardToken: 'GREEN-YIELD',
    dailyRewardRate: 42.6,
    status: 'ACTIVE',
    minStakeTons: 5,
  },
  {
    poolId: 'pool-dac-mineralize',
    creditId: '4',
    projectName: 'Iceland Basalt Direct Air Mineralization',
    creditType: 'Direct Air Capture',
    aprPercentage: 22.0,
    totalStakedTons: 5600,
    rewardToken: 'GREEN-YIELD',
    dailyRewardRate: 33.8,
    status: 'ACTIVE',
    minStakeTons: 1,
  },
];

/**
 * Calculates estimated daily, monthly, and annual rewards for a given staked amount.
 */
export function calculateStakingRewards(stakedTons: number, aprPercentage: number): {
  dailyReward: number;
  monthlyReward: number;
  annualReward: number;
  compoundedApy: number;
} {
  if (stakedTons <= 0 || aprPercentage <= 0) {
    return { dailyReward: 0, monthlyReward: 0, annualReward: 0, compoundedApy: 0 };
  }

  const annualReward = (stakedTons * aprPercentage) / 100;
  const monthlyReward = annualReward / 12;
  const dailyReward = annualReward / 365;
  
  // Daily compounding APY formula: (1 + r/n)^n - 1
  const dailyRate = aprPercentage / 100 / 365;
  const compoundedApy = Number(((Math.pow(1 + dailyRate, 365) - 1) * 100).toFixed(2));

  return {
    dailyReward: Number(dailyReward.toFixed(4)),
    monthlyReward: Number(monthlyReward.toFixed(2)),
    annualReward: Number(annualReward.toFixed(2)),
    compoundedApy,
  };
}

/**
 * Creates or updates a user stake record.
 */
export function executeStakeTransaction(
  walletAddress: string,
  poolId: string,
  amountTons: number,
  existingStake?: UserStakeRecord
): { stake: UserStakeRecord; txHash: string } {
  const currentStaked = existingStake ? existingStake.stakedTons : 0;
  const newStaked = currentStaked + amountTons;
  const now = Date.now();

  const seed = `${walletAddress}:${poolId}:${amountTons}:${now}`;
  let hashNum = 0;
  for (let i = 0; i < seed.length; i++) {
    hashNum = (hashNum << 5) - hashNum + seed.charCodeAt(i);
    hashNum |= 0;
  }
  const txHash = `0x${Math.abs(hashNum).toString(16).padStart(16, '0')}${Date.now().toString(16).padStart(16, '0')}`.padEnd(66, 'f');

  const stake: UserStakeRecord = {
    walletAddress,
    poolId,
    stakedTons: newStaked,
    accumulatedRewards: existingStake ? existingStake.accumulatedRewards : 0,
    lastClaimTimestamp: now,
    stakedAt: existingStake ? existingStake.stakedAt : now,
  };

  return { stake, txHash };
}
