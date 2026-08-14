import { NextResponse } from 'next/server';
import { INSPECTOR_CONTRACTS } from '@/lib/inspector';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INSPECTOR_CONTRACTS,
    network: 'Stellar Testnet',
    sorobanRpc: 'https://soroban-testnet.stellar.org',
    horizonEndpoint: 'https://horizon-testnet.stellar.org',
    timestamp: new Date().toISOString(),
  });
}
