import { create } from 'zustand';
import { WalletState } from '@/types';
import { connectWallet, disconnectWallet, signTransactionXdr } from '@/lib/wallet';
import { fetchAccountXlmBalance } from '@/lib/stellar';

interface WalletStoreState extends WalletState {
  isConnecting: boolean;
  error: string | null;
  connect: (walletId: string) => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  clearError: () => void;
  signTx: (xdr: string) => Promise<string>;
}

export const useWalletStore = create<WalletStoreState>((set, get) => ({
  isConnected: false,
  publicKey: null,
  walletType: 'none',
  network: 'Testnet',
  xlmBalance: 0,
  userRetiredTons: 350,
  isConnecting: false,
  error: null,

  connect: async (walletId: string) => {
    set({ isConnecting: true, error: null });
    try {
      const res = await connectWallet(walletId);
      const balance = await fetchAccountXlmBalance(res.address);

      set({
        isConnected: true,
        publicKey: res.address,
        walletType: res.walletType,
        xlmBalance: balance,
        isConnecting: false,
        error: null,
      });
    } catch (err: any) {
      set({
        isConnecting: false,
        error: err.message || 'Failed to connect wallet',
      });
      throw err;
    }
  },

  disconnect: () => {
    disconnectWallet();
    set({
      isConnected: false,
      publicKey: null,
      walletType: 'none',
      xlmBalance: 0,
      error: null,
    });
  },

  refreshBalance: async () => {
    const { publicKey } = get();
    if (publicKey) {
      const balance = await fetchAccountXlmBalance(publicKey);
      set({ xlmBalance: balance });
    }
  },

  clearError: () => set({ error: null }),

  signTx: async (xdr: string) => {
    const { publicKey, walletType } = get();
    if (!publicKey) {
      throw new Error('No wallet has been connected. Please connect your wallet first.');
    }
    return signTransactionXdr(xdr, publicKey, walletType);
  },
}));
