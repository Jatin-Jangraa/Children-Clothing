"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, Grid3X3, List, X, ChevronDown } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { Breadcrumb } from "@/components/ui";
import { productQueries } from "@/lib/queries";
import { GENDERS, AGE_GROUPS, BRANDS, SORT_OPTIONS, COLORS } from "@/constants";
import type { IProduct } from "@/types";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    gender: searchParams.get("gender") || "",
    ageGroup: searchParams.get("ageGroup") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    color: searchParams.get("color") || "",
    sort: searchParams.get("sort") || "newest",
    search: searchParams.get("q") || "",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "12" };
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      const res = await productQueries.getAll(params as any);
      setProducts(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: "", gender: "", ageGroup: "", brand: "", minPrice: "", maxPrice: "", color: "", sort: "newest", search: "" });
    setPage(1);
  };

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== "newest").length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Shop", href: "/shop" }]} />

        <div className="flex items-center justify-between mt-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Shop</h1>
            <p className="text-gray-500 mt-1">{products.length} products found</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-xl text-sm hover:bg-gray-50">
              <SlidersHorizontal className="h-4 w-4" /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}>
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}>
                <List className="h-4 w-4" />
              </button>
            </div>
            <select
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-400"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : "hidden"} lg:block lg:static lg:w-64 flex-shrink-0`}>
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X className="h-5 w-5" /></button>
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-sm text-pink-500 mb-4 hover:text-pink-600">Clear All Filters</button>
            )}
            <div className="space-y-6">
              {/* Gender */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Gender</h4>
                {GENDERS.map((g) => (
                  <label key={g} className="flex items-center gap-2 py-1.5 cursor-pointer">
                    <input type="radio" name="gender" checked={filters.gender === g} onChange={() => updateFilter("gender", filters.gender === g ? "" : g)} className="accent-pink-500" />
                    <span className="text-sm capitalize">{g}</span>
                  </label>
                ))}
              </div>
              {/* Age */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Age Group</h4>
                {AGE_GROUPS.map((age) => (
                  <label key={age} className="flex items-center gap-2 py-1.5 cursor-pointer">
                    <input type="radio" name="age" checked={filters.ageGroup === age} onChange={() => updateFilter("ageGroup", filters.ageGroup === age ? "" : age)} className="accent-pink-500" />
                    <span className="text-sm">{age}</span>
                  </label>
                ))}
              </div>
              {/* Brand */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Brand</h4>
                {BRANDS.map((b) => (
                  <label key={b} className="flex items-center gap-2 py-1.5 cursor-pointer">
                    <input type="radio" name="brand" checked={filters.brand === b} onChange={() => updateFilter("brand", filters.brand === b ? "" : b)} className="accent-pink-500" />
                    <span className="text-sm">{b}</span>
                  </label>
                ))}
              </div>
              {/* Color */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => updateFilter("color", filters.color === c.name ? "" : c.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${filters.color === c.name ? "border-pink-500 scale-110" : "border-gray-200"}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
              {/* Price */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => updateFilter("minPrice", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-pink-400" />
                  <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => updateFilter("maxPrice", e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-pink-400" />
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className={`grid ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2"} gap-4 lg:gap-6`}>
                {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found</p>
                <button onClick={clearFilters} className="mt-4 text-pink-500 hover:text-pink-600 font-medium">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={`grid ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2"} gap-4 lg:gap-6`}>
                  {products.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${page === i + 1 ? "bg-pink-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
