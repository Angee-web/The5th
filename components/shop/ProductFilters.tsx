"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { HiAdjustmentsHorizontal, HiXMark } from "react-icons/hi2";

const CATEGORIES = ["dresses", "tops", "bottoms", "outerwear", "accessories", "sets", "sale"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const current = {
    category: params.get("category") || "",
    size: params.get("size") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    sort: params.get("sort") || "newest",
  };

  const update = (key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    p.delete("page");
    router.push(`/shop?${p.toString()}`);
  };

  const clearAll = () => router.push("/shop");

  const hasFilters = current.category || current.size || current.minPrice || current.maxPrice;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-xs tracking-widest uppercase mb-3 font-medium">Sort By</h3>
        <select
          value={current.sort}
          onChange={(e) => update("sort", e.target.value)}
          className="w-full border border-brand-gray-light px-3 py-2 text-sm focus:outline-none focus:border-brand-black"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Best Rated</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-xs tracking-widest uppercase mb-3 font-medium">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={current.category === cat}
                onChange={() => update("category", current.category === cat ? "" : cat)}
                className="accent-brand-black"
              />
              <span className="text-sm capitalize">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="text-xs tracking-widest uppercase mb-3 font-medium">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => update("size", current.size === s ? "" : s)}
              className={`px-3 py-1 text-xs border transition-colors ${
                current.size === s
                  ? "bg-brand-black text-white border-brand-black"
                  : "border-brand-gray-light hover:border-brand-black"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-xs tracking-widest uppercase mb-3 font-medium">Price (₦)</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={current.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            className="w-full border border-brand-gray-light px-3 py-2 text-sm focus:outline-none"
          />
          <span className="text-brand-gray">–</span>
          <input
            type="number"
            placeholder="Max"
            value={current.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="w-full border border-brand-gray-light px-3 py-2 text-sm focus:outline-none"
          />
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearAll} className="text-xs text-red-500 underline underline-offset-2">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-52 flex-shrink-0">
        <FilterContent />
      </aside>

      {/* Mobile toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 text-sm border border-brand-black px-4 py-2"
        >
          <HiAdjustmentsHorizontal className="w-4 h-4" />
          Filter & Sort
          {hasFilters && <span className="bg-brand-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">!</span>}
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-[70]">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white flex flex-col shadow-2xl">
              {/* Drawer header */}
              <div className="flex justify-between items-center px-5 py-4 border-b border-brand-gray-light flex-shrink-0">
                <h2 className="font-serif text-lg font-medium">Filter & Sort</h2>
                <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>
              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-5 py-6">
                <FilterContent />
              </div>
              {/* Sticky apply button */}
              <div className="flex-shrink-0 px-5 py-4 border-t border-brand-gray-light bg-white">
                <button onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
