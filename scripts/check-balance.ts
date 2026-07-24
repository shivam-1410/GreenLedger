import { getAccountBalances } from '../src/balance';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
  const publicKey = process.env.STELLAR_PUBLIC_KEY || process.argv[2];
  if (!publicKey) {
    console.error('Error: STELLAR_PUBLIC_KEY is not set in .env.local or provided as CLI argument.');
    console.log('Usage: npm run whitebelt:balance <G...PUBLIC_KEY>');
    process.exit(1);
  }

  console.log('Running Task 2: Balance Retrieval...');
  await getAccountBalances(publicKey);
  console.log('\n✅ Task 2 Complete!');
}

main().catch((err) => {
  console.error('Error in balance check script:', err);
  process.exit(1);
});
