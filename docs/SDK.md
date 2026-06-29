# OBEY Finance SDK Documentation

## Overview

The OBEY Finance SDK (`@obey-finance/sdk`) is a comprehensive TypeScript/JavaScript library for integrating TRICODE PRO LTD's financial infrastructure into your applications. It provides APIs for payments, crypto trading, wallet management, Sui blockchain interactions, and more.

**Version:** 2.0.0  
**License:** MIT  
**Repository:** github.com/tricode-pro/obey-sdk

---

## Installation

```bash
npm install @obey-finance/sdk
# or
yarn add @obey-finance/sdk
# or
pnpm add @obey-finance/sdk
```

### Peer Dependencies

```bash
npm install ethers@^6.0.0 @mysten/sui.js@^1.0.0
```

---

## Quick Start

```typescript
import { ObeySDK } from '@obey-finance/sdk';

const obey = new ObeySDK({
  apiKey: process.env.OBEY_API_KEY,
  environment: 'production', // 'production' | 'sandbox' | 'testnet'
  webhookSecret: process.env.OBEY_WEBHOOK_SECRET,
});

await obey.initialize();
```

---

## API Reference

### 1. Payments Module

Process payments via Opay, bank transfer, card, or wallet.

```typescript
// Create a payment
const payment = await obey.payments.create({
  amount: 50000,
  currency: 'NGN',
  description: 'BTC purchase',
  customer: {
    email: 'user@example.com',
    name: 'John Doe',
    phone: '+2348012345678',
  },
  paymentMethod: 'opay', // 'opay' | 'card' | 'bank_transfer' | 'wallet'
  metadata: { orderId: 'order_123' },
  callbackUrl: 'https://yourapp.com/callback',
});

// Get payment status
const status = await obey.payments.getStatus(payment.id);

// List payments
const payments = await obey.payments.list({
  limit: 50,
  offset: 0,
  status: 'completed',
  dateFrom: '2026-01-01',
  dateTo: '2026-06-29',
});

// Refund a payment
const refund = await obey.payments.refund(payment.id, {
  amount: 25000,
  reason: 'Partial refund',
});
```

### 2. Crypto Trading Module

Buy, sell, and swap cryptocurrencies.

```typescript
// Get market prices
const prices = await obey.crypto.getPrices(['BTC', 'ETH', 'SOL', 'SUI']);
// Returns: { BTC: { ngn: 96000000, usd: 60000, change24h: 2.4 }, ... }

// Execute a market trade
const trade = await obey.crypto.trade({
  pair: 'BTC/NGN',
  side: 'buy',
  amount: 0.001,
  orderType: 'market',
});

// Place a limit order
const limitOrder = await obey.crypto.trade({
  pair: 'ETH/NGN',
  side: 'buy',
  amount: 0.5,
  orderType: 'limit',
  limitPrice: 5000000,
});

// Get trade history
const history = await obey.crypto.getHistory({
  limit: 50,
  pair: 'BTC/NGN',
  side: 'buy',
});

// Get order book
const orderBook = await obey.crypto.getOrderBook('BTC/NGN', {
  depth: 20,
});
```

### 3. Wallet Module

Manage user wallets, balances, and transfers.

```typescript
// Get wallet balance
const balance = await obey.wallet.getBalance();
// Returns: { NGN: 2580340.52, BTC: 0.05, ETH: 1.2, SUI: 500 }

// Fund wallet via Opay
const funding = await obey.wallet.fund({
  amount: 100000,
  method: 'opay',
  reference: 'fund_123',
});

// Withdraw to bank account
const withdrawal = await obey.wallet.withdraw({
  amount: 50000,
  bankCode: '058', // GTBank
  accountNumber: '1234567890',
  accountName: 'John Doe',
  narration: 'Withdrawal',
});

// Transfer to another Obey user
const transfer = await obey.wallet.transfer({
  amount: 10000,
  recipientId: 'user_456',
  narration: 'Payment for services',
});

// Get transaction history
const transactions = await obey.wallet.getTransactions({
  limit: 50,
  type: 'all', // 'credit' | 'debit' | 'all'
});
```

### 4. Sui Blockchain Module

Interact with the Sui Network parallel node system.

```typescript
// Connect to Sui network
const sui = await obey.sui.connect({
  network: 'mainnet', // 'mainnet' | 'testnet' | 'devnet'
  nodeUrl: 'https://fullnode.mainnet.sui.io',
});

// Get node status
const nodeStatus = await sui.getNodeStatus();

// Execute parallel transactions
const txResult = await sui.executeParallel({
  transactions: [
    { type: 'transfer', amount: 100, to: '0x...' },
    { type: 'swap', from: 'SUI', to: 'USDC', amount: 50 },
  ],
});

// Query escrow vault
const escrow = await sui.getEscrow(escrowId);

// Create escrow
const newEscrow = await sui.createEscrow({
  recipient: '0x...',
  amount: 1000,
  currency: 'SUI',
  releaseCondition: 'delivery_confirmed',
  expiresAt: Date.now() + 86400000,
  arbiter: '0x...',
});

// Bridge assets
const bridge = await sui.bridgeTransfer({
  destinationChain: 'ethereum',
  amount: 100,
  asset: 'SUI',
  recipient: '0x...',
});
```

### 5. Gift Cards Module

Buy and sell gift cards.

```typescript
// Get available gift cards
const cards = await obey.giftcards.list({
  category: 'all', // 'all' | 'gaming' | 'shopping' | 'streaming'
  trending: true,
});

// Buy a gift card
const purchase = await obey.giftcards.buy({
  brand: 'Apple',
  amount: 50,
  currency: 'USD',
  paymentMethod: 'wallet',
});

// Sell a gift card
const sale = await obey.giftcards.sell({
  brand: 'Amazon',
  amount: 100,
  currency: 'USD',
  images: ['base64_image_1', 'base64_image_2'],
});

// Get trade rates
const rates = await obey.giftcards.getRates('Apple');
// Returns: { buyRate: 1500, sellRate: 1400, currency: 'NGN' }
```

### 6. Virtual Cards Module

Issue and manage virtual cards.

```typescript
// Create a virtual card
const card = await obey.cards.create({
  type: 'virtual',
  currency: 'USD',
  amount: 500,
  cardType: 'mastercard', // 'visa' | 'mastercard'
});

// Fund a card
await obey.cards.fund(card.id, { amount: 100 });

// Freeze/unfreeze card
await obey.cards.freeze(card.id);
await obey.cards.unfreeze(card.id);

// Get card transactions
const cardTxs = await obey.cards.getTransactions(card.id);
```

### 7. VTU Module (Airtime & Data)

Purchase airtime and data bundles.

```typescript
// Buy airtime
const airtime = await obey.vtu.buyAirtime({
  network: 'mtn', // 'mtn' | 'airtel' | 'glo' | '9mobile'
  amount: 1000,
  phone: '08012345678',
});

// Buy data
const data = await obey.vtu.buyData({
  network: 'mtn',
  plan: '1.5GB',
  phone: '08012345678',
});

// Get available data plans
const plans = await obey.vtu.getDataPlans('mtn');
```

### 8. Webhooks

Handle webhook events from Obey.

```typescript
import { verifyWebhookSignature, WebhookEvent } from '@obey-finance/sdk';

app.post('/webhooks/obey', (req, res) => {
  const signature = req.headers['x-obey-signature'] as string;
  const isValid = verifyWebhookSignature(
    JSON.stringify(req.body),
    signature,
    process.env.OBEY_WEBHOOK_SECRET!
  );

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event: WebhookEvent = req.body;

  switch (event.type) {
    case 'payment.completed':
      console.log('Payment completed:', event.data);
      break;
    case 'payment.failed':
      console.log('Payment failed:', event.data);
      break;
    case 'trade.executed':
      console.log('Trade executed:', event.data);
      break;
    case 'wallet.funded':
      console.log('Wallet funded:', event.data);
      break;
    case 'wallet.withdrawn':
      console.log('Wallet withdrawn:', event.data);
      break;
    case 'kyc.verified':
      console.log('KYC verified:', event.data);
      break;
    case 'card.created':
      console.log('Card created:', event.data);
      break;
    case 'sui.transaction.confirmed':
      console.log('Sui TX confirmed:', event.data);
      break;
  }

  res.status(200).json({ received: true });
});
```

---

## Error Handling

```typescript
import { ObeyError, ErrorCode } from '@obey-finance/sdk';

try {
  const payment = await obey.payments.create({ ... });
} catch (error) {
  if (error instanceof ObeyError) {
    switch (error.code) {
      case ErrorCode.INSUFFICIENT_FUNDS:
        console.log('Not enough balance');
        break;
      case ErrorCode.INVALID_AMOUNT:
        console.log('Invalid transaction amount');
        break;
      case ErrorCode.RATE_LIMITED:
        console.log('Too many requests, retry after', error.retryAfter);
        break;
      case ErrorCode.KYC_REQUIRED:
        console.log('KYC verification required');
        break;
      case ErrorCode.PAYMENT_FAILED:
        console.log('Payment processing failed:', error.details);
        break;
      default:
        console.log(error.message);
    }
  }
}
```

---

## Rate Limits

| Endpoint | Rate Limit | Burst |
|----------|-----------|-------|
| Payments | 100 req/s | 200 |
| Crypto Trading | 50 req/s | 100 |
| Wallet Operations | 100 req/s | 200 |
| Gift Cards | 30 req/s | 60 |
| Sui Blockchain | 20 req/s | 40 |
| General API | 100 req/s | 200 |

---

## Environment Variables

```env
OBEY_API_KEY=your_api_key_here
OBEY_WEBHOOK_SECRET=your_webhook_secret_here
OBEY_ENVIRONMENT=production
OBEY_SUI_NETWORK=mainnet
```

---

## Compliance & Security

- **PCI-DSS Level 1** compliant for all payment processing
- **CBN Licensed** Payment Service Provider
- **Apple App Store** compliant
- **AES-256** encryption for data at rest
- **TLS 1.3** for data in transit
- **SOC 2 Type II** certified infrastructure

---

## Support

- **Documentation:** docs.obey.finance/sdk
- **GitHub:** github.com/tricode-pro/obey-sdk
- **Discord:** discord.gg/obey-dev
- **Email:** sdk-support@obey.finance
- **Status:** status.obey.finance

---

## Changelog

### v2.0.0 (June 2026)
- Added Sui Network parallel node integration
- Added Opay payment gateway support
- Added Apple Pay settlement receipts
- Added cross-chain bridge (Sui ↔ Ethereum ↔ Solana)
- Added oracle price feed system
- Added governance module
- Improved error handling with detailed error codes
- Added webhook signature verification

### v1.0.0 (January 2026)
- Initial release
- Payment processing (Opay, bank transfer, card)
- Crypto trading (BTC, ETH, SOL, SUI)
- Wallet management
- Gift card trading
- Virtual cards
- VTU (airtime & data)
