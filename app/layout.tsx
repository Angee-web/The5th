import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import SessionProvider from "@/components/providers/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://5thjohnson.com"),
  title: {
    default: "5thJohnson — Women's Fashion",
    template: "%s | 5thJohnson",
  },
  description:
    "Discover curated women's fashion at 5thJohnson. Shop premium dresses, tops, and more with fast delivery across Nigeria.",
  keywords: ["women fashion", "Nigerian fashion", "5thJohnson", "dresses", "clothing", "style"],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://5thjohnson.com",
    siteName: "5thJohnson",
    title: "5thJohnson — Women's Fashion",
    description: "Curated women's fashion for the modern Nigerian woman.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "5thJohnson Fashion" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "5thJohnson — Women's Fashion",
    description: "Curated women's fashion for the modern Nigerian woman.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { fontFamily: "Inter, sans-serif", fontSize: "14px" },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
