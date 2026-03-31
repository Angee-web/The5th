"use client";

import { motion } from "framer-motion";

export default function SisterBrand() {
  return (
    <section className="bg-[#f5f0eb] py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.3em] uppercase text-[#ec4899] font-semibold mb-4"
        >
          Sister Brand
        </motion.p>

        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center bg-[#e8e2d9]"
            style={{
              padding: "4px",
              background: "linear-gradient(#e8e2d9, #e8e2d9) padding-box, linear-gradient(135deg, #f97316, #ec4899, #a855f7) border-box",
              border: "4px solid transparent",
            }}
          >
            <div className="w-full h-full rounded-full bg-[#e8e2d9] flex items-center justify-center overflow-hidden relative">
              {/* Stripe decoration */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 8px, #1e3a5f22 8px, #1e3a5f22 10px)",
                }}
              />
              <div className="relative z-10 text-center px-2">
                <p className="font-bold text-[8px] leading-tight tracking-wider uppercase text-[#ec4899]">
                  Little<br />Serious<br />Women
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-serif text-3xl sm:text-4xl text-[#1a1a1a] mb-4"
        >
          Little Serious Women
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[#6b6b6b] text-base max-w-xl mx-auto mb-10 leading-relaxed"
        >
          The same bold, intentional style — now made for the little women in your life.
          Little Serious Women brings premium children&apos;s fashion crafted with the same love and care as 5thJohnson.
        </motion.p>

        <motion.a
          href={process.env.NEXT_PUBLIC_LSW_URL || "https://little-serious-women-d1b7-dusky.vercel.app/"}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="inline-block px-10 py-4 text-white text-sm tracking-widest uppercase font-semibold rounded-none transition-opacity hover:opacity-90"
          style={{
            background: "linear-gradient(90deg, #f97316, #ec4899, #a855f7)",
          }}
        >
          Shop Children&apos;s Collection →
        </motion.a>
      </div>
    </section>
  );
}
