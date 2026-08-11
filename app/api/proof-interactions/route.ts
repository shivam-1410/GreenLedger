import { NextResponse } from 'next/server';
import { PROOF_OF_INTERACTIONS } from '@/lib/proofs';

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      totalOnboardedUsers: PROOF_OF_INTERACTIONS.length,
      proofRequirementMet: PROOF_OF_INTERACTIONS.length >= 10,
      network: 'Stellar Testnet',
      contractAddress: 'CCGREENLEDGER9999999999999999999999999999999999999999',
      verifierRegistryAddress: 'CCVERIFIERREGISTRY9999999999999999999999999999999',
      proofs: PROOF_OF_INTERACTIONS,
    },
    { status: 200 }
  );
}
