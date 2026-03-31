import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  await connectDB();
  const reviews = await Review.find({ product: productId })
    .populate("user", "name image")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const { productId, rating, comment } = await req.json();

    const existing = await Review.findOne({ product: productId, user: session.user.id });
    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 });
    }

    const review = await Review.create({
      product: productId,
      user: session.user.id,
      rating,
      comment,
    });

    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    });

    const populated = await review.populate("user", "name image");
    return NextResponse.json(populated, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
