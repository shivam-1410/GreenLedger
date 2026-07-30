#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Bytes, BytesN, Env, String,
};

// Inter-Contract Client Trait for VerifierRegistryContract
#[soroban_sdk::contractclient(name = "VerifierRegistryClient")]
pub trait VerifierRegistryInterface {
    fn is_approved_verifier(env: Env, verifier: Address) -> bool;
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct CarbonCredit {
    pub id: u64,
    pub issuer: Address,
    pub project_name: String,
    pub credit_type: String,
    pub co2_tons: u64,
    pub vintage_year: u32,
    pub certificate_url: String,
    pub total_supply: i128,
    pub available_supply: i128,
    pub price_per_ton: i128,
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
pub struct PlatformStats {
    pub total_credits_minted: u64,
    pub total_co2_offset_tons: u64,
    pub total_active_listings: u32,
    pub total_volume_xlm: i128,
}

#[contracttype]
pub enum DataKey {
    Admin,
    VerifierRegistryAddress,
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
    /// Initialize contract with admin address & optional verifier registry contract address
    pub fn initialize(env: Env, admin: Address, verifier_registry: Option<Address>) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::CreditSeq, &0u64);

        if let Some(registry_addr) = verifier_registry {
            env.storage()
                .instance()
                .set(&DataKey::VerifierRegistryAddress, &registry_addr);
        }

        let initial_stats = PlatformStats {
            total_credits_minted: 0,
            total_co2_offset_tons: 0,
            total_active_listings: 0,
            total_volume_xlm: 0,
        };
        env.storage().instance().set(&DataKey::PlatformStatsKey, &initial_stats);
    }

    /// Set or update the VerifierRegistry contract address for Inter-Contract calls
    pub fn set_verifier_registry(env: Env, admin: Address, registry_addr: Address) {
        admin.require_auth();

        let current_admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Not initialized");

        if admin != current_admin {
            panic!("Only admin can set verifier registry");
        }

        env.storage()
            .instance()
            .set(&DataKey::VerifierRegistryAddress, &registry_addr);
    }

    /// Mint a new verified carbon credit project with Inter-Contract Verification Check
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

        // Optional Inter-Contract Call: Check if issuer is approved in Verifier Registry Contract
        let is_verified = if let Some(registry_addr) = env
            .storage()
            .instance()
            .get::<_, Address>(&DataKey::VerifierRegistryAddress)
        {
            let client = VerifierRegistryClient::new(&env, &registry_addr);
            client.is_approved_verifier(&issuer)
        } else {
            true // fallback to default true if registry address not configured
        };

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
            is_verified,
        };

        env.storage().persistent().set(&DataKey::Credit(seq), &credit);
        env.storage().persistent().set(&DataKey::Balance(issuer.clone(), seq), &total_supply);

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

        env.events().publish(
            (symbol_short!("mint"), issuer, seq),
            (project_name, co2_tons, total_supply),
        );

        seq
    }

    /// List carbon credits for sale on open marketplace
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

        env.events().publish(
            (symbol_short!("list"), seller, credit_id),
            (amount, price_per_ton),
        );
    }

    /// Cancel marketplace listing
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

        listing.amount -= amount;
        if listing.amount == 0 {
            listing.active = false;
        }
        env.storage().persistent().set(&DataKey::Listing(credit_id), &listing);

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

        env.events().publish(
            (symbol_short!("buy"), buyer, credit_id),
            (seller, amount, total_cost),
        );
    }

    /// Retire carbon credits permanently
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

        env.storage()
            .persistent()
            .set(&DataKey::Balance(owner.clone(), credit_id), &(balance - amount));

        let seq_bytes = Bytes::from_slice(&env, &env.ledger().sequence().to_be_bytes());
        let hash_bytes: BytesN<32> = env.crypto().sha256(&seq_bytes).into();

        let current_retired: u64 = env
            .storage()
            .persistent()
            .get(&DataKey::UserRetired(owner.clone()))
            .unwrap_or(0);
        let newly_retired = amount as u64;
        env.storage()
            .persistent()
            .set(&DataKey::UserRetired(owner.clone()), &(current_retired + newly_retired));

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

        env.events().publish(
            (symbol_short!("retire"), owner, credit_id),
            (amount, reason, hash_bytes.clone()),
        );

        hash_bytes
    }

    pub fn get_credit(env: Env, credit_id: u64) -> Option<CarbonCredit> {
        env.storage().persistent().get(&DataKey::Credit(credit_id))
    }

    pub fn get_balance(env: Env, owner: Address, credit_id: u64) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Balance(owner, credit_id))
            .unwrap_or(0)
    }

    pub fn get_user_retired(env: Env, owner: Address) -> u64 {
        env.storage()
            .persistent()
            .get(&DataKey::UserRetired(owner))
            .unwrap_or(0)
    }

    pub fn get_listing(env: Env, credit_id: u64) -> Option<Listing> {
        env.storage().persistent().get(&DataKey::Listing(credit_id))
    }

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

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::Env;

    #[test]
    fn test_mint_and_buy_workflow() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, GreenLedgerContract);
        let client = GreenLedgerContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let issuer = Address::generate(&env);
        let buyer = Address::generate(&env);

        client.initialize(&admin, &None);

        let credit_id = client.mint_credit(
            &issuer,
            &String::from_str(&env, "Amazon Reforestation"),
            &String::from_str(&env, "Reforestation"),
            &10000u64,
            &2024u32,
            &String::from_str(&env, "https://ipfs.io/cert"),
            &5000i128,
            &15i128,
        );

        assert_eq!(credit_id, 1);
        assert_eq!(client.get_balance(&issuer, &1), 5000i128);

        // List for sale
        client.list_for_sale(&issuer, &1, &1000i128, &15i128);

        // Buy credits
        client.buy_credits(&buyer, &1, &500i128);
        assert_eq!(client.get_balance(&buyer, &1), 500i128);
        assert_eq!(client.get_balance(&issuer, &1), 4500i128);
    }
}
