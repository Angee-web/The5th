import { Suspense } from "react";
import type { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop — 5thJohnson",
  description: "Browse all women's fashion at 5thJohnson. Filter by category, size, and price.",
};

export default function ShopPage() {
  return (
    <Suspense>
      <ShopClient />
    </Suspense>
  );
}
