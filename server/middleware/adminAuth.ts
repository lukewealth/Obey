import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

const ALLOWED_IPS = process.env.ALLOWED_ADMIN_IPS?.split(',') || [];

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // IP White-listing for production
    if (process.env.NODE_ENV === 'production' && ALLOWED_IPS.length > 0) {
      const clientIp = req.ip || req.socket.remoteAddress;
      if (clientIp && !ALLOWED_IPS.includes(clientIp)) {
        console.warn(`[SECURITY] Unauthorized IP attempt: ${clientIp}`);
        return res.status(403).json({ error: 'Geospatial node rejected. Access restricted.' });
      }
    }

    const identifier = (req.headers['x-admin-id'] || req.query.adminId) as string;
    
    if (!identifier) {
      return res.status(401).json({ error: 'Authentication required for institutional access.' });
    }

    const user = await User.findOne({ 
      $or: [{ supabaseId: identifier }, { email: identifier }] 
    } as any);

    if (!user) {
      return res.status(403).json({ error: 'Node not found in administrative mesh.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient credentials for institutional clearance.' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ error: 'Email verification required for administrative nodes.' });
    }

    // Attach user to request for further use
    (req as any).adminUser = user;
    next();
  } catch (error) {
    console.error('Admin Auth Error:', error);
    res.status(500).json({ error: 'Internal administrative protocol failure.' });
  }
};
