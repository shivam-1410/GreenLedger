# GreenLedger Phase 2: Multi-Contract Architecture Specification

## 1. Executive Summary

GreenLedger Phase 2 introduces a modular **Multi-Contract Architecture** on Stellar Soroban that separates Governance & Verification (`verifier_registry`) from Credit Asset Management & Trading (`green_ledger`).

```mermaid
graph TD
    User["User / Trader (Freighter Wallet)"]
    GreenLedger["GreenLedger Contract (green_ledger)"]
    VerifierRegistry["Verifier Registry Contract (verifier_registry)"]
    Horizon["Stellar Testnet / Soroban RPC"]

    User -->|mint_credit / buy_credits / retire_credits| GreenLedger
    GreenLedger -->|Inter-Contract Call: is_approved_verifier()| VerifierRegistry
    VerifierRegistry -->|Returns: true/false| GreenLedger
    GreenLedger -->|Publishes Contract Events| Horizon
```

---

## 2. Smart Contract Modules

### 2.1 `verifier_registry` Contract
- **Repository Path**: `contracts/verifier_registry`
- **Purpose**: On-chain registry of accredited carbon verifiers (Verra, Gold Standard, ACR).
- **Core Methods**:
  - `initialize(admin: Address)`: Set protocol governance authority.
  - `add_verifier(admin, verifier, name, uri)`: Register new active verifier.
  - `revoke_verifier(admin, verifier)`: Revoke verifier status.
  - `is_approved_verifier(verifier: Address) -> bool`: Cross-contract read method.

### 2.2 `green_ledger` Contract
- **Repository Path**: `contracts/green_ledger`
- **Purpose**: Carbon credit token minting, marketplace listings, atomic XLM purchases, and irreversible CO2 retirement.
- **Inter-Contract Invocation**:
  When `mint_credit()` is invoked by a credit issuer, `green_ledger` executes a cross-contract client call:
  ```rust
  let client = verifier_registry::VerifierRegistryClient::new(&env, &registry_addr);
  let is_verified = client.is_approved_verifier(&issuer);
  ```

---

## 3. Automated Testing & CI/CD Pipeline

- **Soroban Rust Unit Tests**: `cargo test` executed in both `contracts/green_ledger` and `contracts/verifier_registry`.
- **Frontend Unit Tests**: Vitest suite in `tests/frontend.test.ts`.
- **GitHub Actions CI/CD**: `.github/workflows/ci.yml` runs Rust checks, type safety, Vitest tests, and Next.js production builds automatically on every push or PR.
