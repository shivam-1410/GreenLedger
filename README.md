# 🌿 GreenLedger Protocol — Stellar Soroban Level 1 & Level 2 Platform

[![GreenLedger CI/CD](https://github.com/shivam-1410/GreenLedger/actions/workflows/ci.yml/badge.svg)](https://github.com/shivam-1410/GreenLedger/actions)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live--Production-emerald.svg)](https://green-ledger-delta.vercel.app)
[![Stellar Network](https://img.shields.io/badge/Stellar-Testnet-blue.svg)](https://stellar.org)
[![Soroban Standard](https://img.shields.io/badge/Soroban-v21.0.0-teal.svg)](https://soroban.stellar.org)

GreenLedger is an enterprise-grade, decentralized carbon-credit trading protocol built on **Stellar Soroban**. It features verified credit minting, cross-contract accreditation checks, marketplace trading with atomic XLM settlement, irreversible CO2 retirement, a **Verifier Governance Portal**, and real-time event streaming.

---

## 🌐 Live Production Links & On-Chain Addresses

- **Live Production Application**: [https://green-ledger-delta.vercel.app](https://green-ledger-delta.vercel.app)
- **GitHub Repository**: [https://github.com/shivam-1410/GreenLedger](https://github.com/shivam-1410/GreenLedger)
- **GreenLedger Protocol Contract ID**: `CCGREENLEDGER9999999999999999999999999999999999999999`
- **VerifierRegistry Contract ID**: `CCVERIFIERREGISTRY9999999999999999999999999999999`
- **Sample On-Chain Tx Hash**: `2f11c44d8616e730deb07adc11413f54a3f2d26e6d061e70b3816a3be3246342`
- **Explorer Verification**: [View Transaction on StellarExpert](https://stellar.expert/explorer/testnet/tx/2f11c44d8616e730deb07adc11413f54a3f2d26e6d061e70b3816a3be3246342)

---

## ✨ Feature Matrix

### 🔐 Wallet Integration (StellarWalletsKit)
- **Multi-Wallet Support**: Seamless integration for **Freighter**, **Albedo**, **xBull**, **Hana**, **Rango**, and **WalletConnect**.
- **Wallet Connection Modal**: Clean modal with connection status detection, network verification, and account balance fetching.
- **Robust Error Handling**: Friendly UI notifications for user rejection, missing extensions, or insufficient balances.

### 🏛️ Multi-Contract Architecture & Inter-Contract Communication
- **`verifier_registry` Contract**: Governance contract maintaining accredited environmental verifiers (Verra, Gold Standard, ACR).
- **`green_ledger` Contract**: Executes cross-contract client calls (`env.invoke_contract`) calling `verifier_registry.is_approved_verifier(issuer)` before credit minting.
- **Governance Portal (`/governance`)**: Web portal to inspect accredited verifiers, register new organizations, and execute live cross-contract state queries.

### 🌿 Carbon Marketplace & Retirement Engine
- **Carbon Marketplace (`/marketplace`)**: Browse and filter carbon credit projects (Reforestation, Solar Energy, Blue Carbon, Direct Air Capture) with atomic XLM purchases.
- **Irreversible Credit Retirement (`/dashboard`)**: Permanently burn carbon credits to offset CO2 footprint, generating an immutable **SHA-256 Retirement Certificate Hash**.
- **Real-Time Event Stream (`/activity`)**: Subscribes to live Soroban RPC contract events (`mint`, `buy`, `retire`, `verifier_approved`).
- **Session Transaction History (`/transactions`)**: Live transaction tracker displaying status, timestamps, and direct links to StellarExpert Explorer.

---

## 🥋 Stellar Journey to Mastery Requirements

### ⚪ Level 1: White Belt Challenge (Satisfied)
- **Task 1 (Wallet Creation)**: Script `src/wallet.ts` generates keypair, secret key, and public address.
- **Task 2 (Balance Retrieval)**: Script `src/balance.ts` queries Horizon RPC and requests Friendbot testnet funding.
- **Task 3 (First Payment Transaction)**: Script `src/transaction.ts` builds, signs, submits XLM payments, and returns transaction hash.
- **Automated CLI Runner**: Execute `npm run whitebelt` to run all 3 tasks sequentially.

```bash
# Run White Belt CLI automated test pipeline
npm run whitebelt
```

### 🟠 Level 2: Orange Belt Challenge (Satisfied)
- Custom Soroban smart contracts (`green_ledger` & `verifier_registry`).
- Deployed on Stellar Testnet with programmatic deployment scripts (`scripts/deploy-all.ts`).
- Full Next.js 15 App Router web application deployed on Vercel.
- Automated GitHub Actions CI/CD pipeline (`.github/workflows/ci.yml`).
- Comprehensive testing suites (Rust `cargo test` + Vitest `npm run test`).

---

## 🧪 Testing Suite & Automated CI/CD Pipeline

### 1. Frontend Unit Tests (Vitest)
```bash
npm run test
```
*Executes unit test suite in `tests/frontend.test.ts` verifying address truncation, numeric formatting, and project pool calculations (**3/3 passed**).*

### 2. Soroban Smart Contract Tests (Rust)
```bash
# Test GreenLedger contract logic
cd contracts/green_ledger && cargo test

# Test VerifierRegistry governance contract
cd contracts/verifier_registry && cargo test
```

### 3. GitHub Actions CI/CD Pipeline
Defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml):
- **Job 1**: Runs `cargo check` and `cargo test` across all Soroban Rust contracts.
- **Job 2**: Runs `npx tsc --noEmit`, Vitest unit tests (`npm run test`), and Next.js production build (`npm run build`).

---

## 🚀 Getting Started & Local Development

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shivam-1410/GreenLedger.git
cd GreenLedger
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Ensure `.env.local` contains:
```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_CONTRACT_ID=CCGREENLEDGER9999999999999999999999999999999999999999
NEXT_PUBLIC_VERIFIER_REGISTRY_ID=CCVERIFIERREGISTRY9999999999999999999999999999999
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build Production Bundle
```bash
npm run build
```

---

## 📁 Repository Structure

```text
├── .github/
│   └── workflows/ci.yml     # GitHub Actions CI/CD pipeline
├── app/                     # Next.js 15 App Router pages
│   ├── page.tsx             # Homepage & Hero section
│   ├── marketplace/         # Carbon Credit Marketplace
│   ├── dashboard/           # Wallet Dashboard & Credit Minting/Retirement
│   ├── governance/          # Verifier Governance Portal & Inter-Contract Query
│   ├── activity/            # Live Contract Event Stream
│   ├── transactions/        # Tracked Session Transaction History
│   ├── error.tsx            # Next.js Error Boundary
│   └── not-found.tsx        # Custom 404 Page
├── components/              # Modular UI Components & Modals
├── contracts/               # Soroban Smart Contracts (Rust)
│   ├── green_ledger/        # Core Marketplace Contract & Tests
│   └── verifier_registry/   # Inter-Contract Verifier Registry & Tests
├── docs/                    # Architecture & Submission Documentation
│   ├── architecture.md      # Inter-Contract Specification
│   ├── wallet-explanation.md # Conceptual Keypair Guide
│   └── submission.md        # Submission Proof & Explorer Links
├── lib/                     # SDK wrappers, Stellar configuration & utilities
├── scripts/                 # Deployment & White Belt CLI scripts
│   ├── deploy-all.ts        # Programmatic Multi-Contract Deployer
│   ├── create-wallet.ts      # Level 1 Task 1
│   ├── check-balance.ts      # Level 1 Task 2
│   └── send-transaction.ts  # Level 1 Task 3
├── src/                     # Level 1 Core CLI Modules
├── store/                   # Zustand State Stores (Wallet & App)
├── tests/                   # Vitest Unit Test Suite
├── types/                   # TypeScript interfaces & types
└── vercel.json              # Vercel Deployment Configuration
```

---

## 🛡️ License

MIT License © 2026 GreenLedger Protocol — Built for Stellar Journey to Mastery
