import { describe, it, expect } from 'vitest';
import { truncateAddress, formatNumber } from '../lib/utils';
import { MOCK_PROJECTS } from '../lib/config';

describe('GreenLedger Utility & Business Logic Suite', () => {
  it('truncates Stellar public key address correctly', () => {
    const address = 'GD2AQNDRSSX2BD6L75UUYH3JH4MUVHSYM4PCXJNOHW3XLQ67TSEQKGWO';
    const truncated = truncateAddress(address, 4);
    expect(truncated).toBe('GD2AQN...KGWO');
  });

  it('formats numeric values with decimals', () => {
    expect(formatNumber(12500.5, 2)).toBe('12,500.5');
    expect(formatNumber(1000, 0)).toBe('1,000');
  });

  it('loads valid mock project pools', () => {
    expect(MOCK_PROJECTS.length).toBeGreaterThan(0);
    const p1 = MOCK_PROJECTS[0];
    expect(p1.projectName).toContain('Amazon');
    expect(p1.pricePerTon).toBeGreaterThan(0);
    expect(p1.availableSupply).toBeGreaterThan(0);
  });
});
