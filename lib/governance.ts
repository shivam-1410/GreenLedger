export interface DAOProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  targetVerifierAddress: string;
  proposedStatus: 'APPROVE' | 'REVOKE' | 'UPDATE_WEIGHT';
  votesFor: number;
  votesAgainst: number;
  thresholdRequired: number; // e.g. 66% supermajority
  quorumNeeded: number;
  status: 'ACTIVE' | 'PASSED' | 'REJECTED' | 'EXECUTED';
  createdAt: string;
  expiresAt: string;
  txHash?: string;
}

export const INITIAL_DAO_PROPOSALS: DAOProposal[] = [
  {
    id: 'prop-101',
    title: 'Accredit Amazon Rainforest Trust as Verra Level-1 Verifier',
    description: 'Grant accredited verifier status to Amazon Rainforest Trust on VerifierRegistry smart contract following audit.',
    proposer: 'GAEQ5IUNQTW36XMQF6MR2VWKPG3JOF6IKEGAD2JQ6OUNKTUVBAIE5AO3',
    targetVerifierAddress: 'GDGU46X55N4SU5B6TARBUU6R6XHTIQNQQTBPDLYZ6JRO44J4H6EHVYKB',
    proposedStatus: 'APPROVE',
    votesFor: 84000,
    votesAgainst: 12000,
    thresholdRequired: 66,
    quorumNeeded: 50000,
    status: 'PASSED',
    createdAt: '2026-08-10T10:00:00Z',
    expiresAt: '2026-08-20T10:00:00Z',
    txHash: '0x091e5d1f62781a85e430495effa1db2b9faf086d61440f146dffd225ee0113f6',
  },
  {
    id: 'prop-102',
    title: 'Integrate Satellite MRV Oracle Sensor Network V2',
    description: 'Authorize Sentinel-2 Satellite telemetry oracle contracts for automated CO2 credit minting verification.',
    proposer: 'GBQHHOH72M522QBF7SMY57JH6FIN7YKTZUWSO4S5IFBXV3B7FI2UQLIQ',
    targetVerifierAddress: 'GDUQ3DXGSNRGPNNGHLKXLSVPRC3V2PAYMP6ITW3ICSRLF64KVOTPA6AT',
    proposedStatus: 'APPROVE',
    votesFor: 125000,
    votesAgainst: 4500,
    thresholdRequired: 66,
    quorumNeeded: 50000,
    status: 'ACTIVE',
    createdAt: '2026-08-22T14:30:00Z',
    expiresAt: '2026-08-29T14:30:00Z',
    txHash: '0x3520c3ffa8635bf55e94693c2060cd017e9832368abbdba5e59d1b510d37a391',
  },
];

/**
 * Creates a new Multi-Sig DAO Proposal.
 */
export function createDAOProposal(
  title: string,
  description: string,
  proposer: string,
  targetVerifierAddress: string,
  proposedStatus: 'APPROVE' | 'REVOKE' | 'UPDATE_WEIGHT'
): DAOProposal {
  const propId = `prop-${Date.now().toString().slice(-4)}`;
  return {
    id: propId,
    title,
    description,
    proposer,
    targetVerifierAddress,
    proposedStatus,
    votesFor: 10000, // proposer default vote weight
    votesAgainst: 0,
    thresholdRequired: 66,
    quorumNeeded: 50000,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    txHash: `0x${propId.replace(/[^a-f0-9]/gi, '').padEnd(64, '0')}`,
  };
}

/**
 * Computes proposal voting percentages and checks if threshold is satisfied.
 */
export function evaluateProposalVote(proposal: DAOProposal): {
  approvalPercent: number;
  hasReachedQuorum: boolean;
  canExecute: boolean;
} {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const approvalPercent = totalVotes > 0 ? Number(((proposal.votesFor / totalVotes) * 100).toFixed(1)) : 0;
  const hasReachedQuorum = totalVotes >= proposal.quorumNeeded;
  const canExecute = hasReachedQuorum && approvalPercent >= proposal.thresholdRequired;

  return {
    approvalPercent,
    hasReachedQuorum,
    canExecute,
  };
}
