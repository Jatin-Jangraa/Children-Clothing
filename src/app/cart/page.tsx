"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store";
import Layout from "@/components/layout/Layout";

export default function CartPage() {
  const router = useRouter();
  const { openCart } = useCartStore();

  useEffect(() => {
    openCart();
    const timer = setTimeout(() => {
      router.back();
    }, 100);
    return () => clearTimeout(timer);
  }, [openCart, router]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Opening your cart...</p>
      </div>
    </Layout>
  );
}
