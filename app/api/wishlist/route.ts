import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(session.user.id).populate("wishlist").lean() as unknown as { wishlist: unknown[] } | null;
  return NextResponse.json(user?.wishlist || []);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { productId } = await req.json();

  const user = await User.findById(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const isWishlisted = user.wishlist.some((id: { toString(): string }) => id.toString() === productId);

  if (isWishlisted) {
    user.wishlist = user.wishlist.filter((id: { toString(): string }) => id.toString() !== productId);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  return NextResponse.json({ wishlisted: !isWishlisted });
}
