/// TRICODE PRO LTD - OBEY Finance Parallel Node System
/// Sui Network Smart Contract v2.0.0
/// Global Standard for Decentralized Financial Infrastructure
///
/// Modules:
/// - parallel_node: Core node registry and management
/// - escrow: Institutional escrow settlements
/// - payment_router: CBN-compliant cross-border payments
/// - apple_pay: Apple Pay settlement receipts
/// - opay_gateway: Opay payment integration
/// - rewards: Node validator reward distribution
/// - governance: Decentralized protocol governance
/// - oracle: Price feed and external data
/// - bridge: Cross-chain interoperability

module obey_finance::parallel_node {

    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table};

    // ============================================================
    // CORE TYPES
    // ============================================================

    struct NodeRegistry has key {
        id: UID,
        total_nodes: u64,
        active_nodes: u64,
        total_staked: u64,
        network_version: u64,
        governance_threshold: u64,
        min_stake: u64,
        max_nodes: u64,
        epoch_duration_ms: u64,
        current_epoch: u64,
    }

    struct ParallelNode has key {
        id: UID,
        node_id: vector<u8>,
        operator: address,
        stake_amount: u64,
        reputation_score: u64,
        transactions_processed: u64,
        uptime_percentage: u64,
        region: vector<u8>,
        status: u8,
        registered_at: u64,
        last_heartbeat: u64,
        total_rewards_earned: u64,
        slashing_count: u8,
        ip_hash: vector<u8>,
    }

    struct EscrowVault has key {
        id: UID,
        sender: address,
        recipient: address,
        amount: u64,
        currency: vector<u8>,
        release_condition: vector<u8>,
        expires_at: u64,
        status: u8,
        arbiter: address,
        created_at: u64,
        released_at: u64,
    }

    struct PaymentRoute has key {
        id: UID,
        route_id: vector<u8>,
        source_country: vector<u8>,
        destination_country: vector<u8>,
        source_currency: vector<u8>,
        destination_currency: vector<u8>,
        exchange_rate: u64,
        fee_percentage: u64,
        cbn_approved: bool,
        daily_limit: u64,
        daily_used: u64,
        active: bool,
        approved_at: u64,
    }

    struct RewardPool has key {
        id: UID,
        total_rewards: u64,
        distributed_rewards: u64,
        epoch: u64,
        reward_per_node: u64,
        total_eligible_nodes: u64,
    }

    struct GovernanceProposal has key {
        id: UID,
        proposer: address,
        proposal_type: u8,
        description: vector<u8>,
        votes_for: u64,
        votes_against: u64,
        status: u8,
        created_at: u64,
        execution_time: u64,
        executed_at: u64,
    }

    struct ApplePayReceipt has key, store {
        id: UID,
        transaction_id: vector<u8>,
        amount: u64,
        currency: vector<u8>,
        device_id: vector<u8>,
        merchant_id: vector<u8>,
        verified: bool,
        timestamp: u64,
        receipt_data_hash: vector<u8>,
    }

    struct OpaySettlement has key, store {
        id: UID,
        settlement_id: vector<u8>,
        opay_reference: vector<u8>,
        amount: u64,
        currency: vector<u8>,
        beneficiary: address,
        status: u8,
        timestamp: u64,
        fee_charged: u64,
    }

    struct OraclePrice has key, store {
        id: UID,
        asset: vector<u8>,
        price_usd: u64,
        price_ngn: u64,
        timestamp: u64,
        source: vector<u8>,
        confidence: u8,
    }

    struct BridgeTransfer has key, store {
        id: UID,
        transfer_id: vector<u8>,
        source_chain: vector<u8>,
        destination_chain: vector<u8>,
        amount: u64,
        asset: vector<u8>,
        sender: address,
        recipient: vector<u8>,
        status: u8,
        timestamp: u64,
        tx_hash: vector<u8>,
    }

    // ============================================================
    // EVENTS
    // ============================================================

    struct NodeRegisteredEvent has copy, drop {
        node_id: vector<u8>,
        operator: address,
        region: vector<u8>,
        stake: u64,
        timestamp: u64,
    }

    struct TransactionProcessedEvent has copy, drop {
        node_id: vector<u8>,
        transaction_hash: vector<u8>,
        amount: u64,
        timestamp: u64,
    }

    struct EscrowReleasedEvent has copy, drop {
        escrow_id: vector<u8>,
        recipient: address,
        amount: u64,
        timestamp: u64,
    }

    struct RewardDistributedEvent has copy, drop {
        node_id: vector<u8>,
        reward_amount: u64,
        epoch: u64,
    }

    struct PaymentRouteApprovedEvent has copy, drop {
        route_id: vector<u8>,
        source: vector<u8>,
        destination: vector<u8>,
        cbn_approved: bool,
    }

    struct OraclePriceUpdatedEvent has copy, drop {
        asset: vector<u8>,
        price_usd: u64,
        price_ngn: u64,
        timestamp: u64,
    }

    struct BridgeTransferCompletedEvent has copy, drop {
        transfer_id: vector<u8>,
        source_chain: vector<u8>,
        destination_chain: vector<u8>,
        amount: u64,
        timestamp: u64,
    }

    struct NodeSlashedEvent has copy, drop {
        node_id: vector<u8>,
        reason: vector<u8>,
        amount_slashed: u64,
        timestamp: u64,
    }

    // ============================================================
    // ERRORS
    // ============================================================

    const EInsufficientStake: u64 = 1001;
    const ENodeNotFound: u64 = 1002;
    const EUnauthorized: u64 = 1003;
    const EEscrowExpired: u64 = 1004;
    const EInvalidRoute: u64 = 1005;
    const ENotCBNApproved: u64 = 1006;
    const EDuplicateNode: u64 = 1007;
    const EInsufficientFunds: u64 = 1008;
    const EMaxNodesReached: u64 = 1009;
    const EOracleStale: u64 = 1010;
    const EBridgeFailed: u64 = 1011;
    const EProposalExpired: u64 = 1012;

    // ============================================================
    // CONSTANTS
    // ============================================================

    const MIN_STAKE: u64 = 10_000_000_000;
    const MAX_NODES: u64 = 1000;
    const EPOCH_DURATION_MS: u64 = 86_400_000;
    const GOVERNANCE_THRESHOLD: u64 = 67;
    const SLASHING_PERCENTAGE: u64 = 10;
    const ORACLE_STALENESS_MS: u64 = 300_000;

    // ============================================================
    // INITIALIZATION
    // ============================================================

    public entry fun initialize_network(ctx: &mut TxContext) {
        let registry = NodeRegistry {
            id: object::new(ctx),
            total_nodes: 0,
            active_nodes: 0,
            total_staked: 0,
            network_version: 2,
            governance_threshold: GOVERNANCE_THRESHOLD,
            min_stake: MIN_STAKE,
            max_nodes: MAX_NODES,
            epoch_duration_ms: EPOCH_DURATION_MS,
            current_epoch: 0,
        };
        transfer::share_object(registry);

        let reward_pool = RewardPool {
            id: object::new(ctx),
            total_rewards: 0,
            distributed_rewards: 0,
            epoch: 0,
            reward_per_node: 0,
            total_eligible_nodes: 0,
        };
        transfer::share_object(reward_pool);
    }

    // ============================================================
    // NODE MANAGEMENT
    // ============================================================

    public entry fun register_node(
        registry: &mut NodeRegistry,
        node_id: vector<u8>,
        region: vector<u8>,
        ip_hash: vector<u8>,
        stake: Coin<sui::SUI>,
        ctx: &mut TxContext,
    ) {
        assert!(registry.total_nodes < registry.max_nodes, EMaxNodesReached);
        let stake_amount = coin::value(&stake);
        assert!(stake_amount >= registry.min_stake, EInsufficientStake);

        let node = ParallelNode {
            id: object::new(ctx),
            node_id,
            operator: tx_context::sender(ctx),
            stake_amount,
            reputation_score: 100,
            transactions_processed: 0,
            uptime_percentage: 100,
            region,
            status: 0,
            registered_at: tx_context::timestamp_ms(ctx),
            last_heartbeat: tx_context::timestamp_ms(ctx),
            total_rewards_earned: 0,
            slashing_count: 0,
            ip_hash,
        };

        registry.total_nodes = registry.total_nodes + 1;
        registry.active_nodes = registry.active_nodes + 1;
        registry.total_staked = registry.total_staked + stake_amount;

        event::emit(NodeRegisteredEvent {
            node_id: node.node_id,
            operator: node.operator,
            region: node.region,
            stake: stake_amount,
            timestamp: tx_context::timestamp_ms(ctx),
        });

        transfer::share_object(node);
    }

    public entry fun node_heartbeat(
        node: &mut ParallelNode,
        registry: &mut NodeRegistry,
        _clock: &Clock,
        ctx: &mut TxContext,
    ) {
        assert!(node.status == 0, ENodeNotFound);
        assert!(node.operator == tx_context::sender(ctx), EUnauthorized);

        node.last_heartbeat = tx_context::timestamp_ms(ctx);
        node.uptime_percentage = 100;
    }

    public entry fun record_transaction(
        node: &mut ParallelNode,
        transaction_hash: vector<u8>,
        amount: u64,
        ctx: &mut TxContext,
    ) {
        assert!(node.status == 0, ENodeNotFound);
        assert!(node.operator == tx_context::sender(ctx), EUnauthorized);

        node.transactions_processed = node.transactions_processed + 1;
        node.reputation_score = node.reputation_score + 1;

        event::emit(TransactionProcessedEvent {
            node_id: node.node_id,
            transaction_hash,
            amount,
            timestamp: tx_context::timestamp_ms(ctx),
        });
    }

    public entry fun slash_node(
        node: &mut ParallelNode,
        registry: &mut NodeRegistry,
        reason: vector<u8>,
        ctx: &mut TxContext,
    ) {
        assert!(node.status == 0, ENodeNotFound);

        let slash_amount = (node.stake_amount * SLASHING_PERCENTAGE) / 100;
        node.stake_amount = node.stake_amount - slash_amount;
        node.slashing_count = node.slashing_count + 1;
        node.reputation_score = node.reputation_score / 2;

        if (node.slashing_count >= 3) {
            node.status = 2;
            registry.active_nodes = registry.active_nodes - 1;
        }

        registry.total_staked = registry.total_staked - slash_amount;

        event::emit(NodeSlashedEvent {
            node_id: node.node_id,
            reason,
            amount_slashed: slash_amount,
            timestamp: tx_context::timestamp_ms(ctx),
        });
    }

    // ============================================================
    // ESCROW SYSTEM
    // ============================================================

    public entry fun create_escrow(
        recipient: address,
        amount: Coin<sui::SUI>,
        currency: vector<u8>,
        release_condition: vector<u8>,
        expires_at: u64,
        arbiter: address,
        ctx: &mut TxContext,
    ) {
        let escrow = EscrowVault {
            id: object::new(ctx),
            sender: tx_context::sender(ctx),
            recipient,
            amount: coin::value(&amount),
            currency,
            release_condition,
            expires_at,
            status: 0,
            arbiter,
            created_at: tx_context::timestamp_ms(ctx),
            released_at: 0,
        };

        transfer::share_object(escrow);
    }

    public entry fun release_escrow(
        escrow: &mut EscrowVault,
        ctx: &mut TxContext,
    ) {
        assert!(escrow.status == 0, EEscrowExpired);
        assert!(
            tx_context::sender(ctx) == escrow.sender ||
            tx_context::sender(ctx) == escrow.arbiter,
            EUnauthorized
        );
        assert!(tx_context::timestamp_ms(ctx) <= escrow.expires_at, EEscrowExpired);

        escrow.status = 1;
        escrow.released_at = tx_context::timestamp_ms(ctx);

        event::emit(EscrowReleasedEvent {
            escrow_id: object::id_to_bytes(&escrow.id),
            recipient: escrow.recipient,
            amount: escrow.amount,
            timestamp: tx_context::timestamp_ms(ctx),
        });
    }

    public entry fun refund_escrow(
        escrow: &mut EscrowVault,
        ctx: &mut TxContext,
    ) {
        assert!(escrow.status == 0, EEscrowExpired);
        assert!(tx_context::timestamp_ms(ctx) > escrow.expires_at, EEscrowExpired);
        assert!(tx_context::sender(ctx) == escrow.sender, EUnauthorized);

        escrow.status = 2;
    }

    // ============================================================
    // PAYMENT ROUTES (CBN COMPLIANT)
    // ============================================================

    public entry fun create_payment_route(
        route_id: vector<u8>,
        source_country: vector<u8>,
        destination_country: vector<u8>,
        source_currency: vector<u8>,
        destination_currency: vector<u8>,
        exchange_rate: u64,
        fee_percentage: u64,
        daily_limit: u64,
        ctx: &mut TxContext,
    ) {
        let route = PaymentRoute {
            id: object::new(ctx),
            route_id,
            source_country,
            destination_country,
            source_currency,
            destination_currency,
            exchange_rate,
            fee_percentage,
            cbn_approved: false,
            daily_limit,
            daily_used: 0,
            active: false,
            approved_at: 0,
        };

        transfer::share_object(route);
    }

    public entry fun approve_route_cbn(
        route: &mut PaymentRoute,
        ctx: &mut TxContext,
    ) {
        route.cbn_approved = true;
        route.active = true;
        route.approved_at = tx_context::timestamp_ms(ctx);

        event::emit(PaymentRouteApprovedEvent {
            route_id: route.route_id,
            source: route.source_country,
            destination: route.destination_country,
            cbn_approved: true,
        });
    }

    public entry fun process_route_transaction(
        route: &mut PaymentRoute,
        amount: u64,
        ctx: &mut TxContext,
    ) {
        assert!(route.cbn_approved && route.active, ENotCBNApproved);
        assert!(route.daily_used + amount <= route.daily_limit, EInvalidRoute);

        route.daily_used = route.daily_used + amount;
    }

    // ============================================================
    // APPLE PAY INTEGRATION
    // ============================================================

    public entry fun process_apple_pay(
        transaction_id: vector<u8>,
        amount: u64,
        currency: vector<u8>,
        device_id: vector<u8>,
        merchant_id: vector<u8>,
        receipt_data_hash: vector<u8>,
        ctx: &mut TxContext,
    ) {
        let receipt = ApplePayReceipt {
            id: object::new(ctx),
            transaction_id,
            amount,
            currency,
            device_id,
            merchant_id,
            verified: true,
            timestamp: tx_context::timestamp_ms(ctx),
            receipt_data_hash,
        };

        transfer::share_object(receipt);
    }

    // ============================================================
    // OPAY INTEGRATION
    // ============================================================

    public entry fun process_opay_settlement(
        settlement_id: vector<u8>,
        opay_reference: vector<u8>,
        amount: u64,
        currency: vector<u8>,
        beneficiary: address,
        fee_charged: u64,
        ctx: &mut TxContext,
    ) {
        let settlement = OpaySettlement {
            id: object::new(ctx),
            settlement_id,
            opay_reference,
            amount,
            currency,
            beneficiary,
            status: 1,
            timestamp: tx_context::timestamp_ms(ctx),
            fee_charged,
        };

        transfer::share_object(settlement);
    }

    // ============================================================
    // ORACLE SYSTEM
    // ============================================================

    public entry fun update_oracle_price(
        asset: vector<u8>,
        price_usd: u64,
        price_ngn: u64,
        source: vector<u8>,
        confidence: u8,
        ctx: &mut TxContext,
    ) {
        let oracle = OraclePrice {
            id: object::new(ctx),
            asset,
            price_usd,
            price_ngn,
            timestamp: tx_context::timestamp_ms(ctx),
            source,
            confidence,
        };

        event::emit(OraclePriceUpdatedEvent {
            asset: oracle.asset,
            price_usd,
            price_ngn,
            timestamp: oracle.timestamp,
        });

        transfer::share_object(oracle);
    }

    // ============================================================
    // CROSS-CHAIN BRIDGE
    // ============================================================

    public entry fun initiate_bridge_transfer(
        transfer_id: vector<u8>,
        destination_chain: vector<u8>,
        amount: u64,
        asset: vector<u8>,
        recipient: vector<u8>,
        ctx: &mut TxContext,
    ) {
        let bridge = BridgeTransfer {
            id: object::new(ctx),
            transfer_id,
            source_chain: b"sui",
            destination_chain,
            amount,
            asset,
            sender: tx_context::sender(ctx),
            recipient,
            status: 0,
            timestamp: tx_context::timestamp_ms(ctx),
            tx_hash: b"",
        };

        transfer::share_object(bridge);
    }

    public entry fun complete_bridge_transfer(
        bridge: &mut BridgeTransfer,
        tx_hash: vector<u8>,
        ctx: &mut TxContext,
    ) {
        bridge.status = 1;
        bridge.tx_hash = tx_hash;

        event::emit(BridgeTransferCompletedEvent {
            transfer_id: bridge.transfer_id,
            source_chain: bridge.source_chain,
            destination_chain: bridge.destination_chain,
            amount: bridge.amount,
            timestamp: tx_context::timestamp_ms(ctx),
        });
    }

    // ============================================================
    // REWARD DISTRIBUTION
    // ============================================================

    public entry fun distribute_epoch_rewards(
        pool: &mut RewardPool,
        node: &mut ParallelNode,
        reward_amount: u64,
        ctx: &mut TxContext,
    ) {
        assert!(node.status == 0, ENodeNotFound);

        pool.distributed_rewards = pool.distributed_rewards + reward_amount;
        node.reputation_score = node.reputation_score + (reward_amount / 1_000_000);
        node.total_rewards_earned = node.total_rewards_earned + reward_amount;

        event::emit(RewardDistributedEvent {
            node_id: node.node_id,
            reward_amount,
            epoch: pool.epoch,
        });
    }

    public entry fun advance_epoch(
        pool: &mut RewardPool,
        registry: &mut NodeRegistry,
        ctx: &mut TxContext,
    ) {
        pool.epoch = pool.epoch + 1;
        registry.current_epoch = registry.current_epoch + 1;
        pool.total_eligible_nodes = registry.active_nodes;

        if (pool.total_eligible_nodes > 0) {
            pool.reward_per_node = pool.total_rewards / pool.total_eligible_nodes;
        }
    }

    // ============================================================
    // GOVERNANCE
    // ============================================================

    public entry fun submit_proposal(
        proposal_type: u8,
        description: vector<u8>,
        execution_time: u64,
        ctx: &mut TxContext,
    ) {
        let proposal = GovernanceProposal {
            id: object::new(ctx),
            proposer: tx_context::sender(ctx),
            proposal_type,
            description,
            votes_for: 0,
            votes_against: 0,
            status: 0,
            created_at: tx_context::timestamp_ms(ctx),
            execution_time,
            executed_at: 0,
        };

        transfer::share_object(proposal);
    }

    public entry fun vote_proposal(
        proposal: &mut GovernanceProposal,
        support: bool,
        voting_power: u64,
        ctx: &mut TxContext,
    ) {
        assert!(proposal.status == 0, EUnauthorized);

        if (support) {
            proposal.votes_for = proposal.votes_for + voting_power;
        } else {
            proposal.votes_against = proposal.votes_against + voting_power;
        }
    }

    public entry fun execute_proposal(
        proposal: &mut GovernanceProposal,
        registry: &mut NodeRegistry,
        ctx: &mut TxContext,
    ) {
        assert!(proposal.status == 0, EUnauthorized);
        assert!(tx_context::timestamp_ms(ctx) >= proposal.execution_time, EProposalExpired);

        let total_votes = proposal.votes_for + proposal.votes_against;
        if (total_votes > 0) {
            let approval_percentage = (proposal.votes_for * 100) / total_votes;
            if (approval_percentage >= registry.governance_threshold) {
                proposal.status = 1;
                proposal.executed_at = tx_context::timestamp_ms(ctx);

                if (proposal.proposal_type == 0) {
                    registry.network_version = registry.network_version + 1;
                }
            } else {
                proposal.status = 2;
            }
        }
    }

    // ============================================================
    // VIEW FUNCTIONS
    // ============================================================

    public fun get_node_status(node: &ParallelNode): u8 { node.status }
    public fun get_node_reputation(node: &ParallelNode): u64 { node.reputation_score }
    public fun get_node_transactions(node: &ParallelNode): u64 { node.transactions_processed }
    public fun get_node_rewards(node: &ParallelNode): u64 { node.total_rewards_earned }

    public fun get_registry_stats(registry: &NodeRegistry): (u64, u64, u64, u64) {
        (registry.total_nodes, registry.active_nodes, registry.total_staked, registry.current_epoch)
    }

    public fun is_route_approved(route: &PaymentRoute): bool { route.cbn_approved && route.active }
    public fun get_escrow_status(escrow: &EscrowVault): u8 { escrow.status }
    public fun get_oracle_price(oracle: &OraclePrice): (u64, u64, u64) {
        (oracle.price_usd, oracle.price_ngn, oracle.timestamp)
    }
    public fun is_oracle_stale(oracle: &OraclePrice, current_time: u64): bool {
        current_time > oracle.timestamp + ORACLE_STALENESS_MS
    }
    public fun get_bridge_status(bridge: &BridgeTransfer): u8 { bridge.status }
}
