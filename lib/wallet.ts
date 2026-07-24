import {
  StellarWalletsKit,
  Networks,
} from '@creit.tech/stellar-wallets-kit';
import {
  isConnected as isFreighterInstalled,
  requestAccess as requestFreighterAccess,
  getAddress as getFreighterAddress,
} from '@stellar/freighter-api';
import { WalletType } from '@/types';

export const FREIGHTER_ID = 'freighter';
export const ALBEDO_ID = 'albedo';
export const XBULL_ID = 'xbull';

export interface WalletConnectionResult {
  address: string;
  walletType: WalletType;
}

/**
 * Check if Freighter extension is installed in the browser
 */
export async function checkFreighterStatus(): Promise<boolean> {
  try {
    const res = await isFreighterInstalled();
    return typeof res === 'boolean' ? res : (res as any)?.isConnected || false;
  } catch (e) {
    return false;
  }
}

/**
 * Connect to user wallet (Freighter, Albedo, xBull, Hana)
 */
export async function connectWallet(walletId: string): Promise<WalletConnectionResult> {
  try {
    if (walletId === FREIGHTER_ID) {
      // 1. Check if Freighter extension exists
      const installed = await checkFreighterStatus();
      if (!installed) {
        throw new Error('Freighter wallet extension is not installed in your browser. Please install it from https://www.freighter.app');
      }

      // 2. Request permission access from Freighter
      const accessRes = await requestFreighterAccess();
      let address = typeof accessRes === 'string' ? accessRes : accessRes?.address;

      if (!address) {
        const addrObj = await getFreighterAddress();
        address = typeof addrObj === 'string' ? addrObj : addrObj?.address;
      }

      if (!address) {
        throw new Error('User denied access or no account found in Freighter wallet.');
      }

      return {
        address,
        walletType: 'freighter',
      };
    } else {
      // Use StellarWalletsKit for Albedo, xBull, Hana
      StellarWalletsKit.setWallet(walletId);
      const { address } = await StellarWalletsKit.getAddress();

      let type: WalletType = 'albedo';
      if (walletId === XBULL_ID) type = 'xbull';
      else if (walletId.includes('hana')) type = 'hana';

      return {
        address,
        walletType: type,
      };
    }
  } catch (error: any) {
    console.error('Wallet connection error:', error);

    const msg = error?.message?.toLowerCase() || '';
    if (msg.includes('not installed') || msg.includes('missing') || msg.includes('not found')) {
      throw new Error(`Freighter wallet extension is not installed. Install it from https://www.freighter.app`);
    } else if (msg.includes('user rejected') || msg.includes('denied') || msg.includes('cancelled') || msg.includes('declined')) {
      throw new Error('Wallet connection request was rejected by user.');
    } else {
      throw new Error(error?.message || 'Failed to connect wallet. Please try again.');
    }
  }
}

export async function signTransactionXdr(xdr: string, publicKey: string): Promise<string> {
  try {
    const res: any = await StellarWalletsKit.signTransaction(xdr, {
      address: publicKey,
      networkPassphrase: 'Test SDF Network ; September 2015',
    });
    return typeof res === 'string' ? res : res.signedTxXdr || res;
  } catch (error: any) {
    console.error('Transaction signing error:', error);
    const msg = error?.message?.toLowerCase() || '';

    if (msg.includes('user rejected') || msg.includes('declined') || msg.includes('cancel')) {
      throw new Error('Transaction signing rejected by user.');
    } else if (msg.includes('insufficient') || msg.includes('balance')) {
      throw new Error('Insufficient XLM balance to complete gas fee/transaction.');
    } else {
      throw new Error(error?.message || 'Failed to sign transaction with wallet.');
    }
  }
}

export function disconnectWallet() {
  try {
    StellarWalletsKit.disconnect();
  } catch (e) {
    // safe catch
  }
}
