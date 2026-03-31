"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { IProduct } from "@/types";
import { HiXMark, HiCloudArrowUp } from "react-icons/hi2";

const CATEGORIES = ["dresses", "tops", "bottoms", "outerwear", "accessories", "sets", "sale"];
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

interface Props {
  product?: Partial<IProduct>;
  isEdit?: boolean;
}

export default function ProductForm({ product, isEdit }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    comparePrice: product?.comparePrice || "",
    category: product?.category || "dresses",
    sizes: product?.sizes || [],
    colors: product?.colors || [],
    stock: product?.stock || "",
    featured: product?.featured || false,
    newArrival: product?.newArrival || false,
    tags: product?.tags?.join(", ") || "",
  });
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [colorInput, setColorInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) setImages((prev) => [...prev, data.url]);
      else toast.error(`Upload failed: ${data.error}`);
    }
    setUploading(false);
  };

  const toggleSize = (s: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }));
  };

  const addColor = () => {
    if (colorInput && !form.colors.includes(colorInput)) {
      setForm((f) => ({ ...f, colors: [...f.colors, colorInput] }));
      setColorInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) { toast.error("Add at least one image"); return; }
    setSaving(true);

    const body = {
      ...form,
      price: parseFloat(form.price as string),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice as string) : undefined,
      stock: parseInt(form.stock as string),
      images,
      tags: form.tags ? form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
    };

    const url = isEdit ? `/api/products/${product?._id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast.success(isEdit ? "Product updated!" : "Product created!");
      router.push("/admin/products");
    } else {
      const data = await res.json();
      toast.error(data.error);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Images */}
      <div>
        <label className="text-xs tracking-widest uppercase block mb-2">Product Images</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img, i) => (
            <div key={i} className="relative w-24 h-28">
              <Image src={img} alt={`img-${i}`} fill className="object-cover" sizes="96px" />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center"
              >
                <HiXMark className="w-3 h-3" />
              </button>
              {i === 0 && <span className="absolute bottom-1 left-1 bg-brand-gold text-white text-[9px] px-1 rounded">Main</span>}
            </div>
          ))}

          <label className="w-24 h-28 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand-gold transition-colors">
            {uploading ? (
              <div className="w-5 h-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <HiCloudArrowUp className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">Upload</span>
              </>
            )}
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="text-xs tracking-widest uppercase block mb-1">Product Name *</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field" placeholder="e.g. Floral Wrap Dress" />
      </div>

      {/* Description */}
      <div>
        <label className="text-xs tracking-widest uppercase block mb-1">Description *</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} className="input-field resize-none" placeholder="Product description..." />
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs tracking-widest uppercase block mb-1">Price (₦) *</label>
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" className="input-field" placeholder="15000" />
        </div>
        <div>
          <label className="text-xs tracking-widest uppercase block mb-1">Compare Price (₦)</label>
          <input type="number" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} min="0" className="input-field" placeholder="20000 (optional)" />
        </div>
      </div>

      {/* Category & Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs tracking-widest uppercase block mb-1">Category *</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field capitalize">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs tracking-widest uppercase block mb-1">Stock *</label>
          <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required min="0" className="input-field" placeholder="0" />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <label className="text-xs tracking-widest uppercase block mb-2">Sizes</label>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSize(s)}
              className={`px-3 py-1 text-xs border transition-colors ${form.sizes.includes(s) ? "bg-brand-black text-white border-brand-black" : "border-gray-200 hover:border-brand-black"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <label className="text-xs tracking-widest uppercase block mb-2">Colors</label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {form.colors.map((c) => (
            <span key={c} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
              {c}
              <button type="button" onClick={() => setForm((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) }))}>
                <HiXMark className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={colorInput} onChange={(e) => setColorInput(e.target.value)} className="input-field flex-1" placeholder="e.g. Midnight Blue" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())} />
          <button type="button" onClick={addColor} className="btn-outline px-3 py-2 text-xs">Add</button>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="text-xs tracking-widest uppercase block mb-1">Tags (comma separated)</label>
        <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="summer, casual, office" />
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-brand-gold w-4 h-4" />
          <span className="text-sm">Featured</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.newArrival} onChange={(e) => setForm({ ...form, newArrival: e.target.checked })} className="accent-brand-gold w-4 h-4" />
          <span className="text-sm">New Arrival</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
