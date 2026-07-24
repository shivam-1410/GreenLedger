# GreenLedger & Stellar White Belt Challenge

GreenLedger is a production-ready carbon-credit trading protocol built on the Stellar blockchain using Soroban smart contracts. This repository also contains the complete, submission-ready implementation for the **Stellar Journey to Mastery — White Belt Challenge**.

---

## 🌟 White Belt Challenge Features

- **Task 1: Wallet Creation (`src/wallet.ts`)**: Cryptographic Ed25519 keypair generation (`Keypair.random()`), public address display, and secure local environment storage (`.env.local`).
- **Task 2: Balance Retrieval (`src/balance.ts`)**: Connects to Stellar Testnet Horizon RPC (`https://horizon-testnet.stellar.org`), fetches native XLM balances, and auto-funds new wallets via Friendbot.
- **Task 3: First On-Chain Transaction (`src/transaction.ts`)**: Constructs, signs, and broadcasts on-chain native XLM payment transactions to Stellar Testnet, providing live Tx hashes and direct StellarExpert explorer links.

---

## ⚡ Quick Start & White Belt Commands

### 1. Run Complete Automated White Belt Test Pipeline
```bash
npm run whitebelt
```

### 2. Run Individual Task Commands
- **Task 1 (Wallet Creation)**:
  ```bash
  npm run whitebelt:wallet
  ```
- **Task 2 (Balance Retrieval)**:
  ```bash
  npm run whitebelt:balance
  ```
- **Task 3 (First Transaction Execution)**:
  ```bash
  npm run whitebelt:tx
  ```

---

## 📁 Repository Structure

```text
/src
  wallet.ts         # Task 1: Wallet creation & Keypair generation
  balance.ts        # Task 2: Stellar Testnet balance retrieval & Friendbot funding
  transaction.ts    # Task 3: First on-chain XLM payment transaction
  index.ts          # Automated end-to-end White Belt test suite
/scripts
  create-wallet.ts   # Task 1 standalone CLI script
  check-balance.ts   # Task 2 standalone CLI script
  send-transaction.ts # Task 3 standalone CLI script
  deploy-contract.sh # Soroban smart contract deployer
  deploy.ts          # Soroban SDK TypeScript deployer
/docs
  wallet-explanation.md  # Keypair concepts & Public vs Secret key guide
  submission.md          # White Belt submission proof & screenshot guide
/contracts
  /green_ledger          # Soroban Rust Smart Contract source code
/app                     # Next.js 15 DApp Pages (Home, Marketplace, Dashboard, Activity, Transactions)
```

---

## 📜 White Belt Documentation & Proofs

- **Wallet Concepts Documentation**: [`docs/wallet-explanation.md`](docs/wallet-explanation.md)
- **Submission Proof & Screenshots Guide**: [`docs/submission.md`](docs/submission.md)

---

## 🌐 Next.js DApp Development

To run the GreenLedger Level 2 DApp web application:

```bash
# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ License

MIT License © 2026 GreenLedger Protocol
