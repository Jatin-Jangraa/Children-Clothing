"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { formatPrice, calculateDiscount } from "@/utils";
import { useCartStore, useWishlistStore } from "@/store";
import { toast } from "sonner";
import type { IProduct } from "@/types";

interface ProductCardProps {
  product: IProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const discount = calculateDiscount(product.price, product.mrp);
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) {
      toast.error("Out of stock");
      return;
    }
    addItem({
      product,
      quantity: 1,
      size: product.sizes[0] || "",
      color: product.colors[0]?.name || "",
    });
    openCart();
    toast.success("Added to cart!");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product._id);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/product/${product.slug}`}>
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
          className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
        >
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
            <Image
              src={product.thumbnail || product.images?.[0]?.url || "/images/placeholder.jpg"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discount > 0 && (
                <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                  -{discount}%
                </span>
              )}
              {product.isNewArrival && (
                <span className="px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-lg">
                  NEW
                </span>
              )}
              {product.isBestSeller && (
                <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg">
                  BEST SELLER
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
                className={`p-2.5 rounded-full shadow-lg transition-colors ${
                  inWishlist ? "bg-pink-500 text-white" : "bg-white/90 text-gray-600 hover:text-pink-500"
                }`}
              >
                <Heart className="h-4 w-4" fill={inWishlist ? "currentColor" : "none"} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="p-2.5 rounded-full bg-white/90 shadow-lg text-gray-600 hover:text-pink-500 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Quick View */}
            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 text-center">
                <Eye className="h-4 w-4 inline mr-1" />
                <span className="text-xs font-semibold text-gray-700">Quick View</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-xs text-pink-400 font-medium mb-1">{product.brand}</p>
            <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 group-hover:text-pink-500 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.round(product.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">({product.reviewCount})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
              {discount > 0 && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.mrp)}</span>
              )}
            </div>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="flex items-center gap-1.5 mt-3">
                {product.colors.slice(0, 5).map((color) => (
                  <div
                    key={color.name}
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
                {product.colors.length > 5 && (
                  <span className="text-xs text-gray-400">+{product.colors.length - 5}</span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
