"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, ChevronRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { orderQueries } from "@/lib/queries";
import { formatPrice } from "@/utils";
import type { IOrder } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    orderQueries.getAll(page).then((res) => {
      setOrders(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    }).finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Items</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-500">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-500">No orders yet</td></tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium">{order.orderId}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium">{order.customerInfo?.name}</p>
                      <p className="text-xs text-gray-500">{order.customerInfo?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm">{order.items?.length || 0}</td>
                    <td className="px-5 py-4 text-sm font-bold">{formatPrice(order.total)}</td>
                    <td className="px-5 py-4"><Badge variant={order.paymentInfo?.status === "completed" ? "success" : order.paymentInfo?.status === "failed" ? "danger" : "warning"}>{order.paymentInfo?.status}</Badge></td>
                    <td className="px-5 py-4"><Badge variant={order.orderStatus === "delivered" ? "success" : order.orderStatus === "cancelled" ? "danger" : "info"}>{order.orderStatus}</Badge></td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/admin/orders/${order._id}`} className="p-2 hover:bg-gray-100 rounded-lg inline-flex">
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? "bg-pink-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}