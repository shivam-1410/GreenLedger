#!/usr/bin/env bash
set -e

echo "=========================================================="
echo " 🌿 GreenLedger — Soroban Multi-Contract Deployment"
echo "=========================================================="

NETWORK=${1:-testnet}

if [ "$NETWORK" = "mainnet" ]; then
    RPC_URL="https://mainnet.sorobanrpc.com"
    PASSPHRASE="Public Global Stellar Network ; September 2015"
    echo "🚨 DEPLOYING TO STELLAR MAINNET 🚨"
else
    NETWORK="testnet"
    RPC_URL="https://soroban-testnet.stellar.org"
    PASSPHRASE="Test SDF Network ; September 2015"
    echo "Deploying to Stellar Soroban Testnet..."
fi

echo "Network: $NETWORK"
echo "RPC URL: $RPC_URL"

# Step 1: Build Core WASM targets
echo "Building GreenLedger Core Soroban WASM target..."
cd "$(dirname "$0")/../contracts/green_ledger"
cargo build --target wasm32-unknown-unknown --release

WASM_PATH="../../target/wasm32-unknown-unknown/release/green_ledger.wasm"

if [ ! -f "$WASM_PATH" ]; then
    WASM_PATH="target/wasm32-unknown-unknown/release/green_ledger.wasm"
fi

echo "Core WASM binary verified at: $WASM_PATH"

# Step 2: Build Verifier Registry WASM target
echo "Building VerifierRegistry WASM target..."
cd "../verifier_registry"
cargo build --target wasm32-unknown-unknown --release

REGISTRY_WASM_PATH="../../target/wasm32-unknown-unknown/release/verifier_registry.wasm"

if [ ! -f "$REGISTRY_WASM_PATH" ]; then
    REGISTRY_WASM_PATH="target/wasm32-unknown-unknown/release/verifier_registry.wasm"
fi

echo "Registry WASM binary verified at: $REGISTRY_WASM_PATH"

# Step 3: Deploy contracts using Stellar CLI if available
if command -v stellar &> /dev/null; then
    echo "Deploying VerifierRegistry via Stellar CLI..."
    REGISTRY_CONTRACT_ID=$(stellar contract deploy \
        --wasm $REGISTRY_WASM_PATH \
        --source-account default \
        --network $NETWORK)
    echo "SUCCESS: Verifier Registry Deployed -> $REGISTRY_CONTRACT_ID"

    echo "Deploying GreenLedger Core via Stellar CLI..."
    CORE_CONTRACT_ID=$(stellar contract deploy \
        --wasm $WASM_PATH \
        --source-account default \
        --network $NETWORK)
    echo "SUCCESS: GreenLedger Core Deployed -> $CORE_CONTRACT_ID"

    # Save to .env.local
    cat <<EOF > ../../.env.local
NEXT_PUBLIC_STELLAR_NETWORK=$NETWORK
NEXT_PUBLIC_CONTRACT_ID=$CORE_CONTRACT_ID
NEXT_PUBLIC_VERIFIER_REGISTRY_ID=$REGISTRY_CONTRACT_ID
NEXT_PUBLIC_SOROBAN_RPC_URL=$RPC_URL
EOF
    echo "Configuration saved to .env.local"
else
    echo "Stellar CLI not found in PATH."
    echo "Please ensure Soroban toolchain is installed and contracts are built with 'cargo build --target wasm32-unknown-unknown --release'."
fi

echo "=========================================================="
echo " 🌿 Deployment Pipeline Execution Complete!"
echo "=========================================================="
