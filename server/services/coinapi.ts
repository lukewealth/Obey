import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.COINAPI_KEY;
const BASE_URL = 'https://rest.coinapi.io/v1';

const coinApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-CoinAPI-Key': API_KEY
  }
});

export const getExchangeRate = async (base: string, quote: string = 'USD') => {
  try {
    const response = await coinApi.get(`/exchangerate/${base}/${quote}`);
    return response.data;
  } catch (error) {
    console.error(`[CoinAPI_ERROR] Failed to fetch rate for ${base}:`, error);
    return null;
  }
};

export const getMultipleRates = async (base: string = 'USD', assets: string[]) => {
  try {
    // CoinAPI documentation says we can get all rates for a base
    const response = await coinApi.get(`/exchangerate/${base}`);
    const rates = response.data.rates;
    
    // Filter only the requested assets
    return rates.filter((r: any) => assets.includes(r.asset_id_quote));
  } catch (error) {
    console.error(`[CoinAPI_ERROR] Failed to fetch multiple rates:`, error);
    return [];
  }
};
