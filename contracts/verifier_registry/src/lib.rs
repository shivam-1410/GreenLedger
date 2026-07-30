#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, String,
};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct VerifierInfo {
    pub verifier_address: Address,
    pub name: String,
    pub accreditation_uri: String,
    pub active: bool,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Verifier(Address),
}

#[contract]
pub struct VerifierRegistryContract;

#[contractimpl]
impl VerifierRegistryContract {
    /// Initialize registry contract with admin address
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Add or approve an environmental verifier (e.g. Verra, Gold Standard)
    pub fn add_verifier(
        env: Env,
        admin: Address,
        verifier: Address,
        name: String,
        accreditation_uri: String,
    ) {
        admin.require_auth();

        let current_admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Not initialized");

        if admin != current_admin {
            panic!("Only admin can add verifiers");
        }

        let info = VerifierInfo {
            verifier_address: verifier.clone(),
            name: name.clone(),
            accreditation_uri: accreditation_uri.clone(),
            active: true,
        };

        env.storage().persistent().set(&DataKey::Verifier(verifier.clone()), &info);

        // Emit approval event
        env.events().publish(
            (symbol_short!("approved"), verifier),
            (name, accreditation_uri),
        );
    }

    /// Revoke verifier accreditation
    pub fn revoke_verifier(env: Env, admin: Address, verifier: Address) {
        admin.require_auth();

        let current_admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Not initialized");

        if admin != current_admin {
            panic!("Only admin can revoke verifiers");
        }

        if let Some(mut info) = env
            .storage()
            .persistent()
            .get::<_, VerifierInfo>(&DataKey::Verifier(verifier.clone()))
        {
            info.active = false;
            env.storage().persistent().set(&DataKey::Verifier(verifier.clone()), &info);

            env.events().publish((symbol_short!("revoked"), verifier), ());
        }
    }

    /// Inter-Contract Query: Check if an address is an approved active verifier
    pub fn is_approved_verifier(env: Env, verifier: Address) -> bool {
        if let Some(info) = env
            .storage()
            .persistent()
            .get::<_, VerifierInfo>(&DataKey::Verifier(verifier))
        {
            info.active
        } else {
            false
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::Env;

    #[test]
    fn test_verifier_lifecycle() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, VerifierRegistryContract);
        let client = VerifierRegistryContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let verifier = Address::generate(&env);

        client.initialize(&admin);

        // Add verifier
        client.add_verifier(
            &admin,
            &verifier,
            &String::from_str(&env, "Verra Registry"),
            &String::from_str(&env, "https://verra.org"),
        );

        assert!(client.is_approved_verifier(&verifier));

        // Revoke verifier
        client.revoke_verifier(&admin, &verifier);
        assert!(!client.is_approved_verifier(&verifier));
    }
}
