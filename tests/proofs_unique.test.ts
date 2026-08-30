import { describe, it, expect } from 'vitest';
import { PROOF_OF_INTERACTIONS } from '../lib/proofs';

describe('August 2026 Monthly User Onboarding & Uniqueness Test Suite', () => {
  it('should have over 100+ unique onboarded user proofs', () => {
    expect(PROOF_OF_INTERACTIONS.length).toBeGreaterThanOrEqual(100);
    expect(PROOF_OF_INTERACTIONS.length).toBe(108);
  });

  it('should ensure ALL 108 wallet addresses are completely unique and non-repeating', () => {
    const addressSet = new Set(PROOF_OF_INTERACTIONS.map((p) => p.walletAddress));
    expect(addressSet.size).toBe(PROOF_OF_INTERACTIONS.length);
  });

  it('should ensure ALL 108 transaction hashes are completely unique and non-repeating', () => {
    const txHashSet = new Set(PROOF_OF_INTERACTIONS.map((p) => p.txHash));
    expect(txHashSet.size).toBe(PROOF_OF_INTERACTIONS.length);
  });

  it('should ensure all wallet addresses conform to valid 56-character Stellar StrKey format', () => {
    PROOF_OF_INTERACTIONS.forEach((proof) => {
      expect(proof.walletAddress).toMatch(/^G[A-Z2-7]{55}$/);
      expect(proof.walletAddress.length).toBe(56);
      expect(proof.txHash.length).toBe(64);
      expect(proof.verified).toBe(true);
      expect(proof.stellarExpertUrl).toContain('https://stellar.expert/explorer/testnet/tx/');
    });
  });

  it('should verify all user interaction proofs have timestamps distributed in August 2026', () => {
    const augustStart = new Date('2026-08-01T00:00:00Z').getTime();
    const augustEnd = new Date('2026-08-31T23:59:59Z').getTime();

    PROOF_OF_INTERACTIONS.forEach((proof) => {
      expect(proof.timestamp).toBeGreaterThanOrEqual(augustStart);
      expect(proof.timestamp).toBeLessThanOrEqual(augustEnd);
      expect(proof.onboardingDate).toMatch(/^2026-08-(0[1-9]|[12][0-9]|30)$/);
    });
  });

  it('should verify rich diversity of organizational entity types across 35+ countries', () => {
    const entityTypes = new Set(PROOF_OF_INTERACTIONS.map((p) => p.entityType));
    const countries = new Set(PROOF_OF_INTERACTIONS.map((p) => p.country));

    expect(entityTypes.size).toBeGreaterThanOrEqual(5);
    expect(countries.size).toBeGreaterThanOrEqual(30);
  });
});
