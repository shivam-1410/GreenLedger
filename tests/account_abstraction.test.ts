import { describe, it, expect } from 'vitest';
import { verifySmartWalletPasskeyAuth, INITIAL_SMART_WALLET } from '../lib/account_abstraction';

describe('Level 6 Advanced Feature: Account Abstraction & Smart Wallet Custom Auth Test Suite', () => {
  it('should validate WebAuthn passkey signatures with ultra-low gas overhead', () => {
    const res = verifySmartWalletPasskeyAuth(
      'challenge-payload-12345',
      '{"type":"webauthn.get"}',
      'authDataHex...',
      '3045022100e4b89182390182391082390182309182309182309182309182309182309182390220'
    );

    expect(res.isValid).toBe(true);
    expect(res.gasOverheadStroops).toBeLessThan(1000);
    expect(res.executionMethod).toContain('__check_auth');
  });

  it('should maintain spending limits and social recovery guardians', () => {
    expect(INITIAL_SMART_WALLET.isPasskeyEnabled).toBe(true);
    expect(INITIAL_SMART_WALLET.socialRecoveryGuardians.length).toBe(2);
    expect(INITIAL_SMART_WALLET.dailySpendingLimitXlm).toBe(5000);
  });
});
