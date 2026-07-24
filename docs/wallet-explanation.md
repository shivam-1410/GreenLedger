# Stellar Wallet & Keypair Concepts

## 1. What is a Stellar Wallet?

A Stellar wallet is a software application or hardware interface that manages cryptographic keys used to interact with the Stellar network. Unlike traditional banking systems where a central entity holds account balances, a Stellar wallet does not actually "store" funds inside it. Instead:

- All balances, assets, and state records reside directly on the decentralized **Stellar Distributed Ledger**.
- The wallet stores your **Cryptographic Keypair**, allowing you to prove ownership and sign operations (such as payments, smart contract calls, or trustline creations).

---

## 2. Public Key vs. Secret Key

Stellar uses asymmetric cryptography (specifically **Ed25519** keypairs):

### 🔑 Public Key (Account Address)
- **Format**: Starts with an `G...` (e.g., `GA2C534V4P6JMC5M7PVPZ67B4R3V47...`).
- **Purpose**: Serves as your public account identifier on the Stellar network.
- **Sharing**: Completely safe to share publicly. Anyone can send funds or inspect ledger state associated with your public key.

### 🔒 Secret Key (Private Key)
- **Format**: Starts with an `S...` (e.g., `SBX57K3J...`).
- **Purpose**: Used to digitally sign transactions and authorize state changes on your account.
- **Security Rule**: **NEVER share or commit your secret key.** Anyone with access to your secret key has full control over all funds in the account.

---

## 3. Best Practices for Key Management

1. **Environment Variables**: Store secret keys only in `.env.local` files that are ignored by git (`.gitignore`).
2. **Key Generation**: Use standard Stellar SDK tools (`Keypair.random()`) to generate secure cryptographic keys.
3. **Hardware Wallets / Key Custody**: In production, use hardware wallets (Ledger) or secure key vaults (WebAuthn / Passkeys) rather than hardcoded plaintext secrets.
