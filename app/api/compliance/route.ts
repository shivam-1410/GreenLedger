import { NextResponse } from 'next/server';
import { EnterpriseComplianceReport } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgName = searchParams.get('org') || 'Enterprise Global Corp';
  const period = searchParams.get('period') || 'Q3 2026';

  const totalEmissionsTons = 1250.5;
  const totalOffsetTons = 1420.0;
  const netEmissionsTons = Math.max(0, Number((totalEmissionsTons - totalOffsetTons).toFixed(2)));
  const complianceScore = Math.min(100, Math.round((totalOffsetTons / totalEmissionsTons) * 100));

  const report: EnterpriseComplianceReport = {
    orgName,
    auditPeriod: period,
    totalEmissionsTons,
    totalOffsetTons,
    netEmissionsTons,
    complianceScore,
    status: complianceScore >= 100 ? 'COMPLIANT' : complianceScore >= 80 ? 'WARNING' : 'NON_COMPLIANT',
    verifiedOnChain: true,
    verifiersCount: 4,
    auditHash: '0xa9babe25ecf2df70451e9df48c4b0b86926f6272602f8374092b76cb10b2a5f0',
    timestamp: Date.now(),
  };

  return NextResponse.json({
    success: true,
    data: report,
    protocol: 'GreenLedger Enterprise Audit Standard v4.2',
    timestamp: new Date().toISOString(),
  });
}
