import Layout from "@/components/layout/Layout";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ProductGrid from "@/components/home/ProductGrid";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CustomerReviews from "@/components/home/CustomerReviews";
import InstagramGallery from "@/components/home/InstagramGallery";
import CountdownTimer from "@/components/home/CountdownTimer";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import type { IProduct } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function getProducts(queryObj: {
  showInHero?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  sort?: string;
  limit?: number;
}): Promise<IProduct[]> {
  try {
    await connectDB();
    const filter: any = { isActive: true };
    if (queryObj.showInHero) filter.showInHero = true;
    if (queryObj.isFeatured) filter.isFeatured = true;
    if (queryObj.isNewArrival) filter.isNewArrival = true;
    if (queryObj.isTrending) filter.isTrending = true;
    if (queryObj.isBestSeller) filter.isBestSeller = true;

    let sortObj: any = { createdAt: -1 };
    if (queryObj.sort === "newest") sortObj = { createdAt: -1 };
    if (queryObj.sort === "popularity") sortObj = { reviewCount: -1 };

    const products = await Product.find(filter)
      .populate("category")
      .sort(sortObj)
      .limit(queryObj.limit || 8)
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (dbErr) {
    console.error("Direct DB fetch failed in getProducts, attempting fallback fetch:", dbErr);
    try {
      const baseUrl = getBaseUrl();
      const params = new URLSearchParams();
      Object.entries(queryObj).forEach(([k, v]) => params.append(k, String(v)));
      const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      return data.data || [];
    } catch (fetchErr) {
      console.error("Fallback fetch also failed in getProducts:", fetchErr);
      return [];
    }
  }
}

export default async function HomePage() {
  const [heroProducts, featuredProducts, newArrivals, trendingProducts, bestSellers] = await Promise.all([
    getProducts({ showInHero: true, limit: 4 }),
    getProducts({ isFeatured: true, limit: 8 }),
    getProducts({ isNewArrival: true, sort: "newest", limit: 8 }),
    getProducts({ isTrending: true, limit: 8 }),
    getProducts({ isBestSeller: true, limit: 8 }),
  ]);

  // Use only products flagged with showInHero; if fewer than 4 are specifically flagged, fallback to featured products that exist
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
