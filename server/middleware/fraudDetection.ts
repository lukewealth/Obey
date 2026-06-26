import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import crypto from 'crypto';

export interface FraudCheckResult {
  passed: boolean;
  riskScore: number;
  riskLevel: string;
  flags: string[];
  requiresAction: boolean;
  action?: string;
  hash: string;
}

export async function fraudDetectionMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, amount, type, recipientWallet, network } = req.body;

    if (!userId || !amount) {
      return next();
    }

    const user = await User.findOne({ $or: [{ supabaseId: userId }, { email: userId }] } as any);
    if (!user) {
      return next();
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const userTransactions = await Transaction.find({
      userId: user.supabaseId,
      createdAt: { $gte: thirtyDaysAgo }
    } as any);

    const avgAmount = userTransactions.length > 0
      ? userTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0) / userTransactions.length
      : 0;

    const failedCount = userTransactions.filter(tx => tx.status === 'Failed').length;

    const fraudAnalysis = await aiService.analyzeTransactionFraud({
      amount,
      userId: user.supabaseId,
      type: type || 'transfer',
      recipientWallet,
      network,
      timeOfDay: now.getHours(),
      userHistory: {
        avgTransactionAmount: avgAmount,
        transactionCount30Days: userTransactions.length,
        failedTransactions30Days: failedCount,
        kycLevel: user.kycLevel || 0,
      },
    });

    const hashPayload = `${userId}:${amount}:${type}:${Date.now()}:${fraudAnalysis.riskScore}`;
    const hash = crypto.createHash('sha256').update(hashPayload).digest('hex');

    const result: FraudCheckResult = {
      passed: fraudAnalysis.riskLevel !== 'CRITICAL',
      riskScore: fraudAnalysis.riskScore,
      riskLevel: fraudAnalysis.riskLevel,
      flags: fraudAnalysis.flags,
      requiresAction: fraudAnalysis.riskLevel === 'HIGH' || fraudAnalysis.riskLevel === 'CRITICAL',
      action: fraudAnalysis.recommendations[0],
      hash,
    };

    (req as any).fraudCheck = result;

    if (fraudAnalysis.riskLevel === 'CRITICAL') {
      return res.status(403).json({
        error: 'Transaction blocked due to high fraud risk',
        riskScore: fraudAnalysis.riskScore,
        flags: fraudAnalysis.flags,
        recommendations: fraudAnalysis.recommendations,
        hash,
      });
    }

    if (fraudAnalysis.riskLevel === 'HIGH') {
      (req as any).requiresVerification = true;
    }

    next();
  } catch (error: any) {
    console.error('[FRAUD_DETECTION] Error:', error.message);
    next();
  }
}

export function generateTransactionHash(transaction: any): string {
  const payload = [
    transaction.id,
    transaction.userId,
    transaction.amount,
    transaction.type,
    transaction.date,
    transaction.time,
    transaction.requestReference || '',
    Date.now(),
  ].join(':');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

export function verifyTransactionHash(transaction: any, hash: string): boolean {
  const expectedHash = generateTransactionHash(transaction);
  return expectedHash === hash;
}

export async function logFraudAlert(
  userId: string,
  transactionId: string,
  riskScore: number,
  flags: string[],
  hash: string
) {
  const { FraudAlert } = await import('../models/FraudAlert');
  
  await FraudAlert.create({
    userId,
    transactionId,
    riskScore,
    flags,
    hash,
    status: 'PENDING_REVIEW',
    createdAt: new Date(),
  });
}
