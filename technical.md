# OBEY × NOMBA INTEGRATION - TECHNICAL UPDATE PLAN

## Executive Summary

This document outlines the technical architecture for integrating Nomba's payment infrastructure into the Obey fintech platform. Nomba will replace Interswitch as the primary payment processor, providing virtual accounts, checkout payments, bank transfers, webhooks, and transaction verification.

**Hackathon Team:** TRICODE PRO  
**Developer:** Luke Okagha  
**Account IDs:**
- Parent: `f666ef9b-888e-4799-85ce-acb505b28023`
- Sub-account: `a94ac356-e554-4290-8fcd-b926a790f1f6`

---

## 1. Current Architecture Analysis

### Existing Payment Stack
- **Provider:** Interswitch (Quickteller API)
- **Service Layer:** `server/services/interswitch.ts`
- **Routes:** `server/routes/payments.ts`, `server/routes/vtu.ts`
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** Supabase (JWT-based)
- **Frontend:** React 19 + TypeScript + Vite
- **Deployment:** Vercel (serverless)

### Current Payment Flows
1. **Card Top-up:** User submits card → Interswitch processes → Balance updated
2. **Withdrawal:** User requests → Interswitch transfer → Balance deducted
3. **P2P Transfer:** Internal ledger transfer (no external processor)
4. **VTU:** Airtime/data purchase via Interswitch Quickteller

### Pain Points
- Interswitch integration is partially simulated (card data handling)
- No webhook support for async payment confirmation
- Limited payment method diversity
- No virtual account provisioning
- Manual transaction reconciliation

---

## 2. Nomba Integration Architecture

### 2.1 Service Layer Replacement

**File:** `server/services/nomba.ts`

This service will handle:
- OAuth 2.0 token management (issue, refresh, revoke)
- Checkout order creation
- Virtual account provisioning
- Bank transfer initiation
- Transaction verification
- Webhook signature validation

**Key Implementation Details:**

```typescript
// Token Management
- Cache access_token with TTL (30 min expiry, refresh at 25 min)
- Store refresh_token securely
- Auto-refresh on 401 responses
- Revoke tokens on user logout (optional)

// Authentication Flow
POST /v1/auth/token/issue
Headers: accountId: <parent_account_id>
Body: { grant_type: "client_credentials", client_id, client_secret }

// Required Headers for All Requests
- Authorization: Bearer <access_token>
- Content-Type: application/json
- accountId: <sub_account_id> (for scoping to sub-account)
```

### 2.2 API Routes Migration

#### A. Checkout Payment (Replace Card Top-up)

**Endpoint:** `POST /api/payments/checkout`

**Flow:**
1. Frontend sends `{ userId, amount, email, callbackUrl }`
2. Backend creates Nomba checkout order via `POST /v1/checkout/order`
3. Nomba returns `checkoutLink` and `orderReference`
4. Frontend redirects user to `checkoutLink`
5. User completes payment on Nomba's hosted page
6. Nomba redirects to `callbackUrl` with `orderReference`
7. Backend verifies transaction via `GET /v1/transactions/accounts/single?orderReference=<ref>`
8. If `status === "SUCCESS"`, update user balance and create transaction record

**Request Payload:**
```json
{
  "order": {
    "amount": "10000.00",
    "currency": "NGN",
    "customerEmail": "user@example.com",
    "callbackUrl": "https://obey-kappa.vercel.app/payment/callback",
    "accountId": "a94ac356-e554-4290-8fcd-b926a790f1f6",
    "orderMetaData": {
      "userId": "supabase_user_id",
      "purpose": "wallet_topup"
    }
  }
}
```

**Response:**
```json
{
  "code": "00",
  "data": {
    "checkoutLink": "https://checkout.nomba.com/pay/...",
    "orderReference": "uuid"
  }
}
```

#### B. Virtual Account Creation (New Feature)

**Endpoint:** `POST /api/wallet/virtual-account`

**Flow:**
1. User requests dedicated account for receiving payments
2. Backend calls `POST /v1/accounts/virtual`
3. Nomba returns account number, bank name, account name
4. Store in new `VirtualAccount` model
5. Display to user for funding wallet

**Request Payload:**
```json
{
  "accountRef": "OBEY-USER-12345",
  "accountName": "John Doe",
  "currency": "NGN",
  "expectedAmount": 5000.00
}
```

**Use Cases:**
- Dedicated funding account per user
- Invoice-based payments (set `expectedAmount`)
- Recurring payments (static virtual accounts)

#### C. Bank Transfer (Replace Withdrawal)

**Endpoint:** `POST /api/payments/withdraw`

**Flow:**
1. User requests withdrawal with bank details
2. Backend performs account lookup via `POST /v1/transfers/bank/lookup`
3. Display recipient name for confirmation
4. Initiate transfer via `POST /v2/transfers/bank`
5. Handle response status: `SUCCESS`, `PENDING_BILLING`, or `REFUND`
6. Create transaction record with appropriate status
7. Listen for webhook confirmation

**Request Payload:**
```json
{
  "amount": 5000,
  "accountNumber": "0123456789",
  "accountName": "John Doe",
  "bankCode": "011",
  "merchantTxRef": "WTH-UUID-123",
  "senderName": "Obey Fintech"
}
```

**Idempotency:** Include `X-Idempotent-key` header with unique UUID to prevent duplicate transfers.

#### D. Transaction Verification

**Endpoint:** `GET /api/payments/verify/:orderReference`

**Flow:**
1. Frontend polls after callback redirect
2. Backend calls `GET /v1/transactions/accounts/single?orderReference=<ref>`
3. Check `data.status === "SUCCESS"`
4. Return transaction details to frontend

**Critical:** Always verify transactions server-side before delivering value. Never trust client-side confirmation.

#### E. Webhook Handler (New)

**Endpoint:** `POST /api/webhooks/nomba`

**Purpose:** Receive async payment notifications from Nomba

**Events to Handle:**
- `payment_success` - Credit user balance, update transaction status
- `payment_failed` - Mark transaction as failed, notify user
- `payout_success` - Confirm withdrawal completion
- `payout_failed` - Refund user balance, notify support

**Security:**
- Validate `nomba-signature` header using HMAC-SHA256
- Compare computed signature with header value
- Reject requests with invalid signatures

**Signature Verification:**
```typescript
const hashingPayload = `${event_type}:${requestId}:${userId}:${walletId}:${transactionId}:${transaction.type}:${transaction.time}:${responseCode}:${timestamp}`;
const computedSig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(hashingPayload).digest('base64');
if (computedSig !== req.headers['nomba-signature']) return res.status(401).send('Invalid signature');
```

**Webhook Payload Structure:**
```json
{
  "event_type": "payment_success",
  "requestId": "uuid",
  "data": {
    "merchant": { "walletId", "walletBalance", "userId" },
    "transaction": {
      "transactionId",
      "type": "online_checkout|vact_transfer|transfer",
      "transactionAmount",
      "fee",
      "time",
      "responseCode"
    },
    "customer": { "bankCode", "senderName", "accountNumber" },
    "order": { "orderReference", "amount", "currency" }
  }
}
```

### 2.3 Database Schema Updates

#### New Model: `VirtualAccount`

```typescript
{
  userId: String, // Supabase ID
  accountRef: String, // Unique reference (OBEY-USER-XXX)
  accountName: String,
  bankAccountNumber: String, // Nomba-generated account number
  bankName: String, // e.g., "Amucha MFB"
  currency: String, // "NGN"
  expectedAmount: Number, // Optional
  expiryDate: Date, // Optional (for dynamic accounts)
  expired: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Update Model: `Transaction`

Add fields:
```typescript
{
  nombaTransactionId: String, // Nomba's transactionId
  orderReference: String, // Checkout order reference
  sessionId: String, // For transfer tracking
  paymentMethod: String, // "card", "bank_transfer", "virtual_account"
  webhookVerified: Boolean, // True if confirmed via webhook
  idempotencyKey: String // For transfer requests
}
```

#### New Model: `WebhookEvent` (Audit Trail)

```typescript
{
  eventId: String, // requestId from Nomba
  eventType: String, // payment_success, payment_failed, etc.
  transactionId: String,
  amount: Number,
  status: String,
  rawPayload: Object, // Full webhook payload
  processedAt: Date,
  signatureValid: Boolean
}
```

### 2.4 Frontend Integration

#### A. Checkout Flow

**Component:** `src/components/PaymentCheckout.tsx`

**Flow:**
1. User enters amount (e.g., ₦10,000)
2. Click "Fund Wallet" → Call `POST /api/payments/checkout`
3. Receive `checkoutLink`
4. `window.location.href = checkoutLink` (redirect to Nomba)
5. User completes payment on Nomba's page
6. Nomba redirects to `callbackUrl?orderReference=XXX`
7. Callback page polls `GET /api/payments/verify/:orderReference` every 2s
8. On `status === "SUCCESS"`, show success animation and update balance

#### B. Virtual Account Display

**Component:** `src/components/VirtualAccountCard.tsx`

**Display:**
- Bank name (e.g., "Amucha MFB")
- Account number (with copy button)
- Account name
- "Funds sent to this account will credit your wallet"
- Optional: QR code for account number

#### C. Withdrawal Flow

**Component:** `src/components/WithdrawalForm.tsx`

**Flow:**
1. User enters amount, account number, bank code
2. Click "Verify Account" → Call `POST /v1/transfers/bank/lookup`
3. Display recipient name for confirmation
4. User confirms → Call `POST /api/payments/withdraw`
5. Show processing screen (status: `PENDING_BILLING`)
6. Listen for webhook or poll transaction status
7. Show success/failure animation

#### D. Webhook Status Indicator

**Component:** `src/components/TransactionStatus.tsx`

**Display:**
- Real-time status updates (Processing → Success/Failed)
- Webhook verification badge
- Transaction timeline (Initiated → Verified → Settled)

### 2.5 Environment Variables

Add to `.env`:

```bash
# Nomba Production
NOMBA_BASE_URL=https://api.nomba.com
NOMBA_PARENT_ACCOUNT_ID=f666ef9b-888e-4799-85ce-acb505b28023
NOMBA_SUB_ACCOUNT_ID=a94ac356-e554-4290-8fcd-b926a790f1f6
NOMBA_CLIENT_ID=e5e85b13-f560-4643-814e-c87435dbbc15
NOMBA_CLIENT_SECRET=8/doS7Q3w77EANpk3vpgSrc05hhOiRWp3eBs01sXyZ1AmovtZUXlmrxie+xnEF2tR4q79t0IFufMD1d4JrkT8g==
NOMBA_WEBHOOK_SECRET=<from_dashboard>

# Nomba Sandbox (for testing)
NOMBA_SANDBOX_BASE_URL=https://sandbox.nomba.com
NOMBA_SANDBOX_CLIENT_ID=706df6c4-b8bb-4130-88c4-d21b052f8631
NOMBA_SANDBOX_CLIENT_SECRET=k8UobYk3APgOoxUnNL7VpuxzwTsH4LsXtydfjcHs8RH0YISBB4OMqJsaafG+U8fWETu9YZ96bNXE+DelCDuMPw==
```

**Security Note:** Never expose `NOMBA_CLIENT_SECRET` to frontend. All Nomba API calls must go through backend.

---

## 3. Migration Strategy

### Phase 1: Dual-Provider Support (Week 1)

**Goal:** Run Nomba alongside Interswitch without breaking existing flows.

**Tasks:**
1. Create `server/services/nomba.ts` with token management
2. Add Nomba routes alongside existing Interswitch routes
3. Feature flag: `PAYMENT_PROVIDER=nomba|interswitch`
4. Test checkout flow in sandbox
5. Deploy to staging

**Rollback:** Switch feature flag back to `interswitch` if issues arise.

### Phase 2: Virtual Accounts & Webhooks (Week 2)

**Goal:** Enable virtual account provisioning and webhook handling.

**Tasks:**
1. Create `VirtualAccount` model and routes
2. Implement webhook handler at `/api/webhooks/nomba`
3. Add signature verification
4. Update `Transaction` model with Nomba fields
5. Test virtual account creation in sandbox
6. Submit webhook URL to Nomba: `https://obey-kappa.vercel.app/api/webhooks/nomba`

**Testing:**
- Create virtual account → Fund it → Verify webhook received → Check balance update

### Phase 3: Bank Transfer Migration (Week 3)

**Goal:** Replace Interswitch withdrawals with Nomba transfers.

**Tasks:**
1. Implement bank lookup endpoint
2. Update withdrawal flow to use Nomba
3. Add idempotency keys to prevent duplicate transfers
4. Handle `PENDING_BILLING` status with polling
5. Test end-to-end withdrawal flow

**Testing:**
- Withdraw to test bank account → Verify webhook → Check transaction status

### Phase 4: Production Cutover (Week 4)

**Goal:** Switch to Nomba as primary provider.

**Tasks:**
1. Switch feature flag to `PAYMENT_PROVIDER=nomba`
2. Monitor transaction success rates
3. Keep Interswitch as fallback for 2 weeks
4. Update documentation
5. Train support team on Nomba transaction IDs

**Success Metrics:**
- 99%+ transaction success rate
- < 5s average payment confirmation time
- 100% webhook delivery rate

---

## 4. Error Handling & Edge Cases

### 4.1 Token Expiry

**Scenario:** Access token expires mid-request.

**Solution:**
```typescript
async function nombaRequest(url, options) {
  let token = await getAccessToken();
  let response = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token}` } });
  
  if (response.status === 401) {
    token = await refreshAccessToken();
    response = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token}` } });
  }
  
  return response;
}
```

### 4.2 Webhook Duplication

**Scenario:** Nomba retries webhook, causing duplicate balance credits.

**Solution:**
- Check `WebhookEvent` model for duplicate `eventId` before processing
- Use `requestId` as idempotency key
- Return `200 OK` immediately to prevent retries

```typescript
const existing = await WebhookEvent.findOne({ eventId: payload.requestId });
if (existing) return res.status(200).send('Already processed');
```

### 4.3 Transfer Failures

**Scenario:** Bank transfer fails after user balance deducted.

**Solution:**
- Listen for `payout_failed` webhook
- Auto-refund user balance
- Create reversal transaction record
- Notify user via email/push notification

```typescript
if (eventType === 'payout_failed') {
  await User.findByIdAndUpdate(userId, { $inc: { balance: amount } });
  await Transaction.create({
    userId,
    title: 'Withdrawal Refund',
    type: 'Credit',
    amount,
    status: 'Success',
    category: 'System'
  });
}
```

### 4.4 Checkout Abandonment

**Scenario:** User redirects to Nomba but doesn't complete payment.

**Solution:**
- Create transaction record with `status: 'Pending'` on checkout creation
- If no webhook received after 30 minutes, mark as `Expired`
- Allow user to retry with new checkout order

### 4.5 Rate Limiting

**Scenario:** Exceed Nomba's rate limit (5 transfers to same recipient per minute).

**Solution:**
- Implement client-side rate limiting
- Queue transfer requests
- Return user-friendly error: "Please wait 60 seconds before retrying"

---

## 5. Security Considerations

### 5.1 Credential Storage

- Store `NOMBA_CLIENT_SECRET` in environment variables (never in code)
- Use Vercel's encrypted environment variables for production
- Rotate credentials every 90 days
- Never log sensitive data (client secrets, access tokens)

### 5.2 Webhook Security

- Always verify `nomba-signature` header
- Use HTTPS for webhook endpoint (enforced by Vercel)
- Validate payload structure before processing
- Reject requests with missing or invalid signatures

### 5.3 PCI Compliance

- Nomba handles card data (PCI-DSS compliant)
- Obey never touches raw card numbers
- Use `checkoutLink` redirect to offload PCI scope
- Store only `orderReference` and `transactionId` (not card data)

### 5.4 Idempotency

- Generate unique `merchantTxRef` for each transfer (UUID v4)
- Include `X-Idempotent-key` header for all transfer requests
- Prevent duplicate transfers on network retries

---

## 6. Testing Strategy

### 6.1 Sandbox Testing

**Nomba Sandbox Base URL:** `https://sandbox.nomba.com`

**Test Credentials:**
- Client ID: `706df6c4-b8bb-4130-88c4-d21b052f8631`
- Client Secret: `k8UobYk3APgOoxUnNL7VpuxzwTsH4LsXtydfjcHs8RH0YISBB4OMqJsaafG+U8fWETu9YZ96bNXE+DelCDuMPw==`

**Test Scenarios:**
1. Create checkout order → Complete payment → Verify webhook
2. Create virtual account → Fund it → Check balance update
3. Initiate bank transfer → Verify account lookup → Confirm webhook
4. Test webhook signature validation with invalid signatures
5. Simulate `payment_failed` webhook → Verify refund logic

**Test Cards (from Nomba docs):**
- Success: `4084084084084081`
- Insufficient Funds: `4084084084084099`
- Expired Card: `4084084084084107`

### 6.2 Integration Tests

**File:** `server/services/nomba.test.ts`

```typescript
describe('Nomba Service', () => {
  it('should obtain access token', async () => {
    const token = await getAccessToken();
    expect(token).toBeDefined();
  });

  it('should create checkout order', async () => {
    const order = await createCheckoutOrder({
      amount: 1000,
      email: 'test@example.com',
      callbackUrl: 'https://example.com/callback'
    });
    expect(order.checkoutLink).toBeDefined();
    expect(order.orderReference).toBeDefined();
  });

  it('should verify successful transaction', async () => {
    const result = await verifyTransaction('order-ref-123');
    expect(result.status).toBe('SUCCESS');
  });
});
```

### 6.3 End-to-End Tests

**Tool:** Playwright or Cypress

**Flow:**
1. Login as test user
2. Click "Fund Wallet" → Enter ₦5,000
3. Redirect to Nomba checkout
4. Complete payment with test card
5. Verify redirect back to Obey
6. Check balance updated to ₦5,000
7. Verify transaction appears in history

---

## 7. Monitoring & Observability

### 7.1 Logging

**Structured Logs:**
```typescript
console.log(JSON.stringify({
  event: 'checkout_created',
  userId: 'supabase-id',
  orderReference: 'uuid',
  amount: 10000,
  timestamp: new Date().toISOString()
}));
```

**Critical Events to Log:**
- Token refresh failures
- Webhook signature mismatches
- Transaction verification failures
- Transfer status changes (`PENDING_BILLING` → `SUCCESS`/`REFUND`)

### 7.2 Metrics

**Track:**
- Checkout success rate (target: > 95%)
- Average payment confirmation time (target: < 5s)
- Webhook delivery rate (target: 100%)
- Transfer failure rate (target: < 2%)

**Tools:**
- Vercel Analytics (frontend performance)
- MongoDB Atlas Metrics (database queries)
- Custom dashboard for Nomba transaction stats

### 7.3 Alerts

**Trigger Alerts For:**
- Token refresh failures (> 3 in 5 minutes)
- Webhook signature validation failures
- Transaction verification timeouts
- Transfer failures exceeding threshold

**Channels:**
- Email (critical)
- Slack (warnings)
- SMS (system down)

---

## 8. Rollback Plan

### 8.1 Immediate Rollback

**Trigger:** > 10% transaction failure rate or critical bug.

**Steps:**
1. Switch `PAYMENT_PROVIDER=interswitch` in environment
2. Redeploy to Vercel
3. Notify users of temporary service degradation
4. Investigate issue in staging

### 8.2 Partial Rollback

**Trigger:** Specific feature broken (e.g., withdrawals).

**Steps:**
1. Disable affected feature flag (e.g., `WITHDRAWALS_PROVIDER=interswitch`)
2. Keep other Nomba features active
3. Fix issue in isolation
4. Re-enable when resolved

### 8.3 Data Rollback

**Scenario:** Incorrect balance updates due to webhook bug.

**Steps:**
1. Query `WebhookEvent` model for affected time range
2. Reverse incorrect transactions
3. Recalculate user balances
4. Notify affected users

---

## 9. Future Enhancements

### 9.1 Recurring Payments

**Feature:** Subscription billing via tokenized cards.

**Implementation:**
1. Set `tokenizeCard: true` on checkout order
2. Save `tokenKey` from webhook payload
3. Charge tokenized card via `POST /v1/checkout/tokenized-card/charge`
4. Create recurring transaction schedule

### 9.2 Split Payments

**Feature:** Distribute payments across multiple accounts (e.g., merchant + platform fee).

**Implementation:**
```json
{
  "splitRequest": {
    "splitType": "PERCENTAGE",
    "splitList": [
      { "accountId": "merchant-sub-account", "value": "90" },
      { "accountId": "platform-sub-account", "value": "10" }
    ]
  }
}
```

### 9.3 Multi-Currency Support

**Feature:** Accept USD, EUR, GBP payments.

**Requirements:**
- Request currency activation from Nomba
- Update frontend to display currency selector
- Handle exchange rates in backend

### 9.4 AI-Powered Insights

**Feature:** Use Gemini AI to analyze transaction patterns.

**Use Cases:**
- Fraud detection (unusual transaction amounts)
- Spending categorization
- Personalized financial advice
- Predictive balance forecasting

---

## 10. Success Criteria

### Technical Metrics
- ✅ 99%+ checkout success rate
- ✅ < 5s average payment confirmation
- ✅ 100% webhook delivery and processing
- ✅ < 1% transfer failure rate
- ✅ Zero duplicate transactions

### Business Metrics
- ✅ 50% reduction in manual reconciliation
- ✅ 30% increase in funding success rate
- ✅ 20% faster withdrawal processing
- ✅ Support for virtual account funding (new feature)

### User Experience
- ✅ Seamless checkout flow (3 clicks to payment)
- ✅ Real-time transaction status updates
- ✅ Dedicated virtual accounts for power users
- ✅ Clear error messages and retry flows

---

## 11. Timeline & Milestones

| Week | Milestone | Deliverables |
|------|-----------|--------------|
| 1 | Dual-Provider Support | Nomba service layer, checkout flow, feature flag |
| 2 | Virtual Accounts & Webhooks | Virtual account model, webhook handler, signature validation |
| 3 | Bank Transfer Migration | Withdrawal flow, account lookup, idempotency |
| 4 | Production Cutover | Switch to Nomba, monitor, document |
| 5 | Optimization | Performance tuning, error handling, monitoring |

---

## 12. Resources

### Documentation
- [Nomba API Reference](https://developer.nomba.com/nomba-api-reference/introduction)
- [Nomba Webhooks Guide](https://developer.nomba.com/docs/api-basics/webhook)
- [Nomba Error Codes](https://developer.nomba.com/docs/api-basics/error-codes)
- [Nomba Sandbox Testing](https://developer.nomba.com/docs/products/accept-payment/sandbox-testing)

### Support
- Nomba Developer Support: `docs@nomba.com`
- Hackathon Slack: `#nomba-hackathon-2026`
- API Status: `https://status.nomba.com`

### Tools
- Postman Collection: [Nomba API](https://developer.nomba.com/nomba-api-reference/openapi.json)
- Webhook Debugging: Nomba Dashboard → Developer → Webhook Setup

---

## 13. Conclusion

This integration plan provides a comprehensive roadmap for migrating Obey's payment infrastructure from Interswitch to Nomba. The phased approach minimizes risk, allows for thorough testing, and ensures zero downtime during cutover.

**Key Wins:**
- Modern, developer-friendly API
- Real-time webhook notifications
- Virtual account provisioning
- Enhanced security (HMAC signature validation)
- Better error handling and idempotency

**Next Steps:**
1. Review and approve this technical plan
2. Set up Nomba sandbox credentials in `.env`
3. Begin Phase 1 implementation (token management + checkout)
4. Schedule daily standups to track progress
5. Demo at hackathon presentation

---

**Document Version:** 1.0  
**Last Updated:** 2026-06-26  
**Author:** TRICODE PRO (Luke Okagha)  
**Status:** Ready for Implementation
