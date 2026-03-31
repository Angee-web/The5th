import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | 5thJohnson",
  description: "Terms and conditions for using the 5thJohnson website and services.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="section-subtitle">Legal</p>
        <h1 className="section-title text-4xl">Terms of Service</h1>
        <p className="text-brand-gray mt-4 text-sm">Last updated: March 2026</p>
      </div>

      <div className="space-y-8 text-sm text-brand-gray leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using the 5thJohnson website (the5th.vercel.app), you agree to be bound by these Terms of Service. If you do not agree, please do not use our website.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">2. Eligibility</h2>
          <p>You must be at least 18 years old to create an account and make purchases on our website. By using our site, you confirm that you meet this requirement.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">3. Your Account</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Notify us immediately if you suspect unauthorised access.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">4. Products & Pricing</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>All prices are displayed in Nigerian Naira (₦) and are inclusive of applicable taxes.</li>
            <li>We reserve the right to change prices at any time without notice.</li>
            <li>Product images are for illustrative purposes. Colours may vary slightly due to screen differences.</li>
            <li>We reserve the right to limit order quantities or refuse orders at our discretion.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">5. Payment</h2>
          <p>All payments are processed securely through Paystack. By placing an order, you confirm that you are authorised to use the chosen payment method. Orders are only fulfilled after payment is confirmed.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">6. Shipping & Delivery</h2>
          <p>Delivery timelines are estimates and may be affected by factors beyond our control (public holidays, courier delays, remote locations). See our <Link href="/shipping" className="text-brand-black underline hover:text-brand-gold">Shipping Policy</Link> for full details.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">7. Returns & Refunds</h2>
          <p>Our returns and refund process is governed by our <Link href="/returns" className="text-brand-black underline hover:text-brand-gold">Returns & Exchanges Policy</Link>. Sale items are non-refundable.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">8. Intellectual Property</h2>
          <p>All content on this website — including images, text, logos, and designs — is the property of 5thJohnson and may not be reproduced or used without written permission.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">9. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, 5thJohnson shall not be liable for indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount paid for the relevant order.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">10. Governing Law</h2>
          <p>These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in Nigerian courts.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">11. Changes to Terms</h2>
          <p>We may update these terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the new terms.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">12. Contact</h2>
          <p>For questions about these terms, please <Link href="/contact" className="text-brand-black underline hover:text-brand-gold">contact us</Link>.</p>
        </section>
      </div>
    </div>
  );
}
