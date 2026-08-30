import { describe, it, expect } from 'vitest';
import { runAIEmissionAuditScan } from '../lib/ai_auditor';

describe('Real-Time AI Carbon Auditor Test Suite', () => {
  it('should evaluate low-risk discrepancies accurately when within 5% tolerance', () => {
    const res = runAIEmissionAuditScan('Green Transport AG', 'Logistics', 10000, 10200);

    expect(res.riskLevel).toBe('LOW');
    expect(res.anomalyDetected).toBe(false);
    expect(res.discrepancyPercentage).toBe(2.0);
    expect(res.confidenceScore).toBeGreaterThanOrEqual(90);
  });

  it('should flag critical under-reporting anomalies when discrepancy exceeds 25%', () => {
    const res = runAIEmissionAuditScan('Heavy Industrial Ltd', 'Steel', 50000, 70000);

    expect(res.riskLevel).toBe('CRITICAL');
    expect(res.anomalyDetected).toBe(true);
    expect(res.discrepancyPercentage).toBe(40.0);
    expect(res.recommendation).toContain('Major under-reporting');
    expect(res.auditHash).toMatch(/^0x[a-f0-9]+$/i);
  });

  it('should flag medium and high risk levels for intermediate variance thresholds', () => {
    const mediumRes = runAIEmissionAuditScan('Regional Chem', 'Materials', 10000, 11000);
    expect(mediumRes.riskLevel).toBe('MEDIUM');
    expect(mediumRes.anomalyDetected).toBe(true);

    const highRes = runAIEmissionAuditScan('Power Gen Corp', 'Energy', 10000, 12000);
    expect(highRes.riskLevel).toBe('HIGH');
    expect(highRes.anomalyDetected).toBe(true);
  });
});
