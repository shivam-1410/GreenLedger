export interface MultiSigSigner {
  address: string;
  name: string;
  weight: number;
  hasSigned: boolean;
  signedTimestamp?: number;
}

export interface MultiSigTreasuryTransaction {
  txId: string;
  title: string;
  description: string;
  targetContract: string;
  amountXlm: number;
  carbonCreditsTons: number;
  recipientAddress: string;
  thresholdRequired: number; // e.g. 3 of 4 signers
  currentWeight: number;
  status: 'PENDING_SIGNATURES' | 'EXECUTED' | 'REJECTED';
  signers: MultiSigSigner[];
  createdAt: number;
  executedAt?: number;
  txHash?: string;
}

export const INITIAL_MULTISIG_SIGNERS: MultiSigSigner[] = [
  { address: 'GBV2X5Z6P7E5K3J7X9P02L9R4E91M822GBC4M822GDA7KL9P0', name: 'Lead ESG Auditor (Verra)', weight: 1, hasSigned: true, signedTimestamp: Date.now() - 3600000 },
  { address: 'GDA7KL9P02M822GBC4M822GBV2X5Z6P7E5K3J7X9P02L9R4', name: 'Gold Standard Validator Key', weight: 1, hasSigned: true, signedTimestamp: Date.now() - 1800000 },
  { address: 'GCX9PW4M102L9R4GBV2X5Z6P7E5K3J7X9P02L9R4E91M822', name: 'Protocol Treasury Custodian', weight: 1, hasSigned: false },
  { address: 'GBK11223344556677889900AABBCCDDEEFFGGHHIIJJKKLLMM', name: 'Independent Technical Auditor', weight: 1, hasSigned: false },
];

export const INITIAL_MULTISIG_TRANSACTIONS: MultiSigTreasuryTransaction[] = [
  {
    txId: 'msig-tx-201',
    title: 'Disburse 50,000 XLM Yield to Amazon Agroforestry Pool',
    description: 'Quarterly staking yield settlement for Amazon Basin carbon sequestration validators.',
    targetContract: 'CDMAINNETGREENLEDGER99999999999999999999999999999999999999',
    amountXlm: 50000,
    carbonCreditsTons: 4000,
    recipientAddress: 'GAEQ5IUNQTW36XMQF6MR2VWKPG3JOF6IKEGAD2JQ6OUNKTUVBAIE5AO3',
    thresholdRequired: 3,
    currentWeight: 2,
    status: 'PENDING_SIGNATURES',
    signers: INITIAL_MULTISIG_SIGNERS,
    createdAt: Date.now() - 7200000,
  },
];

/**
 * Signs a multi-signature transaction. If threshold is reached, automatically marks as EXECUTED.
 */
export function signMultiSigTransaction(
  tx: MultiSigTreasuryTransaction,
  signerAddress: string
): { updatedTx: MultiSigTreasuryTransaction; isExecuted: boolean } {
  let newWeight = 0;
  const updatedSigners = tx.signers.map((s) => {
    if (s.address === signerAddress && !s.hasSigned) {
      newWeight += s.weight;
      return { ...s, hasSigned: true, signedTimestamp: Date.now() };
    }
    if (s.hasSigned) {
      newWeight += s.weight;
    }
    return s;
  });

  const isExecuted = newWeight >= tx.thresholdRequired;
  const seed = `${tx.txId}:${newWeight}:${Date.now()}`;
  let hashNum = 0;
  for (let i = 0; i < seed.length; i++) {
    hashNum = (hashNum << 5) - hashNum + seed.charCodeAt(i);
    hashNum |= 0;
  }
  const txHash = isExecuted ? `0x${Math.abs(hashNum).toString(16).padStart(16, '0')}${Date.now().toString(16).padStart(16, '0')}`.padEnd(66, 'c') : undefined;

  const updatedTx: MultiSigTreasuryTransaction = {
    ...tx,
    signers: updatedSigners,
    currentWeight: newWeight,
    status: isExecuted ? 'EXECUTED' : 'PENDING_SIGNATURES',
    executedAt: isExecuted ? Date.now() : undefined,
    txHash,
  };

  return { updatedTx, isExecuted };
}
