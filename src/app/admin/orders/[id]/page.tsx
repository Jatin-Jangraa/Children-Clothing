"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import { orderQueries } from "@/lib/queries";
import { formatPrice, getOrderStatusColor } from "@/utils";
import { ORDER_STATUSES } from "@/constants";
import { toast } from "sonner";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderQueries.getById(params.id as string).then((res) => {
      setOrder(res.data);
    }).finally(() => setLoading(false));
  }, [params.id]);

  const handleStatusUpdate = async (status: string) => {
    try {
      await orderQueries.updateStatus(params.id as string, status);
      setOrder({ ...order, orderStatus: status });
      toast.success("Order status updated");
    } catch { toast.error("Failed to update"); }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-xl"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold">Order {order.orderId}</h1>
        <Badge variant={order.orderStatus === "delivered" ? "success" : "info"}>{order.orderStatus}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
          <h2 className="font-bold">Customer Info</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Name:</span> {order.customerInfo?.name}</p>
            <p><span className="text-gray-500">Phone:</span> {order.customerInfo?.phone}</p>
            <p><span className="text-gray-500">Email:</span> {order.customerInfo?.email}</p>
            <p><span className="text-gray-500">Address:</span> {order.customerInfo?.address}, {order.customerInfo?.city}, {order.customerInfo?.state} - {order.customerInfo?.pinCode}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
          <h2 className="font-bold">Payment</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Payment ID:</span> {order.paymentInfo?.paymentId || "N/A"}</p>
            <p><span className="text-gray-500">Status:</span> <Badge variant={order.paymentInfo?.status === "completed" ? "success" : "danger"}>{order.paymentInfo?.status}</Badge></p>
            <div className="border-t pt-2 mt-2 space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{order.shippingCharges === 0 ? "Free" : formatPrice(order.shippingCharges)}</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-1"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="font-bold mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
                {item.image && <Image src={item.image} alt="" width={64} height={64} className="w-full h-full object-cover" unoptimized />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="font-bold mb-4">Update Status</h2>
        <div className="flex items-end gap-4">
          <Select
            label="Order Status"
            value={order.orderStatus}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            options={ORDER_STATUSES.map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))}
          />
        </div>
      </div>
    </div>
  );
}