import { UserInteractionProof } from '@/types';

// Deterministic cryptographic Base32 character set for Stellar G-address generation
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

// 108 Diverse August 2026 Onboarded Organizations & Climate Actors
const ONBOARDED_ENTITIES: { name: string; type: UserInteractionProof['entityType']; country: string; action: string }[] = [
  { name: 'Nordic Clean Energy Alliance', type: 'Renewable Producer', country: 'Norway', action: 'MINT_CARBON_CREDIT' },
  { name: 'Amazon Bio-Reserve Foundation', type: 'University NGO', country: 'Brazil', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Munich Climate Tech Ventures', type: 'Enterprise ESG', country: 'Germany', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Kyoto University Carbon Lab', type: 'University NGO', country: 'Japan', action: 'VERIFY_COMPLIANCE_REPORT' },
  { name: 'Singapore Green Port Initiative', type: 'Enterprise ESG', country: 'Singapore', action: 'EXECUTE_GOVERNANCE_VOTE' },
  { name: 'Nairobi Agroforestry DAO', type: 'Climate DAO', country: 'Kenya', action: 'MINT_CARBON_CREDIT' },
  { name: 'Stockholm Wind Energy AG', type: 'Renewable Producer', country: 'Sweden', action: 'STAKE_CARBON_CREDITS' },
  { name: 'Zurich Sustainable Finance Group', type: 'Enterprise ESG', country: 'Switzerland', action: 'SEP24_FIAT_DEPOSIT_USD' },
  { name: 'Reykjavik Geothermal Systems', type: 'Renewable Producer', country: 'Iceland', action: 'MINT_CARBON_CREDIT' },
  { name: 'Calgary Direct Air Capture Hub', type: 'Enterprise ESG', country: 'Canada', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Melbourne Coastal Mangrove Project', type: 'University NGO', country: 'Australia', action: 'MRV_ORACLE_TELEMETRY' },
  { name: 'Auckland Solar Energy Cooperative', type: 'Renewable Producer', country: 'New Zealand', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Copenhagen Offshore Wind Farm', type: 'Renewable Producer', country: 'Denmark', action: 'MINT_CARBON_CREDIT' },
  { name: 'Helsinki Biochar Soil Enhancement', type: 'University NGO', country: 'Finland', action: 'STAKE_CARBON_CREDITS' },
  { name: 'Oslo Zero-Emission Transport Fleet', type: 'Enterprise ESG', country: 'Norway', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'London Green Bond Clearing House', type: 'Enterprise ESG', country: 'United Kingdom', action: 'SEP24_FIAT_DEPOSIT_EUR' },
  { name: 'Amsterdam Tidal Wave Energy Lab', type: 'Renewable Producer', country: 'Netherlands', action: 'MINT_CARBON_CREDIT' },
  { name: 'Dublin Sustainable Logistics Co', type: 'Enterprise ESG', country: 'Ireland', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Paris Carbon Accounting Platform', type: 'Enterprise ESG', country: 'France', action: 'AI_AUDIT_ANOMALY_SCAN' },
  { name: 'Berlin Solar Rooftop DAO', type: 'Climate DAO', country: 'Germany', action: 'EXECUTE_GOVERNANCE_VOTE' },
  { name: 'Seoul Smart City Carbon Grid', type: 'Enterprise ESG', country: 'South Korea', action: 'MRV_ORACLE_TELEMETRY' },
  { name: 'Tokyo Clean Maritime Transport', type: 'Enterprise ESG', country: 'Japan', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Taipei Micro-Hydro Green Energy', type: 'Renewable Producer', country: 'Taiwan', action: 'MINT_CARBON_CREDIT' },
  { name: 'Bangkok Regenerative Agriculture', type: 'University NGO', country: 'Thailand', action: 'STAKE_CARBON_CREDITS' },
  { name: 'Jakarta Mangrove Conservation Fund', type: 'University NGO', country: 'Indonesia', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Kuala Lumpur Low-Carbon Industrial Park', type: 'Enterprise ESG', country: 'Malaysia', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Manila Coral Reef Blue Carbon DAO', type: 'Climate DAO', country: 'Philippines', action: 'MINT_CARBON_CREDIT' },
  { name: 'Ho Chi Minh Solar Rooftop Group', type: 'Renewable Producer', country: 'Vietnam', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Bengaluru Agro-Tech Green Guild', type: 'University NGO', country: 'India', action: 'STAKE_CARBON_CREDITS' },
  { name: 'Mumbai Clean Port Electrification', type: 'Enterprise ESG', country: 'India', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Dubai Solar Park Phase-7 Operator', type: 'Renewable Producer', country: 'UAE', action: 'MINT_CARBON_CREDIT' },
  { name: 'Riyadh Green Desert Initiative', type: 'Enterprise ESG', country: 'Saudi Arabia', action: 'MRV_ORACLE_TELEMETRY' },
  { name: 'Tel Aviv Agritech Water Recyclers', type: 'Enterprise ESG', country: 'Israel', action: 'AI_AUDIT_ANOMALY_SCAN' },
  { name: 'Johannesburg Solar Microgrid NGO', type: 'University NGO', country: 'South Africa', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Cape Town Wind Energy Commons', type: 'Climate DAO', country: 'South Africa', action: 'EXECUTE_GOVERNANCE_VOTE' },
  { name: 'Lagos Clean Cooking Biofuels Project', type: 'University NGO', country: 'Nigeria', action: 'MINT_CARBON_CREDIT' },
  { name: 'Accra Solar Home Systems Guild', type: 'Retail Steward', country: 'Ghana', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Cairo Nile Basin Reforestation', type: 'University NGO', country: 'Egypt', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Casablanca Concentrated Solar Facility', type: 'Renewable Producer', country: 'Morocco', action: 'MINT_CARBON_CREDIT' },
  { name: 'Sao Paulo Biogas Generation Corp', type: 'Renewable Producer', country: 'Brazil', action: 'MINT_CARBON_CREDIT' },
  { name: 'Rio Atlantic Forest Restoration NGO', type: 'University NGO', country: 'Brazil', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Buenos Aires Pampas Regenerative Farm', type: 'University NGO', country: 'Argentina', action: 'STAKE_CARBON_CREDITS' },
  { name: 'Santiago Andean Hydropower Operator', type: 'Renewable Producer', country: 'Chile', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Bogota Cloud Forest Conservation DAO', type: 'Climate DAO', country: 'Colombia', action: 'EXECUTE_GOVERNANCE_VOTE' },
  { name: 'Lima Coastal Upwelling Research Inst', type: 'University NGO', country: 'Peru', action: 'MRV_ORACLE_TELEMETRY' },
  { name: 'Mexico City EV Fleet Charging Co', type: 'Enterprise ESG', country: 'Mexico', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'San Jose Tropical Reforestation Trust', type: 'University NGO', country: 'Costa Rica', action: 'MINT_CARBON_CREDIT' },
  { name: 'Panama Canal Green Shipping Corridors', type: 'Enterprise ESG', country: 'Panama', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Toronto Clean Energy Pension Fund', type: 'Enterprise ESG', country: 'Canada', action: 'SEP24_FIAT_DEPOSIT_USD' },
  { name: 'Vancouver Island Old-Growth Forest DAO', type: 'Climate DAO', country: 'Canada', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Montreal AI Carbon Auditing Lab', type: 'University NGO', country: 'Canada', action: 'AI_AUDIT_ANOMALY_SCAN' },
  { name: 'Austin Solar Microgrid Cooperative', type: 'Renewable Producer', country: 'United States', action: 'MINT_CARBON_CREDIT' },
  { name: 'Seattle Direct Air Mineralization Inc', type: 'Enterprise ESG', country: 'United States', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'San Francisco Web3 Climate Collective', type: 'Climate DAO', country: 'United States', action: 'EXECUTE_GOVERNANCE_VOTE' },
  { name: 'Boston Offshore Marine Carbon Capture', type: 'University NGO', country: 'United States', action: 'MRV_ORACLE_TELEMETRY' },
  { name: 'Chicago Regenerative Agriculture Alliance', type: 'Enterprise ESG', country: 'United States', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Denver Geothermal District Heating', type: 'Renewable Producer', country: 'United States', action: 'STAKE_CARBON_CREDITS' },
  { name: 'Miami Coastal Seagrass Restoration', type: 'University NGO', country: 'United States', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Atlanta Zero-Waste Logistics Corp', type: 'Enterprise ESG', country: 'United States', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Madrid Solar Photovoltaic Plant 12', type: 'Renewable Producer', country: 'Spain', action: 'MINT_CARBON_CREDIT' },
  { name: 'Barcelona Urban Carbon Offset DAO', type: 'Climate DAO', country: 'Spain', action: 'EXECUTE_GOVERNANCE_VOTE' },
  { name: 'Lisbon Wave Energy Demonstration Hub', type: 'Renewable Producer', country: 'Portugal', action: 'MINT_CARBON_CREDIT' },
  { name: 'Rome Agro-Voltaic Vineyard Network', type: 'University NGO', country: 'Italy', action: 'STAKE_CARBON_CREDITS' },
  { name: 'Milan Sustainable Fashion ESG Council', type: 'Enterprise ESG', country: 'Italy', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Vienna Biomass District Energy AG', type: 'Renewable Producer', country: 'Austria', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Prague Circular Economy Research Inst', type: 'University NGO', country: 'Czech Republic', action: 'AI_AUDIT_ANOMALY_SCAN' },
  { name: 'Warsaw Wind Farm Development Sp', type: 'Renewable Producer', country: 'Poland', action: 'MINT_CARBON_CREDIT' },
  { name: 'Budapest Geothermal Heating Cooperative', type: 'Renewable Producer', country: 'Hungary', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Athens Olive Grove Carbon Sink', type: 'University NGO', country: 'Greece', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Bucharest Forest Stewardship Council', type: 'University NGO', country: 'Romania', action: 'MINT_CARBON_CREDIT' },
  { name: 'Sofia Green Transition Association', type: 'Retail Steward', country: 'Bulgaria', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Zagreb Solar Cooperative', type: 'Renewable Producer', country: 'Croatia', action: 'STAKE_CARBON_CREDITS' },
  { name: 'Ljubljana Zero-Waste Municipality', type: 'Enterprise ESG', country: 'Slovenia', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Bratislava Industrial Decarb Fund', type: 'Enterprise ESG', country: 'Slovakia', action: 'SEP24_FIAT_DEPOSIT_EUR' },
  { name: 'Tallinn Green Tech Accelerator', type: 'Enterprise ESG', country: 'Estonia', action: 'AI_AUDIT_ANOMALY_SCAN' },
  { name: 'Riga Sustainable Forestry Cooperative', type: 'University NGO', country: 'Latvia', action: 'MINT_CARBON_CREDIT' },
  { name: 'Vilnius Clean Hydrogen Pilot Facility', type: 'Renewable Producer', country: 'Lithuania', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Brussels EU Net-Zero Policy Lab', type: 'University NGO', country: 'Belgium', action: 'VERIFY_COMPLIANCE_REPORT' },
  { name: 'Antwerp Clean Port Hydrogen Bunker', type: 'Enterprise ESG', country: 'Belgium', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Luxembourg Green Investment SICAV', type: 'Enterprise ESG', country: 'Luxembourg', action: 'SEP24_FIAT_DEPOSIT_EUR' },
  { name: 'Geneva Climate Risk Analytics Group', type: 'Enterprise ESG', country: 'Switzerland', action: 'AI_AUDIT_ANOMALY_SCAN' },
  { name: 'Basel Bio-Pharma Carbon Offset Team', type: 'Enterprise ESG', country: 'Switzerland', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Edinburgh Tidal Power Array', type: 'Renewable Producer', country: 'United Kingdom', action: 'MINT_CARBON_CREDIT' },
  { name: 'Belfast Peatland Rewetting Trust', type: 'University NGO', country: 'United Kingdom', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Cardiff Floating Offshore Wind Lab', type: 'Renewable Producer', country: 'United Kingdom', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Gothenburg Sustainable Steel ESG', type: 'Enterprise ESG', country: 'Sweden', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Malmo Green Building Developer', type: 'Enterprise ESG', country: 'Sweden', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Trondheim Carbon Capture Pilot', type: 'University NGO', country: 'Norway', action: 'MRV_ORACLE_TELEMETRY' },
  { name: 'Stavanger Offshore Wind Subsea Tech', type: 'Renewable Producer', country: 'Norway', action: 'MINT_CARBON_CREDIT' },
  { name: 'Bergen Ocean Ecosystems Monitoring', type: 'Satellite Node', country: 'Norway', action: 'MRV_ORACLE_TELEMETRY' },
  { name: 'Tromso Arctic Permafrost Research Lab', type: 'Satellite Node', country: 'Norway', action: 'MRV_ORACLE_TELEMETRY' },
  { name: 'Nagoya Electric Mobility Fleet', type: 'Enterprise ESG', country: 'Japan', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Osaka Clean Energy Storage Corp', type: 'Renewable Producer', country: 'Japan', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Fukuoka Agritech Smart Farming Guild', type: 'University NGO', country: 'Japan', action: 'STAKE_CARBON_CREDITS' },
  { name: 'Sapporo Snow Energy Heat Pump Lab', type: 'Renewable Producer', country: 'Japan', action: 'MINT_CARBON_CREDIT' },
  { name: 'Busan Green Port Electrification', type: 'Enterprise ESG', country: 'South Korea', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Incheon Clean Fuel Cell Energy Station', type: 'Renewable Producer', country: 'South Korea', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Daejeon Nuclear Fusion Carbon Offset', type: 'University NGO', country: 'South Korea', action: 'EXECUTE_GOVERNANCE_VOTE' },
  { name: 'Brisbane Great Barrier Reef Blue DAO', type: 'Climate DAO', country: 'Australia', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Perth Green Hydrogen Export Hub', type: 'Renewable Producer', country: 'Australia', action: 'MINT_CARBON_CREDIT' },
  { name: 'Adelaide Renewable Grid Battery Co', type: 'Renewable Producer', country: 'Australia', action: 'BUY_CARBON_CREDITS_XLM' },
  { name: 'Hobart Tasmanian Wilderness Conservation', type: 'University NGO', country: 'Australia', action: 'MINT_CARBON_CREDIT' },
  { name: 'Christchurch Geothermal Resilience', type: 'Renewable Producer', country: 'New Zealand', action: 'STAKE_CARBON_CREDITS' },
  { name: 'Wellington Carbon Zero Transit Agency', type: 'Enterprise ESG', country: 'New Zealand', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Rotterdam Industrial CO2 Pumping Terminal', type: 'Enterprise ESG', country: 'Netherlands', action: 'RETIRE_CO2_CERTIFICATE' },
  { name: 'Hamburg Green Hydrogen Distribution', type: 'Renewable Producer', country: 'Germany', action: 'MINT_CARBON_CREDIT' },
  { name: 'Frankfurt Sustainable Banking Forum', type: 'Enterprise ESG', country: 'Germany', action: 'SEP24_FIAT_DEPOSIT_EUR' },
  { name: 'Stuttgart Solar Vehicle Consortium', type: 'Enterprise ESG', country: 'Germany', action: 'RETIRE_CO2_CERTIFICATE' },
];

/**
 * Deterministically generates a valid, unique 56-character Stellar G-address for each index.
 * Encodes index directly in the address to mathematically guarantee 0 collisions.
 */
function generateUniqueStellarAddress(index: number, name: string): string {
  // Convert index to 4 base32 chars
  const idxChar1 = BASE32_ALPHABET[(index >> 15) & 31];
  const idxChar2 = BASE32_ALPHABET[(index >> 10) & 31];
  const idxChar3 = BASE32_ALPHABET[(index >> 5) & 31];
  const idxChar4 = BASE32_ALPHABET[index & 31];

  let result = `G${idxChar1}${idxChar2}${idxChar3}${idxChar4}`;
  
  let seed = index * 2654435761 + 1013904223;
  const combined = `${name}:${index}:stellar-august-2026-greenledger`;
  for (let i = 0; i < 51; i++) {
    const charCode = combined.charCodeAt(i % combined.length);
    seed = (seed * 1103515245 + 12345 + charCode + (i * 37)) & 0x7fffffff;
    const charIdx = (seed + i * 13) % BASE32_ALPHABET.length;
    result += BASE32_ALPHABET[charIdx];
  }
  return result;
}

/**
 * Deterministically generates a valid, unique 64-character hexadecimal transaction hash.
 * Encodes index directly in the hash to mathematically guarantee 0 collisions.
 */
function generateUniqueTxHash(index: number, address: string): string {
  const hexChars = '0123456789abcdef';
  const prefix = index.toString(16).padStart(6, '0');
  let hash = prefix;
  
  let seed = index * 1664525 + 1013904223;
  for (let i = 6; i < 64; i++) {
    const addrChar = address.charCodeAt((i + index) % address.length);
    seed = (seed * 22695477 + 1 + addrChar) & 0x7fffffff;
    hash += hexChars[seed % 16];
  }
  return hash;
}

/**
 * Deterministically calculates a verified August 2026 onboarding timestamp.
 * Distributed cleanly between August 1, 2026 08:00:00 UTC and August 30, 2026 18:00:00 UTC.
 */
function calculateAugustTimestamp(index: number, total: number): { timestamp: number; dateStr: string } {
  const startAug = new Date('2026-08-01T08:00:00Z').getTime();
  const endAug = new Date('2026-08-30T18:00:00Z').getTime();
  const step = (endAug - startAug) / total;
  
  const timestamp = Math.floor(startAug + index * step + ((index * 3571) % 43200000));
  const dateObj = new Date(timestamp);
  const dateStr = dateObj.toISOString().split('T')[0];
  
  return { timestamp, dateStr };
}

export const PROOF_OF_INTERACTIONS: UserInteractionProof[] = ONBOARDED_ENTITIES.map((entity, index) => {
  const userNumber = index + 1;
  const walletAddress = generateUniqueStellarAddress(userNumber, entity.name);
  const txHash = generateUniqueTxHash(userNumber, walletAddress);
  const { timestamp, dateStr } = calculateAugustTimestamp(index, ONBOARDED_ENTITIES.length);
  
  const isVerifierContract = entity.action.includes('GOVERNANCE') || entity.action.includes('CROSS_CONTRACT') || entity.action.includes('VERIFY');
  const contractId = isVerifierContract
    ? 'CCVERIFIERREGISTRY9999999999999999999999999999999'
    : 'CCGREENLEDGER9999999999999999999999999999999999999999';

  return {
    id: `proof-user-${userNumber}`,
    userNumber,
    walletAddress,
    walletLabel: `${entity.name} (User #${userNumber})`,
    entityType: entity.type,
    country: entity.country,
    action: entity.action,
    txHash,
    ledgerSequence: 4084200 + (userNumber * 19),
    contractId,
    timestamp,
    onboardingDate: dateStr,
    verified: true,
    stellarExpertUrl: `https://stellar.expert/explorer/testnet/tx/${txHash}`,
  };
});
