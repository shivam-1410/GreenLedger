import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      timestamp: new Date().toISOString(),
      telemetry: {
        rpcLatencyMs: 114,
        activeUsers24h: 54,
        totalWalletInteractions: 52,
        contractCallsTotal: 389,
        uptimePercentage: 99.98,
        errorRatePercentage: 0.015,
        totalCo2Offset: 14850,
        totalXlmVolume: 54200,
        conversionFunnel: [
          { step: 'Page Views', count: 1840, percentage: 100 },
          { step: 'Wallet Connected', count: 420, percentage: 22.8 },
          { step: 'Marketplace Browse', count: 310, percentage: 16.8 },
          { step: 'Transaction Signed', count: 142, percentage: 7.7 },
          { step: 'CO2 Retired & Certified', count: 88, percentage: 4.8 },
        ],
        topInteractions: [
          { action: 'buy_credits', count: 68 },
          { action: 'retire_credits', count: 44 },
          { action: 'mint_project', count: 18 },
          { action: 'verify_issuer', count: 12 },
        ],
        recentErrorLogs: [
          {
            timestamp: Date.now() - 3600000 * 3,
            source: 'FreighterWalletBridge',
            message: 'User rejected transaction signature request',
            code: 'ERR_USER_REJECTED',
          },
          {
            timestamp: Date.now() - 3600000 * 14,
            source: 'SorobanRPC',
            message: 'RPC Horizon socket connection reset by peer (recovered automatically)',
            code: 'ERR_SOCKET_RESET',
          },
        ],
      },
    },
    { status: 200 }
  );
}
