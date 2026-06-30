#!/usr/bin/env node
/**
 * OBEY Backend Transaction Test Suite
 * Tests all major API endpoints
 */

const API_BASE = 'http://localhost:5001/api';

async function testEndpoint(name, method, path, data = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (data) options.body = JSON.stringify(data);

  try {
    const res = await fetch(`${API_BASE}${path}`, options);
    const json = await res.json();
    const status = res.ok ? '✓' : '';
    console.log(`${status} ${name} [${res.status}]`);
    return { ok: res.ok, data: json };
  } catch (err) {
    console.log(`✗ ${name} [ERROR: ${err.message}]`);
    return { ok: false, error: err.message };
  }
}

async function runTests() {
  console.log('\n=== OBEY Backend Transaction Test Suite ===\n');

  // 1. Health Check
  await testEndpoint('Health Check', 'GET', '/health');

  // 2. VTU Billers
  await testEndpoint('VTU Billers', 'GET', '/vtu/billers');

  // 3. VTU Payment Items
  await testEndpoint('VTU Payment Items (MTN)', 'GET', '/vtu/payment-items/10101');

  // 4. VTU Recharge (Airtime)
  await testEndpoint('VTU Recharge (MTN Airtime)', 'POST', '/vtu/recharge', {
    paymentCode: '10101',
    customerId: '2348031234567',
    amount: 50000,
    requestReference: `TEST-AIR-${Date.now()}`
  });

  // 5. VTU Recharge (Airtel)
  await testEndpoint('VTU Recharge (Airtel)', 'POST', '/vtu/recharge', {
    paymentCode: '10201',
    customerId: '2348021234567',
    amount: 100000,
    requestReference: `TEST-AIR-${Date.now()}`
  });

  // 6. VTU Recharge (Glo)
  await testEndpoint('VTU Recharge (Glo)', 'POST', '/vtu/recharge', {
    paymentCode: '10301',
    customerId: '2348051234567',
    amount: 75000,
    requestReference: `TEST-AIR-${Date.now()}`
  });

  // 7. VTU Recharge (9mobile)
  await testEndpoint('VTU Recharge (9mobile)', 'POST', '/vtu/recharge', {
    paymentCode: '10401',
    customerId: '2348091234567',
    amount: 60000,
    requestReference: `TEST-AIR-${Date.now()}`
  });

  // 8. Sync User
  const syncResult = await testEndpoint('Sync User', 'POST', '/sync/user', {
    supabaseId: 'test-user-sync',
    email: 'sync-test@obey.com',
    name: 'Sync Test User',
    balance: 500000
  });

  // 9. Fetch User
  await testEndpoint('Fetch User', 'GET', '/sync/user/test-user-sync');

  // 10. Sync Transactions
  await testEndpoint('Sync Transactions', 'POST', '/sync/transactions', {
    userId: 'test-user-sync',
    transactions: [
      {
        id: 'tx-001',
        title: 'MTN Airtime',
        category: 'Airtime',
        type: 'Debit',
        amount: 500,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: 'Success'
      }
    ]
  });

  // 11. Fetch Transactions
  await testEndpoint('Fetch Transactions', 'GET', '/sync/transactions/test-user-sync');

  // 12. Market Prices
  await testEndpoint('Market Prices (BTC)', 'GET', '/market/prices?symbol=BTC');

  // 13. Nomba Banks
  await testEndpoint('Nomba Banks', 'GET', '/nomba/banks');

  // 14. Rewards (should handle missing user gracefully)
  await testEndpoint('User Rewards', 'GET', '/rewards/test-user-sync');

  // 15. Session Verify
  await testEndpoint('Session Verify', 'GET', '/session/verify');

  console.log('\n=== Test Suite Complete ===\n');
}

runTests().catch(console.error);
