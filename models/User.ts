import mongoose, { Schema, Document } from "mongoose";

export interface IUserDoc extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "admin" | "customer";
  phone?: string;
  addresses: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    isDefault: boolean;
  }[];
  wishlist: mongoose.Types.ObjectId[];
  resetToken?: string;
  resetTokenExpiry?: Date;
  emailVerified: boolean;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  createdAt: Date;
}

const AddressSchema = new Schema({
  fullName: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, default: "Nigeria" },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    image: String,
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    phone: String,
    addresses: [AddressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    resetToken: { type: String, select: false },
    resetTokenExpiry: { type: Date, select: false },
    emailVerified: { type: Boolean, default: false },
    verifyToken: { type: String, select: false },
    verifyTokenExpiry: { type: Date, select: false },
  },
  { timestamps: true }
);

// In development, delete the cached model so HMR always re-registers with the latest schema.
// Without this, a stale schema causes strict-mode to silently drop unknown fields on writes.
if (process.env.NODE_ENV !== "production") {
  delete (mongoose.models as Record<string, unknown>).User;
}

export default mongoose.models.User || mongoose.model<IUserDoc>("User", UserSchema);
