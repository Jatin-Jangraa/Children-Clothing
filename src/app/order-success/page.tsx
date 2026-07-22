"use client";

import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <CheckCircle className="h-12 w-12 text-green-500" />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h1 className="text-3xl font-bold mb-3">Order Placed Successfully!</h1>
          <p className="text-gray-500 mb-6">Thank you for shopping with Little Closet</p>
          {orderId && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium mb-8">
              <Package className="h-4 w-4 text-pink-500" />
              Order ID: {orderId}
            </div>
          )}
          <p className="text-sm text-gray-500 mb-8">
            You will receive a confirmation on your email and phone number.
            We&apos;ll notify you once your order is shipped.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop"><Button size="lg" className="group">Continue Shopping <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></Button></Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
