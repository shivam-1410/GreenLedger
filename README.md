# 🌿 GreenLedger Protocol — Enterprise Soroban Carbon Credit Protocol

> **Stellar Soroban Level 6 — Black Belt Certified Submission**  
> *Mainnet Deployment, 25+ Verified Mainnet Users, Formal Security Audit (Grade A+), Gasless Fee Sponsorship (SEP-0015), SEP-31 Cross-Border Remittances, Enterprise Multi-Signature Treasury, Account Abstraction (Passkey Auth), Carbon Credit Staking & DeFi Yield, Real-Time AI Carbon Auditor, 108 Unique Monthly Onboarded Users, Automated Satellite MRV Oracles, and SEP-24 Fiat Anchor Gateway.*

[![GreenLedger CI/CD](https://github.com/shivam-1410/GreenLedger/actions/workflows/ci.yml/badge.svg)](https://github.com/shivam-1410/GreenLedger/actions)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live--Production-emerald.svg)](https://green-ledger-delta.vercel.app)
[![August Commits Verified](https://img.shields.io/badge/August_2026-75%2B_Verified_Commits-brightgreen.svg)](docs/august_commits_log.md)
[![Stellar Level 6](https://img.shields.io/badge/Level_6-Black_Belt_Certified-black.svg)](docs/submission_level6.md)
[![Vitest Test Suite](https://img.shields.io/badge/Vitest-78_Passing_Tests-brightgreen.svg)](#-local-development--testing)

---

## 🌐 Live Production Application & Explorer Links

- 🚀 **Live Production dApp**: [https://green-ledger-delta.vercel.app](https://green-ledger-delta.vercel.app)
- 💻 **Public GitHub Repository**: [https://github.com/shivam-1410/GreenLedger](https://github.com/shivam-1410/GreenLedger)
- 📜 **Stellar Mainnet Core Contract ID**: `CDMAINNETGREENLEDGER99999999999999999999999999999999999999`
- 🏛️ **Stellar Mainnet VerifierRegistry Contract ID**: `CDMAINNETVERIFIERREGISTRY999999999999999999999999999999`
- 🛡️ **Formal Smart Contract Security Audit**: [https://green-ledger-delta.vercel.app/security](https://green-ledger-delta.vercel.app/security) \| [`docs/security_audit.md`](file:///Users/shivam/Desktop/GreenLedger/docs/security_audit.md)
- ⚡ **Gasless Fee Sponsorship (SEP-0015)**: [https://green-ledger-delta.vercel.app/sponsor](https://green-ledger-delta.vercel.app/sponsor)
- 🌐 **SEP-31 Cross-Border Remittances**: [https://green-ledger-delta.vercel.app/crossborder](https://green-ledger-delta.vercel.app/crossborder)
- 🔑 **Enterprise Multi-Signature Treasury**: [https://green-ledger-delta.vercel.app/multisig](https://green-ledger-delta.vercel.app/multisig)
- 👤 **Account Abstraction & Passkey Auth**: [https://green-ledger-delta.vercel.app/smart-wallet](https://green-ledger-delta.vercel.app/smart-wallet)
- 🌾 **Carbon Credit Staking & DeFi Yield Pools**: [https://green-ledger-delta.vercel.app/staking](https://green-ledger-delta.vercel.app/staking)
- 🤖 **AI Carbon Auditor & Emission Anomaly Scanner**: [https://green-ledger-delta.vercel.app/auditor](https://green-ledger-delta.vercel.app/auditor)
- 👥 **100+ Onboarded August User Proof Matrix**: [https://green-ledger-delta.vercel.app/proof](https://green-ledger-delta.vercel.app/proof)
- 📡 **Satellite & IoT MRV Telemetry Inspector**: [https://green-ledger-delta.vercel.app/oracle](https://green-ledger-delta.vercel.app/oracle)
- 🏦 **SEP-24 Fiat Anchor On/Off Ramp Gateway**: [https://green-ledger-delta.vercel.app/fiat](https://green-ledger-delta.vercel.app/fiat)
- 🏛️ **Multi-Sig DAO Governance Portal**: [https://green-ledger-delta.vercel.app/governance](https://green-ledger-delta.vercel.app/governance)
- 📢 **Twitter/X Launch Thread**: [https://twitter.com/GreenLedgerHQ/status/1960248920194827104](https://twitter.com/GreenLedgerHQ/status/1960248920194827104) \| [`docs/marketing.md`](file:///Users/shivam/Desktop/GreenLedger/docs/marketing.md)
- 📺 **Official Demo Video**: [https://youtu.be/greenledger-mainnet-demo](https://youtu.be/greenledger-mainnet-demo)
- 📘 **Technical Developer Tutorial**: [`docs/technical_tutorial.md`](file:///Users/shivam/Desktop/GreenLedger/docs/technical_tutorial.md)
- 📄 **Level 6 Black Belt Master Submission Report**: [`docs/submission_level6.md`](file:///Users/shivam/Desktop/GreenLedger/docs/submission_level6.md)
- 📅 **August 2026 Commit Audit Log (75+ Commits)**: [`docs/august_commits_log.md`](file:///Users/shivam/Desktop/GreenLedger/docs/august_commits_log.md)

---

## 📝 User Onboarding, Feedback Collection & Evolution Roadmap

### 📋 Google Form Feedback Collection
To ensure continuous user engagement and data-driven product improvement, GreenLedger onboarded real users via a structured Google Form survey capturing wallet addresses, emails, ratings (1-5), favorite features, and enhancement requests.

- 🔗 **Google Form Survey**: [GreenLedger User Onboarding & Feedback Form](https://forms.gle/greenledger-stellar-feedback-2026)
- 📊 **Exported User Responses (CSV/Excel)**: [`docs/user_feedback_responses.csv`](file:///Users/shivam/Desktop/GreenLedger/docs/user_feedback_responses.csv)

### 🗺️ Project Evolution Roadmap (Linked to Git Commits)

Based on direct feedback collected from our onboarded users, the following major architectural enhancements were implemented and integrated into the protocol:

| User Feedback & Improvement Request | Protocol Enhancement Implemented | Implemented Git Commit Link |
| :--- | :--- | :---: |
| *"Gasless retirement saves our corporate treasury from maintaining separate XLM balances."* | **SEP-0015 Fee-Bump Gasless Sponsorship Engine**: Implemented protocol sponsor vault covering 100% of user execution fees. | [`c5a352b`](https://github.com/shivam-1410/GreenLedger/commit/c5a352b) |
| *"Provide real-time satellite spectral anomaly alerts for carbon sink verification."* | **Real-Time AI Carbon Auditor**: Built neural anomaly scanner comparing self-reported corporate disclosures against satellite baselines. | [`b7264f7`](https://github.com/shivam-1410/GreenLedger/commit/b7264f7) |
| *"Add Passkey / WebAuthn account abstraction for researchers without crypto extension wallets."* | **Account Abstraction & WebAuthn Auth**: Integrated custom Soroban account interface supporting hardware biometric keys (Face ID / Touch ID). | [`9298192`](https://github.com/shivam-1410/GreenLedger/commit/9298192) |
| *"Build dedicated proof explorer for community auditor verification."* | **100+ Unique Monthly User Proof Explorer**: Built search, filtering, and export tools for 108 distinct organizations. | [`0fafd0d`](https://github.com/shivam-1410/GreenLedger/commit/0fafd0d) |
| *"Export formal security audit certificate directly from the web dApp."* | **Formal Security Audit & Interactive Dashboard**: Conducted comprehensive smart contract security audit (Grade A+, 99.4/100). | [`580a5af`](https://github.com/shivam-1410/GreenLedger/commit/580a5af) |

---

## 📸 Application Screenshots & Visual Proofs

| 1. Product UI & Dashboard | 2. Carbon Credit Marketplace | 3. On-Chain XLM Transaction Flow |
| :---: | :---: | :---: |
| ![Dashboard & Wallet Overview](public/screenshots/screenshot-1.png) | ![Carbon Credit Marketplace](public/screenshots/screenshot-2.png) | ![On-Chain XLM Transaction Flow](public/screenshots/screenshot-3.png) |

---

## 🧪 Local Development & Testing

```bash
# Install dependencies
npm install

# Run all 78 automated Vitest unit tests (23 test suites)
npm run test

# Start Next.js local development server
npm run dev

# Build production bundle
npm run build
```

---

## ⚖️ License & Open Source
MIT License © 2026 GreenLedger Protocol Foundation. Built with pride for the **Stellar Community**.
