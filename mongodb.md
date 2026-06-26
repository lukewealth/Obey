# MongoDB Database Documentation - OBEY Fintech Platform

## Overview

This document provides comprehensive documentation of the MongoDB database architecture, models, relationships, and administrative controls for the OBEY fintech platform.

**Database:** MongoDB Atlas  
**ORM:** Mongoose  
**Connection Pool:** 10 connections  
**Timeout:** 45 seconds  

---

## 1. Database Connection Configuration

### Connection String
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/obey_db
```

### Connection Options
```typescript
{
  bufferCommands: false,        // Disable command buffering
  maxPoolSize: 10,              // Maximum connection pool size
  serverSelectionTimeoutMS: 5000, // Server selection timeout
  socketTimeoutMS: 45000        // Socket timeout (45s)
}
```

### Connection Management
- **Singleton Pattern:** Cached connection prevents multiple connections in serverless
- **Graceful Degradation:** Server starts even if MongoDB is unavailable
- **Auto-Reconnect:** Mongoose handles reconnection automatically

---

## 2. Database Models

### 2.1 User Model
**File:** `server/models/User.ts`  
**Collection:** `users`

#### Schema
```typescript
{
  supabaseId: String,           // Required, Unique, Indexed
  obeyId: String,               // Unique, Auto-generated (OBEY-XXXXX)
  name: String,                 // Required
  email: String,                // Required, Unique, Indexed
  role: String,                 // Enum: ['user', 'admin'], Default: 'user'
  phone: String,
  avatar: String,
  kycStatus: String,            // Enum: ['Unverified', 'Pending', 'Verified']
  kycLevel: Number,             // Default: 0
  tierLevel: Number,            // Default: 1 (1=Standard, 2=Premium, 3=Institutional)
  isEmailVerified: Boolean,     // Default: false
  balance: Number,              // Default: 0
  promoCode: String,
  twoFactorEnabled: Boolean,    // Default: false
  metadata: Mixed,              // Flexible metadata storage
  lastSync: Date                // Default: Date.now
}
```

#### Indexes
- `supabaseId`: Unique
- `obeyId`: Unique
- `email`: Unique

#### Hooks
- **Pre-save:** Auto-generates `obeyId` if not provided

#### Relationships
- **One-to-Many:** Transactions, VirtualAccounts, VirtualCards, Rewards, FraudAlerts
- **One-to-One:** Rewards (via userId)

---

### 2.2 Transaction Model
**File:** `server/models/Transaction.ts`  
**Collection:** `transactions`

#### Schema
```typescript
{
  id: String,                           // Required, Unique
  userId: String,                       // Required, Indexed
  title: String,                        // Required
  category: String,                     // Enum: ['Electronics', 'Transfer', 'Dining', 'Travel', 'Food', 'Crypto', 'Airtime', 'Data', 'GiftCard', 'System']
  type: String,                         // Enum: ['Debit', 'Credit']
  amount: Number,                       // Required
  fee: Number,                          // Default: 0
  date: String,                         // Required
  time: String,                         // Required
  status: String,                       // Enum: ['Success', 'Processing', 'Failed', 'Awaiting Audit', 'Escrow', 'Disputed']
  recipientWallet: String,
  network: String,
  brand: String,
  requestReference: String,
  riskScore: Number,                    // Default: 0
  executionNode: String,
  auditHash: String,
  
  // Nomba Integration Fields
  nombaTransactionId: String,           // Indexed
  orderReference: String,               // Indexed
  sessionId: String,
  paymentMethod: String,                // Enum: ['card', 'bank_transfer', 'virtual_account', 'wallet', 'ussd', 'qr']
  webhookVerified: Boolean,             // Default: false
  idempotencyKey: String,
  
  // Blockchain/Audit Fields
  transactionHash: String,              // Indexed
  previousHash: String,
  blockNumber: Number,
  
  // AI/Fraud Detection
  aiRiskScore: Number,                  // Default: 0
  aiFlags: [String],
  fraudCheckPassed: Boolean,            // Default: true
  
  // Rewards
  rewardsEarned: Number,                // Default: 0
}
```

#### Indexes
- `id`: Unique
- `userId`: Indexed
- `nombaTransactionId`: Indexed
- `orderReference`: Indexed
- `transactionHash`: Indexed
- **Compound:** `{ userId: 1, createdAt: -1 }` - Optimizes user transaction queries
- **Compound:** `{ status: 1, createdAt: -1 }` - Optimizes status-based queries
- **Compound:** `{ category: 1, createdAt: -1 }` - Optimizes category filtering

#### Relationships
- **Many-to-One:** User (via userId)
- **One-to-One:** CryptoListing, GiftCardListing (via transactionId)

---

### 2.3 VirtualAccount Model
**File:** `server/models/VirtualAccount.ts`  
**Collection:** `virtualaccounts`

#### Schema
```typescript
{
  userId: String,                       // Required, Indexed
  accountRef: String,                   // Required, Unique
  accountName: String,                  // Required
  bankAccountNumber: String,            // Required
  bankName: String,                     // Required
  currency: String,                     // Default: 'NGN'
  expectedAmount: Number,
  expiryDate: Date,
  expired: Boolean,                     // Default: false
  isActive: Boolean,                    // Default: true
  nombaAccountId: String
}
```

#### Indexes
- `userId`: Indexed
- `accountRef`: Unique

#### Business Rules
- Maximum 2 active virtual accounts per user
- Funds sent to virtual account auto-credit user wallet
- Webhook triggers on virtual account funding

#### Relationships
- **Many-to-One:** User (via userId)

---

### 2.4 VirtualCard Model
**File:** `server/models/VirtualCard.ts`  
**Collection:** `virtualcards`

#### Schema
```typescript
{
  userId: String,                       // Required, Indexed
  holderName: String,                   // Required
  cardNumber: String,                   // Required
  expiryDate: String,                   // Required
  cvv: String,                          // Required
  balance: Number,                      // Default: 0
  currency: String,                     // Default: 'NGN'
  status: String,                       // Enum: ['Active', 'Locked', 'Terminated']
  cardType: String,                     // Enum: ['Visa', 'Mastercard']
  interswitchRef: String,               // Required, Unique
  lastCVVRotation: Date                 // Default: Date.now
}
```

#### Indexes
- `userId`: Indexed
- `interswitchRef`: Unique

#### Business Rules
- CVV rotation every 24 hours for security
- Card can be locked/unlocked by user
- Balance managed separately from main wallet

#### Relationships
- **Many-to-One:** User (via userId)

---

### 2.5 WebhookEvent Model
**File:** `server/models/WebhookEvent.ts`  
**Collection:** `webhookevents`

#### Schema
```typescript
{
  eventId: String,                      // Required, Unique
  eventType: String,                    // Required (payment_success, payment_failed, etc.)
  transactionId: String,                // Required
  amount: Number,
  currency: String,
  status: String,
  userId: String,
  orderReference: String,
  rawPayload: Mixed,                    // Required (full webhook payload)
  processedAt: Date,                    // Default: Date.now
  signatureValid: Boolean               // Required
}
```

#### Indexes
- `eventId`: Unique

#### Business Rules
- Prevents duplicate webhook processing
- Stores raw payload for audit trail
- Signature validation mandatory

#### Relationships
- **Many-to-One:** Transaction (via transactionId)
- **Many-to-One:** User (via userId)

---

### 2.6 FraudAlert Model
**File:** `server/models/FraudAlert.ts`  
**Collection:** `fraudalerts`

#### Schema
```typescript
{
  userId: String,                       // Required, Indexed
  transactionId: String,                // Required
  riskScore: Number,                    // Required (0-100)
  riskLevel: String,                    // Required, Enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
  flags: [String],
  hash: String,                         // Required
  status: String,                       // Enum: ['PENDING_REVIEW', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE', 'CONFIRMED_FRAUD']
  reviewedBy: String,
  reviewNotes: String,
  resolvedAt: Date,
  actionTaken: String
}
```

#### Indexes
- `userId`: Indexed

#### Business Rules
- Auto-created by fraud detection middleware
- Admin review workflow: PENDING_REVIEW → INVESTIGATING → RESOLVED/FALSE_POSITIVE/CONFIRMED_FRAUD
- Risk score calculated by AI service

#### Relationships
- **Many-to-One:** User (via userId)
- **Many-to-One:** Transaction (via transactionId)

---

### 2.7 CryptoListing Model
**File:** `server/models/CryptoListing.ts`  
**Collection:** `cryptolistings`

#### Schema
```typescript
{
  id: String,                           // Required, Unique
  sellerId: String,                     // Required
  sellerName: String,                   // Required
  assetSymbol: String,                  // Required
  amount: Number,                       // Required
  priceInUSD: Number,                   // Required
  rate: Number,                         // Required
  status: String,                       // Enum: ['OPEN', 'PENDING', 'COMPLETED', 'CANCELLED', 'DISPUTED']
  buyerId: String,
  transactionId: String
}
```

#### Indexes
- `id`: Unique

#### Business Rules
- P2P crypto trading marketplace
- Escrow system via Transaction model
- Status workflow: OPEN → PENDING → COMPLETED/CANCELLED/DISPUTED

#### Relationships
- **Many-to-One:** User (seller via sellerId, buyer via buyerId)
- **One-to-One:** Transaction (via transactionId)

---

### 2.8 GiftCardListing Model
**File:** `server/models/GiftCardListing.ts`  
**Collection:** `giftcardlistings`

#### Schema
```typescript
{
  id: String,                           // Required, Unique
  sellerId: String,                     // Required
  sellerName: String,                   // Required
  assetName: String,                    // Required
  faceValue: Number,                    // Required
  price: Number,                        // Required
  status: String,                       // Enum: ['OPEN', 'PENDING', 'COMPLETED', 'CANCELLED', 'DISPUTED']
  claimCode: String,
  buyerId: String,
  transactionId: String
}
```

#### Indexes
- `id`: Unique

#### Business Rules
- P2P gift card marketplace
- Escrow system via Transaction model
- Claim code encrypted/stored until release

#### Relationships
- **Many-to-One:** User (seller via sellerId, buyer via buyerId)
- **One-to-One:** Transaction (via transactionId)

---

### 2.9 Rewards Model
**File:** `server/models/Rewards.ts`  
**Collection:** `rewards`

#### Schema
```typescript
{
  userId: String,                       // Required, Unique, Indexed
  points: Number,                       // Default: 0
  level: Number,                        // Default: 1
  tier: String,                         // Enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond']
  totalEarned: Number,                  // Default: 0
  totalRedeemed: Number,                // Default: 0
  streak: Number,                       // Default: 0
  lastActivity: Date,                   // Default: Date.now
  achievements: [{
    id: String,
    name: String,
    description: String,
    earnedAt: Date,
    points: Number
  }],
  history: [{
    type: String,                       // Enum: ['EARNED', 'REDEEMED', 'EXPIRED', 'BONUS']
    points: Number,
    reason: String,
    reference: String,
    createdAt: Date
  }],
  badges: [{
    id: String,
    name: String,
    icon: String,
    earnedAt: Date
  }],
  referralCode: String,                 // Unique
  referrals: Number,                    // Default: 0
  multiplier: Number                    // Default: 1.0
}
```

#### Indexes
- `userId`: Unique + Indexed
- `referralCode`: Unique

#### Hooks
- **Pre-save:** 
  - Auto-generates referral code
  - Calculates tier based on points thresholds
  - Calculates level from totalEarned

#### Tier Thresholds
- **Bronze:** 0-499 points
- **Silver:** 500-1,999 points
- **Gold:** 2,000-4,999 points
- **Platinum:** 5,000-9,999 points
- **Diamond:** 10,000+ points

#### Relationships
- **One-to-One:** User (via userId)

---

## 3. Database Routes & Operations

### 3.1 Routes Requiring Database Access

| Route | Methods | Models Used |
|-------|---------|-------------|
| `/api/sync/*` | GET, POST | User, Transaction, Metadata |
| `/api/payments/*` | POST | User, Transaction |
| `/api/admin/*` | GET, POST | User, Transaction, FraudAlert |
| `/api/cards/*` | GET, POST, PATCH | VirtualCard, Transaction |
| `/api/webhooks/*` | POST | WebhookEvent, Transaction, User |
| `/api/nomba/*` | GET, POST | Transaction, VirtualAccount, User |
| `/api/rewards/*` | GET, POST | Rewards |
| `/api/ai/*` | POST | Transaction |
| `/api/crypto-market/*` | GET, POST | CryptoListing, User, Transaction |
| `/api/giftcards/*` | GET, POST | GiftCardListing, User, Transaction |

### 3.2 Routes Bypassing Database

| Route | Reason |
|-------|--------|
| `/api/market/*` | Uses CoinAPI + in-memory cache |
| `/api/health` | Health check only |
| `/api/sync/asset-sync/*` | External API calls only |

---

## 4. Administrative Controls

### 4.1 Admin Authentication
**Middleware:** `server/middleware/adminAuth.ts`

```typescript
// Checks user role in database
const user = await User.findOne({ 
  $or: [{ supabaseId: userId }, { email: userId }] 
});

if (user.role !== 'admin') {
  return res.status(403).json({ error: 'Admin access required' });
}
```

### 4.2 Admin Endpoints

#### User Management
```
GET  /api/admin/users              - List all users
POST /api/admin/upgrade-tier       - Upgrade user tier level
POST /api/admin/approve-kyc        - Approve KYC verification
POST /api/admin/adjust-balance     - Manual balance adjustment
```

#### Fraud Management
```
GET  /api/admin/fraud-alerts       - List pending fraud alerts
POST /api/admin/resolve-alert      - Resolve/dismiss fraud alert
GET  /api/admin/risk-profile/:id   - Get user risk profile
```

#### System Management
```
GET  /api/admin/audit-ledger       - System-wide audit data
GET  /api/admin/vault-metrics      - Escrow transaction metrics
POST /api/admin/push-notification  - Send push notifications
```

### 4.3 Tier Management System

#### Tier Levels
1. **Standard (Level 1)**
   - Basic transaction limits
   - Standard support
   - Email verification required

2. **Premium (Level 2)**
   - Higher transaction limits
   - Priority support
   - KYC verified

3. **Institutional (Level 3)**
   - Unlimited transactions
   - Dedicated support
   - Full KYC + additional verification

#### Admin Tier Upgrade Flow
```typescript
POST /api/admin/upgrade-tier
{
  userId: "user-id",
  tierLevel: 2  // 1, 2, or 3
}

// Updates user.tierLevel
// Triggers notification
// Logs audit trail
```

---

## 5. Security & Compliance

### 5.1 Data Encryption
- **At Rest:** MongoDB Atlas encryption enabled
- **In Transit:** TLS/SSL required
- **Sensitive Fields:** CVV, card numbers encrypted before storage

### 5.2 Audit Trail
- All transactions logged with timestamps
- Webhook events stored with raw payloads
- Admin actions logged with user ID
- Hash chain for transaction integrity (previousHash, transactionHash)

### 5.3 Access Control
- Role-based access (user/admin)
- API rate limiting (1000 req/15min)
- CORS restricted to approved origins
- Helmet security headers enabled

### 5.4 Compliance Features
- KYC verification levels
- Transaction monitoring
- Fraud detection with AI
- Escrow system for P2P trades
- Dispute resolution workflow

---

## 6. Performance Optimization

### 6.1 Indexes Strategy

#### Single Field Indexes
- `userId` on Transaction, VirtualAccount, VirtualCard, FraudAlert
- `orderReference`, `nombaTransactionId` on Transaction
- `eventId` on WebhookEvent
- `accountRef` on VirtualAccount

#### Compound Indexes
```typescript
Transaction: { userId: 1, createdAt: -1 }     // User transaction history
Transaction: { status: 1, createdAt: -1 }     // Status-based queries
Transaction: { category: 1, createdAt: -1 }   // Category filtering
```

### 6.2 Connection Pooling
- **Pool Size:** 10 connections
- **Serverless Optimization:** Cached connection singleton
- **Timeout Settings:** 5s selection, 45s socket

### 6.3 Query Optimization
- Use `.lean()` for read-only queries
- Limit fields with `.select()`
- Pagination for large datasets
- Avoid `$or` queries when possible (use indexed fields)

---

## 7. Monitoring & Maintenance

### 7.1 Health Checks
```
GET /api/health
Response: {
  status: "healthy",
  database: "MongoDB Atlas Fallback Ready",
  timestamp: "2026-06-26T..."
}
```

### 7.2 Database Metrics
- Connection pool utilization
- Query execution time
- Index usage statistics
- Storage consumption

### 7.3 Backup Strategy
- MongoDB Atlas automatic backups
- Point-in-time recovery
- Daily snapshots retained for 7 days

### 7.4 Alerting
- Connection failures
- Query timeout errors
- Replica set lag
- Storage threshold warnings

---

## 8. Migration & Schema Evolution

### 8.1 Adding New Fields
```typescript
// 1. Update model schema
// 2. Set default values for existing documents
// 3. Deploy to staging
// 4. Run migration script if needed
// 5. Deploy to production
```

### 8.2 Index Management
```typescript
// Create index
db.transactions.createIndex({ userId: 1, createdAt: -1 });

// Drop index
db.transactions.dropIndex("userId_1_createdAt_-1");

// List indexes
db.transactions.getIndexes();
```

### 8.3 Data Migration Scripts
Located in: `scripts/migrations/`

---

## 9. Troubleshooting

### 9.1 Common Issues

#### Connection Timeout
```
Error: Server selection timed out after 5000ms
Solution: Check MONGODB_URI, network connectivity, Atlas IP whitelist
```

#### Duplicate Key Error
```
Error: E11000 duplicate key error
Solution: Check unique constraints, use upsert operations
```

#### Slow Queries
```
Solution: 
1. Check explain() output
2. Verify indexes exist
3. Add compound indexes if needed
4. Use .lean() for read-only queries
```

### 9.2 Debugging Commands
```javascript
// Check connection
mongoose.connection.readyState // 0=disconnected, 1=connected

// List collections
db.getCollectionNames()

// Count documents
db.users.countDocuments()

// Find slow queries
db.transactions.find().explain("executionStats")
```

---

## 10. Technical Requirements (from technical.md)

### 10.1 Nomba Integration Requirements
✅ VirtualAccount model created  
✅ WebhookEvent model for audit trail  
✅ Transaction model extended with Nomba fields  
✅ Webhook handler processes payment events  
✅ Signature validation implemented  
✅ Idempotency keys for transfers  

### 10.2 Security Requirements
✅ HMAC-SHA256 webhook signature validation  
✅ Fraud detection middleware  
✅ Transaction hash chain for integrity  
✅ Admin authentication middleware  
✅ Rate limiting on all endpoints  
✅ CORS restricted to approved origins  

### 10.3 Performance Requirements
✅ Connection pooling (10 connections)  
✅ Compound indexes for frequent queries  
✅ Cached database connection for serverless  
✅ Query optimization with .lean() and .select()  

### 10.4 Compliance Requirements
✅ KYC verification levels  
✅ Audit trail for all transactions  
✅ Escrow system for P2P trades  
✅ Dispute resolution workflow  
✅ Fraud monitoring and alerts  

---

## 11. Future Enhancements

### 11.1 Planned Features
- [ ] Sharding for horizontal scaling
- [ ] Read replicas for query offloading
- [ ] Change streams for real-time updates
- [ ] Aggregation pipeline optimizations
- [ ] Time-series collections for analytics

### 11.2 Schema Evolution
- [ ] Add geospatial indexes for location-based features
- [ ] Implement soft deletes for audit compliance
- [ ] Add versioning for document history
- [ ] Create materialized views for reporting

---

## 12. Contact & Support

**Database Administrator:** Luke Okagha  
**Team:** TRICODE PRO  
**MongoDB Atlas Project:** Obey Fintech  
**Support:** docs@nomba.com (for Nomba integration)

---

**Document Version:** 1.0  
**Last Updated:** 2026-06-26  
**Next Review:** 2026-07-26
