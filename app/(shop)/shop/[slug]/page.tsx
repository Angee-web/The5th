import { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${params.slug}`,
      { cache: "no-store" }
    );
    if (!res.ok) return { title: "Product | 5thJohnson" };
    const product = await res.json();
    return {
      title: `${product.name} | 5thJohnson`,
      description: product.description?.slice(0, 160),
      openGraph: {
        title: product.name,
        description: product.description?.slice(0, 160),
        images: [{ url: product.images?.[0] || "" }],
      },
    };
  } catch {
    return { title: "Product | 5thJohnson" };
  }
}

export default function ProductPage({ params }: Props) {
  return <ProductDetailClient slug={params.slug} />;
}
