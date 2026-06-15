

# OBEY Institutional Virtual Card Protocol (v1.0)

## 1. Technical Specification
- **Gateway:** Interswitch Quickteller Mesh.
- **Node Type:** Digital Multi-Asset Proxy.
- **Provisioning:** Instant Liquidity Conversion.

## 2. Security Standards
- **Biometric Locking:** Cards are locked by default and require institutional biometric pulse to reveal CVV.
- **Dynamic CVV:** Rotated every 24 hours via secure ledger node.
- **Balance Mesh:** Virtual cards can pull liquidity directly from:
  - NGN Treasury Balance.
  - Locked Crypto Asset Nodes (BTC, ETH, SOL).
- **Encryption:** AES-256 at rest, TLS 1.3 in transit.

## 3. API Requirements (Interswitch)
- **Provisioning Endpoint:** `/api/v1/cards/virtual/create`
- **Authentication:** OAuth 2.0 (Bearer Mesh).
- **Mandatory Metadata:**
  - `holderName`: Verified Institutional Legal Entity.
  - `kycNodeId`: Verified Identity ID.
  - `initialLiquidity`: Initial conversion magnitude.

## 4. Usage Controls
- **Geo-Fencing:** Restricted to verified regional IP nodes.
- **Magnitude Cap:** $5,000 per 24H cycle (Elite Node).
- **Auto-Kill Node:** Instant decommissioning via Admin Vault if breach is detected.
