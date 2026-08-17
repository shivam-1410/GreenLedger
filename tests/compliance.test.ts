import { describe, it, expect } from 'vitest';
import { GET } from '../app/api/compliance/route';

describe('Enterprise ESG Compliance Audit Suite', () => {
  it('generates a valid compliance report with 100% score and COMPLIANT status', async () => {
    const request = new Request('http://localhost/api/compliance?org=Acme%20Corp&period=Q3%202026');
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.orgName).toBe('Acme Corp');
    expect(json.data.auditPeriod).toBe('Q3 2026');
    expect(json.data.complianceScore).toBe(100);
    expect(json.data.status).toBe('COMPLIANT');
    expect(json.data.verifiedOnChain).toBe(true);
    expect(json.data.verifiersCount).toBe(4);
    expect(json.data.auditHash).toMatch(/^0x[0-9a-fA-F]{64}$/);
  });

  it('uses default fallback values when search params are omitted', async () => {
    const request = new Request('http://localhost/api/compliance');
    const response = await GET(request);
    const json = await response.json();

    expect(json.data.orgName).toBe('Enterprise Global Corp');
    expect(json.data.auditPeriod).toBe('Q3 2026');
  });
});
