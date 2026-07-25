"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Package, ChevronRight, ChevronDown, ChevronUp, LogIn, ShoppingBag, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { orderQueries } from "@/lib/queries";
import { formatPrice } from "@/utils";
import type { IOrder } from "@/types";

const statusSteps = ["pending", "confirmed", "processing", "shipped", "delivered"];

const statusIcons: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google");
    }
  }, [status]);

  useEffect(() => {
    if (!session?.user?.id) return;
    setLoading(true);
    orderQueries
      .getByUserId(session.user.id, page)
      .then((res) => {
        setOrders(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [session?.user?.id, page]);

  if (status === "loading") {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-6">
            <LogIn className="h-10 w-10 text-pink-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Sign in to view your orders</h1>
          <p className="text-gray-500 mb-6">Track your orders, view order history, and manage returns.</p>
          <Button onClick={() => signIn("google")} size="lg">
            Sign In with Google
          </Button>
        </div>
      </Layout>
    );
  }

  const getStepIndex = (status: string) => {
    const idx = statusSteps.indexOf(status);
    return idx >= 0 ? idx : -1;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Orders</h1>
            <p className="text-sm text-gray-500">Track and manage your orders</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border animate-pulse">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-48" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <Link href="/shop">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order._id;
                const stepIdx = getStepIndex(order.orderStatus);
                const Icon = statusIcons[order.orderStatus] || Clock;

                return (
                  <motion.div
                    key={order._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {/* Order Header */}
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          order.orderStatus === "delivered"
                            ? "bg-green-100"
                            : order.orderStatus === "cancelled"
                            ? "bg-red-100"
                            : order.orderStatus === "shipped"
                            ? "bg-indigo-100"
                            : "bg-pink-100"
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            order.orderStatus === "delivered"
                              ? "text-green-600"
                              : order.orderStatus === "cancelled"
                              ? "text-red-600"
                              : order.orderStatus === "shipped"
                              ? "text-indigo-600"
                              : "text-pink-600"
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">{order.orderId}</p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            <span className="mx-1.5">·</span>
                            {order.items.length} item{order.items.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="font-bold text-sm sm:text-base">{formatPrice(order.total)}</p>
                          <Badge
                            variant={
                              order.orderStatus === "delivered" ? "success" :
                              order.orderStatus === "cancelled" ? "danger" :
                              order.orderStatus === "shipped" ? "info" :
                              "warning"
                            }
                          >
                            {order.orderStatus}
                          </Badge>
                        </div>
                        <div className="sm:hidden">
                          <Badge
                            variant={
                              order.orderStatus === "delivered" ? "success" :
                              order.orderStatus === "cancelled" ? "danger" :
                              order.orderStatus === "shipped" ? "info" :
                              "warning"
                            }
                          >
                            {order.orderStatus}
                          </Badge>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t px-4 sm:px-5 pb-5 pt-4 space-y-4">
                            {/* Mobile Price */}
                            <div className="sm:hidden flex justify-between items-center">
                              <span className="text-sm text-gray-500">Total</span>
                              <span className="font-bold">{formatPrice(order.total)}</span>
                            </div>

                            {/* Status Progress */}
                            {order.orderStatus !== "cancelled" && (
                              <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center justify-between relative">
                                  <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200" />
                                  <div
                                    className="absolute top-3 left-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 transition-all"
                                    style={{ width: `${stepIdx >= 0 ? (stepIdx / (statusSteps.length - 1)) * 100 : 0}%` }}
                                  />
                                  {statusSteps.map((step, idx) => {
                                    const StepIcon = statusIcons[step] || Clock;
                                    return (
                                      <div key={step} className="relative flex flex-col items-center z-10">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                          idx <= stepIdx
                                            ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white"
                                            : "bg-gray-200 text-gray-400"
                                        }`}>
                                          <StepIcon className="h-3 w-3" />
                                        </div>
                                        <span className="text-[10px] mt-1 text-gray-500 capitalize hidden sm:block">{step}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Items */}
                            <div className="space-y-3">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 relative">
                                    {(item.image || item.product?.thumbnail) && (
                                      <Image
                                        src={item.image || item.product?.thumbnail || ""}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                        unoptimized
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{item.name || item.product?.name}</p>
                                    <p className="text-xs text-gray-500">
                                      Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                                    </p>
                                  </div>
                                  <p className="font-bold text-sm flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                              ))}
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span>{formatPrice(order.subtotal)}</span>
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                  <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                                  <span>-{formatPrice(order.discount)}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-gray-500">Shipping</span>
                                <span>{order.shippingCharges === 0 ? "Free" : formatPrice(order.shippingCharges)}</span>
                              </div>
                              <div className="flex justify-between font-bold border-t pt-2">
                                <span>Total Paid</span>
                                <span>{formatPrice(order.total)}</span>
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-gray-50 rounded-xl p-4 text-sm">
                              <p className="font-medium mb-1">Shipping Address</p>
                              <p className="text-gray-600">
                                {order.customerInfo.name}, {order.customerInfo.address}, {order.customerInfo.city}, {order.customerInfo.state} - {order.customerInfo.pinCode}
                              </p>
                              <p className="text-gray-500 mt-1">{order.customerInfo.phone}</p>
                            </div>

                            {/* Payment Info */}
                            <div className="flex flex-wrap gap-3">
                              <div className="bg-gray-50 rounded-xl px-4 py-2 text-xs">
                                <span className="text-gray-500">Payment: </span>
                                <Badge variant={order.paymentInfo?.status === "completed" ? "success" : "warning"}>
                                  {order.paymentInfo?.status}
                                </Badge>
                              </div>
                              {order.paymentInfo?.paymentId && (
                                <div className="bg-gray-50 rounded-xl px-4 py-2 text-xs">
                                  <span className="text-gray-500">Payment ID: </span>
                                  <span className="font-mono">{order.paymentInfo.paymentId}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === i + 1
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
