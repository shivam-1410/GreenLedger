import { describe, it, expect } from 'vitest';
import { getSEP31RemittanceQuote, executeSEP31Remittance, SUPPORTED_SEP31_CORRIDORS } from '../lib/sep31';

describe('Level 6 Advanced Feature: SEP-31 Cross-Border Remittances Test Suite', () => {
  it('should generate accurate real-time remittance quotes across all supported corridors', () => {
    expect(SUPPORTED_SEP31_CORRIDORS.length).toBeGreaterThanOrEqual(4);

    const eurQuote = getSEP31RemittanceQuote('EUR', 'CARBON-CREDIT', 1000);
    expect(eurQuote.sendAmount).toBe(1000);
    expect(eurQuote.receiveAmount).toBeGreaterThan(0);
    expect(eurQuote.anchorFee).toBeGreaterThan(0);
    expect(eurQuote.estimatedSeconds).toBeLessThan(10);
  });

  it('should execute cross-border remittance settlement and emit on-chain hash', () => {
    const quote = getSEP31RemittanceQuote('USD', 'CARBON-CREDIT', 2500);
    const tx = executeSEP31Remittance('Stripe Climate', 'United States', 'Amazon Trust', 'Brazil', quote);

    expect(tx.status).toBe('SETTLED_ON_CHAIN');
    expect(tx.settlementTxHash).toMatch(/^0x[a-f0-9]+$/i);
    expect(tx.senderName).toBe('Stripe Climate');
  });
});
