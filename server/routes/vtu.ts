import express, { Request, Response } from 'express';
import { z } from 'zod';
import * as interswitch from '../services/interswitch';

const router = express.Router();

const rechargeSchema = z.object({
  paymentCode: z.string().min(1, 'Payment code is required'),
  customerId: z.string().min(10, 'Invalid customer identifier'),
  amount: z.number().positive('Amount must be greater than zero'),
  requestReference: z.string().min(1, 'Reference is required')
});

// Get Billers (Telcos)
router.get('/billers', async (req: Request, res: Response) => {
  try {
    const data = await interswitch.getBillers();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch billers' });
  }
});

// Get Payment Items (Data Plans)
router.get('/payment-items/:serviceId', async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const data = await interswitch.getPaymentItems(serviceId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment items' });
  }
});

// Process Recharge
router.post('/recharge', async (req: Request, res: Response) => {
  try {
    const validation = rechargeSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.flatten().fieldErrors 
      });
    }

    const { paymentCode, customerId, amount, requestReference } = validation.data;

    const data = await interswitch.processRecharge({
      paymentCode,
      customerId,
      amount,
      requestReference,
    });

    res.json(data);
  } catch (error) {
    console.error('Recharge Error:', error);
    res.status(500).json({ error: 'Internal system error processing request' });
  }
});

export default router;
