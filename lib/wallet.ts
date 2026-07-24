import {
  StellarWalletsKit,
  Networks,
} from '@creit.tech/stellar-wallets-kit';
import { WalletType } from '@/types';

export const FREIGHTER_ID = 'freighter';
export const ALBEDO_ID = 'albedo';
export const XBULL_ID = 'xbull';

export interface WalletConnectionResult {
  address: string;
  walletType: WalletType;
}

export async function connectWallet(walletId: string): Promise<WalletConnectionResult> {
  try {
    StellarWalletsKit.setWallet(walletId);
    const { address } = await StellarWalletsKit.getAddress();

    let type: WalletType = 'freighter';
    if (walletId === ALBEDO_ID) type = 'albedo';
    else if (walletId === XBULL_ID) type = 'xbull';
    else if (walletId.includes('hana')) type = 'hana';
    else if (walletId.includes('rango')) type = 'rango';
    else if (walletId.includes('walletconnect')) type = 'walletconnect';

    return {
      address,
      walletType: type,
    };
  } catch (error: any) {
    console.error('Wallet connection error:', error);

    const msg = error?.message?.toLowerCase() || '';
    if (msg.includes('not installed') || msg.includes('missing') || msg.includes('not found')) {
      throw new Error(`The selected wallet extension is not installed in your browser.`);
    } else if (msg.includes('user rejected') || msg.includes('cancelled') || msg.includes('declined')) {
      throw new Error('Wallet connection request was rejected by the user.');
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
