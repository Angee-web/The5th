"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] bg-brand-black flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-brand-gray-dark to-black opacity-90" />

      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-brand-gold/20" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full border border-brand-gold/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-4"
          >
            New Collection 2025
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6"
          >
            Dress the
            <br />
            <span className="italic text-brand-gold">boldest</span>
            <br />
            version of you.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-base mb-10 max-w-md leading-relaxed"
          >
            Curated women's fashion crafted for the modern Nigerian woman. Premium styles, delivered to your door.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/shop" className="btn-gold inline-block">
              Shop Now
            </Link>
            <Link href="/shop?filter=new" className="btn-outline border-white text-white hover:bg-white hover:text-brand-black inline-block">
              New Arrivals
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-8 bg-gradient-to-b from-brand-gold to-transparent animate-pulse" />
        <span className="text-[10px] text-gray-500 tracking-widest uppercase">Scroll</span>
      </div>
    </section>
  );
}
