# OBEY DIGITAL FINANCIAL PLATFORM - INTEGRATION DOCUMENTATION

## 1. Project Overview
OBEY is a premium digital payment and financial platform designed for high-fidelity mobile and desktop experiences. It features unified wallet management, airtime/data recharge (VTU), cryptocurrency trading, and a decentralized gift card marketplace.

## 2. Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Lucide React (Icons), Framer Motion (Animations).
- **Backend:** Node.js, Express, TypeScript (via tsx).
- **Database & Auth:** Supabase (Primary Auth/Realtime) + MongoDB Atlas (Metadata/Profile Fallback).
- **Deployment:** Vercel (Frontend + Serverless Functions).
- **Integrations:** Interswitch Quickteller (VTU), Google Maps Platform (Location Services).

## 3. Backend Architecture
The backend is structured as a modular Express application:
- `server/index.ts`: Entry point with enhanced security (Helmet, Rate Limiting, CORS).
- `server/routes/`: API endpoint definitions (VTU, GiftCard, Sync, Payments).
- `server/services/`: External service integrations (Interswitch, MongoDB).
- `server/models/`: Mongoose schemas for MongoDB persistence.

## 4. Hybrid Synchronization Protocol
OBEY utilizes a dual-database strategy for 100% uptime:
- **Supabase (PostgreSQL):** Handles primary authentication and real-time ledger updates.
- **MongoDB Atlas:** Serves as a high-fidelity metadata store and profile fallback.
- **Sync Logic:** Frontend React Query hooks manage an automated sync cycle between the browser, Supabase, and the MongoDB Atlas cloud node.

## 5. GiftCard Marketplace (P2P Escrow)
- **Protocol:** P2P Listing -> Buyer Lock (Escrow) -> Admin Release.
- **Node-Based:** Each listing is treated as an isolated digital node within the marketplace mesh.
- **Security:** Transactions are held in a platform-mediated escrow vault until node delivery is verified.

## 6. External Integrations
### Interswitch Airtime Recharge (VTU)
- **Auth:** OAuth 2.0 Client Credentials.
- **Flow:** 
  1. Fetch Biller Categories (Airtime/Data).
  2. Fetch Biller Payment Items.
  3. Validate Customer (Phone Number).
  4. Process Transaction.
- **Reference:** [Interswitch Documentation](https://docs.interswitchgroup.com/docs/airtime-recharge-virtual-top-up)

## 7. Security Best Practices
- **Rate Limiting:** Secured via `express-rate-limit` (1000 req/15m) on all API endpoints.
- **Input Validation:** Zod-enforced schema validation on both frontend and backend nodes.
- **Audit Logs:** Immutable sequential ledger entries verified on-chain.
- **Environment Nodes:** All secrets are stored in `.env` and injected via secure CI/CD pipelines.
