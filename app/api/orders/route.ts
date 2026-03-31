import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import PromoCode from "@/models/PromoCode";
import { authOptions } from "@/lib/auth";
import { initializePayment, generateReference } from "@/lib/paystack";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query = session.user.role === "admin" ? {} : { user: session.user.id };
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "name email")
      .lean();

    return NextResponse.json({ orders, total, pages: Math.ceil(total / limit), page });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const { items, shippingAddress, promoCode, notes } = await req.json();

    let subtotal = 0;
    const orderItems = items.map((item: { product: { price: number; name: string; images: string[]; _id: string }; size: string; color?: string; quantity: number }) => {
      subtotal += item.product.price * item.quantity;
      return {
        product: item.product._id,
        name: item.product.name,
        image: item.product.images[0],
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    const SHIPPING_RATES: Record<string, number> = {
      "Lagos": 2500, "Ogun": 2800, "FCT": 3000, "Abuja": 3000, "Oyo": 3000, "Osun": 3000,
      "Rivers": 3500, "Enugu": 3500, "Anambra": 3500, "Imo": 3500, "Abia": 3500,
      "Delta": 3500, "Edo": 3500, "Kwara": 3500, "Ondo": 3500, "Ekiti": 3500, "Nasarawa": 3500, "Kogi": 3500,
      "Bayelsa": 4000, "Cross River": 4000, "Akwa Ibom": 4000, "Kaduna": 4000, "Niger": 4000, "Benue": 4000, "Plateau": 4000,
      "Kano": 4000, "Katsina": 4500, "Sokoto": 4500, "Zamfara": 4500, "Kebbi": 4500, "Gombe": 4500, "Bauchi": 4500, "Adamawa": 4500, "Taraba": 4500, "Jigawa": 4500,
      "Borno": 5000, "Yobe": 5000,
    };
    const state = shippingAddress?.state || "";
    const baseShipping = SHIPPING_RATES[state] ?? 3500;
    const shippingFee = subtotal >= 100000 ? 0 : baseShipping;
    let discount = 0;
    let appliedPromo = null;

    if (promoCode) {
      const promo = await PromoCode.findOne({
        code: promoCode.toUpperCase(),
        active: true,
        $and: [
          { $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }] },
          { $or: [{ maxUses: null }, { $expr: { $lt: ["$usedCount", "$maxUses"] } }] },
        ],
      });

      if (promo && (!promo.minOrderAmount || subtotal >= promo.minOrderAmount)) {
        discount =
          promo.type === "percentage"
            ? (subtotal * promo.value) / 100
            : Math.min(promo.value, subtotal);
        appliedPromo = promo;
      }
    }

    const total = subtotal + shippingFee - discount;
    const reference = generateReference();

    const order = await Order.create({
      user: session.user.id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingFee,
      discount,
      total,
      promoCode: appliedPromo?.code,
      paymentReference: reference,
      notes,
    });

    if (appliedPromo) {
      await PromoCode.findByIdAndUpdate(appliedPromo._id, { $inc: { usedCount: 1 } });
    }

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL;
    const paystackRes = await initializePayment({
      email: session.user.email!,
      amount: total * 100,
      reference,
      callback_url: `${baseUrl}/orders/${order._id}?verify=true`,
      metadata: { orderId: order._id.toString(), userId: session.user.id },
    });

    if (!paystackRes.status || !paystackRes.data?.authorization_url) {
      console.error("Paystack error:", paystackRes);
      return NextResponse.json({
        order,
        paymentUrl: null,
        paystackError: paystackRes.message || "Paystack initialization failed",
      }, { status: 201 });
    }

    return NextResponse.json({
      order,
      paymentUrl: paystackRes.data.authorization_url,
    }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
