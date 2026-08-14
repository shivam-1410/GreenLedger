import { CarbonCalculatorInput, CarbonCalculationResult } from '@/types';

// Emission Factors based on EPA & GHG Protocol Standard Constants
const FLIGHT_CO2_KG_PER_HOUR = 90.0; // 90 kg CO2 per flight hour (economy per passenger average)
const CLOUD_NODE_CO2_KG_PER_HOUR = 0.045; // 45g CO2 per vCPU hour (AWS/GCP average)
const ELECTRICITY_CO2_KG_PER_KWH = 0.385; // 385g CO2 per kWh (global grid average)
const FLEET_FUEL_CO2_KG_PER_LITER = 2.31; // 2.31 kg CO2 per liter of gasoline

export function calculateCarbonFootprint(input: CarbonCalculatorInput): CarbonCalculationResult {
  const flightCo2Kg = Math.max(0, input.flightHours) * FLIGHT_CO2_KG_PER_HOUR;
  const cloudCo2Kg = Math.max(0, input.cloudNodeHours) * CLOUD_NODE_CO2_KG_PER_HOUR;
  const electricityCo2Kg = Math.max(0, input.electricityKwh) * ELECTRICITY_CO2_KG_PER_KWH;
  const fleetCo2Kg = Math.max(0, input.fleetFuelLiters) * FLEET_FUEL_CO2_KG_PER_LITER;

  const totalCo2Kg = flightCo2Kg + cloudCo2Kg + electricityCo2Kg + fleetCo2Kg;
  const totalCo2Tons = Number((totalCo2Kg / 1000).toFixed(3));
  const recommendedCredits = Math.ceil(totalCo2Tons);

  // Average credit price: 15 XLM per ton
  const estimatedPriceXlm = Number((recommendedCredits * 15).toFixed(2));
  
  // 1 Ton CO2 offset ≈ 45 mature trees planted per year
  const treesEquivalent = Math.round(totalCo2Tons * 45);

  return {
    totalCo2Kg: Number(totalCo2Kg.toFixed(2)),
    totalCo2Tons,
    recommendedCredits,
    estimatedPriceXlm,
    treesEquivalent,
    breakdown: {
      flightCo2Kg: Number(flightCo2Kg.toFixed(2)),
      cloudCo2Kg: Number(cloudCo2Kg.toFixed(2)),
      electricityCo2Kg: Number(electricityCo2Kg.toFixed(2)),
      fleetCo2Kg: Number(fleetCo2Kg.toFixed(2)),
    },
  };
}
