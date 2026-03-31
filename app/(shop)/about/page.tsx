import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | 5thJohnson",
  description: "The story behind 5thJohnson — women's fashion brand made for the modern Nigerian woman.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-20">
        <p className="section-subtitle">Our Brand Story</p>
        <h1 className="font-serif text-4xl md:text-6xl text-brand-black max-w-3xl mx-auto leading-tight">
          Dressed to <span className="italic text-brand-gold">empower</span>.
        </h1>
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
        <div className="bg-brand-cream aspect-square flex items-center justify-center">
          <div className="text-center p-12">
            <span className="font-serif text-5xl font-bold text-brand-black">5thJohnson<span className="text-brand-gold">.</span></span>
          </div>
        </div>
        <div>
          <h2 className="font-serif text-3xl mb-6">Where It All Began</h2>
          <p className="text-brand-gray-dark leading-relaxed mb-4">
          5thJohnson started long before it became a brand — it started in 2016 with a student who simply wanted to make clothes. No big plan, no roadmap, just a quiet pull towards creating pieces that felt right. It was late nights figuring things out from scratch, learning by doing, getting it wrong, starting again, and slowly finding a rhythm. Every stitch was practice, every mistake was part of the process, and every small win meant something.
          </p>
          <p className="text-brand-gray-dark leading-relaxed mb-4">What began as curiosity turned into consistency. Over time, it became less about just making clothes and more about understanding women — how they move, what they need, how they want to feel in what they wear. That journey is still ongoing. 5thJohnson is still growing, still learning, still refining — with the same intention it started with: to create pieces that feel effortless, thoughtful, and true. And while there’s still so much ahead, the heart of it remains the same — to build something that lasts, and to keep showing up, one piece at a time.</p>
          <p className="text-brand-gray-dark leading-relaxed mb-4">
            5thJohnson is for you and me; <span className="font-extrabold">THE EVERYDAY WOMAN</span>.
          </p>
          <p className="text-brand-gray-dark leading-relaxed mb-4">
            The striving entrepreneur, the career woman, the one always in a hurry, the young mother, the girlie who doesn't like to do too much.
          </p>
          <p className="text-brand-gray-dark leading-relaxed mb-4">
            It's intentionally curated outfits.
          </p>
          <p className="text-brand-gray-dark leading-relaxed mb-4">
            It's maintaining comfort and indivdual style effortlessly.
          </p>
          <p className="text-brand-gray-dark leading-relaxed mb-4">
            It's always having something to wear.
          </p>
          <p className="text-brand-gray-dark leading-relaxed mb-4">
            It's a wardrobe filled with well-made pieces, carefully tailored just for you.
          </p>
          <p className="text-brand-gray-dark leading-relaxed mb-4">
            Think Elevated basics, detailed lines, semi-loose silhouettes, soothing fabrics, and properly stiched seams made to last.
          </p>
          <p className="text-brand-gray-dark leading-relaxed mb-4">
            It's a brand you can always count on like a trusted friend; comforting, dependable and readily available.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="bg-brand-black text-white py-20 px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl">What We Stand For</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {[
            { title: "Quality First", text: "Every piece is hand-picked for exceptional quality, fabric, and finish." },
            { title: "Inclusive Sizing", text: "Fashion for every body — we celebrate all shapes and sizes." },
            { title: "Customer Love", text: "Your satisfaction is our obsession. We're with you every step." },
          ].map((v) => (
            <div key={v.title} className="text-center">
              <h3 className="font-serif text-xl text-brand-gold mb-3">{v.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="font-serif text-3xl mb-4">Ready to Find Your Look?</h2>
        <p className="text-brand-gray mb-8">Explore our latest collection and find pieces that speak your language.</p>
        <Link href="/shop" className="btn-primary inline-block">Shop Now</Link>
      </div>
    </div>
  );
}
