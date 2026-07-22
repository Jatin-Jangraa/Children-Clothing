"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { Breadcrumb } from "@/components/ui";
import { productQueries, categoryQueries } from "@/lib/queries";
import type { IProduct, ICategory } from "@/types";

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      setLoading(true);
      categoryQueries.getBySlug(params.slug as string).then((res) => {
        const cat = res.data?.[0];
        if (cat) {
          setCategory(cat);
          productQueries.getAll({ category: cat._id, limit: 20 }).then((r) => {
            setProducts(r.data || []);
          }).finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      });
    }
  }, [params.slug]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Shop", href: "/shop" }, { label: category?.name || "Category" }]} />
        <h1 className="text-3xl font-bold mt-6 mb-8">{category?.name || "Category"}</h1>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20"><p className="text-gray-500 text-lg">No products in this category yet</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
