import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as freighterApi from '@stellar/freighter-api';
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';
import {
  checkFreighterStatus,
  connectWallet,
  signTransactionXdr,
  disconnectWallet,
  FREIGHTER_ID,
} from '../lib/wallet';
import { fetchAccountXlmBalance, buildXlmPaymentTxXdr } from '../lib/stellar';
import { useWalletStore } from '../store/useWalletStore';

vi.mock('@stellar/freighter-api', () => ({
  __esModule: true,
  default: {
    isConnected: vi.fn(),
    requestAccess: vi.fn(),
    getAddress: vi.fn(),
    getPublicKey: vi.fn(),
    signTransaction: vi.fn(),
    isAllowed: vi.fn(),
  },
  isConnected: vi.fn(),
  requestAccess: vi.fn(),
  getAddress: vi.fn(),
  getPublicKey: vi.fn(),
  signTransaction: vi.fn(),
  isAllowed: vi.fn(),
}));

vi.mock('@creit.tech/stellar-wallets-kit', () => ({
  StellarWalletsKit: {
    init: vi.fn(),
    setWallet: vi.fn(),
    getAddress: vi.fn(),
    signTransaction: vi.fn(),
    disconnect: vi.fn(),
  },
  Networks: {
    TESTNET: 'TESTNET',
  },
}));

global.fetch = vi.fn();

describe('Level 1 Stellar Requirements Audit & Verification Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useWalletStore.setState({
      isConnected: false,
      publicKey: null,
      walletType: 'none',
      xlmBalance: 0,
      isConnecting: false,
      error: null,
    });
  });

  describe('1. Wallet Setup & Network', () => {
    it('verifies Freighter wallet extension detection on Stellar Testnet', async () => {
      vi.mocked(freighterApi.isConnected).mockResolvedValue(true as any);
      vi.mocked(freighterApi.isAllowed).mockResolvedValue(true as any);

      const isInstalled = await checkFreighterStatus();
      expect(isInstalled).toBe(true);
    });
  });

  describe('2. Wallet Connection & Disconnect', () => {
    it('connects to Freighter and updates Zustand state', async () => {
      const mockAddress = 'GD2AQNDRSSX2BD6L75UUYH3JH4MUVHSYM4PCXJNOHW3XLQ67TSEQKGWO';
      vi.mocked(freighterApi.isConnected).mockResolvedValue(true as any);
      vi.mocked((freighterApi as any).requestAccess).mockResolvedValue(mockAddress as any);
      vi.mocked(freighterApi.getPublicKey).mockResolvedValue({ address: mockAddress } as any);

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          balances: [{ asset_type: 'native', balance: '125.5000000' }],
        }),
      } as Response);

      await useWalletStore.getState().connect(FREIGHTER_ID);

      const state = useWalletStore.getState();
      expect(state.isConnected).toBe(true);
      expect(state.publicKey).toBe(mockAddress);
      expect(state.walletType).toBe('freighter');
      expect(state.xlmBalance).toBe(125.5);
    });

    it('disconnects wallet and clears active state', () => {
      useWalletStore.setState({
        isConnected: true,
        publicKey: 'GD2AQNDRSSX2BD6L75UUYH3JH4MUVHSYM4PCXJNOHW3XLQ67TSEQKGWO',
        walletType: 'freighter',
        xlmBalance: 500,
      });

      useWalletStore.getState().disconnect();

      const state = useWalletStore.getState();
      expect(state.isConnected).toBe(false);
      expect(state.publicKey).toBeNull();
      expect(state.xlmBalance).toBe(0);
    });
  });

  describe('3. Balance Handling', () => {
    it('fetches XLM balance from Horizon RPC for connected address', async () => {
      const mockAddress = 'GBV2X5Z6P7E5K3J7X9P02L9R4E91M822GBC4M822GDA7KL9P0';
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          balances: [{ asset_type: 'native', balance: '9999.5000000' }],
        }),
      } as Response);

      const balance = await fetchAccountXlmBalance(mockAddress);
      expect(balance).toBe(9999.5);
    });
  });

  describe('4. Transaction Flow & Feedback', () => {
    it('signs XLM transaction XDR using Freighter API', async () => {
      const mockXdr = 'AAAAAgAAAAD...mockxdr';
      const mockSignedXdr = 'AAAAAgAAAAD...signedxdr';
      const mockPubKey = 'GD2AQNDRSSX2BD6L75UUYH3JH4MUVHSYM4PCXJNOHW3XLQ67TSEQKGWO';

      vi.mocked(freighterApi.signTransaction).mockResolvedValue(mockSignedXdr as any);

      const signed = await signTransactionXdr(mockXdr, mockPubKey, 'freighter');
      expect(signed).toBe(mockSignedXdr);
    });
  });
});
