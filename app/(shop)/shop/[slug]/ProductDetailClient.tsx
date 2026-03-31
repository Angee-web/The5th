"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import { IProduct, IReview } from "@/types";
import { HiOutlineHeart, HiHeart, HiStar, HiOutlineStar } from "react-icons/hi2";
import { useSession } from "next-auth/react";

interface Props { slug: string }

export default function ProductDetailClient({ slug }: Props) {
  const { data: session } = useSession();
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((p) => {
        setProduct(p);
        setLoading(false);
        if (p._id) {
          fetch(`/api/reviews?productId=${p._id}`)
            .then((r) => r.json())
            .then(setReviews);
        }
      });
  }, [slug]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-brand-gray-light" />
        <div className="space-y-4">
          <div className="h-8 bg-brand-gray-light rounded w-3/4" />
          <div className="h-6 bg-brand-gray-light rounded w-1/4" />
          <div className="h-24 bg-brand-gray-light rounded" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-24">
      <h2 className="font-serif text-2xl mb-4">Product not found</h2>
      <Link href="/shop" className="btn-primary">Back to Shop</Link>
    </div>
  );

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      toast.error("Please select a size");
      return;
    }
    addItem(product, selectedSize || "One Size", undefined, qty);
    toast.success("Added to cart!");
  };

  const handleWishlist = async () => {
    if (!session) { toast.error("Please sign in to save items"); return; }
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id }),
    });
    const data = await res.json();
    setWishlisted(data.wishlisted);
    toast.success(data.wishlisted ? "Added to wishlist" : "Removed from wishlist");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { toast.error("Please sign in to review"); return; }
    setSubmittingReview(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id, rating: reviewRating, comment: reviewComment }),
    });
    const data = await res.json();
    if (res.ok) {
      setReviews([data, ...reviews]);
      setReviewComment("");
      toast.success("Review submitted!");
    } else {
      toast.error(data.error);
    }
    setSubmittingReview(false);
  };

  const discount = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-brand-gray mb-8 flex gap-2">
        <Link href="/" className="hover:text-brand-black">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-black">Shop</Link>
        <span>/</span>
        <span className="text-brand-black">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] bg-brand-cream overflow-hidden mb-4">
            {product.images[selectedImg] ? (
              <Image
                src={product.images[selectedImg]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-brand-gray">No image</div>
            )}
            {product.newArrival && <span className="product-badge">New</span>}
            {discount > 0 && <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1">-{discount}%</span>}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`relative w-20 h-24 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                    selectedImg === i ? "border-brand-black" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs tracking-widest uppercase text-brand-gray mb-2">{product.category}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-brand-black mb-3">{product.name}</h1>

          {product.averageRating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} className={`text-sm ${s <= Math.round(product.averageRating) ? "text-brand-gold" : "text-brand-gray-light"}`}>★</span>
                ))}
              </div>
              <span className="text-sm text-brand-gray">({product.totalReviews} reviews)</span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-serif text-2xl font-semibold">₦{product.price.toLocaleString()}</span>
            {product.comparePrice && (
              <span className="text-brand-gray line-through text-base">₦{product.comparePrice.toLocaleString()}</span>
            )}
            {discount > 0 && <span className="text-red-500 text-sm font-medium">Save {discount}%</span>}
          </div>

          <p className="text-brand-gray-dark text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Size selector */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs tracking-widest uppercase font-medium">Size</span>
                <button className="text-xs underline underline-offset-2 text-brand-gray hover:text-brand-black">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      selectedSize === s
                        ? "bg-brand-black text-white border-brand-black"
                        : "border-brand-gray-light hover:border-brand-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs tracking-widest uppercase font-medium">Qty</span>
            <div className="flex border border-brand-gray-light">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-brand-cream">-</button>
              <span className="px-4 py-2 text-sm min-w-[40px] text-center">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 hover:bg-brand-cream">+</button>
            </div>
            <span className="text-xs text-brand-gray">{product.stock} in stock</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 btn-primary disabled:opacity-40"
            >
              {product.stock === 0 ? "Sold Out" : "Add to Cart"}
            </button>
            <button
              onClick={handleWishlist}
              className="w-12 h-12 border border-brand-gray-light flex items-center justify-center hover:border-brand-black transition-colors"
              aria-label="Wishlist"
            >
              {wishlisted ? <HiHeart className="w-5 h-5 text-red-500" /> : <HiOutlineHeart className="w-5 h-5" />}
            </button>
          </div>

          {/* Stock warning */}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-red-500 text-xs mb-4">Only {product.stock} left!</p>
          )}

          {/* Details */}
          <div className="border-t border-brand-gray-light pt-6 space-y-2">
            <p className="text-xs text-brand-gray"><span className="font-medium text-brand-black">Category:</span> {product.category}</p>
            {product.tags.length > 0 && (
              <p className="text-xs text-brand-gray"><span className="font-medium text-brand-black">Tags:</span> {product.tags.join(", ")}</p>
            )}
            <p className="text-xs text-brand-gray">Free shipping on orders over ₦50,000</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-20 border-t border-brand-gray-light pt-12">
        <h2 className="font-serif text-2xl mb-8">Customer Reviews</h2>

        {session && (
          <form onSubmit={handleReviewSubmit} className="bg-brand-cream p-6 mb-10">
            <h3 className="font-medium mb-4">Write a Review</h3>
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map((s) => (
                <button key={s} type="button" onClick={() => setReviewRating(s)}>
                  {s <= reviewRating ? (
                    <HiStar className="w-6 h-6 text-brand-gold" />
                  ) : (
                    <HiOutlineStar className="w-6 h-6 text-brand-gray" />
                  )}
                </button>
              ))}
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your experience with this product (min. 10 characters)"
              required
              minLength={10}
              rows={4}
              className="input-field mb-4 resize-none"
            />
            <button type="submit" disabled={submittingReview} className="btn-primary">
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-brand-gray text-sm">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r._id} className="border-b border-brand-gray-light pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-brand-black text-white flex items-center justify-center text-sm font-medium">
                    {r.user.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.user.name}</p>
                    <p className="text-xs text-brand-gray">{new Date(r.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex mb-2">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className={`text-sm ${s <= r.rating ? "text-brand-gold" : "text-brand-gray-light"}`}>★</span>
                  ))}
                </div>
                <p className="text-sm text-brand-gray-dark">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
