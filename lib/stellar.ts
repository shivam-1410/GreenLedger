import {
  rpc,
  Horizon,
  Contract,
  Address,
  nativeToScVal,
  scValToNative,
  xdr,
  TransactionBuilder,
  Operation,
  Asset,
  Networks,
} from '@stellar/stellar-sdk';
import { STELLAR_CONFIG, MOCK_PROJECTS } from './config';
import { CarbonCredit, PlatformStats } from '@/types';

export const sorobanServer = new rpc.Server(STELLAR_CONFIG.rpcUrl);
export const horizonServer = new Horizon.Server(STELLAR_CONFIG.horizonUrl);

export async function fetchAccountXlmBalance(publicKey: string): Promise<number> {
  try {
    const res = await fetch(`${STELLAR_CONFIG.horizonUrl}/accounts/${publicKey}`);
    if (!res.ok) return 0;
    const data = await res.json();
    const nativeBalance = data.balances?.find((b: any) => b.asset_type === 'native');
    return nativeBalance ? parseFloat(nativeBalance.balance) : 0;
  } catch (err) {
    console.warn('Error fetching account balance from Horizon:', err);
    return 0;
  }
}

export async function fundAccountWithFriendbot(publicKey: string): Promise<boolean> {
  try {
    const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
    return res.ok;
  } catch (err) {
    console.error('Friendbot request error:', err);
    return false;
  }
}

export async function buildXlmPaymentTxXdr(
  senderPublicKey: string,
  destinationPublicKey: string,
  amountXlm: string
): Promise<string> {
  const account = await horizonServer.loadAccount(senderPublicKey);
  const tx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: STELLAR_CONFIG.networkPassphrase,
  })
    .addOperation(
      Operation.payment({
        destination: destinationPublicKey,
        asset: Asset.native(),
        amount: amountXlm,
      })
    )
    .setTimeout(30)
    .build();

  return tx.toXDR();
}

export async function submitHorizonTransaction(
  signedTxXdr: string
): Promise<{ status: 'SUCCESS' | 'FAILED'; hash: string; error?: string }> {
  try {
    const tx = TransactionBuilder.fromXDR(signedTxXdr, STELLAR_CONFIG.networkPassphrase);
    const response = await horizonServer.submitTransaction(tx);
    return {
      status: 'SUCCESS',
      hash: response.hash,
    };
  } catch (err: any) {
    console.error('Submit Horizon transaction error:', err);
    let errMsg = err?.message || 'Transaction execution failed';
    if (err?.response?.data?.extras?.result_codes) {
      errMsg += ` [Codes: ${JSON.stringify(err.response.data.extras.result_codes)}]`;
    }
    return {
      status: 'FAILED',
      hash: '',
      error: errMsg,
    };
  }
}

export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const contractData: any = await sorobanServer.getContractData(
      STELLAR_CONFIG.contractId,
      nativeToScVal('PlatformStatsKey')
    );
    if (contractData && contractData.val) {
      const native = scValToNative(contractData.val);
      return {
        totalCreditsMinted: Number(native.total_credits_minted || 4),
        totalCo2OffsetTons: Number(native.total_co2_offset_tons || 12450),
        totalActiveListings: Number(native.total_active_listings || 4),
        totalVolumeXlm: Number(native.total_volume_xlm || 48500),
      };
    }
  } catch (err) {
    console.log('Contract stats query using mock fallback stats');
  }

  return {
    totalCreditsMinted: 4,
    totalCo2OffsetTons: 14850,
    totalActiveListings: 4,
    totalVolumeXlm: 54200,
  };
}

export async function getMarketplaceCredits(): Promise<CarbonCredit[]> {
  try {
    if (STELLAR_CONFIG.contractId && !STELLAR_CONFIG.contractId.includes('CCGREENLEDGER999')) {
      const ledgerEntry: any = await sorobanServer.getContractData(
        STELLAR_CONFIG.contractId,
        nativeToScVal('CreditSeq')
      );
      if (ledgerEntry && ledgerEntry.val) {
        const totalSeq = Number(scValToNative(ledgerEntry.val));
        const credits: CarbonCredit[] = [];
        for (let i = 1; i <= totalSeq; i++) {
          const creditData: any = await sorobanServer.getContractData(
            STELLAR_CONFIG.contractId,
            nativeToScVal(i)
          );
          if (creditData && creditData.val) {
            const raw = scValToNative(creditData.val);
            credits.push({
              id: raw.id.toString(),
              issuer: raw.issuer,
              projectName: raw.project_name,
              creditType: raw.credit_type,
              co2Tons: Number(raw.co2_tons),
              vintageYear: Number(raw.vintage_year),
              certificateUrl: raw.certificate_url,
              totalSupply: Number(raw.total_supply),
              availableSupply: Number(raw.available_supply),
              pricePerTon: Number(raw.price_per_ton) / 10000000,
              isVerified: Boolean(raw.is_verified),
            });
          }
        }
        if (credits.length > 0) return credits;
      }
    }
  } catch (err) {
    console.log('Using default carbon credit marketplace projects');
  }

  return MOCK_PROJECTS;
}

export async function submitSorobanTransaction(
  signedTxXdr: string
): Promise<{ status: 'SUCCESS' | 'FAILED'; hash: string; error?: string }> {
  try {
    const tx = TransactionBuilder.fromXDR(signedTxXdr, STELLAR_CONFIG.networkPassphrase);
    const sendResponse: any = await sorobanServer.sendTransaction(tx);

    if (sendResponse.status === 'ERROR') {
      return {
        status: 'FAILED',
        hash: tx.hash().toString('hex'),
        error: sendResponse.errorResultXdr || sendResponse.errorResult || 'Transaction submission error',
      };
    }

    const txHash = sendResponse.hash;
    let statusResponse = await sorobanServer.getTransaction(txHash);

    let attempts = 0;
    while (statusResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND && attempts < 10) {
      await new Promise((r) => setTimeout(r, 1500));
      statusResponse = await sorobanServer.getTransaction(txHash);
      attempts++;
    }

    if (statusResponse.status === rpc.Api.GetTransactionStatus.SUCCESS) {
      return { status: 'SUCCESS', hash: txHash };
    } else {
      return {
        status: 'FAILED',
        hash: txHash,
        error: 'Transaction failed on-chain',
      };
    }
  } catch (err: any) {
    console.error('Submit transaction error:', err);
    return {
      status: 'FAILED',
      hash: '',
      error: err.message || 'Transaction submission failed',
    };
  }
}
