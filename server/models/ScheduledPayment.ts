import mongoose from 'mongoose';

const ScheduledPaymentSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'NGN' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  frequency: {
    type: String,
    enum: ['once', 'daily', 'weekly', 'monthly', 'yearly'],
    default: 'once',
  },
  category: {
    type: String,
    enum: ['Transfer', 'Bills', 'Savings', 'Subscription', 'Rent', 'Other'],
    default: 'Other',
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'rescheduled', 'cancelled', 'failed'],
    default: 'upcoming',
  },
  recipient: { type: String },
  recipientAccount: { type: String },
  recipientBank: { type: String },
  description: { type: String },
  originalDate: { type: String },
  rescheduleCount: { type: Number, default: 0 },
  lastExecuted: { type: Date },
  nextExecution: { type: Date },
}, { timestamps: true });

ScheduledPaymentSchema.index({ userId: 1, status: 1 });
ScheduledPaymentSchema.index({ userId: 1, nextExecution: 1 });

export const ScheduledPayment = mongoose.models.ScheduledPayment ||
  mongoose.model('ScheduledPayment', ScheduledPaymentSchema);
