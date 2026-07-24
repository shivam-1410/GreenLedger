#!/usr/bin/env bash
set -e

echo "=========================================="
echo " GreenLedger - Soroban Contract Deployment"
echo "=========================================="

NETWORK=${1:-testnet}
RPC_URL=${2:-"https://soroban-testnet.stellar.org"}
PASSPHRASE=${3:-"Test SDF Network ; September 2015"}

echo "Network: $NETWORK"
echo "RPC URL: $RPC_URL"

# Step 1: Build Wasm target
echo "Building Soroban WASM target..."
cd contracts/green_ledger
cargo build --target wasm32-unknown-unknown --release

WASM_PATH="../../target/wasm32-unknown-unknown/release/green_ledger.wasm"

if [ ! -f "$WASM_PATH" ]; then
    WASM_PATH="target/wasm32-unknown-unknown/release/green_ledger.wasm"
fi

echo "WASM binary generated at: $WASM_PATH"

# Step 2: Deploy contract using Stellar CLI if available
if command -v stellar &> /dev/null; then
    echo "Deploying contract via Stellar CLI..."
    CONTRACT_ID=$(stellar contract deploy \
        --wasm $WASM_PATH \
        --source-account default \
        --network $NETWORK)
    
    echo "SUCCESS: Contract Deployed!"
    echo "Contract ID: $CONTRACT_ID"
    
    # Save contract ID to environment
    echo "NEXT_PUBLIC_CONTRACT_ID=$CONTRACT_ID" > ../../.env.local
    echo "Saved to .env.local"
else
    echo "Stellar CLI not found in PATH."
    echo "Please ensure Soroban contract is compiled and deploy via 'npm run deploy:contract' or Stellar CLI."
fi
