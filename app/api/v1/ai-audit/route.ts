import { NextResponse } from 'next/server';
import { runAIEmissionAuditScan, SAMPLE_ESG_ENTITIES } from '@/lib/ai_auditor';

export async function GET() {
  const scans = SAMPLE_ESG_ENTITIES.map((ent) =>
    runAIEmissionAuditScan(ent.name, ent.sector, ent.reportedScope123, ent.satelliteBaseline)
  );

  return NextResponse.json({
    success: true,
    totalScans: scans.length,
    scans,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { entityName, sector, reportedEmissionsTons, satelliteEstimatedEmissionsTons } = body;

    const result = runAIEmissionAuditScan(
      entityName || 'Custom ESG Enterprise',
      sector || 'General Industry',
      Number(reportedEmissionsTons) || 10000,
      Number(satelliteEstimatedEmissionsTons) || 10500
    );

    return NextResponse.json({
      success: true,
      scanResult: result,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
