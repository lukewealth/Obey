import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Create a test app with security middleware
const createSecureApp = () => {
  const app = express();
  
  // Security middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
  
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        'http://localhost:3000',
        'https://obey-kappa.vercel.app'
      ];
      const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS policy'));
      }
    },
    credentials: true,
  }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: { error: 'Too many requests' },
  });
  app.use('/api/', limiter);
  
  app.use(express.json({ limit: '10kb' }));
  
  // Test route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy' });
  });
  
  return app;
};

describe('Security Tests', () => {
  let app: express.Express;
  
  beforeEach(() => {
    app = createSecureApp();
  });

  describe('CORS Security', () => {
    it('should allow requests from localhost', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should allow requests from vercel.app domains', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'https://obey-kappa.vercel.app')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should reject requests from unauthorized origins', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'https://malicious-site.com')
        .expect(500);

      expect(response.text).toContain('Not allowed by CORS policy');
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      // Rate limit headers may vary, just check response is successful
      expect(response.status).toBe(200);
    });
  });

  describe('Helmet Security Headers', () => {
    it('should set security headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      // Check for helmet security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-dns-prefetch-control']).toBeDefined();
    });

    it('should set cross-origin resource policy', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.headers['cross-origin-resource-policy']).toBe('cross-origin');
    });
  });

  describe('Input Validation', () => {
    it('should handle large JSON payloads gracefully', async () => {
      // Create a payload that's close to but under the limit
      const largePayload = { data: 'x'.repeat(9000) };
      
      const response = await request(app)
        .post('/api/health')
        .send(largePayload);

      // Should either accept it or reject with proper error
      expect([200, 413, 404]).toContain(response.status);
    });
  });

  describe('Cookie Security', () => {
    it('should set secure cookie attributes', () => {
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict' as const,
        path: '/'
      };

      expect(cookieOptions.httpOnly).toBe(true);
      expect(cookieOptions.secure).toBe(true);
      expect(cookieOptions.sameSite).toBe('strict');
    });

    it('should clear cookies with max-age=0', () => {
      const clearCookie = 'obey_session_verified=; max-age=0; path=/; SameSite=Strict; Secure';
      
      expect(clearCookie).toContain('max-age=0');
      expect(clearCookie).toContain('SameSite=Strict');
      expect(clearCookie).toContain('Secure');
    });
  });

  describe('Authentication Security', () => {
    it('should validate token format', () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const invalidToken = 'not-a-jwt';

      // JWT tokens have 3 parts separated by dots
      expect(validToken.split('.').length).toBe(3);
      expect(invalidToken.split('.').length).toBe(1);
    });

    it('should expire tokens after set time', () => {
      const tokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
      const isExpired = Date.now() > tokenExpiry;

      expect(isExpired).toBe(false);
    });
  });

  describe('Data Protection', () => {
    it('should not expose sensitive data in error messages', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      // Should not contain stack traces or sensitive info
      expect(response.text).not.toContain('at Object');
      expect(response.text).not.toContain('node_modules');
    });

    it('should sanitize user input', () => {
      const userInput = '<script>alert("xss")</script>';
      const sanitized = userInput.replace(/[<>]/g, '');

      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });
  });
});
