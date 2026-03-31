import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { authOptions } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const order = await Order.findById(params.id).populate("user", "name email").lean() as unknown as { user: { _id: { toString(): string } } } | null;
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (
      session.user.role !== "admin" &&
      order.user._id.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { orderStatus, trackingNumber } = await req.json();
    const update: Record<string, unknown> = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (trackingNumber) update.trackingNumber = trackingNumber;

    const order = await Order.findByIdAndUpdate(params.id, update, { new: true });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
