import express, { Request, Response } from 'express';
import * as interswitch from '../services/interswitch';

const router = express.Router();

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
    const { paymentCode, customerId, amount, requestReference } = req.body;
    
    if (!paymentCode || !customerId || !amount || !requestReference) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const data = await interswitch.processRecharge({
      paymentCode,
      customerId,
      amount,
      requestReference,
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process recharge' });
  }
});

export default router;
