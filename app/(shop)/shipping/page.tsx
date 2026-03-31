import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping Policy | 5thJohnson",
  description: "5thJohnson shipping rates, delivery timelines and policies.",
};

const RATES = [
  { zone: "Lagos", states: "Lagos", time: "1–2 business days", fee: "₦2,500" },
  { zone: "South-West", states: "Ogun, Oyo, Osun, Ondo, Ekiti", time: "2–3 business days", fee: "₦2,800–₦3,500" },
  { zone: "South-South", states: "Rivers, Delta, Edo, Bayelsa, Cross River, Akwa Ibom", time: "3–4 business days", fee: "₦3,500–₦4,000" },
  { zone: "South-East", states: "Enugu, Anambra, Imo, Abia, Ebonyi", time: "3–4 business days", fee: "₦3,500" },
  { zone: "North-Central", states: "FCT/Abuja, Kwara, Kogi, Niger, Benue, Plateau, Nasarawa", time: "3–5 business days", fee: "₦3,000–₦4,000" },
  { zone: "North-West", states: "Kano, Kaduna, Katsina, Sokoto, Zamfara, Kebbi, Jigawa", time: "4–6 business days", fee: "₦4,000–₦4,500" },
  { zone: "North-East", states: "Gombe, Bauchi, Adamawa, Taraba, Borno, Yobe", time: "5–7 business days", fee: "₦4,500–₦5,000" },
];

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="section-subtitle">Delivery</p>
        <h1 className="section-title text-4xl">Shipping Policy</h1>
        <p className="text-brand-gray mt-4 text-sm">Last updated: March 2026</p>
      </div>

      <div className="prose-sm text-brand-gray space-y-8">
        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">Free Shipping</h2>
          <p className="leading-relaxed">All orders above <strong className="text-brand-black">₦100,000</strong> qualify for free shipping to any state in Nigeria. The free shipping threshold is calculated on the order subtotal after any applicable discounts.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-4">Delivery Rates & Timelines</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-brand-black text-white">
                  <th className="px-4 py-3 text-xs tracking-widest uppercase">Zone</th>
                  <th className="px-4 py-3 text-xs tracking-widest uppercase">States</th>
                  <th className="px-4 py-3 text-xs tracking-widest uppercase">Timeline</th>
                  <th className="px-4 py-3 text-xs tracking-widest uppercase">Fee</th>
                </tr>
              </thead>
              <tbody>
                {RATES.map((row, i) => (
                  <tr key={row.zone} className={i % 2 === 0 ? "bg-white" : "bg-brand-cream"}>
                    <td className="px-4 py-3 font-medium text-brand-black">{row.zone}</td>
                    <td className="px-4 py-3 text-brand-gray">{row.states}</td>
                    <td className="px-4 py-3 text-brand-gray">{row.time}</td>
                    <td className="px-4 py-3 text-brand-black font-medium">{row.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">Order Processing</h2>
          <p className="leading-relaxed">Orders are processed Monday–Friday, excluding public holidays. Orders placed before 12pm WAT on a business day are typically dispatched the same day. Orders placed after 12pm or on weekends are dispatched the next business day.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">Tracking Your Order</h2>
          <p className="leading-relaxed">Once your order is shipped, you'll receive a tracking number via email. You can also monitor your order status under <strong className="text-brand-black">My Orders</strong> in your account.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">Delivery Issues</h2>
          <p className="leading-relaxed">If your order hasn't arrived within the estimated timeframe, please <Link href="/contact" className="text-brand-black underline hover:text-brand-gold">contact us</Link>. We'll investigate with the courier and resolve the issue as quickly as possible.</p>
        </section>
      </div>
    </div>
  );
}
