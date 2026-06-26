import express, { Request, Response } from 'express';
import { aiService } from '../services/ai';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';

const router = express.Router();

router.post('/insights', async (req: Request, res: Response) => {
  try {
    const { userId, transactions, balance } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const userTransactions = transactions || await Transaction.find({ 
      userId,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    } as any).sort({ createdAt: -1 }).limit(50);

    const categories: Record<string, { amount: number; count: number; percentage: number }> = {};
    let totalSpent = 0;

    userTransactions.forEach((tx: any) => {
      if (tx.type === 'Debit') {
        const category = tx.category || 'Other';
        if (!categories[category]) {
          categories[category] = { amount: 0, count: 0, percentage: 0 };
        }
        categories[category].amount += tx.amount;
        categories[category].count += 1;
        totalSpent += tx.amount;
      }
    });

    Object.keys(categories).forEach(key => {
      categories[key].percentage = totalSpent > 0 
        ? (categories[key].amount / totalSpent) * 100 
        : 0;
    });

    const last30Days = userTransactions.filter((tx: any) => 
      new Date(tx.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    const last15Days = userTransactions.filter((tx: any) => 
      new Date(tx.createdAt) > new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    );

    const spent30Days = last30Days.filter((tx: any) => tx.type === 'Debit').reduce((sum, tx) => sum + tx.amount, 0);
    const spent15Days = last15Days.filter((tx: any) => tx.type === 'Debit').reduce((sum, tx) => sum + tx.amount, 0);

    const spendingTrend = spent30Days > 0 
      ? Math.round(((spent15Days * 2 - spent30Days) / spent30Days) * 100)
      : 0;

    const savingsScore = Math.max(0, Math.min(100, Math.round(
      (balance / (spent30Days || 1)) * 100
    )));

    const anomalies: any[] = [];
    const avgTransaction = spent30Days / (last30Days.length || 1);
    
    userTransactions.forEach((tx: any) => {
      if (tx.amount > avgTransaction * 3 && tx.type === 'Debit') {
        anomalies.push({
          title: 'Large Transaction Detected',
          description: `Transaction of ₦${tx.amount.toLocaleString()} is ${Math.round(tx.amount / avgTransaction)}x your average`,
        });
      }
    });

    const recommendations: string[] = [];
    
    if (spendingTrend > 20) {
      recommendations.push('Your spending has increased significantly. Consider reviewing your budget.');
    }
    
    if (savingsScore < 30) {
      recommendations.push('Your savings rate is low. Try to save at least 20% of your income.');
    }
    
    const topCategory = Object.entries(categories).sort((a, b) => b[1].amount - a[1].amount)[0];
    if (topCategory) {
      recommendations.push(`Your highest spending category is ${topCategory[0]}. Look for ways to optimize.`);
    }
    
    if (userTransactions.length < 5) {
      recommendations.push('Use Obey more frequently to get personalized insights and earn rewards.');
    }

    recommendations.push('Set up automatic savings to build your wealth consistently.');
    recommendations.push('Take advantage of our rewards program to earn points on every transaction.');

    const riskLevel = anomalies.length > 2 ? 'HIGH' : anomalies.length > 0 ? 'MEDIUM' : 'LOW';

    res.json({
      spendingTrend,
      savingsScore,
      riskLevel,
      categories,
      recommendations: recommendations.slice(0, 5),
      anomalies: anomalies.slice(0, 3),
      totalSpent,
      totalTransactions: userTransactions.length,
    });
  } catch (error: any) {
    console.error('[AI_INSIGHTS] Error:', error.message);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

router.post('/fraud-check', async (req: Request, res: Response) => {
  try {
    const { transaction, userHistory } = req.body;

    const analysis = await aiService.analyzeTransactionFraud({
      ...transaction,
      userHistory,
    });

    res.json(analysis);
  } catch (error: any) {
    console.error('[AI_FRAUD_CHECK] Error:', error.message);
    res.status(500).json({ error: 'Fraud check failed' });
  }
});

router.post('/categorize', async (req: Request, res: Response) => {
  try {
    const { description, amount } = req.body;
    const category = await aiService.categorizeTransaction(description, amount);
    res.json({ category });
  } catch (error: any) {
    res.status(500).json({ error: 'Categorization failed' });
  }
});

router.post('/cashflow-prediction', async (req: Request, res: Response) => {
  try {
    const { history, days } = req.body;
    const prediction = await aiService.predictCashFlow(history, days || 30);
    res.json(prediction);
  } catch (error: any) {
    res.status(500).json({ error: 'Prediction failed' });
  }
});

export default router;
