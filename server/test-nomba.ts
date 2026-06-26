import dotenv from 'dotenv';
import * as nomba from './services/nomba';

dotenv.config();

async function testNombaIntegration() {
  console.log('🧪 Testing Nomba Integration...\n');

  console.log('1️⃣ Testing Authentication...');
  try {
    const token = await nomba.getAccessToken();
    console.log('✅ Access token obtained:', token.substring(0, 20) + '...');
  } catch (error: any) {
    console.error('❌ Authentication failed:', error.message);
    return;
  }

  console.log('\n2️⃣ Testing Bank Code Fetch...');
  try {
    const banks = await nomba.fetchBankCodes();
    console.log(`✅ Fetched ${banks.length} banks`);
    console.log('   Sample:', banks[0]?.name, '-', banks[0]?.code);
  } catch (error: any) {
    console.error('❌ Bank fetch failed:', error.message);
  }

  console.log('\n3️⃣ Testing Checkout Order Creation...');
  try {
    const order = await nomba.createCheckoutOrder({
      amount: 1000,
      email: 'test@example.com',
      callbackUrl: 'https://obey-kappa.vercel.app/payment/callback',
      userId: 'test-user-123',
      metadata: { test: 'true' },
    });
    console.log('✅ Checkout order created');
    console.log('   Order Reference:', order.orderReference);
    console.log('   Checkout Link:', order.checkoutLink.substring(0, 50) + '...');
  } catch (error: any) {
    console.error('❌ Checkout creation failed:', error.message);
  }

  console.log('\n4️⃣ Testing Virtual Account Creation...');
  try {
    const account = await nomba.createVirtualAccount({
      accountRef: `TEST-${Date.now()}`,
      accountName: 'Test User',
      currency: 'NGN',
    });
    console.log('✅ Virtual account created');
    console.log('   Bank:', account.data.bankName);
    console.log('   Account Number:', account.data.bankAccountNumber);
  } catch (error: any) {
    console.error('❌ Virtual account creation failed:', error.message);
  }

  console.log('\n5️⃣ Testing Webhook Signature Verification...');
  try {
    const testPayload = {
      event_type: 'payment_success',
      requestId: 'test-request-id',
      data: {
        merchant: { userId: 'user123', walletId: 'wallet456' },
        transaction: {
          transactionId: 'tx789',
          type: 'online_checkout',
          time: '2026-06-26T00:00:00Z',
          responseCode: '00',
        },
      },
    };
    const testSignature = 'test-signature';
    const testTimestamp = '2026-06-26T00:00:00Z';
    
    const isValid = nomba.verifyWebhookSignature(testPayload, testSignature, testTimestamp);
    console.log('✅ Signature verification function works');
    console.log('   Valid:', isValid, '(expected: false for test data)');
  } catch (error: any) {
    console.error('❌ Signature verification failed:', error.message);
  }

  console.log('\n✅ Integration test complete!');
}

testNombaIntegration().catch(console.error);
