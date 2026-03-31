"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IOrder } from "@/types";

const STATUS_OPTIONS = ["processing", "confirmed", "shipped", "delivered", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
  processing: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ id: string; status: string; tracking: string } | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders || []); setLoading(false); });
  }, []);

  const handleUpdate = async () => {
    if (!editing) return;
    const res = await fetch(`/api/orders/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: editing.status, trackingNumber: editing.tracking }),
    });
    if (res.ok) {
      toast.success("Order updated");
      setOrders(orders.map((o) => o._id === editing.id ? { ...o, orderStatus: editing.status as IOrder["orderStatus"], trackingNumber: editing.tracking } : o));
      setEditing(null);
    } else {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold mb-6">Orders ({orders.length})</h1>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded" />)}
        </div>
      ) : (
        <div className="bg-white rounded shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-xs text-gray-500 font-medium">Order ID</th>
                <th className="text-left p-4 text-xs text-gray-500 font-medium">Customer</th>
                <th className="text-left p-4 text-xs text-gray-500 font-medium">Date</th>
                <th className="text-right p-4 text-xs text-gray-500 font-medium">Total</th>
                <th className="text-center p-4 text-xs text-gray-500 font-medium">Payment</th>
                <th className="text-center p-4 text-xs text-gray-500 font-medium">Status</th>
                <th className="text-center p-4 text-xs text-gray-500 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-mono text-xs">{order._id.slice(-8).toUpperCase()}</td>
                  <td className="p-4">
                    <p className="font-medium">{(order.user as { name?: string })?.name || "—"}</p>
                    <p className="text-xs text-gray-400">{(order.user as { email?: string })?.email}</p>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="p-4 text-right font-medium">₦{order.total.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setEditing({ id: order._id, status: order.orderStatus, tracking: order.trackingNumber || "" })}
                      className="text-xs text-brand-gold underline underline-offset-2 hover:text-brand-black"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-center py-12 text-gray-400">No orders yet</p>}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-sm">
            <h2 className="font-medium mb-4">Update Order #{editing.id.slice(-8).toUpperCase()}</h2>

            <div className="mb-4">
              <label className="text-xs tracking-widest uppercase block mb-1">Order Status</label>
              <select
                value={editing.status}
                onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                className="input-field capitalize"
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="mb-6">
              <label className="text-xs tracking-widest uppercase block mb-1">Tracking Number (Optional)</label>
              <input
                value={editing.tracking}
                onChange={(e) => setEditing({ ...editing, tracking: e.target.value })}
                className="input-field"
                placeholder="Enter tracking number"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={handleUpdate} className="btn-primary flex-1">Save</button>
              <button onClick={() => setEditing(null)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
