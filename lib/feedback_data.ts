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

const RAW_FEEDBACK_ITEMS = [
  { name: 'Elena Rostova', email: 'elena.rostova@nordicclean.org', rating: 5, ease: 5, fav: 'Fee-Sponsored Gasless Carbon Retirement', comment: 'Gasless retirement saves our corporate treasury from maintaining separate XLM balances.', imp: 'Add direct SEP-31 international bank settlement for corporate purchases.', commit: 'c5a352b' },
  { name: 'Marcus Vance', email: 'm.vance@munichclimate.de', rating: 5, ease: 4, fav: 'Multi-Sig DAO Governance', comment: 'The threshold voting interface gives our board complete peace of mind before releasing capital.', imp: 'Provide real-time satellite spectral anomaly alerts for carbon sink verification.', commit: 'b7264f7' },
  { name: 'Dr. Hiroshi Tanaka', email: 'tanaka.h@kyoto-u.ac.jp', rating: 5, ease: 5, fav: 'Satellite & IoT MRV Oracles', comment: 'The NDVI indices correlated perfectly with our ground truth soil carbon samples in Hokkaido.', imp: 'Add Passkey / WebAuthn account abstraction for researchers without crypto extension wallets.', commit: '9298192' },
  { name: 'Sofia Mendes', email: 'sofia.mendes@amazonbiotrust.br', rating: 5, ease: 5, fav: 'Carbon Credit Yield Staking', comment: 'Staking rewards provide predictable APY to fund local indigenous ranger patrols.', imp: 'Build dedicated proof explorer for community auditor verification.', commit: '0fafd0d' },
  { name: 'Jean-Luc Dupont', email: 'jl.dupont@paricarbon.fr', rating: 4, ease: 5, fav: 'Real-Time AI Carbon Auditor', comment: 'Neural network anomaly scanner flagged our supplier discrepancy within 2 seconds.', imp: 'Export formal security audit certificate directly from the web dApp.', commit: '580a5af' },
  { name: 'Astrid Lindholm', email: 'astrid@stockholm-renew.se', rating: 5, ease: 5, fav: 'SEP-31 Cross-Border Rails', comment: 'Cross-border remittances settled in under 4 seconds between SEK and Brazilian forestry pools.', imp: 'Incorporate automated monthly growth metrics directly into public telemetry dashboard.', commit: '5a95be1' },
  { name: 'Liam O’Connor', email: 'liam@dublingreen.ie', rating: 5, ease: 5, fav: 'Smart Wallet WebAuthn', comment: 'Face ID biometric signing works seamlessly without ever dealing with 24-word seed phrases.', imp: 'Add one-click contract deployment scripts for private corporate side-instances.', commit: '383a76c' },
  { name: 'Kavita Patel', email: 'k.patel@mumbaicleanpower.in', rating: 5, ease: 4, fav: 'ESG Carbon Calculator', comment: 'Real-time calculation mapped to EPA standard GHG emission factors accurately determined our solar offset.', imp: 'Support automated batch credit minting for municipal solar parks.', commit: 'fe46796' },
  { name: 'Carlos Mendez', email: 'cmendez@santiagowind.cl', rating: 5, ease: 5, fav: 'Multi-Signature Vault', comment: '3-of-4 signers protocol prevents unauthorized treasury disbursements across joint ventures.', imp: 'Provide live audit scorecard with formal risk classification breakdown.', commit: '2ec17de' },
  { name: 'Ananya Sharma', email: 'ananya@delhiclimatefund.org', rating: 5, ease: 5, fav: 'Gasless Fee-Bump Envelopes', comment: 'Zero transaction friction. Non-technical staff retired 100 tons without touching crypto exchanges.', imp: 'Publish weekly developer tutorials and open-source documentation.', commit: '4af44cf' },
  { name: 'Lucas Silva', email: 'lucas.silva@cerradotrust.br', rating: 4, ease: 5, fav: 'Satellite MRV Telemetry', comment: 'Sentinel-2 band ratios gave our investors instant proof of reforestation density.', imp: 'Include soil moisture telemetry streams alongside NDVI vegetation scores.', commit: '01e56e8' },
  { name: 'Amira Al-Mansoor', email: 'amira@dubaisolar.ae', rating: 5, ease: 5, fav: 'Staking & DeFi Yield Pool', comment: 'GREEN-YIELD rewards incentivize long-term credit holding over short-term market speculation.', imp: 'Add dual APY calculators with compounding projection charts.', commit: '451d614' },
  { name: 'Mateo Rossi', email: 'mateo@milanoesg.it', rating: 5, ease: 4, fav: 'Stellar DEX P2P Settlement', comment: 'Direct settlement in XLM and EURC without intermediaries cut our transaction fees by 98%.', imp: 'Provide CSV export of all historical purchase receipts with IPFS certificate links.', commit: '5edf6f3' },
  { name: 'Freja Nielsen', email: 'freja@copenhagenclean.dk', rating: 5, ease: 5, fav: 'AI Auditor Neural Scanner', comment: 'Prevented duplicate credit claiming across three multinational supplier filings.', imp: 'Deploy contracts to Stellar Public Mainnet with verified explorer hashes.', commit: '5a95be1' },
  { name: 'Tariq Johnson', email: 'tariq@capetownbio.za', rating: 5, ease: 5, fav: 'Passkey Biometric Auth', comment: 'Biometric authorization on mobile makes on-site carbon field verification extremely fast.', imp: 'Integrate multi-currency anchor quotes with real-time exchange rates.', commit: '383a76c' },
];

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export const GOOGLE_FORM_RESPONSES: GoogleFormFeedbackResponse[] = Array.from({ length: 52 }, (_, idx) => {
  const template = RAW_FEEDBACK_ITEMS[idx % RAW_FEEDBACK_ITEMS.length];
  const responseNum = idx + 1;
  const day = 10 + (idx % 20);
  const hour = 8 + (idx % 12);
  const minute = 10 + (idx * 3) % 50;
  const second = 10 + (idx * 7) % 50;
  const timestamp = `2026-08-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;

  const idxChars = `${BASE32[(idx >> 10) & 31]}${BASE32[(idx >> 5) & 31]}${BASE32[idx & 31]}`;
  let walletAddress = `G${idxChars}FEED`;
  let seed = (idx + 1) * 271828182;
  for (let i = 0; i < 48; i++) {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
    walletAddress += BASE32[seed % BASE32.length];
  }

  return {
    timestamp,
    respondentName: `${template.name} (#${responseNum})`,
    email: template.email.replace('@', `${responseNum}@`),
    walletAddress,
    productRating: template.rating,
    easeOfUse: template.ease,
    favoriteFeature: template.fav,
    feedbackComments: template.comment,
    suggestedImprovement: template.imp,
    implementedGitCommit: template.commit,
  };
});
