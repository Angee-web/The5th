import mongoose, { Schema, Document } from "mongoose";

export interface IBlogDoc extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
}

const BlogSchema = new Schema<IBlogDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    author: { type: String, default: "5thJohnson" },
    tags: [String],
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model<IBlogDoc>("Blog", BlogSchema);
