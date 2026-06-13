import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import vtuRoutes from './routes/vtu';
import syncRoutes from './routes/sync';
import { connectDB } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// --- Security Middleware ---
app.use(helmet()); // Basic security headers
app.use(cookieParser()); // Cookie support
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate Limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
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
