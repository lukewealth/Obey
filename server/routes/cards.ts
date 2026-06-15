import express from 'express';
import { createVirtualCard, rotateCVV } from '../services/interswitch';
import VirtualCard from '../models/VirtualCard';
import Transaction from '../models/Transaction';
import User from '../models/User';

const router = express.Router();

// Provision a new virtual card
router.post('/create', async (req, res) => {
  const { userId, holderName, initialLiquidity, kycNodeId } = req.body;

  try {
    const interswitchRes = await createVirtualCard({
      holderName,
      userId,
      initialLiquidity,
      kycNodeId
    });

    if (interswitchRes.responseCode === "00") {
      const newCard = new VirtualCard({
        userId,
        holderName,
        cardNumber: interswitchRes.cardDetails.cardNumber,
        cvv: interswitchRes.cardDetails.cvv,
        expiryDate: interswitchRes.cardDetails.expiryDate,
        cardType: interswitchRes.cardDetails.cardType,
        interswitchRef: interswitchRes.interswitchRef,
        balance: initialLiquidity,
        currency: 'NGN'
      });

      await newCard.save();

      // Create a transaction record
      const tx = new Transaction({
        title: "Virtual Card Provisioning",
        category: "Transfer",
        type: "Debit",
        amount: initialLiquidity,
        status: "Success",
        userId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        requestReference: interswitchRes.interswitchRef
      });
      await tx.save();

      res.status(201).json({ success: true, card: newCard });
    } else {
      res.status(400).json({ success: false, message: interswitchRes.message });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all cards for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const cards = await VirtualCard.find({ userId: req.params.userId });
    res.json(cards);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rotate CVV (24-hour protocol)
router.post('/rotate-cvv', async (req, res) => {
  const { cardId } = req.body;
  try {
    const card = await VirtualCard.findById(cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const interswitchRes = await rotateCVV(card.interswitchRef);
    if (interswitchRes.responseCode === "00") {
      card.cvv = interswitchRes.newCVV;
      card.lastCVVRotation = new Date();
      await card.save();
      res.json({ success: true, newCVV: interswitchRes.newCVV });
    } else {
      res.status(400).json({ success: false, message: interswitchRes.message });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Lock/Unlock card
router.patch('/:cardId/status', async (req, res) => {
  const { status } = req.body;
  try {
    const card = await VirtualCard.findByIdAndUpdate(
      req.params.cardId,
      { status },
      { new: true }
    );
    res.json(card);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
