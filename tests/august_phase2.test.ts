import { describe, it, expect } from 'vitest';
import { PROOF_OF_INTERACTIONS } from '../lib/proofs';
import { isValidStellarAddress } from '../lib/stellar';

describe('August Level 4 Phase 2 Integration Suite', () => {
  it('validates 20 total verified live Stellar testnet user proof records', () => {
    expect(PROOF_OF_INTERACTIONS.length).toBe(20);
    PROOF_OF_INTERACTIONS.forEach((proof) => {
      expect(proof.verified).toBe(true);
      expect(proof.txHash).toMatch(/^[0-9a-fA-F]{64}$/);
      expect(proof.stellarExpertUrl).not.toContain('0x');
    });
  });

  it('validates user #18, #19, and #20 extended August audit actions', () => {
    const proof18 = PROOF_OF_INTERACTIONS.find((p) => p.userNumber === 18);
    const proof19 = PROOF_OF_INTERACTIONS.find((p) => p.userNumber === 19);
    const proof20 = PROOF_OF_INTERACTIONS.find((p) => p.userNumber === 20);

    expect(proof18?.action).toBe('VERIFY_COMPLIANCE_REPORT');
    expect(proof19?.action).toBe('INSPECT_XDR_CONTRACT_STATE');
    expect(proof20?.action).toBe('EXECUTE_GOVERNANCE_VOTE');
  });

  it('validates Stellar StrKey public key address validation', () => {
    const validAddr = 'GAEQ5IUNQTW36XMQF6MR2VWKPG3JOF6IKEGAD2JQ6OUNKTUVBAIE5AO3';
    expect(isValidStellarAddress(validAddr)).toBe(true);
    expect(isValidStellarAddress('invalid_address')).toBe(false);
  });
});
