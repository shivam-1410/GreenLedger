import { NextResponse } from 'next/server';
import { calculateCarbonFootprint } from '@/lib/calculator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { flightHours = 0, cloudNodeHours = 0, electricityKwh = 0, fleetFuelLiters = 0 } = body;

    const result = calculateCarbonFootprint({
      flightHours: Number(flightHours),
      cloudNodeHours: Number(cloudNodeHours),
      electricityKwh: Number(electricityKwh),
      fleetFuelLiters: Number(fleetFuelLiters),
    });

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      protocolVersion: '4.2.0',
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Invalid calculation payload';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}
