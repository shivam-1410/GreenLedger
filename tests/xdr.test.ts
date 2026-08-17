import { describe, it, expect } from 'vitest';
import { parseSorobanXdrEvent, formatXdrHash } from '../lib/xdr-decoder';

describe('Soroban XDR Event Decoder Suite', () => {
  it('parses raw hex topics into string representations', () => {
    // Hex for "mint"
    const mintHex = Buffer.from('mint').toString('hex');
    const parsed = parseSorobanXdrEvent(
      'CCGREENLEDGER9999999999999999999999999999999999999999',
      [mintHex],
      '0x00000064', // 100 in hex
      4084100
    );

    expect(parsed.contractId).toBe('CCGREENLEDGER9999999999999999999999999999999999999999');
    expect(parsed.topics[0]).toContain('mint');
    expect(parsed.decodedValue).toBe(100);
    expect(parsed.ledgerSequence).toBe(4084100);
  });

  it('formats hex tx hashes by removing 0x prefix for StellarExpert', () => {
    expect(formatXdrHash('0xFD95C8E3')).toBe('fd95c8e3');
    expect(formatXdrHash('a9babe25')).toBe('a9babe25');
  });
});
