import Link from "next/link";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl font-bold mb-4">
              5thJohnson<span className="text-brand-gold">.</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Curated women's fashion for the bold, modern Nigerian woman. Style that speaks before you do.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/5thjohnson/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-brand-gold transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@5thjohnson" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-gray-400 hover:text-brand-gold transition-colors">
                <FaTiktok className="w-5 h-5" />
              </a>
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-gray-400 hover:text-brand-gold transition-colors">
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-4 text-gray-300">Shop</h4>
            <ul className="space-y-2">
              {["Dresses", "Tops", "Bottoms", "Outerwear", "Accessories", "Sets", "Sale"].map((cat) => (
                <li key={cat}>
                  <Link href={`/shop?category=${cat.toLowerCase()}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-4 text-gray-300">Information</h4>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "/about" },
                { label: "Lookbook", href: "/lookbook" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
                { label: "Size Guide", href: "/size-guide" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-4 text-gray-300">Help</h4>
            <ul className="space-y-2">
              {[
                { label: "FAQs", href: "/faq" },
                { label: "Shipping Policy", href: "/shipping" },
                { label: "Returns & Exchanges", href: "/returns" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} 5thJohnson. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">Payments secured by Paystack</p>
        </div>
      </div>
    </footer>
  );
}
