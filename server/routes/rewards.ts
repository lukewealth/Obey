import express, { Request, Response } from 'express';
import { RewardsService } from '../services/rewards';
import { Rewards } from '../models/Rewards';

const router = express.Router();

router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const rewards = await RewardsService.getUserRewards(userId);
    res.json(rewards);
  } catch (error: any) {
    console.error('[REWARDS] Fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
});

router.post('/earn', async (req: Request, res: Response) => {
  try {
    const { userId, type, amount, reference } = req.body;

    if (!userId || !type) {
      return res.status(400).json({ error: 'userId and type required' });
    }

    const result = await RewardsService.processReward({
      userId,
      type,
      amount,
      reference,
    });

    res.json(result);
  } catch (error: any) {
    console.error('[REWARDS] Earn error:', error.message);
    res.status(500).json({ error: 'Failed to process reward' });
  }
});

router.post('/redeem', async (req: Request, res: Response) => {
  try {
    const { userId, points, reason } = req.body;

    if (!userId || !points) {
      return res.status(400).json({ error: 'userId and points required' });
    }

    const result = await RewardsService.redeemPoints(userId, points, reason);
    res.json(result);
  } catch (error: any) {
    console.error('[REWARDS] Redeem error:', error.message);
    res.status(500).json({ error: 'Failed to redeem points' });
  }
});

router.get('/leaderboard/:limit', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const leaderboard = await RewardsService.getLeaderboard(limit);
    res.json(leaderboard);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

router.post('/daily-login', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const rewards = await Rewards.findOne({ userId } as any);
    const lastLogin = rewards?.lastActivity ? new Date(rewards.lastActivity) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (lastLogin && lastLogin >= today) {
      return res.json({ 
        success: false, 
        message: 'Already claimed daily reward',
        points: rewards?.points || 0 
      });
    }

    const result = await RewardsService.processReward({
      userId,
      type: 'DAILY_LOGIN',
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process daily login' });
  }
});

export default router;
