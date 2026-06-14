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
import adminRoutes from './routes/admin';
import { connectDB } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// --- Security Middleware ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
})); 
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://obey-kappa.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, 
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10kb' }));

// --- Dual-Path Routing Alignment ---
// This ensures routes work both with and without /api prefix for Vercel/Local compatibility.
const router = express.Router();

router.use('/vtu', vtuRoutes);
router.use('/sync', syncRoutes);
router.use('/giftcards', giftCardRoutes);
router.use('/crypto-market', cryptoMarketRoutes);
router.use('/market', marketRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);

router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: 'MongoDB Atlas Fallback Ready',
    timestamp: new Date().toISOString() 
  });
});

// Mount router on both root and /api for institutional redundancy
app.use('/api', router);
app.use('/', router);

// For Vercel, we export the app. For local, we listen.
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`OBEY Backend listening on port ${port}`);
    });
  }).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
} else {
  // Ensure DB connection is handled for serverless
  connectDB();
}

export default app;
