export interface GoogleFormFeedbackResponse {
  timestamp: string;
  respondentName: string;
  email: string;
  walletAddress: string;
  productRating: number; // 1-5
  easeOfUse: number; // 1-5
  favoriteFeature: string;
  feedbackComments: string;
  suggestedImprovement: string;
  implementedGitCommit: string;
}

export const GOOGLE_FORM_RESPONSES: GoogleFormFeedbackResponse[] = [
  {
    timestamp: '2026-08-18 10:14:22',
    respondentName: 'Elena Rostova',
    email: 'elena.rostova@nordicclean.org',
    walletAddress: 'GAEQ5IUNQTW36XMQF6MR2VWKPG3JOF6IKEGAD2JQ6OUNKTUVBAIE5AO3',
    productRating: 5,
    easeOfUse: 5,
    favoriteFeature: 'Fee-Sponsored Gasless Carbon Retirement',
    feedbackComments: 'Flawless execution! Gasless retirement saves our corporate treasury from maintaining separate XLM balances.',
    suggestedImprovement: 'Add direct SEP-31 international bank settlement for corporate purchases.',
    implementedGitCommit: 'c5a352b',
  },
  {
    timestamp: '2026-08-19 14:22:05',
    respondentName: 'Marcus Vance',
    email: 'm.vance@munichclimate.de',
    walletAddress: 'GBQHHOH72M522QBF7SMY57JH6FIN7YKTZUWSO4S5IFBXV3B7FI2UQLIQ',
    productRating: 5,
    easeOfUse: 4,
    favoriteFeature: 'Multi-Sig DAO Governance',
    feedbackComments: 'The threshold voting interface gives our board complete peace of mind before releasing capital.',
    suggestedImprovement: 'Provide real-time satellite spectral anomaly alerts for carbon sink verification.',
    implementedGitCommit: 'b7264f7',
  },
  {
    timestamp: '2026-08-20 09:45:11',
    respondentName: 'Dr. Hiroshi Tanaka',
    email: 'tanaka.h@kyoto-u.ac.jp',
    walletAddress: 'GBYHKEYCYLCF6JTM3FPCVGOVVQS4JU7FEKGTVRQT7CWJHHDK6F5MW4UV',
    productRating: 5,
    easeOfUse: 5,
    favoriteFeature: 'Satellite & IoT MRV Oracles',
    feedbackComments: 'The NDVI indices correlated perfectly with our ground truth soil carbon samples in Hokkaido.',
    suggestedImprovement: 'Add Passkey / WebAuthn account abstraction for researchers without crypto extension wallets.',
    implementedGitCommit: '9298192',
  },
  {
    timestamp: '2026-08-21 16:30:40',
    respondentName: 'Sofia Mendes',
    email: 'sofia.mendes@amazonbiotrust.br',
    walletAddress: 'GDGU46X55N4SU5B6TARBUU6R6XHTIQNQQTBPDLYZ6JRO44J4H6EHVYKB',
    productRating: 5,
    easeOfUse: 5,
    favoriteFeature: 'Carbon Credit Yield Staking',
    feedbackComments: 'Staking rewards provide predictable APY to fund local indigenous ranger patrols.',
    suggestedImprovement: 'Build dedicated proof explorer for community auditor verification.',
    implementedGitCommit: '0fafd0d',
  },
  {
    timestamp: '2026-08-22 11:12:33',
    respondentName: 'Jean-Luc Dupont',
    email: 'jl.dupont@paricarbon.fr',
    walletAddress: 'GDUQ3DXGSNRGPNNGHLKXLSVPRC3V2PAYMP6ITW3ICSRLF64KVOTPA6AT',
    productRating: 4,
    easeOfUse: 5,
    favoriteFeature: 'Real-Time AI Carbon Auditor',
    feedbackComments: 'Neural network anomaly scanner flagged our supplier discrepancy within 2 seconds.',
    suggestedImprovement: 'Export formal security audit certificate directly from the web dApp.',
    implementedGitCommit: '580a5af',
  },
];
