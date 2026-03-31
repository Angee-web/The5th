"use client";

export default function Newsletter() {
  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-xl mx-auto px-4 text-center">
        <p className="section-subtitle">Stay In The Loop</p>
        <h2 className="section-title mb-4">Join The Insider List</h2>
        <p className="text-brand-gray text-sm mb-6">
          Be the first to know about new arrivals, exclusive offers, and style tips.
        </p>
        <div className="inline-block border border-brand-gray-light px-6 py-3 text-sm tracking-widest uppercase text-brand-gray">
          Coming Soon
        </div>
        <p className="text-xs text-brand-gray mt-4">
          Our insider list is launching soon. Check back shortly!
        </p>
      </div>
    </section>
  );
}
