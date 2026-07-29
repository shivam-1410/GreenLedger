import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as freighterApi from '@stellar/freighter-api';
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';
import {
  checkFreighterStatus,
  connectWallet,
  signTransactionXdr,
  requestWalletAccess,
  getActiveWalletAddress,
  FREIGHTER_ID,
  ALBEDO_ID,
} from '../lib/wallet';
import {
  checkFreighterPermissions,
  requestWalletPermissions,
  getWalletAddress,
  signTransactionWithWallet,
} from '../src/wallet';

vi.mock('@stellar/freighter-api', () => ({
  isConnected: vi.fn(),
  requestAccess: vi.fn(),
  getAddress: vi.fn(),
  signTransaction: vi.fn(),
  isAllowed: vi.fn(),
}));

vi.mock('@creit.tech/stellar-wallets-kit', () => ({
  StellarWalletsKit: {
    setWallet: vi.fn(),
    getAddress: vi.fn(),
    signTransaction: vi.fn(),
    disconnect: vi.fn(),
  },
  Networks: {
    TESTNET: 'TESTNET',
  },
}));

describe('Stellar Wallet Integration & Verification Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Wallet Permissions & Status Check', () => {
    it('returns true when Freighter is connected and allowed', async () => {
      vi.mocked(freighterApi.isConnected).mockResolvedValue(true as any);
      vi.mocked(freighterApi.isAllowed).mockResolvedValue(true as any);

      const status = await checkFreighterStatus();
      expect(status).toBe(true);

      const permissions = await checkFreighterPermissions();
      expect(permissions).toBe(true);
    });

    it('returns false when Freighter is not connected', async () => {
      vi.mocked(freighterApi.isConnected).mockResolvedValue(false as any);

      const status = await checkFreighterStatus();
      expect(status).toBe(false);

      const permissions = await checkFreighterPermissions();
      expect(permissions).toBe(false);
    });

    it('requests wallet permissions from Freighter correctly', async () => {
      const mockAddress = 'GB3K6BLTHFD6E5MFECE7ODCYQXNIVKCYBHJPOOLLJ36RTL43R7KCY2Z4';
      vi.mocked(freighterApi.requestAccess).mockResolvedValue(mockAddress as any);

      const address = await requestWalletAccess(FREIGHTER_ID);
      expect(address).toBe(mockAddress);
      expect(freighterApi.requestAccess).toHaveBeenCalled();

      const addressSrc = await requestWalletPermissions();
      expect(addressSrc).toBe(mockAddress);
    });
  });

  describe('Address Retrieval Functionality', () => {
    it('retrieves active Freighter wallet address', async () => {
      const mockAddress = 'GD2AQNDRSSX2BD6L75UUYH3JH4MUVHSYM4PCXJNOHW3XLQ67TSEQKGWO';
      vi.mocked(freighterApi.getAddress).mockResolvedValue({ address: mockAddress } as any);

      const address = await getActiveWalletAddress(FREIGHTER_ID);
      expect(address).toBe(mockAddress);

      const addressSrc = await getWalletAddress('freighter');
      expect(addressSrc).toBe(mockAddress);
    });

    it('retrieves wallet address via StellarWalletsKit for non-freighter wallets', async () => {
      const mockAddress = 'GC4K6BLTHFD6E5MFECE7ODCYQXNIVKCYBHJPOOLLJ36RTL43R7KCY999';
      vi.mocked(StellarWalletsKit.getAddress).mockResolvedValue({ address: mockAddress } as any);

      const address = await getActiveWalletAddress(ALBEDO_ID);
      expect(address).toBe(mockAddress);
      expect(StellarWalletsKit.setWallet).toHaveBeenCalledWith(ALBEDO_ID);
    });
  });

  describe('Connect Wallet Functionality', () => {
    it('successfully connects to Freighter wallet', async () => {
      const mockAddress = 'GD2AQNDRSSX2BD6L75UUYH3JH4MUVHSYM4PCXJNOHW3XLQ67TSEQKGWO';
      vi.mocked(freighterApi.isConnected).mockResolvedValue(true as any);
      vi.mocked(freighterApi.requestAccess).mockResolvedValue(mockAddress as any);
      vi.mocked(freighterApi.getAddress).mockResolvedValue(mockAddress as any);

      const result = await connectWallet(FREIGHTER_ID);
      expect(result.address).toBe(mockAddress);
      expect(result.walletType).toBe('freighter');
    });

    it('successfully connects via StellarWalletsKit for Albedo', async () => {
      const mockAddress = 'GC4K6BLTHFD6E5MFECE7ODCYQXNIVKCYBHJPOOLLJ36RTL43R7KCY999';
      vi.mocked(StellarWalletsKit.getAddress).mockResolvedValue({ address: mockAddress } as any);

      const result = await connectWallet(ALBEDO_ID);
      expect(result.address).toBe(mockAddress);
      expect(result.walletType).toBe('albedo');
    });
  });

  describe('Transaction Signing Functionality', () => {
    it('signs transaction XDR via Freighter API', async () => {
      const mockXdr = 'AAAAAgAAAAD...mockxdr';
      const mockSignedXdr = 'AAAAAgAAAAD...signedxdr';
      const mockPubKey = 'GD2AQNDRSSX2BD6L75UUYH3JH4MUVHSYM4PCXJNOHW3XLQ67TSEQKGWO';

      vi.mocked(freighterApi.signTransaction).mockResolvedValue(mockSignedXdr as any);

      const signed = await signTransactionWithWallet(mockXdr, mockPubKey, 'freighter');
      expect(signed).toBe(mockSignedXdr);
      expect(freighterApi.signTransaction).toHaveBeenCalledWith(mockXdr, {
        networkPassphrase: 'Test SDF Network ; September 2015',
        address: mockPubKey,
      });

      const signedLib = await signTransactionXdr(mockXdr, mockPubKey, 'freighter');
      expect(signedLib).toBe(mockSignedXdr);
    });

    it('signs transaction XDR via StellarWalletsKit', async () => {
      const mockXdr = 'AAAAAgAAAAD...mockxdr';
      const mockSignedXdr = 'AAAAAgAAAAD...signedxdr';
      const mockPubKey = 'GC4K6BLTHFD6E5MFECE7ODCYQXNIVKCYBHJPOOLLJ36RTL43R7KCY999';

      vi.mocked(StellarWalletsKit.signTransaction).mockResolvedValue(mockSignedXdr as any);

      const signed = await signTransactionWithWallet(mockXdr, mockPubKey, 'albedo');
      expect(signed).toBe(mockSignedXdr);
      expect(StellarWalletsKit.signTransaction).toHaveBeenCalled();
    });
  });
});
