"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import { IProduct } from "@/types";

export default function NewArrivals() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?newArrival=true&limit=6")
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false); });
  }, []);

  if (loading || !products.length) return null;

  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-subtitle">Just Landed</p>
            <h2 className="section-title">New Arrivals</h2>
          </div>
          <Link href="/shop?filter=new" className="hidden sm:block text-sm tracking-widest uppercase underline underline-offset-4 hover:text-brand-gold transition-colors">
            See All
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>

        <div className="text-center mt-10 sm:hidden">
          <Link href="/shop?filter=new" className="btn-outline inline-block">See All New Arrivals</Link>
        </div>
      </div>
    </section>
  );
}
