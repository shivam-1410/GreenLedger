import { generateStellarWallet } from '../src/wallet';

function main() {
  console.log('Running Task 1: Wallet Creation...');
  const wallet = generateStellarWallet();
  console.log('\n✅ Task 1 Complete!');
  console.log(`Public Key: ${wallet.publicKey}`);
}

main();
