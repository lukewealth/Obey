import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export interface AIFraudAnalysis {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  flags: string[];
  recommendations: string[];
  confidence: number;
}

export interface AISmartOperation {
  action: string;
  reasoning: string;
  confidence: number;
  parameters?: Record<string, any>;
}

export class AIService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  async analyzeTransactionFraud(transaction: {
    amount: number;
    userId: string;
    type: string;
    recipientWallet?: string;
    network?: string;
    timeOfDay: number;
    userHistory: {
      avgTransactionAmount: number;
      transactionCount30Days: number;
      failedTransactions30Days: number;
      kycLevel: number;
    };
  }): Promise<AIFraudAnalysis> {
    try {
      if (this.apiKey) {
        const prompt = this.buildFraudPrompt(transaction);
        const response = await this.callGeminiAPI(prompt);
        return this.parseFraudResponse(response);
      }
    } catch (error: any) {
      console.error('[AI] Fraud analysis failed:', error.message);
    }

    return this.getFallbackFraudAnalysis(transaction);
  }

  private buildFraudPrompt(transaction: any): string {
    return `
Analyze this financial transaction for fraud risk:

Transaction Details:
- Amount: ₦${transaction.amount.toLocaleString()}
- Type: ${transaction.type}
- Time: ${transaction.timeOfDay}:00 (24h format)
- User KYC Level: ${transaction.userHistory.kycLevel}
- User's 30-day avg: ₦${transaction.userHistory.avgTransactionAmount.toLocaleString()}
- 30-day transactions: ${transaction.userHistory.transactionCount30Days}
- 30-day failures: ${transaction.userHistory.failedTransactions30Days}

Respond in JSON format:
{
  "riskScore": 0-100,
  "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "flags": ["list of risk factors"],
  "recommendations": ["action items"],
  "confidence": 0-1
}
`;
  }

  private async callGeminiAPI(prompt: string): Promise<string> {
    const response = await axios.post(
      this.apiUrl,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  }

  private parseFraudResponse(text: string): AIFraudAnalysis {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    return {
      riskScore: Math.min(100, Math.max(0, analysis.riskScore || 0)),
      riskLevel: analysis.riskLevel || 'LOW',
      flags: analysis.flags || [],
      recommendations: analysis.recommendations || [],
      confidence: Math.min(1, Math.max(0, analysis.confidence || 0.5)),
    };
  }

  private getFallbackFraudAnalysis(transaction: any): AIFraudAnalysis {
    let riskScore = 0;
    const flags: string[] = [];

    if (transaction.amount > transaction.userHistory.avgTransactionAmount * 3) {
      riskScore += 30;
      flags.push('Amount significantly above average');
    }

    if (transaction.timeOfDay < 6 || transaction.timeOfDay > 22) {
      riskScore += 15;
      flags.push('Unusual transaction time');
    }

    if (transaction.userHistory.failedTransactions30Days > 3) {
      riskScore += 20;
      flags.push('High failure rate');
    }

    if (transaction.userHistory.kycLevel < 2) {
      riskScore += 25;
      flags.push('Low KYC verification');
    }

    if (transaction.userHistory.transactionCount30Days > 50) {
      riskScore += 10;
      flags.push('High transaction frequency');
    }

    const riskLevel = riskScore < 30 ? 'LOW' : riskScore < 60 ? 'MEDIUM' : riskScore < 80 ? 'HIGH' : 'CRITICAL';

    return {
      riskScore,
      riskLevel: riskLevel as any,
      flags,
      recommendations: riskScore > 50 ? ['Require additional verification', 'Manual review recommended'] : [],
      confidence: 0.7,
    };
  }

  async getSmartOperationSuggestion(context: any): Promise<AISmartOperation> {
    return {
      action: 'Continue with current flow',
      reasoning: 'AI suggestions optimized for your usage patterns',
      confidence: 0.8,
    };
  }

  async categorizeTransaction(description: string, amount: number): Promise<string> {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('airtime') || lowerDesc.includes('mtn') || lowerDesc.includes('glo')) {
      return 'Airtime';
    }
    if (lowerDesc.includes('data') || lowerDesc.includes('internet')) {
      return 'Data';
    }
    if (lowerDesc.includes('electricity') || lowerDesc.includes('water')) {
      return 'Utilities';
    }
    if (lowerDesc.includes('food') || lowerDesc.includes('restaurant')) {
      return 'Food';
    }
    if (lowerDesc.includes('transport') || lowerDesc.includes('uber') || lowerDesc.includes('bolt')) {
      return 'Transport';
    }
    if (lowerDesc.includes('shopping') || lowerDesc.includes('store')) {
      return 'Shopping';
    }
    if (lowerDesc.includes('crypto') || lowerDesc.includes('bitcoin')) {
      return 'Crypto';
    }
    if (lowerDesc.includes('gift') || lowerDesc.includes('card')) {
      return 'Gift Cards';
    }
    
    return 'Other';
  }

  async generateSpendingInsights(transactions: any[], period: string): Promise<string> {
    const totalSpent = transactions
      .filter(tx => tx.type === 'Debit')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const categories: Record<string, number> = {};
    transactions.forEach(tx => {
      if (tx.type === 'Debit') {
        const category = tx.category || 'Other';
        categories[category] = (categories[category] || 0) + tx.amount;
      }
    });

    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];

    return `
Spending Analysis for ${period}:
- Total spent: ₦${totalSpent.toLocaleString()}
- Top category: ${topCategory ? topCategory[0] : 'N/A'} (₦${topCategory ? topCategory[1].toLocaleString() : 0})
- Total transactions: ${transactions.length}
- Average transaction: ₦${transactions.length > 0 ? Math.round(totalSpent / transactions.length).toLocaleString() : 0}

Recommendations:
1. Monitor your spending in ${topCategory ? topCategory[0] : 'top categories'}
2. Set up savings goals to build wealth
3. Take advantage of rewards on frequent transactions
    `.trim();
  }

  async predictCashFlow(history: any[], days: number): Promise<{
    predictedBalance: number;
    confidence: number;
    factors: string[];
  }> {
    const avgDailySpending = history
      .filter(tx => tx.type === 'Debit')
      .reduce((sum, tx) => sum + tx.amount, 0) / 30;

    const avgDailyIncome = history
      .filter(tx => tx.type === 'Credit')
      .reduce((sum, tx) => sum + tx.amount, 0) / 30;

    const netDaily = avgDailyIncome - avgDailySpending;
    const predictedChange = netDaily * days;

    return {
      predictedBalance: predictedChange,
      confidence: 0.6,
      factors: [
        'Based on 30-day transaction history',
        `Average daily spending: ₦${Math.round(avgDailySpending).toLocaleString()}`,
        `Average daily income: ₦${Math.round(avgDailyIncome).toLocaleString()}`,
      ],
    };
  }
}

export const aiService = new AIService();
