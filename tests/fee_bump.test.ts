import { describe, it, expect } from 'vitest';
import { buildFeeSponsoredTransaction, PROTOCOL_FEE_SPONSOR_ACCOUNT } from '../lib/fee_bump';

describe('Level 6 Advanced Feature: Gasless Fee Sponsorship (SEP-0015) Test Suite', () => {
  it('should build a sponsored fee-bump transaction with valid sponsor account', () => {
    const res = buildFeeSponsoredTransaction({
      innerTxXdr: 'AAAAAExampleInnerTransactionXDR',
      userPublicKey: 'GAEQ5IUNQTW36XMQF6MR2VWKPG3JOF6IKEGAD2JQ6OUNKTUVBAIE5AO3',
      operationType: 'RETIRE_CREDIT',
      baseFeeStroops: 100,
    });

    expect(res.isSponsored).toBe(true);
    expect(res.sponsorAccount).toBe(PROTOCOL_FEE_SPONSOR_ACCOUNT);
    expect(res.sponsoredFeeStroops).toBe(200);
    expect(res.sponsoredFeeXlm).toBeGreaterThan(0);
    expect(res.feeBumpTxXdr).toContain('FeeBumpEnvelope');
    expect(res.sponsorshipHash).toMatch(/^0x[a-f0-9]+$/i);
  });
});
