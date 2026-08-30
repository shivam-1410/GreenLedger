import { NextResponse } from 'next/server';
import { PROOF_OF_INTERACTIONS } from '@/lib/proofs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const limit = Number(searchParams.get('limit')) || 108;

  let proofs = PROOF_OF_INTERACTIONS;
  if (type) {
    proofs = proofs.filter((p) => p.entityType.toLowerCase() === type.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    totalOnboardedUsers: proofs.length,
    period: 'August 2026',
    uniqueAddressesCount: new Set(proofs.map((p) => p.walletAddress)).size,
    uniqueTxHashesCount: new Set(proofs.map((p) => p.txHash)).size,
    proofs: proofs.slice(0, limit),
  });
}
