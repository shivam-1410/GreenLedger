import {
  Horizon,
  Keypair,
  TransactionBuilder,
  Operation,
  Asset,
  Networks,
} from '@stellar/stellar-sdk';
import { STELLAR_CONFIG } from '../lib/config';

import { fundWithFriendbot } from './balance';

const server = new Horizon.Server(STELLAR_CONFIG.horizonUrl);

export interface TransactionResult {
  successful: boolean;
  hash: string;
  ledger?: number;
  explorerUrl: string;
}

/**
 * Task 3: Execute & Broadcast First Stellar On-Chain Transaction
 */
export async function executeFirstTransaction(
  senderSecretKey: string,
  destinationPublicKey?: string,
  amountXlm = '10'
): Promise<TransactionResult> {
  console.log('====================================================');
  console.log('🚀 STELLAR WHITE BELT — TASK 3: FIRST TRANSACTION');
  console.log('====================================================');

  const senderKeypair = Keypair.fromSecret(senderSecretKey);
  const senderPublicKey = senderKeypair.publicKey();

  // Ensure valid destination address (create & fund receiver if not provided)
  let destAddress = destinationPublicKey;
  if (!destAddress) {
    const tempReceiver = Keypair.random();
    destAddress = tempReceiver.publicKey();
    console.log(`Creating & funding temporary receiver account: ${destAddress}...`);
    await fundWithFriendbot(destAddress);
  }

  console.log(`Sender Address      : ${senderPublicKey}`);
  console.log(`Destination Address : ${destAddress}`);
  console.log(`Payment Amount      : ${amountXlm} XLM`);

  try {
    // 1. Load sender account from network to get sequence number
    console.log('Loading sender account sequence from Stellar Testnet...');
    const senderAccount = await server.loadAccount(senderPublicKey);

    // 2. Build payment transaction
    console.log('Building transaction with Operation.payment...');
    const tx = new TransactionBuilder(senderAccount, {
      fee: '100', // BASE_FEE in stroops
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: destAddress,
          asset: Asset.native(),
          amount: amountXlm,
        })
      )
      .setTimeout(30)
      .build();

    // 3. Sign transaction with sender secret key
    console.log('Signing transaction with cryptographic secret key...');
    tx.sign(senderKeypair);

    // 4. Submit signed transaction to Horizon server
    console.log('Submitting transaction to Stellar Testnet network...');
    const response = await server.submitTransaction(tx);

    const explorerUrl = `${STELLAR_CONFIG.explorerUrl}/tx/${response.hash}`;

    console.log('----------------------------------------------------');
    console.log('🎉 TRANSACTION SUCCESSFUL!');
    console.log(`Tx Hash      : ${response.hash}`);
    console.log(`Ledger Block : ${response.ledger}`);
    console.log(`Explorer Link: ${explorerUrl}`);
    console.log('----------------------------------------------------');

    return {
      successful: true,
      hash: response.hash,
      ledger: response.ledger,
      explorerUrl,
    };
  } catch (error: any) {
    console.error('❌ Transaction execution failed:');
    if (error.response?.data?.extras?.result_codes) {
      console.error('Result Codes:', error.response.data.extras.result_codes);
    } else {
      console.error(error.message || error);
    }
    throw new Error(`Transaction failed: ${error.message || 'On-chain error'}`);
  }
}
