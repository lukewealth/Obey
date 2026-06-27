import mongoose from 'mongoose';

const WebhookEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  eventType: { type: String, required: true },
  transactionId: { type: String, required: true },
  amount: { type: Number },
  currency: { type: String },
  status: { type: String },
  userId: { type: String },
  orderReference: { type: String },
  rawPayload: { type: mongoose.Schema.Types.Mixed, required: true },
  processedAt: { type: Date, default: Date.now },
  signatureValid: { type: Boolean, required: true },
}, { timestamps: true });

WebhookEventSchema.index({ eventType: 1, processedAt: -1 });
WebhookEventSchema.index({ userId: 1, processedAt: -1 });
WebhookEventSchema.index({ transactionId: 1 });
WebhookEventSchema.index({ orderReference: 1 }, { sparse: true });

export const WebhookEvent = mongoose.models.WebhookEvent ||
  mongoose.model('WebhookEvent', WebhookEventSchema);
