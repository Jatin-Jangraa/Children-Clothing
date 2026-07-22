"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Breadcrumb } from "@/components/ui";
import { Truck, Clock, MapPin, Package } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Shipping Policy" }]} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="py-12">
          <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[{ icon: Truck, title: "Free Shipping", desc: "On all orders above ₹999" }, { icon: Clock, title: "Delivery Time", desc: "3-7 business days" }, { icon: MapPin, title: "Coverage", desc: "Pan India delivery" }, { icon: Package, title: "Packaging", desc: "Eco-friendly secure packaging" }].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div><h3 className="font-bold">{item.title}</h3><p className="text-sm text-gray-500">{item.desc}</p></div>
              </motion.div>
            ))}
          </div>
          <div className="space-y-6 text-gray-600">
            <p className="leading-relaxed">We ship all orders through our trusted courier partners. Once your order is dispatched, you will receive a tracking number via SMS and email.</p>
            <p className="leading-relaxed">A flat shipping fee of ₹99 is charged for orders below ₹999. Orders above ₹999 qualify for free shipping.</p>
            <p className="leading-relaxed">Delivery times may vary based on your location. Metro cities typically receive orders within 3-5 days, while other areas may take 5-7 business days.</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
