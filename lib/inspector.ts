import { SorobanContractInspection } from '@/types';

export const INSPECTOR_CONTRACTS: SorobanContractInspection[] = [
  {
    contractId: 'CCGREENLEDGER9999999999999999999999999999999999999999',
    contractName: 'GreenLedger Core Soroban Protocol',
    wasmHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    deployedLedger: 4084100,
    status: 'ACTIVE',
    totalEvents: 389,
    functions: [
      'mint(env, issuer, project_name, co2_tons, price_per_ton, cert_url)',
      'list_credits(env, seller, credit_id, amount, price_per_ton)',
      'buy_credits(env, buyer, listing_id, amount)',
      'retire_credits(env, owner, credit_id, amount, reason)',
      'get_credit_details(env, credit_id)',
      'get_platform_stats(env)',
    ],
  },
  {
    contractId: 'CCVERIFIERREGISTRY9999999999999999999999999999999',
    contractName: 'VerifierRegistry Governance Contract',
    wasmHash: 'a7c9381e4b85d99214ef5e998a101f3089ef233c411ab19e2086c23176bb201b',
    deployedLedger: 4084102,
    status: 'GOVERNANCE_VERIFIED',
    totalEvents: 142,
    functions: [
      'register_verifier(env, verifier_address, name, accreditation_uri)',
      'is_verifier_active(env, verifier_address)',
      'get_verifier_info(env, verifier_address)',
      'revoke_verifier(env, verifier_address)',
    ],
  },
];
