"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/utils";
import type { IProduct } from "@/types";
import { useState, useEffect } from "react";

interface HeroBannerProps {
  products?: IProduct[];
}

export default function HeroBanner({ products = [] }: HeroBannerProps) {
  // Only display real products from database - NO dummy/placeholder images
  const validProducts = (products || []).filter(
    (p) => p && p.slug && (p.thumbnail || p.images?.[0]?.url)
  );

  const hasProducts = validProducts.length > 0;

  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.data))
      .catch(() => setSettings({}));
  }, []);

  const banner = settings?.heroBanner || {};
  const badgeText = banner.badgeText || "New Summer Collection 2026";
  const headingLine1 = banner.headingLine1 || "Dress Your";
  const headingLine2 = banner.headingLine2 || "Little Stars";
  const description =
    banner.description ||
    "Premium children's clothing that combines comfort, quality, and the latest trends. Make every moment special.";

  return (
    <section className="relative min-h-[70vh] sm:min-h-[85vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF1DC] via-[#F6E4D1] to-[#FFD8B1]" />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-[#FFD8B1]/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#E6A96A]/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#F6E4D1]/40 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 w-full">
        <div className={`grid ${hasProducts ? "lg:grid-cols-2" : "max-w-3xl"} gap-8 lg:gap-12 items-center`}>
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium text-[#B85C38] mb-4 sm:mb-6 shadow-sm border border-[#FFD8B1]"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {badgeText}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-4 sm:mb-6 text-[#4a3f35]"
            >
              {headingLine1}
              <span className="block bg-gradient-to-r from-[#D97757] via-[#E6A96A] to-[#B85C38] bg-clip-text text-transparent">
                {headingLine2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-[#6b5d52] mb-6 sm:mb-8 max-w-md leading-relaxed"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <Link href="/shop">
                <Button size="lg" className="group">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/shop?sort=newest">
                <Button variant="outline" size="lg">
                  New Arrivals
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-6 sm:gap-8 mt-8 sm:mt-12"
            >
              {[{ value: "10K+", label: "Happy Parents" }, { value: "500+", label: "Products" }, { value: "4.9", label: "Rating" }].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#D97757] to-[#B85C38] bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-[#6b5d52]">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Real Products Grid - Rendered ONLY if real products exist in the store */}
          {hasProducts && (
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Column 1 */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  {validProducts.slice(0, 2).map((product, i) => (
                    <Link
                      key={product._id || product.slug}
                      href={`/product/${product.slug}`}
                      className={`group relative block w-full ${
                        i === 0 ? "h-64 shadow-pink-200/50" : "h-40 shadow-purple-200/50"
                      } rounded-3xl overflow-hidden shadow-xl border border-white/60 transition-transform duration-300 hover:scale-[1.02]`}
                    >
                      <Image
                        src={product.thumbnail || product.images?.[0]?.url || ""}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="300px"
                        priority={i === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <p className="text-white text-xs font-semibold line-clamp-1">{product.name}</p>
                        <p className="text-[#FFD8B1] text-xs font-bold mt-0.5">{formatPrice(product.price)}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] text-white/90 mt-1 font-medium">
                          View details <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </motion.div>

                {/* Column 2 */}
                {validProducts.length > 2 && (
                  <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="space-y-4 pt-8"
                  >
                    {validProducts.slice(2, 4).map((product, i) => (
                      <Link
                        key={product._id || product.slug}
                        href={`/product/${product.slug}`}
                        className={`group relative block w-full ${
                          i === 0 ? "h-40 shadow-indigo-200/50" : "h-64 shadow-amber-200/50"
                        } rounded-3xl overflow-hidden shadow-xl border border-white/60 transition-transform duration-300 hover:scale-[1.02]`}
                      >
                        <Image
                          src={product.thumbnail || product.images?.[0]?.url || ""}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="300px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <p className="text-white text-xs font-semibold line-clamp-1">{product.name}</p>
                          <p className="text-[#FFD8B1] text-xs font-bold mt-0.5">{formatPrice(product.price)}</p>
                          <span className="inline-flex items-center gap-1 text-[11px] text-white/90 mt-1 font-medium">
                            View details <ExternalLink className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium text-[#B85C38] mb-4 sm:mb-6 shadow-sm border border-[#FFD8B1]"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              New Summer Collection 2026
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-4 sm:mb-6 text-[#4a3f35]"
            >
              Dress Your
              <span className="block bg-gradient-to-r from-[#D97757] via-[#E6A96A] to-[#B85C38] bg-clip-text text-transparent">
                Little Stars
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-[#6b5d52] mb-6 sm:mb-8 max-w-md leading-relaxed"
            >
              Premium children&apos;s clothing that combines comfort, quality, and the latest trends.
              Make every moment special.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <Link href="/shop">
                <Button size="lg" className="group">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/shop?sort=newest">
                <Button variant="outline" size="lg">
                  New Arrivals
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-6 sm:gap-8 mt-8 sm:mt-12"
            >
              {[
                { value: "10K+", label: "Happy Parents" },
                { value: "500+", label: "Products" },
                { value: "4.9", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#D97757] to-[#B85C38] bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-[#6b5d52]">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Real Products Grid - Rendered ONLY if real products exist in the store */}
          {hasProducts && (
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Column 1 */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  {validProducts.slice(0, 2).map((product, i) => (
                    <Link
                      key={product._id || product.slug}
                      href={`/product/${product.slug}`}
                      className={`group relative block w-full ${
                        i === 0 ? "h-64 shadow-pink-200/50" : "h-40 shadow-purple-200/50"
                      } rounded-3xl overflow-hidden shadow-xl border border-white/60 transition-transform duration-300 hover:scale-[1.02]`}
                    >
                      <Image
                        src={product.thumbnail || product.images?.[0]?.url || ""}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="300px"
                        priority={i === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <p className="text-white text-xs font-semibold line-clamp-1">{product.name}</p>
                        <p className="text-[#FFD8B1] text-xs font-bold mt-0.5">{formatPrice(product.price)}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] text-white/90 mt-1 font-medium">
                          View details <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </motion.div>

                {/* Column 2 */}
                {validProducts.length > 2 && (
                  <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="space-y-4 pt-8"
                  >
                    {validProducts.slice(2, 4).map((product, i) => (
                      <Link
                        key={product._id || product.slug}
                        href={`/product/${product.slug}`}
                        className={`group relative block w-full ${
                          i === 0 ? "h-40 shadow-indigo-200/50" : "h-64 shadow-amber-200/50"
                        } rounded-3xl overflow-hidden shadow-xl border border-white/60 transition-transform duration-300 hover:scale-[1.02]`}
                      >
                        <Image
                          src={product.thumbnail || product.images?.[0]?.url || ""}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="300px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <p className="text-white text-xs font-semibold line-clamp-1">{product.name}</p>
                          <p className="text-[#FFD8B1] text-xs font-bold mt-0.5">{formatPrice(product.price)}</p>
                          <span className="inline-flex items-center gap-1 text-[11px] text-white/90 mt-1 font-medium">
                            View details <ExternalLink className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
