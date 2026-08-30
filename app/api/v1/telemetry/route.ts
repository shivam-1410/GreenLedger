import { NextResponse } from 'next/server';
import { MOCK_MRV_SENSORS } from '@/lib/oracle';
import { INITIAL_DAO_PROPOSALS } from '@/lib/governance';
import { INITIAL_STAKING_POOLS } from '@/lib/staking';

export async function GET() {
  return NextResponse.json({
    protocol: 'GreenLedger Level 5 Blue Belt Enterprise Protocol',
    version: '5.0.0',
    network: 'Stellar Testnet',
    uptime: '99.98%',
    activeSensors: MOCK_MRV_SENSORS.length,
    activeDaoProposals: INITIAL_DAO_PROPOSALS.length,
    activeStakingPools: INITIAL_STAKING_POOLS.length,
    timestamp: Date.now(),
    contracts: {
      greenLedger: 'CCGREENLEDGER9999999999999999999999999999999999999999',
      verifierRegistry: 'CCVERIFIERREGISTRY9999999999999999999999999999999',
    },
  });
}
