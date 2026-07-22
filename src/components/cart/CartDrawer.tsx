"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCartStore } from "@/store";
import { formatPrice } from "@/utils";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { toast } from "sonner";

export default function CartDrawer() {
  const {
    items, isOpen, closeCart, removeItem, updateQuantity,
    getSubtotal, getDiscount, getShipping, getGst, getTotal,
    getItemCount, coupon, applyCoupon, removeCoupon,
  } = useCartStore();
  const [couponCode, setCouponCode] = useState("");

  const itemCount = getItemCount();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9998]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-pink-500" />
                <h2 className="font-bold text-lg">Your Cart</h2>
                <span className="text-sm text-gray-400">({itemCount} items)</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Button onClick={closeCart}>Continue Shopping</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.product._id}-${item.size}-${item.color}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 p-3 bg-gray-50 rounded-2xl"
                    >
                      <div className="w-20 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <Image
                          src={item.product.thumbnail || item.product.images?.[0]?.url || "/images/placeholder.jpg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-800 truncate">{item.product.name}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="font-bold text-pink-500 mt-1">{formatPrice(item.product.price)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-white rounded-lg border">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity - 1)}
                              className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </motion.button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity + 1)}
                              className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </motion.button>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              removeItem(item.product._id, item.size, item.color);
                              toast.success("Item removed");
                            }}
                            className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-5 space-y-3">
                {/* Coupon */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-400"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    if (couponCode.toUpperCase() === "WELCOME10") {
                      applyCoupon({ _id: "1", code: "WELCOME10", description: "10% off", discountType: "percentage", discountValue: 10, minimumOrder: 500, maximumDiscount: 200, usageLimit: 100, usedCount: 0, isActive: true, expiryDate: "2025-12-31", createdAt: "", updatedAt: "" });
                      toast.success("Coupon applied!");
                    } else {
                      toast.error("Invalid coupon");
                    }
                  }}>
                    Apply
                  </Button>
                </div>

                {/* Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(getSubtotal())}</span></div>
                  {coupon && <div className="flex justify-between text-green-600"><span>Discount ({coupon.code})</span><span>-{formatPrice(getDiscount())}</span></div>}
                  <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{getShipping() === 0 ? <span className="text-green-600">Free</span> : formatPrice(getShipping())}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">GST (12%)</span><span>{formatPrice(getGst())}</span></div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{formatPrice(getTotal())}</span>
                  </div>
                </div>

                <Link href="/checkout" onClick={closeCart}>
                  <Button fullWidth size="lg" className="group">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
