"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  HiOutlineSquares2X2,
  HiOutlineShoppingBag,
  HiOutlineClipboardDocumentList,
  HiOutlineChartBarSquare,
  HiOutlineTicket,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineHome,
  HiOutlinePencilSquare,
  HiBars3,
  HiXMark,
} from "react-icons/hi2";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: HiOutlineSquares2X2 },
  { label: "Products", href: "/admin/products", icon: HiOutlineShoppingBag },
  { label: "Orders", href: "/admin/orders", icon: HiOutlineClipboardDocumentList },
  { label: "Analytics", href: "/admin/analytics", icon: HiOutlineChartBarSquare },
  { label: "Promo Codes", href: "/admin/promos", icon: HiOutlineTicket },
  { label: "Blog", href: "/admin/blog", icon: HiOutlinePencilSquare },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-800 flex items-center justify-between">
        <div>
          <Link href="/" className="font-serif text-xl font-bold">
            5thJohnson<span className="text-brand-gold">.</span>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden">
            <HiXMark className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${
                active ? "bg-brand-gold text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-800 space-y-1">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-800"
        >
          <HiOutlineHome className="w-4 h-4" />
          View Store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-red-400 transition-colors rounded hover:bg-gray-800"
        >
          <HiOutlineArrowLeftOnRectangle className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-brand-black text-white flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <Link href="/" className="font-serif text-lg font-bold">
          5thJohnson<span className="text-brand-gold">.</span>
        </Link>
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <HiBars3 className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 z-50 bg-brand-black text-white transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent onClose={() => setOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 bg-brand-black text-white flex-col flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
