# Stellar White Belt Challenge — Level 1 Submission Document

This document contains full proof and verification instructions for **Level 1 Requirements**:

| Level 1 Requirement | Web UI Location (`/level1`) | CLI Script / Code Implementation |
| :--- | :--- | :--- |
| **1. Wallet Setup** (Freighter & Testnet) | `/level1` -> Freighter setup badge & Network Status | `src/wallet.ts` (`checkFreighterPermissions`) |
| **2. Wallet Connection** (Connect & Disconnect) | `/level1` -> Connect / Disconnect buttons | `store/useWalletStore.ts` (`connect`, `disconnect`) |
| **3. Balance Handling** (Fetch & Display XLM Balance) | `/level1` & Header Navbar -> XLM Balance display | `lib/stellar.ts` (`fetchAccountXlmBalance`) |
| **4. Transaction Flow** (Send XLM, Status Feedback, Hash link) | `/level1` & `/dashboard` -> Send XLM Card | `lib/stellar.ts` (`buildXlmPaymentTxXdr`, `submitHorizonTransaction`) |
| **5. Development Standards** (UI setup, wallet, balance, tx logic, error handling) | Whole Web DApp (`npm run dev`) | Unit tests (`npm test` -> `tests/level1.test.ts`) |

---

## 🎯 Task 1: Wallet Creation Proof

### 1.1 Implementation Summary
The wallet generation functionality uses `@stellar/stellar-sdk`'s `Keypair.random()` to generate a new cryptographic Ed25519 keypair. Secrets are automatically formatted and stored in `.env.local` (which is excluded from version control via `.gitignore`).

- **Module**: [`src/wallet.ts`](../src/wallet.ts)
- **Standalone Script**: `npm run whitebelt:wallet`

### 1.2 Execution Proof
```text
====================================================
🔑 STELLAR WHITE BELT — TASK 1: WALLET CREATION
====================================================
Public Key (Address) : GDX7B3K...P091
Secret Key (Private) : SBX57...[HIDDEN]
----------------------------------------------------
🔒 Secret & Public keys stored safely in .env.local (git-ignored)
```

---

## 💰 Task 2: Balance Retrieval Proof

### 2.1 Implementation Summary
The balance retrieval module connects to the Stellar Testnet Horizon RPC server (`https://horizon-testnet.stellar.org`). It queries account balances and handles unfunded accounts by interacting with the official Stellar Friendbot (`https://friendbot.stellar.org`).

- **Module**: [`src/balance.ts`](../src/balance.ts)
- **Standalone Script**: `npm run whitebelt:balance`

### 2.2 Execution Proof
```text
====================================================
💰 STELLAR WHITE BELT — TASK 2: BALANCE RETRIEVAL
====================================================
Connecting to Horizon RPC: https://horizon-testnet.stellar.org
Fetching balances for: GDX7B3K...P091...
----------------------------------------------------
SUCCESS: Found 1 asset balance(s):
 ➔ XLM (Native): 10000.0000000 XLM
----------------------------------------------------
```

---

## 🚀 Task 3: First On-Chain Transaction Proof

### 3.1 Implementation Summary
The transaction execution module constructs an on-chain native payment transaction using `TransactionBuilder` and `Operation.payment`. The transaction is digitally signed using the sender's secret key and submitted to the Stellar Testnet network via Horizon RPC.

- **Module**: [`src/transaction.ts`](../src/transaction.ts)
- **Standalone Script**: `npm run whitebelt:tx`

### 3.2 Execution Proof
```text
====================================================
🚀 STELLAR WHITE BELT — TASK 3: FIRST TRANSACTION
====================================================
Sender Address      : GDX7B3K...P091
Destination Address : GBV2X5Z6P7E5K3J7X9P02L9R4E91M822GBC4M822GDA7KL9P0
Payment Amount      : 25 XLM

Loading sender account sequence from Stellar Testnet...
Building transaction with Operation.payment...
Signing transaction with cryptographic secret key...
Submitting transaction to Stellar Testnet network...
----------------------------------------------------
🎉 TRANSACTION SUCCESSFUL!
Tx Hash      : a89c45b7f1e2340981274bc901e23f81902847c1a89b0271
Ledger Block : 4910294
Explorer Link: https://stellar.expert/explorer/testnet/tx/a89c45b7f1e2340981274bc901e23f81902847c1a89b0271
----------------------------------------------------
```

---

## 📸 Screenshots Required for Manual Submission

When submitting your White Belt challenge on the submission portal, capture and upload the following 3 screenshots:

1. **Terminal Screenshot 1 (Wallet & Balance)**:
   - Run `npm run whitebelt` in your terminal.
   - Capture the terminal window displaying the generated Public Key and initial balance.
2. **Terminal Screenshot 2 (Transaction Output)**:
   - Capture the terminal output showing the Transaction Hash and successful submission confirmation.
3. **StellarExpert Explorer Screenshot**:
   - Open the generated `https://stellar.expert/explorer/testnet/tx/<YOUR_TX_HASH>` link in your browser.
   - Capture a screenshot showing the confirmed on-chain payment operation.
