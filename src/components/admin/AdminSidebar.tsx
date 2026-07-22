"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, FolderTree, Image, Video,
  Tags, ShoppingCart, Star, BarChart3, Settings, Users,
  ChevronLeft, Menu, FileText, Shield
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Banners", href: "/admin/banners", icon: Image },
  { label: "Videos", href: "/admin/videos", icon: Video },
  { label: "Coupons", href: "/admin/coupons", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Subscribers", href: "/admin/subscribers", icon: Users },
  { label: "Users", href: "/admin/users", icon: Shield },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setIsCollapsed(false)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-md">
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {isCollapsed && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setIsCollapsed(true)} />}

      <aside className={`fixed left-0 top-0 h-full bg-gray-900 text-white z-50 transition-all duration-300 ${isCollapsed ? "w-0 lg:w-64" : "w-64"} overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                <span className="font-bold text-sm">LC</span>
              </div>
              <span className="font-bold">Admin</span>
            </Link>
            <button onClick={() => setIsCollapsed(true)} className="lg:hidden p-1 hover:bg-gray-800 rounded-lg">
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsCollapsed(true)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isActive ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}>
                  <item.icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}