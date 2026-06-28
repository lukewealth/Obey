import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import webhookRoutes from './webhooks';
import { WebhookEvent } from '../models/WebhookEvent';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import * as nomba from '../services/nomba';

vi.mock('../models/WebhookEvent');
vi.mock('../models/Transaction');
vi.mock('../models/User');
vi.mock('../services/nomba');

describe('Webhook Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/webhooks', webhookRoutes);
  });

  describe('POST /webhooks/nomba', () => {
    it('should reject invalid payload', async () => {
      const res = await request(app)
        .post('/webhooks/nomba')
        .send({});

      expect(res.status).toBe(400);
      expect(res.text).toBe('Invalid payload');
    });

    it('should reject invalid signature', async () => {
      vi.mocked(nomba.verifyWebhookSignature).mockReturnValue(false);

      const res = await request(app)
        .post('/webhooks/nomba')
        .set('nomba-signature', 'invalid')
        .set('nomba-timestamp', '2024-01-01')
        .send({
          event_type: 'payment_success',
          requestId: 'req-123',
          data: { transaction: {}, order: {} }
        });

      expect(res.status).toBe(401);
      expect(res.text).toBe('Invalid signature');
    });

    it('should ignore duplicate events', async () => {
      vi.mocked(nomba.verifyWebhookSignature).mockReturnValue(true);
      vi.mocked(WebhookEvent.findOne).mockResolvedValue({ eventId: 'req-123' } as any);

      const res = await request(app)
        .post('/webhooks/nomba')
        .set('nomba-signature', 'valid')
        .set('nomba-timestamp', '2024-01-01')
        .send({
          event_type: 'payment_success',
          requestId: 'req-123',
          data: { transaction: {}, order: {} }
        });

      expect(res.status).toBe(200);
      expect(res.text).toBe('Already processed');
    });

    it('should process payment_success event', async () => {
      vi.mocked(nomba.verifyWebhookSignature).mockReturnValue(true);
      vi.mocked(WebhookEvent.findOne).mockResolvedValue(null);
      vi.mocked(WebhookEvent.prototype.save).mockResolvedValue({} as any);
      vi.mocked(Transaction.findOne).mockResolvedValue(null);
      vi.mocked(Transaction.create).mockResolvedValue({} as any);
      vi.mocked(User.findOneAndUpdate).mockResolvedValue({ balance: 1000 } as any);

      const payload = {
        event_type: 'payment_success',
        requestId: 'req-123',
        data: {
          transaction: {
            transactionId: 'tx-1',
            transactionAmount: 5000,
            fee: 50,
            responseCode: '00'
          },
          order: {
            orderReference: 'order-1',
            orderMetaData: { userId: 'user-1' },
            paymentMethod: 'card_payment'
          }
        }
      };

      const res = await request(app)
        .post('/webhooks/nomba')
        .set('nomba-signature', 'valid')
        .set('nomba-timestamp', '2024-01-01')
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.text).toBe('OK');
      expect(WebhookEvent.prototype.save).toHaveBeenCalled();
      expect(Transaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          amount: 5000,
          type: 'Credit',
          status: 'Success'
        })
      );
      expect(User.findOneAndUpdate).toHaveBeenCalled();
    });

    it('should process payment_failed event', async () => {
      vi.mocked(nomba.verifyWebhookSignature).mockReturnValue(true);
      vi.mocked(WebhookEvent.findOne).mockResolvedValue(null);
      vi.mocked(WebhookEvent.prototype.save).mockResolvedValue({} as any);
      vi.mocked(Transaction.findOne).mockResolvedValue({
        status: 'Processing',
        save: vi.fn().mockResolvedValue({})
      } as any);

      const payload = {
        event_type: 'payment_failed',
        requestId: 'req-456',
        data: {
          transaction: {
            transactionId: 'tx-2',
            responseCode: '01'
          },
          order: {
            orderReference: 'order-2'
          }
        }
      };

      const res = await request(app)
        .post('/webhooks/nomba')
        .set('nomba-signature', 'valid')
        .set('nomba-timestamp', '2024-01-01')
        .send(payload);

      expect(res.status).toBe(200);
      expect(Transaction.findOne).toHaveBeenCalled();
    });

    it('should process payout_failed event and refund', async () => {
      vi.mocked(nomba.verifyWebhookSignature).mockReturnValue(true);
      vi.mocked(WebhookEvent.findOne).mockResolvedValue(null);
      vi.mocked(WebhookEvent.prototype.save).mockResolvedValue({} as any);
      vi.mocked(Transaction.findOne).mockResolvedValue({
        userId: 'user-1',
        status: 'Processing',
        save: vi.fn().mockResolvedValue({})
      } as any);
      vi.mocked(User.findOneAndUpdate).mockResolvedValue({ balance: 5000 } as any);
      vi.mocked(Transaction.create).mockResolvedValue({} as any);

      const payload = {
        event_type: 'payout_failed',
        requestId: 'req-789',
        data: {
          transaction: {
            transactionId: 'tx-3',
            merchantTxRef: 'WTH-001',
            transactionAmount: 5000,
            responseCode: '01'
          }
        }
      };

      const res = await request(app)
        .post('/webhooks/nomba')
        .set('nomba-signature', 'valid')
        .set('nomba-timestamp', '2024-01-01')
        .send(payload);

      expect(res.status).toBe(200);
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          $inc: { balance: 5000 }
        }),
        expect.any(Object)
      );
      expect(Transaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Withdrawal Refund',
          type: 'Credit',
          amount: 5000
        })
      );
    });
  });
});
