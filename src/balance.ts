import { Horizon } from '@stellar/stellar-sdk';
import { STELLAR_CONFIG } from '../lib/config';

export interface BalanceItem {
  assetType: string;
  balance: string;
  assetCode?: string;
  assetIssuer?: string;
}

const server = new Horizon.Server(STELLAR_CONFIG.horizonUrl);

/**
 * Task 2: Fetch Account Balances from Stellar Testnet
 */
export async function getAccountBalances(publicKey: string): Promise<BalanceItem[]> {
  console.log('====================================================');
  console.log('💰 STELLAR WHITE BELT — TASK 2: BALANCE RETRIEVAL');
  console.log('====================================================');
  console.log(`Connecting to Horizon RPC: ${STELLAR_CONFIG.horizonUrl}`);
  console.log(`Fetching balances for: ${publicKey}...`);

  try {
    const account = await server.loadAccount(publicKey);
    const balances: BalanceItem[] = account.balances.map((b: any) => ({
      assetType: b.asset_type,
      balance: b.balance,
      assetCode: b.asset_code,
      assetIssuer: b.asset_issuer,
    }));

    console.log('----------------------------------------------------');
    console.log(`SUCCESS: Found ${balances.length} asset balance(s):`);
    balances.forEach((b) => {
      if (b.assetType === 'native') {
        console.log(` ➔ XLM (Native): ${b.balance} XLM`);
      } else {
        console.log(` ➔ ${b.assetCode}: ${b.balance} (Issuer: ${b.assetIssuer})`);
      }
    });
    console.log('----------------------------------------------------');

    return balances;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      console.warn('⚠️ Account not yet funded on Stellar Testnet.');
      console.log('Attempting automated Friendbot funding...');
      const funded = await fundWithFriendbot(publicKey);
      if (funded) {
        return getAccountBalances(publicKey);
      }
    }

    console.error('❌ Balance retrieval error:', error.message || error);
    throw new Error(`Failed to retrieve balances: ${error.message || 'Unknown network error'}`);
  }
}

/**
 * Helper to auto-fund testnet account via Friendbot
 */
export async function fundWithFriendbot(publicKey: string): Promise<boolean> {
  try {
    const friendbotUrl = `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`;
    const res = await fetch(friendbotUrl);
    if (res.ok) {
      console.log('✅ Friendbot funding successful! 10,000 Testnet XLM granted.');
      return true;
    } else {
      console.error('Friendbot response failed:', res.statusText);
      return false;
    }
  } catch (err: any) {
    console.error('Friendbot funding error:', err.message || err);
    return false;
  }
}
