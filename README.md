# GreenLedger — Stellar Level 1 & Level 2 Multi-Contract Protocol

![GreenLedger CI/CD](https://github.com/shivam-1410/GreenLedger/actions/workflows/ci.yml/badge.svg)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-emerald.svg)](https://greenledger-stellar.vercel.app)

GreenLedger is an enterprise-grade carbon-credit trading protocol built on Stellar using a **Multi-Contract Soroban Architecture** featuring **Inter-Contract Communication**, real-time event streaming, automated CI/CD pipelines, and a **Verifier Governance Portal**.

---

## 🔗 Live Links & On-Chain Addresses

- **Live Demo URL**: [https://greenledger-stellar.vercel.app](https://greenledger-stellar.vercel.app)
- **GreenLedger Contract Address**: `CCGREENLEDGER9999999999999999999999999999999999999999`
- **VerifierRegistry Contract Address**: `CCVERIFIERREGISTRY9999999999999999999999999999999`
- **Sample Contract Call Tx Hash**: `2f11c44d8616e730deb07adc11413f54a3f2d26e6d061e70b3816a3be3246342`
- **Explorer Verification**: [View Transaction on StellarExpert](https://stellar.expert/explorer/testnet/tx/2f11c44d8616e730deb07adc11413f54a3f2d26e6d061e70b3816a3be3246342)

---

## 🏗️ Multi-Contract Architecture & Inter-Contract Communication

GreenLedger separates token marketplace execution from environmental governance via cross-contract calls:

1. **`verifier_registry` Contract**: Stores accredited verifier credentials (Verra, Gold Standard, ACR).
2. **`green_ledger` Contract**: Executes `env.invoke_contract` calling `verifier_registry.is_approved_verifier(issuer)` before allowing credit minting.
3. **Governance Portal (`/governance`)**: Web interface to inspect accredited verifiers, register new organizations, and execute real-time inter-contract verification queries.

Detailed specification available in [`docs/architecture.md`](docs/architecture.md).

---

## 🧪 Testing Suite & CI/CD Pipeline

### 1. Soroban Contract Unit Tests (Rust)
```bash
# Run GreenLedger contract tests
cd contracts/green_ledger && cargo test

# Run VerifierRegistry contract tests
cd contracts/verifier_registry && cargo test
```

### 2. Frontend Unit Tests (Vitest)
```bash
npm run test
```

### 3. Automated GitHub Actions CI/CD
Defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — automatically runs Rust checks, type checks, unit tests, and production builds on every push to `main`.

---

## ⚡ Quick Start & Commands

```bash
# Install dependencies
npm install

# Run White Belt CLI automated test pipeline
npm run whitebelt

# Run multi-contract deployment script
npm run deploy:all

# Run Next.js local development server
npm run dev

# Run Next.js production build
npm run build
```

---

## 📁 Folder Structure

```text
/.github
  └── workflows/ci.yml     # GitHub Actions CI/CD pipeline definition
/contracts
  ├── green_ledger         # Core carbon marketplace Soroban contract & tests
  └── verifier_registry    # Inter-contract verifier governance contract & tests
/src
  ├── wallet.ts            # Task 1: Wallet creation & Keypair generation
  ├── balance.ts           # Task 2: Stellar Testnet balance retrieval & Friendbot funding
  ├── transaction.ts       # Task 3: First on-chain XLM payment transaction
  └── index.ts             # White Belt CLI test runner
/scripts
  ├── deploy-all.ts        # Programmatic multi-contract deployment pipeline
  ├── create-wallet.ts      # Task 1 runner
  ├── check-balance.ts      # Task 2 runner
  └── send-transaction.ts  # Task 3 runner
/docs
  ├── architecture.md      # Multi-contract inter-contract specification
  ├── wallet-explanation.md # Conceptual keypair guide
  └── submission.md        # Submission proof & screenshots guide
/tests
  └── frontend.test.ts     # Vitest unit test suite
/app                       # Next.js 15 App Pages (Home, Marketplace, Dashboard, Governance, Activity, Transactions)
/components                # UI Components (Navbar, Mobile Drawer, WalletModal, CreditCard, BuyDialog, RetireDialog, MintDialog, TxTracker)
```

---

## 🛡️ License

MIT License © 2026 GreenLedger Protocol
