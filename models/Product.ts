import mongoose, { Schema, Document } from "mongoose";

export interface IProductDoc extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  newArrival: boolean;
  tags: string[];
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
}

const ProductSchema = new Schema<IProductDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    images: [{ type: String }],
    category: {
      type: String,
      required: true,
      enum: ["dresses", "tops", "bottoms", "outerwear", "accessories", "sets", "sale"],
    },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    tags: [{ type: String }],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ newArrival: 1 });

export default mongoose.models.Product || mongoose.model<IProductDoc>("Product", ProductSchema);
