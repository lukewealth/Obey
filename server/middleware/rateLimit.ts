import rateLimit from 'express-rate-limit';

// Strict rate limit for authentication endpoints (5 requests per minute)
export const authRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { error: 'Too many authentication attempts. Please try again in 1 minute.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
});

// Moderate rate limit for sensitive operations (10 requests per minute)
export const sensitiveRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Too many requests. Please try again in 1 minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Standard rate limit for general API endpoints (100 requests per 15 minutes)
export const standardRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
