import { NextResponse } from 'next/server';
import { MAINNET_USER_PROOFS } from '@/lib/mainnet_proofs';

export async function GET() {
  return NextResponse.json({
    success: true,
    totalMainnetUsers: MAINNET_USER_PROOFS.length,
    network: 'Stellar Public Mainnet',
    contractId: 'CDMAINNETGREENLEDGER99999999999999999999999999999999999999',
    proofs: MAINNET_USER_PROOFS,
  });
}
