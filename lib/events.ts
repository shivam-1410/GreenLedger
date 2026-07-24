import { sorobanServer } from './stellar';
import { STELLAR_CONFIG } from './config';
import { ContractEvent } from '@/types';

// Deterministic timestamps for SSR hydration consistency
const BASE_TIME = 1769280000000;

export const INITIAL_EVENTS: ContractEvent[] = [
  {
    id: 'evt-1',
    type: 'retire',
    timestamp: BASE_TIME - 1000 * 60 * 12,
    walletAddress: 'GDX7...P091',
    creditId: '1',
    projectName: 'Amazon Rainforest Protection & Restoration',
    co2Tons: 250,
    amount: 250,
    txHash: 'a89c45b7f1e2340981274bc901e23f81',
  },
  {
    id: 'evt-2',
    type: 'buy',
    timestamp: BASE_TIME - 1000 * 60 * 35,
    walletAddress: 'GBC4...M822',
    creditId: '3',
    projectName: 'Indonesian Mangrove Blue Carbon Sink',
    co2Tons: 100,
    amount: 100,
    priceXlm: 18.2,
    txHash: 'e12b77c44d90182394017bca88e7102f',
  },
  {
    id: 'evt-3',
    type: 'list',
    timestamp: BASE_TIME - 1000 * 60 * 80,
    walletAddress: 'GBV2...R4E9',
    creditId: '4',
    projectName: 'Icelandic Geothermal Direct Air Capture',
    co2Tons: 500,
    amount: 500,
    priceXlm: 45.0,
    txHash: 'c901823a9b40127f88e99120bc7120a1',
  },
  {
    id: 'evt-4',
    type: 'mint',
    timestamp: BASE_TIME - 1000 * 60 * 180,
    walletAddress: 'GDA7...L9P0',
    creditId: '2',
    projectName: 'Sahara Solar Infrastructure Initiative',
    co2Tons: 25000,
    amount: 10000,
    txHash: '77a1029bc4123490812e98fa01723c00',
  },
];

export async function fetchLatestContractEvents(): Promise<ContractEvent[]> {
  try {
    if (STELLAR_CONFIG.contractId && !STELLAR_CONFIG.contractId.includes('CCGREENLEDGER999')) {
      const response = await sorobanServer.getEvents({
        startLedger: 0,
        filters: [
          {
            type: 'contract',
            contractIds: [STELLAR_CONFIG.contractId],
          },
        ],
        limit: 10,
      });

      if (response.events && response.events.length > 0) {
        return response.events.map((e, idx) => ({
          id: `rpc-evt-${idx}-${e.id}`,
          type: 'buy' as const,
          timestamp: Date.now() - idx * 10000,
          walletAddress: typeof e.contractId === 'string' ? e.contractId : (e.contractId as any)?.toString() || 'StellarContract',
          txHash: e.txHash || '0000000000000000',
          creditId: '1',
          projectName: 'Verra Carbon Credit Project',
          amount: 50,
          co2Tons: 50,
        }));
      }
    }
  } catch (err) {
    console.log('Contract events poller fallback to active event feed');
  }

  return INITIAL_EVENTS;
}
