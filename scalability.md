# OBEY Platform Scalability & Architecture Record

## 1. Modular Component Architecture
The platform is built using a "Node-Based" modular architecture. Each feature (Wallet, Crypto, VTU) is an isolated module located in `src/components/`, allowing for independent scaling and maintenance.

## 2. Dual-Database Synchronization
To ensure 100% uptime and data integrity, OBEY utilizes a dual-sync strategy:
- **Primary Auth/Realtime:** Supabase (PostgreSQL).
- **Secondary Profile/Metadata:** MongoDB Atlas.
- **Sync Logic:** Handled via `App.tsx` auth listeners and `server/routes/sync.ts`.

## 3. High-Fidelity UI Standards
- **Styling:** Tailwind CSS 4.0 with customized glass-morphic utilities.
- **Motion:** Framer Motion for hardware-accelerated transitions.
- **Icons:** Standardized on Heroicons v24 (Outline) and Lucide React.

## 4. Auth Integration Record
### Apple Sign-In Configuration
- **Redirect URI:** `https://gen-lang-client-0511739049.firebaseapp.com/__/auth/handler`
- **Provider:** Apple OAuth 2.0.
- **Status:** Integrated via Supabase/Firebase backend hooks.

## 5. Syntax Check Verification
- **Date:** June 13, 2026
- **Test Component:** `src/components/SyntaxTestComponent.tsx`
- **Results:**
  - [x] TypeScript Strict Mode: Pass
  - [x] Tailwind 4.0 Utility Resolution: Pass
  - [x] Motion Animation Hooks: Pass
  - [x] Institutional Branding Consistency: Pass

## 6. GiftCard & Crypto Marketplace Node (P2P)
Implemented as decentralized escrow nodes within the Trade module.
- **Protocol:** P2P Listing (Locking) -> Buyer Lock (Escrow) -> Admin Audit -> Release.
- **Security:** Secured via `marketLimiter` and Zod-enforced schema validation. Multi-step "Lock for Sell" flow ensures data integrity before broadcast.
- **High-Fidelity UI:** Utilizes "Execution Desk" pattern for transactions and "Node Broadcast" for P2P liquidity listings.

## 7. Future Expansion Node
The architecture supports the addition of **Cross-Chain Yield Aggregators** and **Institutional Liquidity Bridges** by extending the `AppTab` enum and adding corresponding components to the dashboard mesh.
