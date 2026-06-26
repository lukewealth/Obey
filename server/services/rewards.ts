import { Rewards } from '../models/Rewards';
import { Transaction } from '../models/Transaction';

export interface RewardEvent {
  userId: string;
  type: 'TRANSACTION' | 'REFERRAL' | 'STREAK' | 'MILESTONE' | 'DAILY_LOGIN' | 'KYC_COMPLETE';
  amount?: number;
  reference?: string;
  metadata?: Record<string, any>;
}

export class RewardsService {
  private static POINTS_PER_TRANSACTION = 10;
  private static POINTS_PER_NAIRA = 0.01;
  private static REFERRAL_BONUS = 500;
  private static DAILY_LOGIN_BONUS = 5;
  private static KYC_BONUS = 1000;

  static async processReward(event: RewardEvent): Promise<{
    pointsEarned: number;
    newBalance: number;
    level: number;
    tier: string;
    achievements: string[];
  }> {
    let rewards = await Rewards.findOne({ userId: event.userId } as any);
    
    if (!rewards) {
      rewards = new Rewards({ userId: event.userId });
    }

    let pointsEarned = 0;
    const achievements: string[] = [];

    switch (event.type) {
      case 'TRANSACTION':
        pointsEarned = this.calculateTransactionPoints(event.amount || 0);
        rewards.streak += 1;
        break;

      case 'REFERRAL':
        pointsEarned = this.REFERRAL_BONUS;
        rewards.referrals += 1;
        break;

      case 'DAILY_LOGIN':
        pointsEarned = this.DAILY_LOGIN_BONUS;
        break;

      case 'KYC_COMPLETE':
        pointsEarned = this.KYC_BONUS;
        break;

      case 'STREAK':
        pointsEarned = rewards.streak * 5;
        break;

      case 'MILESTONE':
        pointsEarned = this.calculateMilestoneBonus(rewards.totalEarned);
        break;
    }

    pointsEarned = Math.floor(pointsEarned * rewards.multiplier);

    rewards.points += pointsEarned;
    rewards.totalEarned += pointsEarned;
    rewards.lastActivity = new Date();

    rewards.history.push({
      type: 'EARNED',
      points: pointsEarned,
      reason: event.type,
      reference: event.reference,
    });

    const newAchievements = this.checkAchievements(rewards, event);
    achievements.push(...newAchievements);

    await rewards.save();

    return {
      pointsEarned,
      newBalance: rewards.points,
      level: rewards.level,
      tier: rewards.tier,
      achievements,
    };
  }

  private static calculateTransactionPoints(amount: number): number {
    const basePoints = this.POINTS_PER_TRANSACTION;
    const amountBonus = Math.floor(amount * this.POINTS_PER_NAIRA);
    return basePoints + amountBonus;
  }

  private static calculateMilestoneBonus(totalEarned: number): number {
    if (totalEarned >= 10000) return 2000;
    if (totalEarned >= 5000) return 1000;
    if (totalEarned >= 2000) return 500;
    if (totalEarned >= 1000) return 200;
    return 0;
  }

  private static checkAchievements(rewards: any, event: RewardEvent): string[] {
    const achievements: string[] = [];

    if (rewards.totalEarned >= 1000 && !rewards.achievements.find((a: any) => a.id === 'FIRST_THOUSAND')) {
      achievements.push('FIRST_THOUSAND');
      rewards.achievements.push({
        id: 'FIRST_THOUSAND',
        name: 'Thousand Club',
        description: 'Earned 1,000 points',
        earnedAt: new Date(),
        points: 100,
      });
    }

    if (rewards.streak >= 7 && !rewards.achievements.find((a: any) => a.id === 'WEEK_STREAK')) {
      achievements.push('WEEK_STREAK');
      rewards.achievements.push({
        id: 'WEEK_STREAK',
        name: 'Week Warrior',
        description: '7-day transaction streak',
        earnedAt: new Date(),
        points: 200,
      });
    }

    if (rewards.referrals >= 5 && !rewards.achievements.find((a: any) => a.id === 'SUPER_REFERRER')) {
      achievements.push('SUPER_REFERRER');
      rewards.achievements.push({
        id: 'SUPER_REFERRER',
        name: 'Super Referrer',
        description: 'Referred 5 friends',
        earnedAt: new Date(),
        points: 500,
      });
    }

    return achievements;
  }

  static async redeemPoints(userId: string, points: number, reason: string): Promise<{
    success: boolean;
    newBalance: number;
    message: string;
  }> {
    const rewards = await Rewards.findOne({ userId } as any);
    
    if (!rewards || rewards.points < points) {
      return {
        success: false,
        newBalance: rewards?.points || 0,
        message: 'Insufficient points',
      };
    }

    rewards.points -= points;
    rewards.totalRedeemed += points;
    rewards.history.push({
      type: 'REDEEMED',
      points,
      reason,
    });

    await rewards.save();

    return {
      success: true,
      newBalance: rewards.points,
      message: `Successfully redeemed ${points} points`,
    };
  }

  static async getUserRewards(userId: string): Promise<any> {
    const rewards = await Rewards.findOne({ userId } as any);
    
    if (!rewards) {
      return {
        points: 0,
        level: 1,
        tier: 'Bronze',
        totalEarned: 0,
        totalRedeemed: 0,
        streak: 0,
        achievements: [],
        badges: [],
        referralCode: null,
        referrals: 0,
      };
    }

    return rewards;
  }

  static async getLeaderboard(limit: number = 10): Promise<any[]> {
    return Rewards.find({} as any)
      .sort({ points: -1 })
      .limit(limit)
      .select('userId points level tier achievements')
      .lean();
  }

  static async applyMultiplier(userId: string, multiplier: number, duration: number): Promise<void> {
    await Rewards.findOneAndUpdate(
      { userId } as any,
      { 
        multiplier,
        $currentDate: { lastActivity: true }
      },
      { new: true } as any
    );

    setTimeout(async () => {
      await Rewards.findOneAndUpdate(
        { userId } as any,
        { multiplier: 1.0 },
        { new: true } as any
      );
    }, duration);
  }
}
