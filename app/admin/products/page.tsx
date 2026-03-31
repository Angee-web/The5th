"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { IProduct } from "@/types";
import { HiPencil, HiTrash, HiPlus } from "react-icons/hi2";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/products?limit=50")
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false); });
  };

  useEffect(load, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Product deleted");
      setProducts(products.filter((p) => p._id !== id));
    } else {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold">Products ({products.length})</h1>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <HiPlus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded" />)}
        </div>
      ) : (
        <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-xs text-gray-500 font-medium">Product</th>
                <th className="text-left p-4 text-xs text-gray-500 font-medium hidden md:table-cell">Category</th>
                <th className="text-right p-4 text-xs text-gray-500 font-medium">Price</th>
                <th className="text-right p-4 text-xs text-gray-500 font-medium hidden sm:table-cell">Stock</th>
                <th className="text-right p-4 text-xs text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 bg-brand-cream flex-shrink-0">
                        {p.images[0] && (
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="40px" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium truncate max-w-[180px]">{p.name}</p>
                        {p.featured && <span className="text-xs text-brand-gold">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 capitalize hidden md:table-cell">{p.category}</td>
                  <td className="p-4 text-right font-medium">₦{p.price.toLocaleString()}</td>
                  <td className="p-4 text-right hidden sm:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.stock > 5 ? "bg-green-100 text-green-700" : p.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {p.stock === 0 ? "Out" : p.stock}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${p._id}/edit`} className="p-1.5 hover:text-brand-gold transition-colors">
                        <HiPencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 hover:text-red-500 transition-colors">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="mb-4">No products yet</p>
              <Link href="/admin/products/new" className="btn-primary inline-block text-sm">Add Your First Product</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
