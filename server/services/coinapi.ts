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

export const getAllAssets = async () => {
  try {
    const response = await coinApi.get('/assets');
    // CoinAPI returns a massive list. We filter for cryptocurrencies (type_is_crypto=1)
    return response.data.filter((a: any) => a.type_is_crypto === 1);
  } catch (error) {
    console.error(`[CoinAPI_ERROR] Failed to fetch assets:`, error);
    return [];
  }
};
