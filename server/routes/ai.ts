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

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { userId, message, context } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message required' });
    }

    const user = await User.findOne({ $or: [{ supabaseId: userId }, { email: userId }] } as any);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recentTransactions = await Transaction.find({ userId: user.supabaseId } as any)
      .sort({ createdAt: -1 })
      .limit(20);

    const prompt = buildChatPrompt(message, {
      balance: context?.balance || user.balance,
      transactions: recentTransactions,
      spendingPattern: context?.spendingPattern,
      userName: user.name,
      kycLevel: user.kycLevel,
    });

    let response: string;
    let metadata: any = {};

    if (process.env.GEMINI_API_KEY) {
      try {
        response = await callGeminiChat(prompt);
        const parsed = parseChatResponse(response);
        response = parsed.text;
        metadata = parsed.metadata;
      } catch (error) {
        response = generateFallbackChatResponse(message, context, user);
      }
    } else {
      response = generateFallbackChatResponse(message, context, user);
    }

    res.json({ response, metadata });
  } catch (error: any) {
    console.error('[AI_CHAT] Error:', error.message);
    res.status(500).json({ error: 'Chat failed' });
  }
});

function buildChatPrompt(message: string, context: any): string {
  const { balance, transactions, spendingPattern, userName, kycLevel } = context;

  const txSummary = transactions.slice(0, 10).map((tx: any) =>
    `- ${tx.type}: ₦${tx.amount.toLocaleString()} (${tx.category}) on ${tx.date}`
  ).join('\n');

  return `
You are an AI financial assistant for a fintech app called OBEY. Help the user with their finances.

User Context:
- Name: ${userName}
- Balance: ₦${balance.toLocaleString()}
- KYC Level: ${kycLevel}
- Recent Transactions:
${txSummary}
${spendingPattern ? `- 30-day spending: ₦${spendingPattern.totalSpent?.toLocaleString() || 0}
- Average daily: ₦${spendingPattern.avgDaily?.toLocaleString() || 0}` : ''}

User Message: ${message}

Respond helpfully and concisely. If analyzing transactions, provide insights. If detecting anomalies, flag unusual patterns. If predicting cash flow, give estimates with confidence levels.

Respond in JSON format:
{
  "text": "Your response text",
  "metadata": {
    "confidence": 0.0-1.0,
    "riskLevel": "LOW|MEDIUM|HIGH",
    "suggestions": ["suggestion1", "suggestion2"]
  }
}
`;
}

async function callGeminiChat(prompt: string): Promise<string> {
  const axios = require('axios');
  const response = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    { contents: [{ parts: [{ text: prompt }] }] },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY
      }
    }
  );
  return response.data.candidates[0].content.parts[0].text;
}

function parseChatResponse(text: string): { text: string; metadata: any } {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        text: parsed.text || text,
        metadata: parsed.metadata || {}
      };
    }
  } catch {}
  return { text, metadata: {} };
}

function generateFallbackChatResponse(message: string, context: any, user: any): string {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('spending') || lowerMsg.includes('analyze')) {
    const balance = context?.balance || user.balance;
    const spending = context?.spendingPattern?.totalSpent || 0;
    return `Based on your recent activity, your total spending is ₦${spending.toLocaleString()}. Your current balance is ₦${balance.toLocaleString()}. ${spending > balance * 0.5 ? 'Consider reducing discretionary spending.' : 'Your spending looks healthy.'}`;
  }

  if (lowerMsg.includes('anomal') || lowerMsg.includes('unusual')) {
    return 'I\'ve analyzed your recent transactions. No major anomalies detected. Continue monitoring for any unusual patterns.';
  }

  if (lowerMsg.includes('predict') || lowerMsg.includes('cash flow') || lowerMsg.includes('forecast')) {
    const avgDaily = context?.spendingPattern?.avgDaily || 0;
    const balance = context?.balance || user.balance;
    const daysLeft = Math.round(balance / (avgDaily || 1));
    return `Based on your spending patterns, your current balance should last approximately ${daysLeft} days. Average daily spending: ₦${avgDaily.toLocaleString()}.`;
  }

  if (lowerMsg.includes('budget') || lowerMsg.includes('save')) {
    return 'I recommend the 50/30/20 budget rule: 50% needs, 30% wants, 20% savings. Set up automatic transfers to build wealth consistently.';
  }

  return 'I can help you analyze transactions, detect anomalies, predict cash flow, and provide budget recommendations. What would you like to know?';
}

router.post('/behavioral-analysis', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const transactions = await Transaction.find({
      userId,
      createdAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
    } as any).sort({ createdAt: -1 });

    const patterns = analyzeBehavioralPatterns(transactions);

    res.json(patterns);
  } catch (error: any) {
    console.error('[AI_BEHAVIORAL] Error:', error.message);
    res.status(500).json({ error: 'Behavioral analysis failed' });
  }
});

function analyzeBehavioralPatterns(transactions: any[]) {
  const byHour: Record<number, number> = {};
  const byDay: Record<string, number> = {};
  const byCategory: Record<string, { amount: number; count: number }> = {};

  transactions.forEach(tx => {
    const date = new Date(tx.createdAt);
    const hour = date.getHours();
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const category = tx.category || 'Other';

    byHour[hour] = (byHour[hour] || 0) + tx.amount;
    byDay[day] = (byDay[day] || 0) + tx.amount;
    if (!byCategory[category]) byCategory[category] = { amount: 0, count: 0 };
    byCategory[category].amount += tx.amount;
    byCategory[category].count += 1;
  });

  const peakHour = Object.entries(byHour).sort((a, b) => b[1] - a[1])[0];
  const peakDay = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0];
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1].amount - a[1].amount)[0];

  const habits: string[] = [];
  if (peakHour) habits.push(`Most active at ${peakHour[0]}:00`);
  if (peakDay) habits.push(`Highest spending on ${peakDay[0]}s`);
  if (topCategory) habits.push(`Top category: ${topCategory[0]}`);

  const consistencyScore = Math.min(100, Math.round((transactions.length / 90) * 100));

  return {
    peakHour: peakHour ? parseInt(peakHour[0]) : null,
    peakDay: peakDay ? peakDay[0] : null,
    topCategory: topCategory ? topCategory[0] : null,
    habits,
    consistencyScore,
    totalTransactions: transactions.length,
    avgDailyTransactions: transactions.length / 90,
  };
}

router.post('/predictive-alerts', async (req: Request, res: Response) => {
  try {
    const { userId, balance } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const transactions = await Transaction.find({
      userId,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    } as any).sort({ createdAt: -1 });

    const alerts = generatePredictiveAlerts(transactions, balance);

    res.json({ alerts });
  } catch (error: any) {
    console.error('[AI_ALERTS] Error:', error.message);
    res.status(500).json({ error: 'Alert generation failed' });
  }
});

function generatePredictiveAlerts(transactions: any[], balance: number) {
  const alerts: any[] = [];
  const last30Days = transactions.filter(tx => {
    const txDate = new Date(tx.createdAt);
    return txDate >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  });

  const totalSpent = last30Days.filter(tx => tx.type === 'Debit').reduce((sum, tx) => sum + tx.amount, 0);
  const avgDailySpending = totalSpent / 30;
  const daysUntilZero = avgDailySpending > 0 ? Math.round(balance / avgDailySpending) : Infinity;

  if (daysUntilZero < 7 && daysUntilZero > 0) {
    alerts.push({
      type: 'WARNING',
      title: 'Low Balance Alert',
      message: `At current spending rate, balance will deplete in ${daysUntilZero} days`,
      severity: 'HIGH',
      daysUntilZero,
    });
  }

  const largeTransactions = last30Days.filter(tx => tx.amount > totalSpent / last30Days.length * 3);
  if (largeTransactions.length > 0) {
    alerts.push({
      type: 'ANOMALY',
      title: 'Unusual Activity',
      message: `${largeTransactions.length} transactions significantly above average detected`,
      severity: 'MEDIUM',
      count: largeTransactions.length,
    });
  }

  const failedTx = last30Days.filter(tx => tx.status === 'Failed');
  if (failedTx.length > 2) {
    alerts.push({
      type: 'ERROR',
      title: 'Transaction Failures',
      message: `${failedTx.length} failed transactions in the last 30 days`,
      severity: 'LOW',
      count: failedTx.length,
    });
  }

  if (balance < 10000) {
    alerts.push({
      type: 'CRITICAL',
      title: 'Critical Balance',
      message: 'Balance below ₦10,000. Consider adding funds.',
      severity: 'CRITICAL',
    });
  }

  return alerts;
}

export default router;
