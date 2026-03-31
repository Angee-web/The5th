import mongoose, { Schema, Document } from "mongoose";

export interface IPromoCodeDoc extends Document {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: Date;
  active: boolean;
  createdAt: Date;
}

const PromoCodeSchema = new Schema<IPromoCodeDoc>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, min: 0 },
    maxUses: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0 },
    expiresAt: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.PromoCode || mongoose.model<IPromoCodeDoc>("PromoCode", PromoCodeSchema);
