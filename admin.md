# OBEY Institutional Admin Portal - Technical Specification

## Overview
The OBEY Admin Portal is the central command node for platform governance, financial oversight, and user compliance. It provides deep visibility into the institutional ledger and user lifecycle management.

## 1. Requirements & Core Features

### User Management & KYC Audit
- **Identity Mesh View**: Full access to user profiles, KYC status (Tier 1-3), and document verification history.
- **Access Control**: Ability to freeze/unfreeze accounts, reset security credentials, and manage administrative roles.
- **KYC Node Validation**: Manual override for gated verification steps where automated systems require institutional review.

### Financial Control & Token Management
- **Wallet Credit Management**: Direct control over "Obey to Obey" wallet credit/token issuance and adjustment.
- **Escrow Oversight**: Monitor and settle P2P crypto and gift card marketplace transactions.
- **Vault Liquidity Monitoring**: Real-time tracking of platform-wide balances and fiat on-ramp/off-ramp flows.

### Platform Optimization
- **System Health Monitor**: Real-time status of external API nodes (CoinAPI, Interswitch, Supabase).
- **Transaction Audit Log**: Immutable record of all administrative actions for compliance and internal security audits.
- **Rate Limit Governance**: Dynamic adjustment of marketplace and API usage limits.

## 2. Technical Architecture & Routing

### Secure Routing Strategy
- **Admin Authentication Node**: Custom middleware (`adminAuth.ts`) verifying JWT claims against the institutional database.
- **Path Segregation**: All admin routes are prefixed with `/api/admin/*` and require elevated privileges.
- **Audit Interceptor**: A global interceptor that logs every POST/PUT/DELETE request made to the admin routes.

### Institutional Security Risk Mitigation
- **Asset Safeguarding**: Direct wallet adjustments require dual-factor authorization (Admin + System Key).
- **KYC Privacy**: Document assets are stored in encrypted Supabase buckets with time-limited signed URLs.
- **Database Resilience**: MongoDB Atlas with automated backups and multi-region redundancy.

## 3. Implementation Steps

1.  **Phase 1: Admin Authentication Mesh**
    - Implement `server/middleware/adminAuth.ts`.
    - Register admin metadata in the User schema.
2.  **Phase 2: Management UI**
    - Build `src/components/AdminSystem.tsx` with high-fidelity data tables.
    - Implement the "Obey to Obey" credit adjustment module.
3.  **Phase 3: Audit & Optimization**
    - Connect the Transaction model to log admin-initiated balance changes.
    - Implement the health check dashboard for external service nodes.

## 4. Security Checklist
- [ ] No PII (Personally Identifiable Information) in local logs.
- [ ] All sensitive actions (balance change, account freeze) require a "Reason" field for the audit trail.
- [ ] Implement IP-based white-listing for the portal in production.
- [ ] Regular rotation of API keys and database credentials.

---
*Confidentiality Notice: This document is part of the OBEY institutional design bible. Unauthorized distribution is prohibited.*
