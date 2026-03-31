"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { IOrder } from "@/types";
import { Suspense } from "react";

const STATUS_STEPS = ["processing", "confirmed", "shipped", "delivered"];
const STATUS_COLORS: Record<string, string> = {
  processing: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function OrderContent({ id }: { id: string }) {
  const params = useSearchParams();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = params.get("verify");

    const loadOrder = async () => {
      if (verify) {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get("reference");
        if (ref) {
          await fetch(`/api/paystack/verify?reference=${ref}`);
          toast.success("Payment confirmed! Your order is being processed.");
        }
      }

      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
      setLoading(false);
    };

    loadOrder();
  }, [id, params]);

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse space-y-6">
      <div className="h-8 bg-brand-gray-light rounded w-1/2" />
      <div className="h-32 bg-brand-gray-light rounded" />
      <div className="h-48 bg-brand-gray-light rounded" />
    </div>
  );

  if (!order) return (
    <div className="text-center py-24">
      <p className="font-serif text-2xl mb-4">Order not found</p>
      <Link href="/orders" className="btn-primary inline-block">My Orders</Link>
    </div>
  );

  const statusIndex = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/orders" className="text-sm text-brand-gray hover:text-brand-black">← Orders</Link>
      </div>

      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl mb-1">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-brand-gray">
            {new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.orderStatus]}`}>
          {order.orderStatus}
        </span>
      </div>

      {/* Progress tracker */}
      {order.orderStatus !== "cancelled" && (
        <div className="mb-10">
          <div className="flex items-center">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                  i <= statusIndex ? "bg-brand-black text-white" : "bg-brand-gray-light text-brand-gray"
                }`}>
                  {i < statusIndex ? "✓" : i + 1}
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 ${i < statusIndex ? "bg-brand-black" : "bg-brand-gray-light"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {STATUS_STEPS.map((step) => (
              <span key={step} className="text-xs text-brand-gray capitalize">{step}</span>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="border border-brand-gray-light mb-6">
        <h2 className="font-medium text-sm p-4 border-b border-brand-gray-light">Items ({order.items.length})</h2>
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4 p-4 border-b border-brand-gray-light last:border-0">
            <div className="relative w-16 h-20 bg-brand-cream flex-shrink-0">
              {item.product?.images?.[0] || item.image ? (
                <Image
                  src={(item.product as { images?: string[] })?.images?.[0] || (item as { image?: string }).image || ""}
                  alt={item.product?.name || (item as { name?: string }).name || ""}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : null}
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium">{(item.product as { name?: string })?.name || (item as { name?: string }).name}</p>
              <p className="text-brand-gray text-xs">Size: {item.size} · Qty: {item.quantity}</p>
              <p className="mt-1">₦{((item as { price?: number }).price || item.product?.price || 0).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Shipping & Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="border border-brand-gray-light p-4">
          <h2 className="font-medium text-sm mb-3">Shipping Address</h2>
          <p className="text-sm text-brand-gray-dark">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-brand-gray">{order.shippingAddress.street}</p>
          <p className="text-sm text-brand-gray">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
          <p className="text-sm text-brand-gray">{order.shippingAddress.phone}</p>
        </div>

        <div className="border border-brand-gray-light p-4">
          <h2 className="font-medium text-sm mb-3">Payment Summary</h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-brand-gray">Subtotal</span><span>₦{order.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-brand-gray">Shipping</span><span>{order.shippingFee === 0 ? "Free" : `₦${order.shippingFee.toLocaleString()}`}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₦{order.discount.toLocaleString()}</span></div>}
            <div className="border-t border-brand-gray-light pt-1 flex justify-between font-medium">
              <span>Total</span><span>₦{order.total.toLocaleString()}</span>
            </div>
          </div>
          <div className={`mt-2 text-xs px-2 py-1 rounded inline-block ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            Payment: {order.paymentStatus}
          </div>
        </div>
      </div>

      {order.trackingNumber && (
        <div className="bg-brand-cream p-4 text-sm">
          <span className="font-medium">Tracking Number: </span>{order.trackingNumber}
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense>
      <OrderContent id={params.id} />
    </Suspense>
  );
}
