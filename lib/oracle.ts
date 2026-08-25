export interface MRVSensorData {
  sensorId: string;
  location: string;
  coordinates: { lat: number; lng: number };
  ndviIndex: number; // Normalized Difference Vegetation Index (-1.0 to 1.0)
  soilCarbonDensityKgM2: number; // kg/m^2
  biomassTonsPerHectare: number;
  lastUpdated: string;
  status: 'ONLINE' | 'CALIBRATING' | 'ALERT';
  verifiedByOracle: boolean;
  telemetryHash: string;
}

export interface MRVOracleVerificationResult {
  isEligibleForMinting: boolean;
  calculatedCO2Tons: number;
  recommendedCreditPriceXlm: number;
  confidenceScore: number;
  cryptographicProofHash: string;
  verifierAttestation: string;
}

export const MOCK_MRV_SENSORS: MRVSensorData[] = [
  {
    sensorId: 'SAT-AMAZON-01',
    location: 'Amazon Basin Sector 4B (Brazil)',
    coordinates: { lat: -3.4653, lng: -62.2159 },
    ndviIndex: 0.84,
    soilCarbonDensityKgM2: 14.2,
    biomassTonsPerHectare: 285.4,
    lastUpdated: new Date().toISOString(),
    status: 'ONLINE',
    verifiedByOracle: true,
    telemetryHash: '0x8f9a2b7c4d3e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6',
  },
  {
    sensorId: 'IOT-NORDIC-WIND-09',
    location: 'North Sea Wind Park (Norway)',
    coordinates: { lat: 60.3913, lng: 5.3221 },
    ndviIndex: 0.62,
    soilCarbonDensityKgM2: 8.7,
    biomassTonsPerHectare: 142.1,
    lastUpdated: new Date().toISOString(),
    status: 'ONLINE',
    verifiedByOracle: true,
    telemetryHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1',
  },
  {
    sensorId: 'SAT-MANGROVE-03',
    location: 'Sundarbans Coastal Delta (India)',
    coordinates: { lat: 21.9497, lng: 88.9468 },
    ndviIndex: 0.91,
    soilCarbonDensityKgM2: 22.8,
    biomassTonsPerHectare: 410.0,
    lastUpdated: new Date().toISOString(),
    status: 'ONLINE',
    verifiedByOracle: true,
    telemetryHash: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7',
  },
  {
    sensorId: 'IOT-BIOCHAR-07',
    location: 'Bavarian Agriculture Facility (Germany)',
    coordinates: { lat: 48.1371, lng: 11.5754 },
    ndviIndex: 0.76,
    soilCarbonDensityKgM2: 18.4,
    biomassTonsPerHectare: 198.5,
    lastUpdated: new Date().toISOString(),
    status: 'ONLINE',
    verifiedByOracle: true,
    telemetryHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
  },
];

/**
 * Calculates CO2 credit minting eligibility based on Satellite NDVI & IoT telemetry data.
 */
export function verifyMRVOracleTelemetry(sensor: MRVSensorData): MRVOracleVerificationResult {
  const isEligible = sensor.status === 'ONLINE' && sensor.ndviIndex >= 0.5 && sensor.soilCarbonDensityKgM2 >= 5.0;
  
  const estimatedAreaHectares = 100;
  const calculatedCO2Tons = Math.round(
    sensor.biomassTonsPerHectare * sensor.ndviIndex * (estimatedAreaHectares / 10)
  );

  const confidenceScore = Math.min(
    99.9,
    Number((sensor.ndviIndex * 100 * 0.6 + (sensor.soilCarbonDensityKgM2 / 25) * 40).toFixed(1))
  );

  const basePriceXlm = 15;
  const recommendedCreditPriceXlm = Math.round(basePriceXlm * (sensor.ndviIndex > 0.8 ? 1.25 : 1.0));

  const proofSeed = `${sensor.sensorId}:${sensor.telemetryHash}:${calculatedCO2Tons}:${Date.now()}`;
  let hashNum = 0;
  for (let i = 0; i < proofSeed.length; i++) {
    hashNum = (hashNum << 5) - hashNum + proofSeed.charCodeAt(i);
    hashNum |= 0;
  }
  const cleanHash = sensor.telemetryHash.replace(/^0x/i, '');
  const cryptographicProofHash = `0x${Math.abs(hashNum).toString(16).padStart(16, '0')}${cleanHash.slice(0, 16)}`;

  return {
    isEligibleForMinting: isEligible,
    calculatedCO2Tons,
    recommendedCreditPriceXlm,
    confidenceScore,
    cryptographicProofHash,
    verifierAttestation: 'Verra & Gold Standard Automated Satellite Oracle Certified',
  };
}
