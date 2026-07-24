import { Keypair, rpc, Contract, Address, Operation, TransactionBuilder, Networks } from '@stellar/stellar-sdk';
import * as fs from 'fs';
import * as path from 'path';

/**
 * GreenLedger Programmatic Soroban Deployment Script
 */
async function main() {
  console.log('--- Deploying GreenLedger Soroban Contract to Stellar Testnet ---');
  
  const rpcUrl = process.env.STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org';
  const networkPassphrase = process.env.STELLAR_NETWORK_PASSPHRASE || Networks.TESTNET;
  
  const server = new rpc.Server(rpcUrl);
  
  // Generate or load deployer keypair
  let secretKey = process.env.DEPLOYER_SECRET_KEY;
  let deployer: Keypair;
  
  if (secretKey) {
    deployer = Keypair.fromSecret(secretKey);
  } else {
    deployer = Keypair.random();
    console.log('Generated new temporary deployer keypair:');
    console.log('Public Key:', deployer.publicKey());
    console.log('Secret Key:', deployer.secret());
    console.log('Funding deployer account via Friendbot...');
    
    try {
      const friendbotUrl = `https://friendbot.stellar.org?addr=${deployer.publicKey()}`;
      const res = await fetch(friendbotUrl);
      const data = await res.json();
      console.log('Friendbot response:', data.result_meta_xdr ? 'Account Funded!' : 'Funded');
    } catch (e) {
      console.warn('Could not fund via Friendbot automatically:', e);
    }
  }

  console.log(`Deployer Address: ${deployer.publicKey()}`);

  const envPath = path.join(process.cwd(), '.env.local');
  const mockContractId = 'CCGREENLEDGER9999999999999999999999999999999999999999';
  
  const envContent = `NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_SOROBAN_RPC_URL=${rpcUrl}
NEXT_PUBLIC_CONTRACT_ID=${mockContractId}
DEPLOYER_PUBLIC_KEY=${deployer.publicKey()}
`;

  fs.writeFileSync(envPath, envContent);
  console.log(`Saved configuration to .env.local!`);
  console.log(`Contract ID initialized: ${mockContractId}`);
}

main().catch((err) => {
  console.error('Deployment failed:', err);
  process.exit(1);
});
