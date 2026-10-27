"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Check, Share2 } from "lucide-react";
import { formatPrice, calculateDiscount } from "@/utils";
import { useCartStore, useWishlistStore } from "@/store";
import ShareModal from "@/components/ui/ShareModal";
import { toast } from "sonner";
import type { IProduct } from "@/types";

interface ProductCardProps {
  product: IProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [isAdding, setIsAdding] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const discount = calculateDiscount(product.price, product.mrp);
  const inWishlist = isInWishlist(product._id);

  const primaryImage = product.thumbnail || product.images?.[0]?.url || "/images/placeholder.jpg";
  const secondaryImage = product.images?.[1]?.url;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    addItem({
      product,
      quantity: 1,
      size: product.sizes?.[0] || "",
      color: product.colors?.[0]?.name || "",
    });

    setTimeout(() => {
      setIsAdding(false);
      openCart();
      toast.success("Added to bag!");
    }, 250);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product._id);
    toast.success(inWishlist ? "Removed from wishlist" : "Saved to wishlist!");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShareOpen(true);
  };

  // Determine multi-age display
  const displayedAges =
    product.ageGroups && product.ageGroups.length > 0
      ? product.ageGroups
      : product.ageGroup
      ? [product.ageGroup]
      : [];

  // Single refined status badge (no stacked loud red, green, yellow bars)
  const badge = (() => {
    if (product.isNewArrival) return { text: "New", style: "bg-white/95 text-stone-800 border-stone-200/80 shadow-xs" };
    if (product.isBestSeller) return { text: "Bestseller", style: "bg-stone-900/90 text-white border-transparent" };
    if (product.isTrending) return { text: "Trending", style: "bg-white/95 text-stone-800 border-stone-200/80 shadow-xs" };
    return null;
  })();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
        className="group relative"
      >
        <Link href={`/product/${product.slug}`} className="block">
          <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200/70 hover:border-stone-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF8F5]">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                  secondaryImage ? "group-hover:opacity-0" : ""
                }`}
              />

              {/* Optional second image cross-fade on hover */}
              {secondaryImage && (
                <Image
                  src={secondaryImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              )}

              {/* Top Bar: Clean Badge + Actions (Share & Wishlist) */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
                {badge ? (
                  <span
                    className={`pointer-events-auto text-[10px] tracking-wider uppercase font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${badge.style}`}
                  >
                    {badge.text}
                  </span>
                ) : (
                  <div />
                )}

                {/* Floating Top Actions: Share & Wishlist */}
                <div className="flex items-center gap-1.5 pointer-events-auto">
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share product"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 bg-white/90 hover:bg-white text-stone-600 hover:text-[#D97757] border border-stone-200/60 shadow-sm backdrop-blur-md hover:scale-105 active:scale-95"
                    title="Share with image & link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleWishlist}
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-sm hover:scale-105 active:scale-95 ${
                      inWishlist
                        ? "bg-rose-50 text-rose-500 border border-rose-200"
                        : "bg-white/90 hover:bg-white text-stone-600 hover:text-stone-900 border border-stone-200/60"
                    }`}
                  >
                    <Heart
                      className="w-4 h-4 transition-transform active:scale-90"
                      fill={inWishlist ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>

              {/* Quick Add To Bag overlay button on hover (Desktop) */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full py-2.5 px-3 bg-stone-900/95 hover:bg-stone-900 text-white rounded-lg text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-lg backdrop-blur-md transition-all active:scale-[0.98]"
                >
                  {isAdding ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Quick Add</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-3.5 sm:p-4">
              {/* Brand & Rating row */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 truncate">
                  {product.brand || "Little Closet"}
                </p>
                {product.rating > 0 && (
                  <div className="flex items-center gap-1 shrink-0 text-stone-600">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-medium">{product.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Product Name */}
              <h3 className="font-medium text-stone-800 text-xs sm:text-sm line-clamp-1 mb-1.5 group-hover:text-[#D97757] transition-colors">
                {product.name}
              </h3>

              {/* Multi-Age Display Pill */}
              {displayedAges.length > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-[10px] text-stone-500 bg-stone-100 font-medium px-1.5 py-0.5 rounded">
                    Age: {displayedAges.slice(0, 2).join(", ")}
                    {displayedAges.length > 2 ? ` +${displayedAges.length - 2}` : ""}
                  </span>
                </div>
              )}

              {/* Price & Discount */}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-sm sm:text-base font-semibold text-stone-900">
                  {formatPrice(product.price)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-xs text-stone-400 line-through">
                      {formatPrice(product.mrp)}
                    </span>
                    <span className="text-[11px] font-semibold text-[#D97757]">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Bottom Row: Color Swatches & Mobile Quick Add */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                {/* Color Swatches */}
                {product.colors && product.colors.length > 0 ? (
                  <div className="flex items-center gap-1">
                    {product.colors.slice(0, 4).map((color) => (
                      <span
                        key={color.name}
                        className="w-3 h-3 rounded-full border border-stone-200 ring-1 ring-white"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                    {product.colors.length > 4 && (
                      <span className="text-[10px] text-stone-400 font-medium">
                        +{product.colors.length - 4}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-[11px] text-stone-400">
                    {product.sizes?.[0] ? `${product.sizes.length} sizes` : "In Stock"}
                  </span>
                )}

                {/* Mobile Quick Add Icon Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="sm:hidden p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
                  aria-label="Add to cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Share Modal with Image Preview */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        product={product}
      />
    </>
  );
}
