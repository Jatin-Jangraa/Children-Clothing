"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { Breadcrumb } from "@/components/ui";
import { searchQuery } from "@/lib/queries";
import type { IProduct } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q) {
      setLoading(true);
      searchQuery(q)
        .then((res) => setResults(res.data || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }
  }, [q]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Search" }, { label: `"${q}"` }]} />
        <h1 className="text-3xl font-bold mt-6 mb-2">
          Search Results for &ldquo;{q}&rdquo;
        </h1>
        <p className="text-gray-500 mb-8">{results.length} products found</p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg">No products found for &ldquo;{q}&rdquo;</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {results.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
