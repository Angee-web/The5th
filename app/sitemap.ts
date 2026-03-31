import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://5thjohnson.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/lookbook`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const res = await fetch(`${BASE}/api/products?limit=100`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const productRoutes: MetadataRoute.Sitemap = (data.products || []).map(
        (p: { slug: string; createdAt: string }) => ({
          url: `${BASE}/shop/${p.slug}`,
          lastModified: new Date(p.createdAt),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        })
      );
      return [...staticRoutes, ...productRoutes];
    }
  } catch {}

  return staticRoutes;
}
