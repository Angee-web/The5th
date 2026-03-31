import mongoose, { Schema, Document } from "mongoose";

export interface IOrderDoc extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    image: string;
    size: string;
    color?: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    country: string;
    phone: string;
  };
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  promoCode?: string;
  paymentReference: string;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: String,
  size: { type: String, required: true },
  color: String,
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrderDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: "Nigeria" },
      phone: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    promoCode: String,
    paymentReference: { type: String, required: true, unique: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "confirmed", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    trackingNumber: String,
    notes: String,
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ paymentReference: 1 });
OrderSchema.index({ orderStatus: 1 });

export default mongoose.models.Order || mongoose.model<IOrderDoc>("Order", OrderSchema);
