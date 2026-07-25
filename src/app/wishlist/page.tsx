"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { ProductCard } from "@/components/ui";
import { useWishlistStore } from "@/store";
import { productQueries } from "@/lib/queries";
import type { IProduct } from "@/types";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(
      items.map((id) => productQueries.getById(id).then((res) => res.data).catch(() => null))
    ).then((results) => {
      setProducts(results.filter((p): p is IProduct => p !== null));
    }).finally(() => setLoading(false));
  }, [items]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Wishlist</h1>
            <p className="text-sm text-gray-500">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-t-2xl" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-pink-300" />
            </div>
            <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you love to your wishlist</p>
            <Link href="/shop">
              <Button size="lg">
                <ShoppingBag className="h-5 w-5 mr-2" /> Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            <AnimatePresence>
              {products.map((product, i) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative group"
                >
                  <ProductCard product={product} index={i} />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      removeItem(product._id);
                    }}
                    className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}
