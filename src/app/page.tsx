import Layout from "@/components/layout/Layout";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ProductGrid from "@/components/home/ProductGrid";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CustomerReviews from "@/components/home/CustomerReviews";
import InstagramGallery from "@/components/home/InstagramGallery";
import CountdownTimer from "@/components/home/CountdownTimer";
import type { IProduct } from "@/types";

async function getProducts(params: string): Promise<IProduct[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/products?${params}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [heroProducts, featuredProducts, newArrivals, trendingProducts, bestSellers] = await Promise.all([
    getProducts("showInHero=true&limit=4"),
    getProducts("isFeatured=true&limit=8"),
    getProducts("isNewArrival=true&sort=newest&limit=8"),
    getProducts("isTrending=true&limit=8"),
    getProducts("isBestSeller=true&limit=8"),
  ]);

  // Use products with showInHero=true; if fewer than 4 exist, fallback to featured products so all 4 hero slots are populated
  const heroList: IProduct[] = heroProducts.length >= 4
    ? heroProducts.slice(0, 4)
    : [
        ...heroProducts,
        ...featuredProducts.filter((p) => !heroProducts.some((hp) => hp._id === p._id)),
      ].slice(0, 4);

  return (
    <Layout>
      <HeroBanner products={heroList} />
      <FeaturedCategories />
      <ProductGrid title="Featured Products" subtitle="Handpicked just for you" products={featuredProducts} viewAllHref="/shop?sort=popularity" />
      <CountdownTimer />
      <ProductGrid title="New Arrivals" subtitle="Fresh styles just dropped" products={newArrivals} viewAllHref="/shop?sort=newest" />
      <WhyChooseUs />
      <ProductGrid title="Trending Now" subtitle="What parents are loving" products={trendingProducts} viewAllHref="/shop?sort=popularity" />
      <CustomerReviews />
      <ProductGrid title="Best Sellers" subtitle="Most loved by our community" products={bestSellers} viewAllHref="/shop?sort=popularity" />
      <InstagramGallery />
    </Layout>
  );
}
