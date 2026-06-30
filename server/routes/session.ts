import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authRateLimit } from '../middleware/rateLimit';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'obey-dev-secret-key-change-in-production';
if (!process.env.JWT_SECRET) {
  console.warn('[SESSION_WARN] JWT_SECRET not configured. Using development fallback.');
}
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

interface SessionPayload {
  uid: string;
  email: string;
  iat?: number;
  exp?: number;
}

router.post('/set', authRateLimit, (req: Request, res: Response) => {
  try {
    const { uid, email } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: 'uid and email are required' });
    }

    const token = jwt.sign({ uid, email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('obey_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: SESSION_DURATION,
      path: '/',
    });

    res.json({ success: true });
  } catch (error) {
    console.error('[SESSION] Error setting session:', error);
    res.status(500).json({ error: 'Failed to set session' });
  }
});

router.get('/verify', (req: Request, res: Response) => {
  try {
    const token = req.cookies.obey_session;

    if (!token) {
      return res.status(401).json({ valid: false, error: 'No session token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as SessionPayload;

    res.json({
      valid: true,
      uid: decoded.uid,
      email: decoded.email,
    });
  } catch (error) {
    console.error('[SESSION] Error verifying session:', error);
    res.status(401).json({ valid: false, error: 'Invalid session' });
  }
});

router.post('/clear', (req: Request, res: Response) => {
  try {
    res.clearCookie('obey_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/',
    });

    res.json({ success: true });
  } catch (error) {
    console.error('[SESSION] Error clearing session:', error);
    res.status(500).json({ error: 'Failed to clear session' });
  }
});

export default router;
