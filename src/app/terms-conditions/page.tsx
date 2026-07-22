"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Breadcrumb } from "@/components/ui";

export default function TermsPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Terms & Conditions" }]} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="py-12">
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-gray-500 mb-8">Last updated: January 2025</p>
          <div className="space-y-8 text-gray-600">
            <div><h2 className="text-xl font-bold text-gray-800 mb-3">General</h2><p className="leading-relaxed">By accessing and using Little Closet (littlecloset.in), you agree to be bound by these Terms and Conditions. We reserve the right to modify these terms at any time.</p></div>
            <div><h2 className="text-xl font-bold text-gray-800 mb-3">Products and Pricing</h2><p className="leading-relaxed">All product descriptions, images, and specifications are as accurate as possible. Prices are in Indian Rupees (INR) and include applicable GST. We reserve the right to change prices without prior notice.</p></div>
            <div><h2 className="text-xl font-bold text-gray-800 mb-3">Orders</h2><p className="leading-relaxed">By placing an order, you are making an offer to purchase. We reserve the right to cancel orders due to pricing errors, stock unavailability, or suspected fraud.</p></div>
            <div><h2 className="text-xl font-bold text-gray-800 mb-3">Payment</h2><p className="leading-relaxed">All payments are processed through Razorpay, a secure third-party payment gateway. We do not store any payment card details on our servers.</p></div>
            <div><h2 className="text-xl font-bold text-gray-800 mb-3">Intellectual Property</h2><p className="leading-relaxed">All content on this website, including text, images, logos, and graphics, is the property of Little Closet and protected by intellectual property laws.</p></div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
