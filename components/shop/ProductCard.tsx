"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { IProduct } from "@/types";
import toast from "react-hot-toast";

interface Props {
  product: IProduct;
  wishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
}

export default function ProductCard({ product, wishlisted = false, onWishlistToggle }: Props) {
  const [imgIndex, setImgIndex] = useState(0);
  const [localWishlisted, setLocalWishlisted] = useState(wishlisted);
  const { data: session } = useSession();
  const addItem = useCartStore((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.sizes.length > 0) {
      addItem(product, product.sizes[0]);
      toast.success("Added to cart!");
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) { toast.error("Sign in to save to wishlist"); return; }
    if (onWishlistToggle) {
      onWishlistToggle(product._id);
      setLocalWishlisted(!localWishlisted);
      return;
    }
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id }),
    });
    const data = await res.json();
    if (res.ok) {
      setLocalWishlisted(data.wishlisted);
      toast.success(data.wishlisted ? "Added to wishlist" : "Removed from wishlist");
    }
  };

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  return (
    <div className="group relative card-hover">
      <Link href={`/shop/${product.slug}`}>
        <div
          className="relative overflow-hidden bg-brand-cream aspect-[3/4]"
          onMouseEnter={() => product.images[1] && setImgIndex(1)}
          onMouseLeave={() => setImgIndex(0)}
        >
          {product.images[imgIndex] ? (
            <Image
              src={product.images[imgIndex]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-brand-gray-light flex items-center justify-center">
              <span className="text-brand-gray text-sm">No image</span>
            </div>
          )}

          {/* Badges */}
          {product.newArrival && (
            <span className="product-badge">New</span>
          )}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-xs tracking-widest uppercase bg-black px-3 py-1">Sold Out</span>
            </div>
          )}

          {/* Hover actions */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleQuickAdd}
              disabled={product.stock === 0}
              className="w-full bg-brand-black text-white text-xs py-2 tracking-widest uppercase hover:bg-brand-gray-dark transition-colors disabled:opacity-50"
            >
              <HiOutlineShoppingBag className="inline w-4 h-4 mr-1" />
              Quick Add
            </button>
          </div>
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
          aria-label={localWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {localWishlisted ? (
            <HiHeart className="w-4 h-4 text-red-500" />
          ) : (
            <HiOutlineHeart className="w-4 h-4 text-brand-gray-dark" />
          )}
        </button>

        {/* Product info */}
        <div className="pt-3">
          <p className="text-xs text-brand-gray tracking-wider uppercase mb-1">
            {product.category}
          </p>
          <h3 className="text-sm font-medium text-brand-black truncate">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold">
              ₦{product.price.toLocaleString()}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-brand-gray line-through">
                ₦{product.comparePrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.averageRating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} className={`text-xs ${s <= Math.round(product.averageRating) ? "text-brand-gold" : "text-brand-gray-light"}`}>★</span>
                ))}
              </div>
              <span className="text-xs text-brand-gray">({product.totalReviews})</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
