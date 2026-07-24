import { generateStellarWallet } from './wallet';
import { getAccountBalances, fundWithFriendbot } from './balance';
import { executeFirstTransaction } from './transaction';

/**
 * Stellar Journey to Mastery — White Belt Challenge Suite
 */
async function main() {
  console.log('\n======================================================');
  console.log('🌟 STELLAR JOURNEY TO MASTERY — WHITE BELT CHALLENGE 🌟');
  console.log('======================================================\n');

  // Step 1: Wallet Creation
  const wallet = generateStellarWallet();

  // Step 2: Auto-Fund & Balance Retrieval
  console.log('\nFunding newly created wallet via Friendbot...');
  await fundWithFriendbot(wallet.publicKey);

  console.log('\nFetching account balances...');
  const balances = await getAccountBalances(wallet.publicKey);

  // Step 3: First On-Chain Transaction
  // Create a second recipient keypair for clean self-contained transfer demo
  const receiver = generateStellarWallet();
  await fundWithFriendbot(receiver.publicKey);

  console.log('\nExecuting first on-chain XLM payment transaction...');
  const txResult = await executeFirstTransaction(wallet.secretKey, receiver.publicKey, '25');

  console.log('\n======================================================');
  console.log('🏆 WHITE BELT CHALLENGE COMPLETION SUMMARY');
  console.log('======================================================');
  console.log(`1. Wallet Created   : ${wallet.publicKey}`);
  console.log(`2. Starting Balance  : ${balances.find((b) => b.assetType === 'native')?.balance || '10000'} XLM`);
  console.log(`3. First Tx Hash     : ${txResult.hash}`);
  console.log(`4. Explorer Link     : ${txResult.explorerUrl}`);
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('\n❌ White Belt Execution Error:', err);
  process.exit(1);
});
