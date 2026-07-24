import { create } from 'zustand';
import { CarbonCredit, ContractEvent, PlatformStats, RetirementRecord, TrackedTransaction } from '@/types';
import { MOCK_PROJECTS } from '@/lib/config';
import { INITIAL_EVENTS } from '@/lib/events';

interface AppStoreState {
  projects: CarbonCredit[];
  events: ContractEvent[];
  transactions: TrackedTransaction[];
  retirements: RetirementRecord[];
  userInventory: { creditId: string; amount: number }[];
  stats: PlatformStats;

  // Actions
  addTransaction: (tx: Omit<TrackedTransaction, 'id' | 'timestamp'>) => string;
  updateTransaction: (id: string, updates: Partial<TrackedTransaction>) => void;
  addEvent: (event: Omit<ContractEvent, 'id' | 'timestamp'>) => void;
  mintProject: (project: Omit<CarbonCredit, 'id' | 'availableSupply'>) => void;
  buyCredits: (creditId: string, amount: number, buyerAddress: string) => void;
  retireCredits: (creditId: string, amount: number, ownerAddress: string, reason: string) => string;
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  projects: MOCK_PROJECTS,
  events: INITIAL_EVENTS,
  transactions: [],
  retirements: [
    {
      id: 'cert-881920',
      creditId: '1',
      projectName: 'Amazon Rainforest Protection & Restoration',
      owner: 'GBV2X...R4E91',
      amount: 250,
      reason: 'Corporate Annual Net-Zero Goal 2024 Offset',
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
      certificateHash: '0x8f1e920b7a8c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e',
    },
    {
      id: 'cert-104921',
      creditId: '3',
      projectName: 'Indonesian Mangrove Blue Carbon Sink',
      owner: 'GBV2X...R4E91',
      amount: 100,
      reason: 'Personal Flight & Commute Carbon Footprint Compensation',
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 12,
      certificateHash: '0x4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f1e920b7a8c3d4e5f6a7b8c9d0e1f2a3b',
    },
  ],
  userInventory: [
    { creditId: '1', amount: 50 },
    { creditId: '2', amount: 120 },
  ],
  stats: {
    totalCreditsMinted: 4,
    totalCo2OffsetTons: 14850,
    totalActiveListings: 4,
    totalVolumeXlm: 54200,
  },

  addTransaction: (tx) => {
    const id = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newTx: TrackedTransaction = {
      ...tx,
      id,
      timestamp: Date.now(),
    };
    set((state) => ({ transactions: [newTx, ...state.transactions] }));
    return id;
  },

  updateTransaction: (id, updates) => {
    set((state) => ({
      transactions: state.transactions.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx)),
    }));
  },

  addEvent: (event) => {
    const newEvt: ContractEvent = {
      ...event,
      id: `evt-${Date.now()}`,
      timestamp: Date.now(),
    };
    set((state) => ({ events: [newEvt, ...state.events] }));
  },

  mintProject: (newP) => {
    const id = (get().projects.length + 1).toString();
    const fullProject: CarbonCredit = {
      ...newP,
      id,
      availableSupply: newP.totalSupply,
    };

    set((state) => ({
      projects: [fullProject, ...state.projects],
      stats: {
        ...state.stats,
        totalCreditsMinted: state.stats.totalCreditsMinted + 1,
      },
    }));

    get().addEvent({
      type: 'mint',
      walletAddress: newP.issuer,
      creditId: id,
      projectName: newP.projectName,
      co2Tons: newP.co2Tons,
      amount: newP.totalSupply,
      txHash: '0x' + Math.random().toString(16).substring(2, 34),
    });
  },

  buyCredits: (creditId, amount, buyerAddress) => {
    set((state) => {
      const updatedProjects = state.projects.map((p) => {
        if (p.id === creditId) {
          return {
            ...p,
            availableSupply: Math.max(0, p.availableSupply - amount),
          };
        }
        return p;
      });

      const existingInv = state.userInventory.find((i) => i.creditId === creditId);
      let updatedInv = state.userInventory;

      if (existingInv) {
        updatedInv = state.userInventory.map((i) =>
          i.creditId === creditId ? { ...i, amount: i.amount + amount } : i
        );
      } else {
        updatedInv = [...state.userInventory, { creditId, amount }];
      }

      const project = state.projects.find((p) => p.id === creditId);
      const cost = project ? project.pricePerTon * amount : 0;

      return {
        projects: updatedProjects,
        userInventory: updatedInv,
        stats: {
          ...state.stats,
          totalVolumeXlm: state.stats.totalVolumeXlm + cost,
        },
      };
    });

    const p = get().projects.find((pr) => pr.id === creditId);
    get().addEvent({
      type: 'buy',
      walletAddress: buyerAddress,
      creditId,
      projectName: p?.projectName || 'Carbon Project',
      amount,
      co2Tons: amount,
      priceXlm: p?.pricePerTon,
      txHash: '0x' + Math.random().toString(16).substring(2, 34),
    });
  },

  retireCredits: (creditId, amount, ownerAddress, reason) => {
    const certHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const certId = `cert-${Math.floor(100000 + Math.random() * 900000)}`;

    const p = get().projects.find((pr) => pr.id === creditId);
    const projectName = p?.projectName || 'Carbon Project';

    set((state) => {
      const updatedInv = state.userInventory
        .map((i) => (i.creditId === creditId ? { ...i, amount: Math.max(0, i.amount - amount) } : i))
        .filter((i) => i.amount > 0);

      const newCert: RetirementRecord = {
        id: certId,
        creditId,
        projectName,
        owner: ownerAddress,
        amount,
        reason,
        timestamp: Date.now(),
        certificateHash: certHash,
      };

      return {
        userInventory: updatedInv,
        retirements: [newCert, ...state.retirements],
        stats: {
          ...state.stats,
          totalCo2OffsetTons: state.stats.totalCo2OffsetTons + amount,
        },
      };
    });

    get().addEvent({
      type: 'retire',
      walletAddress: ownerAddress,
      creditId,
      projectName,
      co2Tons: amount,
      amount,
      txHash: '0x' + Math.random().toString(16).substring(2, 34),
    });

    return certHash;
  },
}));
