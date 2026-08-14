import { describe, it, expect } from 'vitest';
import { calculateCarbonFootprint } from '../lib/calculator';

describe('ESG Carbon Calculator Engine', () => {
  it('correctly calculates CO2 tons and recommended credits for baseline inputs', () => {
    const res = calculateCarbonFootprint({
      flightHours: 10,
      cloudNodeHours: 720,
      electricityKwh: 500,
      fleetFuelLiters: 150,
    });

    expect(res.totalCo2Kg).toBeGreaterThan(0);
    expect(res.totalCo2Tons).toBeGreaterThan(0);
    expect(res.recommendedCredits).toBe(Math.ceil(res.totalCo2Tons));
    expect(res.estimatedPriceXlm).toBe(res.recommendedCredits * 15);
    expect(res.treesEquivalent).toBe(Math.round(res.totalCo2Tons * 45));
  });

  it('handles zero or negative inputs gracefully without throwing', () => {
    const res = calculateCarbonFootprint({
      flightHours: 0,
      cloudNodeHours: -10,
      electricityKwh: 0,
      fleetFuelLiters: 0,
    });

    expect(res.totalCo2Kg).toBe(0);
    expect(res.totalCo2Tons).toBe(0);
    expect(res.recommendedCredits).toBe(0);
  });
});
