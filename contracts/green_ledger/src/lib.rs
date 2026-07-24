#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, BytesN, Env, String, Symbol, Vec,
};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct CarbonCredit {
    pub id: u64,
    pub issuer: Address,
    pub project_name: String,
    pub credit_type: String, // e.g. "Reforestation", "Solar Energy", "Blue Carbon", "Direct Air Capture"
    pub co2_tons: u64,
    pub vintage_year: u32,
    pub certificate_url: String,
    pub total_supply: i128,
    pub available_supply: i128,
    pub price_per_ton: i128, // in stroops (1 XLM = 10,000,000 stroops)
    pub is_verified: bool,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct Listing {
    pub credit_id: u64,
    pub seller: Address,
    pub amount: i128,
    pub price_per_ton: i128,
    pub active: bool,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct RetirementRecord {
    pub credit_id: u64,
    pub owner: Address,
    pub amount: i128,
    pub reason: String,
    pub timestamp: u64,
    pub certificate_hash: BytesN<32>,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct PlatformStats {
    pub total_credits_minted: u64,
    pub total_co2_offset_tons: u64,
    pub total_active_listings: u32,
    pub total_volume_xlm: i128,
}

#[contracttype]
pub enum DataKey {
    Admin,
    CreditSeq,
    Credit(u64),
    Balance(Address, u64),
    Listing(u64),
    UserRetired(Address),
    PlatformStatsKey,
}

#[contract]
pub struct GreenLedgerContract;

#[contractimpl]
impl GreenLedgerContract {
    /// Initialize contract with admin address
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::CreditSeq, &0u64);

        let initial_stats = PlatformStats {
            total_credits_minted: 0,
            total_co2_offset_tons: 0,
            total_active_listings: 0,
            total_volume_xlm: 0,
        };
        env.storage().instance().set(&DataKey::PlatformStatsKey, &initial_stats);
    }

    /// Mint a new verified carbon credit project
    pub fn mint_credit(
        env: Env,
        issuer: Address,
        project_name: String,
        credit_type: String,
        co2_tons: u64,
        vintage_year: u32,
        certificate_url: String,
        total_supply: i128,
        price_per_ton: i128,
    ) -> u64 {
        issuer.require_auth();

        let mut seq: u64 = env.storage().instance().get(&DataKey::CreditSeq).unwrap_or(0);
        seq += 1;
        env.storage().instance().set(&DataKey::CreditSeq, &seq);

        let credit = CarbonCredit {
            id: seq,
            issuer: issuer.clone(),
            project_name: project_name.clone(),
            credit_type: credit_type.clone(),
            co2_tons,
            vintage_year,
            certificate_url,
            total_supply,
            available_supply: total_supply,
            price_per_ton,
            is_verified: true,
        };

        // Save credit details & assign initial supply to issuer balance
        env.storage().persistent().set(&DataKey::Credit(seq), &credit);
        env.storage().persistent().set(&DataKey::Balance(issuer.clone(), seq), &total_supply);

        // Update platform stats
        let mut stats: PlatformStats = env
            .storage()
            .instance()
            .get(&DataKey::PlatformStatsKey)
            .unwrap_or(PlatformStats {
                total_credits_minted: 0,
                total_co2_offset_tons: 0,
                total_active_listings: 0,
                total_volume_xlm: 0,
            });
        stats.total_credits_minted += 1;
        env.storage().instance().set(&DataKey::PlatformStatsKey, &stats);

        // Emit mint event
        env.events().publish(
            (symbol_short!("mint"), issuer, seq),
            (project_name, co2_tons, total_supply),
        );

        seq
    }

    /// List carbon credits for sale on the open marketplace
    pub fn list_for_sale(
        env: Env,
        seller: Address,
        credit_id: u64,
        amount: i128,
        price_per_ton: i128,
    ) {
        seller.require_auth();

        let balance: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::Balance(seller.clone(), credit_id))
            .unwrap_or(0);

        if balance < amount || amount <= 0 {
            panic!("Insufficient credit balance to list");
        }

        let listing = Listing {
            credit_id,
            seller: seller.clone(),
            amount,
            price_per_ton,
            active: true,
        };

        env.storage().persistent().set(&DataKey::Listing(credit_id), &listing);

        // Update active listing count in platform stats
        let mut stats: PlatformStats = env
            .storage()
            .instance()
            .get(&DataKey::PlatformStatsKey)
            .unwrap_or(PlatformStats {
                total_credits_minted: 0,
                total_co2_offset_tons: 0,
                total_active_listings: 0,
                total_volume_xlm: 0,
            });
        stats.total_active_listings += 1;
        env.storage().instance().set(&DataKey::PlatformStatsKey, &stats);

        // Emit list event
        env.events().publish(
            (symbol_short!("list"), seller, credit_id),
            (amount, price_per_ton),
        );
    }

    /// Cancel an active marketplace listing
    pub fn cancel_listing(env: Env, seller: Address, credit_id: u64) {
        seller.require_auth();

        let mut listing: Listing = env
            .storage()
            .persistent()
            .get(&DataKey::Listing(credit_id))
            .unwrap();

        if listing.seller != seller {
            panic!("Not seller of listing");
        }

        listing.active = false;
        env.storage().persistent().set(&DataKey::Listing(credit_id), &listing);

        // Emit cancel event
        env.events().publish((symbol_short!("cancel"), seller, credit_id), ());
    }

    /// Buy listed carbon credits
    pub fn buy_credits(env: Env, buyer: Address, credit_id: u64, amount: i128) {
        buyer.require_auth();

        let mut listing: Listing = env
            .storage()
            .persistent()
            .get(&DataKey::Listing(credit_id))
            .unwrap();

        if !listing.active || listing.amount < amount || amount <= 0 {
            panic!("Listing is not active or amount unavailable");
        }

        let seller = listing.seller.clone();
        let price = listing.price_per_ton;
        let total_cost = amount * price;

        // Deduct seller balance & add to buyer balance
        let seller_balance: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::Balance(seller.clone(), credit_id))
            .unwrap_or(0);
        let buyer_balance: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::Balance(buyer.clone(), credit_id))
            .unwrap_or(0);

        if seller_balance < amount {
            panic!("Seller balance dropped below listing amount");
        }

        env.storage()
            .persistent()
            .set(&DataKey::Balance(seller.clone(), credit_id), &(seller_balance - amount));
        env.storage()
            .persistent()
            .set(&DataKey::Balance(buyer.clone(), credit_id), &(buyer_balance + amount));

        // Update listing
        listing.amount -= amount;
        if listing.amount == 0 {
            listing.active = false;
        }
        env.storage().persistent().set(&DataKey::Listing(credit_id), &listing);

        // Update total stats volume
        let mut stats: PlatformStats = env
            .storage()
            .instance()
            .get(&DataKey::PlatformStatsKey)
            .unwrap_or(PlatformStats {
                total_credits_minted: 0,
                total_co2_offset_tons: 0,
                total_active_listings: 0,
                total_volume_xlm: 0,
            });
        stats.total_volume_xlm += total_cost;
        env.storage().instance().set(&DataKey::PlatformStatsKey, &stats);

        // Emit buy event
        env.events().publish(
            (symbol_short!("buy"), buyer, credit_id),
            (seller, amount, total_cost),
        );
    }

    /// Retire carbon credits permanently to offset carbon footprint and produce certificate
    pub fn retire_credits(
        env: Env,
        owner: Address,
        credit_id: u64,
        amount: i128,
        reason: String,
    ) -> BytesN<32> {
        owner.require_auth();

        let balance: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::Balance(owner.clone(), credit_id))
            .unwrap_or(0);

        if balance < amount || amount <= 0 {
            panic!("Insufficient credit balance to retire");
        }

        // Deduct balance
        env.storage()
            .persistent()
            .set(&DataKey::Balance(owner.clone(), credit_id), &(balance - amount));

        // Generate deterministic certificate hash
        let timestamp = env.ledger().timestamp();
        let cert_hash = env.crypto().sha256(&env.ledger().sequence().to_be_bytes().into());
        let hash_bytes: BytesN<32> = cert_hash.into();

        // Update user retired total tons
        let current_retired: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::UserRetired(owner.clone()))
            .unwrap_or(0);
        let newly_retired = amount as u64;
        env.storage()
            .persistent()
            .set(&DataKey::UserRetired(owner.clone()), &(current_retired + newly_retired));

        // Update platform stats
        let mut stats: PlatformStats = env
            .storage()
            .instance()
            .get(&DataKey::PlatformStatsKey)
            .unwrap_or(PlatformStats {
                total_credits_minted: 0,
                total_co2_offset_tons: 0,
                total_active_listings: 0,
                total_volume_xlm: 0,
            });
        stats.total_co2_offset_tons += newly_retired;
        env.storage().instance().set(&DataKey::PlatformStatsKey, &stats);

        // Emit retirement event
        env.events().publish(
            (symbol_short!("retire"), owner, credit_id),
            (amount, reason, hash_bytes.clone()),
        );

        hash_bytes
    }

    /// Get credit details
    pub fn get_credit(env: Env, credit_id: u64) -> Option<CarbonCredit> {
        env.storage().persistent().get(&DataKey::Credit(credit_id))
    }

    /// Get user balance for specific credit ID
    pub fn get_balance(env: Env, owner: Address, credit_id: u64) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Balance(owner, credit_id))
            .unwrap_or(0)
    }

    /// Get user total retired carbon tons
    pub fn get_user_retired(env: Env, owner: Address) -> u64 {
        env.storage()
            .persistent()
            .get(&DataKey::UserRetired(owner))
            .unwrap_or(0)
    }

    /// Get active marketplace listing for credit ID
    pub fn get_listing(env: Env, credit_id: u64) -> Option<Listing> {
        env.storage().persistent().get(&DataKey::Listing(credit_id))
    }

    /// Get overall platform stats
    pub fn get_stats(env: Env) -> PlatformStats {
        env.storage()
            .instance()
            .get(&DataKey::PlatformStatsKey)
            .unwrap_or(PlatformStats {
                total_credits_minted: 0,
                total_co2_offset_tons: 0,
                total_active_listings: 0,
                total_volume_xlm: 0,
            })
    }
}
