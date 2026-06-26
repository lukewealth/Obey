# NOMBA INTEGRATION - AGENTIC INSTRUCTIONS

> **For AI Coding Assistants:** This document provides step-by-step instructions for implementing Nomba payment infrastructure in the Obey fintech platform. Follow these instructions sequentially. Each section includes code snippets, decision points, and verification steps.

---

## QUICK REFERENCE

### Account Credentials
```
Parent Account ID: f666ef9b-888e-4799-85ce-acb505b28023
Sub-Account ID: a94ac356-e554-4290-8fcd-b926a790f1f6

Production:
  Client ID: e5e85b13-f560-4643-814e-c87435dbbc15
  Client Secret: 8/doS7Q3w77EANpk3vpgSrc05hhOiRWp3eBs01sXyZ1AmovtZUXlmrxie+xnEF2tR4q79t0IFufMD1d4JrkT8g==
  Base URL: https://api.nomba.com

Sandbox:
  Client ID: 706df6c4-b8bb-4130-88c4-d21b052f8631
  Client Secret: k8UobYk3APgOoxUnNL7VpuxzwTsH4LsXtydfjcHs8RH0YISBB4OMqJsaafG+U8fWETu9YZ96bNXE+DelCDuMPw==
  Base URL: https://sandbox.nomba.com
```

### API Endpoints Summary
```
Authentication:
  POST /v1/auth/token/issue          - Get access token
  POST /v1/auth/token/refresh        - Refresh expired token
  POST /v1/auth/token/revoke         - Revoke token

Checkout:
  POST /v1/checkout/order            - Create checkout order
  GET  /v1/checkout/transaction      - Get checkout details (prod only)
  POST /v1/checkout/order/cancel     - Cancel order
  POST /v1/checkout/order/refund     - Refund transaction

Virtual Accounts:
  POST /v1/accounts/virtual          - Create virtual account
  GET  /v1/accounts/virtual/:number  - Lookup virtual account
  PUT  /v1/accounts/suspend/:id      - Suspend virtual account

Transfers:
  GET  /v1/transfers/bank            - Fetch bank codes
  POST /v1/transfers/bank/lookup     - Verify account number
  POST /v2/transfers/bank            - Initiate bank transfer
  POST /v2/transfers/wallet          - Wallet-to-wallet transfer

Transactions:
  GET  /v1/transactions/accounts/single - Verify transaction by orderReference
  GET  /v1/transactions/accounts     - List transactions
```

### Common Headers
```typescript
{
  'Authorization': 'Bearer <access_token>',
  'Content-Type': 'application/json',
  'accountId': '<sub_account_id>',
  'X-Idempotent-key': '<uuid>' // For transfers
}
```

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Foundation (Days 1-3)
- [ ] Create `server/services/nomba.ts` with token management
- [ ] Add Nomba environment variables to `.env`
- [ ] Implement `getAccessToken()` with caching
- [ ] Implement `refreshAccessToken()` with auto-retry
- [ ] Test authentication in sandbox
- [ ] Create checkout order endpoint
- [ ] Test checkout flow end-to-end

### Phase 2: Virtual Accounts (Days 4-6)
- [ ] Create `VirtualAccount` Mongoose model
- [ ] Implement virtual account creation endpoint
- [ ] Add virtual account display component
- [ ] Test virtual account funding
- [ ] Verify webhook reception

### Phase 3: Webhooks (Days 7-9)
- [ ] Create webhook endpoint at `/api/webhooks/nomba`
- [ ] Implement HMAC signature verification
- [ ] Create `WebhookEvent` model for audit trail
- [ ] Handle `payment_success` event
- [ ] Handle `payment_failed` event
- [ ] Handle `payout_success` event
- [ ] Handle `payout_failed` event
- [ ] Test webhook signature validation

### Phase 4: Transfers (Days 10-12)
- [ ] Implement bank code fetching
- [ ] Implement account lookup endpoint
- [ ] Create bank transfer endpoint with idempotency
- [ ] Update withdrawal flow to use Nomba
- [ ] Handle `PENDING_BILLING` status
- [ ] Test transfer success and failure scenarios

### Phase 5: Production (Days 13-14)
- [ ] Switch to production credentials
- [ ] Submit webhook URL to Nomba dashboard
- [ ] Monitor first 10 production transactions
- [ ] Document any issues
- [ ] Prepare rollback plan

---

## STEP-BY-STEP IMPLEMENTATION

### Step 1: Environment Setup

**Action:** Add these variables to `.env`

```bash
# Nomba Production Credentials
NOMBA_BASE_URL=https://api.nomba.com
NOMBA_PARENT_ACCOUNT_ID=f666ef9b-888e-4799-85ce-acb505b28023
NOMBA_SUB_ACCOUNT_ID=a94ac356-e554-4290-8fcd-b926a790f1f6
NOMBA_CLIENT_ID=e5e85b13-f560-4643-814e-c87435dbbc15
NOMBA_CLIENT_SECRET=8/doS7Q3w77EANpk3vpgSrc05hhOiRWp3eBs01sXyZ1AmovtZUXlmrxie+xnEF2tR4q79t0IFufMD1d4JrkT8g==
NOMBA_WEBHOOK_SECRET=<get_from_dashboard_after_setup>

# Nomba Sandbox Credentials (for testing)
NOMBA_SANDBOX_BASE_URL=https://sandbox.nomba.com
NOMBA_SANDBOX_CLIENT_ID=706df6c4-b8bb-4130-88c4-d21b052f8631
NOMBA_SANDBOX_CLIENT_SECRET=k8UobYk3APgOoxUnNL7VpuxzwTsH4LsXtydfjcHs8RH0YISBB4OMqJsaafG+U8fWETu9YZ96bNXE+DelCDuMPw==

# Feature Flag
PAYMENT_PROVIDER=nomba # or 'interswitch' for fallback
```

**Verification:** Run `node -e "console.log(process.env.NOMBA_CLIENT_ID)"` after loading dotenv.

---

### Step 2: Create Nomba Service Layer

**File:** `server/services/nomba.ts`

```typescript
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const {
  NOMBA_BASE_URL,
  NOMBA_PARENT_ACCOUNT_ID,
  NOMBA_SUB_ACCOUNT_ID,
  NOMBA_CLIENT_ID,
  NOMBA_CLIENT_SECRET,
  NOMBA_WEBHOOK_SECRET,
} = process.env;

// Token cache
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;
let cachedRefreshToken: string | null = null;

/**
 * Obtain access token from Nomba
 * Caches token and auto-refreshes when expired
 */
export async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 5-minute buffer)
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 300000) {
    return cachedToken;
  }

  // If we have a refresh token, try refreshing first
  if (cachedRefreshToken) {
    try {
      return await refreshAccessToken();
    } catch (error) {
      console.log('[NOMBA] Refresh failed, obtaining new token');
      cachedRefreshToken = null;
    }
  }

  // Obtain new token
  try {
    const response = await axios.post(
      `${NOMBA_BASE_URL}/v1/auth/token/issue`,
      {
        grant_type: 'client_credentials',
        client_id: NOMBA_CLIENT_ID,
        client_secret: NOMBA_CLIENT_SECRET,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'accountId': NOMBA_PARENT_ACCOUNT_ID,
        },
      }
    );

    if (response.data.code !== '00') {
      throw new Error(`Authentication failed: ${response.data.description}`);
    }

    cachedToken = response.data.data.access_token;
    cachedRefreshToken = response.data.data.refresh_token;
    tokenExpiry = new Date(response.data.data.expiresAt).getTime();

    console.log('[NOMBA] Access token obtained successfully');
    return cachedToken!;
  } catch (error: any) {
    console.error('[NOMBA] Token acquisition failed:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Nomba');
  }
}

/**
 * Refresh expired access token
 */
export async function refreshAccessToken(): Promise<string> {
  if (!cachedRefreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(
      `${NOMBA_BASE_URL}/v1/auth/token/refresh`,
      {
        grant_type: 'refresh_token',
        refresh_token: cachedRefreshToken,
      },
      {
        headers: {
          'Authorization': `Bearer ${cachedToken}`,
          'Content-Type': 'application/json',
          'accountId': NOMBA_PARENT_ACCOUNT_ID,
        },
      }
    );

    if (response.data.code !== '00') {
      throw new Error(`Token refresh failed: ${response.data.description}`);
    }

    cachedToken = response.data.data.access_token;
    cachedRefreshToken = response.data.data.refresh_token;
    tokenExpiry = new Date(response.data.data.expiresAt).getTime();

    console.log('[NOMBA] Access token refreshed successfully');
    return cachedToken!;
  } catch (error: any) {
    console.error('[NOMBA] Token refresh failed:', error.response?.data || error.message);
    // Clear cached tokens to force re-authentication
    cachedToken = null;
    cachedRefreshToken = null;
    tokenExpiry = null;
    throw error;
  }
}

/**
 * Make authenticated request to Nomba API
 * Auto-retries on 401 (token expired)
 */
export async function nombaRequest(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
  options?: { idempotencyKey?: string; useParentAccount?: boolean }
): Promise<any> {
  const token = await getAccessToken();
  const accountId = options?.useParentAccount ? NOMBA_PARENT_ACCOUNT_ID : NOMBA_SUB_ACCOUNT_ID;

  const headers: any = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'accountId': accountId,
  };

  if (options?.idempotencyKey) {
    headers['X-Idempotent-key'] = options.idempotencyKey;
  }

  try {
    const response = await axios({
      method,
      url: `${NOMBA_BASE_URL}${endpoint}`,
      headers,
      data,
    });

    // Check response code (Nomba returns 200 even on business errors)
    if (response.data.code && response.data.code !== '00') {
      throw new Error(`Nomba API error: [${response.data.code}] ${response.data.description}`);
    }

    return response.data;
  } catch (error: any) {
    // Auto-retry on 401 (token expired)
    if (error.response?.status === 401) {
      console.log('[NOMBA] Token expired, refreshing and retrying...');
      const newToken = await refreshAccessToken();
      headers['Authorization'] = `Bearer ${newToken}`;

      const retryResponse = await axios({
        method,
        url: `${NOMBA_BASE_URL}${endpoint}`,
        headers,
        data,
      });

      if (retryResponse.data.code && retryResponse.data.code !== '00') {
        throw new Error(`Nomba API error: [${retryResponse.data.code}] ${retryResponse.data.description}`);
      }

      return retryResponse.data;
    }

    throw error;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: any,
  signature: string,
  timestamp: string
): boolean {
  if (!NOMBA_WEBHOOK_SECRET) {
    console.warn('[NOMBA] Webhook secret not configured');
    return false;
  }

  const { event_type, requestId, data } = payload;
  const { merchant, transaction } = data;

  let responseCode = transaction.responseCode || '';
  if (responseCode === 'null') responseCode = '';

  const hashingPayload = `${event_type}:${requestId}:${merchant.userId}:${merchant.walletId}:${transaction.transactionId}:${transaction.type}:${transaction.time}:${responseCode}:${timestamp}`;

  const hmac = crypto.createHmac('sha256', NOMBA_WEBHOOK_SECRET);
  hmac.update(hashingPayload);
  const computedSignature = hmac.digest('base64');

  return computedSignature === signature;
}

/**
 * Create checkout order
 */
export async function createCheckoutOrder(params: {
  amount: number;
  currency?: string;
  email?: string;
  callbackUrl?: string;
  userId?: string;
  metadata?: Record<string, string>;
}): Promise<{ checkoutLink: string; orderReference: string }> {
  const orderData: any = {
    order: {
      amount: params.amount.toFixed(2),
      currency: params.currency || 'NGN',
      accountId: NOMBA_SUB_ACCOUNT_ID,
    },
  };

  if (params.email) orderData.order.customerEmail = params.email;
  if (params.callbackUrl) orderData.order.callbackUrl = params.callbackUrl;
  if (params.userId) orderData.order.customerId = params.userId;
  if (params.metadata) orderData.order.orderMetaData = params.metadata;

  const response = await nombaRequest('POST', '/v1/checkout/order', orderData);

  return {
    checkoutLink: response.data.checkoutLink,
    orderReference: response.data.orderReference,
  };
}

/**
 * Verify transaction by order reference
 */
export async function verifyTransaction(orderReference: string): Promise<any> {
  const response = await nombaRequest(
    'GET',
    `/v1/transactions/accounts/single?orderReference=${orderReference}`
  );

  return response.data;
}

/**
 * Create virtual account
 */
export async function createVirtualAccount(params: {
  accountRef: string;
  accountName: string;
  currency?: string;
  expectedAmount?: number;
  expiryDate?: string;
  bvn?: string;
}): Promise<any> {
  const data: any = {
    accountRef: params.accountRef,
    accountName: params.accountName,
    currency: params.currency || 'NGN',
  };

  if (params.expectedAmount) data.expectedAmount = params.expectedAmount;
  if (params.expiryDate) data.expiryDate = params.expiryDate;
  if (params.bvn) data.bvn = params.bvn;

  const response = await nombaRequest('POST', '/v1/accounts/virtual', data);
  return response.data;
}

/**
 * Fetch bank codes
 */
export async function fetchBankCodes(): Promise<any[]> {
  const response = await nombaRequest('GET', '/v1/transfers/bank');
  return response.data;
}

/**
 * Lookup bank account
 */
export async function lookupBankAccount(accountNumber: string, bankCode: string): Promise<any> {
  const response = await nombaRequest('POST', '/v1/transfers/bank/lookup', {
    accountNumber,
    bankCode,
  });
  return response.data;
}

/**
 * Initiate bank transfer
 */
export async function initiateBankTransfer(params: {
  amount: number;
  accountNumber: string;
  accountName: string;
  bankCode: string;
  merchantTxRef: string;
  senderName?: string;
}): Promise<any> {
  const idempotencyKey = crypto.randomUUID();

  const response = await nombaRequest(
    'POST',
    '/v2/transfers/bank',
    {
      amount: params.amount,
      accountNumber: params.accountNumber,
      accountName: params.accountName,
      bankCode: params.bankCode,
      merchantTxRef: params.merchantTxRef,
      senderName: params.senderName || 'Obey Fintech',
    },
    { idempotencyKey }
  );

  return response.data;
}
```

**Verification:**
```bash
npm run build
# Should compile without errors
```

---

### Step 3: Create Virtual Account Model

**File:** `server/models/VirtualAccount.ts`

```typescript
import mongoose from 'mongoose';

const VirtualAccountSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Supabase ID
  accountRef: { type: String, required: true, unique: true },
  accountName: { type: String, required: true },
  bankAccountNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  currency: { type: String, default: 'NGN' },
  expectedAmount: { type: Number },
  expiryDate: { type: Date },
  expired: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  nombaAccountId: { type: String }, // Nomba's internal account ID
}, { timestamps: true });

export const VirtualAccount = mongoose.models.VirtualAccount || 
  mongoose.model('VirtualAccount', VirtualAccountSchema);
```

**Action:** Register model in `server/models/index.ts` (if exists) or import directly where needed.

---

### Step 4: Create Webhook Event Model

**File:** `server/models/WebhookEvent.ts`

```typescript
import mongoose from 'mongoose';

const WebhookEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true }, // requestId from Nomba
  eventType: { type: String, required: true }, // payment_success, payment_failed, etc.
  transactionId: { type: String, required: true },
  amount: { type: Number },
  currency: { type: String },
  status: { type: String },
  userId: { type: String }, // Extracted from order metadata
  orderReference: { type: String },
  rawPayload: { type: mongoose.Schema.Types.Mixed, required: true },
  processedAt: { type: Date, default: Date.now },
  signatureValid: { type: Boolean, required: true },
}, { timestamps: true });

export const WebhookEvent = mongoose.models.WebhookEvent || 
  mongoose.model('WebhookEvent', WebhookEventSchema);
```

---

### Step 5: Update Transaction Model

**File:** `server/models/Transaction.ts`

**Action:** Add these fields to existing schema:

```typescript
// Add to TransactionSchema
nombaTransactionId: { type: String, index: true }, // Nomba's transactionId
orderReference: { type: String, index: true }, // Checkout order reference
sessionId: { type: String }, // For transfer tracking
paymentMethod: { type: String, enum: ['card', 'bank_transfer', 'virtual_account', 'wallet'] },
webhookVerified: { type: Boolean, default: false },
idempotencyKey: { type: String },
```

---

### Step 6: Create Webhook Handler

**File:** `server/routes/webhooks.ts`

```typescript
import express, { Request, Response } from 'express';
import { verifyWebhookSignature } from '../services/nomba';
import { WebhookEvent } from '../models/WebhookEvent';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import { VirtualAccount } from '../models/VirtualAccount';

const router = express.Router();

router.post('/nomba', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['nomba-signature'] as string;
    const timestamp = req.headers['nomba-timestamp'] as string;
    const payload = req.body;

    // Verify signature
    const isValid = verifyWebhookSignature(payload, signature, timestamp);
    
    if (!isValid) {
      console.error('[WEBHOOK] Invalid signature');
      return res.status(401).send('Invalid signature');
    }

    // Check for duplicate event
    const existing = await WebhookEvent.findOne({ eventId: payload.requestId });
    if (existing) {
      console.log('[WEBHOOK] Duplicate event ignored:', payload.requestId);
      return res.status(200).send('Already processed');
    }

    // Log webhook event
    const webhookEvent = new WebhookEvent({
      eventId: payload.requestId,
      eventType: payload.event_type,
      transactionId: payload.data.transaction.transactionId,
      amount: payload.data.transaction.transactionAmount,
      status: payload.data.transaction.responseCode,
      rawPayload: payload,
      signatureValid: isValid,
    });

    // Extract userId from order metadata (if available)
    const orderMetadata = payload.data.order?.orderMetaData;
    if (orderMetadata?.userId) {
      webhookEvent.userId = orderMetadata.userId;
      webhookEvent.orderReference = payload.data.order.orderReference;
    }

    await webhookEvent.save();

    // Process event based on type
    switch (payload.event_type) {
      case 'payment_success':
        await handlePaymentSuccess(payload);
        break;
      case 'payment_failed':
        await handlePaymentFailed(payload);
        break;
      case 'payout_success':
        await handlePayoutSuccess(payload);
        break;
      case 'payout_failed':
        await handlePayoutFailed(payload);
        break;
      default:
        console.log('[WEBHOOK] Unhandled event type:', payload.event_type);
    }

    // Return 200 immediately to prevent retries
    res.status(200).send('OK');
  } catch (error: any) {
    console.error('[WEBHOOK] Processing error:', error.message);
    // Still return 200 to prevent retries, but log the error
    res.status(200).send('Error logged');
  }
});

async function handlePaymentSuccess(payload: any) {
  const { data } = payload;
  const orderRef = data.order?.orderReference;
  const amount = data.transaction.transactionAmount;
  const fee = data.transaction.fee || 0;
  const userId = data.order?.orderMetaData?.userId || data.order?.customerId;

  if (!userId) {
    console.error('[WEBHOOK] Missing userId in payment_success');
    return;
  }

  // Update or create transaction record
  const transaction = await Transaction.findOne({ 
    $or: [
      { orderReference: orderRef },
      { requestReference: data.transaction.merchantTxRef }
    ]
  });

  if (transaction) {
    transaction.status = 'Success';
    transaction.nombaTransactionId = data.transaction.transactionId;
    transaction.webhookVerified = true;
    transaction.fee = fee;
    await transaction.save();
  } else {
    // Create new transaction (e.g., virtual account funding)
    await Transaction.create({
      id: data.transaction.transactionId,
      userId,
      title: 'Wallet Funding',
      category: 'Transfer',
      type: 'Credit',
      amount,
      fee,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Success',
      nombaTransactionId: data.transaction.transactionId,
      orderReference: orderRef,
      paymentMethod: data.order?.paymentMethod || 'virtual_account',
      webhookVerified: true,
    });
  }

  // Update user balance
  await User.findOneAndUpdate(
    { $or: [{ supabaseId: userId }, { email: userId }] },
    { $inc: { balance: amount } }
  );

  console.log(`[WEBHOOK] Payment success processed: ${amount} credited to ${userId}`);
}

async function handlePaymentFailed(payload: any) {
  const { data } = payload;
  const orderRef = data.order?.orderReference;

  // Update transaction status
  const transaction = await Transaction.findOne({ orderReference: orderRef });
  if (transaction) {
    transaction.status = 'Failed';
    transaction.nombaTransactionId = data.transaction.transactionId;
    transaction.webhookVerified = true;
    await transaction.save();
  }

  console.log(`[WEBHOOK] Payment failed: ${orderRef}`);
}

async function handlePayoutSuccess(payload: any) {
  const { data } = payload;
  const txRef = data.transaction.merchantTxRef;

  // Update withdrawal transaction
  const transaction = await Transaction.findOne({ requestReference: txRef });
  if (transaction) {
    transaction.status = 'Success';
    transaction.nombaTransactionId = data.transaction.transactionId;
    transaction.sessionId = data.transaction.sessionId;
    transaction.webhookVerified = true;
    await transaction.save();
  }

  console.log(`[WEBHOOK] Payout success: ${txRef}`);
}

async function handlePayoutFailed(payload: any) {
  const { data } = payload;
  const txRef = data.transaction.merchantTxRef;
  const amount = data.transaction.transactionAmount;

  // Find withdrawal transaction
  const transaction = await Transaction.findOne({ requestReference: txRef });
  if (transaction) {
    transaction.status = 'Failed';
    transaction.nombaTransactionId = data.transaction.transactionId;
    transaction.webhookVerified = true;
    await transaction.save();

    // Refund user balance
    await User.findOneAndUpdate(
      { $or: [{ supabaseId: transaction.userId }, { email: transaction.userId }] },
      { $inc: { balance: amount } }
    );

    // Create refund transaction
    await Transaction.create({
      id: `REFUND-${Date.now()}`,
      userId: transaction.userId,
      title: 'Withdrawal Refund',
      category: 'System',
      type: 'Credit',
      amount,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Success',
      requestReference: `REF-${txRef}`,
    });

    console.log(`[WEBHOOK] Payout failed, refunded ${amount} to ${transaction.userId}`);
  }
}

export default router;
```

**Action:** Register webhook routes in `server/index.ts`:

```typescript
import webhookRoutes from './routes/webhooks';
// ... other imports

router.use('/webhooks', webhookRoutes);
```

---

### Step 7: Create Payment Routes

**File:** `server/routes/nomba_payments.ts`

```typescript
import express, { Request, Response } from 'express';
import { z } from 'zod';
import * as nomba from '../services/nomba';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import { VirtualAccount } from '../models/VirtualAccount';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const checkoutSchema = z.object({
  userId: z.string(),
  amount: z.number().positive(),
  email: z.string().email().optional(),
  callbackUrl: z.string().url().optional(),
});

const virtualAccountSchema = z.object({
  userId: z.string(),
  accountName: z.string(),
  expectedAmount: z.number().positive().optional(),
});

const withdrawalSchema = z.object({
  userId: z.string(),
  amount: z.number().positive(),
  accountNumber: z.string().min(10),
  bankCode: z.string(),
  accountName: z.string(),
});

const accountLookupSchema = z.object({
  accountNumber: z.string().min(10),
  bankCode: z.string(),
});

/**
 * POST /api/payments/checkout
 * Create Nomba checkout order
 */
router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const validation = checkoutSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid parameters', details: validation.error.flatten() });
    }

    const { userId, amount, email, callbackUrl } = validation.data;

    // Create pending transaction record
    const orderReference = uuidv4();
    const transaction = new Transaction({
      id: uuidv4(),
      userId,
      title: 'Wallet Top-up',
      category: 'Transfer',
      type: 'Credit',
      amount,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Processing',
      orderReference,
      paymentMethod: 'card',
    });
    await transaction.save();

    // Create Nomba checkout order
    const result = await nomba.createCheckoutOrder({
      amount,
      email,
      callbackUrl: callbackUrl || `${process.env.APP_URL}/payment/callback`,
      userId,
      metadata: { userId, orderRef: orderReference },
    });

    res.json({
      success: true,
      checkoutLink: result.checkoutLink,
      orderReference: result.orderReference,
      transaction: transaction.id,
    });
  } catch (error: any) {
    console.error('[CHECKOUT] Error:', error.message);
    res.status(500).json({ error: 'Failed to create checkout order' });
  }
});

/**
 * GET /api/payments/verify/:orderReference
 * Verify transaction status
 */
router.get('/verify/:orderReference', async (req: Request, res: Response) => {
  try {
    const { orderReference } = req.params;

    const result = await nomba.verifyTransaction(orderReference);

    if (!result || result.code !== '00') {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = await Transaction.findOne({ orderReference });

    res.json({
      status: result.data.status,
      amount: result.data.amount,
      transaction: transaction ? {
        id: transaction.id,
        title: transaction.title,
        amount: transaction.amount,
        status: transaction.status,
      } : null,
    });
  } catch (error: any) {
    console.error('[VERIFY] Error:', error.message);
    res.status(500).json({ error: 'Verification failed' });
  }
});

/**
 * POST /api/wallet/virtual-account
 * Create virtual account for user
 */
router.post('/virtual-account', async (req: Request, res: Response) => {
  try {
    const validation = virtualAccountSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid parameters', details: validation.error.flatten() });
    }

    const { userId, accountName, expectedAmount } = validation.data;

    // Check if user already has virtual account (limit: 2 per user)
    const existingCount = await VirtualAccount.countDocuments({ userId, isActive: true });
    if (existingCount >= 2) {
      return res.status(400).json({ error: 'Maximum virtual account limit reached (2)' });
    }

    // Create virtual account
    const accountRef = `OBEY-${userId.substring(0, 8).toUpperCase()}-${Date.now()}`;
    const result = await nomba.createVirtualAccount({
      accountRef,
      accountName,
      expectedAmount,
    });

    // Save to database
    const virtualAccount = new VirtualAccount({
      userId,
      accountRef,
      accountName,
      bankAccountNumber: result.data.bankAccountNumber,
      bankName: result.data.bankName,
      currency: result.data.currency,
      expectedAmount,
      expiryDate: result.data.expiryDate,
      nombaAccountId: result.data.accountHolderId,
    });
    await virtualAccount.save();

    res.json({
      success: true,
      account: {
        bankName: virtualAccount.bankName,
        accountNumber: virtualAccount.bankAccountNumber,
        accountName: virtualAccount.accountName,
        currency: virtualAccount.currency,
      },
    });
  } catch (error: any) {
    console.error('[VIRTUAL_ACCOUNT] Error:', error.message);
    res.status(500).json({ error: 'Failed to create virtual account' });
  }
});

/**
 * GET /api/wallet/virtual-accounts
 * Get user's virtual accounts
 */
router.get('/virtual-accounts', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const accounts = await VirtualAccount.find({ userId, isActive: true });
    res.json({ accounts });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch virtual accounts' });
  }
});

/**
 * GET /api/payments/banks
 * Fetch bank codes
 */
router.get('/banks', async (req: Request, res: Response) => {
  try {
    const banks = await nomba.fetchBankCodes();
    res.json({ banks });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch banks' });
  }
});

/**
 * POST /api/payments/account-lookup
 * Verify bank account number
 */
router.post('/account-lookup', async (req: Request, res: Response) => {
  try {
    const validation = accountLookupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    const { accountNumber, bankCode } = validation.data;
    const result = await nomba.lookupBankAccount(accountNumber, bankCode);

    res.json({
      success: true,
      accountName: result.data.accountName,
      accountNumber: result.data.accountNumber,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Account lookup failed' });
  }
});

/**
 * POST /api/payments/withdraw
 * Initiate bank transfer withdrawal
 */
router.post('/withdraw', async (req: Request, res: Response) => {
  try {
    const validation = withdrawalSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid parameters', details: validation.error.flatten() });
    }

    const { userId, amount, accountNumber, bankCode, accountName } = validation.data;

    // Check user balance
    const user = await User.findOne({ $or: [{ supabaseId: userId }, { email: userId }] });
    if (!user || user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create transaction record
    const merchantTxRef = `WTH-${uuidv4().substring(0, 8).toUpperCase()}`;
    const transaction = new Transaction({
      id: uuidv4(),
      userId,
      title: 'Bank Withdrawal',
      category: 'Transfer',
      type: 'Debit',
      amount,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Processing',
      requestReference: merchantTxRef,
      paymentMethod: 'bank_transfer',
    });
    await transaction.save();

    // Deduct balance immediately (will refund on failure)
    user.balance -= amount;
    await user.save();

    // Initiate transfer
    const result = await nomba.initiateBankTransfer({
      amount,
      accountNumber,
      accountName,
      bankCode,
      merchantTxRef,
      senderName: 'Obey Fintech',
    });

    // Update transaction with Nomba details
    transaction.nombaTransactionId = result.data.id;
    transaction.sessionId = result.data.meta?.rrn;
    if (result.data.status === 'PENDING_BILLING') {
      transaction.status = 'Processing';
    } else if (result.data.status === 'SUCCESS') {
      transaction.status = 'Success';
    }
    await transaction.save();

    res.json({
      success: true,
      transaction: {
        id: transaction.id,
        status: transaction.status,
        reference: merchantTxRef,
      },
      nombaStatus: result.data.status,
    });
  } catch (error: any) {
    console.error('[WITHDRAW] Error:', error.message);
    res.status(500).json({ error: 'Withdrawal failed' });
  }
});

export default router;
```

**Action:** Register routes in `server/index.ts`:

```typescript
import nombaPaymentRoutes from './routes/nomba_payments';

router.use('/payments', nombaPaymentRoutes);
router.use('/wallet', nombaPaymentRoutes);
```

---

### Step 8: Frontend Integration

#### A. Checkout Component

**File:** `src/components/PaymentCheckout.tsx`

```typescript
import { useState } from 'react';
import api from '../services/api';

export function PaymentCheckout({ userId, onSuccess }: { userId: string; onSuccess: () => void }) {
  const [amount, setAmount] = useState<number>(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/payments/checkout', {
        userId,
        amount,
        callbackUrl: `${window.location.origin}/payment/callback`,
      });

      if (response.data.success) {
        // Redirect to Nomba checkout
        window.location.href = response.data.checkoutLink;
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Fund Wallet</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Amount (NGN)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full px-4 py-2 border rounded-lg"
          min="100"
          step="100"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading || amount < 100}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay ₦${amount.toLocaleString()}`}
      </button>
    </div>
  );
}
```

#### B. Payment Callback Page

**File:** `src/pages/PaymentCallback.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [transaction, setTransaction] = useState<any>(null);

  const orderReference = searchParams.get('orderReference');

  useEffect(() => {
    if (!orderReference) {
      setStatus('failed');
      return;
    }

    // Poll transaction status
    const pollStatus = async () => {
      try {
        const response = await api.get(`/payments/verify/${orderReference}`);
        
        if (response.data.status === 'SUCCESS') {
          setStatus('success');
          setTransaction(response.data.transaction);
        } else if (response.data.status === 'FAILED') {
          setStatus('failed');
        }
        // If still processing, continue polling
      } catch (error) {
        console.error('Verification failed:', error);
      }
    };

    // Poll every 2 seconds
    const interval = setInterval(pollStatus, 2000);
    pollStatus(); // Initial check

    // Stop polling after 60 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (status === 'verifying') {
        setStatus('failed');
      }
    }, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [orderReference]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your transaction...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
            <p className="text-gray-600 mb-4">
              {transaction && `₦${transaction.amount.toLocaleString()} has been added to your wallet`}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="text-red-600 text-6xl mb-4">✕</div>
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">Your payment could not be processed.</p>
            <button
              onClick={() => navigate('/wallet')}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

#### C. Virtual Account Component

**File:** `src/components/VirtualAccountCard.tsx`

```typescript
import { useState, useEffect } from 'react';
import api from '../services/api';

export function VirtualAccountCard({ userId }: { userId: string }) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [userId]);

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/wallet/virtual-accounts', { params: { userId } });
      setAccounts(response.data.accounts);
    } catch (error) {
      console.error('Failed to fetch virtual accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async () => {
    setCreating(true);
    try {
      const response = await api.post('/wallet/virtual-account', {
        userId,
        accountName: 'John Doe', // Replace with actual user name
      });
      
      if (response.data.success) {
        await fetchAccounts();
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create virtual account');
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Account number copied!');
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Virtual Accounts</h3>
        {accounts.length < 2 && (
          <button
            onClick={createAccount}
            disabled={creating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? 'Creating...' : '+ New Account'}
          </button>
        )}
      </div>

      {accounts.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 mb-2">No virtual accounts yet</p>
          <p className="text-sm text-gray-500">
            Create a dedicated account to receive payments directly into your wallet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <div key={account._id} className="p-4 border rounded-lg hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{account.accountName}</p>
                  <p className="text-sm text-gray-500">{account.bankName}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                  Active
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-xs text-gray-500">Account Number</p>
                  <p className="text-lg font-mono font-bold">{account.bankAccountNumber}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(account.bankAccountNumber)}
                  className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Copy
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Funds sent to this account will automatically credit your wallet
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### Step 9: Testing Procedures

#### A. Sandbox Testing

**1. Test Authentication:**
```bash
curl -X POST https://sandbox.nomba.com/v1/auth/token/issue \
  -H "Content-Type: application/json" \
  -H "accountId: f666ef9b-888e-4799-85ce-acb505b28023" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "706df6c4-b8bb-4130-88c4-d21b052f8631",
    "client_secret": "k8UobYk3APgOoxUnNL7VpuxzwTsH4LsXtydfjcHs8RH0YISBB4OMqJsaafG+U8fWETu9YZ96bNXE+DelCDuMPw=="
  }'
```

**Expected Response:**
```json
{
  "code": "00",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiJ9...",
    "refresh_token": "...",
    "expiresAt": "2026-06-26T..."
  }
}
```

**2. Test Checkout Order:**
```bash
curl -X POST https://sandbox.nomba.com/v1/checkout/order \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -H "accountId: a94ac356-e554-4290-8fcd-b926a790f1f6" \
  -d '{
    "order": {
      "amount": "1000.00",
      "currency": "NGN",
      "customerEmail": "test@example.com",
      "callbackUrl": "https://obey-kappa.vercel.app/payment/callback"
    }
  }'
```

**Expected Response:**
```json
{
  "code": "00",
  "data": {
    "checkoutLink": "https://checkout.sandbox.nomba.com/pay/...",
    "orderReference": "uuid"
  }
}
```

**3. Test Virtual Account Creation:**
```bash
curl -X POST https://sandbox.nomba.com/v1/accounts/virtual \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -H "accountId: a94ac356-e554-4290-8fcd-b926a790f1f6" \
  -d '{
    "accountRef": "TEST-001",
    "accountName": "Test User",
    "currency": "NGN"
  }'
```

**4. Test Bank Transfer:**
```bash
# First, fetch bank codes
curl -X GET https://sandbox.nomba.com/v1/transfers/bank \
  -H "Authorization: Bearer <access_token>" \
  -H "accountId: a94ac356-e554-4290-8fcd-b926a790f1f6"

# Then, lookup account
curl -X POST https://sandbox.nomba.com/v1/transfers/bank/lookup \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -H "accountId: a94ac356-e554-4290-8fcd-b926a790f1f6" \
  -d '{
    "accountNumber": "0123456789",
    "bankCode": "011"
  }'

# Finally, initiate transfer
curl -X POST https://sandbox.nomba.com/v2/transfers/bank \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -H "accountId: a94ac356-e554-4290-8fcd-b926a790f1f6" \
  -H "X-Idempotent-key: test-uuid-123" \
  -d '{
    "amount": 500,
    "accountNumber": "0123456789",
    "accountName": "Test User",
    "bankCode": "011",
    "merchantTxRef": "TEST-WTH-001",
    "senderName": "Obey Test"
  }'
```

#### B. Webhook Testing

**1. Use ngrok to expose local webhook:**
```bash
ngrok http 5001
```

**2. Update webhook URL in Nomba dashboard:**
```
https://<ngrok-id>.ngrok.io/api/webhooks/nomba
```

**3. Trigger test payment in sandbox and verify webhook received**

**4. Test signature validation:**
```typescript
// In webhook handler, log signature comparison
console.log('Received signature:', req.headers['nomba-signature']);
console.log('Computed signature:', computedSignature);
console.log('Match:', isValid);
```

---

### Step 10: Production Deployment

**1. Update environment variables in Vercel:**
```bash
vercel env add NOMBA_BASE_URL production
# Enter: https://api.nomba.com

vercel env add NOMBA_CLIENT_ID production
# Enter: e5e85b13-f560-4643-814e-c87435dbbc15

vercel env add NOMBA_CLIENT_SECRET production
# Enter: 8/doS7Q3w77EANpk3vpgSrc05hhOiRWp3eBs01sXyZ1AmovtZUXlmrxie+xnEF2tR4q79t0IFufMD1d4JrkT8g==

# ... repeat for other variables
```

**2. Submit webhook URL to Nomba:**
```
Production Webhook URL: https://obey-kappa.vercel.app/api/webhooks/nomba
Sub-Account ID: a94ac356-e554-4290-8fcd-b926a790f1f6
```

**3. Deploy to production:**
```bash
npm run build
vercel --prod
```

**4. Monitor first 10 transactions:**
- Check MongoDB for transaction records
- Verify webhook events logged
- Confirm balance updates
- Monitor error logs

---

## DECISION TREES

### When to Use Each Endpoint

```
User wants to fund wallet?
  ├─ Has virtual account? → Show account details (funds auto-credit)
  └─ No virtual account?
      ├─ Wants to use card? → POST /v1/checkout/order → Redirect to checkoutLink
      └─ Wants bank transfer? → Create dynamic virtual account with expectedAmount

User wants to withdraw?
  ├─ Has sufficient balance?
  │   ├─ Yes → POST /v1/transfers/bank/lookup → Confirm details → POST /v2/transfers/bank
  │   └─ No → Show error
  └─ Transfer status?
      ├─ SUCCESS → Update transaction, notify user
      ├─ PENDING_BILLING → Poll or wait for webhook
      └─ REFUND → Auto-refund balance, notify support

Payment webhook received?
  ├─ Verify signature → Invalid? → Return 401
  ├─ Check duplicate → Exists? → Return 200 (already processed)
  └─ Process by event_type:
      ├─ payment_success → Credit balance, update transaction
      ├─ payment_failed → Mark transaction failed
      ├─ payout_success → Confirm withdrawal
      └─ payout_failed → Refund balance, create reversal transaction
```

### Error Handling

```
API returns error?
  ├─ 401 Unauthorized → Token expired → Call refreshAccessToken() → Retry
  ├─ 400 Bad Request → Invalid payload → Show user-friendly error
  ├─ 429 Rate Limit → Wait 60s → Retry with backoff
  ├─ 500 Server Error → Log error → Notify support → Retry in 5min
  └─ Network Error → Check connectivity → Retry 3 times → Fail gracefully

Transaction verification fails?
  ├─ Transaction not found → Wait 5s → Retry (webhook may be delayed)
  ├─ Status = PROCESSING → Poll every 2s for 60s → Then show pending
  ├─ Status = FAILED → Show error, allow retry
  └─ Status = SUCCESS → Update UI, show success animation
```

---

## TROUBLESHOOTING

### Common Issues

**Issue:** "Authentication failed"
- **Cause:** Invalid credentials or mismatched environment
- **Solution:** Verify using sandbox credentials with sandbox URL, production with production URL

**Issue:** "Webhook signature mismatch"
- **Cause:** Incorrect webhook secret or payload tampering
- **Solution:** Copy webhook secret from Nomba dashboard, ensure exact payload structure

**Issue:** "Transaction not found"
- **Cause:** Querying before webhook processed
- **Solution:** Poll every 2s for up to 60s, or wait for webhook confirmation

**Issue:** "Duplicate balance credit"
- **Cause:** Webhook processed multiple times
- **Solution:** Check `WebhookEvent` for duplicate `eventId` before processing

**Issue:** "Transfer stuck in PENDING_BILLING"
- **Cause:** Bank processing delay
- **Solution:** Wait for webhook or poll `/v1/transactions/accounts/single` every 10s

---

## SECURITY CHECKLIST

- [ ] Never expose `NOMBA_CLIENT_SECRET` in frontend code
- [ ] Always verify webhook signatures before processing
- [ ] Use HTTPS for all API calls (enforced by Nomba)
- [ ] Store tokens securely (environment variables, not code)
- [ ] Implement idempotency keys for all transfers
- [ ] Validate all user inputs with Zod schemas
- [ ] Log all webhook events for audit trail
- [ ] Rotate credentials every 90 days
- [ ] Use sub-account ID in headers to scope transactions
- [ ] Never log sensitive data (tokens, secrets, card numbers)

---

## PERFORMANCE OPTIMIZATION

### Token Caching
```typescript
// Cache token with 5-minute buffer before expiry
if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 300000) {
  return cachedToken;
}
```

### Bank Code Caching
```typescript
// Cache bank codes for 24 hours (they rarely change)
let cachedBanks: any[] | null = null;
let bankCacheExpiry: number | null = null;

export async function fetchBankCodes() {
  if (cachedBanks && bankCacheExpiry && Date.now() < bankCacheExpiry) {
    return cachedBanks;
  }
  
  const response = await nombaRequest('GET', '/v1/transfers/bank');
  cachedBanks = response.data;
  bankCacheExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return cachedBanks;
}
```

### Database Indexing
```typescript
// Add indexes for frequently queried fields
TransactionSchema.index({ orderReference: 1 });
TransactionSchema.index({ nombaTransactionId: 1 });
WebhookEventSchema.index({ eventId: 1 }, { unique: true });
VirtualAccountSchema.index({ userId: 1 });
```

---

## MONITORING & ALERTS

### Key Metrics to Track

```typescript
// Log critical events
console.log(JSON.stringify({
  event: 'checkout_created',
  userId,
  amount,
  orderReference,
  timestamp: new Date().toISOString()
}));

console.log(JSON.stringify({
  event: 'webhook_received',
  eventType: payload.event_type,
  transactionId: payload.data.transaction.transactionId,
  amount: payload.data.transaction.transactionAmount,
  signatureValid: isValid,
  timestamp: new Date().toISOString()
}));
```

### Alert Thresholds

- **Token refresh failures:** > 3 in 5 minutes → Alert
- **Webhook signature failures:** Any → Critical alert
- **Transaction verification timeouts:** > 5 in 10 minutes → Alert
- **Transfer failures:** > 10% in 1 hour → Alert
- **Webhook processing errors:** Any → Log and investigate

---

## NEXT STEPS

After completing the implementation:

1. **Test thoroughly in sandbox** - Run all test scenarios
2. **Submit webhook URL** - Configure in Nomba dashboard
3. **Deploy to staging** - Test with real users (beta group)
4. **Monitor production** - Watch first 50 transactions
5. **Document issues** - Create runbook for common problems
6. **Train support team** - Teach them Nomba transaction IDs
7. **Gather feedback** - Ask users about checkout experience
8. **Optimize** - Based on metrics and feedback

---

## RESOURCES

- **API Reference:** https://developer.nomba.com/nomba-api-reference/introduction
- **Webhook Guide:** https://developer.nomba.com/docs/api-basics/webhook
- **Error Codes:** https://developer.nomba.com/docs/api-basics/error-codes
- **Sandbox Testing:** https://developer.nomba.com/docs/products/accept-payment/sandbox-testing
- **OpenAPI Spec:** https://developer.nomba.com/nomba-api-reference/openapi.json
- **Support:** docs@nomba.com

---

**Document Version:** 1.0  
**Last Updated:** 2026-06-26  
**Author:** TRICODE PRO (Luke Okagha)  
**Status:** Ready for Implementation
