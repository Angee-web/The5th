import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { name, phone } = await req.json();
  const user = await User.findByIdAndUpdate(
    session.user.id,
    { ...(name && { name }), ...(phone && { phone }) },
    { new: true }
  ).select("-password");

  return NextResponse.json(user);
}
