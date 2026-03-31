"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { HiTrash, HiMinus, HiPlus } from "react-icons/hi2";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 100000 ? 0 : 3500;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-3xl mb-4">Your Bag is Empty</h1>
        <p className="text-brand-gray mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/shop" className="btn-primary inline-block">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl md:text-4xl mb-10">Shopping Bag ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={`${item.product._id}-${item.size}`} className="flex gap-4 border-b border-brand-gray-light pb-6">
              <Link href={`/shop/${item.product.slug}`} className="relative w-24 h-32 flex-shrink-0 bg-brand-cream overflow-hidden">
                {item.product.images[0] && (
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="96px" />
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/shop/${item.product.slug}`} className="font-medium text-sm hover:text-brand-gold transition-colors">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-brand-gray mt-1">Size: {item.size}</p>
                    {item.color && <p className="text-xs text-brand-gray">Color: {item.color}</p>}
                  </div>
                  <button
                    onClick={() => removeItem(item.product._id, item.size)}
                    className="text-brand-gray hover:text-red-500 transition-colors ml-2"
                    aria-label="Remove item"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex border border-brand-gray-light">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-brand-cream"
                    >
                      <HiMinus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1 text-sm min-w-[32px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-brand-cream"
                    >
                      <HiPlus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-medium text-sm">
                    ₦{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-brand-cream p-6 h-fit">
          <h2 className="font-serif text-xl mb-6">Order Summary</h2>

          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-brand-gray">Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray">Shipping</span>
              <span>{shippingFee === 0 ? <span className="text-green-600">Free</span> : `₦${shippingFee.toLocaleString()}`}</span>
            </div>
            {subtotal < 100000 && (
              <p className="text-xs text-brand-gray">Add ₦{(100000 - subtotal).toLocaleString()} more for free shipping</p>
            )}
          </div>

          <div className="border-t border-brand-gray-light pt-4 mb-6">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span className="font-serif text-xl">₦{(subtotal + shippingFee).toLocaleString()}</span>
            </div>
          </div>

          <Link href="/checkout" className="btn-primary block text-center">
            Proceed to Checkout
          </Link>
          <Link href="/shop" className="btn-outline block text-center mt-3">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
