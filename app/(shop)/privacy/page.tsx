import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | 5thJohnson",
  description: "How 5thJohnson collects, uses and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="section-subtitle">Legal</p>
        <h1 className="section-title text-4xl">Privacy Policy</h1>
        <p className="text-brand-gray mt-4 text-sm">Last updated: March 2026</p>
      </div>

      <div className="space-y-8 text-sm text-brand-gray leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">1. Who We Are</h2>
          <p>5thJohnson is an online women's fashion retailer based in Nigeria. Our website is <strong className="text-brand-black">the5th.vercel.app</strong>. When you use our website or place an order, you entrust us with your personal information. We take that responsibility seriously.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">2. Information We Collect</h2>
          <p className="mb-3">We collect the following types of information:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong className="text-brand-black">Account information:</strong> name, email address, and password when you create an account.</li>
            <li><strong className="text-brand-black">Order information:</strong> shipping address, phone number, and purchase history.</li>
            <li><strong className="text-brand-black">Payment information:</strong> payments are processed by Paystack. We do not store your card details.</li>
            <li><strong className="text-brand-black">Usage data:</strong> pages visited, products viewed, and how you interact with our site.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">3. How We Use Your Information</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>To process and fulfil your orders</li>
            <li>To send order confirmations and delivery updates</li>
            <li>To manage your account and provide customer support</li>
            <li>To send promotional emails (only if you have opted in)</li>
            <li>To improve our website and product offerings</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">4. Sharing Your Information</h2>
          <p>We do not sell or rent your personal data. We may share your information with:</p>
          <ul className="space-y-2 list-disc list-inside mt-3">
            <li><strong className="text-brand-black">Delivery partners</strong> — to fulfil your orders (name, address, phone).</li>
            <li><strong className="text-brand-black">Paystack</strong> — our payment processor. See their privacy policy at paystack.com.</li>
            <li><strong className="text-brand-black">Cloudinary</strong> — our image hosting service.</li>
            <li><strong className="text-brand-black">Law enforcement</strong> — if required by law.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">5. Data Retention</h2>
          <p>We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">6. Your Rights</h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of marketing communications at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">7. Cookies</h2>
          <p>We use cookies to keep you logged in and to understand how you use our site. You can disable cookies in your browser settings, but this may affect your experience.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-brand-black mb-3">8. Contact Us</h2>
          <p>If you have questions about this policy or your data, please <Link href="/contact" className="text-brand-black underline hover:text-brand-gold">contact us</Link>.</p>
        </section>
      </div>
    </div>
  );
}
