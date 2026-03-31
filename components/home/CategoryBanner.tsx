import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  { name: "Dresses", href: "/shop?category=dresses", image: "/images/categories/dresses.png", bg: "bg-rose-50" },
  { name: "Tops", href: "/shop?category=tops", image: "/images/categories/tops.png", bg: "bg-amber-50" },
  { name: "Sets", href: "/shop?category=sets", image: "/images/categories/sets.png", bg: "bg-stone-100" },
  { name: "Accessories", href: "/shop?category=accessories", image: "/images/categories/accessories.png", bg: "bg-zinc-100" },
];

export default function CategoryBanner() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <p className="section-subtitle">Browse By Category</p>
        <h2 className="section-title">Shop The Look</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="relative aspect-square overflow-hidden group"
          >
            <div className={`absolute inset-0 ${cat.bg}`} />
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-serif text-xl font-semibold text-white drop-shadow">
                {cat.name}
              </span>
              <span className="text-xs tracking-widest uppercase text-white/80 mt-2 group-hover:translate-x-1 transition-transform duration-200">
                Shop →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
