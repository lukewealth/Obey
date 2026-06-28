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

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;
let cachedRefreshToken: string | null = null;

export async function getAccessToken(): Promise<string> {
  if (!NOMBA_BASE_URL || !NOMBA_CLIENT_ID || !NOMBA_CLIENT_SECRET) {
    throw new Error('Nomba credentials not configured');
  }

  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 300000) {
    return cachedToken;
  }

  if (cachedRefreshToken) {
    try {
      return await refreshAccessToken();
    } catch (error) {
      console.log('[NOMBA] Refresh failed, obtaining new token');
      cachedRefreshToken = null;
    }
  }

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
        timeout: 10000,
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
    cachedToken = null;
    cachedRefreshToken = null;
    tokenExpiry = null;
    throw error;
  }
}

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

    if (response.data.code && response.data.code !== '00') {
      throw new Error(`Nomba API error: [${response.data.code}] ${response.data.description}`);
    }

    return response.data;
  } catch (error: any) {
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

export function verifyWebhookSignature(
  payload: any,
  signature: string,
  timestamp: string
): boolean {
  if (!NOMBA_WEBHOOK_SECRET || NOMBA_WEBHOOK_SECRET === 'your_webhook_secret_from_dashboard') {
    if (process.env.NODE_ENV === 'development' || process.env.VERCEL === '1') {
      console.warn('[NOMBA] Webhook secret not configured - bypassing verification in dev/preview');
      return true;
    }
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

export async function verifyTransaction(orderReference: string): Promise<any> {
  const response = await nombaRequest(
    'GET',
    `/v1/transactions/accounts/single?orderReference=${orderReference}`
  );

  return response.data;
}

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

let cachedBanks: any[] | null = null;
let bankCacheExpiry: number | null = null;

export async function fetchBankCodes(): Promise<any[]> {
  // Check if credentials are configured
  if (!NOMBA_BASE_URL || !NOMBA_CLIENT_ID || !NOMBA_CLIENT_SECRET) {
    console.warn('[NOMBA] Credentials not configured, returning empty bank list');
    return [];
  }

  if (cachedBanks && bankCacheExpiry && Date.now() < bankCacheExpiry) {
    return cachedBanks;
  }

  try {
    const response = await nombaRequest('GET', '/v1/transfers/bank');
    cachedBanks = response.data;
    bankCacheExpiry = Date.now() + 24 * 60 * 60 * 1000;
    return cachedBanks;
  } catch (error: any) {
    console.error('[NOMBA] Failed to fetch bank codes:', error.message);
    return [];
  }
}

export async function lookupBankAccount(accountNumber: string, bankCode: string): Promise<any> {
  const response = await nombaRequest('POST', '/v1/transfers/bank/lookup', {
    accountNumber,
    bankCode,
  });
  return response.data;
}

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
