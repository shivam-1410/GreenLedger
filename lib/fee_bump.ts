export interface FeeSponsorshipRequest {
  innerTxXdr: string;
  userPublicKey: string;
  operationType: 'RETIRE_CREDIT' | 'MINT_CREDIT' | 'TRANSFER_CARBON' | 'VOTE_DAO';
  baseFeeStroops: number;
}

export interface FeeSponsorshipResult {
  isSponsored: boolean;
  sponsorAccount: string;
  feeBumpTxXdr: string;
  sponsoredFeeXlm: number;
  sponsoredFeeStroops: number;
  estimatedSettlementSeconds: number;
  sponsorshipHash: string;
  timestamp: number;
}

export const PROTOCOL_FEE_SPONSOR_ACCOUNT = 'GBSPONSORGREENLEDGER9999999999999999999999999999999999999';

/**
 * Builds a sponsored Fee-Bump transaction envelope, relieving the user from holding XLM for gas fees.
 */
export function buildFeeSponsoredTransaction(req: FeeSponsorshipRequest): FeeSponsorshipResult {
  const maxFeeStroops = Math.max(req.baseFeeStroops * 2, 200);
  const sponsoredFeeXlm = Number((maxFeeStroops / 10000000).toFixed(7));

  const seed = `${req.userPublicKey}:${req.operationType}:${req.innerTxXdr}:${Date.now()}`;
  let hashNum = 0;
  for (let i = 0; i < seed.length; i++) {
    hashNum = (hashNum << 5) - hashNum + seed.charCodeAt(i);
    hashNum |= 0;
  }
  const sponsorshipHash = `0x${Math.abs(hashNum).toString(16).padStart(16, '0')}${Date.now().toString(16).padStart(16, '0')}`.padEnd(66, '0');

  // Simulated Fee-Bump Envelope Base64 XDR
  const feeBumpTxXdr = `AAAAAGFeeBumpEnvelope${req.operationType}XDR${Math.abs(hashNum).toString(36)}SponsoredBy${PROTOCOL_FEE_SPONSOR_ACCOUNT.slice(0, 12)}`;

  return {
    isSponsored: true,
    sponsorAccount: PROTOCOL_FEE_SPONSOR_ACCOUNT,
    feeBumpTxXdr,
    sponsoredFeeXlm,
    sponsoredFeeStroops: maxFeeStroops,
    estimatedSettlementSeconds: 3.2,
    sponsorshipHash,
    timestamp: Date.now(),
  };
}
