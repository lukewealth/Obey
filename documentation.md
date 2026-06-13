# OBEY DIGITAL FINANCIAL PLATFORM - INTEGRATION DOCUMENTATION

## 1. Project Overview
OBEY is a premium digital payment and financial platform designed for high-fidelity mobile and desktop experiences. It features unified wallet management, airtime/data recharge (VTU), cryptocurrency trading, and gift card marketplace.

## 2. Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Lucide React (Icons), Motion (Animations).
- **Backend:** Node.js, Express, TypeScript (via tsx).
- **Database & Auth:** Supabase (PostgreSQL + GoTrue Auth).
- **Deployment:** Vercel (Frontend + Serverless Functions).
- **Integrations:** Interswitch Quickteller (VTU), Google Maps Platform (Location Services).

## 3. Backend Architecture
The backend is structured as a modular Express application:
- `server/index.ts`: Entry point.
- `server/routes/`: API endpoint definitions.
- `server/services/`: External service integrations (Interswitch, Supabase).
- `server/middleware/`: Security and validation logic.

## 4. Database Schema (Supabase)
### Users
- `id`: UUID (Primary Key, matches Auth UID)
- `email`: Text
- `full_name`: Text
- `phone`: Text
- `avatar_url`: Text
- `kyc_status`: Text (Pending, Verified)
- `balance`: Numeric (USD)
- `created_at`: Timestamp

### Transactions
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key)
- `title`: Text
- `category`: Text (Airtime, Data, Crypto, GiftCard, Transfer)
- `type`: Text (Credit, Debit)
- `amount`: Numeric
- `fee`: Numeric
- `status`: Text (Success, Pending, Failed)
- `created_at`: Timestamp

## 5. External Integrations
### Interswitch Airtime Recharge (VTU)
- **Auth:** OAuth 2.0 Client Credentials.
- **Flow:** 
  1. Fetch Biller Categories (Airtime/Data).
  2. Fetch Biller Payment Items.
  3. Validate Customer (Phone Number).
  4. Process Transaction.
- **Reference:** [Interswitch Documentation](https://docs.interswitchgroup.com/docs/airtime-recharge-virtual-top-up)

## 6. Security Best Practices
- **Environment Variables:** All secrets (API keys, DB URLs) are stored in `.env` and never committed.
- **JWT Validation:** All sensitive backend endpoints require a valid Supabase JWT.
- **Input Validation:** Zod or similar for request body validation.
- **Rate Limiting:** Implemented on VTU and Auth endpoints.
- **Audit Logs:** All financial transactions are logged in the `transactions` table with immutable records.
