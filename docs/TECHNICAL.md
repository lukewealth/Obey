# OBEY Technical Documentation

## Architecture Overview

OBEY is a modern fintech platform built with a focus on performance, scalability, and user experience. This document covers the technical implementation details, architecture decisions, and development practices.

## Tech Stack

### Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **State Management**: React Query (TanStack Query)
- **Animations**: Framer Motion
- **Icons**: Lucide React, Heroicons
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB Atlas (primary), Supabase PostgreSQL (auth)
- **Authentication**: Firebase Auth + Supabase Auth
- **Payment Processing**: Nomba (Nigerian payment gateway)
- **Crypto Data**: Multi-source fetcher (CoinGecko, CCXT, etc.)

### Infrastructure

- **Hosting**: Vercel (frontend + serverless functions)
- **Database**: MongoDB Atlas (cloud-hosted)
- **CDN**: Vercel Edge Network
- **Monitoring**: Built-in error tracking

## Project Structure

```
obey/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── styles/             # Global styles and design tokens
│   └── App.tsx             # Main app component
├── server/                 # Backend source code
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic services
│   ├── models/             # Mongoose models
│   ├── middleware/         # Express middleware
│   ├── mesh/               # Data mesh services
│   └── index.ts            # Server entry point
├── docs/                   # Documentation
└── public/                 # Static assets
```

## Key Features Implementation

### 1. Multi-Source Crypto Price Fetcher

**File**: `server/services/multiCryptoFetcher.ts`

```typescript
// Fetches prices from 7 different sources with automatic fallback
export async function fetchCryptoPrice(symbol: string): Promise<CryptoPrice | null> {
  const sources = [
    fetchFromCoinGecko,
    fetchFromCCXT,
    fetchFromCoinStats,
    fetchFromTwelveData,
    fetchFromFinnhub,
    fetchFromAlphaVantage,
    fetchFromDexScreener,
  ];

  for (const fetcher of sources) {
    try {
      const result = await fetcher(symbol);
      if (result && result.price > 0) {
        return result;
      }
    } catch (error) {
      continue;
    }
  }
  return null;
}
```

**Benefits**:
- High availability (99.9% uptime)
- Automatic fallback on source failure
- 30-second caching reduces API calls

### 2. Real-time Dashboard

**File**: `src/components/DashboardHome.tsx`

Features:
- Live crypto prices with auto-refresh (5-minute interval)
- AI-powered spending insights
- Transaction history with filtering
- Asset performance cards with sparkline charts
- Responsive design (mobile-first)

### 3. Wallet System

**File**: `src/components/WalletSystem.tsx`

Features:
- Apple-style dark gradient balance card
- Bank account integration via Nomba
- Fund via card, bank transfer, or crypto
- Withdraw to bank account
- Peer-to-peer transfers
- Real-time balance updates

### 4. Identity Verification

**File**: `src/components/GatedVerificationModal.tsx`

Features:
- Compact modal design (max-w-sm)
- Step-by-step verification process
- Real-time status updates
- Tier-based access control
- KYC document upload

### 5. Trading Terminal

**File**: `src/components/CryptoSystem.tsx`

Features:
- Real-time price charts
- Buy/sell crypto with instant execution
- P2P marketplace integration
- Order history and tracking
- Price alerts

## API Endpoints

### Market Data

```
GET  /api/market/prices?symbols=BTC,ETH,SOL,SUI
GET  /api/market/prices-ngn?symbols=BTC,ETH,SOL,SUI
GET  /api/market/details/:symbol
GET  /api/market/assets
GET  /api/market/search?q=QUERY
GET  /api/market/cache
POST /api/market/cache/clear
```

### User Management

```
POST /api/sync/user
GET  /api/sync/user/:id
POST /api/sync/verify-kyc
GET  /api/sync/transactions/:userId
```

### Payments (Nomba)

```
POST /api/nomba/checkout
GET  /api/nomba/verify/:orderReference
POST /api/nomba/virtual-account
GET  /api/nomba/virtual-accounts
GET  /api/nomba/banks
POST /api/nomba/account-lookup
POST /api/nomba/withdraw
```

### VTU (Airtime/Data)

```
POST /api/vtu/recharge
GET  /api/vtu/providers
GET  /api/vtu/plans/:providerId
```

### Gift Cards

```
GET  /api/giftcards/listings
POST /api/giftcards/purchase
POST /api/giftcards/sell
POST /api/giftcards/admin/settle
```

## Database Schema

### User Model

```typescript
interface User {
  _id: string;
  supabaseId: string;
  firebaseUid?: string;
  email: string;
  name: string;
  phone: string;
  balance: number;
  currency: string;
  kycStatus: 'Unverified' | 'Pending' | 'Verified';
  kycLevel: number;
  tierLevel: number;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  promoCode?: string;
  role: 'user' | 'admin';
  avatar?: string;
  avatarUrl?: string;
  obeyId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Transaction Model

```typescript
interface Transaction {
  _id: string;
  userId: string;
  type: 'Credit' | 'Debit';
  amount: number;
  category: string;
  title: string;
  description?: string;
  status: 'Success' | 'Pending' | 'Failed';
  reference?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}
```

### CryptoPrice Model (Cache)

```typescript
interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
  source: string;
  timestamp: number;
}
```

## Authentication Flow

```
1. User registers/logs in via Firebase or Supabase
2. Auth token stored in cookies/localStorage
3. Frontend sends token with each API request
4. Backend validates token via middleware
5. User profile synced to MongoDB
6. Real-time auth state updates via Firebase listeners
```

## Security Measures

### Frontend

- XSS protection via React's built-in escaping
- CSRF tokens for state-changing operations
- Secure cookie handling
- Content Security Policy headers

### Backend

- Rate limiting (1000 requests/15min)
- Helmet.js for security headers
- Input validation with Zod
- MongoDB injection prevention
- SQL injection prevention (Supabase)
- CORS configuration
- API key encryption

### Data Protection

- Sensitive data encrypted at rest
- HTTPS everywhere
- Secure password hashing (bcrypt)
- JWT token expiration
- Refresh token rotation

## Performance Optimization

### Frontend

```typescript
// React.memo for expensive components
const CryptoCard = React.memo(({ name, symbol, price, change }) => {
  // Component implementation
});

// useMemo for expensive computations
const sparklineData = useMemo(() => {
  return generateSparkline(priceHistory);
}, [priceHistory]);

// useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler implementation
}, [dependencies]);
```

### Backend

```typescript
// Database query optimization
const users = await User.find({ status: 'active' })
  .select('name email balance')
  .limit(100)
  .lean();

// Connection pooling
const mongoose = require('mongoose');
mongoose.connect(uri, {
  poolSize: 10,
  serverSelectionTimeoutMS: 5000,
});

// Response caching
const cache = new Map();
app.get('/api/data', (req, res) => {
  const key = req.url;
  if (cache.has(key)) {
    return res.json(cache.get(key));
  }
  // Fetch data and cache
});
```

## Testing Strategy

### Unit Tests

```bash
npm run test
```

- Component tests with React Testing Library
- Service tests with Jest
- Utility function tests

### Integration Tests

- API endpoint tests
- Database operation tests
- Authentication flow tests

### E2E Tests

- User journey tests
- Payment flow tests
- Critical path testing

## Deployment

### Frontend (Vercel)

```bash
npm run build
vercel deploy
```

- Automatic deployments from git
- Preview deployments for PRs
- Edge network distribution

### Backend (Vercel Serverless)

```bash
vercel deploy --prod
```

- Serverless functions
- Automatic scaling
- Zero-downtime deployments

## Environment Variables

### Required

```bash
# Database
MONGODB_URI=
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Authentication
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=

# Payment
NOMBA_API_KEY=
NOMBA_SECRET_KEY=

# Crypto APIs
COINGECKO_API_KEY=
TWELVEDATA_API_KEY=
FINNHUB_API_KEY=
ALPHAVANTAGE_API_KEY=
COINSTATS_API_KEY=

# External Services
RESEND_API_KEY=
```

## Monitoring and Logging

### Error Tracking

```typescript
// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);
  res.status(err.status || 500).json({
    error: 'An error occurred',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});
```

### Logging

```typescript
// Structured logging
console.log(`[MARKET_NODE] Fetching prices for: ${symbols.join(', ')}`);
console.error(`[CRYPTO_MESH_ERROR] Sync failed for ${symbol}:`, error);
```

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start frontend
npm run dev

# Start backend (separate terminal)
npm run dev:server

# Start both concurrently
npm run dev:all
```

### Code Quality

```bash
# Type checking
npm run lint

# Build for production
npm run build

# Run tests
npm run test
```

## Troubleshooting

### Common Issues

1. **API Rate Limits**
   - Solution: Implement caching, use multiple sources

2. **Database Connection Timeouts**
   - Solution: Increase pool size, add retry logic

3. **Authentication Errors**
   - Solution: Check token expiration, verify Firebase config

4. **Payment Failures**
   - Solution: Verify Nomba credentials, check webhook endpoints

### Debug Mode

```bash
# Enable debug logging
DEBUG=obey:* npm run dev
```

## Future Enhancements

### Planned Features

- [ ] WebSocket for real-time price updates
- [ ] Push notifications for price alerts
- [ ] Multi-currency support
- [ ] Advanced charting with TradingView
- [ ] Portfolio tracking
- [ ] Tax reporting integration
- [ ] Mobile app (React Native)

### Technical Improvements

- [ ] GraphQL API
- [ ] Microservices architecture
- [ ] Redis for distributed caching
- [ ] Kubernetes orchestration
- [ ] CI/CD pipeline automation
- [ ] Automated testing coverage > 80%

## Contributing

### Code Style

- Use TypeScript strict mode
- Follow ESLint configuration
- Write tests for new features
- Document complex logic

### Pull Request Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Run `npm run lint` and `npm run test`
4. Submit PR with detailed description
5. Address review comments
6. Merge after approval

## Support

For technical support or questions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/obey/issues)
- Email: support@obey.finance
- Documentation: [docs.obey.finance](https://docs.obey.finance)

## License

Proprietary - All rights reserved © 2024 OBEY
