import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const {
  INTERSWITCH_CLIENT_ID,
  INTERSWITCH_CLIENT_SECRET,
  INTERSWITCH_PASSPORT_URL,
  INTERSWITCH_BASE_URL,
  INTERSWITCH_TERMINAL_ID,
} = process.env;

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getAccessToken(): Promise<string> {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const auth = Buffer.from(`${INTERSWITCH_CLIENT_ID}:${INTERSWITCH_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(
      INTERSWITCH_PASSPORT_URL!,
      'grant_type=client_credentials&scope=profile',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000; // Buffer of 60 seconds
    return cachedToken!;
  } catch (error: any) {
    console.error('Error fetching Interswitch token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Interswitch');
  }
}

export async function getBillers(categoryId: string = '4') {
  const token = await getAccessToken();
  try {
    const response = await axios.get(`${INTERSWITCH_BASE_URL}/services?categoryId=${categoryId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching billers:', error.response?.data || error.message);
    throw error;
  }
}

export async function getPaymentItems(serviceId: string) {
  const token = await getAccessToken();
  try {
    const response = await axios.get(`${INTERSWITCH_BASE_URL}/services/options?serviceid=${serviceId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching payment items:', error.response?.data || error.message);
    throw error;
  }
}

export async function validateCustomer(customerId: string, paymentCode: string) {
  const token = await getAccessToken();
  try {
    const response = await axios.post(
      `${INTERSWITCH_BASE_URL}/Transactions/validatecustomers`,
      {
        customers: [{ customerId, paymentCode }],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error validating customer:', error.response?.data || error.message);
    throw error;
  }
}

export async function processRecharge(params: {
  paymentCode: string;
  customerId: string;
  amount: number;
  requestReference: string;
}) {
  const token = await getAccessToken();
  try {
    const response = await axios.post(
      `${INTERSWITCH_BASE_URL}/Transactions`,
      {
        TerminalId: INTERSWITCH_TERMINAL_ID,
        paymentCode: params.paymentCode,
        customerId: params.customerId,
        amount: params.amount,
        requestReference: params.requestReference,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error processing recharge:', error.response?.data || error.message);
    throw error;
  }
}
