import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Exchanges | 5thJohnson",
  description: "5thJohnson returns and exchanges policy.",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="section-subtitle">After Your Purchase</p>
        <h1 className="section-title text-4xl">Returns & Exchanges</h1>
        <p className="text-brand-gray mt-4 text-sm">Last updated: March 2026</p>
      </div>

      <div className="space-y-8 text-sm text-brand-gray">
        <section className="bg-brand-cream p-6">
          <h2 className="font-serif text-xl text-brand-black mb-3">Our Promise</h2>
          <p className="leading-relaxed">We want you to love every piece from 5thJohnson. If something isn't right, we'll make it right. Our return and exchange window is <strong className="text-brand-black">7 days</strong> from the date of delivery.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">Eligible Items</h2>
          <p className="leading-relaxed mb-3">To be accepted for return or exchange, items must be:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Unworn, unwashed, and in original condition</li>
            <li>With all original tags still attached</li>
            <li>In original packaging where applicable</li>
            <li>Returned within 7 days of delivery</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">Non-Returnable Items</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Sale and discounted items (final sale)</li>
            <li>Accessories (for hygiene reasons)</li>
            <li>Items that show signs of wear or washing</li>
            <li>Items without tags or original packaging</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">How To Initiate a Return</h2>
          <ol className="space-y-3 list-decimal list-inside leading-relaxed">
            <li>Contact us within 7 days of delivery via <Link href="/contact" className="text-brand-black underline hover:text-brand-gold">WhatsApp or email</Link> with your order number and reason for return.</li>
            <li>We'll confirm eligibility and send you return instructions.</li>
            <li>Pack the item securely and ship to our address (provided upon confirmation).</li>
            <li>Once received and inspected, we'll process your refund or exchange within 5–7 business days.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">Refunds</h2>
          <p className="leading-relaxed">Approved refunds are credited back to the original payment method within 5–7 business days. Return shipping costs are borne by the customer unless the return is due to a fault on our part (wrong item, damaged item).</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">Exchanges</h2>
          <p className="leading-relaxed">We're happy to exchange for a different size or colour, subject to availability. If your preferred item is out of stock, we'll issue a store credit or full refund.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">Damaged or Wrong Items</h2>
          <p className="leading-relaxed">If you received a damaged or incorrect item, please contact us within 48 hours of delivery with photos. We'll arrange a free return and send the correct item at no additional cost.</p>
        </section>
      </div>

      <div className="mt-10 bg-brand-cream p-6 text-center">
        <p className="text-sm text-brand-gray mb-3">Have a question about your order?</p>
        <Link href="/contact" className="btn-primary inline-block">Contact Us</Link>
      </div>
    </div>
  );
}
