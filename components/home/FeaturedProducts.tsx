"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import { IProduct } from "@/types";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?featured=true&limit=4")
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-subtitle">Curated For You</p>
          <h2 className="section-title">Featured Pieces</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-brand-gray-light rounded" />
              <div className="h-3 bg-brand-gray-light rounded mt-3 w-2/3" />
              <div className="h-3 bg-brand-gray-light rounded mt-2 w-1/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <p className="section-subtitle">Curated For You</p>
        <h2 className="section-title">Featured Pieces</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/shop" className="btn-outline inline-block">
          View All Products
        </Link>
      </div>
    </section>
  );
}
