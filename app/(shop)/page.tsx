import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import SisterBrandBanner from "@/components/home/SisterBrandBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import CategoryBanner from "@/components/home/CategoryBanner";
import BrandStory from "@/components/home/BrandStory";
import SisterBrand from "@/components/home/SisterBrand";
import Newsletter from "@/components/home/Newsletter";

export const metadata: Metadata = {
  title: "5thJohnson — Women's Fashion",
  description: "Discover curated women's fashion at 5thJohnson. Premium dresses, tops, sets and more.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SisterBrandBanner />
      <CategoryBanner />
      <FeaturedProducts />
      <NewArrivals />
      <BrandStory />
      {/* <SisterBrand /> */}
      <Newsletter />
    </>
  );
}
