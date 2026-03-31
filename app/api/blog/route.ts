import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { authOptions } from "@/lib/auth";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "admin";

  const query = isAdmin ? {} : { published: true };
  const posts = await Blog.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const slug = slugify(body.title, { lower: true, strict: true });
  const post = await Blog.create({ ...body, slug });
  return NextResponse.json(post, { status: 201 });
}
