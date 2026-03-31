"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  phone: string;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, getSubtotal, clearCart } = useCartStore();
  const router = useRouter();

  const [address, setAddress] = useState<Address>({
    fullName: session?.user.name || "",
    street: "",
    city: "",
    state: "",
    country: "Nigeria",
    phone: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [promoValidated, setPromoValidated] = useState<{ discount: number; code: string } | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [validatingPromo, setValidatingPromo] = useState(false);

  const SHIPPING_RATES: Record<string, number> = {
    "Lagos": 2500,
    "Abuja": 3000, "FCT": 3000,
    "Rivers": 3500, "Oyo": 3000, "Kano": 4000,
    "Enugu": 3500, "Anambra": 3500, "Imo": 3500, "Abia": 3500,
    "Delta": 3500, "Edo": 3500, "Bayelsa": 4000, "Cross River": 4000,
    "Akwa Ibom": 4000, "Kaduna": 4000, "Katsina": 4500, "Sokoto": 4500,
    "Zamfara": 4500, "Kebbi": 4500, "Niger": 4000, "Kwara": 3500,
    "Ogun": 2800, "Ondo": 3500, "Ekiti": 3500, "Osun": 3000,
    "Borno": 5000, "Adamawa": 4500, "Taraba": 4500, "Yobe": 5000,
    "Gombe": 4500, "Bauchi": 4500, "Plateau": 4000, "Nasarawa": 3500,
    "Benue": 4000, "Kogi": 3500, "Jigawa": 4500,
  };

  const subtotal = getSubtotal();
  const baseShipping = SHIPPING_RATES[address.state] ?? 3500;
  const shippingFee = subtotal >= 100000 ? 0 : baseShipping;
  const discount = promoValidated?.discount || 0;
  const total = subtotal + shippingFee - discount;

  const validatePromo = async () => {
    if (!promoCode) return;
    setValidatingPromo(true);
    const res = await fetch("/api/promos/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoCode, subtotal }),
    });
    const data = await res.json();
    if (res.ok) {
      setPromoValidated({ discount: data.discount, code: promoCode });
      toast.success(`Promo applied! You save ₦${data.discount.toLocaleString()}`);
    } else {
      toast.error(data.error);
      setPromoValidated(null);
    }
    setValidatingPromo(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Your cart is empty"); return; }
    if (!address.fullName || !address.street || !address.city || !address.state || !address.phone) {
      toast.error("Please fill all address fields");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        shippingAddress: address,
        promoCode: promoValidated?.code,
        notes,
      }),
    });

    const data = await res.json();
    if (res.ok && data.paymentUrl) {
      clearCart();
      window.location.href = data.paymentUrl;
    } else if (res.ok && !data.paymentUrl) {
      toast.error(data.paystackError || "Payment setup failed. Check your Paystack keys.");
      setLoading(false);
    } else {
      toast.error(data.error || "Order failed");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl md:text-4xl mb-10">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Address form */}
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h2 className="font-serif text-xl mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs tracking-widest uppercase block mb-1">Full Name *</label>
                  <input
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    required
                    className="input-field"
                    placeholder="Your full name"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs tracking-widest uppercase block mb-1">Street Address *</label>
                  <input
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    required
                    className="input-field"
                    placeholder="Street, house number, apartment"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase block mb-1">City *</label>
                  <input
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                    className="input-field"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase block mb-1">State *</label>
                  <select
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    required
                    className="input-field"
                  >
                    <option value="">Select state</option>
                    {["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase block mb-1">Country</label>
                  <input value={address.country} readOnly className="input-field bg-brand-cream cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase block mb-1">Phone *</label>
                  <input
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    required
                    className="input-field"
                    placeholder="+234 000 000 0000"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-xl mb-4">Order Notes (Optional)</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="input-field resize-none"
                placeholder="Any special instructions for your order"
              />
            </section>
          </div>

          {/* Summary */}
          <div className="bg-brand-cream p-6 h-fit">
            <h2 className="font-serif text-xl mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={`${item.product._id}-${item.size}`} className="flex justify-between text-sm">
                  <span className="text-brand-gray truncate mr-2">
                    {item.product.name} × {item.quantity} <span className="text-xs">({item.size})</span>
                  </span>
                  <span className="whitespace-nowrap">₦{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Promo */}
            <div className="border-t border-brand-gray-light pt-4 mb-4">
              <label className="text-xs tracking-widest uppercase block mb-2">Promo Code</label>
              <div className="flex gap-2">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 input-field text-xs"
                  placeholder="ENTER CODE"
                />
                <button
                  type="button"
                  onClick={validatePromo}
                  disabled={validatingPromo || !!promoValidated}
                  className="btn-outline text-xs px-3 py-2 whitespace-nowrap"
                >
                  {validatingPromo ? "..." : promoValidated ? "Applied" : "Apply"}
                </button>
              </div>
              {promoValidated && (
                <p className="text-green-600 text-xs mt-1">✓ Saving ₦{promoValidated.discount.toLocaleString()}</p>
              )}
            </div>

            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-brand-gray">Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray">Shipping</span>
                <span>
                  {!address.state
                    ? <span className="text-brand-gray text-xs">Enter state</span>
                    : shippingFee === 0
                    ? <span className="text-green-600">Free</span>
                    : `₦${shippingFee.toLocaleString()}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₦{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-brand-gray-light pt-3 flex justify-between font-medium">
                <span>Total</span>
                <span className="font-serif text-xl">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full">
              {loading ? "Processing..." : `Pay ₦${total.toLocaleString()}`}
            </button>
            <p className="text-xs text-brand-gray text-center mt-3">Secured by Paystack</p>
          </div>
        </div>
      </form>
    </div>
  );
}
