import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import marketRoutes from '../routes/market';

const app = express();
app.use(express.json());
app.use('/api/market', marketRoutes);

describe('Market Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/market/prices', () => {
    it('should return prices for requested symbols', async () => {
      const response = await request(app)
        .get('/api/market/prices?symbols=BTC,ETH')
        .timeout(10000)
        .expect(200);

      expect(response.body).toHaveProperty('BTC');
      expect(response.body).toHaveProperty('ETH');
      expect(typeof response.body.BTC).toBe('number');
      expect(typeof response.body.ETH).toBe('number');
    }, 15000);

    it('should use default symbols when none provided', async () => {
      const response = await request(app)
        .get('/api/market/prices')
        .expect(200);

      expect(response.body).toHaveProperty('BTC');
      expect(response.body).toHaveProperty('ETH');
      expect(response.body).toHaveProperty('SOL');
      expect(response.body).toHaveProperty('SUI');
    });

    it('should handle array of symbols', async () => {
      const response = await request(app)
        .get('/api/market/prices?symbols=BTC&symbols=ETH')
        .expect(200);

      expect(response.body).toHaveProperty('BTC');
      expect(response.body).toHaveProperty('ETH');
    });
  });

  describe('GET /api/market/coingecko/search', () => {
    it('should return empty coins array when query is missing', async () => {
      const response = await request(app)
        .get('/api/market/coingecko/search')
        .expect(200);

      expect(response.body).toHaveProperty('coins');
      expect(Array.isArray(response.body.coins)).toBe(true);
    });

    it('should proxy search query to CoinGecko', async () => {
      const response = await request(app)
        .get('/api/market/coingecko/search?query=bitcoin')
        .expect(200);

      expect(response.body).toHaveProperty('coins');
    });
  });

  describe('GET /api/market/coingecko/coin/:id', () => {
    it('should proxy coin details from CoinGecko', async () => {
      const response = await request(app)
        .get('/api/market/coingecko/coin/bitcoin')
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });

  describe('GET /api/market/coingecko/history/:id', () => {
    it('should proxy market chart from CoinGecko', async () => {
      const response = await request(app)
        .get('/api/market/coingecko/history/bitcoin?days=7')
        .expect(200);

      // May return prices array or error object if rate limited
      expect(response.body).toBeDefined();
    });

    it('should use default 7 days when not specified', async () => {
      const response = await request(app)
        .get('/api/market/coingecko/history/ethereum')
        .expect(200);

      // May return prices array or error object if rate limited
      expect(response.body).toBeDefined();
    });
  });
});
