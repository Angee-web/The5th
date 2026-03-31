"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  revenueByMonth: { month: string; revenue: number }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  topCustomers: { name: string; email: string; totalSpent: number; orderCount: number; lastOrder: string }[];
}

const PIE_COLORS = ["#C9A96E", "#0A0A0A", "#9B9B9B", "#E8D5B0", "#4A4A4A"];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <div className="p-6 animate-pulse space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded" />)}</div>;

  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold mb-8">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: `₦${(data?.totalRevenue || 0).toLocaleString()}` },
          { label: "Total Orders", value: data?.totalOrders || 0 },
          { label: "Total Customers", value: data?.totalCustomers || 0 },
        ].map((s) => (
          <div key={s.label} className="bg-white p-5 rounded shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-2xl font-bold font-serif text-brand-gold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded shadow-sm border border-gray-100">
          <h2 className="font-medium text-sm mb-4">Revenue Over Time</h2>
          {data?.revenueByMonth.length ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data.revenueByMonth}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`₦${v.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#C9A96E" fill="#E8D5B0" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm py-12 text-center">No data yet</p>}
        </div>

        <div className="bg-white p-5 rounded shadow-sm border border-gray-100">
          <h2 className="font-medium text-sm mb-4">Orders by Status</h2>
          {data?.ordersByStatus.length ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data.ordersByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
                  {data.ordersByStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm py-12 text-center">No data yet</p>}
        </div>
      </div>

      <div className="bg-white p-5 rounded shadow-sm border border-gray-100 mb-6">
        <h2 className="font-medium text-sm mb-4">Top 5 Customers</h2>
        {data?.topCustomers?.length ? (
          <div className="space-y-3">
            {data.topCustomers.map((c, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                <div className="w-7 h-7 rounded-full bg-brand-gold text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-xs text-gray-400 truncate">{c.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-brand-gold">₦{c.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{c.orderCount} {c.orderCount === 1 ? "order" : "orders"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-400 text-sm py-8 text-center">No customer data yet</p>}
      </div>

      <div className="bg-white p-5 rounded shadow-sm border border-gray-100">
        <h2 className="font-medium text-sm mb-4">Top Products by Sales</h2>
        {data?.topProducts.length ? (
          <div className="space-y-3">
            {data.topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium truncate max-w-[200px]">{p.name}</span>
                    <span className="text-brand-gold font-medium">₦{p.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-gold rounded-full"
                      style={{ width: `${Math.min(100, (p.sales / (data.topProducts[0]?.sales || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{p.sales} sold</span>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-400 text-sm py-8 text-center">No sales data yet</p>}
      </div>
    </div>
  );
}
