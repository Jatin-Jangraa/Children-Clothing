"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import type { IProduct } from "@/types";

interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: IProduct[];
  isLoading?: boolean;
  viewAllHref?: string;
  gradient?: boolean;
}

export default function ProductGrid({
  title,
  subtitle,
  products,
  isLoading = false,
  viewAllHref = "/shop",
  gradient = true,
}: ProductGridProps) {
  return (
    <section className="py-12 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8 sm:mb-12"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1.5 sm:mb-2 text-gray-900">
              {gradient ? (
                <>
                  {title.split(" ").map((word, i) => (
                    <span key={i}>
                      {i === title.split(" ").length - 1 ? (
                        <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                          {" " + word}
                        </span>
                      ) : (
                        word + " "
                      )}
                    </span>
                  ))}
                </>
              ) : (
                title
              )}
            </h2>
            {subtitle && <p className="text-gray-500 text-sm sm:text-base">{subtitle}</p>}
          </div>
          <Link
            href={viewAllHref}
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-pink-500 hover:text-pink-600 transition-colors group"
          >
            View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
        </div>

        {products.length === 0 && !isLoading && (
          <div className="text-center py-12 text-gray-500">
            No products available yet. Check back soon!
          </div>
        )}

        <div className="sm:hidden text-center mt-6 sm:mt-8">
          <Link href={viewAllHref} className="inline-flex items-center gap-1 text-sm font-semibold text-pink-500">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
