"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import { IProduct } from "@/types";

export default function WishlistPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((d) => { setProducts(d || []); setLoading(false); });
  }, []);

  const handleToggle = async (id: string) => {
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id }),
    });
    setProducts(products.filter((p) => p._id !== id));
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-brand-gray-light rounded w-48 mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-brand-gray-light" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl mb-8">Wishlist ({products.length})</h1>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-serif text-2xl text-brand-gray-dark mb-4">Your wishlist is empty</p>
          <p className="text-brand-gray mb-8">Save your favourite pieces here</p>
          <Link href="/shop" className="btn-primary inline-block">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} wishlisted onWishlistToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
