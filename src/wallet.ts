import { Keypair } from '@stellar/stellar-sdk';
import {
  isConnected as isFreighterConnected,
  requestAccess as requestFreighterAccess,
  getAddress as getFreighterAddress,
  signTransaction as signFreighterTx,
  isAllowed as isFreighterAllowed,
} from '@stellar/freighter-api';
import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';
import * as fs from 'fs';
import * as path from 'path';

export interface WalletInfo {
  publicKey: string;
  secretKey: string;
}

/**
 * Task 1: Generate a new Stellar keypair/wallet (CLI)
 */
export function generateStellarWallet(): WalletInfo {
  const pair = Keypair.random();
  const publicKey = pair.publicKey();
  const secretKey = pair.secret();

  console.log('====================================================');
  console.log('🔑 STELLAR WHITE BELT — TASK 1: WALLET CREATION');
  console.log('====================================================');
  console.log(`Public Key (Address) : ${publicKey}`);
  console.log(`Secret Key (Private) : ${secretKey.slice(0, 5)}...[HIDDEN]`);
  console.log('----------------------------------------------------');

  saveKeysToEnv(publicKey, secretKey);

  return { publicKey, secretKey };
}

/**
 * Check if Freighter extension is installed and allowed in the browser (Wallet Permissions)
 */
export async function checkFreighterPermissions(): Promise<boolean> {
  try {
    const connectedRes = await isFreighterConnected();
    const isConnected = typeof connectedRes === 'boolean' ? connectedRes : (connectedRes as any)?.isConnected || false;
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
 * Request wallet access permission from Freighter extension (Wallet Permissions)
 */
export async function requestWalletPermissions(): Promise<string> {
  const accessRes = await requestFreighterAccess();
  const address = typeof accessRes === 'string' ? accessRes : (accessRes as any)?.address;
  if (!address) {
    throw new Error('Wallet access request was rejected or no account found in Freighter');
  }
  return address;
}

/**
 * Retrieve active account address/public key from Freighter or StellarWalletsKit (Address Retrieval)
 */
export async function getWalletAddress(walletId: string = 'freighter'): Promise<string> {
  if (walletId === 'freighter') {
    const addrRes = await getFreighterAddress();
    const address = typeof addrRes === 'string' ? addrRes : (addrRes as any)?.address;
    if (!address) {
      return requestWalletPermissions();
    }
    return address;
  } else {
    StellarWalletsKit.setWallet(walletId);
    const { address } = await StellarWalletsKit.getAddress();
    return address;
  }
}

/**
 * Sign Stellar Transaction XDR using wallet library (Transaction Signing)
 */
export async function signTransactionWithWallet(
  xdr: string,
  publicKey?: string,
  walletId: string = 'freighter'
): Promise<string> {
  if (walletId === 'freighter') {
    const res: any = await signFreighterTx(xdr, {
      networkPassphrase: 'Test SDF Network ; September 2015',
      address: publicKey,
    });
    return typeof res === 'string' ? res : res.signedTxXdr || res;
  } else {
    const res: any = await StellarWalletsKit.signTransaction(xdr, {
      address: publicKey,
      networkPassphrase: 'Test SDF Network ; September 2015',
    });
    return typeof res === 'string' ? res : res.signedTxXdr || res;
  }
}

/**
 * Helper to save keys securely into .env.local (ignored by git)
 */
function saveKeysToEnv(publicKey: string, secretKey: string) {
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Replace or append keys
  if (envContent.includes('STELLAR_PUBLIC_KEY=')) {
    envContent = envContent.replace(/STELLAR_PUBLIC_KEY=.*/g, `STELLAR_PUBLIC_KEY=${publicKey}`);
  } else {
    envContent += `\nSTELLAR_PUBLIC_KEY=${publicKey}`;
  }

  if (envContent.includes('STELLAR_SECRET_KEY=')) {
    envContent = envContent.replace(/STELLAR_SECRET_KEY=.*/g, `STELLAR_SECRET_KEY=${secretKey}`);
  } else {
    envContent += `\nSTELLAR_SECRET_KEY=${secretKey}`;
  }

  fs.writeFileSync(envPath, envContent.trim() + '\n');
  console.log('🔒 Secret & Public keys stored safely in .env.local (git-ignored)');
}
