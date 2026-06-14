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

/**
 * Get real-time exchange rate for a specific asset pair.
 */
export const getExchangeRate = async (base: string, quote: string = 'USD') => {
  try {
    const response = await coinApi.get(`/exchangerate/${base}/${quote}`);
    return response.data;
  } catch (error) {
    console.error(`[CoinAPI_ERROR] Failed to fetch rate for ${base}:`, error);
    return null;
  }
};

/**
 * Get current exchange rates for all assets against a base asset.
 */
export const getAllRates = async (base: string = 'USD') => {
  try {
    const response = await coinApi.get(`/exchangerate/${base}`);
    return response.data;
  } catch (error) {
    console.error(`[CoinAPI_ERROR] Failed to fetch all rates for ${base}:`, error);
    return null;
  }
};

/**
 * Get comprehensive metadata for all assets.
 */
export const getAllAssets = async () => {
  try {
    const response = await coinApi.get('/assets');
    // Filter for cryptocurrencies and major fiat
    return response.data.filter((a: any) => a.type_is_crypto === 1 || ['USD', 'EUR', 'GBP', 'NGN'].includes(a.asset_id));
  } catch (error) {
    console.error(`[CoinAPI_ERROR] Failed to fetch assets:`, error);
    return [];
  }
};

/**
 * Get real-time symbols/pairs metadata.
 */
export const getSymbols = async (filter_asset_id: string = 'BTC') => {
  try {
    const response = await coinApi.get(`/symbols?filter_asset_id=${filter_asset_id}`);
    return response.data;
  } catch (error) {
    console.error(`[CoinAPI_ERROR] Failed to fetch symbols for ${filter_asset_id}:`, error);
    return [];
  }
};

/**
 * Get OHLCV historical data (candles).
 */
export const getHistoricalData = async (symbol: string, period: string = '1DAY', limit: number = 30) => {
  try {
    const response = await coinApi.get(`/ohlcv/${symbol}/latest?period_id=${period}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error(`[CoinAPI_ERROR] Failed to fetch history for ${symbol}:`, error);
    return [];
  }
};
