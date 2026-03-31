import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://5thjohnson.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout", "/orders", "/profile", "/wishlist"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
