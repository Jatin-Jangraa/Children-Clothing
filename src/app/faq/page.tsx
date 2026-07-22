"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Breadcrumb } from "@/components/ui";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  { q: "What is the shipping policy?", a: "We offer free shipping on all orders above ₹999. For orders below ₹999, a flat shipping fee of ₹99 is charged. Orders are delivered within 3-7 business days." },
  { q: "What is the return policy?", a: "We offer a 7-day return policy on all unworn items with tags attached. To initiate a return, please contact our support team with your order ID." },
  { q: "How can I track my order?", a: "Once your order is shipped, you'll receive a tracking link via SMS and email. You can also check your order status on our website." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, debit cards, UPI, net banking, and wallets through our secure Razorpay payment gateway." },
  { q: "Are your products safe for children?", a: "Absolutely! All our products go through rigorous quality checks and are made from child-safe, non-toxic materials." },
  { q: "How do I find the right size?", a: "We provide a detailed size guide on each product page. Measure your child and refer to our size chart for the best fit." },
  { q: "Can I cancel my order?", a: "You can cancel your order within 24 hours of placing it. After that, if the order has been processed, cancellation may not be possible." },
  { q: "Do you offer gift wrapping?", a: "Yes! We offer gift wrapping for a small additional fee. You can select this option during checkout." },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "FAQ" }]} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-gray-500">Find answers to common questions</p>
        </motion.div>

        <div className="space-y-3 mb-16">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-semibold text-gray-800 pr-4">{faq.q}</span>
                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}>
                    <p className="px-5 pb-5 text-gray-600 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
