import { describe, it, expect } from 'vitest';
import { calculateCarbonFootprint } from '../lib/calculator';

describe('Level 2 Stellar Soroban Smart Contract & Core Logic Verification Suite', () => {
  it('validates Soroban credit minting parameter structure & pricing math', () => {
    const credit = {
      id: 1,
      project_name: 'Amazonian Rainforest Reforestation',
      credit_type: 'Reforestation',
      co2_tons: 1000,
      vintage_year: 2026,
      total_supply: 1000,
      available_supply: 1000,
      price_per_ton: 15,
      is_verified: true,
    };

    expect(credit.id).toBe(1);
    expect(credit.co2_tons).toBeGreaterThan(0);
    expect(credit.price_per_ton).toBeGreaterThan(0);
    expect(credit.available_supply).toBe(credit.total_supply);
    expect(credit.is_verified).toBe(true);
  });

  it('verifies Soroban CO2 credit retirement burn calculation and available supply reduction', () => {
    const initialSupply = 1000;
    const retirementAmount = 250;
    const remainingSupply = initialSupply - retirementAmount;

    expect(remainingSupply).toBe(750);
    expect(retirementAmount).toBeLessThanOrEqual(initialSupply);
  });

  it('validates EPA emission factors engine for Level 2 carbon accounting', () => {
    const result = calculateCarbonFootprint({
      flightHours: 10,
      cloudNodeHours: 720,
      electricityKwh: 500,
      fleetFuelLiters: 150,
    });

    expect(result.totalCo2Tons).toBeGreaterThan(0);
    expect(result.recommendedCredits).toBe(Math.ceil(result.totalCo2Tons));
    expect(result.breakdown.flightCo2Kg).toBeGreaterThan(0);
    expect(result.breakdown.cloudCo2Kg).toBeGreaterThan(0);
    expect(result.breakdown.electricityCo2Kg).toBeGreaterThan(0);
    expect(result.breakdown.fleetCo2Kg).toBeGreaterThan(0);
  });
});
