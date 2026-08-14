import { NextResponse } from 'next/server';
import { LEADERBOARD_DATA } from '@/lib/leaderboard';

export async function GET() {
  const totalOffsetTons = LEADERBOARD_DATA.reduce((acc, curr) => acc + curr.totalRetiredTons, 0);
  const totalXlmSpent = LEADERBOARD_DATA.reduce((acc, curr) => acc + curr.totalXlmSpent, 0);

  return NextResponse.json({
    success: true,
    data: LEADERBOARD_DATA,
    summary: {
      totalContributors: LEADERBOARD_DATA.length,
      totalOffsetTons,
      totalXlmSpent,
      verifiedOrganizationsCount: LEADERBOARD_DATA.filter((item) => item.verifiedOrg).length,
    },
    updatedAt: new Date().toISOString(),
  });
}
