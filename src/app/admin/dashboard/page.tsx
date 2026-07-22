"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, Users, TrendingUp, Package, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { analyticsQuery, orderQueries, productQueries } from "@/lib/queries";
import { formatPrice } from "@/utils";
import Badge from "@/components/ui/Badge";
import { getOrderStatusColor } from "@/utils";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsQuery.get("30"),
      orderQueries.getAll(1, 10),
    ]).then(([analyticsRes, ordersRes]) => {
      setAnalytics(analyticsRes.data);
      setOrders(ordersRes.data || []);
      setLowStock(analyticsRes.data?.lowStockProducts || []);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Revenue", value: formatPrice(analytics?.summary?.totalRevenue || 0), icon: DollarSign, color: "from-green-400 to-emerald-500" },
    { label: "Total Orders", value: analytics?.summary?.totalOrders || 0, icon: ShoppingCart, color: "from-blue-400 to-indigo-500" },
    { label: "Total Visitors", value: analytics?.summary?.totalVisitors || 0, icon: Users, color: "from-purple-400 to-violet-500" },
    { label: "Conversion Rate", value: `${analytics?.summary?.conversionRate || 0}%`, icon: TrendingUp, color: "from-pink-400 to-rose-500" },
  ];

  const chartData = analytics?.analytics?.map((a: any) => ({
    date: new Date(a.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    revenue: a.revenue,
    orders: a.orders,
    visitors: a.visitors,
  })) || [];

  const COLORS = ["#EC4899", "#6C63FF", "#22C55E", "#F59E0B", "#EF4444"];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#EC4899" fill="url(#colorRevenue)" />
              <defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EC4899" stopOpacity={0.2} /><stop offset="95%" stopColor="#EC4899" stopOpacity={0} /></linearGradient></defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">Orders Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#6C63FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Orders + Low Stock */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.length === 0 ? <p className="text-gray-500 text-sm">No orders yet</p> :
              orders.slice(0, 5).map((order: any) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">{order.customerInfo?.name}</p>
                    <p className="text-xs text-gray-500">{order.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{formatPrice(order.total)}</p>
                    <Badge variant={order.orderStatus === "delivered" ? "success" : order.orderStatus === "cancelled" ? "danger" : "info"}>{order.orderStatus}</Badge>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /> Low Stock Alerts</h3>
          <div className="space-y-3">
            {lowStock.length === 0 ? <p className="text-gray-500 text-sm">All products well stocked</p> :
              lowStock.slice(0, 5).map((product: any) => (
                <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <Badge variant="danger">{product.stock} left</Badge>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}