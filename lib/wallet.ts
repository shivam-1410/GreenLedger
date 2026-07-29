import {
  StellarWalletsKit,
  Networks,
} from '@creit.tech/stellar-wallets-kit';
import {
  isConnected as isFreighterInstalled,
  requestAccess as requestFreighterAccess,
  getPublicKey as getFreighterAddress,
  signTransaction as signFreighterTx,
  isAllowed as isFreighterAllowed,
} from '@stellar/freighter-api';
import { WalletType } from '@/types';

export const FREIGHTER_ID = 'freighter';
export const ALBEDO_ID = 'albedo';
export const XBULL_ID = 'xbull';
export const HANA_ID = 'hana';

export interface WalletConnectionResult {
  address: string;
  walletType: WalletType;
}

/**
 * Check if Freighter extension is installed and authorized (Wallet Permissions)
 */
export async function checkFreighterStatus(): Promise<boolean> {
  try {
    const res = await isFreighterInstalled();
    const isConnected = typeof res === 'boolean' ? res : (res as any)?.isConnected || false;
    if (!isConnected) return false;

    if (typeof isFreighterAllowed === 'function') {
      const allowedRes = await isFreighterAllowed();
      return typeof allowedRes === 'boolean' ? allowedRes : (allowedRes as any)?.isAllowed || false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Request wallet permissions and access (Wallet Permissions)
 */
export async function requestWalletAccess(walletId: string = FREIGHTER_ID): Promise<string> {
  if (walletId === FREIGHTER_ID) {
    const accessRes: any = await requestFreighterAccess();
    const address = typeof accessRes === 'string' ? accessRes : accessRes?.address;
    if (!address) {
      throw new Error('User denied access or no account found in Freighter wallet.');
    }
    return address;
  } else {
    StellarWalletsKit.setWallet(walletId);
    const { address } = await StellarWalletsKit.getAddress();
    return address;
  }
}

/**
 * Address Retrieval from active connected wallet (Address Retrieval)
 */
export async function getActiveWalletAddress(walletId: string = FREIGHTER_ID): Promise<string> {
  if (walletId === FREIGHTER_ID) {
    const addrObj: any = await getFreighterAddress();
    let address = typeof addrObj === 'string' ? addrObj : addrObj?.address;
    if (!address) {
      address = await requestWalletAccess(FREIGHTER_ID);
    }
    return address;
  } else {
    StellarWalletsKit.setWallet(walletId);
    const { address } = await StellarWalletsKit.getAddress();
    return address;
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
        // Still attempt access request if user has installed extension recently
        try {
          const address = await requestWalletAccess(FREIGHTER_ID);
          return { address, walletType: 'freighter' };
        } catch (err) {
          throw new Error('Freighter wallet extension is not installed or enabled in your browser. Please install it from https://www.freighter.app');
        }
      }

      // 2. Request permission access and address retrieval from Freighter
      const address = await getActiveWalletAddress(FREIGHTER_ID);
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

/**
 * Sign Transaction XDR via Freighter API or StellarWalletsKit (Transaction Signing)
 */
export async function signTransactionXdr(xdr: string, publicKey: string, walletType?: string): Promise<string> {
  try {
    if (walletType === 'freighter' || walletType === FREIGHTER_ID) {
      const res: any = await signFreighterTx(xdr, {
        networkPassphrase: 'Test SDF Network ; September 2015',
        accountToSign: publicKey,
        address: publicKey,
      } as any);
      return typeof res === 'string' ? res : res.signedTxXdr || res;
    }

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
