import { NextResponse } from 'next/server';
import { INITIAL_STAKING_POOLS, calculateStakingRewards } from '@/lib/staking';

export async function GET() {
  const totalTVLTons = INITIAL_STAKING_POOLS.reduce((acc, p) => acc + p.totalStakedTons, 0);

  return NextResponse.json({
    success: true,
    totalTVLTons,
    totalTVLXlm: totalTVLTons * 15,
    poolsCount: INITIAL_STAKING_POOLS.length,
    pools: INITIAL_STAKING_POOLS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stakedTons, aprPercentage } = body;

    const rewardMetrics = calculateStakingRewards(Number(stakedTons), Number(aprPercentage));

    return NextResponse.json({
      success: true,
      data: rewardMetrics,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
