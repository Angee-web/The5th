"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IPromoCode } from "@/types";
import { HiPlus, HiXMark } from "react-icons/hi2";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<IPromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrderAmount: "",
    maxUses: "",
    expiresAt: "",
  });
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/promos")
      .then((r) => r.json())
      .then((d) => { setPromos(d || []); setLoading(false); });
  };

  useEffect(load, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      code: form.code.toUpperCase(),
      type: form.type,
      value: parseFloat(form.value),
      minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : undefined,
      maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
      expiresAt: form.expiresAt || undefined,
    };
    const res = await fetch("/api/promos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      toast.success("Promo created!");
      setShowForm(false);
      setForm({ code: "", type: "percentage", value: "", minOrderAmount: "", maxUses: "", expiresAt: "" });
      load();
    } else {
      const data = await res.json();
      toast.error(data.error);
    }
    setSaving(false);
  };

  const toggleActive = async (id: string, active: boolean) => {
    await fetch("/api/promos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !active }),
    });
    setPromos(promos.map((p) => p._id === id ? { ...p, active: !active } : p));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold">Promo Codes</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <HiPlus className="w-4 h-4" /> New Code
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-200 rounded" />)}
        </div>
      ) : (
        <div className="bg-white rounded shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-xs text-gray-500 font-medium">Code</th>
                <th className="text-left p-4 text-xs text-gray-500 font-medium">Discount</th>
                <th className="text-right p-4 text-xs text-gray-500 font-medium">Uses</th>
                <th className="text-center p-4 text-xs text-gray-500 font-medium">Expires</th>
                <th className="text-center p-4 text-xs text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((p) => (
                <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-mono font-bold text-brand-gold">{p.code}</td>
                  <td className="p-4">
                    {p.type === "percentage" ? `${p.value}% off` : `₦${p.value.toLocaleString()} off`}
                    {p.minOrderAmount ? <span className="text-xs text-gray-400 ml-1">(min ₦{p.minOrderAmount.toLocaleString()})</span> : ""}
                  </td>
                  <td className="p-4 text-right text-gray-600">
                    {p.usedCount}{p.maxUses ? `/${p.maxUses}` : ""}
                  </td>
                  <td className="p-4 text-center text-xs text-gray-500">
                    {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString("en-NG") : "No expiry"}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleActive(p._id, p.active)}
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${p.active ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700" : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700"}`}
                    >
                      {p.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {promos.length === 0 && <p className="text-center py-12 text-gray-400">No promo codes yet</p>}
        </div>
      )}

      {/* Create modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium">Create Promo Code</h2>
              <button onClick={() => setShowForm(false)}><HiXMark className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs tracking-widest uppercase block mb-1">Code *</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required className="input-field" placeholder="SUMMER20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs tracking-widest uppercase block mb-1">Type *</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₦)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase block mb-1">Value *</label>
                  <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required min="0" className="input-field" placeholder={form.type === "percentage" ? "20" : "5000"} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs tracking-widest uppercase block mb-1">Min Order (₦)</label>
                  <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} min="0" className="input-field" placeholder="Optional" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase block mb-1">Max Uses</label>
                  <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} min="1" className="input-field" placeholder="Unlimited" />
                </div>
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase block mb-1">Expires At</label>
                <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="input-field" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? "Creating..." : "Create"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
