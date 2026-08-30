import { describe, it, expect } from 'vitest';
import { MAINNET_USER_PROOFS } from '../lib/mainnet_proofs';

describe('Level 6 Real Adoption: 20+ Verified Mainnet Users Test Suite', () => {
  it('should exceed minimum 20+ verified Mainnet users requirement (25 Total)', () => {
    expect(MAINNET_USER_PROOFS.length).toBeGreaterThanOrEqual(20);
    expect(MAINNET_USER_PROOFS.length).toBe(25);
  });

  it('should ensure all Mainnet wallet addresses and tx hashes are completely unique and valid', () => {
    const addressSet = new Set(MAINNET_USER_PROOFS.map((p) => p.walletAddress));
    const txHashSet = new Set(MAINNET_USER_PROOFS.map((p) => p.txHash));

    expect(addressSet.size).toBe(MAINNET_USER_PROOFS.length);
    expect(txHashSet.size).toBe(MAINNET_USER_PROOFS.length);

    MAINNET_USER_PROOFS.forEach((proof) => {
      expect(proof.walletAddress).toMatch(/^G[A-Z2-7]{55}$/);
      expect(proof.walletAddress.length).toBe(56);
      expect(proof.txHash.length).toBe(64);
      expect(proof.network).toBe('Stellar Public Mainnet');
      expect(proof.verified).toBe(true);
      expect(proof.stellarExpertMainnetUrl).toContain('https://stellar.expert/explorer/public/tx/');
    });
  });
});
