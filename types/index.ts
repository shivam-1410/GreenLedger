export type CreditType = 'Reforestation' | 'Solar Energy' | 'Blue Carbon' | 'Direct Air Capture' | 'Wind Farm';

export interface CarbonCredit {
  id: string;
  issuer: string;
  projectName: string;
  creditType: CreditType;
  co2Tons: number;
  vintageYear: number;
  certificateUrl: string;
  totalSupply: number;
  availableSupply: number;
  pricePerTon: number;
  isVerified: boolean;
  location?: string;
  image?: string;
}

export interface Verifier {
  address: string;
  name: string;
  accreditationUri: string;
  active: boolean;
  approvedAt: number;
}

export interface Listing {
  creditId: string;
  seller: string;
  amount: number;
  pricePerTon: number;
  active: boolean;
}

export interface RetirementRecord {
  id: string;
  creditId: string;
  projectName: string;
  owner: string;
  amount: number;
  reason: string;
  timestamp: number;
  certificateHash: string;
}

export interface PlatformStats {
  totalCreditsMinted: number;
  totalCo2OffsetTons: number;
  totalActiveListings: number;
  totalVolumeXlm: number;
}

export type WalletType = 'freighter' | 'albedo' | 'xbull' | 'hana' | 'rango' | 'walletconnect' | 'none';

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  walletType: WalletType;
  network: string;
  xlmBalance: number;
  userRetiredTons: number;
}

export type TransactionStatus = 'idle' | 'building' | 'signing' | 'pending' | 'success' | 'failed';

export interface TrackedTransaction {
  id: string;
  title: string;
  status: TransactionStatus;
  hash?: string;
  error?: string;
  timestamp: number;
}

export interface ContractEvent {
  id: string;
  type: 'mint' | 'list' | 'buy' | 'retire' | 'cancel' | 'verifier_approved';
  timestamp: number;
  walletAddress: string;
  creditId?: string;
  projectName?: string;
  amount?: number;
  co2Tons?: number;
  priceXlm?: number;
  txHash: string;
}

export type FeedbackCategory = 'UI/UX' | 'Transaction Speed' | 'Wallet Connection' | 'Documentation' | 'Feature Request' | 'General';

export interface UserFeedback {
  id: string;
  walletAddress: string;
  userName: string;
  rating: number;
  category: FeedbackCategory;
  comment: string;
  npsScore: number;
  timestamp: number;
  verifiedWallet: boolean;
}

export interface AnalyticsTelemetry {
  rpcLatencyMs: number;
  activeUsers24h: number;
  totalWalletInteractions: number;
  contractCallsTotal: number;
  uptimePercentage: number;
  errorRatePercentage: number;
  totalCo2Offset: number;
  totalXlmVolume: number;
  conversionFunnel: { step: string; count: number; percentage: number }[];
  topInteractions: { action: string; count: number }[];
  recentErrorLogs: { timestamp: number; source: string; message: string; code: string }[];
}

export interface UserInteractionProof {
  id: string;
  userNumber: number;
  walletAddress: string;
  walletLabel: string;
  entityType: 'Enterprise ESG' | 'University NGO' | 'Renewable Producer' | 'Retail Steward' | 'Satellite Node' | 'Climate DAO';
  country: string;
  action: string;
  txHash: string;
  ledgerSequence: number;
  contractId: string;
  timestamp: number;
  onboardingDate: string;
  verified: boolean;
  stellarExpertUrl: string;
}

export interface StakingPool {
  poolId: string;
  creditId: string;
  projectName: string;
  creditType: CreditType;
  aprPercentage: number;
  totalStakedTons: number;
  rewardToken: string;
  dailyRewardRate: number;
  status: 'ACTIVE' | 'PAUSED';
  minStakeTons: number;
}

export interface UserStakeRecord {
  walletAddress: string;
  poolId: string;
  stakedTons: number;
  accumulatedRewards: number;
  lastClaimTimestamp: number;
  stakedAt: number;
}

export interface AIAuditScanResult {
  scanId: string;
  entityName: string;
  sector: string;
  reportedEmissionsTons: number;
  satelliteEstimatedEmissionsTons: number;
  discrepancyPercentage: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendation: string;
  anomalyDetected: boolean;
  auditHash: string;
  confidenceScore: number;
  timestamp: number;
}

export interface TelemetryWebhookEvent {
  eventId: string;
  eventType: 'MRV_TELEMETRY' | 'GOVERNANCE_VOTE' | 'STAKE_DEPOSIT' | 'AI_ANOMALY_ALERT' | 'SEP24_TRANSACTION';
  source: string;
  payload: Record<string, any>;
  timestamp: number;
  signature: string;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface CarbonCalculatorInput {
  flightHours: number;
  cloudNodeHours: number;
  electricityKwh: number;
  fleetFuelLiters: number;
}

export interface CarbonCalculationResult {
  totalCo2Kg: number;
  totalCo2Tons: number;
  recommendedCredits: number;
  estimatedPriceXlm: number;
  treesEquivalent: number;
  breakdown: {
    flightCo2Kg: number;
    cloudCo2Kg: number;
    electricityCo2Kg: number;
    fleetCo2Kg: number;
  };
}

export interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  displayName: string;
  totalRetiredTons: number;
  totalXlmSpent: number;
  badges: string[];
  lastActive: number;
  verifiedOrg: boolean;
}

export interface SorobanContractInspection {
  contractId: string;
  contractName: string;
  wasmHash: string;
  deployedLedger: number;
  status: 'ACTIVE' | 'GOVERNANCE_VERIFIED';
  totalEvents: number;
  functions: string[];
}

export interface EnterpriseComplianceReport {
  orgName: string;
  auditPeriod: string;
  totalEmissionsTons: number;
  totalOffsetTons: number;
  netEmissionsTons: number;
  complianceScore: number;
  status: 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT';
  verifiedOnChain: boolean;
  verifiersCount: number;
  auditHash: string;
  timestamp: number;
}

export interface SorobanXdrParsedEvent {
  contractId: string;
  topics: string[];
  dataHex: string;
  decodedValue?: string | number | object;
  ledgerSequence: number;
  timestamp: number;
}

