import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { verifyPayment } from "@/lib/paystack";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) return NextResponse.json({ error: "Reference required" }, { status: 400 });

  try {
    await connectDB();
    const result = await verifyPayment(reference);

    if (result.data?.status === "success") {
      const order = await Order.findOneAndUpdate(
        { paymentReference: reference },
        { paymentStatus: "paid", orderStatus: "confirmed" },
        { new: true }
      );

      if (order) {
        await Promise.all(
          order.items.map((item: { product: string; quantity: number }) =>
            Product.findByIdAndUpdate(item.product, [
              { $set: { stock: { $max: [0, { $subtract: ["$stock", item.quantity] }] } } },
            ])
          )
        );
      }

      return NextResponse.json({ success: true, data: result.data });
    }

    await Order.findOneAndUpdate({ paymentReference: reference }, { paymentStatus: "failed" });
    return NextResponse.json({ success: false, message: "Payment not successful" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
