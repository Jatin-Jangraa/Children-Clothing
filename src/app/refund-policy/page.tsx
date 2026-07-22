"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Breadcrumb } from "@/components/ui";

export default function RefundPolicyPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Refund Policy" }]} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="py-12">
          <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>
          <div className="space-y-8 text-gray-600">
            <div><h2 className="text-xl font-bold text-gray-800 mb-3">Return Window</h2><p className="leading-relaxed">You can request a return within 7 days of receiving your order. Items must be unworn, unwashed, with original tags attached.</p></div>
            <div><h2 className="text-xl font-bold text-gray-800 mb-3">Refund Process</h2><p className="leading-relaxed">Once we receive and inspect the returned item, your refund will be processed within 5-7 business days. The refund will be credited to your original payment method.</p></div>
            <div><h2 className="text-xl font-bold text-gray-800 mb-3">Non-Returnable Items</h2><p className="leading-relaxed">Items that are worn, washed, damaged, or without original tags are not eligible for return. Sale items and accessories are also non-returnable.</p></div>
            <div><h2 className="text-xl font-bold text-gray-800 mb-3">Damaged or Defective Items</h2><p className="leading-relaxed">If you receive a damaged or defective item, please contact us within 48 hours with photos. We will arrange a free return and full refund.</p></div>
            <div><h2 className="text-xl font-bold text-gray-800 mb-3">Contact Us</h2><p className="leading-relaxed">For refund-related queries, contact us at hello@littlecloset.in or call +91 98765 43210.</p></div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
