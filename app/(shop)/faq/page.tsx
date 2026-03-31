import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQs | 5thJohnson",
  description: "Frequently asked questions about 5thJohnson orders, shipping, returns and more.",
};

const FAQS = [
  {
    category: "Orders",
    questions: [
      { q: "How do I place an order?", a: "Browse our shop, select your size, add items to your bag and proceed to checkout. You'll need an account to complete your purchase." },
      { q: "Can I modify or cancel my order?", a: "Orders can be modified or cancelled within 2 hours of placement. Contact us immediately via WhatsApp or email if you need to make changes." },
      { q: "How will I know my order was confirmed?", a: "You'll receive an order confirmation email once payment is successful. You can also track your order status in your account under 'My Orders'." },
    ],
  },
  {
    category: "Shipping",
    questions: [
      { q: "Where do you deliver?", a: "We deliver across all 36 states in Nigeria. Delivery times and fees vary by location." },
      { q: "How long does delivery take?", a: "Lagos orders: 1–2 business days. South-West states: 2–3 business days. Other states: 3–5 business days." },
      { q: "Do you offer free shipping?", a: "Yes! Orders above ₦100,000 qualify for free shipping nationwide." },
      { q: "Can I track my order?", a: "Yes. Once your order is shipped, you'll receive a tracking number via email. You can also check your order status in your account." },
    ],
  },
  {
    category: "Returns & Exchanges",
    questions: [
      { q: "What is your return policy?", a: "We accept returns within 7 days of delivery for items in original, unworn condition with tags attached. Sale items are final sale." },
      { q: "How do I start a return?", a: "Contact us via email or WhatsApp with your order number and reason for return. We'll guide you through the process." },
      { q: "When will I receive my refund?", a: "Refunds are processed within 5–7 business days after we receive and inspect the returned item." },
    ],
  },
  {
    category: "Sizing & Products",
    questions: [
      { q: "How do I know what size to order?", a: "Check our Size Guide for detailed measurements. If you're between sizes, we recommend sizing up. You can also contact us for personalised advice." },
      { q: "Are your colours accurate?", a: "We do our best to display colours accurately, but slight variations may occur due to screen settings and photography lighting." },
    ],
  },
  {
    category: "Payments",
    questions: [
      { q: "What payment methods do you accept?", a: "We accept all major debit and credit cards, bank transfers, and USSD payments via Paystack — Nigeria's leading secure payment platform." },
      { q: "Is it safe to pay on your website?", a: "Absolutely. All payments are processed by Paystack, which uses industry-standard encryption to protect your details." },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="section-subtitle">Help Centre</p>
        <h1 className="section-title text-4xl">Frequently Asked Questions</h1>
      </div>

      <div className="space-y-10">
        {FAQS.map((section) => (
          <div key={section.category}>
            <h2 className="font-serif text-xl mb-4 pb-2 border-b border-brand-gray-light">{section.category}</h2>
            <div className="space-y-5">
              {section.questions.map((item) => (
                <div key={item.q}>
                  <p className="font-medium text-brand-black mb-1">{item.q}</p>
                  <p className="text-sm text-brand-gray leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-brand-cream p-6 text-center">
        <p className="text-sm text-brand-gray mb-3">Can't find what you're looking for?</p>
        <Link href="/contact" className="btn-primary inline-block">Contact Us</Link>
      </div>
    </div>
  );
}
