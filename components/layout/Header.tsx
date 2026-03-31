"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineUser,
  HiMagnifyingGlass,
  HiBars3,
  HiXMark,
} from "react-icons/hi2";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/shop?filter=new" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-brand-black text-white text-xs text-center py-2 tracking-widest uppercase">
        Free shipping on orders over ₦100,000 &nbsp;|&nbsp; Shop the new collection
      </div>

      <header
        className={`sticky top-0 z-50 bg-white dark:bg-gray-900 transition-shadow duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu btn */}
            <div className="flex items-center justify-between">
            <button
              className="lg:hidden text-brand-black p-1"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <HiBars3 className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="font-serif text-2xl font-bold tracking-tight text-brand-black dark:text-white">
                5thJohnson<span className="text-brand-gold">.</span>
              </span>
            </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8 mt-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm tracking-widest uppercase text-brand-gray-dark hover:text-brand-black dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <span className="hidden lg:flex">
                <ThemeToggle />
              </span>

              <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
                <HiMagnifyingGlass className="w-5 h-5 text-brand-gray-dark hover:text-brand-black transition-colors" />
              </button>

              <Link href="/wishlist" aria-label="Wishlist">
                <HiOutlineHeart className="w-5 h-5 text-brand-gray-dark hover:text-brand-black transition-colors" />
              </Link>

              <Link href="/cart" className="relative" aria-label="Cart">
                <HiOutlineShoppingBag className="w-5 h-5 text-brand-gray-dark hover:text-brand-black transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {session ? (
                <div className="relative group">
                  <button className="flex items-center gap-1" aria-label="Account">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || ""}
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                    ) : (
                      <HiOutlineUser className="w-5 h-5 text-brand-gray-dark hover:text-brand-black" />
                    )}
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-brand-gray-light dark:border-gray-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-3 border-b border-brand-gray-light">
                      <p className="text-sm font-medium truncate">{session.user.name}</p>
                      <p className="text-xs text-brand-gray truncate">{session.user.email}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-brand-cream transition-colors">
                      My Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-brand-cream transition-colors">
                      My Orders
                    </Link>
                    <Link href="/wishlist" className="block px-4 py-2 text-sm hover:bg-brand-cream transition-colors">
                      Wishlist
                    </Link>
                    {session.user.role === "admin" && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-brand-gold hover:bg-brand-cream transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-brand-cream transition-colors border-t border-brand-gray-light"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" aria-label="Login">
                  <HiOutlineUser className="w-5 h-5 text-brand-gray-dark hover:text-brand-black transition-colors" />
                </Link>
              )}
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-4 animate-slide-down">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery) window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                }}
                className="flex border border-brand-black"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 text-sm focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="px-4 py-2 bg-brand-black text-white text-sm">
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl animate-slide-up overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <span className="font-serif text-xl font-bold dark:text-white">5thJohnson<span className="text-brand-gold">.</span></span>
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                    <HiXMark className="w-6 h-6 dark:text-white" />
                  </button>
                </div>
              </div>
              <nav className="p-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 px-2 text-sm tracking-widest uppercase border-b border-brand-gray-light hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              {session ? (
                <div className="p-4 border-t mt-4 space-y-2">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="block text-sm py-2 hover:text-brand-gold">My Profile</Link>
                  <Link href="/orders" onClick={() => setMobileOpen(false)} className="block text-sm py-2 hover:text-brand-gold">My Orders</Link>
                  {session.user.role === "admin" && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="block text-sm py-2 text-brand-gold">Admin Dashboard</Link>
                  )}
                  <button onClick={() => signOut()} className="text-sm text-red-500 py-2">Sign Out</button>
                </div>
              ) : (
                <div className="p-4 space-y-2 border-t mt-4">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-primary block text-center">Sign In</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-outline block text-center">Create Account</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
