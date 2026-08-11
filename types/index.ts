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
  action: string;
  txHash: string;
  ledgerSequence: number;
  contractId: string;
  timestamp: number;
  verified: boolean;
  stellarExpertUrl: string;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

