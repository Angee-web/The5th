import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { authOptions } from "@/lib/auth";
import slugify from "slugify";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  await connectDB();
  const post = await Blog.findOne({ slug: params.slug, published: true }).lean();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();

  // If title changed, regenerate slug
  if (body.title) {
    const newSlug = slugify(body.title, { lower: true, strict: true });
    body.slug = newSlug;
  }

  // params.slug could be an _id (from admin) or a slug (from public)
  const post = await Blog.findOneAndUpdate(
    { $or: [{ _id: params.slug }, { slug: params.slug }] },
    body,
    { new: true }
  );

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const post = await Blog.findOneAndDelete({
    $or: [{ _id: params.slug }, { slug: params.slug }],
  });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
