import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PromoCode from "@/models/PromoCode";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { code, subtotal } = await req.json();

    const promo = await PromoCode.findOne({
      code: code.toUpperCase(),
      active: true,
    });

    if (!promo) return NextResponse.json({ error: "Invalid promo code" }, { status: 404 });

    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Promo code has expired" }, { status: 400 });
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return NextResponse.json({ error: "Promo code usage limit reached" }, { status: 400 });
    }

    if (promo.minOrderAmount && subtotal < promo.minOrderAmount) {
      return NextResponse.json({
        error: `Minimum order of ₦${promo.minOrderAmount.toLocaleString()} required`,
      }, { status: 400 });
    }

    const discount =
      promo.type === "percentage"
        ? (subtotal * promo.value) / 100
        : Math.min(promo.value, subtotal);

    return NextResponse.json({ valid: true, discount, promo });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
