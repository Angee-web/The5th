"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  revenueByMonth: { month: string; revenue: number }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  outOfStockProducts: { _id: string; name: string; slug: string }[];
}

const STATUS_COLORS: Record<string, string> = {
  processing: "#f59e0b",
  confirmed: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded" />)}
      </div>
      <div className="h-64 bg-gray-200 rounded" />
    </div>
  );

  const stats = [
    { label: "Total Revenue", value: `₦${(data?.totalRevenue || 0).toLocaleString()}`, color: "text-brand-gold" },
    { label: "Total Orders", value: data?.totalOrders || 0, color: "text-blue-600" },
    { label: "Customers", value: data?.totalCustomers || 0, color: "text-purple-600" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl font-bold">Dashboard</h1>
        <Link href="/admin/products/new" className="btn-primary text-sm px-4 py-2">
          + Add Product
        </Link>
      </div>

      {/* Out of stock alert */}
      {data?.outOfStockProducts && data.outOfStockProducts.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded p-4">
          <p className="text-sm font-semibold text-red-700 mb-2">
            ⚠ {data.outOfStockProducts.length} product{data.outOfStockProducts.length > 1 ? "s are" : " is"} out of stock
          </p>
          <ul className="space-y-1">
            {data.outOfStockProducts.map((p) => (
              <li key={p._id} className="flex items-center justify-between">
                <span className="text-sm text-red-800">{p.name}</span>
                <Link
                  href={`/admin/products`}
                  className="text-xs text-red-600 underline underline-offset-2 hover:text-red-800"
                >
                  Restock
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-5 rounded shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-2xl font-bold font-serif ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded shadow-sm border border-gray-100">
          <h2 className="font-medium text-sm mb-4">Revenue (Last 12 Months)</h2>
          {data?.revenueByMonth && data.revenueByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data.revenueByMonth}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`₦${v.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#C9A96E" fill="#E8D5B0" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-12 text-sm">No revenue data yet</p>
          )}
        </div>

        {/* Orders by status */}
        <div className="bg-white p-5 rounded shadow-sm border border-gray-100">
          <h2 className="font-medium text-sm mb-4">Orders by Status</h2>
          {data?.ordersByStatus && data.ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.ordersByStatus} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="status" type="category" tick={{ fontSize: 11 }} width={70} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 3, 3, 0]}>
                  {data.ordersByStatus.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#9b9b9b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-12 text-sm">No orders yet</p>
          )}
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white p-5 rounded shadow-sm border border-gray-100">
        <h2 className="font-medium text-sm mb-4">Top Selling Products</h2>
        {data?.topProducts && data.topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs text-gray-500 font-normal">Product</th>
                  <th className="text-right py-2 text-xs text-gray-500 font-normal">Units Sold</th>
                  <th className="text-right py-2 text-xs text-gray-500 font-normal">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((p, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 font-medium">{p.name}</td>
                    <td className="py-2 text-right text-gray-600">{p.sales}</td>
                    <td className="py-2 text-right text-brand-gold font-medium">₦{p.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8 text-sm">No sales data yet</p>
        )}
      </div>
    </div>
  );
}
