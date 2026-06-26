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
import cardRoutes from './routes/cards';
import webhookRoutes from './routes/webhooks';
import nombaPaymentRoutes from './routes/nomba_payments';
import aiRoutes from './routes/ai';
import rewardsRoutes from './routes/rewards';
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

// --- Institutional Database Guard ---
app.use(async (req, res, next) => {
  // Normalize path and remove leading/trailing slashes for precise mesh matching
  const path = req.path.toLowerCase().replace(/^\/+|\/+$/g, '');
  
  // Market and Health routes do not require the institutional database mesh
  const bypassRoutes = [
    'api/market', 
    'market', 
    'api/health', 
    'health',
    'api/sync/asset-sync',
    'sync/asset-sync',
    'api/webhooks',
    'webhooks'
  ];
  
  const shouldBypass = bypassRoutes.some(route => 
    path === route || path.startsWith(route + '/')
  );

  if (shouldBypass) {
    return next();
  }

  try {
    const db = await connectDB();
    if (!db) {
      console.warn(`[DB_GUARD_WARN] Database unavailable for ${req.method} ${req.path}. Proceeding without DB.`);
    }
    next();
  } catch (err: any) {
    console.error(`[DB_GUARD_CRITICAL] Node connectivity failure for ${req.method} ${req.path}:`, err.message);
    
    res.status(503).json({ 
      error: 'Institutional database node unavailable.',
      mesh_status: 're-routing',
      path: req.path,
      timestamp: new Date().toISOString(),
      message: process.env.NODE_ENV === 'development' ? err.message : 'The institutional data mesh is currently synchronizing or offline.'
    });
  }
});

// ... Dual-Path Routing Alignment ...
// This ensures routes work both with and without /api prefix for Vercel/Local compatibility.
const router = express.Router();

router.use('/vtu', vtuRoutes);
router.use('/sync', syncRoutes);
router.use('/giftcards', giftCardRoutes);
router.use('/crypto-market', cryptoMarketRoutes);
router.use('/market', marketRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/cards', cardRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/nomba', nombaPaymentRoutes);
router.use('/ai', aiRoutes);
router.use('/rewards', rewardsRoutes);

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

// --- Institutional Global Error Mesh ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`[MESH_CRITICAL_ERROR] Node crash on ${req.method} ${req.path}:`, err);
  
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: 'Institutional node failure',
    path: req.path,
    message: process.env.NODE_ENV === 'development' ? err.message : 'A critical failure occurred in the data mesh.',
    timestamp: new Date().toISOString()
  });
});

// For Vercel, we export the app. For local, we listen.
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`OBEY Backend listening on port ${port}`);
    });
  }).catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    console.log('Starting server without database connection...');
    app.listen(port, () => {
      console.log(`OBEY Backend listening on port ${port} (DB offline)`);
    });
  });
} else {
  connectDB().catch(err => console.error('[VERCEL_COLD_START] DB connection deferred:', err.message));
}

export default app;
