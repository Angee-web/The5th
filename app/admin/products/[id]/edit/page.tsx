"use client";

import { useEffect, useState } from "react";
import ProductForm from "@/components/admin/ProductForm";
import { IProduct } from "@/types";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then(setProduct);
  }, [params.id]);

  if (!product) return <div className="p-6 animate-pulse"><div className="h-8 bg-gray-200 rounded w-48 mb-8" /><div className="h-96 bg-gray-200 rounded" /></div>;

  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold mb-8">Edit Product</h1>
      <ProductForm product={product} isEdit />
    </div>
  );
}
