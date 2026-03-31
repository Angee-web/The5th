import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Lookbook | 5thJohnson",
  description: "Style inspiration from 5thJohnson. Browse our curated lookbook for outfit ideas.",
};

const LOOKS = [
  { id: 1, title: "The Power Suit", mood: "Corporate Chic", image: "/images/lookbook/look-1.png", bg: "bg-slate-100" },
  { id: 2, title: "Sunday Best", mood: "Effortlessly Elegant", image: "/images/lookbook/look-2.png", bg: "bg-rose-50" },
  { id: 3, title: "Night Out", mood: "Bold & Beautiful", image: "/images/lookbook/look-3.png", bg: "bg-zinc-900" },
  { id: 4, title: "Brunch Goals", mood: "Soft Luxe", image: "/images/lookbook/look-4.png", bg: "bg-amber-50" },
  { id: 5, title: "Beach Ready", mood: "Sun-Kissed", image: "/images/lookbook/look-5.png", bg: "bg-sky-50" },
  { id: 6, title: "Market Day", mood: "Vibrant & Joyful", image: "/images/lookbook/look-6.png", bg: "bg-orange-50" },
];

export default function LookbookPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <p className="section-subtitle">Style Inspiration</p>
        <h1 className="section-title text-4xl md:text-5xl">The Lookbook</h1>
        <p className="text-brand-gray mt-4 max-w-xl mx-auto text-sm">
          Every woman has a story. These are ours. Explore curated looks that capture the many moods of the 5thJohnson woman.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {LOOKS.map((look) => (
          <div
            key={look.id}
            className={`relative ${look.bg} aspect-[3/4] overflow-hidden group cursor-pointer`}
          >
            <Image
              src={look.image}
              alt={look.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute inset-x-0 bottom-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-xs tracking-widest uppercase mb-1 text-white/70">{look.mood}</p>
              <h3 className="font-serif text-2xl text-white">{look.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <p className="text-brand-gray text-sm mb-4">Tag us in your 5thJohnson looks</p>
        <p className="font-serif text-xl text-brand-gold">#5thJohnsonStyle</p>
      </div>
    </div>
  );
}
