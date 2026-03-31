"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IOrder } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  processing: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders || []); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-brand-gray-light rounded" />)}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-serif text-2xl text-brand-gray-dark mb-4">No orders yet</p>
          <Link href="/shop" className="btn-primary inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="block border border-brand-gray-light p-5 hover:border-brand-black transition-colors"
            >
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <p className="text-xs text-brand-gray mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm font-medium">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                  <p className="text-xs text-brand-gray mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-lg font-semibold">₦{order.total.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[order.orderStatus] || "bg-gray-100"}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
              {order.trackingNumber && (
                <p className="text-xs text-brand-gray mt-3">Tracking: {order.trackingNumber}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
