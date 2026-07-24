import { Keypair } from '@stellar/stellar-sdk';
import * as fs from 'fs';
import * as path from 'path';

export interface WalletInfo {
  publicKey: string;
  secretKey: string;
}

/**
 * Task 1: Generate a new Stellar keypair/wallet
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
