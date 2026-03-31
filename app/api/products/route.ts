import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { authOptions } from "@/lib/auth";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const size = searchParams.get("size");
    const featured = searchParams.get("featured");
    const newArrival = searchParams.get("newArrival");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "createdAt";

    const query: Record<string, unknown> = {};
    if (category) {
      if (category === "sale") {
        query.$or = [
          { category: "sale" },
          { comparePrice: { $exists: true, $gt: 0 } },
        ];
      } else {
        query.category = category;
      }
    }
    if (featured === "true") query.featured = true;
    if (newArrival === "true") query.newArrival = true;
    if (size) query.sizes = size;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, number>).$gte = parseFloat(minPrice);
      if (maxPrice) (query.price as Record<string, number>).$lte = parseFloat(maxPrice);
    }
    if (search) query.$text = { $search: search };

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      rating: { averageRating: -1 },
    };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      products,
      total,
      pages: Math.ceil(total / limit),
      page,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();

    const slug = slugify(body.name, { lower: true, strict: true });
    const exists = await Product.findOne({ slug });
    const finalSlug = exists ? `${slug}-${Date.now()}` : slug;

    const product = await Product.create({ ...body, slug: finalSlug });
    return NextResponse.json(product, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
