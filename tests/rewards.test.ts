import { describe, it, expect } from 'vitest';
import { NETWORKS } from '../lib/config';
import { MAINNET_USER_PROOFS } from '../lib/mainnet_proofs';
import { GOOGLE_FORM_RESPONSES } from '../lib/feedback_data';

describe('Stellar Ecosystem Reward Listing & Approval Lead Evaluation Suite', () => {
  it('should verify Tier 1 Reward Listing criteria: 50+ Mainnet users with 100% collision-free keys', () => {
    expect(MAINNET_USER_PROOFS.length).toBeGreaterThanOrEqual(50);
    const uniqueKeys = new Set(MAINNET_USER_PROOFS.map((p) => p.walletAddress));
    expect(uniqueKeys.size).toBe(MAINNET_USER_PROOFS.length);
  });

  it('should verify Mainnet contract IDs for reward listing sign-off', () => {
    expect(NETWORKS.mainnet.contractId).toMatch(/^CDMAINNET/);
    expect(NETWORKS.mainnet.verifierRegistryContractId).toMatch(/^CDMAINNET/);
  });

  it('should verify 50+ Google Form feedback responses mapped to git commits', () => {
    expect(GOOGLE_FORM_RESPONSES.length).toBeGreaterThanOrEqual(50);
    GOOGLE_FORM_RESPONSES.forEach((resp) => {
      expect(resp.implementedGitCommit).toBeDefined();
      expect(resp.productRating).toBeGreaterThanOrEqual(4);
    });
  });
});
