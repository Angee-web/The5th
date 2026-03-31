"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import ProductFilters from "@/components/shop/ProductFilters";
import { IProduct } from "@/types";

export default function ShopClient() {
  const params = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const page = parseInt(params.get("page") || "1");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams(params.toString());
    qs.set("limit", "12");
    if (qs.get("filter") === "new") { qs.delete("filter"); qs.set("newArrival", "true"); }
    const res = await fetch(`/api/products?${qs.toString()}`);
    const data = await res.json();
    setProducts(data.products || []);
    setTotal(data.total || 0);
    setPages(data.pages || 1);
    setLoading(false);
  }, [params]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const category = params.get("category");
  const search = params.get("search");
  const filter = params.get("filter");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-brand-black mb-2">
          {search ? `Search: "${search}"` : filter === "new" ? "New Arrivals" : category ? capitalize(category) : "All Products"}
        </h1>
        <p className="text-brand-gray text-sm">{total} {total === 1 ? "item" : "items"}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        <div className="w-full lg:w-auto lg:sticky lg:top-20 lg:self-start lg:flex-shrink-0">
          <ProductFilters />
        </div>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-brand-gray-light" />
                  <div className="h-3 bg-brand-gray-light rounded mt-3 w-3/4" />
                  <div className="h-3 bg-brand-gray-light rounded mt-2 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif text-2xl text-brand-gray-dark mb-2">No products found</p>
              <p className="text-brand-gray text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {[...Array(pages)].map((_, i) => {
                    const p = new URLSearchParams(params.toString());
                    p.set("page", String(i + 1));
                    return (
                      <a
                        key={i}
                        href={`/shop?${p.toString()}`}
                        className={`w-9 h-9 flex items-center justify-center text-sm border transition-colors ${
                          page === i + 1
                            ? "bg-brand-black text-white border-brand-black"
                            : "border-brand-gray-light hover:border-brand-black"
                        }`}
                      >
                        {i + 1}
                      </a>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
