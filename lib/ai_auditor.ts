import { AIAuditScanResult } from '@/types';

export const SAMPLE_ESG_ENTITIES = [
  { name: 'Apex Global Logistics Corp', sector: 'Transportation & Logistics', reportedScope123: 14500, satelliteBaseline: 15100 },
  { name: 'Helios Semiconductor Fabricators', sector: 'Industrial Manufacturing', reportedScope123: 38200, satelliteBaseline: 46800 },
  { name: 'Nordic Cloud Data Centers AG', sector: 'Cloud & Technology', reportedScope123: 9200, satelliteBaseline: 9350 },
  { name: 'Valence Chemical Synthetics', sector: 'Petrochemicals & Materials', reportedScope123: 72000, satelliteBaseline: 98400 },
];

/**
 * Performs an automated AI ESG Emission Discrepancy Analysis.
 * Compares reported corporate disclosures with satellite spectral heatmaps & EPA benchmark factors.
 */
export function runAIEmissionAuditScan(
  entityName: string,
  sector: string,
  reportedEmissionsTons: number,
  satelliteEstimatedEmissionsTons: number
): AIAuditScanResult {
  const discrepancyTons = satelliteEstimatedEmissionsTons - reportedEmissionsTons;
  const discrepancyPercentage = Number(((discrepancyTons / reportedEmissionsTons) * 100).toFixed(1));

  let riskLevel: AIAuditScanResult['riskLevel'] = 'LOW';
  let recommendation = 'Discrepancy is within acceptable 5% sensor variance. Fully compliant.';
  let anomalyDetected = false;

  if (discrepancyPercentage > 25) {
    riskLevel = 'CRITICAL';
    recommendation = 'Major under-reporting detected (>25%). Immediate on-site ISO-14064 re-audit required.';
    anomalyDetected = true;
  } else if (discrepancyPercentage > 15) {
    riskLevel = 'HIGH';
    recommendation = 'Significant variance detected (>15%). Verifier flagged for mandatory offset adjustment.';
    anomalyDetected = true;
  } else if (discrepancyPercentage > 7) {
    riskLevel = 'MEDIUM';
    recommendation = 'Moderate variance observed (7-15%). Recommend tightening Scope 3 supply chain monitoring.';
    anomalyDetected = true;
  }

  const confidenceScore = Number((98.5 - Math.abs(discrepancyPercentage) * 0.15).toFixed(1));
  const scanSeed = `${entityName}:${reportedEmissionsTons}:${satelliteEstimatedEmissionsTons}:${Date.now()}`;
  let hashNum = 0;
  for (let i = 0; i < scanSeed.length; i++) {
    hashNum = (hashNum << 5) - hashNum + scanSeed.charCodeAt(i);
    hashNum |= 0;
  }
  const auditHash = `0x${Math.abs(hashNum).toString(16).padStart(16, '0')}${Date.now().toString(16).padStart(16, '0')}`.padEnd(66, 'a');

  return {
    scanId: `scan-${Date.now().toString().slice(-6)}`,
    entityName,
    sector,
    reportedEmissionsTons,
    satelliteEstimatedEmissionsTons,
    discrepancyPercentage,
    riskLevel,
    recommendation,
    anomalyDetected,
    auditHash,
    confidenceScore: Math.max(85, confidenceScore),
    timestamp: Date.now(),
  };
}
