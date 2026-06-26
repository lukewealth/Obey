import express, { Request, Response } from 'express';
import { verifyWebhookSignature } from '../services/nomba';
import { WebhookEvent } from '../models/WebhookEvent';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/nomba', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['nomba-signature'] as string;
    const timestamp = req.headers['nomba-timestamp'] as string;
    const payload = req.body;

    if (!payload || !payload.event_type || !payload.requestId) {
      return res.status(400).send('Invalid payload');
    }

    const isValid = verifyWebhookSignature(payload, signature, timestamp);
    
    if (!isValid) {
      console.error('[WEBHOOK] Invalid signature for event:', payload.requestId);
      return res.status(401).send('Invalid signature');
    }

    const existing = await WebhookEvent.findOne({ eventId: payload.requestId } as any);
    if (existing) {
      console.log('[WEBHOOK] Duplicate event ignored:', payload.requestId);
      return res.status(200).send('Already processed');
    }

    const webhookEvent = new WebhookEvent({
      eventId: payload.requestId,
      eventType: payload.event_type,
      transactionId: payload.data?.transaction?.transactionId || '',
      amount: payload.data?.transaction?.transactionAmount,
      currency: payload.data?.order?.currency,
      status: payload.data?.transaction?.responseCode,
      rawPayload: payload,
      signatureValid: isValid,
    });

    const orderMeta = payload.data?.order?.orderMetaData;
    if (orderMeta?.userId) {
      webhookEvent.userId = orderMeta.userId;
      webhookEvent.orderReference = payload.data?.order?.orderReference;
    }

    await webhookEvent.save();

    switch (payload.event_type) {
      case 'payment_success':
        await handlePaymentSuccess(payload);
        break;
      case 'payment_failed':
        await handlePaymentFailed(payload);
        break;
      case 'payout_success':
        await handlePayoutSuccess(payload);
        break;
      case 'payout_failed':
        await handlePayoutFailed(payload);
        break;
      default:
        console.log('[WEBHOOK] Unhandled event type:', payload.event_type);
    }

    res.status(200).send('OK');
  } catch (error: any) {
    console.error('[WEBHOOK] Processing error:', error.message);
    res.status(200).send('Error logged');
  }
});

async function handlePaymentSuccess(payload: any) {
  const { data } = payload;
  const orderRef = data?.order?.orderReference;
  const amount = data?.transaction?.transactionAmount;
  const fee = data?.transaction?.fee || 0;
  const userId = data?.order?.orderMetaData?.userId || data?.order?.customerId;
  const transactionId = data?.transaction?.transactionId;

  if (!userId) {
    console.error('[WEBHOOK] Missing userId in payment_success');
    return;
  }

  const transaction = await Transaction.findOne({ 
    $or: [
      { orderReference: orderRef },
      { nombaTransactionId: transactionId }
    ]
  } as any);

  if (transaction) {
    transaction.status = 'Success';
    transaction.nombaTransactionId = transactionId;
    transaction.webhookVerified = true;
    transaction.fee = fee;
    await transaction.save();
  } else {
    await Transaction.create({
      id: uuidv4(),
      userId,
      title: 'Wallet Funding',
      category: 'Transfer',
      type: 'Credit',
      amount,
      fee,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Success',
      nombaTransactionId: transactionId,
      orderReference: orderRef,
      paymentMethod: data?.order?.paymentMethod === 'card_payment' ? 'card' : 
                     data?.order?.paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'virtual_account',
      webhookVerified: true,
    });
  }

  await User.findOneAndUpdate(
    { $or: [{ supabaseId: userId }, { email: userId }] } as any,
    { $inc: { balance: amount } } as any,
    { new: true } as any
  );

  console.log(`[WEBHOOK] Payment success: ${amount} credited to ${userId}`);
}

async function handlePaymentFailed(payload: any) {
  const { data } = payload;
  const orderRef = data?.order?.orderReference;
  const transactionId = data?.transaction?.transactionId;

  const transaction = await Transaction.findOne({ 
    $or: [{ orderReference: orderRef }, { nombaTransactionId: transactionId }]
  } as any);

  if (transaction) {
    transaction.status = 'Failed';
    transaction.nombaTransactionId = transactionId;
    transaction.webhookVerified = true;
    await transaction.save();
  }

  console.log(`[WEBHOOK] Payment failed: ${orderRef || transactionId}`);
}

async function handlePayoutSuccess(payload: any) {
  const { data } = payload;
  const txRef = data?.transaction?.merchantTxRef;
  const transactionId = data?.transaction?.transactionId;

  const transaction = await Transaction.findOne({ requestReference: txRef } as any);
  if (transaction) {
    transaction.status = 'Success';
    transaction.nombaTransactionId = transactionId;
    transaction.sessionId = data?.transaction?.sessionId;
    transaction.webhookVerified = true;
    await transaction.save();
  }

  console.log(`[WEBHOOK] Payout success: ${txRef}`);
}

async function handlePayoutFailed(payload: any) {
  const { data } = payload;
  const txRef = data?.transaction?.merchantTxRef;
  const amount = data?.transaction?.transactionAmount;
  const transactionId = data?.transaction?.transactionId;

  const transaction = await Transaction.findOne({ requestReference: txRef } as any);
  if (transaction) {
    transaction.status = 'Failed';
    transaction.nombaTransactionId = transactionId;
    transaction.webhookVerified = true;
    await transaction.save();

    await User.findOneAndUpdate(
      { $or: [{ supabaseId: transaction.userId }, { email: transaction.userId }] } as any,
      { $inc: { balance: amount } } as any,
      { new: true } as any
    );

    await Transaction.create({
      id: uuidv4(),
      userId: transaction.userId,
      title: 'Withdrawal Refund',
      category: 'System',
      type: 'Credit',
      amount,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Success',
      requestReference: `REF-${txRef}`,
    });

    console.log(`[WEBHOOK] Payout failed, refunded ${amount} to ${transaction.userId}`);
  }
}

export default router;
