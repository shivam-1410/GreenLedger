import { describe, it, expect } from 'vitest';
import { PROOF_OF_INTERACTIONS } from '../lib/proofs';
import { INSPECTOR_CONTRACTS } from '../lib/inspector';

describe('August Level 4 Production Verification Suite', () => {
  it('validates 17 verified live Stellar testnet user proof records', () => {
    expect(PROOF_OF_INTERACTIONS.length).toBe(17);
    PROOF_OF_INTERACTIONS.forEach((proof) => {
      expect(proof.verified).toBe(true);
      expect(proof.txHash).toMatch(/^[0-9a-fA-F]{64}$/);
      expect(proof.stellarExpertUrl).not.toContain('0x');
    });
  });

  it('validates Soroban smart contract inspector entrypoints', () => {
    expect(INSPECTOR_CONTRACTS.length).toBe(2);
    const coreContract = INSPECTOR_CONTRACTS.find((c) => c.status === 'ACTIVE');
    expect(coreContract).toBeDefined();
    expect(coreContract?.functions).toContain('mint(env, issuer, project_name, co2_tons, price_per_ton, cert_url)');
  });
});
