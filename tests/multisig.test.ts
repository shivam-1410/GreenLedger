import { describe, it, expect } from 'vitest';
import { INITIAL_MULTISIG_TRANSACTIONS, signMultiSigTransaction } from '../lib/multisig';

describe('Level 6 Advanced Feature: Enterprise Multi-Signature Logic Test Suite', () => {
  it('should enforce threshold requirements and execute when quorum is satisfied', () => {
    const tx = INITIAL_MULTISIG_TRANSACTIONS[0];
    expect(tx.currentWeight).toBe(2);
    expect(tx.thresholdRequired).toBe(3);
    expect(tx.status).toBe('PENDING_SIGNATURES');

    // 3rd Signer signs
    const thirdSigner = 'GCX9PW4M102L9R4GBV2X5Z6P7E5K3J7X9P02L9R4E91M822';
    const { updatedTx, isExecuted } = signMultiSigTransaction(tx, thirdSigner);

    expect(isExecuted).toBe(true);
    expect(updatedTx.status).toBe('EXECUTED');
    expect(updatedTx.currentWeight).toBe(3);
    expect(updatedTx.txHash).toBeDefined();
  });
});
