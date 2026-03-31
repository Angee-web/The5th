import Link from "next/link";

export default function BrandStory() {
  return (
    <section className="py-24 bg-brand-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-4">Our Story</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
            Fashion with a
            <span className="italic text-brand-gold"> voice</span>.
          </h2>
          <p className="text-gray-400 leading-relaxed text-base mb-4">
            5thJohnson was born from a simple belief: every woman deserves to feel powerful in what she wears. We design and curate pieces that celebrate the modern Nigerian woman — her confidence, her culture, her spirit.
          </p>
          <p className="text-gray-400 leading-relaxed text-base mb-10">
            Every piece in our collection is thoughtfully selected for quality, fit, and style. Because when you look good, you move differently.
          </p>
          <Link href="/about" className="btn-gold inline-block">
            Read Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
