import { executeFirstTransaction } from '../src/transaction';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function main() {
  const secretKey = process.env.STELLAR_SECRET_KEY;
  if (!secretKey) {
    console.error('Error: STELLAR_SECRET_KEY is not set in .env.local.');
    console.log('Please run "npm run whitebelt:wallet" first to generate a wallet.');
    process.exit(1);
  }

  console.log('Running Task 3: First On-Chain Transaction...');
  const result = await executeFirstTransaction(secretKey);
  console.log('\n✅ Task 3 Complete!');
  console.log(`Explorer Link: ${result.explorerUrl}`);
}

main().catch((err) => {
  console.error('Error in send transaction script:', err);
  process.exit(1);
});
