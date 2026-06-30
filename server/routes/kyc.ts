import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import { v4 as uuidv4 } from 'uuid';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// KYC Tier definitions
const KYC_TIERS = {
  1: {
    name: 'Standard',
    limits: {
      dailyTransfer: 100000,
      monthlyTransfer: 1000000,
      maxCardBalance: 50000,
      features: ['Basic transfers', 'Airtime/Data', 'Virtual card']
    }
  },
  2: {
    name: 'Verified',
    limits: {
      dailyTransfer: 500000,
      monthlyTransfer: 5000000,
      maxCardBalance: 200000,
      features: ['All Standard features', 'P2P Trading', 'Gift cards', 'Higher limits']
    }
  },
  3: {
    name: 'Premium',
    limits: {
      dailyTransfer: 2000000,
      monthlyTransfer: 20000000,
      maxCardBalance: 500000,
      features: ['All Verified features', 'Priority support', 'Institutional cards', 'API access']
    }
  },
  4: {
    name: 'Institutional',
    limits: {
      dailyTransfer: 10000000,
      monthlyTransfer: 100000000,
      maxCardBalance: 2000000,
      features: ['All Premium features', 'Dedicated account manager', 'Custom limits', 'White-glove service']
    }
  }
};

// Get user's KYC tier and limits
router.get('/tier/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const user = await User.findOne({ $or: [{ supabaseId: userId }, { email: userId }] } as any);
    
    if (!user) {
      // Return default tier for new users
      return res.json({
        success: true,
        tier: 1,
        tierName: 'Standard',
        limits: KYC_TIERS[1].limits,
        kycStatus: 'Unverified',
        isEmailVerified: false
      });
    }

    const tier = user.kycLevel || 1;
    const tierInfo = KYC_TIERS[tier as keyof typeof KYC_TIERS] || KYC_TIERS[1];

    res.json({
      success: true,
      tier,
      tierName: tierInfo.name,
      limits: tierInfo.limits,
      kycStatus: user.kycStatus || 'Unverified',
      isEmailVerified: user.isEmailVerified || false
    });
  } catch (error: any) {
    console.error('[KYC_TIER_ERROR]', error.message);
    // Return default tier on error
    res.json({
      success: true,
      tier: 1,
      tierName: 'Standard',
      limits: KYC_TIERS[1].limits,
      kycStatus: 'Unverified',
      isEmailVerified: false
    });
  }
});

// Request KYC upgrade
router.post('/request-upgrade', async (req: Request, res: Response) => {
  try {
    const { userId, requestedTier, documents } = req.body;
    
    if (!userId || !requestedTier) {
      return res.status(400).json({ error: 'User ID and requested tier required' });
    }
    
    const user = await User.findOne({ $or: [{ supabaseId: userId }, { email: userId }] } as any);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.kycLevel >= requestedTier) {
      return res.status(400).json({ error: 'User already at or above requested tier' });
    }

    // Create KYC upgrade request
    user.kycStatus = 'Pending';
    user.kycUpgradeRequest = {
      requestedTier,
      documents: documents || [],
      requestedAt: new Date(),
      status: 'pending'
    };
    await user.save();

    // Create transaction record
    const tx = new Transaction({
      id: uuidv4(),
      userId: user.supabaseId,
      title: `KYC Upgrade Request - Tier ${requestedTier}`,
      category: 'Transfer',
      type: 'Debit',
      amount: 0,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Processing',
      requestReference: `KYC-${uuidv4().substring(0, 8).toUpperCase()}`
    });
    await tx.save();

    res.json({
      success: true,
      message: 'KYC upgrade request submitted. Awaiting admin approval.',
      requestId: tx.id
    });
  } catch (error: any) {
    console.error('[KYC_UPGRADE_ERROR]', error.message);
    res.status(500).json({ error: error.message || 'Failed to submit upgrade request' });
  }
});

// Admin: Approve KYC upgrade
router.post('/admin/approve', adminAuth, async (req: Request, res: Response) => {
  try {
    const { userId, newTier } = req.body;
    const adminId = (req as any).adminUser.supabaseId;

    const user = await User.findOne({ $or: [{ supabaseId: userId }, { email: userId }] } as any);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.kycLevel = newTier;
    user.kycStatus = 'Verified';
    user.kycUpgradeRequest = {
      ...user.kycUpgradeRequest,
      status: 'approved',
      approvedAt: new Date(),
      approvedBy: adminId
    };
    await user.save();

    // Create approval transaction
    const tx = new Transaction({
      id: uuidv4(),
      userId: user.supabaseId,
      title: `KYC Upgraded to Tier ${newTier}`,
      category: 'Transfer',
      type: 'Credit',
      amount: 0,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Success',
      requestReference: `KYC-APPROVED-${uuidv4().substring(0, 8).toUpperCase()}`
    });
    await tx.save();

    res.json({
      success: true,
      message: `User upgraded to Tier ${newTier}`,
      newTier,
      tierName: KYC_TIERS[newTier as keyof typeof KYC_TIERS].name
    });
  } catch (error: any) {
    console.error('[KYC_APPROVE_ERROR]', error.message);
    res.status(500).json({ error: 'Failed to approve KYC upgrade' });
  }
});

// Admin: Reject KYC upgrade
router.post('/admin/reject', adminAuth, async (req: Request, res: Response) => {
  try {
    const { userId, reason } = req.body;
    const adminId = (req as any).adminUser.supabaseId;

    const user = await User.findOne({ $or: [{ supabaseId: userId }, { email: userId }] } as any);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.kycStatus = 'Rejected';
    user.kycUpgradeRequest = {
      ...user.kycUpgradeRequest,
      status: 'rejected',
      rejectedAt: new Date(),
      rejectedBy: adminId,
      reason
    };
    await user.save();

    res.json({
      success: true,
      message: 'KYC upgrade request rejected'
    });
  } catch (error: any) {
    console.error('[KYC_REJECT_ERROR]', error.message);
    res.status(500).json({ error: 'Failed to reject KYC upgrade' });
  }
});

// Get pending KYC requests (admin)
router.get('/admin/pending', adminAuth, async (req: Request, res: Response) => {
  try {

    const pendingUsers = await User.find({ 
      'kycUpgradeRequest.status': 'pending' 
    } as any).select('name email kycLevel kycUpgradeRequest');

    res.json({
      success: true,
      count: pendingUsers.length,
      requests: pendingUsers
    });
  } catch (error: any) {
    console.error('[KYC_PENDING_ERROR]', error.message);
    res.status(500).json({ error: 'Failed to fetch pending requests' });
  }
});

export default router;
