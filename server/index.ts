import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import vtuRoutes from './routes/vtu';
import syncRoutes from './routes/sync';
import giftCardRoutes from './routes/giftcards';
import cryptoMarketRoutes from './routes/crypto_market';
import marketRoutes from './routes/market';
import paymentRoutes from './routes/payments';
import { connectDB } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// --- Security Middleware ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
})); // Enhanced security headers
app.use(cookieParser()); // Cookie support

// Enhanced CORS: Allow local dev and Vercel production/previews
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://obey-kappa.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is in the allowed list or is a Vercel preview URL
    const isAllowed = allowedOrigins.includes(origin) || 
                     origin.endsWith('.vercel.app');
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS_BLOCK] Request from blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));

// Rate Limiting: 1000 requests per 15 minutes per IP (Relaxed for development/prototype sync nodes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, 
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10kb' })); // Body limit to prevent large payload attacks

// --- Prompt Injection Prevention Middleware ---
const sanitizeInput = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const injectionPatterns = [
    /ignore previous instructions/i,
    /system prompt/i,
    /you are now/i,
    /DAN mode/i,
    /jailbreak/i
  ];

  const check = (val: any): boolean => {
    if (typeof val === 'string') {
      return injectionPatterns.some(pattern => pattern.test(val));
    }
    if (typeof val === 'object' && val !== null) {
      return Object.values(val).some(check);
    }
    return false;
  };

  if (check(req.body) || check(req.query)) {
    return res.status(400).json({ error: 'Potential malicious activity detected.' });
  }
  next();
};

app.use('/api/ai', sanitizeInput); // Apply only to AI endpoints if they exist

// Routes
app.use('/api/vtu', vtuRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/giftcards', giftCardRoutes);
app.use('/api/crypto-market', cryptoMarketRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: 'MongoDB Atlas Fallback Ready',
    timestamp: new Date().toISOString() 
  });
});

app.listen(port, () => {
  console.log(`OBEY Backend listening on port ${port}`);
});
