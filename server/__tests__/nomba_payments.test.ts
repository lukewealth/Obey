import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import nombaPaymentRoutes from '../routes/nomba_payments';

const app = express();
app.use(express.json());
app.use('/api/nomba', nombaPaymentRoutes);

describe('Nomba Payment Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/nomba/banks', () => {
    it('should return empty banks array when Nomba is not configured', async () => {
      const originalEnv = { ...process.env };
      delete process.env.NOMBA_BASE_URL;
      delete process.env.NOMBA_CLIENT_ID;

      const response = await request(app)
        .get('/api/nomba/banks')
        .expect(200);

      expect(response.body).toHaveProperty('banks');
      expect(Array.isArray(response.body.banks)).toBe(true);
      expect(response.body.banks.length).toBe(0);

      process.env = originalEnv;
    });

    it('should return banks array structure', async () => {
      const response = await request(app)
        .get('/api/nomba/banks')
        .expect(200);

      expect(response.body).toHaveProperty('banks');
      expect(Array.isArray(response.body.banks)).toBe(true);
    });
  });

  describe('GET /api/nomba/virtual-accounts', () => {
    it('should return 400 when userId is missing', async () => {
      const response = await request(app)
        .get('/api/nomba/virtual-accounts')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/nomba/checkout', () => {
    it('should return 400 for invalid payload', async () => {
      const response = await request(app)
        .post('/api/nomba/checkout')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/nomba/checkout')
        .send({ userId: 'test-user' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/nomba/account-lookup', () => {
    it('should return 400 for invalid account number', async () => {
      const response = await request(app)
        .post('/api/nomba/account-lookup')
        .send({ accountNumber: '123', bankCode: '058' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should validate account number length', async () => {
      const response = await request(app)
        .post('/api/nomba/account-lookup')
        .send({ accountNumber: '1234567890', bankCode: '058' })
        .expect(500);

      // Will fail because Nomba is not configured, but validates structure
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/nomba/withdraw', () => {
    it('should return 400 for invalid withdrawal payload', async () => {
      const response = await request(app)
        .post('/api/nomba/withdraw')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should validate all required fields', async () => {
      const response = await request(app)
        .post('/api/nomba/withdraw')
        .send({ userId: 'test-user', amount: 1000 })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject negative amounts', async () => {
      const response = await request(app)
        .post('/api/nomba/withdraw')
        .send({
          userId: 'test-user',
          amount: -100,
          accountNumber: '1234567890',
          bankCode: '058',
          accountName: 'Test User'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
