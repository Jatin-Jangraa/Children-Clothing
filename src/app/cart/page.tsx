"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import { useCartStore } from "@/store";
import { formatPrice } from "@/utils";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui";
import { useState } from "react";
import { toast } from "sonner";
import { couponQueries } from "@/lib/queries";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscount,
    getShipping,
    getGst,
    getTotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    try {
      const res = await couponQueries.validate(couponCode.trim(), getSubtotal());
      if (res.success && res.data) {
        applyCoupon(res.data);
        toast.success(`Coupon "${res.data.code}" applied!`);
        setCouponCode("");
      } else {
        toast.error(res.error || "Invalid coupon");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Invalid or expired coupon");
    } finally {
      setApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-pink-500" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-stone-800">Your Shopping Bag is Empty</h1>
          <p className="text-stone-500 max-w-md mx-auto mb-8">
            Looks like you haven&apos;t added any lovely outfits to your cart yet. Discover our collection of comfortable, stylish kids clothing!
          </p>
          <Link href="/shop">
            <Button size="lg" className="group">
              Explore Store <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
        <Breadcrumb items={[{ label: "Shopping Bag" }]} />

        <div className="flex items-center justify-between mt-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Shopping Bag</h1>
            <p className="text-sm text-stone-500 mt-1">
              {items.reduce((s, i) => s + i.quantity, 0)} item(s) in your bag
            </p>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-[#D97757] hover:underline hidden sm:flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Item List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={`${item.product._id}-${item.size}-${item.color}`}
                layout
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs flex gap-4 sm:gap-6 items-center"
              >
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-stone-100 shrink-0 relative">
                  <Image
                    src={item.product.thumbnail || item.product.images?.[0]?.url || "/images/placeholder.jpg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product.slug}`}>
                    <h3 className="font-semibold text-stone-900 text-sm sm:text-base hover:text-[#D97757] transition-colors truncate">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-stone-500 mt-1">
                    Size: <span className="font-medium text-stone-700">{item.size}</span>
                    {item.color && (
                      <>
                        <span className="mx-2">·</span>
                        Color: <span className="font-medium text-stone-700">{item.color}</span>
                      </>
                    )}
                  </p>
                  <p className="font-bold text-[#D97757] text-sm sm:text-base mt-2">
                    {formatPrice(item.product.price)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                  <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity - 1)}
                      className="p-1.5 hover:bg-stone-200/60 rounded-l-lg transition-colors text-stone-600"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-stone-800">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity + 1)}
                      className="p-1.5 hover:bg-stone-200/60 rounded-r-lg transition-colors text-stone-600"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.product._id, item.size, item.color)}
                    className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-5 sticky top-24">
              <h2 className="font-bold text-lg text-stone-900 border-b pb-4">Order Summary</h2>

              {/* Coupon Form */}
              <div>
                {coupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-emerald-800">{coupon.code}</p>
                        <p className="text-[10px] text-emerald-600">
                          {coupon.discountType === "percentage" ? `${coupon.discountValue}% Off` : `₹${coupon.discountValue} Off`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-semibold text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono uppercase focus:outline-none focus:border-[#D97757]"
                    />
                    <Button type="submit" size="sm" isLoading={applying}>
                      Apply
                    </Button>
                  </form>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2.5 text-sm pt-2">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">{formatPrice(getSubtotal())}</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(getDiscount())}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span>{getShipping() === 0 ? <span className="text-emerald-600 font-semibold">FREE</span> : formatPrice(getShipping())}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>GST (12%)</span>
                  <span>{formatPrice(getGst())}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-base text-stone-900">
                  <span>Total Amount</span>
                  <span className="text-lg text-[#D97757]">{formatPrice(getTotal())}</span>
                </div>
              </div>

              <Button
                fullWidth
                size="lg"
                onClick={() => router.push("/checkout")}
                className="group"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
