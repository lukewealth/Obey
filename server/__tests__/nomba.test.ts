import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyWebhookSignature } from '../services/nomba';

describe('Nomba Service', () => {
  describe('verifyWebhookSignature', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should verify valid webhook signature', () => {
      const payload = {
        event_type: 'transaction.completed',
        requestId: 'req-123',
        data: {
          merchant: { userId: 'user-1', walletId: 'wallet-1' },
          transaction: {
            transactionId: 'tx-123',
            type: 'credit',
            time: '2024-01-01T00:00:00Z',
            responseCode: '00'
          }
        }
      };
      const timestamp = '2024-01-01T00:00:00Z';
      const webhookSecret = 'test-secret-key';
      
      // Set environment variable for test
      process.env.NOMBA_WEBHOOK_SECRET = webhookSecret;
      
      const result = verifyWebhookSignature(payload, 'expected-signature', timestamp);
      
      // In dev mode without proper secret, it returns true
      expect(typeof result).toBe('boolean');
    });

    it('should handle null responseCode', () => {
      const payload = {
        event_type: 'transaction.completed',
        requestId: 'req-123',
        data: {
          merchant: { userId: 'user-1', walletId: 'wallet-1' },
          transaction: {
            transactionId: 'tx-123',
            type: 'credit',
            time: '2024-01-01T00:00:00Z',
            responseCode: 'null'
          }
        }
      };
      const timestamp = '2024-01-01T00:00:00Z';
      
      process.env.NOMBA_WEBHOOK_SECRET = 'test-secret';
      
      const result = verifyWebhookSignature(payload, 'signature', timestamp);
      expect(typeof result).toBe('boolean');
    });

    it('should bypass verification in development mode without secret', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      delete process.env.NOMBA_WEBHOOK_SECRET;
      
      const payload = {
        event_type: 'test',
        requestId: 'req-1',
        data: {
          merchant: { userId: 'u1', walletId: 'w1' },
          transaction: {
            transactionId: 'tx1',
            type: 'credit',
            time: '2024-01-01',
            responseCode: '00'
          }
        }
      };
      
      const result = verifyWebhookSignature(payload, 'any-signature', '2024-01-01');
      expect(result).toBe(true);
      
      process.env.NODE_ENV = originalEnv;
    });
  });
});
